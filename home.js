
function dateINHome() {
  var selectElement = document.getElementById("choice");

  var selectedValue = selectElement.value;

  console.log(selectedValue);

  var datetElements = document.getElementsByClassName("inp-sort");
  var outDate = datetElements[2].value;

  var inDate = datetElements[1].value;
  console.log(inDate);
  console.log(outDate);
if(selectedValue === undefined||inDate.toString() ===""||outDate.toString() ===""){
  alert("Заполните все поля!");
  return;
}
  localStorage.setItem("guest", selectedValue);
  localStorage.setItem("check-in", inDate);
  localStorage.setItem("check-out", outDate);
  localStorage.setItem("newWindow", true);
  window.open("Rooms.html", "_self");
  // search()
}


document.addEventListener("DOMContentLoaded", function () {
  const currentDate = new Date().toISOString().split("T")[0];
  const checkInDateInput = document.getElementById("check-in-date");
  checkInDateInput.min = currentDate;
  const checkOutDateInput = document.getElementById("check-out-date");
  checkOutDateInput.min = currentDate;
});

{
  /* <div class="sort">
<div class="guest-list">
  <form >
  <section>
    <label for="guest-select">
      <img src="img\Person.png" alt="#" class="icon-sort" />
      <p class="text-sort">Guests:</p>
    </label>
    <select class="inp-sort" id="choice" name="choice" required>
      <option value="1">01</option>
      <option value="2">02</option>
      <option value="3">03</option>
      <option value="4">04</option>
      <!-- <option value="5">05</option> -->
    </select>
  </section>
</div>

<div class="date">
  <div class="chek-date">
    <section>
      <label for="check-date">
        <img src="img\Date.png" alt="#" class="icon-sort" />
        <p class="text-sort">Check in:</p>
      </label>
      <input class="inp-sort" type="date" name="check-date"required />
    </section>
  </div>

  <div class="chek-date">
    <section>
      <label for="check-date">
        <img src="img\Date.png" alt="#" class="icon-sort" />
        <p class="text-sort">Check out:</p>
      </label>
      <input class="inp-sort" type="date" name="check-date" />
      <!-- id="check-out-date"   id="check-in-date"-->
    </section>
  </form>
  </div>
</div>
<div class="nav"><button class="book-now" onclick="dateINHome()">Book now</button></div>
</div> */
}
