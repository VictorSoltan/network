function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function subscribe(markers, setMarkers, allIcons) {
  let response = await fetch("http://208.69.117.77:8000/api/icon_view/");
  await sleep(500)
  if (response.status == 502) {
    await sleep(14000)
  } else if (response.status != 200) {
    await sleep(14000)
    await subscribe();
  } else {
    await new Promise(resolve => setTimeout(resolve, 2000));
    let message = await response.text();
    let data = JSON.parse(message)
    // console.log(markers.length)
    // console.log(data.length)
    if(markers.length===0){
      markers = [...markers]
      let i = 0, len = data.length;
      while (i < len) {
        markers.push({
          latitude: Number(data[i].latitude), 
          longitude: Number(data[i].longitude), 
          icon: allIcons[Number(data[i].icon)-14],
          text: data[i].text,
          like: data[i].like,
          dislike: data[i].dislike,
          likeAdded: false,
          dislikeAdded: false,
          checked: false,
          value: true,
          date: data[i].timeCreated})
        i++
      }
      console.log('reload')
      setMarkers(markers)
    }
    else if(markers.length<data.length){
      markers = [...markers]
      let i = markers.length, len = data.length;
      while (i < len) {
        markers.push({
          latitude: Number(data[i].latitude), 
          longitude: Number(data[i].longitude), 
          icon: allIcons[Number(data[i].icon)-14],
          text: data[i].text,
          like: data[i].like,
          dislike: data[i].dislike,
          likeAdded: false,
          dislikeAdded: false,
          checked: false,
          value: true,
          date: data[i].timeCreated})
        i++
      }
      console.log('reload')
      setMarkers(markers)
    }
  }
  await subscribe(markers, setMarkers, allIcons);
}
  
export { subscribe }