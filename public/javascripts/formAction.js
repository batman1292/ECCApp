var english = /^[A-Za-z0-9]*$/;
var number = /^[0-9]*$/;

function handelInput(e, type){
  if(e.keyCode === 13){
    if(english.test(document.getElementById(type).value)){
      if(document.getElementById('rfid').value.length === 8){
        if(document.getElementById('barcode').value === ""){
          document.getElementById('barcode').focus();
          // disable rfid tag
          // var disable = document.createAttribute("disabled");
          // disable.value = '';
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
          // success to get input
          checkData(document.getElementById('barcode').value);
        }
      } else {
        swal({
          title: "เกิดข้อผิดพลาด!",
          text: "กรุณาแตะบัตรก่อน scan barcode",
          type: "error",
          confirmButtonText: "ตกลง"
        },function(){
          document.getElementById('rfid').value = "";
        });
      }
    }else{
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

function resetInput(){
  document.getElementById('rfid').value = "";
  document.getElementById('rfid').removeAttribute("disabled");
  document.getElementById('barcode').value = "";
  document.getElementById('rfid').focus();
}

function checkData(studentID){
  console.log(studentID);
  $.post("//localhost:3000/model/findStudentByID", {studentID : studentID}, function(){})
    .done(function (data){
      swal({
        title: "<h2 style='color:#c9dae1'>Info</h2>",
        text: "กรุณากรอกรหัสประจำตัวประชาชนเพื่อยืนยันตัวตนเข้าใช้งาน",
        type: "input",
        html: true,
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        animation: "slide-from-top",
        inputPlaceholder: "กรอกรหัสประจำตัวประชาชน"
      },
        function(inputValue){
          if (inputValue === false) return false;

          if (inputValue === "") {
            swal.showInputError("กรุณากรอกข้อมูล");
            return false;
          }
          if (!number.test(inputValue) || inputValue.length != 13){
            swal.showInputError("ข้อมูลไม่ถูกต้อง<br>กรุณากรอกข้อมูลใหม่");
            return false;
          }

          $.post("//localhost:3000/model/checkHash", {studentID : studentID, salt : data.salt}, function(){})
          .done(function (data){
            swal("สำเร็จ!", "", "success");
          })
          .error(function (data){
            console.log(data);
            swal.showInputError("ข้อมูลไม่ถูกต้อง<br>กรุณากรอกข้อมูลใหม่");
            return false;
          });
        }
      );
    })
    .error(function(data){
      swal({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่พบข้อมูล กรุณา scan barcode หรือ กรอกรหัสนศ. อีกครั้ง",
        type: "error",
        confirmButtonText: "ตกลง"
      },function(){
        document.getElementById('barcode').value = "";
      });
    });
}
