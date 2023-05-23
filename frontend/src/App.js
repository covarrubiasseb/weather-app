import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [location, setLocation] = useState('');
  const [hasSelected, setHasSelected] = useState(false);
  const autocompleteInputRef = useRef(null);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasSelected) {
      alert("Please select a valid location before submitting.");
      return;
    }
    console.log(location);
    // Later here you will call the function to send a request to the server
  };

  return (
    <div className="App">
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