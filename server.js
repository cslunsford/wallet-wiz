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
//app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());

//Axios
const axios = require('axios');


// Import Plaid SDK https://www.npmjs.com/package/plaid //
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
// Import Plaid credentials from .env file
const PLAIDCLIENT_ID = process.env.PLAIDCLIENT_ID;
const PLAIDSECRET = process.env.PLAIDSECRET;
// Create a new instance of the Plaid client
let accessToken;


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
const { TransactionsSyncRequest } = require('plaid');
let linkToken; //declare a variable to store the link token to export it to another file


//PLAID Create a new link_token -- Step 1
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
    console.error('Error:', error.message);
      response.status(500).send("failure");
      console.error('Plaid API Error:', error.response ? error.response.data : error.message);
      // handle error
  }
});

//PLAID Exchange public_token for access_token -- Step 2
app.post('/exchange_public_token', async function (
  request,
  response,
  next,
) {
  const publicToken = request.body.public_token;
  console.log(request.body);
  try {
      const plaidResponse = await plaidClient.itemPublicTokenExchange({
          public_token: publicToken,
      });
      // These values should be saved to a persistent database and
      // associated with the currently signed-in user
      accessToken = plaidResponse.data.access_token;
      console.log('Miracle_access_token:', accessToken);
      response.json({ accessToken });
  } catch (error) {
      response.status(500).send("failed");
  }
});
// PLAID Pull bank accounts -- Step 3
app.get('/accounts', async function (request, response, next) {
  try {
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    prettyPrintResponse(accountsResponse);
    response.json(accountsResponse.data);
  } catch (error) {
    console.error('Error:', error.message);
      response.status(500).send("failure");
      console.error('Plaid API Error:', error.response ? error.response.data : error.message);
  }
});
function prettyPrintResponse(data) {
  // Implement the function logic here
  console.log(data); // log the data to the console
}

//PLAID Pull bank transactions -- Step 3
app.get('/transactionssync', async function (request,response,next) {
      try {
        const response = await plaidClient.transactionsSync({ 
          access_token: "access-sandbox-2b217495-875c-453d-8aef-879a627940b0",
          //"start_date": "2023-04-14",
            //"end_date": "2023-04-17",
            "count": 50
        });
     console.log("Synching Transactions")
       console.log(response.data);
             } catch (error) {
        console.error('Error:', error.message);
          response.status(500).send("failure");
          console.error('Plaid API Error:', error.response ? error.response.data : error.message);
    }
  });
 
  function prettyPrintResponse(data) {
    // Implement the function logic here
    console.log(data); // log the data to the console
  }


async function fetchData() {
  try {
    const response = await axios.post('http://localhost:3000/create_link_token');
    console.log('Response:', response.data);
    linkToken = response.data.link_token; // Extract link_token to variable linkToken
    console.log("Link Token in server.js:", linkToken);
    
   } catch (error) {
    console.error('Error:', error.message);
  }
}

async function fetchAccounts() {
  try {
    const response = await axios.post('http://localhost:3000/accounts');
    console.log('Response:', response.data);
    linkToken = response.data.link_token; // Extract link_token to variable linkToken
    console.log("accounts in server.js:", response.data.accounts);
    
   } catch (error) {
    console.error('Error Accounts not working', error.message);
  }
}


fetchData();




app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});









// Define a default route
// Serve 'index.html' as the default route ('*')
// the star is a wildcard that will match any route not previously defined
//very important to run this route last in the code
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


















  