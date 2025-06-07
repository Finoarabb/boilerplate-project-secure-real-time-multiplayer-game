require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai");
const socket = require("socket.io");
const cors = require("cors");
const http = require("http"); // <-- added
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");
const helmet = require("helmet");

const app = express();
const server = http.createServer(app); // <-- replaced app.listen
const io = socket(server); // <-- initialized socket.io
const gameServer =require("./gameServer.js");
gameServer(io);


app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security middleware (unchanged)
app.use(helmet({ xContentTypeOptions: true, xXssProtection: true }));
app.use((req, res, next) => {
  app.disable("x-powered-by");
  res.setHeader("X-Powered-By", "PHP 7.4.3");
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
  next(); // <-- Don't forget this
});

app.use(cors({ origin: "*" }));

// Index page
app.route("/").get((req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// FCC testing routes
fccTestingRoutes(app);

// 404 handler
app.use((req, res, next) => {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env.PORT || 3000;

server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(() => {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = {server, io };
