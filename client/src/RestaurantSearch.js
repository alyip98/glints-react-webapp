import React from "react";
import Client from "./Client";

const MATCHING_ITEM_LIMIT = 25;

class RestaurantSearch extends React.Component {
  state = {
    restaurants: [],
    date: new Date(),
    showRemoveIcon: false,
    searchValue: ""
  };

  handleSearchChange = e => {
    const value = e.target.value;

    this.setState({
      searchValue: value
    });

    if (value === "") {
      this.setState({
        restaurants: [],
        showRemoveIcon: false
      });
    } else {
      this.setState({
        showRemoveIcon: true
      });

      Client.search(value, restaurants => {
        this.setState({
          restaurants: restaurants.slice(0, MATCHING_ITEM_LIMIT)
        });
      });
    }
  };

  handleSearchCancel = () => {
    this.setState({
      restaurants: [],
      showRemoveIcon: false,
      searchValue: ""
    });
  };

  handleDateChange = date => {
    console.log(date);
    this.setState({
      date: date
    })
  };

  render() {
    const { showRemoveIcon, restaurants } = this.state;
    const removeIconStyle = showRemoveIcon ? {} : { visibility: "hidden" };

    const restaurantRows = restaurants.map((restaurant, idx) => (
      <tr key={idx}>
        <td>{restaurant.restaurant_name}</td>
        <td className="right aligned">{restaurant.mon}</td>
        <td className="right aligned">{restaurant.tue}</td>
        <td className="right aligned">{restaurant.wed}</td>
        <td className="right aligned">{restaurant.thu}</td>
        <td className="right aligned">{restaurant.fri}</td>
        <td className="right aligned">{restaurant.sat}</td>
        <td className="right aligned">{restaurant.sun}</td>
      </tr>
    ));

    return (
      <div id="restaurant-search">
        <table className="ui selectable structured large table">
          <thead>
            <tr>
              <th colSpan="5">
                <div className="ui fluid search">
                  <div className="ui icon input">
                    <input
                      className="prompt"
                      type="text"
                      placeholder="Search restaurants..."
                      value={this.state.searchValue}
                      onChange={this.handleSearchChange}
                    />
                    <i className="search icon" />
                  </div>
                  <i
                    className="remove icon"
                    onClick={this.handleSearchCancel}
                    style={removeIconStyle}
                  />
                </div>
              </th>
            </tr>
            <tr>
              <th className="eight wide">Name</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
              <th>Sun</th>
            </tr>
          </thead>
          <tbody>
            {restaurantRows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default RestaurantSearch;
