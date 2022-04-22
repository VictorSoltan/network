import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapContainer  from './MapContainer';
// import PermissionsButton from './PermissionsButton'

// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Filter from '../assets/menu/all-inclusive.png'
import Signature from '../assets/menu/signature.png'
import Lamp from '../assets/menu/lamp.png'
import User from '../assets/menu/user.png'
import Earth from '../assets/menu/earth-globe.png'

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
import Ι26 from '../assets/signs/chat.webp'
import Ι27 from '../assets/signs/coin.webp'


export default function Map({ navigation }){
  
  // const allIcons = [Ι0, Ι1, Ι2, Ι3, Ι4, Ι5, Ι6, Ι7, Ι8, 
  //   Ι9, Ι10, Ι11, Ι12, Ι13, Ι14, Ι15, Ι16, Ι17, Ι18, Ι19, Ι20, Ι21, Ι22, Ι23, Ι24, Ι25]

  const icons = React.useRef({
    0: [Ι0, Ι1, Ι2, Ι3, Ι4, Ι5, Ι6, Ι7, Ι8],
    1: [Ι9, Ι10, Ι11, Ι12, Ι13],
    2: [Ι14, Ι15, Ι16, Ι17, Ι18, Ι19, Ι20, Ι21],
    3: [Ι22, Ι23, Ι24, Ι25],
    4: [Ι26, Ι27]
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
    [inputValue, setInputValue] = useState(''),
    [global, setGlobal] = useState(false),
    [coins, setCoins] = useState(false),
    me = useRef(null)

  function Global(){
    setGlobal(!global)
    setToggleMenu(false)
    setTextInput(false)
  }

  function TextSelect(){
    setTextInput(!textInput)
    setGlobal(false)
  }

  function seeUserInfo(){
    console.log(me.current)
    navigation.navigate('UserInfo', {nickname: me.current, icons: icons, onlySee: true})
  }
  
  function getCoins(){
    setCoins(false)
  }

  const menu = [
    {icon: Filter, func: getCoins, value: null}, 
    {icon: Signature, func: TextSelect, value: textInput}, 
    {icon: Lamp, func: setToggleMenu, value: toggleMenu}, 
    {icon: Earth, func: Global, value: global}, 
    {icon: User, func: seeUserInfo, value: null}, 
    // {icon: Angry, func: null, value: null}  
  ]

  // const filtersIcons = [emoSigns, ateSigns, pathSigns, forbiddenSigns]
  const filters = [All, Attention, LocationIcon, Forbidden, Actions]

  let [selectedFilter, setFilter] = useState(0)
  let [signsIcon, setSignsIcon] = useState(0);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {textInput ? 
          <TextInput 
            style={styles.input}
            placeholder={'Enter a text and set a mark'}
            onChangeText={text => setInputValue(text)}
            value={inputValue}
            maxLength={80}
          />
        :null}
        <View style={styles.mapContent}>
          <View style={{position: 'absolute', top: '5%', width: '20%', height: '40%', zIndex: 1000}}>
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
              <MapContainer  isKeyboardVisible={isKeyboardVisible} global={global} icons={icons} selectedFilter={selectedFilter} signsIcon={signsIcon} inputValue={inputValue} me={me} navigation={navigation} coins={coins} setCoins={setCoins}/>
              {/* <PermissionsButton/> */}
            </>
        </View>
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
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row', 
    // marginTop: '8%', 
    width: '100%', 
    height: '94%'
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
  }
});
