const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const crypto = require("crypto");

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

app.post("/api/login", async (req, res) => {
  try {
    console.log("loginnn");
    const userName = req.body.userName;
    const password = req.body.password;
    const hashpass = crypto.createHash("md5").update(password).digest("hex");

    db.query(
      "SELECT password FROM mobile_user WHERE user_name=? AND password=?",
      [userName, hashpass],
      (error, result, feilds) => {
        console.log(result);
        if (result.length > 0) {
          console.log("correct");
          res.send(result);
        } else {
          console.log("Invalid");
          // alert(invalid);
          res.send("wrong");
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send("Something broke!");
  }
});

// get vaccine centers(reshani)
app.get("/api/VaccineCenter", (req, res) => {
  const sqlSelect =
    "SELECT covidAssist.vaccine_center.name ,covidAssist.vaccine.vaccine_name,covidAssist.vaccine_center.center_id FROM covidAssist.vaccine_center INNER JOIN covidAssist.vaccine_center_vaccine ON covidAssist.vaccine_center.center_id=covidAssist.vaccine_center_vaccine.vaccine_center_id  Inner JOIN covidAssist.vaccine ON covidAssist.vaccine_center_vaccine.vaccine_id=covidAssist.vaccine.vaccine_id WHERE covidAssist.vaccine_center_vaccine.dose_1_quantity>0 OR covidAssist.vaccine_center_vaccine.dose_2_quantity>0 OR covidAssist.vaccine_center_vaccine.dose_3_quantity>0";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});
//GET VACCINE NAME(Reshani)
app.get("/api/VaccineName", (req, res) => {
  const sqlSelect =
    "SELECT vaccine.vaccine_name FROM covidAssist.vaccine_center_vaccine INNER JOIN  covidAssist.vaccine ON vaccine_center_vaccine.vaccine_id = vaccine.vaccine_id INNER JOIN  covidAssist.vaccine_center ON vaccine_center_vaccine.vaccine_center_id=vaccine_center.center_id WHERE vaccine_center_vaccine.quantity > 0";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.post("/api/insert", (req, res) => {
  console.log("aaaa");
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const nic = req.body.nic;
  const contactNumber = req.body.contactNumber;
  const userName = req.body.userName;
  const password = req.body.password;
  const email = req.body.email;
  // const mobileUserId = '';
  const address = req.body.address;

  const gender = req.body.Gender;
  const tracingKey = req.body.tracingKey;
  const contactTracingStatus = "0";
  const hash = crypto.createHash("md5").update(password).digest("hex");

  db.query(
    "SELECT user_name FROM mobile_user WHERE user_name=?",
    [userName],
    (error, result, feilds) => {
      console.log(result);
      if (result.length > 0) {
        res.send("wrong");
      } else {
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
            hash,
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
            res.send("Success");
            console.log(err);
            // res.send(result);
          }
        );
      }
    }
  );
});

app.put("/api/editprofile", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const nic = req.body.nic;
  const contactNumber = req.body.contactNumber;
  const email = req.body.email;
  const username = req.body.username;
  console.log(firstName);
  // const sqlUpdate = "Update mobile_user SET first_name = '{$fie}', last_name = '{$lastName}', nic='{$nic}', contact_number= '{$contactNumber}', email='{$email}', user_name='{$username}' WHERE mobile_user_id = 1;"
  const sqlUpdate =
    "Update mobile_user SET first_name = ?, last_name = ?, nic= ?, contact_number= ?, email= ?, user_name= ? WHERE mobile_user_id = 1;";
  db.query(
    sqlUpdate,
    [firstName, lastName, nic, contactNumber, email, username],
    (err, result) => {
      // res.send("hello");
      // console.log(result);
      res.send(err);
    }
  );
});

app.put("/api/editprofile", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const nic = req.body.nic;
  const contactNumber = req.body.contactNumber;
  const email = req.body.email;
  const username = req.body.username;
  console.log(firstName);
  // const sqlUpdate = "Update mobile_user SET first_name = '{$fie}', last_name = '{$lastName}', nic='{$nic}', contact_number= '{$contactNumber}', email='{$email}', user_name='{$username}' WHERE mobile_user_id = 1;"
  const sqlUpdate =
    "Update mobile_user SET first_name = ?, last_name = ?, nic= ?, contact_number= ?, email= ? WHERE user_name = ?;";
  db.query(
    sqlUpdate,
    [firstName, lastName, nic, contactNumber, email, username],
    (err, result) => {
      // res.send("hello");
      // console.log(result);
      res.send(err);
    }
  );
});

app.get("/api/users", (req, res) => {
  // console.log(req.get(username));
  console.log(req.query.username);
  const username = req.query.username;
  db.query(
    "SELECT * FROM mobile_user WHERE user_name = ?;",
    [username],
    (error, result, feilds) => {
      if (error) console.log(error);
      else {
        console.log(result);
        res.send(result);
      }
    }
  );
});

app.get("/api/tracingkey", (req, res) => {
  console.log(req.query.username + "ss");
  const username = req.query.username;
  db.query(
    "SELECT tracing_key FROM mobile_user WHERE user_name = ?;",
    [username],
    (error, result, feilds) => {
      if (error) console.log(error);
      else {
        console.log(result);
        res.send(result);
      }
    }
  );
});

app.get("/api/VaccineCenterDistrict", (req, res) => {
  console.log(req.query.username);
  const username = req.query.username;
  db.query(
    "SELECT nic FROM mobile_user WHERE user_name = ?;",
    [username],
    (error, result, feilds) => {
      if (error) console.log(error);
      else {
        console.log(result[0].nic);
        // res.send(result);
        let nic = result[0].nic;
        db.query(
          "SELECT district FROM user_details WHERE nic=?;",
          [nic],
          (errorNic, resultNic, fieldsNic) => {
            if (errorNic) console.log(errorNic);
            else {
              console.log(resultNic[0].district);
              let district = resultNic[0].district;
              db.query(
                "SELECT covidAssist.vaccine_center.name ,covidAssist.vaccine.vaccine_name,covidAssist.vaccine_center.center_id FROM covidAssist.vaccine_center INNER JOIN covidAssist.vaccine_center_vaccine ON covidAssist.vaccine_center.center_id=covidAssist.vaccine_center_vaccine.vaccine_center_id  Inner JOIN covidAssist.vaccine ON covidAssist.vaccine_center_vaccine.vaccine_id=covidAssist.vaccine.vaccine_id WHERE covidAssist.vaccine_center.district=? AND (covidAssist.vaccine_center_vaccine.dose_1_quantity>0 OR covidAssist.vaccine_center_vaccine.dose_2_quantity>0 OR covidAssist.vaccine_center_vaccine.dose_3_quantity>0)",
                [district],
                (errorDistrict, resultDistrict, fieldsDistrict) => {
                  if (errorDistrict) console.log(errorDistrict);
                  else {
                    console.log(resultDistrict);
                    res.send(resultDistrict);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
app.get("api/VaccineSelecteDate", (req, res) => {
  console.log(req.query.dateselect);
  const dateselect = req.query.dateselect;
  // db.query(
  //   "SELECT tracing_key FROM mobile_user WHERE user_name = ?;",
  //   [username],
  //   (error, result, feilds) => {
  //     if (error) console.log(error);
  //     else {
  //       console.log(result);
  //       res.send(result);
  //     }
  //   }
  // );
});


app.post("api/dailytracingkey", (req,res) => {
  const dailyTracingKey = req.body.dailyTracingKey;
  const userName = req.body.userName;
  db.query("SELECT mobile_user_id from mobile_user WHERE username=?",
  [username],
  (error,result,feilds)=>{
    if (error) console.log(error);
    else{
      console.log(result[0].mobile_user_id);
      // res.send(result);
      let id = result[0].mobile_user_id;

      db.query("INSERT INTO mobile_user_daily_tracing_key(mobile_user_id,daily_tracing_key) VALUES(?,?)",
      [id, dailyTracingKey],
      (errorDaily,resultDaily,feildsDaily)=>{
        if (errorDaily) console.log(errorDaily);
        else{
          res.send("Success");
        }
      })
    }
  })

})


app.listen(3000, () => {
  console.log("running on port 3000");
});
