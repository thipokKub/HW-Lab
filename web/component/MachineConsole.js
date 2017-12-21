import React, { Component } from 'react';
import styled from 'styled-components';
import Button from './Button';
import firebase from 'firebase';
import { geolocated } from 'react-geolocated';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  const crd = pos.coords;
  return ({
    latitude: crd.latitude,
    longitude: crd.longitude,
    accuracy: crd.accuracy
  });
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const UL = styled.ul`
list-style-type: none;
padding: 0px;
position: relative;
margin-bottom: 40px;

li {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #F9F9F9;
    height: 50px;
    width: 200px;
    padding: 0px 30px;
    color: #000;
    position: relative;
    box-shadow: 0px 2px 15px rgba(0,0,0,0.3);

    &::before {
        content: "";
        height: 50px;
        width: 30px;
        background-color: #AAA;
        display: block;
        position: absolute;
        left: 0px;
        transition: all 0.2s;
    }

    &:hover {
        background-color: #FFF; 
        box-shadow: 0px 4px 15px rgba(0,0,0,0.3);
        
        &::before {
            background-color: rgb(33, 220, 33);
        }
    }

    &:active {
        background-color: #EAEAEA;   
        box-shadow: none;     
    }

    .fa {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
    }
}
`;

const Div = styled.div`
  background-color: #FFF;
  margin-bottom: 40px;
  color: #000;
  width: 300px;
  min-height: 400px;
  box-sizing: border-box;
  box-shadow: 0px 2px 15px rgba(0,0,0,0.3);
  position: relative;
  display: flex;
  flex-direction: column;

  h3 {
    background-color: #AAA;
    margin: 0px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      background-color: #FCFA3D;
    }
  }

  span.back {
    color: #017AFC;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 20px;
    
    .fa {
      margin-right: 5px;
    }

    :hover {
      filter: brightness(1.2);
    }
  }

  div.body {
    flex: 1;

    .center-topic {
      display: flex;
      width: 80%;

      > span {
        flex: 1;
        width: 50%;
        &:nth-child(1) {
          text-align: right;
          margin-right: 2px;
          font-weight: 600;
        }
        &:nth-child(2) {
          whitespace: wrap;
          word-break: break-word;
          margin-left: 2px;
        }
      }
    }
  }
`;

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function calState(props) {
  if (!props.isGeolocationAvailable) {
    return 0;
  } else if (!props.isGeolocationEnabled) {
    return 1;
  } else if (!props.coords) {
    return 2;
  } else {
    return 3;
  }
}

class MachineConsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null,
      ref: null,
      snap: {
        latitude: -1,
        longitude: -1,
        timestamp: '',
        length: -1
      },
      latitude: -1,
      longitude: -1
    }
    this.onSelect = this.onSelect.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  onSelect(id) {
    this.setState({
      selectedId: id,
      ref: firebase.database().ref(`machines/${id}/history`).orderByKey().limitToLast(1).on('value', (snap) => {
        this.setState({
          snap: {
            latitude: parseFloat(snap.val()[Object.keys(snap.val())[0]].latitude),
            longitude: parseFloat(snap.val()[Object.keys(snap.val())[0]].longitude),
            timestamp: new Date(snap.val()[Object.keys(snap.val())[0]].timestamp),
            length: parseFloat(snap.val()[Object.keys(snap.val())[0]].length)
          }
        })
      })
    })
  }

  onBack() {
    this.setState({
      selectedId: null
    });
  }

  componentWillMount() {
    this.geoLocated = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      }, error, options);
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.geoLocated);
  }
  
  render() {
    const { machineIDs, isLoad } = this.props; 
    const {selectedId} = this.state;

    if(selectedId === null) {
      return (
        !isLoad ? (
          <span className="black mar-b-40">Fetching data...</span>
        ) : (
            [
              <span className="black" key="1a">Please select machine id below</span>,
              <UL key="1b">
                {
                  machineIDs.map((item, index) => {
                    return (<li key={index} onClick={() => { this.onSelect(item) }}>{item} <i className="fa fa-angle-right" /></li>);
                  })
                }
              </UL>
            ]
          )
      );
    } else {
      if (calState(this.props) === 3) {
        return (
          <Div>
            <h3><span className="back" onClick={this.onBack}><i className="fa fa-angle-left" />Back</span>{selectedId}</h3>
            <div className="body">
              <div className="center-topic">
                <span>Distance</span>
                <span>{Math.round(getDistanceFromLatLonInKm(this.state.snap.latitude, this.state.snap.longitude, this.state.latitude, this.state.longitude)*1000)/1000} kilometer(s) away</span>
              </div>
              <div className="center-topic">
                <span>Length</span>
                <span>{this.state.snap.length}</span>
              </div>
              <div className="center-topic">
                <span>Status</span>
                <span>{getDistanceFromLatLonInKm(this.state.snap.latitude, this.state.snap.longitude, this.state.latitude, this.state.longitude) <= 0.03 ? 'ON': 'OFF'}</span>
              </div>
              <div className="center-topic">
                <span>[D] Latitude</span>
                <span>{this.state.latitude}</span>
              </div>
              <div className="center-topic">
                <span>[D] Longitude</span>
                <span>{this.state.longitude}</span>
              </div>
            </div>
          </Div>
        );
      } else if (calState(this.props) === 2) {
        return (
          <Div>
            <h3><span className="back" onClick={this.onBack}><i className="fa fa-angle-left" />Back</span>{selectedId}</h3>
            <div className="body">
              Loading...
            </div>
          </Div>
        );
      } else {
        return(
          <Div>
            <h3><span className="back" onClick={this.onBack}><i className="fa fa-angle-left" />Back</span>{selectedId}</h3>
            <div className="body">
              Your Browser did not support GeoLocation or it was disabled.
            </div>
          </Div>
        );
      }
    }
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000,
})(MachineConsole);