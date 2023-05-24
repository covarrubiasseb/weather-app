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
    <div className="container">
      <div className="row mt-5">
        {
          weatherData && weatherData.daily.slice(0, 7).map((day, index) => (
            <div key={index} className="equal-width-column d-flex">
              <div className="card align-items-stretch">
                <div className="card-body text-center">
                  <img 
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                  />
                  <h5 className="card-title">Day {index + 1}</h5>
                  <h6 className="card-subtitle mb-2 text-white">Temperature: {day.temp.day}°C</h6>
                  <p className="card-text text-white">Weather: {day.weather[0].description}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <div className="row justify-content-center">
        <div className="col-6">
          <form onSubmit={handleSubmit} className="input-group mt-5 w-100">
            <input
              className="form-control"
              ref={autocompleteInputRef}
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={handleChange}
            />
            <button className="btn text-white bg-dark" type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );

}

export default App;