const express = require("express");

const app = express();
const port = 8000;

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use("/", require("./routers/general.router"));
app.use("/admin", require("./routers/admin.router"));
app.use("/customer", require("./routers/customer.router"));

app.listen(port, function () {
  console.log(`Server listening on port http://127.0.0.1:${port} !`);
});
