import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";


import Map from "../screens/Map";
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
                name="Map"
                component={Map}
                options={{title: 'Map'}}
            />      
                
        </Stack.Navigator>
    </NavigationContainer>
}