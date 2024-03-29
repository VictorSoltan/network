import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Text, Image, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapContainer  from './MapContainer';
// import PermissionsButton from './PermissionsButton'

// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Filter from '../assets/menu/all-inclusive.png'
import Coin from '../assets/menu/coin.png'
import Signature from '../assets/menu/signature.png'
import Lamp from '../assets/menu/lamp.png'
import User from '../assets/menu/user.png'
import Earth from '../assets/menu/earth-globe.png'
import Finish from '../assets/menu/finish.png'
import Loupe from '../assets/menu/loupe.png'

// import Wallet from '../assets/menu/digital-wallet.png'

import All from '../assets/filter/all.png'
import Attention from '../assets/filter/attention.png'
import LocationIcon from '../assets/filter/location.png'
import Forbidden from '../assets/filter/forbidden.png'
import Actions from '../assets/filter/actions.png'

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
import Ι26 from '../assets/signs/0026.webp'
import Chat from '../assets/signs/chat.webp'
import CoinIcon from '../assets/signs/coin.webp'
import Rock from '../assets/signs/rock.webp'


export default function Map({ route, navigation }){

  const icons = React.useRef({
    0: [Ι0, Ι1, Ι2, Ι3, Ι4, Ι5, Ι6, Ι7, Ι8],
    1: [Ι9, Ι10, Ι11, Ι12, Ι13],
    2: [Ι14, Ι15, Ι16, Ι17, Ι18, Ι19, Ι20, Ι21],
    3: [Ι22, Ι23, Ι24, Ι25, Ι26],
    4: [Chat, CoinIcon],
    5: [Rock]
  })
  
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
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
    [searchInput, setSearchInput] = useState(false),
    [inputValue, setInputValue] = useState(''),
    [global, setGlobal] = useState(false),
    [coins, setCoins] = useState(false),
    [path, setPath] = useState(false),
    me = useRef(null)

  function Global(){
    setGlobal(!global)
    setToggleMenu(false)
    setTextInput(false)
  }

  function TextSelect(){
    setTextInput(!textInput)
    setGlobal(false)
    setSearchInput(false)
  }

  function seeUserInfo(){
    console.log(me.current)
    navigation.navigate('UserInfo', {nickname: me.current, icons: icons, onlySee: true})
  }
  
  function togglePath(){
    setPath(!path)
  }

  function getCoins(){
    setCoins(!coins)
  }

  function toggleSearch(){
    setTextInput(false)
    setSearchInput(!searchInput)
  }

  function searchUser(){
    navigation.navigate('UserInfo', {nickname: inputValue, me: me, icons: icons, onlySee: false})
  }

  const menu = [
    {icon: coins ? Coin : Filter, func: getCoins, value: null}, 
    {icon: Signature, func: TextSelect, value: textInput}, 
    {icon: Lamp, func: setToggleMenu, value: toggleMenu}, 
    {icon: Earth, func: Global, value: global}, 
    {icon: User, func: seeUserInfo, value: null}, 
    {icon: Finish, func: togglePath, value: null},
    {icon: Loupe, func: toggleSearch, value: null}
  ]

  // const filtersIcons = [emoSigns, ateSigns, pathSigns, forbiddenSigns]
  const filters = [All, Attention, LocationIcon, Forbidden, Actions]

  let [selectedFilter, setFilter] = useState(0)
  let [signsIcon, setSignsIcon] = useState(0);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {(textInput||searchInput) && 
        <View style={{flexDirection: 'row', alignItems: 'center', position: 'absolute', top: '4%', justifyContent: 'space-between',  alignSelf: 'center', width: '98%'}}>
          <TextInput 
            style={[styles.input, searchInput ? {width: '90%'} : null]}
            placeholder={textInput ? 'Enter a text and set a mark' : 'Enter a username'}
            onChangeText={text => setInputValue(text)}
            value={inputValue}
            maxLength={80}
          />
            {searchInput &&
              <TouchableOpacity style={{backgroundColor: 'rgba(0,17,30, 0.8)', padding: '1.4%', zIndex: 99999}} onPress={() => searchUser()}>
                <Text style={{color: '#a2f6f7'}}>Go</Text>
              </TouchableOpacity>}
        </View>}
        <View style={styles.mapContent}>
          <View style={{position: 'absolute', top: '5%', width: '20%', height: '60%', zIndex: 1000}}>
            {menu.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.menuIcon, item.value ? {backgroundColor: 'rgba(0,17,30, 1)'} : null, ]} onPress={item.func ? () => item.func(!item.value) : null}>
                <Image source={item.icon} style={{width: 24, height: 24, opacity: 0.8}} tintColor="#a2f6f7"/>
              </TouchableOpacity>
            ))}
          </View>
          {/* <View style={{position: 'absolute', top: '5%', right: '12%', width: '30%', height: '8%', zIndex: 1000}}>
            <TouchableOpacity style={[styles.menuIcon, {display: 'flex', width: '120%', flexDirection: 'row', borderRadius: 8, paddingVertical: 4, alignItems: 'center', backgroundColor: 'rgba(0,17,30, 0.8)'}]}
              onPress={() => navigation.navigate('Wallet')}>
                <Text style={{color: 'white'}}>Sol: {Number(balance.sol).toFixed(2)}; </Text>
                <Text style={{color: 'white'}}>Nft: 0; </Text>
                <Image source={Wallet} style={{width: 24, height: 24, opacity: 0.8, marginBottom: 2}} tintColor="#a2f6f7"/>
            </TouchableOpacity>
          </View> */}
            <>
              {toggleMenu ?
                <View style={styles.signsContainer}>
                 <View style={styles.filter}>
                  {filters.map((item, index) => (
                    <TouchableOpacity key={index} style={{margin: 10}} onPress={() =>  {setFilter(index)}}>
                      <Image source={item} style={{width: 30, height: 30}} tintColor="#a2f6f7"/>
                    </TouchableOpacity>
                  ))}
                  </View>
                  <View style={styles.signs}>
                    {icons.current[selectedFilter].map((item, index) => (
                      <TouchableOpacity key={index} style={{margin: 10}} onPress={() =>  {setSignsIcon(index), setToggleMenu(!toggleMenu)}}>
                        <Image source={item} style={{width: 30, height: 30}} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              : null}  
              <MapContainer style={styles.map} isKeyboardVisible={isKeyboardVisible} global={global} icons={icons} selectedFilter={selectedFilter} signsIcon={signsIcon} inputValue={inputValue} me={me} route={route} navigation={navigation} coins={coins} setCoins={setCoins} path={path} setPath={setPath} />
              {/* <PermissionsButton/> */}
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
  },
  input: {
    paddingLeft: '3%',
    borderRadius: 6,
    width: '100%', 
    height: 44,
    backgroundColor: 'white', 
    zIndex: 9999,
  },
  mapContent: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row', 
    width: '100%', 
    height: windowHeight
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
    width: '100%'
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
    backgroundColor: 'rgba(0,0,20,0.5)',
    width: '76%', 
    marginLeft: '20%',
    zIndex: 9999
  },
  signs: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center'
  }
});
