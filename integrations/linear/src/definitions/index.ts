import { IntegrationDefinitionProps, messages } from '@botpress/sdk'
import { z } from 'zod'
import { issueSchema } from './schemas'

export { actions } from './actions'
export { events } from './events'
export { states } from './states'
export { UserProfile } from './schemas'

export const configuration = {
  identifier: {
    linkTemplateScript: 'linkTemplate.vrl',
  },
  schema: z.object({}),
} satisfies IntegrationDefinitionProps['configuration']

export const channels = {
  issue: {
    messages: messages.defaults,
    message: {
      tags: {
        id: {},
      },
    },
    conversation: {
      creation: {
        enabled: true,
        requiredTags: [],
      },
      tags: {
        id: {},
      },
    },
  },
} satisfies IntegrationDefinitionProps['channels']

export const user = {
  tags: {
    id: {},
  },
} satisfies IntegrationDefinitionProps['user']

export const entities = {
  issue: {
    title: 'Issue',
    description: 'A linear issue',
    schema: issueSchema,
  },
} satisfies IntegrationDefinitionProps['entities']
