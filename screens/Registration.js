import React, {useState} from 'react';
import {StyleSheet, Dimensions, Text, View, TextInput, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView, Button } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';

// import ArrowLeft from '../assets/arrowLeft.svg'

// import Eye from  '../assets/fa-solid_eye.svg'
// import HiddenEye from  '../assets/hiddenEye.svg'
// import GreyEye from  '../assets/red_fa-solid_eye.svg'
// import GreyHiddenEye from  '../assets/red_hiddenEye.svg'

// import Danger from  '../assets/Danger.svg'

import { io } from 'socket.io-client'

import AsyncStorage from '@react-native-async-storage/async-storage';

function Register({ navigation }) {

  let [nicknameErr, setNicknameErr] = useState(false),
    [socket, setSocket] = React.useState(null)

  React.useEffect(() => {
    console.log('socket connection')
    const newSocket = io(`https://network-back.herokuapp.com/`)      
    setSocket(newSocket)
    console.log('socket connected')
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string()
    .min(2, 'Must be min. 2 characters')
    .max(25, "Can't be bigger then 25 characters")
    .trim('The contact name cannot include leading and trailing spaces')
    .required('Required')  
  })

  return (
    <Formik
      initialValues={{name: ''}}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={ async (values, actions) => {
        console.log(values)
        await socket.emit('creating user',  {
          name: values.name
        }, async function (event) {
          console.log(event)
          if(event==='Error'){
            setNicknameErr(true)
          }else{
            setNicknameErr(false)
            try {
              await AsyncStorage.setItem('@user_hash', event)
            } catch (e) {
              console.log('async storage error: ', e)
            }
            navigation.navigate("Map")
          }
        })
      }}>
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, isValid, dirty, touched, errors, values }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView style={styles.container}>
            <View style={styles.content}>
              {/* <TouchableOpacity style={styles.arrowLeft} onPress={() => navigation.goBack()}>
                <Image source={ArrowLeft} style={styles.arrowLeftIcon}/>
              </TouchableOpacity> */}
              <View style={styles.component}>
                <Text style={styles.textLogin}>Enter a nickname to proceed...</Text>
                <View style={styles.loginWays}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nickname</Text>
                    <TextInput
                      style={[styles.input, (errors.name&&touched.name) ? {borderColor: '#E64646'} : null]}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      placeholderTextColor="#a2f6f7" 
                      placeholder={'Enter your nickname...'}
                    />
                    {errors.name &&
                      <Text style={{color: '#E64646'}}>{errors.name}</Text>}
                    {/* <Text style={styles.label}>Create password</Text>
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
                        {passHide ? 
                          errors.password ?
                            <Image source={GreyEye} style={{width: 22, height: 16}} /> 
                          : 
                          <Image source={Eye} style={{width: 22, height: 16}} /> 
                          :
                            errors.password ? 
                            <Image source={GreyHiddenEye} style={{width: 22, height: 16}} />
                        : 
                          <Image source={HiddenEye} style={{width: 22, height: 16}} />
                        }
                      </TouchableOpacity>
                    </View>
                    {errors.password &&
                      <Text style={{color: '#E64646'}}>{errors.password}</Text>}                     
                    <Text style={styles.label}>Confirm password</Text>
                    <View style={styles.input_n_Icon}>
                      <TextInput
                      style={[styles.input, (errors.passwordRepeat&&touched.passwordRepeat) ? {borderColor: '#E64646'} : null]}
                      onChangeText={handleChange('passwordRepeat')}
                      onBlur={handleBlur('passwordRepeat')}
                      value={values.passwordRepeat}
                      secureTextEntry={passRepeatHide}
                      placeholder={'Repeat the password'}
                      />
                      <TouchableOpacity style={styles.eye} onPress={() => setPassRepeatHide(!passRepeatHide)}>
                      {passRepeatHide ?
                        errors.passwordRepeat ?
                          <Image source={GreyEye} style={{width: 22, height: 16}} /> 
                        : 
                          <Image source={Eye} style={{width: 22, height: 16}} /> 
                        :
                        errors.passwordRepeat ? 
                          <Image source={GreyHiddenEye} style={{width: 22, height: 16}} />
                        : 
                          <Image source={HiddenEye} style={{width: 22, height: 16}} />
                      }
                      </TouchableOpacity>
                    </View>    
                    {errors.passwordRepeat &&
                      <Text style={{color: '#E64646'}}>{errors.passwordRepeat}</Text>}                      */}
                    <View style={[styles.gradientButton, !isValid ? styles.shadowed : null]}>
                      {nicknameErr &&
                        <Text style={{textAlign: 'center', marginBottom: 0, color: '#E64646'}}>User with this nickname already exist</Text>}
                        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                          <Text style={{color: 'white', textAlign: 'center', fontSize: 16}}>Proceed to map</Text>
                        </TouchableOpacity>
                    </View>                            
                  </View>
                </View>      
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback > 
      )}     
    </Formik>   
  );
}
export default Register;

let windowHeight = Dimensions.get('window').height;
let windowWidth = Dimensions.get('window').width;
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight,
    color: 'white',
    backgroundColor: '#121212',
    marginTop: '7%'
  },
  content: {
    alignItems: 'center'
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
    marginTop: '26%'
  },
  textLogin: {
    alignSelf: 'flex-start',
    // fontFamily: 'OpenSauceSans-Black',
    color: 'white',
    fontSize: 32,
    width: '90%',
    marginLeft: '7.6%'
  },
  loginWays: {
    marginTop: windowHeight/100*2.2,
    justifyContent: 'center',
    width: '100%',
    marginTop: '26%'
  },
  label: {
    color: '#a2f6f7',
    alignSelf: 'flex-start',
    fontSize: 12,
    marginTop: windowHeight/100*2.2,
    marginBottom: windowHeight/100*1.2,
    marginTop: '17.6%',
    marginLeft: '7.6%'
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
    color: '#a2f6f7',
    // fontFamily: 'OpenSauceSans-Regular',
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
    // fontFamily: 'OpenSauceSans-Bold',
    color: '#3F5EFB',
    fontSize: 16
  },
  subscribtion: {
    alignSelf: 'flex-start', 
    marginTop: '3%', 
    marginLeft: '7.6%'
  },
  subsText: {
    // fontFamily: 'OpenSauceSans-Regular',
    fontSize: 14
  },
  checkbox: {
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 1, 
    borderWidth: 1, 
    borderColor: '#252525', 
    borderRadius: 4, 
    width: 24, 
    height: 24, 
    marginLeft: 20
  },
  selected: {
    backgroundColor: '#3F5EFB',
    width: '90%',
    height: '90%',
    borderRadius: 4
  },  
  attention: {
    position: 'absolute',
    top: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: '20%'
  },
  danger: {
    // fontFamily: 'OpenSauceSans-Bold',
    fontSize: 12,
    color: '#FF6740'
  },
  gradientButton: {
    marginTop: windowHeight/100*30,
    width: '100%', 
    height: 86
  },
  button: {
    borderRadius: 20,
    backgroundColor: 'rgba(10,37,100, 0.6)',
    width: '94%',
    margin: 12,
    padding: '4%',
    color: 'white',    
  },
  shadowed: {
    opacity: 0.5
  },
  noAccount: {
    marginTop: windowHeight/100*8,    
    textAlign: 'center',
    fontSize: 16,
    // fontFamily: 'OpenSauceSans-Regular',
    color: '#6B7680'
  },
  signUp: {
    fontSize: 16,
    // fontFamily: 'OpenSauceSans-Bold',
    color: '#3f5efb'
  }
});