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
  var   query = "UPDATE STU_CARD SET RFID_CODE == '"+req.body.rfid_code+"' WHERE STU_CODE == '"+req.body.studentID+"'";
  console.log(query);
  db.run(query, [],
    function(err) {
      if (err) {
        res.status(404).json({error: "Not Found"});
      }else{
        res.status(200).json({msg: "success"});
      }
    }
  );
});

// router.get('/')

module.exports = router;
