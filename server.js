//Path import
const path = require("path");
//store environment variables in .env without exposing them in the code
require('dotenv').config();

const cors = require("cors");
const bodyParser = require("body-parser");

// Import Express and create an Express app
const express = require("express");
const app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));


//Axios
const axios = require('axios');


// Import Plaid SDK https://www.npmjs.com/package/plaid //
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
// Import Plaid credentials from .env file
const PLAIDCLIENT_ID = process.env.PLAIDCLIENT_ID;
const PLAIDSECRET = process.env.PLAIDSECRET;
// Create a new instance of the Plaid client



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
//this has to come after the configuration / plaid client init
const plaidClient = new PlaidApi(configuration);

// Create a new link_token from PLAID -- Step 1
app.post('/create_link_token', async function (request, response) {
  const plaidRequest = {
      user: {
          client_user_id: 'user',
      },
      client_name: 'Plaid Test App',
      products: ['auth'],
      language: 'en',
      redirect_uri: 'http://localhost:3000/',
      country_codes: ['US'],
  };
  try {
      const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
      response.json(createTokenResponse.data);
  } catch (error) {
      response.status(500).send("failure");
      console.error('Plaid API Error:', error.response ? error.response.data : error.message);
      // handle error
  }
});





app.post("/auth", async function(request, response) {
  try {
      const access_token = request.body.access_token;
      const plaidRequest = {
          access_token: access_token,
      };
      const plaidResponse = await plaidClient.authGet(plaidRequest);
      response.json(plaidResponse.data);
  } catch (e) {
      response.status(500).send("failed");
  }
});

app.post('/exchange_public_token', async function (
  request,
  response,
  next,
) {
  const publicToken = request.body.public_token;
  try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
          public_token: publicToken,
      });
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      const accessToken = plaidResponse.data.access_token;
      response.json({ accessToken });
  } catch (error) {
      response.status(500).send("failed");
  }
});



async function fetchData() {
  try {
    const response = await axios.post('http://localhost:3000/create_link_token');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchData();














// Define a default route
// Serve 'index.html' as the default route ('*')
// the star is a wildcard that will match any route not previously defined
//very important to run this route last in the code
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


















  