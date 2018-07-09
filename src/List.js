import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';

class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }


  //this function for triger item when list clicked
  itemOfList = (item, event) => {
    const {markers} = this.props;
    let selected = markers.filter((currentOne)=> currentOne.name === item.title)
  window.google.maps.event.trigger(selected[0], 'click');

  }

  render() {
    const {locations, settingQuery} = this.props;

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
                              <div className="form-group">
                                  <input
                                  type="text" id="searchbar" name="searchbar" placeholder="Filter"
                                 value={ this.state.query }
                                 onChange={(event) => {
                                 this.setState({ query: event.target.value });
                               settingQuery(event.target.value)}
                                }/>
                              </div>
                          </form>
            </header>
            <header className="second">
             <ul>
            {Showinglist.map((location,index) =>
              (<li key={index}  onClick={this.itemOfList.bind(this,location)}>{location.title}</li>))}

             </ul>
          </header>
      </div>

    )

}}
export default List;
