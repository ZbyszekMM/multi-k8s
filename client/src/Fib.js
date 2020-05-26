import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  };
  
 
  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  };

  // zciągnij przez magiczne api i axios wartości liczb fibo - w index.js ustawiony jest route dla /values/current
  async fetchValues() {
    const values = await axios.get('/api/values/current');
    console.log('Called Axios method to FETCH value pairs  ***');
    this.setState({ values: values.data });
  };

  
  // zciągnij przez magiczne api i axios widziane indeksy - w index.js ustawiony jest route dla /values/all
  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    console.log('Called axios method to FETCH indexes ***');
    this.setState({
      seenIndexes: seenIndexes.data
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log('handleSubmit was called for value ', this.state.index);
    // obsługa wywołania obliczenia dla wprowadzonej wartości indeksu
    await axios.post('/api/values', {
      index: this.state.index
    });
    
    
    // Refresh the page with new values
    this.fetchValues();
    this.fetchIndexes();
    this.setState({ index: '' });
  };

  // seenIndexes to tablica obiektów - taki typ przez default jest zwracany przez zapytanie do Postgressa
  // map ziteruje przez wszystkie instancje obiektu number w tablicy seenIndexes wyłuskując skalarną wartość number
  renderSeenIndexes() {
    console.log('   renderSeenIndexes was called');
    return this.state.seenIndexes.map(({ number }) => number).join(', ');  // this odnosi się do głównego obiektu klasy Fib
  };

  // dla odmiany wartości fibo są zwracane przez redisa jako obiekt zawierający "a bunch of KEY / value pairs"
  renderValues() {
    console.log('   render values (value pairs) was called');
    const entries = [];

    for (let key in this.state.values) {  //iteracja przez te pary "key / value"
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  };

  // ta funkcja ODŚWIEŻA cały ekran!
  render() {
    console.log('render was called - odświeżam cały ekran');
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          
          <input 
            value={this.state.index}
            onChange={event => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
};


// to nie działa console.log('Meldung von App.js Compoonent - mój stan ((.. , values, index)',     '  ',    this.state.values, '  ', this.state.index,);

export default Fib;
