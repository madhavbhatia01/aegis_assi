var Amadeus = require('amadeus');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// src -> source location's airport code
// dest -> destination location's airport code
// date -> date of flying in the form of YYYY-MM-DD
// we have to pass these 3 params(suppose we have to fly on 14th june 2023 then -> url?src=DEL&dest=BOM&date=2023-06-13)
app.get("/", (req, res)=>{
  var amadeus = new Amadeus({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret
  });

  amadeus.shopping.flightOffersSearch.get({
      originLocationCode: req.query.src, //source
      destinationLocationCode: req.query.dest, //destination
      departureDate: req.query.date,
      adults: '1', // number of passengers
      currencyCode: 'INR',
      max: '10' // maximum number of results to show
  }).then(function(response){
    const dict = response.result.dictionaries.carriers;
    const arr = response.data;
    var result = "";
    arr.forEach( flight => {
       result += dict[flight.validatingAirlineCodes[0]] + ': ' + flight.price.total + '\n';
    });
    res.send(result);
  }).catch(function(responseError){
    console.log(responseError.code);
  });
})

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Server started on port 3000");
});
