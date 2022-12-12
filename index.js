const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { log } = require('console');

app.set('view engine', 'ejs');

// for checking to make sure connection to SQL database worked
// take out for final product
app.use(bodyParser.json());

app.use(
  session({
    secret: "SECRET",
    saveUninitialized: false,
    resave: false,
    async: true,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => 
{
    res.redirect('/main'); //this will call the /anotherRoute route in the API
});

app.get('/main', (req, res) =>
{
  res.render('pages/main');
});

app.get('/home', (req, res) =>
{
  res.render('pages/main');
});


app.get('/meal', async (req, res) => {
  console.log(req.query.mealName);
    axios({
        url: `https://www.themealdb.com/api/json/v1/1/search.php`,
            method: 'GET',
            dataType:'json',
            headers:{
              "Accept-Encoding":'text/html;charset=UTF-8',
          },
            params: {
                "apikey": 1,
                "s": req.query.mealName,// WILL MEAL NAME GO HERE????? 
            }
        })
        .then(results => {
          if (results.data.meals == undefined)
          {
            res.render('partials/message');
          }
          else
          {
            console.log(results.data.meals[0]);
            res.render('pages/main',  {
                meal: results.data.meals[0]
                //message: "could not find meal/error"
            })
          }
        })
        .catch(error => {
        //hanlde errors
        console.log();
        res.render(error);
        })
});

  app.listen(3000);
  console.log('Server is listening on port 3000');