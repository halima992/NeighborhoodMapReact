import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';

class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }



  render() {
    const {locations, settingQuery, settingList} = this.props;

    let Showinglist;
    if(this.state.query){const match = new RegExp(escapeRegExp(this.state.query), 'i')
    Showinglist = locations.filter((location) => match.test(location.title))}
else {
  Showinglist=locations
}
    return (
      <div id="list-container">
        {JSON.stringify(this.state.query)}
            <header className="first">
                    <h1>search</h1>
                          <form>
                                  <input
                                  type="text" id="searchbar" name="searchbar" placeholder="Filter"
                                  role="search"   tabIndex="1"
                                  aria-labelledby="Search For a Location"
                                 value={ this.state.query }
                                 onChange={(event) => {
                                 this.setState({ query: event.target.value });
                               settingQuery(event.target.value)}
                                }/>
                          </form>
            </header>
            <header className="second">
             <ul  role="list" tabIndex="1" aria-labelledby="list of all locations">
            {Showinglist.map((location,index) =>
              (<li key={index} role="button"tabIndex={index+1}
              onClick={(event)=>settingList(location,event)}>{location.title}</li>))}
             </ul>
          </header>
      </div>

    )

}}
export default List;
