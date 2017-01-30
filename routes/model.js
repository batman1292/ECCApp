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
  db.get("SELECT SALT FROM STU_CARD WHERE STU_CODE == "+req.body.studentID,function(err, row){
        // res.json({ "count" : row.value });
    // console.log(row);
    if ( row != null ) {
      res.status(200).json({salt: row.SALT});
    }else{
      res.status(404).json({error: "Not Found"});
    }
  });
});

router.post('/checkHashMD5', function(req, res, next){
  var query = "SELECT * FROM STU_CARD WHERE ID_MD5 == '"+req.body.hash+"'";
  // console.log(query);
  db.get(query, function(err, row){
        // res.json({ "count" : row.value });
    // console.log(row);
    if ( row != null ) {
      res.status(200).json({rfid_code: row.RFID_CODE});
    }else{
      res.status(404).json({error: "Not Found"});
    }
  });
  // var indexFind = findStudent(req.body.salt, 1);
  // if(indexFind != 0){
  //   if(hash = req.body.hash === dataArray[indexFind].split(',')[2]){
  //     res.status(200).json({
  //                             msg: "success"
  //                           // titleName: dataArray[indexFind].split(',')[1],
  //                           // Name: dataArray[indexFind].split(',')[2],
  //                           // Surname: dataArray[indexFind].split(',')[3]
  //                           // isActive: dataArray[indexFind].split(',')[4],
  //                           // salt: dataArray[indexFind].split(',')[5]
  //                         });
  //   }
  //   // console.log(hash);
  // }
  // res.status(404).json({error: "invalid value"});
});

module.exports = router;
