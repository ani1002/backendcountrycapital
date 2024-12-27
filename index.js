const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT|| 3000;

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

// Load the country data from the JSON file
const countriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data1.json')));
let length =  countriesData.length;
// Helper function to get random records
const getRandomRecords = (count) => {
  const shuffled = [...countriesData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Endpoint to get 5 or 10 random countries and capitals
app.get('/api/random-countries', (req, res) => {
  const count = parseInt(req.query.count) || 5; // Default to 5 if no count is provided
  const randomCountries = getRandomRecords(count);
  res.json(randomCountries);
});


app.get('/api/get-all', (req, res) => {
  const randomCountries = getRandomRecords(length);
  res.json(randomCountries);
});


// Endpoint to get countries by region
app.get('/api/countries-regionspecific', (req, res) => {
  const region = req.query.region; // Extract region from query parameter
  const number = parseInt(req.query.number, 10);
  console.log(number);
  let reg = region.toLowerCase();
  if(reg!="asia" && reg!="africa" && reg!="europe" && reg!="northamerica" && reg!= "southamerica" && reg!="oceania") {
    return res.status(404).json({ message: "No countries found for the specified region." });
  }
  // Filter data by region
  const filteredCountries = countriesData.filter(country => country.region.toLowerCase() === region.toLowerCase());

  if (filteredCountries.length === 0) {
      return res.status(404).json({ message: "No countries found for the specified region." });
  }

  res.json(filteredCountries); // Send the filtered data
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
