//-----------dependencies-----------//
const express = require("express");
const { sessionAuth } = require("../init/authMiddlewares");
const path = require("path");
const staticServe = require("../modules/staticServe");

//-----------protected router-----------//
const protectedRouter = express.Router();
protectedRouter.use(
   sessionAuth,
   staticServe(path.join(__dirname, "../../private"), undefined, "/connected")
);

protectedRouter.get("/home", (req, res) => {
   res.sendFile(path.join(__dirname, "../../private/home/index.html"));
});

//-----------exports-----------//
module.exports = protectedRouter;
