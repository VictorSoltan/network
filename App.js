import React, {useState} from 'react';
import Navigator from './routes/homeStack'
// import * as Font from 'expo-font'
// import AppLoading from 'expo-app-loading';

// const getFonts = () => Font.loadAsync({
//   'OpenSauceSans-Black': require('./assets/fonts/OpenSauceSans-Black.ttf'),
//   'OpenSauceSans-ExtraBold': require('./assets/fonts/OpenSauceSans-ExtraBold.ttf'),
//   'OpenSauceSans-Bold': require('./assets/fonts/OpenSauceSans-Bold.ttf'),
//   'OpenSauceSans-Medium': require('./assets/fonts/OpenSauceSans-Medium.ttf'),
//   'OpenSauceSans-Regular': require('./assets/fonts/OpenSauceSans-Regular.ttf'),
//   'OpenSauceSans-Light': require('./assets/fonts/OpenSauceSans-Light.ttf')
// })

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  
  // if(fontsLoaded){
    return <Navigator />
  // } else {
    // return <AppLoading
    //  startAsync={getFonts}
    //  onFinish={()=> setFontsLoaded(true)} 
    //  onError={() => console.log('error')}
    // />
  // }
}
