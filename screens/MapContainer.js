import React, { useState } from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Callout } from 'react-native-maps';

import Like from '../assets/map/like.png'
import Dislike from '../assets/map/dislike.png'
import Notification from './Notification';

import { subscribe } from './LoadMarkers';
import { schedulePushNotification } from './Notification';

export default function MapContainer({isKeyboardVisible, addMarker, global, markers, setMarkers, allIcons, setLike}){
  const [location, setLocation] = useState(null),
        [errorMsg, setErrorMsg] = useState(null)
  let [markerMenu, setMarkerMenu] = useState(false),
      [indx, setIndx] = useState(0),
      [bool, setBool] = useState(false),
      [sign, setSign] = useState(null),
      [notifiocation, setNotifiocation] = useState(false)


  subscribe(markers, setMarkers, allIcons)

  if(!location){
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

  }



  function trackUser(e) {
    if(location&&markers.length!==0){
      let bal = false
      let i = 0, len = markers.length;
      while (i < len) {
        if(Math.abs(location.latitude-markers[i].latitude)   <0.0001
        &&Math.abs(location.longitude-markers[i].longitude)<0.0001){
          if(!markers[i].checked){
            bal = true
            let newArr = [...markers]
            newArr[i].checked = true
            setMarkers(newArr)
  
            setSign(markers[i].text)
          }
          break
        }
        i++
      }  
      if(bal){
        schedulePushNotification()
        console.log('mooving')
        setNotifiocation(true)
        setTimeout(() => setNotifiocation(false), 1000)
        bal = false
      }

    }
  }
  if(!bool){
    setBool(() => true)
  }

  function setTrackItem(index){
  let newArr = [...markers]
    newArr[index].value = false
    setMarkers(newArr)
  }

  function openMenu(index){
  setMarkerMenu(true)
    setIndx(index)
  }

  return(
    <>
      <Notification bool={bool} sign={sign} />
      <MapView
        onStartShouldSetResponder={!isKeyboardVisible ? () => true : null}
        style={{position: 'absolute', width: '100%', height: windowHeight/100*96}}
        onLongPress={!global&&location ? e => addMarker(location, e) : null}
        mapType = {'hybrid'}
        userInterfaceStyle={'dark'}
        showsMyLocationButton={false}
        onPress={() => setMarkerMenu(false)}
        zoomEnabled={global} scrollEnabled={global}
        showsUserLocation={!global}
        moveOnMarkerPress={global}
        // 
        onUserLocationChange={!global ? (locationChangedResult => {setLocation(locationChangedResult.nativeEvent.coordinate); setInterval(() => {trackUser()}, 400)}): null}
        region={location&&!global? { 
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.001421} : null}    
      >
        {markers ? markers.map((item, index) => (
            <Marker onPress={!global ? () => openMenu(index) : null}
              key={index} style={styles.marker}
               tracksViewChanges={item.value} coordinate={{latitude: item.latitude, longitude: item.longitude }} >
                {item.text?
                  <View style={styles.textMarker} />
                : null}
                <View style={styles.markerIconBack} />
                <Image source={item.icon} style={styles.markerIcon} onLoad={() => setTrackItem(index)} />
                <Text style={styles.like}>{item.like}/{item.dislike}</Text>
                {item.text?
                    <Callout style={styles.callout}><Text>{item.text}</Text></Callout>
                : null}
            </Marker>
        )) : null}
      </MapView>
      {markerMenu&&!global ?
        <View style={{position: 'absolute', bottom: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: '30%',  zIndex: 100000}}>
          <TouchableOpacity style={{backgroundColor: 'rgba(72, 156, 220, 0.5)', padding: '6%', borderRadius: 60}} onPress={() => setLike('like', indx)}>
            <Image tintColor="white" style={{height: 22, width: 22}} source={Like} />
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: 'rgba(110, 30, 80, 0.5)', padding: '6%', borderRadius: 60}} onPress={() => setLike('dislike', indx)}>
            <Image tintColor="white" style={{height: 22, width: 22}} source={Dislike} />
          </TouchableOpacity> 
        </View>: null} 
        {notifiocation ?
          <Text style={styles.notification} >Too close to others markers</Text>
        : null}
    </>
  )
}

let windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  marker: {
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 47
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
    height: 40,
  },
  markerIcon: {
    width: 22, 
    height: 22,
  },
  like: {
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    fontSize: 11
  },
  callout: {
    flex: -1, 
    position: 'absolute', 
    width: 160
  },
  notification: {
    position: 'absolute',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    alignSelf: 'center',
    bottom: '2%'
  }
});