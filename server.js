const express = require("express");
const app = express();
const morgan = require("morgan");
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);

const port = process.env.MYSQL_PORT || 3030;

require("dotenv").config();
app.use(cors());
//middleWare
app.use(morgan("dev"));
//middleware untuk akses get asset folder public di server
app.use(express.static("public"));

app.use(express.json()); //terima dataa json
app.use(express.urlencoded({ extended: true }));

server.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

//impor router dari routes
const Routes = require("./server/routes/routes");
app.use(Routes);
