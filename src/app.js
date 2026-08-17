const express = require("express");
const app = express();
app.use(express.json());

app.use('/user',  (req, res, next) => {
  // res.send("User routes");
  throw new Error("User route error");
});

app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(7777, () => {
 console.log("Server is successfully listening on port 7777");
});
