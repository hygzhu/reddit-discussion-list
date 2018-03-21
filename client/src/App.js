import React, { Component } from 'react';
import './App.css';


const spinner =
  <div style={{ marginLeft: "30px", float: "left" }} className="preloader-wrapper small active">
    <div className="spinner-layer spinner-green-only">
      <div className="circle-clipper left">
        <div className="circle"></div>
      </div><div className="gap-patch">
        <div className="circle"></div>
      </div><div className="circle-clipper right">
        <div className="circle"></div>
      </div>
    </div>
  </div>;


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: "",
      links: [],
      loading: false
    }

    this.performSearch = this.performSearch.bind(this);
  }

  performSearch() {
    this.setState({ loading: true });
    console.log("Doing search");
    fetch('http://localhost:4001/manga/' + this.state.query, { method: 'get' })
      .then(response => response.json())
      .then(result => {
        console.log(result)
        this.setState({ links: result.links, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error)
      });
  }

  render() {
    return (
      <div>
        <h1 style={{ marginLeft: "30px" }}>Search Manga name here: {this.state.query}</h1>
        <input style={{ marginLeft: "30px" }} onChange={(e) => this.setState({ query: e.target.value })} type="text" />
        <button style={{ marginLeft: "30px", float: "left" }} className="btn waves-effect waves-light" type="submit" onClick={this.performSearch}>Search</button>
        {this.state.loading ? spinner : ""}
        {this.state.links.length > 0 ? <ul className="collection" style={{ marginLeft: "30px", clear: "left", marginTop: "30px" }}>
          {this.state.links.map((link, index) => <li className="collection-item" key={index}><a href={link}>{link}</a></li>)}
        </ul>
          : ""}

      </div>
    );
  }
}

export default App;
