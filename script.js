 let photoUrl;
 function download() {
  var file = document.getElementById("roomImageUpload").files[0];
  var reader = new FileReader();
  
  try {
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      photoUrl = reader.result;
      console.log(photoUrl);
      add();
    };
  } catch (error) {
    alert("Не все данные введены корректно!");

    console.log("Ошибка чтения файла:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
   
      $.ajax("http://127.0.0.1:3000/Rooms", {
        method: "post",
        success: function (data) {
          console.log("Data " + data);
          showCard(data);
          showCardEdit(data)
        },
      });
    })
    
    function showCard(data) {
        console.log(data[0]);
        let rooms = document.getElementById("roomTypet");
        // let roomsEdit = document.getElementById("roomedit");

        rooms.innerHTML = "";
        for (var i = 0; i < data.length; i++) {
          let cardHTmL = `
          <option  value="${data[i].name_room}">${data[i].name_room}</option>`;
          rooms.insertAdjacentHTML("beforeend", cardHTmL);
          // roomsEdit.insertAdjacentHTML("beforeend", cardHTmL);

        }
        console.log(rooms);
   
      }
        
        function showCardEdit(data) {
            console.log(data[0]._id);
            // let rooms = document.getElementById("roomTypet");
            let roomsEdit = document.getElementById("roomedit");
    
         
            for (var i = 0; i < data.length; i++) {
              let cardHTmL = `
              <option  value="${data[i]._id}">${data[i].name_room}</option>`;
              // rooms.insertAdjacentHTML("beforeend", cardHTmL);
              roomsEdit.insertAdjacentHTML("beforeend", cardHTmL);
    
            }
         
          }
 
 
  
function deleteRoom(){
    const selectElement = document.getElementById("roomTypet");
    const selectedValue = selectElement.value;
    
    $.ajax("http://127.0.0.1:3000/del", {
        method: "POST",
        data: JSON.stringify({
            name:selectedValue ,
           
        }),
        contentType: "application/json",
        success: function (data) {
            alert(data.message);
           
        },
        error: function (err) {
            console.log(err);
        },
    });
    
}
function add(){
  let name=document.getElementById("name_room").value.toString()
  let type= document.getElementById("roomType").value.toString()
  let guest=document.getElementById("guest").value.toString()
  let cost=parseInt(document.getElementById("roomPrice").value)
  let internet=document.getElementById("roomAmenitiesInternet").checked
  let breakfast=document.getElementById("roomAmenitiesBreakfast").checked
  let dryer=document.getElementById("roomAmenitiesHairDryer").checked
  let kettle= document.getElementById("roomAmenitiesKettle").checked

  console.log(name, dryer,type,guest,internet,photoUrl.toString())
  if(name==="" || type =="" || guest=="" || photoUrl.toString()=="" ||cost==""  )
    {
        alert("Заполните все поля!")
        return
    }

  $.ajax("http://127.0.0.1:3000/add_room.html/add", {
      method: "POST",
      data: JSON.stringify({
          "name_room":name ,
          "type":type,
          "guest": guest,
         "photoUrl":photoUrl.toString(),
         "cost":cost,
          "internet":internet ,
          "breakfast":breakfast ,
          "dryer":dryer ,
          "kettle":kettle,
          "boking":[],
         
          "date": new Date().toDateString(),
      }),
      contentType: "application/json",
      success: function (data) {
          alert(data.message);
          // getData();
      },
      error: function (err) {
          console.log(err);
      },
  });

}
function Edit(){
  let name=document.getElementById("name_room1").value.toString()
  let type= document.getElementById("roomType1").value.toString()
  let guest=document.getElementById("guest1").value.toString()
  // let photo=photoUrl
  let cost=parseInt(document.getElementById("roomPrice1").value)
  const selectElement = document.getElementById("roomedit");
  const selectedValue = selectElement.value;
  // let internet=document.getElementById("roomAmenitiesInternet").checked
  // let breakfast=document.getElementById("roomAmenitiesBreakfast").checked
  // let dryer=document.getElementById("roomAmenitiesHairDryer").checked
  // let kettle= document.getElementById("roomAmenitiesKettle").checked

   console.log(cost)
  if(name===""){
    name="0";
  }
   if(type ==="" ){
    type="0"
  }
  if(guest===""){
    guest="0"
  }
  // if(!photoUrl){
  //   photoUrl="0"
  // }
  if(cost===null ){
    cost=0
  }


  $.ajax("http://127.0.0.1:3000/edit", {
      method: "POST",
      data: JSON.stringify({
        "id": selectedValue ,
          "name_room":name ,
          "type":type,
          "guest": guest,
        //  "photoUrl":photoUrl.toString(),
         "cost":cost,
          // "internet":internet ,
          // "breakfast":breakfast ,
          // "dryer":dryer ,
          // "kettle":kettle,
          // "boking":[],
         
          // "date": new Date().toDateString(),
      }),
      contentType: "application/json",
      success: function (data) {
          alert(data.message);
          // getData();
      },
      error: function (err) {
          console.log(err);
      },
  });
}
