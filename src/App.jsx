import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import "./App.css";

// Images
import searchIcon from "./assets/search.png";

import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import snowIcon from "./assets/snow.png";

import humidityIcon from "./assets/humidity.png";
import windIcon from "./assets/wind.png";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  lon,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Weather Condition" />
      </div>
      <div className="temp">{temp}&deg;C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="text">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="text">Longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="reading">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="reading">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
};

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;

  const [input, setInput] = useState("Puducherry");

  const [icon, setIcon] = useState(drizzleIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);

    // openweathermap api url
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data);

      if (data.cod === "404") {
        console.log("Error: City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(parseFloat(data.coord.lat.toFixed(2)));
      setLon(parseFloat(data.coord.lon.toFixed(2)));
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setIcon(weatherIconMap[data.weather[0].icon] || clearIcon);

      setCityNotFound(false);
      setLoading(false);
      setInput("");
    } catch (error) {
      console.error("An error occured: ", error.message);
      setInput("");
      setError("An error occured while fetching weather data.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleCity = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        {!loading && (
          <div className="input-container">
            <input
              type="text"
              className="city-input"
              placeholder="Search City"
              onChange={handleCity}
              onKeyDown={handleKeyDown}
              value={input}
              name=""
              id=""
            />
            <div className="search-icon" onClick={() => search()}>
              <img src={searchIcon} alt="search" />
            </div>
          </div>
        )}

        {loading && <div className="loading">Loading...</div>}
        {!loading && cityNotFound && (
          <div className="error">City not found</div>
        )}
        {!loading && error && <div className="error">{error}</div>}

        {!loading && !cityNotFound && !error && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            lon={lon}
            humidity={humidity}
            wind={wind}
          />
        )}
      </div>
    </>
  );
}

export default App;
