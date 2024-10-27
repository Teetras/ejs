console.log("ajax call");

function getData() {
  $.ajax("http://127.0.0.1:3000/Rooms", {
    method: "post",
    success: function (data) {
      console.log("Data " + data);
      showCard(data);
    },
  });
}
function sortByName(){
  $.ajax("http://127.0.0.1:3000/sortByName", {
    method: "post",
   
    success: function (data) {
      
      // console.log("Data " + data);
      showCard(data);
    },
  });
}
function sortCost(orientation) {
  console.log(orientation);
  $.ajax("http://127.0.0.1:3000/sortCost", {
    method: "post",
    data: JSON.stringify({
    
       "sort":orientation,
   
   
    }),
    contentType: "application/json",
    success: function (data) {
      
      // console.log("Data " + data);
      showCard(data);
    },
  });
}
getData();
function showCard(data) {
  console.log(data[0]);
  let rooms = document.getElementsByClassName("rooms")[0];
  rooms.innerHTML = "";
  for (var i = 0; i < data.length; i++) {
    let cards = document.createElement("div");
    cards.className = "cards";
    let img = document.createElement("img");
    // let svg = document.createElement("img");

    img.src = data[i].photoUrl;
    img.className = "foto-room";
    // document.getElementsByClassName("rooms")[0]+=data[i]
    cards.appendChild(img);

    let breakfast = document.createElement("img");
    breakfast.src = "icon/breakfast.svg";

    let dryer = document.createElement("img");
    dryer.src = "icon/dryer.svg";

    let wiFi = document.createElement("img");
    wiFi.src = "icon/wiFi.svg";

    let kettle = document.createElement("img");
    kettle.src = "icon/kettle.svg";

    if (data[i].kettle) {
      kettle.className = "icons";
    } else {
      kettle.className = "empty-icon";
    }

    if (data[i].dryer) {
      dryer.className = "icons";
    } else {
      dryer.className = "empty-icon";
    }

    if (data[i].breakfast) {
      breakfast.className = "icons";
    } else {
      breakfast.className = "empty-icon";
    }

    if (data[i].internet) {
      wiFi.className = "icons";
    } else {
      wiFi.className = "empty-icon";
    }
    let cardHTmL = `
        <div class="card">
        ${img.outerHTML}
        <div class="cost">
        <div class="">
         <p class="name-room">${data[i].name_room} </p>
         <p class="text-room">Тип Комнаты: ${data[i].type} </p>

     </div>
        
              <div class="text-room">${data[i].cost} $ за ночь</div>
              ${kettle.outerHTML} ${dryer.outerHTML}
              ${wiFi.outerHTML}${breakfast.outerHTML}
              </div>
              
              <div class="nav button booking">
              <button class="book-now" onclick="booking('${data[i]._id}')">Бронировать</button>

              <div class="date-room" id="${data[i]._id}" >
              <div class="chek-date">
                <section>
                  <label for="check-date">
                    <p class="text-sort">Заезд:</p>
                  </label>
                  <input id="check-in-date" class="inp-sort ${data[i]._id}" type="date" name="check-date" required />
                </section>
              </div>
      
              <div class="chek-date">
                <section>
                  <label for="check-date">
                    <p class="text-sort">Выезд:</p>
                  </label>
                  <input id="check-out-date" class="inp-sort ${data[i]._id}" type="date" name="check-date" />
                </section>
              </div>
            </div>
              </div>

              </div>
        `;
    rooms.innerHTML += cardHTmL;
  }
}

const arrowBlock = document.querySelector(".arrow");

arrowBlock.addEventListener("click", () => {
  window.scrollTo({
    top: window.pageYOffset + 900,
    behavior: "smooth",
  });
});

function checkDates(dateIn, dateOut) {
  if (dateIn || dateOut)
    return false;
  else return true;
}
function booking(roomId) {
  console.log(roomId);
  checkInDate = localStorage.getItem("check-in");
  checkOutDate = localStorage.getItem("check-out");
  email = localStorage.getItem("email");

  if (!checkInDate || !checkOutDate) {
    var dateRoomElement = document.getElementById(roomId);

    // Устанавливаем свойство "display" элемента на "flex"
    dateRoomElement.style.display = "flex";
    var checkDate = document.getElementsByClassName(roomId);

    checkInDate = checkDate[0].value;
    checkOutDate = checkDate[1].value;

    if (!checkInDate || !checkOutDate) {
      // Одна или обе даты не выбраны
      console.log("Выберите обе даты");
      alert("Пожалуйста, выберите обе даты");
    } else {
      console.log(checkInDate, checkOutDate);
      // Дополнительная логика или действия

      $.ajax("http://127.0.0.1:3000/booking", {
        method: "POST",
        data: JSON.stringify({
          booking: {
            email: email,
            "check-in": checkInDate,
            "check-out": checkOutDate,
          },
          roomId: roomId,
        }),
        contentType: "application/json",
        success: function (data) {
          alert(data);
          localStorage.removeItem("check-in");
          localStorage.removeItem("check-out");
        },
        error: function (err) {
          console.log(err);
        },
      });
    }
  } else {
    $.ajax("http://127.0.0.1:3000/booking", {
      method: "POST",
      data: JSON.stringify({
        booking: {
          email: email,
          "check-in": checkInDate,
          "check-out": checkOutDate,
        },
        roomId: roomId,
      }),
      contentType: "application/json",
      success: function (data) {
        alert(data);
        localStorage.removeItem("check-in");
        localStorage.removeItem("check-out");
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
}

if(localStorage.getItem("newWindow")){
  search()
  localStorage.removeItem("newWindow");

}

function search() {

  var selectElement = document.getElementById("choice");
  var selectedValue = selectElement.value;
  var datetElements = document.getElementsByClassName("inp-sort");
  var outDate = datetElements[2].value;
  var inDate = datetElements[1].value;
  if(selectedValue === undefined||inDate.toString() ===""||outDate.toString() ===""){
    selectedValue=localStorage.getItem("guest")
    inDate=localStorage.getItem("check-in")
    outDate=localStorage.getItem("check-out")
    if(selectedValue === undefined||inDate.toString() ===""||outDate.toString() ===""){
      alert("Заполните все поля!");
      return;
    }
  
  }
  localStorage.setItem("guest", selectedValue);
  localStorage.setItem("check-in", inDate);
  localStorage.setItem("check-out", outDate);
  console.log(inDate);
  $.ajax("http://127.0.0.1:3000/search", {
    method: "POST",
    data: JSON.stringify({
      checkIn: inDate,
      checkOut: outDate,
      guest: selectedValue,
    }),
    contentType: "application/json",
    success: function (response) {
      // Обработка ответа от сервера
      console.log(response);
      showCard(response);
    },
    error: function (error) {
      // Обработка ошибки
      console.log(error);
    },
  });
}
