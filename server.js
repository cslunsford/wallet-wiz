//Path import
const path = require("path");

const express = require("express");
const app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));

// Define a default route
// Serve 'index.html' as the default route ('*')
// the star is a wildcard that will match any route not previously defined
//very important to run this route last in the code
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


















  