import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Routes, Route } from "react-router-dom";
import MapComponent from "./components/MapComponent";
import "./App.css";

function App() {
  const [places, setPlaces] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    cost: "",
    rating: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async (filterParams = {}) => {
    try {
      const query = new URLSearchParams(filterParams).toString();
      const response = await axios.get(`http://localhost:5000/api/places?${query}`);
      setPlaces(response.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchPlaces(filters);
  };

  return (
    <div className="container">
      <h1>Tourist Places</h1>

      {/* Filter Section */}
      <div className="filter-container">
        <select name="category" onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="Historical">Historical</option>
          <option value="Fort">Fort</option>
          <option value="Hill">Hill</option>
          <option value="Dam">Dam</option>
          <option value="Town">Town</option>
        </select>
        <input type="number" name="cost" placeholder="Max Cost" onChange={handleFilterChange} />
        <input type="number" name="rating" placeholder="Min Rating" onChange={handleFilterChange} />
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      {/* Display Places */}
      <div className="grid">
        {places.map((place) => (
          <div key={place._id} className="card">
            <img src={`http://localhost:5000/uploads/${place.image}`} alt={place.name} className="place-image" />
            <h3>{place.name}</h3>
            <p>{place.location}</p>
            <p>₹{place.cost}</p>
            <p>⭐ {place.rating}</p>

            {/* Navigate to Map Page */}
            <button onClick={() => navigate(`/map?name=${encodeURIComponent(place.name)}`)}>
              Show Map
            </button>
          </div>
        ))}
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/map" element={<MapComponent />} />
      </Routes>
    </div>
  );
}

export default App;
