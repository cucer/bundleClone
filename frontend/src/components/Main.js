import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../css/Main.css";

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

export default function Main() {
  const [packages, setPackages] = useState([]);
  const [input, setInput] = useState("");
  let history = useHistory();

  const getSuggestions = (value) => {
    return fetch("/packageSearch/" + value, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(handleErrors)
      .then((res) => res.json())
      .then((result) => {
        setPackages(result);
      })
      .catch((error) => console.log(error));
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      setInput(value);
      await getSuggestions(value);
    } else {
      setInput("");
      setPackages([]);
    }
  };

  const handleSelectedItem = (item) => {
    history.push({
      pathname: "/info",
      state: { packageName: item },
    });
  };

  const renderList = () => {
    if (packages.length === 0) {
      return null;
    }
    return (
      <ul>
        {packages.map((item, i) => (
          <li key={i} onClick={() => handleSelectedItem(item.package.name)}>
            <label className="list_title">{item.package.name}</label> <br />
            <label className="list_description">
              {item.package.description}
            </label>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="Container">
      <div className="Main">
        <span>PACKAGE SIZER</span>
        <h1 className="title">
          find the cost of adding a npm package to your bundle
        </h1>
        <input
          placeholder="find package"
          value={input}
          onChange={handleChange}
          type="text"
        />
        {renderList()}
      </div>
    </div>
  );
}
