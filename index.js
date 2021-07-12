const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const crypto = require('crypto');

const db = mysql.createPool({
  host: 'database-1.ctdegncxgy0s.us-east-2.rds.amazonaws.com',
  database: 'covidAssist',
  user: 'admin',
  password: 'admin1234',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/get', (req, res) => {
  const sqlSelect = 'SELECT * FROM test_table';
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.post('/api/login', async (req, res) => {
  try {
    const userName = req.body.userName;
    const password = req.body.password;
    const hashpass = crypto.createHash('md5').update(password).digest('hex');

    db.query(
      'SELECT password FROM mobile_user WHERE user_name=? AND password=?',
      [userName, hashpass],
      (error, result, feilds) => {
        console.log(result);
        if (result.length > 0) {
          console.log('correct');
          res.send(result);
        } else {
          console.log('Invalid');
          // alert(invalid);
          res.send('wrong');
        }
      },
    );
  } catch (e) {
    console.log(e);
    res.status(500).send('Something broke!');
  }
});

app.post('/api/insert', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const nic = req.body.nic;
  const contactNumber = req.body.contactNumber;
  const userName = req.body.userName;
  const password = req.body.password;
  const email = req.body.email;
  // const mobileUserId = '';
  const address = req.body.address;
  const gender = 'male';
  const tracingKey = '1556';
  const contactTracingStatus = '0';
  const hash = crypto.createHash('md5').update(password).digest('hex');
  
  const sqlInsert =
    'INSERT INTO mobile_user(first_name,last_name,nic,address,email,gender,contact_number,user_name,password,tracing_key,contact_tracing_status) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
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
    },
  );
});

app.listen(3000, () => {
  console.log('running on port 3000');
});
