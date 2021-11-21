import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Filter from '../assets/menu/filter.png'
import Signature from '../assets/menu/signature.png'
import Lamp from '../assets/menu/lamp.png'
import Settings from '../assets/menu/settings.png'
import Earth from '../assets/menu/earth-globe.png'

import All from '../assets/filter/all.png'
import Attention from '../assets/filter/attention.png'
import LocationIcon from '../assets/filter/location.png'
import Forbidden from '../assets/filter/forbidden.png'

import Ι0 from '../assets/signs/0000.png'
import Ι1 from '../assets/signs/0001.png'
import Ι2 from '../assets/signs/0002.png'
import Ι3 from '../assets/signs/0003.png'
import Ι4 from '../assets/signs/0004.png'
import Ι5 from '../assets/signs/0005.png'
import Ι6 from '../assets/signs/0006.png'
import Ι7 from '../assets/signs/0007.png'
import Ι8 from '../assets/signs/0008.png'
import Ι9 from '../assets/signs/0009.png'
import Ι10 from '../assets/signs/0010.png'
import Ι11 from '../assets/signs/0011.png'
import Ι12 from '../assets/signs/0012.png'
import Ι13 from '../assets/signs/0013.png'
import Ι14 from '../assets/signs/0014.png'
import Ι15 from '../assets/signs/0015.png'
import Ι16 from '../assets/signs/0016.png'
import Ι17 from '../assets/signs/0017.png'
import Ι18 from '../assets/signs/0018.png'
import Ι19 from '../assets/signs/0019.png'
import Ι20 from '../assets/signs/0020.png'
import Ι21 from '../assets/signs/0021.png'
import Ι22 from '../assets/signs/0022.png'
import Ι23 from '../assets/signs/0023.png'
import Ι24 from '../assets/signs/0024.png'
import Ι25 from '../assets/signs/0025.png'

