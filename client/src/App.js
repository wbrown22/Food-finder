import React, { Component } from 'react';
import { RingLoader } from 'react-spinners';
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      json: [],
      searched: false,
    }
  }

//handles API 'GET' request
searchFood = async () => {

    //start the loading spinner
    this.setState({loading: true, searched: true});

    //format the query string for our get request
    var lng = this.refs.lng.value;
    var lat = this.refs.lat.value;
    var food = this.refs.food.value;

    //send get request and format components from response
    const url = 'http://localhost:4000/providers/?lng=' + lng + '&lat=' + lat + '&foodType=' + food;

    try {
      const providersNearMe = await fetch(url);
      const json = await providersNearMe.json();
      const providers = json.providers;
      console.log(providers);

      this.setState({
        loading: false,
        json: providers,
      });
    } catch(err) {
      console.log('error caught');
      this.setState({
        loading: false
      })
    }

  }

//Handles conditional rendering and formatting for the response data from API call
  renderProviders = () => {

    // While the API call is in progress. Renders activity indicator
    if (this.state.loading) {
      return(
        <div className="loadContainer">
          <RingLoader
            sizeUnit={'px'}
            size={50}
            color={'blue'}
          />
        </div>
      );
    }

    //If an error is thrown on the API call due to invalid coordinates
    else if (this.state.searched && this.state.json  === undefined) {
        return (
          <div className="providerContainer">
            <text className="message">Coordinates are invalid</text>
          </div>
        );
      }

    //if the API call returns no results for our query
    else if (this.state.searched && this.state.json.length === 0) {
        return (
          <div className="providerContainer">
            <text className="message">No food providers that fit your search were found</text>
          </div>
        );
      }

    //if the API call returns one or more results for our query
    else {

      //format the comonents with data
      const providers = this.state.json.map((provider, index) => {
        return (
          <li key={index}>
            <span className="name">{provider.name}</span>
            <span className="specialty">{provider.specialty}</span>
            <h6>Orders: </h6>
            <span className="orders">{provider.orders}</span>
            <span className="dist">{Math.floor(provider.distance)}</span>
            <h5>mi.</h5>
          </li>
        );
      });

      //return formatted components
      return (
        <div className="providerContainer">
          {providers}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="container">

          {/* Header element */}
          <div className="topBar">
            <h1>Food Finder</h1>
          </div>

          {/* Search input element */}
          <div id="searchInput">

            <div className="inputContainer">
              <text>Longitude: </text>
              <input className="input" type="text" ref="lng" required></input>
            </div>

            <div className="inputContainer">
              <text>Latitude: </text>
              <input className="input" type="text" ref="lat" required></input>
            </div>

            <div className="inputContainer">
              <text>Food: </text>
              <input className="input" type="text" ref="food" required></input>
            </div>

            <div className="buttonContainer">
              <button id="submitButton" type="button" onClick={this.searchFood}>FIND FOOD NEAR ME!</button>
            </div>

            {/* Nearby provider listing element */}
            {this.renderProviders()};

          </div>

      </div>

    );
  }
}

export default App;
