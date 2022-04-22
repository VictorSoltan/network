import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client'

export default function UserInfo({ route, navigation }){
    
    let
        {nickname, icons, onlySee} = route.params,
        hash = useRef(null),
        [socket, setSocket] = useState(null),
        [user, setUser] = useState(null),
        [markers, setMarkers] = useState([])
        
    console.log(nickname)
    useEffect( async () => {
        hash.current = await AsyncStorage.getItem('@user_hash')
        console.log('socket connection')
        const newSocket = io(`https://network-back.herokuapp.com/`)      
        setSocket(newSocket)
        console.log('socket connected')
    }, [])

    useEffect(() => {
        if(socket&&hash.current){
          socket.emit('authenticate', hash.current, function(event) {})
          const loadMarkers = (message) => {
            setMarkers(message.filter(item => item.name===nickname))
          }
          socket.on('transfering marks', loadMarkers)
          socket.emit('get user', {nickname}, function(event){
            console.log('get user ', event)
            setUser(event)
          })
          socket.on('transfering user', function(event){
            setUser(event)
          })
        }
    }, [socket])

    function interactionWithUser(type){
        socket.emit('interaction with user', {
            type: type,
            nickname: nickname
        })
    }

    return(
        <View style={styles.container}>

            {user &&
                <View style={styles.userInfo}>
                    <Text style={styles.user}>{'User: ' + user.name}</Text>
                    <Text style={styles.text}>{'Followers: ' + user.followers.length}</Text>
                    <Text style={styles.text}>{'Follow: ' + user.follows.length}</Text>
                    <Text style={styles.text}>{'Likes: ' + user.likes.length}</Text>
                </View>}
            <ScrollView style={styles.scroll}>
                {markers.map((item, index) => (
                    <View key={index} style={styles.info}>
                        <View style={styles.marker}>
                            <View style={styles.markerIconBack} />
                            <Image style={styles.markerIcon} source={icons.current[item.filterIndex][item.signIndex]} style={styles.markerIcon} />
                            <Text style={styles.like}>{item.likeAdded.length}/{item.dislikeAdded.length}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 12, color: 'white' }}>{'longitude ' + item.longitude}</Text>
                            <Text style={{ fontSize: 12, color: 'white' }}>{'latitude ' + item.latitude}</Text>
                            {item.likeAdded.length>0 &&
                            <Text style={null}>{'liked by ' + item.likeAdded}</Text>}
                            {item.dislikeAdded.length>0 &&
                            <Text style={null}>{'disliked by ' + item.dislikeAdded}</Text>}
                        </View>
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                ))}
        </ScrollView>
        {!onlySee &&
        <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.button} onPress={() => interactionWithUser(true)}>
                <Text style={{color: 'white'}}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => interactionWithUser(false)}>
                <Text style={{color: 'white'}}>Like</Text>
            </TouchableOpacity>
        </View>}
        </View>
    )
}

let windowHeight = Dimensions.get('window').height,
    windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        backgroundColor: '#121212',
        marginTop: '7%'
    },    
    userInfo: {
        marginTop: 100,
        marginBottom: -20
    },
    user: {
        color: 'white',
        fontSize: 20,
    },
    scroll: {
        height: windowHeight,
        marginTop: 60
    },
    info: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: windowWidth/100*94,
        marginTop: 20
    },
    marker: {
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 47,
        width: 47
    },    
    markerIconBack: {
        position: 'absolute',
        backgroundColor: 'rgba(2, 140, 180, 0.5)', 
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
    text: {
        color: 'white',
        width: windowWidth/100*28
    },
    button: {
        margin: 8,
        backgroundColor: 'rgba(0,17,38, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        paddingVertical: 11
    }
});