import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [location, setLocation] = useState('');
  const [hasSelected, setHasSelected] = useState(false);
  const autocompleteInputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = () => {
          resolve();
        };
      });
    };

    loadGoogleScript().then(() => {
      
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
      <div className="row">
        {
          weatherData && weatherData.daily.slice(0, 7).map((day, index) => (
            <div key={index} className="col-4 col-md-2 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Day {index + 1}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Temperature: {day.temp.day}°C</h6>
                  <p className="card-text">Weather: {day.weather[0].description}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
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