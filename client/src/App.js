import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: "",
      links: []
    }

    this.performSearch = this.performSearch.bind(this);
  }

  performSearch() {
    console.log("Doing search");
    fetch('http://localhost:4001/manga/' + this.state.query, { method: 'get' })
      .then(response => response.json())
      .then(result => {
        console.log(result)
        this.setState({ links: result.links });
      })
      .catch(error => {
        console.log(error)
      });
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <h1>Search title here: {this.state.query}</h1>
        <input onChange={(e) => this.setState({ query: e.target.value })} type="text" />
        <button onClick={this.performSearch}>Search</button>
        <ul>
          {this.state.links.map((link, index) => <li key={index}><a href={link}>{link}</a></li>)}
        </ul>
      </div>
    );
  }
}

export default App;