export default function Map() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  let [region, setRegion] = useState({
    "latitude": 10.1,
    "longitude":  50.1,
    "latitudeDelta": 300,
    "longitudeDelta": 300})
  
  let [updateLocation, setUpdateLocation] = useState(false)

  useEffect(() => {
     const keyboardDidShowListener = Keyboard.addListener(
       'keyboardDidShow',
       () => {
          setKeyboardVisible(true);
       }
     );
     const keyboardDidHideListener = Keyboard.addListener(
       'keyboardDidHide',
       () => {
         setKeyboardVisible(false);
       }
     );
 
     return () => {
       keyboardDidHideListener.remove();
       keyboardDidShowListener.remove();
     };
   }, []);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  let [toggleMenu, setToggleMenu] = useState(false);
  let [textInput, setTextInput] = useState(false);
  let [inputValue, setInputValue] = useState('');
  let [global, setGlobal] = useState(false);

  function Global(){
    // if(location){
    //   setRegion({
    //     latitude: location.coords.latitude,
    //     longitude: location.coords.longitude,
    //     latitudeDelta: 60,
    //     longitudeDelta: 60
    //   })
    // }
    setGlobal(!global)
    setToggleMenu(false)
    setTextInput(false)
  }
  function TextSelect(){
    setTextInput(!textInput)
    setGlobal(false)
  }
  const menu = [
    {icon: Filter, func: null, value: null}, 
    {icon: Signature, func: TextSelect, value: textInput}, 
    {icon: Lamp, func: setToggleMenu, value: toggleMenu}, 
    {icon: Earth, func: Global, value: global}, 
    {icon: Settings, func: null, value: null}, 
    // {icon: Angry, func: null, value: null}  
  ]
  const allIcons = [Ι0, Ι1, Ι2, Ι3, Ι4, Ι5, Ι6, Ι7, Ι8, 
    Ι9, Ι10, Ι11, Ι12, Ι13, Ι14, Ι15, Ι16, Ι17, Ι18, Ι19, Ι20, Ι21, Ι22, Ι23, Ι24, Ι25]
  
  const emoSigns = [Ι0, Ι1, Ι2, Ι3, Ι4, Ι5, Ι6, Ι7, Ι8]
  const ateSigns = [Ι9, Ι10, Ι11, Ι12, Ι13]
  const pathSigns = [Ι14, Ι15, Ι16, Ι17, Ι18, Ι19, Ι20, Ι21]
  const forbiddenSigns = [Ι22, Ι23, Ι24, Ι25]

  let filtersIcons = [emoSigns, ateSigns, pathSigns, forbiddenSigns]
  
  const filters = [All, Attention, LocationIcon, Forbidden]

  let [selectedFilter, setFilter] = useState(filtersIcons[0])

  let [signsIcon, setSignsIcon] = useState(selectedFilter[0]);
  
  let [markers, setMarkers] = useState([])

  useEffect(() => {
    (async () => {
      let info = await axios.get('http://208.69.117.77:8000/api/icon_view/')
      let newArr = [...markers];
      for(let x=0; x<info.data.length; x++){
        newArr.push({
          latitude: Number(info.data[x].latitude), 
          longitude: Number(info.data[x].longitude), 
          icon: allIcons[Number(info.data[x].icon)-12],
          text: info.data[x].text})
        setMarkers(newArr);
      }
    })();
  }, []);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    (async () => {
      if(!location){
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }}
      await sleep(500);

      await Location.watchPositionAsync(
        {accuracy:Location.Accuracy.High},
        (loc) => {setLocation(loc)});
    })();
  }, [updateLocation]);

  // useEffect(() => {
  //   (async () => {
  //     await sleep(1200);

  //     if(location&&markers.length!==0){
  //       for(let x=0; x<markers.length; x++){
  //         if(location.coords.latitude-markers[x].latitude<0.0000000001&&location.coords.longitude-markers[x].longitude<0.0000000001){
  //           console.log(markers[x].latitude)
  //         }
  //       }
  //     }
  //   })();
  // }, [updateLocation]);

  function addMarker(e) {
    let newArr = [...markers];
    newArr.push({
      latitude: e.nativeEvent.coordinate.latitude, 
      longitude: e.nativeEvent.coordinate.longitude, 
      icon: signsIcon,
      text: inputValue})
    setMarkers(newArr);
    let textForPost = inputValue 
    if(!inputValue){
      textForPost = 'WhiteHorseInMyNose'
    }
    axios.post(`http://208.69.117.77:8000/api/createIcon/${signsIcon}/${textForPost}/${e.nativeEvent.coordinate.latitude}/${e.nativeEvent.coordinate.longitude}/`)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {global ?
            <GooglePlacesAutocomplete
              placeholder='Search'
              minLength={2} // minimum length of text to search
              // autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
              fetchDetails={true}
              listViewDisplayed={false}              // renderDescription={row => row.description} //
              onPress={(data, details = null) => {
               // 'details' is provided when fetchDetails = true
                console.log(data, details);
                setRegion({
                  latitude: details.geometry.location.lat,
                  longitude:  details.geometry.location.lng
                })
              }}
              query={{
                key: 'AIzaSyCXRQ_pQ2CNh7v-DqjyOsrmaTUGYPF1uTs',
                language: 'en',
              }}
              styles={{
                container: { flex: 0, position: "absolute", top: '4%', width: "100%", zIndex: 9999, alignSelf: 'center' },
                listView: { backgroundColor: "white" }
              }}
            />
        : textInput ? 
          <TextInput 
            style={styles.input}
            placeholder={'Type text for icon'}
            onChangeText={text => setInputValue(text)}
            value={inputValue}
            maxLength={80}
          />
        :null}
        <View style={styles.mapContent}>
          <View style={{top: '10%', width: '20%', zIndex: 1000}}>
            {menu.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.menuIcon, item.value ? {backgroundColor: 'rgba(0,17,30, 1)'} : null, ]} onPress={item.func ? () => item.func(!item.value) : null}>
                <Image source={item.icon} style={{width: 24, height: 24, opacity: 0.8}} tintColor="#a2f6f7"/>
              </TouchableOpacity>
            ))}
          </View>
            <>
              {toggleMenu ?
                <View style={styles.signsContainer}>
                 <View style={styles.filter}>
                  {filters.map((item, index) => (
                    <TouchableOpacity key={index} style={{margin: 10}} onPress={() =>  {setFilter(filtersIcons[index])}}>
                      <Image source={item} style={{width: 30, height: 30}} tintColor="#a2f6f7"/>
                    </TouchableOpacity>
                  ))}
                  </View>
                  <View style={styles.signs}>
                    {selectedFilter.map((item, index) => (
                      <TouchableOpacity key={index} style={{margin: 10}} onPress={() =>  {setSignsIcon(item), setToggleMenu(!toggleMenu)}}>
                        <Image source={item} style={{width: 30, height: 30}} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              : null}  
              <MapView
                onStartShouldSetResponder={!isKeyboardVisible ? () => true : null}
                style={{position: 'absolute', width: '100%', height: '100%'}}
                onLongPress={!global&&location ? e => addMarker(e) : null}
                mapType = {'hybrid'}
                userInterfaceStyle={'dark'}
                showsMyLocationButton={false}
                zoomEnabled={global} scrollEnabled={global}
                showsUserLocation={!global}
                moveOnMarkerPress={!global}
                followsUserLocation={!global}
                onUserLocationChange={!global ? () => (setUpdateLocation(!updateLocation)): null}
                region={location&&!global? { 
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.001421} : null}    
              >
                {markers.map((item, index) => (
                  <Marker style={styles.marker}
                    key={index} coordinate={{latitude: item.latitude, longitude: item.longitude }} >
                      {item.text?
                        <View style={styles.textMarker} />
                      : null}
                      <View style={styles.markerIconBack} />
                      <Image source={item.icon} style={styles.markerIcon} />
                      {item.text?
                          <Callout style={styles.callout}><Text>{item.text}</Text></Callout>
                      : null}
                  </Marker>
                ))}
              </MapView>
            </>
        </View>
      </View> 
    </TouchableWithoutFeedback>
  );
}

let windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#001945'
  },
  mapContent: {
    flexDirection: 'row', 
    marginTop: '8%', 
    width: '100%', 
    height: '96%'
  },
  menuIcon: {
    margin: 8,
    backgroundColor: 'rgba(0,17,38, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    paddingVertical: 11
  },
  map: {
    width: '100%',
  },
  filter: {
    alignSelf: 'flex-start',
    paddingLeft: '5%',
    flexDirection: 'row'
  },
  signsContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '7%',
    paddingTop: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '76%', 
    marginLeft: '20%',
    zIndex: 9999
  },
  signs: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center'
  },
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
  },
  input: {
    position: 'absolute',
    top: '4%', 
    paddingLeft: '3%',
    borderRadius: 6,
    width: '100%', 
    height: 44,
    backgroundColor: 'white', 
    zIndex: 9999,
  }
});
