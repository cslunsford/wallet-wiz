//Path import
const path = require("path");
//store environment variables in .env without exposing them in the code
require('dotenv').config();

const cors = require("cors");
const bodyParser = require("body-parser");

// Import Express and create an Express app
const express = require("express");
const app = express();
const session = require('express-session');
const exphbs = require('express-handlebars');
const userRoutes = require('./controllers/userController');
const authRoutes = require('./controllers/authController');
const financeRoutes = require('./controllers/financeController');
const sequelize = require('./config/config');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const hbs = exphbs.create();

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view-engine', hbs);


app.use(cors());
//app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(userRoutes);
app.use(authRoutes);
app.use(financeRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port 3000");
  })
});
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

let linkToken; //declare a variable to store the link token to export it to another file


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
    console.error('Error:', error.message);
      response.status(500).send("failure");
      console.error('Plaid API Error:', error.response ? error.response.data : error.message);
      // handle error
  }
});

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
      const accessToken = plaidResponse.data.access_token;
      const user = await User.findByPk(req.session.user_id);

      user.access_token = accessToken;
      await user.save();
      console.log('Miracle_access_token:', accessToken);
      response.json({ accessToken });
  } catch (error) {
      response.status(500).send("failed");
  }
});




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


















  