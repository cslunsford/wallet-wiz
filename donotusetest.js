const axios = require('axios');


function App() {
useEffect(() => {
    async function fetch() {
const response = await axios.post('/create_link_token');
console.log("response ", responsedata);
}
fetch();
}, []);
}


const axios = require('axios');

async function fetchData() {
  try {
    const response = await axios.post('http://localhost:3000/create_link_token');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchData();