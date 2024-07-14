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

// CHQ: already declared earlier
// const express = require("express");
// const app = express();
// Set middleware of CORS
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://react-api-use-test-2.vercel.app"
  );
  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  // );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

// CHQ: Reads all data entries from the database (Read)
app.get("/users", async (req, res) => {
  const users = await getDatabase();
  res.json(users);
});

// CHQ: Posts a new entry to the database (Create)

// CHQ: Here is the structure of the app.post
// app.post(serverAddress, async function)

// This seems like a slight of hand almost. the form submitted the 
// data to the serverAddress. It was as if the form were communicating 
// with a server located at serverAddress, SENDING a POST request
// to a server, which happens to be the server that this code in
// server.js is running on. 

// I tried to run this code on a PaaS but it didn't work because
// that particular PaaS did not ALLOW ingress (data inflow) via
// post requests in the way that I had attempted.

// Notably, the original example code has the front end and backend
// coupled together and so could skip having to set up a backend
// that would receive post requests entirely.

app.post("/submit-form", async (req, res) => {
  // app.post("/lalala", async (req, res) => {
  const name = req.body.name;
  const role = req.body.role;
  await newEntryToDatabase(name, role);
  // the changes here worked
  // await newEntryToDatabase("testName", "testRole");
  res.redirect("/");
  res.end();
});

app.listen(port, console.log(`Server started on ${port}`));
