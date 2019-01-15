import React, {Component} from 'react';
// Hear we import in our loader image
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg';
import Gif from './Gif';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} alt="close" />
      </button>
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {loading ? <img src={loader} className="block mx-auto" alt="loader" /> : hintText}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      gifs: []
    };
  }
  // Function that searches giphy api
  searchGiphy = async searchTerm => {
    // Set Loading to true
    this.setState({
      loading: true
    });
    // Try to fetch
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=dacirdEEf35VBSO7IAL9eNN1SiZ4wVuC&q=${searchTerm}&limit=25&offset=0&rating=R&lang=en`
      );
      // convert response to json
      const {data} = await response.json();
      // Check if array is empty
      if (!data.length) {
        throw `Nothing Found for ${searchTerm}`;
      }
      // grab random result
      const randomGif = randomChoice(data);
      this.setState((prevState, props) => ({
        ...prevState,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }));
    } catch (error) {
      // then catch error
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
    }
  };
  // With create react app we can create our methods as arrow functions no need for constructor & bind
  handleChange = event => {
    const {value} = event.target;
    // This creates a controlled input
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
  };
  handleKeyPress = event => {
    const {value} = event.target;
    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value);
    }
  };
  // Methods to clear state
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));
    //-
    this.textInput.focus();
  };
  render() {
    const {searchTerm, gifs} = this.state;
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {/* {Stack of search Items} */}
          {this.state.gifs.map((gif, index) => (
            // Only do this if items have no stable IDs
            <Gif {...gif} key={index} />
          ))}
          <input
            className="input grid-item"
            placeholder="Type Something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
