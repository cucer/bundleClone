import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Main from "./components/Main";
import Info from "./components/Info";
import "../src/css/App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/info" component={Info} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
