import z from 'zod'

import { actions } from './actions'

export { actions }

export const configuration = {
  schema: z.object({
    spreadsheetId: z
      .string()
      .describe(
        'The ID of the Google Spreadsheet to interact with. This is the last part of the URL of your spreadsheet (ex: https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit#gid=0)'
      ),
    privateKey: z
      .string()
      .describe('The private key from the Google service account. You can get it from the downloaded JSON file.'),
    clientEmail: z
      .string()
      .email()
      .describe('The client email from the Google service account. You can get it from the downloaded JSON file.'),
  }),
}
