import express from "express";
import { google } from "googleapis";

const app = express();
app.use(express.json())

async function getAuthSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const client = await auth.getClient();
  const spreadsheetId = '1w1JYHLY0Wns5HCwudEcmX0soznMosIZL5Y1zY81oyg0'
  const googleSheet = google.sheets('v4')
  return {
    auth,
    client,
    googleSheet,
    spreadsheetId,    
  }
}

app.get('/metadata', async (request, response) => {
  const { googleSheet, auth, spreadsheetId } = await getAuthSheets()

  const metadata = await googleSheet.spreadsheets.get({
    auth,
    spreadsheetId
  })

  return response.json(metadata.data)
})

app.get('/getRows', async (request, response) => {
  const { googleSheet, auth, spreadsheetId } = await getAuthSheets()

  const getRows = await googleSheet.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: 'Página1',
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING'
  })

  return response.json(getRows.data)
})

app.post('/addRow', async (request, response) => {
  const { auth, googleSheet, spreadsheetId } = await getAuthSheets();

  const { values } = request.body

  const row = await googleSheet.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'Página1',
    valueInputOption: 'UNFORMATTED_VALUE',
    requestBody: {
      values
    }
  })
  return response.json(row).status(201);
})

app.put('/updateRow', async (request, response) => {
  const { auth, googleSheet, spreadsheetId } = await getAuthSheets();

  const { values } = request.body

  const row = await googleSheet.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: 'Página1!A2:C2',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values
    }
  })
  return response.json(row.data).status(201);
})


app.listen(3333, () => console.log('listening on port 3333'));
