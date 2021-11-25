import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";


import LoadMarkers from "../screens/LoadMarkers";
// import Registration from "../screens/Registration";
// import Login from "../screens/Login";

const Stack = createStackNavigator()

export default function Navigate(){
    return <NavigationContainer>
        <Stack.Navigator  screenOptions={{
            headerShown: false
        }}>
            {/* <Stack.Screen 
                name="Login"
                component={Login}
                options={{title: 'Login'}}
            />                   */}
            <Stack.Screen 
                name="LoadMarkers"
                component={LoadMarkers}
                options={{title: 'LoadMarkers'}}
            />      
                
        </Stack.Navigator>
    </NavigationContainer>
}