/**
 * Basic Sample
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import IndoorAtlas, {
  IALocationManager,
  IALocationManagerEvents
} from 'react-native-indoor-atlas';
import * as CONFIG from './config'

class App extends Component {
  constructor(props) {
    super(props)

    this.locationManager = IALocationManager.getInstance()
    
    this.locationManager.setApiKey(CONFIG.API_KEY, CONFIG.API_SECRET)
      .then(() => {
        this.locationManager
          .on(IALocationManagerEvents.ON_LOCATION_CHANGED, e => {
            debugger
            currentLocation = e.location
          })
          .on(IALocationManagerEvents.ON_ENTER_REGION, e => {
            debugger
            currentLocation = e.floorplan
          })
          .on(IALocationManagerEvents.ON_EXIT_REGION, e => {
            this.setState({ floorplan: null })
          })
      })
    
    this.state = {
      location: null,
      floorplan: null
    }
  }

  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App
