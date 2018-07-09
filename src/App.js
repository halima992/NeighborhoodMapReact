
import React, { Component } from 'react';
import List from './List';
import scriptLoader from 'react-async-script-loader';
import fetchJsonp from 'fetch-jsonp';

import './App.css'

let markers=[] ;
let infoWindows=[];
//these virable for change color
let DefualtIcon ='http://chart.googleapis.com/chart?chst=d_map_spin&chld=.75|0|FFFFFF|20|_|%E2%80%A2'
let ChangeIcon ='http://chart.googleapis.com/chart?chst=d_map_spin&chld=.75|0|20b2aa|20|_|%E2%80%A2'
class App extends Component {
  constructor(props) {
     super(props);
     this.updateMarkers = this.updateMarkers.bind(this);
  this.state={
     locations : [
     {title: 'Central Park Zoo', location: {lat: 40.767778, lng: -73.971834}},
     {title: 'Empire State Building', location: {lat:40.748441, lng:-73.985664}},
     {title: 'The High Line', location: {lat: 40.747993, lng:-74.004765 }},
     {title: 'Bellevue Hospital Center', location: {lat: 40.738935, lng:-73.975337}},
     {title: ' Metropolitan Museum of Art', location: {lat:40.779437, lng:-73.963244}},

   ],
      map: {},
      query: '',
      requestWasSuccessful:true,
      data:[]


  }}
  //Update the data fater geeting the info from the API
updateData = (newData) => {
  this.setState({
    data:newData,
  });
}
updateQuery = (query)=> {
  this.setState({query:query.trim()});
  this.updateMarkers(this.state.map);
}


  componentWillReceiveProps({isScriptLoadSucceed}){
  //Make sure the script is loaded
  if (isScriptLoadSucceed) {
    //Creating the Map
    const map = new window.google.maps.Map(this.refs.map, {
      zoom: 13,
      //Giving an initial locaiton to start
      center: new window.google.maps.LatLng(40.7413549,-73.9980244),
    });
    this.setState({map:map});
  }
  else {
    //Handle the error
    this.setState({requestWasSuccessful: false})
  }
}
updateMarkers(map){
  //this funtion for determine markers accroding the location also make animation and open windows
  const {locations} = this.state;
  let showingLocations=locations
      showingLocations.map((marker,index)=> {
        //Filter the data that is stored form wikipedia in the state to add them to windows info
    let getData = this.state.data.filter((single)=>marker.title === single[0][0]).map(item2=>
      {if (item2.length===0)
        return 'No Contents Have Been Found Try to Search Manual'
        else if (item2[1] !=='')
          return item2[1]
        else
          return 'No Contents Have Been Found Try to Search Manual'
      })
    let getLink = this.state.data.filter((single)=>marker.title === single[0][0]).map(item2=>
      {if (item2.length===0)
        return 'https://www.wikipedia.org'
        else if (item2[1] !=='')
          return item2[2]
        else
          return 'https://www.wikipedia.org'
      })

    let addInfoWindow= new window.google.maps.InfoWindow();
  addInfoWindow.setContent(  `<div tabIndex="0">
         <h2>${marker.title}</h2>
         <p>${getData}</p>
         <a href=${getLink}>Click Here For More Info</a>
         </div>`)
        let addmarker = new window.google.maps.Marker({
             map:map,
             position: marker.location,
             animation: window.google.maps.Animation.DROP,
             icon:DefualtIcon,
             name : marker.title });
            markers.push(addmarker);

      infoWindows.push(addInfoWindow);
      addmarker.addListener('click', function() {
       //Close windows before open the another
       infoWindows.forEach(Windows => { Windows.close() });
       addInfoWindow.open(map, addmarker);
       this.setIcon(ChangeIcon);

       if (this.getAnimation() !== null) {
         this.setAnimation(null);
                }
                else {
            //Add the aniamtion when the marker is clicked
            addmarker.setAnimation(window.google.maps.Animation.BOUNCE);}

        setTimeout(() => {this.setIcon(DefualtIcon);addmarker.setAnimation(null);}, 1000)})  });
}

componentDidUpdate(){
  markers=[];
  this.updateMarkers(this.state.map)

}
        componentDidMount(){
          //fetch data from wibikedia
           this.state.locations.map((location,index)=>{
             return fetchJsonp(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${location.title}&format=json&callback=wikiCallback`)
             .then(response => response.json()).then((responseJson) => {
               let newData = [...this.state.data,[responseJson,responseJson[2][0],responseJson[3][0]]]
               this.updateData(newData)
             }).catch(error =>
             console.error(error)
             )
           })
         }



  render() {
    const {requestWasSuccessful} = this.state;

    return (
      // if the request for load map  Successful
     requestWasSuccessful ?(  <div id="container">
	      <div id="container-second">
          <List
          locations={this.state.locations}
                      settingQuery={(query) => {this.updateQuery(query)}}
                      markers={markers}
                      map={this.state.map}

          />
        <div id='map-container'tabIndex="-1">
      <div id="map" ref="map" ></div>
      </div>
      </div>
      </div>):
      ( <div>
      <h1>there is error at google map</h1>
      </div>)
    );
  }


}

export default scriptLoader(
   [`https://maps.googleapis.com/maps/api/js?key=AIzaSyDA55DJlyjeO45VspTmM4bSgkE5sVhE6Cc&v=3.exp&libraries=geometry,drawing,places`]
   )(App);
