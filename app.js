const express = require("express");
const { connectToDb, getDb } = require("./db");
const cors = require("cors");
const session = require("express-session");
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(__dirname));
app.use(
  session({
    secret: "mysecretkey", // Секретный ключ для подписи сеансов
    resave: false,
    saveUninitialized: false,
  })
);
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(PORT, (err) => {
      err ? console.log(err) : console.log(`listening port ${PORT}`);
    });
    db = getDb();
  } else {
    console.log(`db connection error: ${err}`);
  }
});
// app.get("/", (req, res) => {
//   console.log("uuuu");
// });
app.post("/add_room.html/add", (req, res) => {
  console.log(req.body);
  db.collection("room")
    .insertOne(req.body)
    .then(() => {
      res.status(201).json({ message: "Успешно добавлено!" });
    })
    .catch(() => {
      res.status(500).json({ error: "Что-то пошло не так..." });
    });
});

const bcrypt = require('bcryptjs');

app.post("/sing_in.html/add_user", async (req, res) => {
  console.log(req.body);

  try {
    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });

    if (user) {
      res.status(409).json({ message: "Пользователь с этой почтой уже зарегестрирован." });
    } else {
      // Хеширование пароля
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      // Сохранение хешированного пароля вместо оригинального
      const userToAdd = {
        email: req.body.email,
        password: hashedPassword,
        isAdmin: false,
        date: new Date().toDateString(),
      };

      db.collection("users")
        .insertOne(userToAdd)
        .then(() => {
          res.status(201).json({ message: "Успешно добавлено!" });
        })
        .catch(() => {
          res.status(500).json({ error: "Что-то пошло не так..." });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Что-то пошло не так..." });

  }
});


app.post("/sing_in.html/enter_user", async (req, res) => {
  console.log(req.body.password);
  let isAdm = false;
  const password = req.body.password;
  try {
    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });
      if (user && bcrypt.compareSync(password, user.password)) {
      // пользователь найден и пароль верный
      console.log("Пользователь авторизован");
      console.log(user.isAdmin);
      if (user.isAdmin) {
        isAdm = true;
      }
      console.log(user.email);
      res
        .status(200)
        .json({ message: "homepage.html", email: user.email, admin: isAdm });
    } else {
      // пользователь не найден или пароль неверный
      console.log("Неверный email или пароль");
    res.status(500).json({ message: "Неверный email или пароль" });

    }
  } catch (error) {
    console.log(error);
    console.log("Неверный email или пароль");

    res.status(500).json({ message: "Неверный email или пароль" });
  }
});
app.post("/del", (req, res) => {
  console.log(req.body.name);
  db.collection("room")
    .deleteOne({ name_room: req.body.name })
    .then((result) => {
      // Обработка успешного удаления объекта
      console.log("Object deleted");
      res.status(201).json({ message: "Объект удален" });
    })
    .catch((error) => {
      // Обработка ошибки удаления
      console.error("Error deleting object:", error);
      res.status(500).json({ message: "Ошибка при удалении объекта" });
    });
});
app.post("/Rooms", (req, res) => {
  const rooms = [];
  db.collection("room")
    .find()
    .forEach((element) => rooms.push(element))
    .then(() => {
      // console.log("Rooms " + rooms);
      res.status(201).json(rooms);
      // console.log("send");
    })
    .catch(() => {
      res.status(500).json({ error: "Что-то пошло не так..." });

    });
});
app.post("/sortCost", (req, res) => {
  console.log("sort call");
console.log(req.body.sort)
  const rooms = [];
  db.collection("room")
    .find()
    .sort({ cost:req.body.sort})
    .toArray()
    .then((rooms) => {
      // console.log("Rooms: ", rooms);
      res.status(201).json(rooms);
      console.log("send");
    })
    .catch(() => {
      res.status(500).json({ error: "Что-то пошло не так..." });

    });
});
app.post("/sortByName", (req, res) => {
  console.log("Вызов сортировки");
  // console.log(req.body.sort);

  // const sortField = req.body.sort; // Укажите поле для сортировки (например, "name")

  db.collection("room")
    .find()
    .sort({ name_room: 1 }) // Сортировка по возрастанию на основе указанного поля
    .toArray()
    .then((rooms) => {
      res.status(201).json(rooms);
      console.log("Отправка");
    })
    .catch(() => {
      res.status(500).json({ error: "Что-то пошло не так..." });
    });
});

const { ObjectId } = require("mongodb");

