import { IntegrationDefinition } from '@botpress/sdk'
import { z } from 'zod'
import {
  addCustomerToCampaignInputSchema,
  addCustomerToListInputSchema,
  sendMassEmailCampaignInputSchema,
  addCustomerOutputSchema,
  sendMassEmailCampaignOutputSchema,
  getAllListsOutputSchema,
  getAllListsInputSchema,
  getAllCampaignsOutputSchema,
  getAllCampaignsInputSchema,
} from './src/misc/custom-schemas'
import { addCustomerToCampaignUi, addCustomerToListUi, sendMassEmailCampaignUi } from './src/misc/custom-uis'

const INTEGRATION_NAME = 'mailchimp'

export default new IntegrationDefinition({
  name: INTEGRATION_NAME,
  version: '0.2.0',
  readme: 'hub.md',
  icon: 'icon.svg',
  channels: {},
  configuration: {
    schema: z.object({
      apiKey: z.string().describe('Your API Key'),
      serverPrefix: z.string().describe('Your Server Prefix'),
    }),
  },
  actions: {
    addCustomerToCampaign: {
      title: 'Add Customer Profile to Campaign',
      description: "Adds a Customer's Profile to a Campaign",
      input: {
        schema: addCustomerToCampaignInputSchema,
        ui: addCustomerToCampaignUi,
      },
      output: {
        schema: addCustomerOutputSchema,
      },
    },
    addCustomerToList: {
      title: 'Add Customer Profile to List/Audience',
      description: "Add Customer's Profile to a List/Audience",
      input: {
        schema: addCustomerToListInputSchema,
        ui: addCustomerToListUi,
      },
      output: {
        schema: addCustomerOutputSchema,
      },
    },
    sendMassEmailCampaign: {
      title: 'Mass Mailing of the Campaign',
      description: 'Mass Mailing of the Campaign by its IDs',
      input: {
        schema: sendMassEmailCampaignInputSchema,
        ui: sendMassEmailCampaignUi,
      },
      output: {
        schema: sendMassEmailCampaignOutputSchema,
      },
    },
    getAllLists: {
      title: 'Get All Email Lists/Audiences',
      description: 'Get all available email lists/audiences',
      input: {
        schema: getAllListsInputSchema,
        ui: {
          count: {
            title: 'List count to retrieve',
          },
        },
      },
      output: {
        schema: getAllListsOutputSchema,
      },
    },
    getAllCampaigns: {
      title: 'Get All Campaigns',
      description: 'Get all available campaigns',
      input: {
        schema: getAllCampaignsInputSchema,
        ui: {
          count: {
            title: 'List count to retrieve',
          },
        },
      },
      output: {
        schema: getAllCampaignsOutputSchema,
      },
    },
  },
})
