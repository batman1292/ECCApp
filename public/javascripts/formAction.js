var english = /^[A-Za-z0-9]*$/;
var number = /^[0-9]*$/;
var url = "localhost";
// var url = "192.168.1.181";
var salt = "";
// var crypto = require('/javascripts/crypto/md5.js');

function handelInput(e, type){
  if(e.keyCode === 13){
    if(english.test(document.getElementById(type).value)){
      if(document.getElementById('rfid').value.length === 8){
        if(document.getElementById('barcode').value === ""){
          document.getElementById('barcode').focus();
          document.getElementById('rfid').setAttributeNode(document.createAttribute("disabled"));
        } else if(document.getElementById('barcode').value.length != 13 || !number.test(document.getElementById(type).value)){
          swal({
            title: "รหัสนักศึกษาไม่ถูกต้อง!",
            text: "กรุณา scan barcode หรือ กรอกรหัสนักศึกษาอีกครั้ง",
            type: "error",
            confirmButtonText: "ตกลง"
          },function(){
            document.getElementById('barcode').value = "";
          });
        } else {
          getData(document.getElementById('barcode').value);
        }
      }else{
        // scan barcode before
        swal({
          title: "เกิดข้อผิดพลาด!",
          text: "กรุณาแตะบัตรก่อน scan barcode",
          type: "error",
          confirmButtonText: "ตกลง"
        },function(){
          document.getElementById('rfid').value = "";
          document.getElementById('barcode').value = "";
        });
      }
    }else{
      // input error
      swal({
        title: "เกิดข้อผิดพลาด!",
        text: "กรุณาเปลี่ยนแป้นพิมพ์เป็นภาษาอังกฤษ",
        type: "error",
        confirmButtonText: "ตกลง"
      },function(){
        document.getElementById(type).value = "";
      });
    }
  }
}

function submitData(){
  var rfidID = document.getElementById('rfid').value;
  var studentID = document.getElementById('barcode').value;
  var citizenID = document.getElementById('citizen').value;
  var msg = studentID+salt+citizenID;
  // var hash = crypto.createHash('md5').update( msg ).digest("base64");
  // var hash = CryptoJS.HmacMD5(studentID+salt+citizenID, "");
  // console.log(hash.toString(CryptoJS.enc.Base64));
  var hash = CryptoJS.MD5(studentID+salt+citizenID);
  // console.log(hash.finalize);
  // console.log(CryptoJS.enc.Base64.stringify(hash));
  $.post("//"+url+":3000/model/checkHashMD5", {hash : hash.toString(CryptoJS.enc.Base64), salt : salt}, function(){})
    .done(function (data){
      swal("สำเร็จ!", "", "success");
    })
    .error(function (data){
      swal({
        title: "เกิดข้อผิดพลาด!",
        text: "ข้อมูลรหัสประจำตัวประชาชนผิดพลาด กรุณากรอกใหม่",
        type: "error",
        confirmButtonText: "ตกลง"
      },function(){
        document.getElementById('citizen').value = "";
      });
    });
}

function resetInput(){
  document.getElementById('rfid').value = "";
  document.getElementById('rfid').removeAttribute("disabled");
  document.getElementById('barcode').value = "";
  document.getElementById('citizen').value = "";
  document.getElementById('rfid').focus();
}

function getData(studentID){
  console.log(studentID);
  $.post("//"+url+":3000/model/findStudentByID", {studentID : studentID}, function(){})
    .done(function (data){
      salt = data.salt;
      document.getElementById('citizen').focus();
    })
    .error(function(data){
      swal({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่พบข้อมูล กรุณา scan barcode หรือ กรอกรหัสนศ. อีกครั้ง",
        type: "error",
        confirmButtonText: "ตกลง"
      },function(){
        document.getElementById('barcode').value = "";
        document.getElementById('barcode').focus();
      });
    });
}

function validateInput(type){
  // console.log(document.getElementById(type).length);
  if(!number.test(document.getElementById(type).value) || document.getElementById(type).value.length != 13){
    swal({
      title: "เกิดข้อผิดพลาด!",
      text: "ข้อมูลไม่ถูกต้อง กรุณากรอกข้อมูลใหม่อีกครั้ง",
      type: "error",
      confirmButtonText: "ตกลง"
    },function(){
      document.getElementById(type).value = "";
      document.getElementById(type).focus();
    });
  }else if(type === 'barcode'){
    getData(document.getElementById(type).value);
  }
}
