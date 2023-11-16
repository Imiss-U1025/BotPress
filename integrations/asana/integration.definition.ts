import { IntegrationDefinition } from '@botpress/sdk'
import { sentry as sentryHelpers } from '@botpress/sdk-addons'

import { INTEGRATION_NAME } from './src/const'
import { configuration, states, user, channels, actions } from './src/definitions'

export default new IntegrationDefinition({
  name: INTEGRATION_NAME,
  version: '0.2.0',
  title: 'Asana',
  readme: 'hub.md',
  description: 'Asana integration for Botpress',
  icon: 'icon.svg',
  configuration,
  channels,
  user,
  actions,
  states,
  secrets: sentryHelpers.COMMON_SECRET_NAMES,
})
