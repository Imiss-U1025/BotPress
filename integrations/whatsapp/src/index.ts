import { sentry as sentryHelpers } from '@botpress/sdk-addons'
import { channel } from 'integration.definition'
import queryString from 'query-string'
import { WhatsAppAPI, Types } from 'whatsapp-api-js'
import { createConversationHandler as createConversation, startConversation } from './conversation'
import { handleIncomingMessage } from './incoming-message'
import * as card from './message-types/card'
import * as carousel from './message-types/carousel'
import * as choice from './message-types/choice'
import * as dropdown from './message-types/dropdown'
import * as outgoing from './outgoing-message'
import { WhatsAppPayload } from './whatsapp-types'
import * as bp from '.botpress'

export type IntegrationLogger = Parameters<bp.IntegrationProps['handler']>[0]['logger']

const { Text, Media, Location } = Types

const integration = new bp.Integration({
  register: async () => {},
  unregister: async () => {},
  actions: {
    startConversation: async ({ ctx, input, client, logger }) => {
      const conversation = await startConversation(
        {
          channel,
          phoneNumberId: input.senderPhoneNumberId || ctx.configuration.phoneNumberId,
          userPhone: input.userPhone,
          templateName: input.templateName,
          templateLanguage: input.templateLanguage,
          templateVariablesJson: input.templateVariablesJson,
        },
        { client, ctx, logger }
      )

      return {
        conversationId: conversation.id,
      }
    },
  },
  createConversation, // This is not needed for the `startConversation` action above, it's only for allowing bots to start conversations by calling `client.createConversation()` directly.
  channels: {
    channel: {
      messages: {
        text: async ({ payload, ...props }) => {
          await outgoing.send({ ...props, message: new Text(payload.text) })
        },
        image: async ({ payload, ...props }) => {
          await outgoing.send({
            ...props,
            message: new Media.Image(payload.imageUrl, false),
          })
        },
        markdown: async ({ payload, ...props }) => {
          await outgoing.send({
            ...props,
            message: new Text(payload.markdown),
          })
        },
        audio: async ({ payload, ...props }) => {
          await outgoing.send({
            ...props,
            message: new Media.Audio(payload.audioUrl, false),
          })
        },
        video: async ({ payload, ...props }) => {
          await outgoing.send({
            ...props,
            message: new Media.Video(payload.videoUrl, false),
          })
        },
        file: async ({ payload, ...props }) => {
          const extension = payload.fileUrl.includes('.') ? payload.fileUrl.split('.').pop()?.toLowerCase() ?? '' : ''
          const filename = 'file' + (extension ? `.${extension}` : '')

          await outgoing.send({
            ...props,
            message: new Media.Document(payload.fileUrl, false, payload.title, filename),
          })
        },
        location: async ({ payload, ...props }) => {
          await outgoing.send({
            ...props,
            message: new Location(payload.longitude, payload.latitude),
          })
        },
        carousel: async ({ payload, ...props }) => {
          await outgoing.sendMany({ ...props, generator: carousel.generateOutgoingMessages(payload) })
        },
        card: async ({ payload, ...props }) => {
          await outgoing.sendMany({ ...props, generator: card.generateOutgoingMessages(payload) })
        },
        dropdown: async ({ payload, logger, ...props }) => {
          await outgoing.sendMany({
            ...props,
            logger,
            generator: dropdown.generateOutgoingMessages({ payload, logger }),
          })
        },
        choice: async ({ payload, logger, ...props }) => {
          if (payload.options.length <= choice.INTERACTIVE_MAX_BUTTONS_COUNT) {
            await outgoing.sendMany({
              ...props,
              logger,
              generator: choice.generateOutgoingMessages({ payload, logger }),
            })
          } else {
            // If choice options exceeds the maximum number of buttons allowed by Whatsapp we use a dropdown instead to avoid buttons being split into multiple groups with a repeated message.
            await outgoing.sendMany({
              ...props,
              logger,
              generator: dropdown.generateOutgoingMessages({ payload, logger }),
            })
          }
        },
      },
    },
  },
  handler: async ({ req, client, ctx, logger }) => {
    logger.forBot().debug('Handler received request from Whatsapp with payload:', req.body)

    if (req.query) {
      const query = queryString.parse(req.query)

      const mode = query['hub.mode']
      const token = query['hub.verify_token']
      const challenge = query['hub.challenge']

      if (mode === 'subscribe') {
        if (token === ctx.configuration.verifyToken) {
          if (!challenge) {
            logger.forBot().warn('Returning HTTP 400 as no challenge parameter was received in query string of request')
            return {
              status: 400,
            }
          }

          return {
            body: typeof challenge === 'string' ? challenge : '',
          }
        } else {
          logger
            .forBot()
            .warn("Returning HTTP 403 as the Whatsapp token doesn't match the one in the bot configuration")
          return {
            status: 403,
          }
        }
      } else {
        logger.forBot().warn(`Returning HTTP 400 as the '${mode}' mode received in the query string isn't supported`)
        return {
          status: 400,
        }
      }
    }

    if (!req.body) {
      logger.forBot().warn('Handler received an empty body, so the message was ignored')
      return
    }

    try {
      const data = JSON.parse(req.body) as WhatsAppPayload

      for (const { changes } of data.entry) {
        for (const change of changes) {
          if (!change.value.messages) {
            // If the change doesn't contain messages we can ignore it, as we don't currently process other change types (such as statuses).
            continue
          }

          for (const message of change.value.messages) {
            const accessToken = ctx.configuration.accessToken
            const whatsapp = new WhatsAppAPI(accessToken)

            const phoneNumberId = change.value.metadata.phone_number_id

            await whatsapp.markAsRead(phoneNumberId, message.id)

            await handleIncomingMessage(message, change.value, client, logger)
          }
        }
      }
    } catch (e: any) {
      logger.forBot().error('Error while handling request:', e)
      logger.forBot().debug('Request body received:', req.body)
    }

    return
  },
})

export default sentryHelpers.wrapIntegration(integration, {
  dsn: bp.secrets.SENTRY_DSN,
  environment: bp.secrets.SENTRY_ENVIRONMENT,
  release: bp.secrets.SENTRY_RELEASE,
})
