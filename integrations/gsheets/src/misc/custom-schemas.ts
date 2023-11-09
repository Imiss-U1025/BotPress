import { IntegrationDefinition } from '@botpress/sdk'
import z from 'zod'

export type ActionDefinitions = NonNullable<IntegrationDefinition['actions']>
export type Schema = ActionDefinitions[string]['input']['schema']

const sheetsValues = z.array(z.array(z.any()))

export const getValuesInputSchema = z.object({
  range: z.string().describe('The A1 notation of the values to retrieve. (e.g. "Sheet1!A1:B2")'),
}) satisfies Schema

export const getValuesOutputSchema = z
  .object({
    range: z.string().nullable(),
    majorDimension: z.string().nullable(),
    values: sheetsValues.nullable(),
  })
  .partial()
  .passthrough() satisfies Schema

export const updateValuesInputSchema = z.object({
  range: z.string().describe('The A1 notation of the values to update. (e.g. "Sheet1!A1:B2")'),
  values: sheetsValues.describe(
    'The values to write to the range. This is an array of arrays, where each inner array represents a row/s of data.'
  ),
}) satisfies Schema

export const updateValuesOutputSchema = z
  .object({
    spreadsheetId: z.string().nullable(),
    updatedRange: z.string().nullable(),
    updatedRows: z.number().nullable(),
    updatedColumns: z.number().nullable(),
    updatedCells: z.number().nullable(),
  })
  .partial()
  .passthrough() satisfies Schema

export const appendValuesInputSchema = z.object({
  range: z.string().describe('The A1 notation of the range to append to. (e.g. "Sheet1!A1:B2")'),
  values: sheetsValues.describe(
    'The values to write to the range. This is an array of arrays, where each inner array represents a row/s of data.'
  ),
}) satisfies Schema

export const appendValuesOutputSchema = z
  .object({
    spreadsheetId: z.string().nullable(),
  })
  .partial()
  .passthrough() satisfies Schema

export const clearValuesInputSchema = z.object({
  range: z.string().describe('The A1 notation of the range to clear. (e.g. "Sheet1!A1:B2")'),
}) satisfies Schema

export const clearValuesOutputSchema = z
  .object({
    spreadsheetId: z.string().nullable(),
    clearedRange: z.string().nullable(),
  })
  .partial()
  .passthrough() satisfies Schema

export const getInfoInputSchema = z.object({
  fields: z
    .array(z.string())
    .describe(
      'The fields to include in the response when retrieving spreadsheet properties and metadata. This is a list of field names.'
    ),
}) satisfies Schema

export const getInfoOutputSchema = z
  .object({
    spreadsheetId: z.string().nullable(),
    spreadsheetUrl: z.string().nullable().optional(),
    dataSources: z.array(z.any()).optional(),
    dataSourceSchedules: z.array(z.any()).optional(),
    developerMetadata: z.array(z.any()).optional(),
    namedRanges: z.array(z.any()).optional(),
    properties: z.any().optional(),
    sheets: z.array(z.any()).optional(),
  })
  .partial()
  .passthrough() satisfies Schema

export const addSheetInputSchema = z.object({
  title: z.string().describe('The title of the new sheet to add to the spreadsheet.'),
}) satisfies Schema

export const addSheetOutputSchema = z
  .object({
    spreadsheetId: z.string().nullable(),
  })
  .partial()
  .passthrough() satisfies Schema
