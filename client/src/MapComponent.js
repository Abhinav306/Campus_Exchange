import React, { useState, useEffect } from "react";
import axios from "axios";

const MapComponent = ({ area, city, state }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const address = `${area}, ${city}, ${state}`;
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            address
          )}&apiKey=da21fad825e941559ab482bf919488a0`
        );

        // Extract the latitude and longitude from the response
        if (
          response.data &&
          response.data.features &&
          response.data.features.length > 0
        ) {
          const { lat, lon } = response.data.features[0].properties;
          setPosition([lat, lon]);
        }
      } catch (error) {
        console.error("Error fetching geocoded location:", error);
      }
    };

    fetchData();
  }, [area, city, state]);

  return (
    <div>
      {position && (
        <img
          alt="Map"
          src={`https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=300&height=200&center=lonlat:${position[1]},${position[0]}&zoom=10&apiKey=da21fad825e941559ab482bf919488a0`}
          style={{ width: "100%", height: "200px" }}
        />
      )}
    </div>
  );
};

export default MapComponent;
