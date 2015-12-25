var express = require('express');
var router = express.Router();

// Converts from a string with PGN format to JSON
function convertPGNtoJSON(pgn){
    var details = pgn.match(/\[(.*)\]/g);
    var data = {};
    for(var i = 0; i < details.length; i++){
        var temp = details[i].replace(/(\[|\])/g, "");
        var key = temp.substring(0, temp.indexOf(" ")).toLowerCase();
        var value = temp.substring(temp.indexOf(" ")+1).replace(/(")/g, "");
        data[key] = value;
    }

    var movestemp = pgn.split(/\d*\. /g);
    var moves = [];
    for(var i = 1; i < movestemp.length; i++){
        var temp = movestemp[i].trim().split(" ");
        moves.push(temp.join("$"));
    }
    data["moves"] = moves; 
    // console.log(data);
    // console.log("db.pgnchess.insert(" + JSON.stringify(data) + ");");
    return data;
}

// Converts JSON object from MongoDB to PGN string format
function convertJSONtoPGN(json){
    var infoKeys = ["event", "site", "date", "round", "white", "black", "result", "moves"];
    var data = "";
    for(var i = 0; i < infoKeys.length; i++){
        var key = infoKeys[i];
        if(key == "moves"){
            data += "\n";
            for(var j = 0; j < json[key].length; j++){
                var move = json[key][j].split("$");
                data += (j+1) + ". " + move.join(" ") + " ";
            }
        } else {
            data += "[" + key + " \"" + json[key] + "\"]\n";
        }
    }
    // console.log(data);
    return data;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/helloworld', function(req, res, next) {
//   res.render('helloworld', { title: 'Hello World!' });
// });

// Displays all available games
router.get('/chess', function(req, res, next) {
    var db = req.db;
    var collection = db.get('pgnchess');
    collection.find({},{},function(e,docs){
        res.render('chess', {
            "title" : "Chess Games",
            "games" : docs
        });
    });
});

// View details about individual games
router.get('/chess/:id', function(req, res, next) {
    var db = req.db;
    var id = req.params.id;
    var collection = db.get('pgnchess');
    collection.find({_id: id},{},function(e,docs){
        var data = convertJSONtoPGN(docs[0]);
        res.render('chessgame', {
            "title" : "Chess Game " + id,
            "id" : id,
            "game" : data
        });
    });
});

// Adds a new chess game with pgn notation
router.get('/admin/add', function(req, res, next) {
    res.render('chessadd');
});

// Insert the new chess game to the database
router.post('/admin/add', function(req, res, next) {
    var db = req.db;
    var gamedata = convertPGNtoJSON(req.body.gamedata);
    var collection = db.get('pgnchess');
    collection.insert(gamedata, function (err, doc) {
        if (err) {
            // If it failed, return ERROR
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/admin/edit/" + doc["_id"]);
        }
    });
});

// View all existing games to edit
router.get('/admin/edit', function(req, res, next) {
    var db = req.db;
    var collection = db.get('pgnchess');
    collection.find({},{},function(e,docs){
        res.render('chessedit', {
            "title" : "Edit Chess Games",
            "games" : docs
        });
    });
});

// Edit specific existing chess game
router.get('/admin/edit/:id', function(req, res, next) {
    var db = req.db;
    var id = req.params.id;
    var collection = db.get('pgnchess');
    collection.find({_id: id},{},function(e,docs){
        var data = convertJSONtoPGN(docs[0]);
        res.render('chessgameedit', {
            "title" : "Edit Chess Game " + id,
            "id" : id,
            "game" : data
        });
    });
});

// Update specific chess game
router.post('/admin/edit/:id', function(req, res, next) {
    var db = req.db;
    var id = req.params.id;
    var gamedata = convertPGNtoJSON(req.body.gamedata);
    var collection = db.get('pgnchess');
    collection.update({_id: id}, gamedata, function (err, doc) {
        console.log(doc);
        if (err) {
            // If it failed, return ERROR
            res.send("There was a problem updating the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/admin/edit/" + id);
        }
    });
});

// Update specific chess game
router.post('/admin/delete/:id', function(req, res, next) {
    var db = req.db;
    var id = req.params.id;
    var collection = db.get('pgnchess');
    collection.remove({_id: id}, function (err, doc) {
        console.log(doc);
        if (err) {
            // If it failed, return ERROR
            res.send("There was a problem deleting the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/admin/edit");
        }
    });
});



module.exports = router;
