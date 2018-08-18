const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    a:{
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

var encodedAddress = encodeURIComponent(argv.address);
//var geocodeUrl = `http://localhost:5555?address=${encodedAddress}`;
var geocodeUrl = `https://maps.google.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS'){
      throw new Error('Unable to find Address');
    }
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;

    var weatherUrl = `https://api.forecast.io/forecast/4a04d1c42fd9d32c97a2c291a32d5e2d/${lat},${lng}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
}).then((response)=>{
    for (i=24;i>0;i--){
    //for (i=0;i<response.data.hourly.data.length;i++){
      var d = new Date(response.data.hourly.data[i].time*1000);
      var days = ['Sun','Mon','Tues','Wed','Thu','Fri','Sat'];
      var day = days[d.getDay()];
      var hours = d.getHours();
      var minutes = "0" + d.getMinutes();
      var formattedTime = day + '- ' + hours + ':' + minutes.substr(-2);
      console.log(` `);
      console.log(`${formattedTime} - ${response.data.hourly.data[i].summary}`);
      console.log(`Temp= ${response.data.hourly.data[i].temperature} Feels Like= ${response.data.hourly.data[i].apparentTemperature}`);
      console.log(`Change of Rain= ${response.data.hourly.data[i].precipProbability} Amount= ${response.data.hourly.data[i].precipIntensity}`);
      console.log(` `);
    }
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`It's currently ${temperature}  and it feels like ${apparentTemperature}.`);
    console.log(`${response.data.hourly.summary}`);
}).catch((e) =>{
    if (e.code === 'ENOTFOUND'){
      console.log('Unable to connect to API Server');
    } else {
      console.log(e.message);
    }
});
