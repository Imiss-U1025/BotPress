# Google Sheet

## Description

This integration allows you to interact with Google Sheets with the following actions:

- getValues
- updateValues
- appendValues
- clearValues
- getInfoSpreadsheet
- addSheet

## Installation

1. Login to Google Cloud Console and create a new project.
1. Enable Google Sheets API for the project.
1. Create a service account for the project. This integration won't work with any other type of credentials.
1. Download the JSON credentials file and save it somewhere safe.
1. The downloaded JSON file contains a `client_email` field. Share your spreadsheet with this email address to give it access.
1. Install this integration in your bot with the following configuration:

   - `spreadsheetId`: The ID of the Google Spreadsheet to interact with. This is the last part of the URL of your spreadsheet (ex: https://docs.google.com/spreadsheets/d/**YOUR_SPREADSHEET_ID**/edit#gid=0)

   - `privateKey`: The private key from the Google service account. You can get it from the downloaded JSON file.

   - `clientEmail`: The client email from the Google service account. You can get it from the downloaded JSON file.
