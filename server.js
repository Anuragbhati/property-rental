const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const corsOptions = {
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// import the index.js file
const { main } = require("./call");
const { rentProperty } = require("./rentProperty");
// define an API endpoint that calls the function
app.get("/api/main", async (req, res) => {
  const name = req.query;
  console.log(name);
  const result = await main(name);
  //   console.log("result from api", result);
  res.send(result);
});
app.get("/api/rent", async (req, res) => {
  const name = req.query;
  console.log(name);
  const result = await rentProperty(name);
  //   console.log("result from api", result);
  res.send(result);
});

// start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
