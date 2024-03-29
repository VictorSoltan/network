import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, Text, Vibration, TouchableOpacity, Image, ToastAndroid, Button } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Like from '../assets/map/like.png'
import Dislike from '../assets/map/dislike.png'
import Notification from './Notification';
import Ι26 from '../assets/signs/chat.webp'
import Start from '../assets/signs/start.webp'
import Check from '../assets/signs/check.webp'

import { io } from 'socket.io-client'

import { schedulePushNotification } from './Notification';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MapContainer({isKeyboardVisible, global, icons, selectedFilter, signsIcon, inputValue, me, route, navigation, coins, setCoins, path, setPath}){
  
  const 
    [location, setLocation] = useState({latitude: 1, longitude: 1}),
    [errorMsg, setErrorMsg] = useState(null)

  let [markerMenu, setMarkerMenu] = useState(false),
        [openChat, setOpenChat] = useState(false),
      [icon, setIcon] = useState(Ι26),
      [indx, setIndx] = useState(0),
      sign = useRef(null),
      author = useRef(null),
      [socket, setSocket] = useState(null),
      [markers, setMarkers] = useState([]),
      [trackMarkers, setTrackMarkers] = useState([]),
      hash = useRef(null),
      { markToFollow, friend } = route?.params || {};
  console.log('friend ', friend)
  useEffect( async () => {
      hash.current = await AsyncStorage.getItem('@user_hash')
      console.log('socket connection')
      const newSocket = io(`https://network-back.herokuapp.com/`)      
      setSocket(newSocket)
      console.log('socket connected')
      console.log('markToFollow ', markToFollow)
      if(markToFollow){
        setMarkers([markToFollow])
        setIndx(markToFollow)
        setPath(true)
      }
      if(friend){
        console.log('friend1')
        socket.emit('transfering friends marks', {hash: hash.current, friend: friend}, function(event){
          console.log('friends marks ', event)
          setMarkers(event)
        })
        setIndx([])
      }
    }, [markToFollow, friend])




  useEffect(() => {
    if(socket&&hash.current&&!coins&&!markToFollow&&!friend){
      setMarkerMenu(false)
      socket.emit('authenticate', hash.current, function(event) {me.current = event})
      socket.on('create user', function(event){
        // navigation.navigate("Wallet") 
      })
      const loadMarkers = (message) => {
        setMarkers(message)
      }
      socket.on('transfering marks', loadMarkers)
      socket.on('too close', function(event){
        ToastAndroid.show("Too close to others marks", ToastAndroid.SHORT)
      })
    }
  }, [socket, coins])
  
  useEffect(() => {
    if(socket&&hash.current&&coins){
      setMarkerMenu(false)
      console.log(hash.current)
      socket.emit('get coins', hash.current, function(event) {
        console.log(event)
        setMarkers(event)
      })
      socket.on('good job', async function(){
        ToastAndroid.show("U collected all coins, bravo!", ToastAndroid.SHORT);
        await socket.emit('add mark', {
          hash: hash.current,
          filterIndex: 5,
          signIndex: 0,
          longitude: location.longitude,
          latitude: location.latitude,
          text: 'This user collected all coins in coin game!'
        })
        setCoins(false)
      })
    }
  }, [socket, coins])

  useEffect(() => {
    if(!global){
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }else{
          await Location.getCurrentPositionAsync({});
          foregroundSubscrition = Location.watchPositionAsync(
            {
              // Tracking options
              accuracy: Location.Accuracy.High,
              distanceInterval: 10,
            }, location => {
              setLocation(location.coords)
              // trackUser()
            })
        }
      })();
    }
  }, [global]);

 function addMarker(e){
     Vibration.vibrate(80)
    if(friend){
      console.log('add mark for friend')
      socket.emit('add mark for friend', {
        name: friend,
        hash: hash.current,
        filterIndex: selectedFilter,
        signIndex: signsIcon,
        longitude: e.nativeEvent.coordinate.longitude,
        latitude: e.nativeEvent.coordinate.latitude,
        text: inputValue
      }, function(event){
        setMarkers(event)
      })
    }else{
      if(Math.abs(location.latitude-e.nativeEvent.coordinate.latitude)   <0.0008
      &&Math.abs(location.longitude-e.nativeEvent.coordinate.longitude)<0.0008){
        Vibration.vibrate(120)
        socket.emit('add mark', {
          hash: hash.current,
          filterIndex: selectedFilter,
          signIndex: signsIcon,
          longitude: e.nativeEvent.coordinate.longitude,
          latitude: e.nativeEvent.coordinate.latitude,
          text: inputValue
        })
        if(selectedFilter===4&&signsIcon===1){
          ToastAndroid.show("Starting coin game!", ToastAndroid.SHORT);
          socket.emit('coin game', {
            hash: hash.current,
            filterIndex: selectedFilter,
            signIndex: signsIcon,
            longitude: e.nativeEvent.coordinate.longitude,
            latitude: e.nativeEvent.coordinate.latitude
          })
          setCoins(true)
        }
      } else ToastAndroid.show("U trying to set mark too far from your location", ToastAndroid.SHORT);
    }
  }

  function setLike(type, e){
    console.log(e)
    socket.emit('check mark', {
      hash: hash.current,
      type: type,
      id: e._id
    })
  }


  function trackUser() {
    console.log('track')
    if(location&&markers.length){
      let bal = false
      let i = 0, len = markers.length;
      while (i < len) {
        if(Math.abs(location.latitude-markers[i].latitude)   <0.00004
        &&Math.abs(location.longitude-markers[i].longitude)<0.00004){
          if(!markers[i].checked.includes(me.current)){
            console.log('mark passed')
            bal = true
            setLike('check', markers[i])
            sign.current = markers[i].text
            author.current = markers[i].name
          }
          break
        }
        i++
      }  
      if(bal){
        schedulePushNotification(sign.current, author.current)
        console.log('mooving')
      }
    }
  }

  function setTrackItem(index){
    let newArr = [...markers]
    newArr[index].value = false
    setMarkers(newArr)
  }

  function openMenu(index){
    console.log(index)
    setMarkerMenu(true)
    setIndx(index)
    if(Math.abs(location.latitude-index.latitude)<0.0009
    &&Math.abs(location.longitude-index.longitude)<0.0009) {
      if(index.filterIndex===4){
        if(index.signIndex===0) setIcon(Ι26)
        else if(index.signIndex===1) setIcon(Start)
        setOpenChat(true)
      }else{
        setOpenChat(false)
      }
    }
    else { setOpenChat(false)
      ToastAndroid.show("Too far!", ToastAndroid.SHORT);
    }
  }

  function openMessanger(indx){
    console.log(indx)
    if(Math.abs(location.latitude-indx.latitude)<0.0009
    &&Math.abs(location.longitude-indx.longitude)<0.0009){
      if(indx.filterIndex===4&&indx.signIndex===0){
        console.log(indx._id)
        navigation.navigate('Chat', {index: indx._id, me: me})
      }else if(indx.filterIndex===4&&indx.signIndex===1){
        if(coins){
          Vibration.vibrate(50)
          socket.emit('collect coin', {mark: indx, hash: hash.current}, function(event){
            setMarkerMenu(false)
            setMarkers(event)
            ToastAndroid.show("Keep on keep it on!", ToastAndroid.SHORT);
          })
        }else{
          setCoins(true)
        }
      }
    }else{
      ToastAndroid.show("Too far!", ToastAndroid.SHORT);
    }
  }
  const origin = {latitude: 37.3318456, longitude: -122.0296002};
  const destination = {latitude: 37.771707, longitude: -122.4053769};
  const GOOGLE_MAPS_APIKEY = 'AIzaSyBgVeCnfY8ngGO4Qlo8l07yf8gvwztJCOc';
  return(
    <>
      <Notification />
      <MapView
        onStartShouldSetResponder={!isKeyboardVisible ? () => true : null}
        style={{position: 'absolute', top: '1%', width: '100%', height: '99%'}}
        onLongPress={location&&socket ? e => addMarker(e) : null}
        mapType = {'hybrid'}
        userInterfaceStyle={'dark'}
        showsMyLocationButton={false}
        onPress={() => setMarkerMenu(false)}
        zoomEnabled={true} scrollEnabled={true}
        showsUserLocation={true}
        tracksViewChanges={true}
        loadingEnabled={true}
        moveOnMarkerPress={global}
        region={location&&!global ? { 
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.001421} :           
          {latitudeDelta: 0.002,
          longitudeDelta: 0.001421}
        }    
      >
        {path&&indx &&
          <MapViewDirections
            lineDashPattern={[1]}
            lineCap="square"
            origin={{latitude: location.latitude,
            longitude: location.longitude}}
            destination={{latitude: indx.latitude,
            longitude: indx.longitude}}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="#90e3f9"
          />
        }
        {markers.length ? markers.map((item, index) => (
          <>
          {(item.name===me.current||item.filterIndex!==4||item.signIndex!==1) &&
            <Marker onPress={() => openMenu(item)} key={index} style={styles.marker}
               tracksViewChanges={item.value} coordinate={{latitude: item.latitude, longitude: item.longitude }} >
                {item.text?
                  <View style={styles.textMarker} />
                : null}
                <Image source={icons.current[item.filterIndex][item.signIndex]} style={styles.markerIcon} onLoad={() => setTrackItem(index)} />
                {item.likeAdded&&item.dislikeAdded &&
                <Text style={styles.like}>{item.likeAdded.length}/{item.dislikeAdded.length}</Text>}
                <Callout tooltip={true} style={!coins ? styles.callout : {display: 'none'}} onPress={ !coins ? () =>          
                  navigation.navigate('UserInfo', {nickname: item.name, me: me, icons: icons, onlySee: item.name === me.current?  true : false }
                ) : null}>
                  <Text style={!coins ? styles.author : {display: 'none'}}>{item.name}</Text>
                  {item.text!== '' &&
                    <Text style={{color: 'white', textAlign: 'center'}}>{item.text}</Text>}
                </Callout>
            </Marker>}
            </>
        )) : null}
      </MapView>
      {markerMenu &&
        <View style={{position: 'absolute', bottom: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: '30%',  zIndex: 100000}}>
          <TouchableOpacity style={{backgroundColor: 'rgba(72, 156, 220, 0.5)', padding: '6%', borderRadius: 60}} onPress={() => setLike('like', indx)}>
            <Image tintColor="white" style={{height: 22, width: 22}} source={Like} />
          </TouchableOpacity>
          {openChat &&
          <TouchableOpacity style={{backgroundColor: 'rgba(72, 156, 220, 0.5)', padding: '6%', borderRadius: 60}} onPress={() => openMessanger(indx)}>
            <Image tintColor="white" style={{height: 22, width: 22}} source={!coins ? icon : Check} />
          </TouchableOpacity>}          
          <TouchableOpacity style={{backgroundColor: 'rgba(110, 30, 80, 0.5)', padding: '6%', borderRadius: 60}} onPress={() => setLike('dislike', indx)}>
            <Image tintColor="white" style={{height: 22, width: 22}} source={Dislike} />
          </TouchableOpacity> 
        </View>} 
    </>
  )
}

let windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  marker: {
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'visible',
    height: 47
  },
  textMarker: {
    position: 'absolute', 
    top: 0, 
    width: 6, 
    height: 6, 
    backgroundColor: 'rgba(12, 255, 255, 1)', 
    borderRadius: 4, 
    zIndex: 9999
  },
  markerIconBack: {
    position: 'absolute',
    backgroundColor: 'rgba(2, 140, 180, 0.5)', 
    borderRadius: 60,
    width: 40, 
    height: 40,
  },
  markerIcon: {
    width: 22, 
    height: 26,
  },
  like: {
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    fontSize: 11
  },
  callout: {
    position: 'absolute', 
    width: 160,
    borderRadius: 4,
    backgroundColor: 'rgba(1, 150, 180, 0.6)',
  },
  author: {
    textAlign: 'center',
    color: 'white',
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#a2f6f7"
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