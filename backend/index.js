const bcrypt = require("bcrypt")
const express = require("express")
const cors = require("cors")
const PORT = 3000;
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json());
app.use(cors({origin: "*"}));

app.post("/hello", async(req, res) => {
  return res.status(200).json({ message: "Hello World" })
})

app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))
module.exports = app;

