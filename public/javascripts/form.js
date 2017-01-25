var english = /^[A-Za-z0-9]*$/;

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
        } else if(document.getElementById('barcode').value.length != 13){
          swal({
            title: "เกิดข้อผิดพลาด!",
            text: "กรุณา scan barcode",
            type: "error",
            confirmButtonText: "ตกลง"
          },function(){
            document.getElementById('barcode').value = "";
          });
        } else {
          // success to get input
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

function validateInput(input){
  var english = /^[A-Za-z0-9]*$/;
  console.log(english.test(input));
}

function resetInput(){
  document.getElementById('rfid').value = "";
  document.getElementById('rfid').removeAttribute("disabled");
  document.getElementById('barcode').value = "";
  document.getElementById('rfid').focus();
}
