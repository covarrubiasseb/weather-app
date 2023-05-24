const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../frontend/build/index.html'))
});

app.post('/api/weather', async (req, res) => {
  const { location } = req.body;
  
  // Use the Google Maps Geocoding API to convert the location to coordinates
  const geocodingResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_GEOCODING_API_KEY}`);
  
  const { lat, lng } = geocodingResponse.data.results[0].geometry.location;

  // Use the OpenWeather API to fetch weather data for the coordinates
  const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,alerts&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
  
  res.json(weatherResponse.data);
});

// Choose the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});