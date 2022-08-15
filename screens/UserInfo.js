import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client'

export default function UserInfo({ route, navigation }){
    
    let
        {nickname, me, icons, onlySee} = route.params,
        hash = useRef(null),
        [socket, setSocket] = useState(null),
        [user, setUser] = useState(null),
        [marks, setMarks] = useState(false),
        [markers, setMarkers] = useState([]),
        [friends, setFriends] = useState([]),
        [notifications, setNotifications] = useState([]),
        [followers, setFollowers] = useState([]),
        [follows, setFollows] = useState([]),
        [likes, setLikes] = useState([])
        
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
              setUser(event)
            })
            socket.on('transfering user', function(event){
              console.log('user ', event)
            setUser(event)
          })
        }
    }, [socket])

    function interactionWithUser(type){
        socket.emit('interaction with user', {
            hash: hash.current,
            type: type,
            nickname: nickname
        })
    }

    function addToFriends(){
        socket.emit('add to friends', {
            hash: hash.current,
            nickname: nickname
        }, function(event){
            setUser(event)
            setNotifications([])
            manageFields(user.friends, 'friends')
        })

    }

    function getMyMarks(){
        setFriends([])
        setFollowers([])
        setFollows([])
        setLikes([])
        setNotifications([])
        setMarks(!marks)
        if(marks){
            console.log('marks_for_user')
            socket.emit('marks_for_user', { hash: hash.current}, function(event){
                setMarkers(event)
            })
        }else{
            socket.emit('get marks', { hash: hash.current})
        }
    }

    function manageFields(array, type){
        setFriends([])
        setFollowers([])
        setFollows([])
        setLikes([])
        setNotifications([])
        if(type==='friends') setFriends(array)
        if(type==='followers') setFollowers(array)
        if(type==='follows') setFollows(array)
        if(type==='likes') setLikes(array)
        if(type==='notifications') setNotifications(array)
        console.log(followers)
    }

    return(
        <View style={styles.container}>

            {user &&
                <View style={styles.userInfo}>
                    <Text style={[styles.user, {textAlign: 'center'}]}>{'User: ' + user.name}</Text>
                    <View style={{width: '80%', flexWrap: 'wrap', flexDirection: 'row', marginTop: '4%'}}>
                        <TouchableOpacity style={{ backgroundColor: 'rgba(10,37,100, 0.6)', width: '40%', padding: '2%', margin: '2%'}} onPress={() => manageFields(user.friends, 'friends')}>
                            <Text style={styles.text}>{'Friends: ' + user.friends.length}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: 'rgba(10,37,100, 0.6)', width: '40%', padding: '2%', margin: '2%'}} onPress={() => manageFields(user.followers, 'followers')}>
                            <Text style={styles.text}>{'Followers: ' + user.followers.length}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: 'rgba(10,37,100, 0.6)', width: '40%', padding: '2%', margin: '2%'}} onPress={() => manageFields(user.follows, 'follows')}>
                            <Text style={styles.text}>{'Follow: ' + user.follows.length}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: 'rgba(10,37,100, 0.6)', width: '40%', padding: '2%', margin: '2%'}} onPress={() => manageFields(user.likes, 'likes')}>
                            <Text style={styles.text}>{'Likes: ' + user.likes.length}</Text>
                        </TouchableOpacity>
                        {onlySee &&
                            <TouchableOpacity style={{ backgroundColor: 'rgba(10,37,100, 0.6)', width: '40%', padding: '2%', margin: '2%'}} onPress={() => manageFields(user.notifications, 'notifications')}>
                                <Text style={styles.text}>{'Notifications: ' + user.notifications.length}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>}
            <ScrollView style={styles.scroll}>
                {
                friends.length > 0 ?
                <>
                <Text style={{ fontSize: 18, color: '#a2f6f7', marginLeft: '5%', marginBottom: '4%' }}>{'Friends of ' + nickname + ':'}</Text>
                {friends.map((item, index) => (
                    <View key={index} style={[styles.info, {alignItems: 'center', justifyContent: 'space-around'}]}>
                        <Text style={{ fontSize: 14, color: 'white' }}>{item.name}</Text>
                        <TouchableOpacity style={{ backgroundColor: 'rgba(10,37,100, 0.6)', textAlign: 'center', padding: '2%'}} onPress={() => navigation.navigate('Map', {markToFollow: undefined, friend: item.name})}>
                            <Text style={{ fontSize: 12, color: '#a2f6f7' }}>set mark for friend</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                </>
                :
                followers.length > 0 ?
                <>
                <Text style={{ fontSize: 18, color: '#a2f6f7', marginLeft: '5%', marginBottom: '4%' }}>{nickname + ' followers:'}</Text>
                {followers.map((item, index) => (
                    <View key={index} style={styles.info}>
                        <Text style={{ fontSize: 12, color: 'white' }}>{item}</Text>
                    </View>
                ))}
                </>
                :        
                follows.length > 0 ?
                <>
                <Text style={{ fontSize: 18, color: '#a2f6f7', marginLeft: '5%', marginBottom: '4%' }}>{'People which follow ' + nickname + ':'}</Text>                
                {follows.map((item, index) => (
                    <View key={index} style={styles.info}>
                        <Text style={{ fontSize: 12, color: 'white' }}>{item}</Text>
                    </View>
                ))}
                </>
                :  
                likes.length > 0 ?
                <>
                <Text style={{ fontSize: 18, color: '#a2f6f7', marginLeft: '5%', marginBottom: '4%' }}>{'People who liked ' + nickname + ':'}</Text>                   
                {likes.map((item, index) => (
                    <View key={index} style={styles.info}>
                        <Text style={{ fontSize: 12, color: 'white' }}>{item}</Text>
                    </View>
                ))}
                </>
                :                                           
                notifications.length > 0 ?
                notifications.map((item, index) => (
                    <View key={index} style={styles.info}>
                        <Text style={{ fontSize: 12, color: 'white' }}>{item.type}</Text>
                        <Text style={{ fontSize: 12, color: 'white' }}>{item.from}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => socket.emit('accept friend request', 
                            {hash: hash.current, name: item.from}
                        )}>
                            <Text style={{ fontSize: 12, color: 'white' }}>Add to friends</Text>
                        </TouchableOpacity>
                    </View>
                ))
                :
                markers.map((item, index) => (
                    <View key={index} style={styles.info}>
                        <TouchableOpacity style={styles.marker} onPress={() => navigation.navigate('Map', {markToFollow: item})}>
                            <View style={styles.markerIconBack} />
                            <Image style={styles.markerIcon} source={icons.current[item.filterIndex][item.signIndex]} style={styles.markerIcon} />
                            {item.likeAdded&&item.dislikeAdded && 
                            <Text style={styles.like}>{item.likeAdded.length}/{item.dislikeAdded.length}</Text>}
                        </TouchableOpacity>
                        <View>
                            <Text style={{ fontSize: 12, color: 'white' }}>{'longitude ' + item.longitude}</Text>
                            <Text style={{ fontSize: 12, color: 'white' }}>{'latitude ' + item.latitude}</Text>
                            {item.likeAdded&&item.likeAdded.length > 0 &&
                            <Text style={{color: '#a2f6f7'}}>{'liked by ' + item.likeAdded}</Text>}
                            {item.dislikeAdded&&item.dislikeAdded.length > 0 &&
                            <Text style={{color: '#a2f6f7'}}>{'disliked by ' + item.dislikeAdded}</Text>}
                        </View>
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                ))}
        </ScrollView>
        {!onlySee ?
        <View style={{flexDirection: 'row'}}>
            {user &&
            <>
            {!user.friends.find(o => o === me.current) &&
                <TouchableOpacity style={[styles.button, user.notifications.find(o => o.from === me.current)? {backgroundColor: 'rgba(0,17,30, 0.4)'} : null]} onPress={() => addToFriends()}>
                    <Text style={user.notifications.find(o => o.from === me.current)? {color: 'grey'} : {color: 'white'}}>
                        {!user.notifications.find(o => o.from === me.current) ? 'Add to friends'
                        : 'Request sended'} 
                    </Text>
                </TouchableOpacity>}       
            {!user.followers.find(o => o === me.current) &&
                <TouchableOpacity style={styles.button} onPress={() => interactionWithUser(true)}>
                    <Text style={{color: 'white'}}>Follow</Text>
                </TouchableOpacity>}
            {!user.likes.find(o => o === me.current) &&

            <TouchableOpacity style={styles.button} onPress={() => interactionWithUser(false)}>
                <Text style={{color: 'white'}}>Like</Text>
            </TouchableOpacity>}</>}
        </View>:
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={styles.buttonMe} onPress={() => getMyMarks()}>
                    <Text style={{color: 'white'}}>{marks? 'Marks for me' : 'My marks'}</Text>
                </TouchableOpacity>
            </View>
        }
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
        alignItems: 'center',
        justifyContent: 'space-between',
        width: windowWidth/100*94,
        padding: '2%',
        paddingTop: '3%',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomColor: '#333333',
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
        width: '28%',
        paddingVertical: 11
    },
    buttonMe: {
        margin: 8,
        backgroundColor: 'rgba(0,17,38, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 145,
        paddingVertical: 11
    }
});