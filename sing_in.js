


window.addEventListener("beforeunload", function (event) {
  if (event.currentTarget === window) {
    localStorage.removeItem("guest");
    localStorage.removeItem("check-in");
    localStorage.removeItem("check-out");


    // localStorage.setItem('guest', selectedValue);
    // localStorage.setItem('check-in', inDate);
    // localStorage.setItem('check-out', outDate);
    // Удалите другие значения, если необходимо
  }
});
var Admin = false;

function checkFields() {
  if (
    document.querySelector('.dataUser[type="email"]').value === "" ||
    document.querySelector('.dataUser[type="password"]').value === ""
  )
    // document.getElementById("region").value ==="")
    return false;
  else return true;
}

function add_user() {
  const password = document
  .querySelector('.dataUser[type="password"]')
  .value.toString();


  if (!checkFields()) {
    alert("Заполните все поля!");
    return;
  }
  console.log(
    document.querySelector('.dataUser[type="email"]').value.toString()
  );
  console.log(
    document.querySelector('.dataUser[type="password"]').value.toString()
  );

  $.ajax("http://127.0.0.1:3000/sing_in.html/add_user", {
    method: "POST",
    data: JSON.stringify({
      email: document.querySelector('.dataUser[type="email"]').value.toString(),
      password: password,
      isAdmin: false,
      date: new Date().toDateString(),
    }),
    contentType: "application/json",
    contentType: "application/json",
    success: function (data) {
      alert(data.message);
      // getData();
    },
    error: function (err) {
      console.log(err.responseJSON.message);
      alert(err.responseJSON.message);
    },
  });
  document.querySelector('.dataUser[type="email"]').value = " ";
  document.querySelector('.dataUser[type="password"]').value = "";
}

//вход
function enter_user() {
  let localData;
  let adminFun = document.getElementById("admin");
  if (!checkFields()) {
    alert("Заполните все поля!");
    return;
  }
  $.ajax("http://127.0.0.1:3000/sing_in.html/enter_user", {
    method: "POST",
    data: JSON.stringify({
      email: document.querySelector('.dataUser[type="email"]').value.toString(),
      password: document
        .querySelector('.dataUser[type="password"]')
        .value.toString(),
    }),
    contentType: "application/json",
    success: function (data) {
      var message = data.message;
      console.log(message);
      // localData = data.email;
      var localData = data.email;
      var adm = data.admin;
      console.log(localData);
      console.log(data.admin.toString());

      localStorage.setItem('email',localData.toString());
      console.log(adm);
      if (data.admin) {
        localStorage.setItem("admin", data.admin);
      } else {
        localStorage.setItem("admin", data.admin);
      }
      window.open(message, "_self");
    },
    error: function (err) {
    
alert( "Неверный email или пароль");
    },
  });
  // console.log( localData.toString());

  // localStorage.setItem('email', localData.toString());
}
styles();
function styles() {
  if (Admin) {
    document.getElementById("admin").style.display = "block";
  } else {
  }
}
