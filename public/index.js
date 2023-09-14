// Import the linkToken variable from server.js
const { linkToken } = require('../server.js');


// Now you can use the linkToken variable in index.js
console.log("Link Token in index.js:", linkToken);

/*
document.addEventListener("DOMContentLoaded", function () {
    const plaidLinkButton = document.getElementById("plaid-link-button");
  
    // Replace with your Plaid API keys
    const plaidPublicKey = 'link-sandbox-74ed4ffa-c02b-4377-a4b5-f580292163b4';
    const plaidEnv = 'sandbox'; // or 'production' for a live environment
  
    const config = {
      token: null, // You can use a server to generate a link_token or handle the client-side token creation.
      onSuccess: function (publicToken, metadata) {
        // Handle the success callback here
        console.log("Public Token:", "publicToken");
        console.log("Account ID:", metadata.account_id);
        // You can send the publicToken to your server for further processing.
      },
      onExit: function (err, metadata) {
        // Handle the exit callback here
        if (err != null) {
          console.error("Plaid Link exit with error:", err);
        }
        // Handle other exit scenarios if needed
      },
      // Customize Link appearance and behavior as needed
      // More options can be found in the Plaid documentation
      // https://plaid.com/docs/link/v2/integration-options/
    };
  
    // Initialize Plaid Link when the button is clicked
    plaidLinkButton.addEventListener("click", function () {
      const linkHandler = Plaid.create(config);
      linkHandler.open();
    });
  });
  */
