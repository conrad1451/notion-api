// Note: because this is a SERVER, after making changes to this file,
//       one must RESTART the task to see the changes

// Optimization opportunity: refactor code base to query the database
// only once and read through the local data each time a new user
// is added
const express = require("express");

// Following line is where NodeJS server is coupled to the HTML
const moduleToFetch = require("./index");
const getDatabase = moduleToFetch.getDatabase;
const newEntryToDatabase = moduleToFetch.newEntryToDatabase;
const port = 8000;

const app = express();

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// CHQ: Reads all data entries from the database (Read)
app.get("/users", async (req, res) => {
  const users = await getDatabase();
  res.json(users);
});
{
  /* <form method="POST" action="/lalala" id="addUserForm"> */
}
// app.post("/lalala", async (req, res) => {

// the two lines above determine the address to which the app
// writes new entries. I changed the app post and tried to post
// the entry but it said "cannot post /lalala" here and
// nothing updated in Notion table
// but what if I swap it with a real but different endpoint?
// CHQ: Posts a new entry to the database (Create)

app.post("/submit-form", async (req, res) => {
  // app.post("/lalala", async (req, res) => {
  const name = req.body.name;
  const role = req.body.role;
  await newEntryToDatabase(name, role);
  // the changes here worked
  // await newEntryToDatabase("ddd", "dsafdsaf");
  res.redirect("/");
  res.end();
});

app.listen(port, console.log(`Server started on ${port}`));
