import React, {useState, useEffect, useRef} from 'react';
// import AppLoading from 'expo-app-loading';
import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Dimensions, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
// import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold} from '@expo-google-fonts/poppins';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import ArrowLeft from '../assets/arrow-left.webp'
import ArrowUp from '../assets/arrow_up.webp'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client'

export default function Chat({ route, navigation }) {
  // let [fontsLoaded] = useFonts({
  //   Poppins_400Regular,
  //   Poppins_500Medium,
  //   Poppins_600SemiBold
  // });   
  
  let [message, changeMessage] = React.useState(""),
    [scrollArea, setScrollArea] = React.useState(null),
    {index,me} = route.params,
    hash = useRef(null),
    [socket, setSocket] = useState(null);

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

   let [chatMessaged, setChatMessaged] = useState()

  useEffect( async () => {
    hash.current = await AsyncStorage.getItem('@user_hash')
    console.log('socket connection')
    const newSocket = io(`https://network-back.herokuapp.com/`)      
    setSocket(newSocket)
    console.log('socket connected')

  }, [])
  useEffect(() => {
    if(socket){
      socket.emit('get chat', {identity: index, hash: hash.current}, function(event){
        setChatMessaged(event.messages)
      })  

      socket.on(`get messages ${index}`, function(event){
        setChatMessaged(event.messages)
      })
    }
  }, [socket])

  function sendMessage(){
    console.log('send ', message)
    if(message!==""){
      socket.emit('transfer message', {
        hash: hash.current,
        message: message,
        identity: index,
        name: me.current
      })
    }
  }

  let [notification, setNotification] = useState(false)
    return(
    <TouchableWithoutFeedback onPress={!isKeyboardVisible ? () => Keyboard.dismiss : scrollArea.scrollToEnd({ animated: true })} accessible={false}>
      <View style={styles.chat}>
        {notification ? 
          <View style={styles.notification}>
            <View style={{flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center'}}>
              <Text style={{color: '#112B66', fontSize: 16, }}>CALENDAR UPDATE</Text>
              <View style={styles.notificationDot} />
              <Text style={styles.minutesPast}>5 minutes ago</Text>
            </View>
            <Text style={{alignSelf: 'flex-start', fontSize: 18}}>New Message</Text>
          </View>             
        :null}
        <View style={styles.chatHeader}>
          <View style={styles.header}>
              <TouchableOpacity style={styles.contact} onPress={() => navigation.goBack()}>
                <Image source={ArrowLeft} style={styles.arrow} tintColor="#a2f6f7"/>             
              </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.container, {maxHeight: isKeyboardVisible ? Dimensions.get('window').height/100*38 : Dimensions.get('window').height/100*67}]}>
        <ScrollView ref={ref => setScrollArea(ref)} onScroll={(event) => {console.log(event.nativeEvent.contentOffset.y)}}
          onContentSizeChange={() => scrollArea.scrollToEnd({ animated: true })}>
          {chatMessaged && chatMessaged.map((item, index) => (
              <View onStartShouldSetResponder={() => true} key={index} style={[{display: 'flex', justifyContent: 'space-between', backgroundColor: '#121212'}, item.name === me.current ? {alignItems: 'flex-end'} : {alignItems: 'flex-start'}]}>
                <View  key={index} style={[{ width: '70%', marginTop: '1%'}, item.name===me.current ? {marginRight: '4%'} : {marginLeft: '4%'}]}>
                  <Text style={[{color: 'white'}, item.receiver ? {alignSelf: 'flex-end'} : {alignItems: 'flex-start'}]}>{item.name}</Text>
                  <View  style={[styles.message, item.name===me.current ? styles.receiver : styles.sender]}>
                    <Text style={[item.name===me.current ? {color: '#a2f6f7'} : {color: 'white'}]}>{item.message}</Text>
                  </View>
                </View>
                <View style={[styles.TriangleShapeCSS, item.name===me.current ? styles.TriangleShapeRightCSS : styles.TriangleShapeLeftCSS]} />
              </View>
          ))}
          </ScrollView>    
        </View>
        <View style={[styles.messageInput, {bottom: isKeyboardVisible ? Dimensions.get('window').height/100*1 : Dimensions.get('window').height/100*4}]}>
          <TextInput
            style={styles.input}
            onChangeText={changeMessage}
            value={message}
            placeholder="Type here..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage()}>
            <Image source={ArrowUp} style={{width: 12, height: 18}} tintColor="#a2f6f7"/>
          </TouchableOpacity>      
        </View>      
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  chat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#121212',
    marginTop: '7%'
  },
  notification: {
    position: 'absolute', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    top: '5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '95%',
    paddingVertical: '1%',
    padding: '4%',
    zIndex: 9999
  },
  notificationDot: {
    margin: 4, 
    marginLeft: '1.4%', 
    marginBottom: '1%', 
    borderRadius: 160, 
    width: 5, 
    height: 5, 
    backgroundColor: '#C4C4C4'
  },
  minutesPast: {
    marginBottom: '0.5%', 
    color: '#979797', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginTop: '5%',
    padding: '3%',
    paddingBottom: '6%'
  },
  header: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '96%'
  },
  contact: {
    backgroundColor: 'rgba(0,30,100, 1)',
    borderRadius: 190,
    padding: '5%',
  },
  arrow: {
    width: 14, 
    height: 14,
  },
  button: {
    backgroundColor: '#D0C921',
    padding: '3%',
    width: '80%',
    borderRadius: 100,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 20,
    color: 'white'
  },
  container: {
    marginTop: '2%',
    paddingBottom: StatusBar.currentHeight,
    width: '100%'
  },  
  message: {
    borderRadius: 10,
    padding: '5%',
    paddingVertical: '6%'
  },
  sender: {
    backgroundColor: '#112B66',
    borderBottomLeftRadius: 0
  },
  receiver: {
    backgroundColor: 'rgba(0,37,70, 1)',
    borderBottomRightRadius: 0
  },
  TriangleShapeCSS: {
    marginTop: -1,
    width: 0,
    height: 0,
    borderTopWidth: 16,
    borderStyle: 'solid',
    borderLeftColor: '#121212',
    borderRightColor: '#121212'
  },
  TriangleShapeLeftCSS: {
    borderRightWidth: 22,
    marginLeft: '4%',
    borderTopColor: '#121212',
  }, 
  TriangleShapeRightCSS: {
    borderLeftWidth: 22,
    marginRight: '4%',
    alignSelf: 'flex-end',
    borderTopColor: 'rgba(0,37,70, 1)',
  },
  messageInput: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#0a0020',
    width: '94%',
    margin: 12,
    padding: '4%',
    paddingLeft: '5%',
    paddingRight: '20%',
    borderColor: '#E8E8E8',
    borderRadius: 100,
    borderWidth: 1,
    color: 'white',
    
  },  
  sendButton: {
    position: 'absolute', 
    right: '11%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#112B66',
    borderRadius: 190,
    width: 40, 
    height: 40
  }  
})