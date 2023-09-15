console.log('index.html loaded');
const jQuery = $;
    console.log( "ready!" );

(async function($) {
    console.log('index.js loaded');
    var handler = Plaid.create({
      // Create a new link_token to initialize Link
      token: (await $.post('/create_link_token')).link_token,
      //receivedRedirectUri: window.location.href,
      onLoad: function() {
        // Optional, called when Link loads
      },
      onSuccess: function(public_token, metadata) {
        // Send the public_token to your app server.
        // The metadata object contains info about the institution the
        // user selected and the account ID or IDs, if the
        // Account Select view is enabled.
        console.log(public_token);
        $.post('/exchange_public_token', {
          public_token: public_token,
        });
      },
      onExit: function(err, metadata) {
        // The user exited the Link flow.
        if (err != null) {
          // The user encountered a Plaid API error prior to exiting.
        }
        // metadata contains information about the institution
        // that the user selected and the most recent API request IDs.
        // Storing this information can be helpful for support.
      },
      onEvent: function(eventName, metadata) {
        // Optionally capture Link flow events, streamed through
        // this callback as your users connect an Item to Plaid.
        // For example:
        // eventName = "TRANSITION_VIEW"
        // metadata  = {
        //   link_session_id: "123-abc",
        //   mfa_type:        "questions",
        //   timestamp:       "2017-09-14T14:42:19.350Z",
        //   view_name:       "MFA",
        // }
      }
    });
    $('#link-button').on('click', function(e) {
      handler.open();
      console.log('Link button clicked');
    });
})(jQuery);


// Now you can use the linkToken variable in index.js
//console.log("Link Token in index.js:", linkToken);

/*
document.addEventListener("DOMContentLoaded", function () {
    const plaidLinkButton = document.getElementById("plaid-link-button");
  
    // Replace with your Plaid API keys
    const plaidPublicKey = 'linkToken';
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