app.post("/booking", async (req, res) => {console.log(req.body)
  try {
    const objectId = new ObjectId(req.body.roomId);
    console.log(objectId);
    const result = await db
      .collection("room")
      .updateOne(
        { _id: { $eq: objectId } },
        { $addToSet: { boking: req.body.booking } }
      );
    console.log(result);
    res.status(200).send("Успешно забронировано!");

  } catch (err) {
    console.error(err);
    res.status(500).send("Произошла ошибка при поиске объекта");
  }
});
  app.post("/bookingDel", async (req, res) => {
  console.log(req.body);

  var bookingIndex = req.body.bookingIndex;
  const objectId = new ObjectId(req.body.roomId);
  console.log(objectId);
  try {
    // Находим комнату по идентификатору roomId
    const room = await db.collection("room").findOne({ _id: objectId });
    console.log(room);
    room.boking = room.boking.filter((item, index) => index !== bookingIndex);
    console.log(room.boking );
    // Сохраняем обновленные данные комнаты в базе данных
    await db.collection("room").findOneAndUpdate({ _id: objectId }, { $set: { boking: room.boking } });



    // Возвращаем успешный статус
    res.status(200).send("Бронь удалена успешно.");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


app.post("/search", async (req, res) => {
  let guestBook=[req.body.guest]
  if(req.body.guest ==="0"){
    guestBook=["1","2","3","4","5"]
  }
  console.log(req.body);
  try {
   
    const result = await db
      .collection("room")
      .aggregate([
        {
          $match: {
            $and: [
              {
                boking: {
                  $not: {
                    $elemMatch: {
                      $or: [
                        {
                          $and: [
                            {
                              "check-in": {
                                $gte: new Date(req.body.checkIn).toISOString(),
                              },
                            },
                            {
                              "check-in": {
                                $lt: new Date(req.body.checkOut).toISOString(),
                              },
                            },
                          ],
                        },
                        {
                          $and: [
                            {
                              "check-out": {
                                $gt: new Date(req.body.checkIn).toISOString(),
                              },
                            },
                            {
                              "check-out": {
                                $lte: new Date(req.body.checkOut).toISOString(),
                              },
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              },
              {
                guest: { $gte: req.body.guest },
              },
            ],
          },
        },
      ])
      .toArray();

    console.log("Search result:", result);
    res.send(result);
  } catch (e) {
    console.log("Search error: " + e);
    res.status(500).send("Произошла ошибка при поиске комнат");
  }
});

app.post("/basket", (req, res) => {
  // console.log(req.body.email);
  const rooms = [];
  // console.log("basket");
  db.collection("room")
    .find({ "boking.email": req.body.email })
    .forEach((element) => rooms.push(element))
    .then(() => {
      console.log("'Rooms booking user '" + rooms);
      res.status(201).json(rooms);
      // console.log("send");
    })
    .catch(() => {
      res.status(500).json({ error: "Something went wrong..." });
    });
});

app.post("/edit",async (req, res) => {
console.log(req.body.id);
try {
let name=req.body.name_room
let type=req.body.type
let guest=req.body.guest
let cost=req.body.cost
const objectId = new ObjectId(req.body.id);
    console.log(objectId);
  const  data = await db.collection("room").findOne({ _id: objectId });
  console.log(data.cost);
  if(name==="0"){
    name=data.name_room;
  }
  if(type==="0"){
    type=data.type
  }
  if(guest==="0"){
    guest=data.guest
  }
  if(req.body.cost===null){
    cost=data.cost
  }
  console.log(cost)
  const result = await db
  .collection("room")
  .updateOne(
    { _id: { $eq: objectId } },
    { $set: { 
      type: type,
      name_room: name,
      cost: cost,
      guest: guest
    }}
  );
console.log(result);


} catch (error) {
  console.log(error);
  // Обработка ошибки...
}
// {
//   id: '645bebfd66574b822caf2daa"',
//   name_room: '0',
//   type: '0',
//   guest: '1',
//   cost: 22
// }

})

// app.post("/sing_in.html/enter_user", (req, res) => {
//   console.log(req.body.email);
//   console.log(
//     db
//       .collection("users")
//       .findOne({ email: req.body.email }, function (err, user) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log(user);
//         }
//       })
//   );

//   db.collection("users")
//     .find({ email: req.body.email })
//     .toArray(function (err, users) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(users);
//         console.log(users.length);
//         if (users.length > 0 && users[0].password === req.body.password) {
//           // пользователь найден и пароль верный
//           console.log("Пользователь авторизован");
//         } else {
//           // пользователь не найден или пароль неверный
//           console.log("Неверный email или пароль");
//         }
//       }
//     })
//     .then(() => {
//       res.status(201);
//       //   .json({message: "Successfully added!"})
//     })
//     .catch(() => {
//       res.status(500).json({ error: "Something went wrong..." });
//     });
// });
// db
//     .collection('room')
//     .insertOne(req.body)
//     .then(()=>{
//         res
//             .status(201)
//             .json({message: "Successfully added!"})
//     })
//     .catch(()=>{
//         res
//             .status(500)
//             .json({error:"Something went wrong..."})
//     })
