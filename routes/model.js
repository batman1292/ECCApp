var express = require('express');
var router = express.Router();
const fs = require('fs');
var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();
var inputPath = './public/doc/data.csv';
var dataArray;
var dbPath = './models/ECCApp.db';
var db = new sqlite3.Database(dbPath);

function readCSVfile(inputPath){
  var contents = fs.readFileSync(inputPath).toString();
  // console.log(contents);
  // fs.readFileSync(inputPath, 'utf8', function (err, data) {
    dataArray = contents.split(/\r?\n/);  //Be careful if you are in a \r\n world...
  //   // console.log(dataArray);
  // })
}

function findStudent(input, type){
  for(var i = 1; i<dataArray.length-1; i++){
    // console.log(dataArray[i].split(',')[0]);
    if(input === dataArray[i].split(',')[type]){
      return i;
    }
  }
  return 0;
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

/* GET users listing. */
// readCSVfile(inputPath);
router.get('/', function(req, res, next) {

});

router.post('/findStudentByID', function(req, res, next){
  db.get("SELECT SALT FROM STU_HASH WHERE STU_CODE == "+req.body.studentID,
    function(err, row){
      if ( row != null ) {
        res.status(200).json({salt: row.SALT});
      }else{
        res.status(404).json({error: "Not Found"});
      }
    }
  );
});

router.post('/checkHashMD5', function(req, res, next){
  db.get("SELECT * FROM STU_CARD as card LEFT JOIN STU_HASH as hash ON card.STU_CODE = hash.STU_CODE WHERE hash.ID_MD5 == '"+req.body.hash+"'",
    function(err, row){
      console.log(row);
      if ( row != null ) {
        res.status(200).json({rfid_code: row.RFID_CODE});
      }else{
        res.status(404).json({error: "Not Found"});
      }
    }
  );
});

router.put('/updateRFIDCode',function(req, res, next){
  var query = "UPDATE STU_CARD SET RFID_CODE == '"+req.body.rfid_code+"' WHERE STU_CODE == '"+req.body.studentID+"'";
  console.log(query);
  db.run(query, [],
    function(err) {
      if (err) {
        res.status(400).json({error: "Can't update data"});
      }else{
        res.status(200).json({msg: "success"});
      }
    }
  );
});

// CRUD for STU_INFO table
router.post('/studentInfo', function(req, res, next){
  var query = "INSERT INTO STU_INFO (CODE, TITLE, NAME, SURNAME) VALUES ('"+req.body.studentID+"', '"+req.body.title+"', '"+req.body.name+"', '"+req.body.surname+"')";
  db.run(query, [],
    function(err) {
      if (err) {
        res.status(400).json({error: "Can't create data"});
      }else{
        res.status(200).json({msg: "success"});
      }
    }
  );
});

// get all student
router.get('/studentInfo', function(req, res, next){
  var query = "SELECT * FROM STU_INFO";
  db.get(query,
    function(err, row){
      if(err){
        res.status(500).json({error: "db error"});
      }else{
        if(row != null){
          res.status(200).json({data: row});
        }else{
          res.status(404).json({error: "Not Found"});
        }
      }
    }
  );
});
// get from studentID
router.get('/studentInfo/:studentID', function(req, res, next){
  var query = "SELECT * FROM STU_INFO WHERE STU_CODE == '"+req.params.studentID+"'";
  db.get(query,
    function(err, row){
      if(err){
        res.status(500).json({error: "db error"});
      }else{
        if(row != null){
          res.status(200).json({data: row});
        }else{
          res.status(404).json({error: "Not Found"});
        }
      }
    }
  );
});

router.put('/studentInfo', function(req, res, next){
  // var query = "UPDATE "
});

router.delete('/studentInfo', function(req, res, next){
  var query = "DELETE FROM STU_INFO WHERE CODE = '"+req.body.studentID+"'";
  db.run(query, [],
    function(err) {
      if (err) {
        res.status(400).json({error: "Can't create data"});
      }else{
        res.status(200).json({msg: "success"});
      }
    }
  );
});

// CRUD for STU_CARD table
router.post('/studentCard', function(req, res, next){
  var query = "INSERT INTO STU_CARD (STU_CODE, RFID_CODE) VALUES ('"+req.body.studentID+"', '"+req.body.rfidID+"')";
  db.run(query, [],
    function(err) {
      if (err) {
        res.status(400).json({error: "Can't create data"});
      }else{
        res.status(200).json({msg: "success"});
      }
    }
  );
});

// get all student
router.get('/studentCard', function(req, res, next){
  var query = "SELECT * FROM STU_CARD";
  db.get(query,
    function(err, row){
      if(err){
        res.status(500).json({error: "db error"});
      }else{
        if(row != null){
          res.status(200).json({data: row});
        }else{
          res.status(404).json({error: "Not Found"});
        }
      }
    }
  );
});
// get from studentID
router.get('/studentCard/:studentID', function(req, res, next){
  var query = "SELECT * FROM STU_CARD WHERE STU_CODE == '"+req.params.studentID+"'";
  db.get(query,
    function(err, row){
      if(err){
        res.status(500).json({error: "db error"});
      }else{
        if(row != null){
          res.status(200).json({data: row});
        }else{
          res.status(404).json({error: "Not Found"});
        }
      }
    }
  );
});

router.put('/studentCard', function(req, res, next){
  // var query = "UPDATE "
});

router.delete('/studentCard', function(req, res, next){
  var query = "DELETE FROM STU_CARD WHERE STU_CODE = '"+req.body.studentID+"'";
  db.run(query, [],
    function(err) {
      if (err) {
        res.status(400).json({error: "Can't create data"});
      }else{
        res.status(200).json({msg: "success"});
      }
    }
  );
});

// CRUD for STU_HASH table
router.post('/studentHash', function(req, res, next){
  var query = "INSERT INTO STU_HASH (STU_CODE, SALT, ID_MD5, ID_SHA256) VALUES ('"+req.body.studentID+"', '"+req.body.salt+"', '"+req.body.md5+"', '"+req.body.sha+"')";
  db.run(query, [],
    function(err) {
      if (err) {
        res.status(400).json({error: "Can't create data"});
      }else{
        res.status(200).json({msg: "success"});
      }
    }
  );
});

// get all student
router.get('/studentHash', function(req, res, next){
  var query = "SELECT * FROM STU_HASH";
  db.get(query,
    function(err, row){
      if(err){
        res.status(500).json({error: "db error"});
      }else{
        if(row != null){
          res.status(200).json({data: row});
        }else{
          res.status(404).json({error: "Not Found"});
        }
      }
    }
  );
});
// get from studentID
router.get('/studentHash/:studentID', function(req, res, next){
  var query = "SELECT * FROM STU_HASH WHERE STU_CODE == '"+req.params.studentID+"'";
  db.get(query,
    function(err, row){
      if(err){
        res.status(500).json({error: "db error"});
      }else{
        if(row != null){
          res.status(200).json({data: row});
        }else{
          res.status(404).json({error: "Not Found"});
        }
      }
    }
  );
});

router.put('/studentHash', function(req, res, next){
  // var query = "UPDATE "
});

router.delete('/studentHash', function(req, res, next){
  var query = "DELETE FROM STU_HASH WHERE STU_CODE = '"+req.body.studentID+"'";
  db.run(query, [],
    function(err) {
      if (err) {
        res.status(400).json({error: "Can't create data"});
      }else{
        res.status(200).json({msg: "success"});
      }
    }
  );
});

module.exports = router;
