//-----------dependencies-----------//
const express = require("express");
const { adminSessionAuth } = require("../init/authMiddlewares");
const path = require("path");
const staticServe = require("../modules/staticServe");

//-----------protected router-----------//
const adminRouter = express.Router();
adminRouter.use(
   adminSessionAuth,
   staticServe(path.join(__dirname, "../../admin"), undefined, "/admin")
);

adminRouter.get("/adminPage", (req, res) => {
   res.sendFile(path.join(__dirname, "../../admin/adminPage/index.html"));
});

//-----------exports-----------//
module.exports = adminRouter;
