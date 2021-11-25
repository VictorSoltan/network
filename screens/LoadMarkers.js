import React, { useState } from 'react';
import Map from './Map'

import Ι0 from '../assets/signs/0000.webp'
import Ι1 from '../assets/signs/0001.webp'
import Ι2 from '../assets/signs/0002.webp'
import Ι3 from '../assets/signs/0003.webp'
import Ι4 from '../assets/signs/0004.webp'
import Ι5 from '../assets/signs/0005.webp'
import Ι6 from '../assets/signs/0006.webp'
import Ι7 from '../assets/signs/0007.webp'
import Ι8 from '../assets/signs/0008.webp'
import Ι9 from '../assets/signs/0009.webp'
import Ι10 from '../assets/signs/0010.webp'
import Ι11 from '../assets/signs/0011.webp'
import Ι12 from '../assets/signs/0012.webp'
import Ι13 from '../assets/signs/0013.webp'
import Ι14 from '../assets/signs/0014.webp'
import Ι15 from '../assets/signs/0015.webp'
import Ι16 from '../assets/signs/0016.webp'
import Ι17 from '../assets/signs/0017.webp'
import Ι18 from '../assets/signs/0018.webp'
import Ι19 from '../assets/signs/0019.webp'
import Ι20 from '../assets/signs/0020.webp'
import Ι21 from '../assets/signs/0021.webp'
import Ι22 from '../assets/signs/0022.webp'
import Ι23 from '../assets/signs/0023.webp'
import Ι24 from '../assets/signs/0024.webp'
import Ι25 from '../assets/signs/0025.webp'

export default function LoadMarkers(){
  let [markers, setMarkers] = useState([])
  const allIcons = [Ι0, Ι1, Ι2, Ι3, Ι4, Ι5, Ι6, Ι7, Ι8, 
    Ι9, Ι10, Ι11, Ι12, Ι13, Ι14, Ι15, Ι16, Ι17, Ι18, Ι19, Ι20, Ι21, Ι22, Ι23, Ι24, Ι25]

  const emoSigns = [Ι0, Ι1, Ι2, Ι3, Ι4, Ι5, Ι6, Ι7, Ι8]
  const ateSigns = [Ι9, Ι10, Ι11, Ι12, Ι13]
  const pathSigns = [Ι14, Ι15, Ι16, Ι17, Ι18, Ι19, Ι20, Ι21]
  const forbiddenSigns = [Ι22, Ι23, Ι24, Ι25]



  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function subscribe() {
    let response = await fetch("http://208.69.117.77:8000/api/icon_view/");
    if (response.status == 502) {
      await sleep(14000)
    } else if (response.status != 200) {
      await sleep(14000)
      await subscribe();
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      let message = await response.text();
      let data = JSON.parse(message)
      let newArr = []
      await markers
      console.log(markers.length)
      console.log(data.length)
      if(markers.length===0){
        console.log('sssssssssssss')
        markers = [...markers]
        for(let x=0; x<data.length; x++){
          markers.push({
            latitude: Number(data[x].latitude), 
            longitude: Number(data[x].longitude), 
            icon: allIcons[Number(data[x].icon)-12],
            text: data[x].text,
            value: true})
        }
        setMarkers(markers)
      }else if(markers.length<data.length){
        console.log('aaaaaaaaaa')
        markers = [...markers]
        for(let x=markers.length; x<data.length; x++){
          markers.push({
            latitude: Number(data[x].latitude), 
            longitude: Number(data[x].longitude), 
            icon: allIcons[Number(data[x].icon)-12],
            text: data[x].text,
            value: true})
        }
        setMarkers(markers)
      }
    }
    await subscribe();
  }
  
  subscribe();

  return(
    <Map markers={markers} setMarkers={setMarkers} emoSigns={emoSigns}  
      ateSigns={ateSigns} pathSigns={pathSigns} forbiddenSigns={forbiddenSigns} />
  )
}