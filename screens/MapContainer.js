import React, { useState } from 'react';
import { StyleSheet, Dimensions, View, Text, Image } from 'react-native';
import * as Location from 'expo-location';

import MapView, { Marker, Callout } from 'react-native-maps';

export default function MapContainer({isKeyboardVisible, addMarker, global, markers, setMarkers}){
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  function followUser(){
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return
      }
      let location = await Location.getCurrentPositionAsync({});
    })();
  };

  followUser()

  function setTrackItem(index){
    let newArr = [...markers]
    newArr[index].value = false
    setMarkers(newArr)
  }

  return(
    <MapView
      onStartShouldSetResponder={!isKeyboardVisible ? () => true : null}
      style={{position: 'absolute', width: '100%', height: windowHeight/100*96}}
      onLongPress={!global&&location ? e => addMarker(location, e) : null}
      mapType = {'hybrid'}
      userInterfaceStyle={'dark'}
      showsMyLocationButton={false}
      zoomEnabled={global} scrollEnabled={global}
      showsUserLocation={!global}
      moveOnMarkerPress={global}
      onUserLocationChange={!global ? (locationChangedResult => setLocation(locationChangedResult.nativeEvent.coordinate)): null}
      region={location&&!global? { 
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.001421} : null}    
    >
      {markers ? markers.map((item, index) => (
        <Marker key={index} style={styles.marker}
           tracksViewChanges={item.value} coordinate={{latitude: item.latitude, longitude: item.longitude }} >
            {item.text?
              <View style={styles.textMarker} />
            : null}
            <View style={styles.markerIconBack} />
            <Image source={item.icon} style={styles.markerIcon} onLoad={() => setTrackItem(index)} />
            {item.text?
                <Callout style={styles.callout}><Text>{item.text}</Text></Callout>
            : null}
        </Marker>
      )) : null}
    </MapView>
  )
}
let windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  marker: {
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 30
  },
  textMarker: {
    position: 'absolute', 
    top: 0, 
    width: 6, 
    height: 6, 
    backgroundColor: 'rgba(162, 246, 247, 0.8)', 
    borderRadius: 4, 
    zIndex: 9999
  },
  markerIconBack: {
    position: 'absolute',
    backgroundColor: 'rgba(2, 140, 180, 0.3)', 
    borderRadius: 60,
    width: 22, 
    height: 22,
  },
  markerIcon: {
    width: 22, 
    height: 22,
  },
  callout: {
    flex: -1, 
    position: 'absolute', 
    width: 160
  }
});