import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapContainer  from './MapContainer';
import axios from 'axios'
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Filter from '../assets/menu/filter.png'
import Signature from '../assets/menu/signature.png'
import Lamp from '../assets/menu/lamp.png'
import Settings from '../assets/menu/settings.png'
import Earth from '../assets/menu/earth-globe.png'

import All from '../assets/filter/all.png'
import Attention from '../assets/filter/attention.png'
import LocationIcon from '../assets/filter/location.png'
import Forbidden from '../assets/filter/forbidden.png'

import Ι0 from '../assets/signs/0000.webp'
import Ι1 from '../assets/signs/0001.webp'
import Ι2 from '../assets/signs/0002.webp'
import Ι3 from '../assets/signs/0003.webp'
import Ι4 from '../assets/signs/0004.webp'
import Ι5 from '../assets/signs/0005.webp'
import Ι6 from '../assets/signs/0006.webp'
import Ι7 from '../assets/signs/0007.webp'
import Ι8 from '../assets/signs/0008.webp'
import Ι9 from '../assets/signs/0009.webp'
import Ι10 from '../assets/signs/0010.webp'
import Ι11 from '../assets/signs/0011.webp'
import Ι12 from '../assets/signs/0012.webp'
import Ι13 from '../assets/signs/0013.webp'
import Ι14 from '../assets/signs/0014.webp'
import Ι15 from '../assets/signs/0015.webp'
import Ι16 from '../assets/signs/0016.webp'
import Ι17 from '../assets/signs/0017.webp'
import Ι18 from '../assets/signs/0018.webp'
import Ι19 from '../assets/signs/0019.webp'
import Ι20 from '../assets/signs/0020.webp'
import Ι21 from '../assets/signs/0021.webp'
import Ι22 from '../assets/signs/0022.webp'
import Ι23 from '../assets/signs/0023.webp'
import Ι24 from '../assets/signs/0024.webp'
import Ι25 from '../assets/signs/0025.webp'


export default function Map() {
  
  let [markers, setMarkers] = useState([])
  
  const allIcons = [Ι0, Ι1, Ι2, Ι3, Ι4, Ι5, Ι6, Ι7, Ι8, 
    Ι9, Ι10, Ι11, Ι12, Ι13, Ι14, Ι15, Ι16, Ι17, Ι18, Ι19, Ι20, Ι21, Ι22, Ι23, Ι24, Ι25]

  const
    emoSigns = [Ι0, Ι1, Ι2, Ι3, Ι4, Ι5, Ι6, Ι7, Ι8],
    ateSigns = [Ι9, Ι10, Ι11, Ι12, Ι13],
    pathSigns = [Ι14, Ι15, Ι16, Ι17, Ι18, Ι19, Ι20, Ι21],
    forbiddenSigns = [Ι22, Ι23, Ι24, Ι25]


  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  // let [region, setRegion] = useState({
  //   "latitude": 10.1,
  //   "longitude":  50.1,
  //   "latitudeDelta": 300,
  //   "longitudeDelta": 300})
  
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


  let [toggleMenu, setToggleMenu] = useState(false),
    [textInput, setTextInput] = useState(false),
    [inputValue, setInputValue] = useState(''),
    [global, setGlobal] = useState(false),
    [notifiocation, setNotifiocation] = useState(false)

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

  const filtersIcons = [emoSigns, ateSigns, pathSigns, forbiddenSigns]
  const filters = [All, Attention, LocationIcon, Forbidden]

  let [selectedFilter, setFilter] = useState(filtersIcons[0])
  let [signsIcon, setSignsIcon] = useState(selectedFilter[0]);
  
  function addMarker(location, e) {
    if(location&&markers.length!==0){
      let bool = true
      for(let x=0; x<markers.length; x++){
        if(Math.abs(e.nativeEvent.coordinate.latitude-markers[x].latitude)   <0.00008
          &&Math.abs(e.nativeEvent.coordinate.longitude-markers[x].longitude)<0.00006){
          bool=false
        }
      }  
      if(bool){
        markers = [...markers]
        markers.push({
          latitude: e.nativeEvent.coordinate.latitude, 
          longitude: e.nativeEvent.coordinate.longitude, 
          icon: signsIcon,
          like: 0,
          dislike: 0,
          likeAdded: false,
          dislikeAdded: false,
          checked: false,
          value: true,
          text: inputValue})
        setMarkers(markers);
        let textForPost = inputValue 
        if(!inputValue){
          textForPost = 'WhiteHorseInMyNose'
        }
        axios.post(`http://208.69.117.77:8000/api/createIcon/${signsIcon}/${textForPost}/${e.nativeEvent.coordinate.latitude}/${e.nativeEvent.coordinate.longitude}/`)
      }else{
        setNotifiocation(true)
        setTimeout(() => setNotifiocation(false), 1000)
      }
    }    
  }
  function setLike(e, indx){   
    markers = [...markers]
    if(e==='like'){
      if(!markers[indx].likeAdded){
        markers[indx].like = markers[indx].like+1 
      }
      if(markers[indx].dislikeAdded){
        markers[indx].dislike = markers[indx].dislike-1 
      }
      markers[indx].likeAdded = true 
      markers[indx].dislikeAdded = false 

    }else{
      if(markers[indx].likeAdded){
        markers[indx].like = markers[indx].like-1 
      }
      if(!markers[indx].dislikeAdded){
        markers[indx].dislike = markers[indx].dislike+1 
      }
      markers[indx].dislikeAdded = true 
      markers[indx].likeAdded = false 

    }
    setMarkers(markers);
    axios.post(`http://208.69.117.77:8000/api/like/${markers[indx].latitude}/${markers[indx].longitude}/${markers[indx].date}/${e}/Victor/`)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {textInput ? 
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
              <MapContainer  isKeyboardVisible={isKeyboardVisible} addMarker={addMarker} global={global} markers={markers} setMarkers={setMarkers} allIcons={allIcons} setLike={setLike} />
            </>
        </View>
        {notifiocation ?
          <Text style={styles.notification} >Too close to others markers</Text>
        : null}
      </View> 
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
