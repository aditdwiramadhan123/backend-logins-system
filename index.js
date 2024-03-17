const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connection");
const respon = require("./respon");

app.use(bodyParser.json());

// sign up page
app.post("/signUp", (req, res) => {
  // data yang input
  const { username, password } = req.body;
  // memasukan data yang diinput ke database
  const mySqlQuery = `INSERT INTO user (id, username, password) VALUES (NULL, '${username}', '${password}' )`;
  db.query(mySqlQuery, (error, result) => {
    if (error) {
      respon(500, null, error.message, res);
    } else {
      data = {
        password: password,
        username: username,
      };
      respon(200, data, "berhaasil membuat akun baru", res);
    }
  });
});

// login page
app.post("/login", (req, res) => {
  // data yang input
  const { username, password } = req.body;
  // memasukan data yang diinput ke database
  const mySqlQuery = `SELECT * FROM user WHERE username ='${username}'  AND password = '${password}'`;
  db.query(mySqlQuery, (error, result) => {
    if (result.length == 0) {
      respon(500, null, "password atau username tidak valid", res);
    } else {
      data = {
        id: result[0].id,
        password: password,
        username: username,
      };
      respon(200, data, "login sukses", res);
    }
  });
});

// change password page (put)
app.put("/changePassword/:username", (req, res) => {
  const username = req.params.username;
  const { password, newPassword, confirmPassword } = req.body;
  var mySqlQuery = `SELECT * FROM user WHERE username = '${username}'  AND password = '${password}'`;
  db.query(mySqlQuery, (error, result) => {
    if (error) {
      console.error(error.stack);
    } else {
      if (result.length == 0) {
        respon(500, null, "kata sandi dan username tidak cocok", res);
      } else {
        const id = result[0].id;
        if (confirmPassword == newPassword) {
          var mySqlQuery = `UPDATE user SET password = '${newPassword}' WHERE username = '${username}'`;
          db.query(mySqlQuery, (error, result) => {
            data = {
              id: id,
              username: username,
              newPassword: newPassword,
            };
            respon(200, data, "password berhasil diubah", res);
          });
        } else {
          respon(
            400,
            null,
            "Password baru dan konfirmasi password tidak cocok",
            res
          );
        }
      }
    }
  });
});

// delete account page
app.delete("/delete/:username", (req, res) => {
  const username = req.params.username;
  const {password } = req.body;
  var mySqlQuery = `SELECT * FROM user WHERE username ='${username}'  AND password = '${password}'`;
  db.query(mySqlQuery, (error, result) => {
    if (result.length == 0) {
      respon(500, null, "kata sandi dan username tidak cocok", res);
    } else {
      const id = result[0].id;
      var mySqlQuery = `DELETE FROM user WHERE username = '${username}'`;
      db.query(mySqlQuery, (error, result) => {
        data = {
          id: id,
          username: username,
        };
        respon(200, data, "akun berhasil dihapus", res);
      });
    }
  });
});

app.listen(port, () => {
  console.log("server running");
});
