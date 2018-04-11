// require express
var express = require("express");
// path module
var path = require("path");
var mongoose = require('mongoose');
var session = require('express-session');
var moment = require('moment');
// create the express app
var app = express();
app.use(session({ secret: 'codingdojorocks' }));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static( __dirname + '/GithubBattle/dist' ));


//DB stuff
mongoose.connect('mongodb://localhost/battles');
var Schema = mongoose.Schema

var PlayerSchema = new mongoose.Schema({
    login: {
        type: String,
    },
    score: {
        type: Number,
    },
    avatar_url: String,
}, { timestamps: true })


mongoose.model('Player', PlayerSchema);

var Player = mongoose.model('Player');
//end DB stuff

//routes
app.get('/getUsers', function (req, res) {
    console.log('getting players in server')
    Player.find({},function(err, players) {
        if(err){
            console.log("e0rr0r",)
        }else{
            console.log('got em')
            res.json({message:'The Players', players: players})
        }
    })
})
// app.post('/updatePlayer', function (req, res) {
//     console.log('upating players in server')
//     Player.update({_id: req.body.player_id}, {status: req.body.status}, function(err, player) {
//         if(err){
//             console.log("update error",)
//         }else{
//             res.json({message:`${player.name} updated`})
//         }
//     })
// })
app.post('/addPlayer', function(req, res) {
    Player.find({login: req.body.name}, function(err, player) {
        console.log(player)
        if(player.length == 0) {            
            console.log("what")
            player = new Player()
            player.login = req.body.name
            player.score = req.body.score
            player.avatar_url = req.body.avatar_url
            console.log(player)
            player.save(function(err) {
                if(err){
                    console.log('new player error')
                    res.json({err})
                }else{
                    // res.json({message:`with ${players.name} added`})
                    console.log('player added');
                }
            })
        } else {
            Player.update({login: req.body.name}, {score: req.body.score}, function(err) {
                if(err){
                    console.log('update player error')
                    res.json({err})
                }else{
                    // res.json({message:`with ${players.name} added`})
                    console.log('player updated');
                }
            })
        }
    })
})
app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./GithubBattle/dist/index.html"))
});
//end routes


// tell the express app to listen on port 8000
app.listen(8000, function () {
    console.log("listening on port 8000");
});
