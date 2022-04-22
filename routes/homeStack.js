import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import Map from "../screens/Map";
import Registration from "../screens/Registration";
import UserInfo from "../screens/UserInfo";
import Chat from "../screens/Chat";

const Stack = createStackNavigator()

export default function Navigate(){
    
    let [hash, setHash] = React.useState(null)

    React.useEffect( async () => {
        const value = await AsyncStorage.getItem('@user_hash')
        setHash(value)
    }, [])

    return <NavigationContainer>
        <Stack.Navigator  screenOptions={{
            headerShown: false
        }}>
            {!hash && 
                <Stack.Screen 
                    name="Registration"
                    component={Registration}
                    options={{title: 'Registration'}}
                />}         

            <Stack.Screen 
                name="Map"
                component={Map}
                options={{title: 'Map'}}
            /> 
            <Stack.Screen 
                name="Chat"
                component={Chat}
                options={{title: 'Chat'}}
            />                                    
            <Stack.Screen 
                name="UserInfo"
                component={UserInfo}
                options={{title: 'UserInfo'}}
            />                    
        </Stack.Navigator>
    </NavigationContainer>
}