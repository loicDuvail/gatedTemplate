//-----------dependencies-----------//

require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const staticServe = require("./modules/staticServe");

//-----------server creation-----------//

const app = express();
app.use(
   bodyParser.json(),
   cookieParser(),
   staticServe(path.join(__dirname, "../public"), "/public")
);

//----------server routing------------//

app.get("/", (req, res) => {
   res.redirect("/connected/home");
});

app.get("/login", (req, res) => {
   res.sendFile(path.join(__dirname, "../public/login/login.html"));
});

app.get("/signup", (req, res) => {
   res.sendFile(path.join(__dirname, "../public/signUp/signUp.html"));
});

//---------account routes----------//

const accountRouter = require("./routers/accountRouter");
app.use(accountRouter);

//---------protected routes----------//

const protectedRouter = require("./routers/protectedRouter");
app.use("/connected", protectedRouter);

//---------admin routes------------//

const adminRouter = require("./routers/adminRouter");
app.use("/admin", adminRouter);

//-----------server init-----------//

process.on("uncaughtException", (error, origin) => {
   console.log(error);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
