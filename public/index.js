console.log('index.html loaded');
const jQuery = $;
console.log("ready!");


(async function ($) {
  console.log('index.js loaded');
  var handler = Plaid.create({
    // Create a new link_token to initialize Link
    token: (await $.post('/create_link_token')).link_token,
    //receivedRedirectUri: window.location.href,
    onLoad: function () {
      // Optional, called when Link loads
    },
    onSuccess: function (public_token, metadata) {
      // Send the public_token to your app server.
      // The metadata object contains info about the institution the
      // user selected and the account ID or IDs, if the
      // Account Select view is enabled.
      console.log(public_token);
      $.post('/exchange_public_token', {
        public_token: public_token,
      });
    },
    onExit: function (err, metadata) {
      // The user exited the Link flow.
      if (err != null) {
        // The user encountered a Plaid API error prior to exiting.
      }
      // metadata contains information about the institution
      // that the user selected and the most recent API request IDs.
      // Storing this information can be helpful for support.
    },
    onEvent: function (eventName, metadata) {
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
  $('#link-button').on('click', function (e) {
    handler.open();
    console.log('Link button clicked');
  });
})(jQuery);


if ($('#fetchTransactionsButton')) {
  $('#fetchTransactionsButton').on('click', async () => {
    try {
      const response = await fetch('/transactionssync', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const transactions = data.added;
        displayTransactions(transactions);
        console.log(transactions);
      } else {
        console.error('Failed to fetch transactions');
      }
    } catch (err) {
      console.error(err);
    }
  });
}

function displayTransactions(transactions) {
  $('#transactionContainer').empty();
  transactions.forEach((transaction) => {
    const transactionHtml = `<div class="transactionDisplays">
    <div class="transactionDescriptionAlign>
    <h3 class="headerText transactionCompany">Merchant: ${transaction.merchant_name}</h3>
    <h3 class="headerText transactionDate">Date: ${transaction.date}</h3>
    </div>
    <div class="transactionAmountAlign">
    <h3 class="headerText transactionAmount">Amount: ${transaction.amount} ${transaction.iso_currency_code}</h3>
    </div>
  </div>`;
    $('#transactionContainer').append(transactionHtml);
  });
};

if ($('#fetchAccountsButton')) {
  $('#fetchAccountsButton').on('click', async () => {
    try {
      const response = await fetch('/accounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        displayAccountData(data);
      } else {
        console.error('Failed to fetch account data.');
      }
    } catch (err) {
      console.error(err);
    }
  })
}

function displayAccountData(data) {
  $('#balanceContainer').empty();
  data.accounts.forEach((account) => {
    const accountHtml = `<div class="balanceBoxes">
    <h4 class="headerText balanceHeaders" id="savings">Account Name: ${account.name}</h4>
    <p class="card-text" id="savings">Balance: ${account.balances.current} ${account.balances.iso_currency_code}</p>
  </div>`;
    $('#balanceContainer').append(accountHtml);
  });
};
//