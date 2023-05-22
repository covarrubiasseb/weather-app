import React, { useState } from 'react';

function App() {
  const [location, setLocation] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(location);
    // Here you will call the function to send a request to the server
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>
    </div>
  );
}

export default App;
