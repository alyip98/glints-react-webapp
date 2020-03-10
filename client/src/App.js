import React, { Component } from "react";
import RestaurantSearch from "./RestaurantSearch";

class App extends Component {
  state = {
  };

  render() {

    return (
      <div className="App">
        <div className="ui text container">
          <RestaurantSearch />
        </div>
      </div>
    );
  }
}

export default App;
