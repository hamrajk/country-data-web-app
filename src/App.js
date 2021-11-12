import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const api_key = process.env.REACT_APP_API_KEY;

const WeatherDisplay = ({ countryToShow }) => {
  const [weatherData, setWeatherData] = useState([]);
  const hasFetchedData = useRef(false);
  const capital = countryToShow[0].capital;

  useEffect(() => {
    if (hasFetchedData.current === false) {
      console.log("effect");
      axios
        .get(
          "http://api.weatherstack.com/current?access_key=" +
            api_key +
            "&query=" +
            capital
        )
        .then((response) => {
          console.log("promise fulfilled");
          setWeatherData(response.data);
          hasFetchedData.current = true;
        });
    }
  }, [capital]);
  console.log(weatherData);
  console.log(capital);
  if (weatherData.length !== 0) {
    return (
      <div>
        <h3>Weather in {weatherData.location.name}</h3>
        <p>
          <b>temperature:</b> {weatherData.current.temperature} celcius
        </p>
        <br />
        <img
          src={weatherData.current.weather_icons[0]}
          alt="Weather forecast"
        ></img>
        <p>
          <b>wind: </b>
          {weatherData.current.wind_speed} mph direction{" "}
          {weatherData.current.wind_dir}
        </p>
      </div>
    );
  } else return null;
};

const DetailDisplay = ({ countriesToShow }) => {
  const languageList = [];
  for (let language in countriesToShow[0].languages) {
    languageList.push(countriesToShow[0].languages[language]);
  }

  const languageDisplay = languageList.map((language) => (
    <li key={language}>{language}</li>
  ));

  return (
    <div>
      <h1>{countriesToShow[0].name.common}</h1>
      <p>Capital {countriesToShow[0].capital}</p>
      <p>Population: {countriesToShow[0].population}</p>
      <h3>Languages</h3>
      <div>{languageDisplay}</div>
      <br />
      <img src={countriesToShow[0].flags.png} alt="this is a flag"></img>
    </div>
  );
};

const CountryDisplay = ({ countriesToShow, newSearch, countries }) => {
  const [show, setShow] = useState(false);
  const [countryToShow, setCountryToShow] = useState([]);

  console.log("in country display");
  console.log(show, countryToShow);

  const handleShowClick = (x) => {
    console.log("showclick");
    console.log(x);
    // console.log(countries);
    console.log(show);
    if (show === false) {
      setCountryToShow(
        countries.filter((country) => {
          return country.name.common
            .toLowerCase()
            .includes(x.toLocaleLowerCase());
        })
      );
      setShow(true);
    }
  };
  console.log(show);
  console.log(countryToShow);

  if (show === true) {
    return (
      <div>
        <DetailDisplay countriesToShow={countryToShow} />
        <button onClick={() => setShow(false)}>Return</button>
        <WeatherDisplay countryToShow={countryToShow} />
      </div>
    );
  }

  // const countryButtonResult = countries.filter((country) => {
  //   return country.name.common
  //     .toLowerCase()
  //     .includes(newSearch.toLocaleLowerCase());
  // });

  if (countriesToShow.length === 1) {
    return (
      <div>
        <DetailDisplay countriesToShow={countriesToShow} />
        <WeatherDisplay countryToShow={countriesToShow} />
      </div>
    );
  }

  const result = countriesToShow.map((country) => (
    <p key={country.name.common}>
      {country.name.common}{" "}
      <button
        onClick={() => {
          handleShowClick(country.name.common);
        }}
      >
        show
      </button>
    </p>
  ));

  if (newSearch.length === 0) {
    return "";
  }

  if (result.length >= 10) {
    return "Too many matches, be more specific";
  }

  return <div>{result}</div>;
};

const App = () => {
  const [newSearch, setNewSearch] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    console.log("effect");
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      console.log("promise fulfilled");
      setCountries(response.data);
    });
  }, []);

  console.log(countries);

  const countriesToShow = countries.filter((country) => {
    return country.name.common
      .toLowerCase()
      .includes(newSearch.toLocaleLowerCase());
  });

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  };

  return (
    <div>
      <div>
        find countries <input value={newSearch} onChange={handleSearchChange} />
      </div>
      <CountryDisplay
        countriesToShow={countriesToShow}
        newSearch={newSearch}
        countries={countries}
      />
    </div>
  );
};

export default App;
