const express = require("express");
const app = express();
app.use(express.json());


const {adminAuth} = require("./middlewares/adminAuth");
const {userAuth} = require("./middlewares/userAuth");

app.use('/admin', adminAuth, (req, res, next) => {
  res.send("Admin auth route");
});

app.get('/admin/getAllData', adminAuth, (req, res) => {
  res.send("Admin route authenticated all data");
} );

app.use('/user', userAuth,  (req, res, next) => {
  // res.send("User routes");
  next();
},
(req, res) => {
  res.send("User routes 2");
} );

app.listen(7777, () => {
 console.log("Server is successfully listening on port 7777");
});
