//Path import
const path = require("path");
//store environment variables in .env without exposing them in the code
require('dotenv').config();


// Import Express and create an Express app
const express = require("express");
const app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));





// Import Plaid SDK https://www.npmjs.com/package/plaid //
const  { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
// Import Plaid credentials from .env file
const PLAIDCLIENT_ID = process.env.PLAIDCLIENT_ID;
const PLAIDSECRET = process.env.PLAIDSECRET;
// Create a new instance of the Plaid client
const plaidclient = new PlaidApi(Configuration);


// Initialize the Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAIDCLIENT_ID,
      'PLAID-SECRET': PLAIDSECRET,
    },
  },
});

// Create a new link_token from PLAID -- Step 1
app.post('/create_link_token', async function (request, response) {
  // Get the client_user_id by searching for the current user
  // const user = await User.find(...);
  // const clientUserId = user.id;
  const plaidrequest = {
    user: {
      // This should correspond to a unique id for the current user.
      //***************THIS USER ID COMES FROM THE MYSQL DB ********//
      client_user_id: "user",
    },
    client_name: 'Plaid Test App',
    products: ['auth'],
    language: 'en',
    redirect_uri: 'http://localhost:3000/',
    country_codes: ['US'],
  };
  try {
    const createTokenResponse = await plaidclient.linkTokenCreate(plaidrequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    // handle error message
    response.status(500).send("linkTokenCreate failed");
  }
});




























// Define a default route
// Serve 'index.html' as the default route ('*')
// the star is a wildcard that will match any route not previously defined
//very important to run this route last in the code
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


















  