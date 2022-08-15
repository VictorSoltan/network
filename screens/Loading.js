import React, {useState} from 'react';
import {StyleSheet, Dimensions, Text, View } from 'react-native';

export default function Loading() {
    return(
        <View style={styles.container}>
            <Text style={{color: 'white'}}>Loading...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
        marginTop: '7%'
    }
})