'use strict';
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const server= express();
require('dotenv').config();
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT;


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const drinkSchema = new mongoose.Schema({
    strDrink :String,
    strDrinkThumb :String
  });

  const drinkModel = mongoose.model('drinks', drinkSchema);

server.get('/drinks' , drinkHandler);
server.post('/addtofavorite', addToFav);
server.get('/getFavDrink', getFavDrink);
server.delete('/deletFav', deleteFav);
server.put('/updateFav',updateHandler);


function drinkHandler (req,res){
    const url =`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`;
    axios.get(url).then(result =>{
        res.send(result.data);
    })
}

function addToFav (req , res){
    const {strDrink ,strDrinkThumb} = req.body;
    const newDrink = new drinkModel({
        strDrink:strDrink,
        strDrinkThumb:strDrinkThumb
    })
    newDrink.save();
}

function getFavDrink (req,res){
    drinkModel.find({},(err,data)=>{
        res.send(data);
    })
}

function deleteFav(req,res){
    const id = req.quary.id;
    drinkModel.deleteOne({idDrink:id},(err,data)=>{
        drinkModel.find({},(err,data)=>{
            res.send(data);
        })
    })
}

function updateHandler (req,res){
    const {strDrink ,strDrinkThumb ,id} = req.body;
    drinkModel.find({idDrink:id},(err,data)=>{
        data[0].strDrink =strDrink;
        data[0].strDrinkThumb=strDrinkThumb;
        data[0].save()
        .then(()=>{
            drinkModel.find({},(err,data)=>{
                res.send(data);
            })
        })
    })
}

server.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))
