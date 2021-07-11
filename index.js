const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

const db = mysql.createPool({
  host: "database-1.ctdegncxgy0s.us-east-2.rds.amazonaws.com",
  database: "covidAssist",
  user: "admin",
  password: "admin1234",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM test_table";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

// get vaccine centers(reshani)
app.get("/api/VaccineCenter", (req, res) => {
  const sqlSelect = "SELECT name FROM vaccine_center";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.post("/api/insert", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const nic = req.body.nic;
  const contactNumber = req.body.contactNumber;
  const userName = req.body.userName;
  const password = req.body.password;
  const email = req.body.email;
  // const mobileUserId = '';
  const address = "diyagama";
  const gender = "male";
  const tracingKey = "1556";
  const contactTracingStatus = "0";

  const sqlInsert =
    "INSERT INTO mobile_user(first_name,last_name,nic,address,email,gender,contact_number,user_name,password,tracing_key,contact_tracing_status) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
  db.query(
    sqlInsert,
    [
      // mobileUserId,
      firstName,
      lastName,
      nic,
      address,
      email,
      gender,
      contactNumber,
      userName,
      password,
      tracingKey,
      contactTracingStatus,
    ],
    //   'INSERT INTO test_table(id,test_num,test_text) VALUES(?,?,?)';
    // db.query(
    //   sqlInsert,
    //   [
    //     mobileUserId,
    //     tracingKey,
    //     lastName,
    //   ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
