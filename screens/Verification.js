import React, { useState } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

import ArrowLeft from '../../assets/arrowLeft.svg'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import GradientButton from '../../components/GradientButton'

const CELL_COUNT = 6;

export default function Verification({ route, navigation }) {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.arrowLeft} onPress={() => navigation.goBack()}>
          <ArrowLeft style={styles.arrowLeftIcon}/>
        </TouchableOpacity>
        <View style={styles.component}>
          <Text style={styles.textLogin}>Verification code</Text>
          <Text style={styles.description}>
            We have sent a 6-digit verification code to your email 
            <Text style={styles.mail}> {route.params}</Text>
          </Text>          
          <View style={{width: '100%'}}>
            <Text style={styles.label}>Email address </Text>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, index===0? styles.leftCell : index===5 ? styles.rightCell : styles.colorText, !symbol? styles.colorDots : null, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : '•')}
                </Text>
              )}
            />
          </View>
        </View>
        <View style={[styles.bottomButton, value.length === 6 ? null : styles.shadowed]}>
          <GradientButton title="Continue" isValid={value.length === 6} func={() => setValue(value)} link="NewPass" />
        </View>         
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%'
  },
  arrowLeft: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16%',
    marginLeft: '8%',
    borderWidth: 1,
    borderRadius: 160,
    borderColor: '#C4C4C4',
    padding: '2.8%',
    paddingVertical: '2.9%',
  },
  arrowLeftIcon: {
    height: 14,
    width: 14,
    padding: '2%',
    paddingVertical: '0%'
  },
  component: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '87%',
    marginTop: '19.4%',
  },  
  textLogin: {
    alignSelf: 'flex-start',
    fontFamily: 'OpenSauceSans-Black',
    color: '#252525',
    fontSize: 32,
    marginLeft: '2%'
  },
  description: {
    alignSelf: 'flex-start',
    color: '#6B7680',
    fontFamily: 'OpenSauceSans-Regular',
    marginTop: '6.5%',
    marginLeft: '2%',
    width: '90%',
    lineHeight: 24,
    fontSize: 16
  },
  mail: {
    fontFamily: 'OpenSauceSans-Bold',
    color: '#252525'
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 12,
    marginTop: '10%',
    marginBottom: '3%',
    marginLeft: '7.6%'
  },
  input: {
    width: '100%',
    fontSize: 16,
    paddingVertical: '5.4%', 
    paddingLeft: '5%',
    borderColor: '#E8E8E8',
    borderRadius: 100,
    borderWidth: 1,
    backgroundColor: '#fff',
    color: '#8A8A8A',
    fontFamily: '',
    marginBottom: '2%'
  },     
  codeFieldRoot: {
    // marginTop: 20,
    justifyContent: 'center',
    paddingHorizontal: '2%'
  },
  cell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '16.67%',
    paddingVertical: '2%',
    fontSize: 24,
    borderWidth: 1.5,
    borderColor: '#F4F4F6',
    textAlign: 'center',
    margin: 0,
    padding: 0
  },
  leftCell: {
    color: '#252525',
    borderBottomLeftRadius: 160,
    borderTopLeftRadius: 160, 
  },
  rightCell: {
    color: '#252525',
    borderBottomRightRadius: 160, 
    borderTopRightRadius: 160,
  },
  colorDots: {
    color: '#6B7680',
    fontSize: 24,
  },
  colorText: {
    color: '#252525',
  },
  focusCell: {
    borderColor: '#000',
  },
  bottomButton: {
    position: 'absolute',
    width: '87%', 
    height: 56,
    bottom: '1%'
  },
  shadowed: {
    opacity: 0.5
  }
})