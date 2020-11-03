
const getButton = document.querySelector('#switch-button');
const getUser = document.querySelector('#InputName');

const firstScreen = document.querySelector('.first-screen');
const secondScreen = document.querySelector('.second-screen');

const width = document.querySelector('.width');
const height = document.querySelector('.height');
const os = document.querySelector('.os');
const browser =document.querySelector('.browser');
const name = document.querySelector('.name');
const id = document.querySelector('.id');

const UserBlock = document.querySelector('.isEmpty');

let Username; 

getButton.addEventListener('click', function(){
    firstScreen.classList.add('none');
    secondScreen.classList.remove('none');
    secondScreen.classList.add('JS_screen-border');
    if(Username =='' || !Username ){
        UserBlock.classList.add('none');
    }else{
        name.textContent = Username;
    }
})

getUser.addEventListener('change', function(e){
    Username = e.target.value;
})

 function SetData(){
     console.log(data)
    if(data){
    let info =  data.components;
    let ID =  data.visitorId;
    
    id.textContent = ID;
    width.textContent = info.availableScreenResolution.value[0] + 'px';
    height.textContent = info.availableScreenResolution.value[1] + 'px';
    os.textContent = info.platform.value;
    browser.textContent = info.vendor.value.split(' ')[0];
}

}
SetData();

///////////////////////////////получение данных о местонахождении пользователя
let latitude, longitude;

function getCoordinates(){
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position, error) =>{
    if(error){
        throw new Error(error);
    }
    latitude =  position.coords.latitude;
    longitude = position.coords.longitude;
    })
}
}
getCoordinates();

ymaps.ready(init);
function init(){
    // Создание карты.
    var myPlacemark = new ymaps.Placemark([latitude, longitude], {}, {
        preset: 'islands#redIcon'
    });

    var myMap = new ymaps.Map("map", {
        center: [latitude, longitude],
        zoom: 7
    });

    myMap.geoObjects.add(myPlacemark);
    myMap.controls.remove('geolocationControl');
    myMap.controls.remove('trafficControl');
    myMap.controls.remove('typeSelector');
    myMap.controls.remove('rulerControl');
    myMap.controls.remove('searchControl');
    myMap.controls.remove('routeButtonControl');   
}
///////////////////////////////получение данных о местонахождении пользователя