function openBasket() {
  document.getElementById("basketOverlay").style.display = "block";
}

function closeBasket() {
  document.getElementById("basketOverlay").style.display = "none";
}
function styles() {
  var Admin = localStorage.getItem("admin");
  console.log(Admin);
  if (Admin==="true") {
  console.log(Admin);

    document.getElementById("admin").style.display = "block";
  } else {
  }
}
styles()
function basket() {
  openBasket();
  const localEmail = localStorage.getItem("email");
  console.log(localEmail);
  let rooms = document.getElementById("basketFromDb");
  rooms.innerHTML = "";
  $.ajax("http://127.0.0.1:3000/basket", {
    method: "POST",
    data: JSON.stringify({
      email: localEmail,
    }),
    contentType: "application/json",
    success: function (data) {
      console.log(data);
      let displayedDates = []; // Массив для отслеживания уже выведенных дат

      for (var y = 0; y < data.length; y++) {
        for (var i = 0; i < data[y].boking.length; i++) {
          let booking = data[y].boking[i];

          // Проверяем, что email брони соответствует нужному пользователю
          if (booking.email === localEmail) {
            if (
              booking["check-in"] &&
              booking["check-out"] &&
              !displayedDates.includes(booking["check-in"])
            ) {
              let cardHTML = `
                <div class="bookingRoom" id="${i}">
                  <div class="">
                    <p class="nameRoom">${data[y].name_room}</p>
                    <p class="typeRoom">${data[y].type}</p>
                  </div>
                  <div class="dateBooking">
                    <div class=""> <p>Дата заезад: </p>  <p class="dateB">${booking["check-in"]}</p></div>
                    <div class=""> <p>Дата выезда: </p> <p class="dateB">${booking["check-out"]}</p></div>
                  </div>
                  <div class="cost">${data[y].cost}$ за ночьt</div>
                  <div class=""><button class="notice" onclick="deleteBooking('${data[y]._id}', ${i})">Удалить</button></div>
                </div>
              `;

              // Вставляем сформированный HTML в нужное место в DOM-структуре
              rooms.innerHTML += cardHTML;

              displayedDates.push(booking["check-in"]); // Добавляем дату в массив выведенных дат
            }
          }
        }
      }
    },

    error: function (err) {
      console.log(err);
    },
  });
}

function deleteBooking(roomId, bookingIndex) {
  // console.log(roomId, bookingIndex)
  $.ajax(`http://127.0.0.1:3000/bookingDel`, {

    method: "post",
    data: JSON.stringify({

        roomId: roomId,
        bookingIndex: bookingIndex,
    
    }),
    contentType: "application/json",
    success: function (data) {
      // Успешно удалено
      alert("Бронь удалена!");
      // Вызовите функцию обновления списка бронирований
     
    },
    error: function (err) {
      console.log(err);
      // Ошибка при удалении брони
      alert("Ошибка при удалении брони");
    },
  });
}
