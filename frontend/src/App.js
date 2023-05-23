import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [location, setLocation] = useState('');
  const [hasSelected, setHasSelected] = useState(false);
  const autocompleteInputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current);
    
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.place_id) {
        alert("Please select a location from the dropdown.");
        return;
      }
      setLocation(place.formatted_address);
      setHasSelected(true);
    });
  }, []);

  const handleChange = (event) => {
    setLocation(event.target.value);
    setHasSelected(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!hasSelected) {
      alert("Please select a valid location before submitting.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/weather', { location });
      setWeatherData(response.data);
      // Later, you will set the received data to your state and render it in your component
    } catch (error) {
      console.error('Error while fetching weather data:', error);
    }
  };

  return (
    <div className="App">
      {
        weatherData && weatherData.daily.slice(0, 7).map((day, index) => (
          <div key={index}>
            <h2>Day {index + 1}</h2>
            <p>Temperature: {day.temp.day}°C</p>
            <p>Weather: {day.weather[0].description}</p>
          </div>
        ))
      }
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          ref={autocompleteInputRef}
          type="text"
          placeholder="Enter your location"
          value={location}
          onChange={handleChange}
        />
        <button type="submit">Get Weather</button>
      </form>
    </div>
  );
}

export default App;