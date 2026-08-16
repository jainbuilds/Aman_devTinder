const express = require("express");
const app = express();

app.get("/user", (req, res) => {
 res.send({ firstName: "Aman", lastName: "Jain" });
});

//Basic dynamic route
app.get("/user/:id", (req, res) => {
 const userId = req.params.id;
 const params = req.params;
 console.log("User ID is: ", userId);
 console.log("Query Parameters are: ", params);
 res.send({ firstName: "Aman", lastName: "Jain" });
});

//Multiple params
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.send(`User ${userId}, Post ${postId}`);
});

//Optional params
// app.get('/products/:category/:id?', (req, res) => {
//   if (req.params.id) {
//     res.send(`Product ${req.params.id} in ${req.params.category}`);
//   } else {
//     res.send(`All products in ${req.params.category}`);
//   }
// });

// /Route params vs query params
// Route param: /users/42
app.get('/users/:id', (req, res) => { req.params.id });

// Query param: /users?id=42
app.get('/users', (req, res) => { req.query.id });

// app.get("/user", (req, res) => {
//  console.log("save data to the db");
//  res.send({ firstName: "Aman", lastName: "Jain" });
// });

app.post("/user", (req, res) => {
 console.log("save data to the db");
 res.send("Data successfully saved to the DB!");
});

app.put("/user", (req, res) => {
 console.log("update data in the db");
 res.send("Data successfully updated in the DB!");
});

app.delete("/user", (req, res) => {
 console.log("delete data from the db");
 res.send("Data successfully deleted from the DB!");
});

// Any route that matches / or starts with / will be handled by this route — it acts like a wildcard.

app.use("/user", (req, res) => {
 res.send("Namaste Aman!!");
});


app.listen(7777, () => {
 console.log("Server is successfully listening on port 7777");
});
