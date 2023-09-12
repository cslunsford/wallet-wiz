//Path import
const path = require("path");
// Import Plaid SDK https://www.npmjs.com/package/plaid
const  { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

require('dotenv').config();

// Import Plaid credentials
const PLAIDCLIENT_ID = process.env.PLAIDCLIENT_ID;
const PLAIDSECRET = process.env.PLAIDSECRET;

// Import Express and create an Express app
const express = require("express");
const app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));





const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAIDCLIENT_ID,
      'PLAID-SECRET': PLAIDSECRET,
    },
  },
});

const client = new PlaidApi(configuration);




























// Define a default route
// Serve 'index.html' as the default route ('*')
// the star is a wildcard that will match any route not previously defined
//very important to run this route last in the code
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


















  