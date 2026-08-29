const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];
const TOKEN_PATH = path.join(__dirname, '../tokens.json');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

function getAuthUrl() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' // Forces a new refresh token to be issued
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  return authUrl;
}

function getNewToken() {
  const authUrl = getAuthUrl();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oauth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('Token stored to', TOKEN_PATH);
    });
  });
}

function authorize() {
  return new Promise((resolve, reject) => {
    try {
      if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oauth2Client.setCredentials(token);
        resolve(oauth2Client);
      } else {
        console.log('No token found. Please run auth flow.');
        getNewToken();
        reject(new Error("Tokens not generated yet."));
      }
    } catch (error) {
      reject(error);
    }
  });
}

// If run directly, initiate auth flow
if (require.main === module) {
  if (!fs.existsSync(TOKEN_PATH)) {
      getNewToken();
  } else {
      console.log('Tokens already exist at', TOKEN_PATH);
  }
}

module.exports = {
  authorize,
  oauth2Client
};
