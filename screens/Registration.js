import React, {useState} from 'react';
import {StyleSheet, Dimensions, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView, Image } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';

// import axios from 'axios';

import SVG from '../components/SVG'

import ArrowLeft from '../assets/arrowLeft.svg'

import Eye from  '../assets/fa-solid_eye.svg'
import HiddenEye from  '../assets/hiddenEye.svg'
import GreyEye from  '../assets/red_fa-solid_eye.svg'
import GreyHiddenEye from  '../assets/red_hiddenEye.svg'

import Danger from  '../assets/Danger.svg'

import GradientButton from '../components/GradientButton'

function Register({ navigation }) {

  let [passHide, setPassHide] = useState(true);
  let [passRepeatHide, setPassRepeatHide] = useState(true);
  
  let [regErrorTitle, setRegErrorTitle] = useState('Incorrect email or password');
  let [regError, setRegError] = useState(false);
  let [registrationStatus, setRegistrationStatus] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(),
    email: Yup.string()
      .required()
      .email(),
    password: Yup.string()
        .min(8)
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
        )
        .required(),
    passwordRepeat: Yup.string()
        .oneOf([Yup.ref('password')])
        .required(),       
  })



  return (
    <Formik
      initialValues={{ 
      email: '', name: '', password: '', passwordRepeat: '', newsletterSubscription: false }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, actions) => {
        // async function test(){
        //   let data = await axios.post("http://api-acceptance.budgeist.com", {
        //     }, {
        //       headers: {
        //         'Content-Type': 'application/json',
        //       }
        //     });
            
        //     if(data.data.data.registration.status==="error"){
        //       setRegError(true)
        //       if(data.data.data.registration.error){
        //          setRegErrorTitle(data.data.data.registration.error.message) 
        //       }
        //     }else{
        //       setRegError(false)
        //       setRegistrationStatus(true)
        //     }
        //   }
        //     test()
      }}>
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, isValid, dirty, touched, errors, values }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView style={styles.container}>
            <View style={styles.content}>
              <TouchableOpacity style={styles.arrowLeft} onPress={() => navigation.goBack()}>
                <SVG icon={ArrowLeft} style={styles.arrowLeftIcon}/>
              </TouchableOpacity>
              <View style={styles.component}>
                <Text style={styles.textLogin}>Create account</Text>
                <View style={styles.loginWays}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                      style={[styles.input, (errors.name&&touched.name) ? {borderColor: '#E64646'} : null]}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      placeholder={'Enter your name'}
                    />
                    <Text style={styles.label}>Email address </Text>
                    <TextInput
                      style={[styles.input, (errors.email&&touched.email) ? {borderColor: '#E64646'} : null]}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      placeholder={'E-Mail'}
                    />
                    <Text style={styles.label}>Create password</Text>
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
                            <SVG icon={GreyEye} style={{width: 22, height: 16}} /> 
                          : 
                          <SVG icon={Eye} style={{width: 22, height: 16}} /> 
                          :
                            errors.password ? 
                            <SVG icon={GreyHiddenEye} style={{width: 22, height: 16}} />
                        : 
                          <SVG icon={HiddenEye} style={{width: 22, height: 16}} />
                        }
                      </TouchableOpacity>
                    </View>
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
                          <SVG icon={GreyEye} style={{width: 22, height: 16}} /> 
                        : 
                          <SVG icon={Eye} style={{width: 22, height: 16}} /> 
                        :
                        errors.passwordRepeat ? 
                          <SVG icon={GreyHiddenEye} style={{width: 22, height: 16}} />
                        : 
                          <SVG icon={HiddenEye} style={{width: 22, height: 16}} />
                      }
                      </TouchableOpacity>
                    </View>    
                    <View style={styles.subscribtion}>
                      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.subsText}>Newsletter subscription</Text>
                        <TouchableOpacity style={styles.checkbox} onPress={() => setFieldValue('newsletterSubscription', !values.newsletterSubscription)}>
                        {values.newsletterSubscription ? 
                          <View style={styles.selected}/>  
                          : null
                        }
                        </TouchableOpacity>              
                      </View>
                    </View>                     
                    {dirty ? 
                      <View style={styles.attention}>
                        <Danger style={{width: 22}} /> 
                        <Text style={styles.danger}>{regErrorTitle}</Text>
                      </View>
                    : null}
                    <View style={[styles.gradientButton, !isValid ? styles.shadowed : null]}>
                      <GradientButton isValid={isValid&&dirty} func={handleSubmit} title="Register" link={registrationStatus&&isValid&&dirty ? '' : 'Login'} />
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
    backgroundColor: '#fff',
    height: windowHeight
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
    marginTop: '6%'
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
  subscribtion: {
    alignSelf: 'flex-start', 
    marginTop: '3%', 
    marginLeft: '7.6%'
  },
  subsText: {
    fontFamily: 'OpenSauceSans-Regular',
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
    fontFamily: 'OpenSauceSans-Bold',
    fontSize: 12,
    color: '#FF6740'
  },
  gradientButton: {
    marginTop: windowHeight/100*6,
    width: '100%', 
    height: 56
  },
  shadowed: {
    opacity: 0.5
  },
  noAccount: {
    marginTop: windowHeight/100*8,    
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'OpenSauceSans-Regular',
    color: '#6B7680'
  },
  signUp: {
    fontSize: 16,
    fontFamily: 'OpenSauceSans-Bold',
    color: '#3f5efb'
  }
});