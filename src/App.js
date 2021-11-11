import React, { useState, useEffect } from "react";
import axios from "axios";

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
      <div>{countriesToShow[0].flag}</div>
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
