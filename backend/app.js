const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//importing route locations
const baseURL = './API/Routes/';
const providerRoute = require(`${baseURL}provider`);

//connect app to mongoDB
mongoose
  .connect('mongodb+srv://Admin:' + "OpenAdminAccess" + '@cluster0-vqaoh.azure.mongodb.net/test?retryWrites=true', {useNewUrlParser: true})
  .catch(err => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//handle CORS errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

//set up routes
app.use('/providers', providerRoute);

//error handling
//first middleware handles errors thrown from unhandled request types
app.use((req, res, next) => {
  const error = new Error('request type invalid!');
  error.status = 404;
  next(error);
});

//handles errors thrown from anywhere in the program
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
