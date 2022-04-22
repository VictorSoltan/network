import React, {useState} from 'react';
import {StyleSheet, Dimensions, Text, View, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Button } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage'

import Eye from  '../assets/fa-solid_eye.svg'
import HiddenEye from  '../assets/hiddenEye.svg'
import GreyEye from  '../assets/red_fa-solid_eye.svg'
import GreyHiddenEye from  '../assets/red_hiddenEye.svg'

import Danger from  '../assets/Danger.svg'

export default function Login({ navigation }) {

  let [passHide, setPassHide] = useState(true);

  let [loginErrorTitle, setLoginErrorTitle] = useState('Incorrect email or password');
  let [loginError, setLoginError] = useState(false);
  let [loginStatus, setLoginStatus] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required'),
    password: Yup.string()
        .min(8, 'Must be min 8 characters')
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
         "Some characters in your password doesn't allowed")
        .required('Required'),
  })

  return (
    <Formik
    initialValues={{ 
      name: '', password: '',}}
    validationSchema={validationSchema}
    validateOnChange={false}
    validateOnBlur={false}
    onSubmit={(values) => {
      console.log('login')
      axios.post("http://192.168.1.3:5000/login/", {    
        name: values.name,
        password: values.password
      })
      .then(function (response) {
        console.log(response.data);
        if(response.data === "Login or password doesn't mutch") setLoginError(true)
        else if(response.data === "Success") navigation.navigate('Map')
      })
      .catch(function (error) {
        console.log(error);
      });
    }}>
    {({ handleChange, handleBlur, handleSubmit, isValid, dirty, errors, touched, values }) => (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.component}>
            <Text style={styles.textLogin}>Login with Nickname</Text>
            <View style={styles.loginWays}>
                <View style={{width: '100%'}}>
                  <Text style={styles.label}>Nickname </Text>
                  <TextInput
                    style={[styles.input, (errors.name&&touched.name) ? {borderColor: '#E64646'} : null]}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholder={'Enter your nickname'}
                  />
                  {errors.name &&
                      <Text style={{color: '#E64646'}}>{errors.name}</Text>}

                  <Text style={styles.label}>Password </Text>
                  <View style={styles.input_n_Icon}>
                    <TextInput
                      style={[styles.input, (errors.password&&touched.password) ? {borderColor: '#E64646'} : null]}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry={passHide}
                      placeholder={'Choose a password'}
                    />
                    <TouchableOpacity style={styles.eye} onPress={() => setPassHide(!passHide)}>
                      {!passHide ? 
                        errors.password ?
                          <Eye style={{width: 22}} /> 
                        : 
                        <GreyEye style={{width: 22}} /> 
                        :
                          errors.password ? 
                          <HiddenEye style={{width: 22}} />
                        : 
                        <GreyHiddenEye style={{width: 22}} />
                      }
                    </TouchableOpacity>
                  </View>
                  {errors.password &&
                      <Text style={{color: '#E64646'}}>{errors.password}</Text>}                  
                  <TouchableOpacity style={styles.forgotten} onPress={() => navigation.navigate('ForgotPass')}>
                    <Text style={styles.forgottenText}>Forgot?</Text>
                  </TouchableOpacity>
                  {isValid&&loginError ? 
                    <View style={styles.attention}>
                      <Danger style={{width: 22}} /> 
                      <Text style={styles.danger}>{"Login or password doesn't mutch"}</Text>
                    </View>
                  : null}
                  <View style={[styles.gradientButton, !isValid ? styles.shadowed : null]}>
                    <Button onPress={() => handleSubmit()} title="Login"/>
                  </View>                            
                </View>
              </View>      
            </View>
            <View style={styles.noAccount}>
            <Text style={styles.noAccountText} >Dont have account? </Text> 
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
              <Text style={styles.signUpText}>Sign up</Text>
            </TouchableOpacity>
          </View>      
        </View>
        </ScrollView>
      </TouchableWithoutFeedback > 
    )}     
  </Formik>
 );
}
let windowHeight = Dimensions.get('window').height;
let windowWidth = Dimensions.get('window').width;
  
const styles = StyleSheet.create({
  container: {
    marginTop: '7%',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: windowHeight
  },
  union: {
    position: 'absolute',
    width: windowWidth,
    height: windowWidth/100*68.4
  },  
  arrowLeft: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16%',
    marginLeft: '8%',
    borderWidth: 1,
    borderRadius: 160,
    borderColor: '#f4f4f6',
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
    marginTop: '39%'
  },
  textLogin: {
    alignSelf: 'flex-start',
    fontFamily: 'OpenSauceSans-Black',
    color: '#252525',
    fontSize: 32,
    width: '90%',
    marginLeft: '7.6%'
  },
  loginWays: {
    marginTop: windowHeight/100*2.2,
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 12,
    marginTop: windowHeight/100*2.2,
    marginBottom: windowHeight/100*1.2,
    marginLeft: '7.6%'
  },
  input: {
    width: '100%',
    fontSize: 16,
    paddingVertical: windowHeight/100*2.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '5%',
    borderColor: '#E8E8E8',
    borderRadius: 100,
    borderWidth: 1.5,
    backgroundColor: '#fff',
    color: '#8A8A8A',
    fontFamily: 'OpenSauceSans-Regular',
    marginBottom: windowHeight/100*0.9
  }, 
  input_n_Icon: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },  
  eye: {
    position: 'absolute', 
    right: '6%'
  },
  forgotten: {
    alignSelf: 'flex-end',
    paddingVertical: windowHeight/100*1.4,
    paddingRight: '4%',
  },
  forgottenText: {
    fontFamily: 'OpenSauceSans-Bold',
    color: '#3F5EFB',
    fontSize: 16
  },
  attention: {
    position: 'absolute',
    top: '76%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: '20%'
  },
  danger: {
    fontFamily: 'OpenSauceSans-Bold',
    fontSize: 12,
    color: '#FF6740'
  },
  gradientButton: {
    marginTop: windowHeight/100*15,
    width: '100%', 
    height: 56
  },
  shadowed: {
    opacity: 0.5
  },
  noAccount: {
    flexDirection: 'row',
    marginTop: '5.5%',
    textAlign: 'center',
  },
  noAccountText: {
    fontSize: 16,
    fontFamily: 'OpenSauceSans-Regular',
    color: '#6B7680'
  },
  signUpText: {
    fontSize: 16,
    fontFamily: 'OpenSauceSans-Bold',
    color: '#3f5efb'
  },
});