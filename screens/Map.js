import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Callout, AnimatedRegion } from 'react-native-maps';
import axios from 'axios'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Position from '../assets/rec.png'

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
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  let [toggleMenu, setToggleMenu] = useState(false);
  let [textInput, setTextInput] = useState(false);
  let [inputValue, setInputValue] = useState('');
  let [global, setGlobal] = useState(false);

  let [menuItem, setMenuItem] = useState(null);

  function Global(){
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

  let [region, setRegion] = useState(null)

  useEffect(() => {
    (async () => {
      if(!location){
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location)}

      await Location.watchPositionAsync(
        {accuracy:Location.Accuracy.High},
        (loc) => {setLocation(loc)});
        console.log('s')
    })();
  }, [region]);

  
  let [markers, setMarkers] = useState([])
  let [markersLength, setMarkersLength] = useState(null)

  function addMarker(e) {
    let newArr = [...markers];
    newArr.push({
      'latitude': e.nativeEvent.coordinate.latitude, 
      'longitude': e.nativeEvent.coordinate.longitude, 
      'icon': signsIcon,
      'text': inputValue})
    setMarkers(newArr);
    let textForPost = inputValue 
    if(!inputValue){
      textForPost = 'WhiteHorseInMyNose'
    }
    axios.post(`http://5.187.6.228:49280/api/createIcon/${signsIcon}/${textForPost}/${e.nativeEvent.coordinate.latitude}/${e.nativeEvent.coordinate.longitude}/`)
  }
    useEffect(() => {
      (async () => {
        let info = await axios.get('http://5.187.6.228:49280/api/icon_view/')
        let newArr = [...markers];
        for(let x=0; x<info.data.length; x++){
          newArr.push({
            'latitude': Number(info.data[x].latitude), 
            'longitude': Number(info.data[x].longitude), 
            'icon': allIcons[Number(info.data[x].icon)-12],
            'text': info.data[x].text})
          setMarkers(newArr);
        }
      })();
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, global||textInput ? {marginTop: '8%'} : null]}>
        {global ?
          <View style={{width: '100%', zIndex: 9999}}>
           <GooglePlacesAutocomplete
           placeholder='Search'
           onPress={(data, details = null) => {
             // 'details' is provided when fetchDetails = true
             console.log(data, details);
           }}
           query={{
             key: 'AIzaSyDu5sG7_BAf3o6HG9Cwx19BcgFV7w-d6W8',
             language: 'en',
           }}
          />
        </View>
        : textInput ? 
          <TextInput 
            style={styles.input}
            placeholder={'Type text for icon'}
            onChangeText={text => setInputValue(text)}
            value={inputValue}
            maxLength={80}
          />
        :null}
        <View style={[styles.mapContent, global||textInput ? {marginTop: '8%'} : null]}>
          <ScrollView style={{position: 'absolute', top: '5%', width: '20%', zIndex: 9999}}>
            {menu.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.menuIcon, item.value ? {backgroundColor: 'rgba(20,32,32, 1)'} : null, ]} onPress={item.func ? () => item.func(!item.value) : null}>
                <Image source={item.icon} style={{width: 28, height: 28}} tintColor="#a2f6f7"/>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
                onStartShouldSetResponder={!textInput ? () => true : null}
                style={{position: 'absolute', width: '100%', height: windowHeight}}
                onLongPress={!global&&location ? e => addMarker(e) : null}
                mapType = {'hybrid'}
                zoomEnabled={global} scrollEnabled={global}
                showsUserLocation={!global}
                moveOnMarkerPress={false}
                followsUserLocation={!global}
                onUserLocationChange={!global ? () => (setRegion(!region), console.log('update')): null}
                region={location? { 
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.001421}: null}    
              >
                 {markers.map((item, index) => (
                  <Marker key={index}
                    coordinate={{latitude: item.latitude, longitude: item.longitude }} >
                    <Image source={item.icon} style={styles.markerIcon} />
                    {item.text?
                      <Callout><Text style={{width: '100%', height: '100%'}}>{item.text}</Text></Callout>
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
    margin: 10,
    backgroundColor: 'rgba(2,8,13, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    paddingVertical: 6,
    borderColor: '#0290b7',
    borderWidth: 1.4,
    borderRadius: 2
  },
  map: {
    width: '100%',
    height: windowHeight,
    // backgroundColor: 'blue',
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
  markerIcon: {
    width: 22, 
    height: 22,
  },
  input: {
    position: 'absolute',
    // top: '5%', 
    width: '100%', 
    height: 36,
    backgroundColor: 'white', 
    borderBottomWidth: 2, 
    borderColor: 'rgba(56,123,172, 1)',
    zIndex: 9999,
  }
});
