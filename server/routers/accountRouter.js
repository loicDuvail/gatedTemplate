const pool = require("../modules/DBConnection");
const {
   sessionManager,
   adminSessionManager,
} = require("../init/sessionManagers");
const express = require("express");
const SHA256 = require("../modules/SHA256");
const saltGen = require("../modules/saltGen");

const accountRouter = express.Router();

accountRouter.post("/login", async (req, res) => {
   const { emailOrUsername, password } = req.body;

   // avoid simultaneous connection to same account
   const sessId = req.cookies;
   if (sessId && sessionManager.sessionExists(sessId))
      sessionManager.clearSession(sessId);
   if (sessId && adminSessionManager.sessionExists(sessId))
      adminSessionManager.clearSession(sessId);

   //try to log as admin
   const adminResponse = await pool.query(
      `SELECT salt, hash, id FROM Admins WHERE email='${emailOrUsername}' OR username='${emailOrUsername}';`
   );
   if (adminResponse.recordset[0]) {
      const { salt, hash, id } = adminResponse.recordset[0];

      if (SHA256(password + salt) != hash)
         return res
            .status(401)
            .send({ error: "Invalid email/username -password combination" });

      const sessionId = adminSessionManager.addSession(id);
      res.clearCookie("sessionId");
      res.cookie("sessionId", sessionId);
      return res.send({ ok: "Valid credentials", admin: true });
   }

   //if user not admin,try logging as regular users
   const userResponse = await pool.query(
      `SELECT salt, hash, id FROM Users WHERE email='${emailOrUsername}' OR username='${emailOrUsername}';`
   );

   if (!userResponse.recordset[0])
      return res
         .status(404)
         .send({ error: "Email not currently linked to any account" });

   const { salt, hash, id } = userResponse.recordset[0];

   if (SHA256(password + salt) != hash)
      return res
         .status(401)
         .send({ error: "Invalid email/username -password combination" });

   const sessionId = sessionManager.addSession(id);
   res.clearCookie("sessionId");
   res.cookie("sessionId", sessionId);
   return res.send({ ok: "Valid credentials" });
});

accountRouter.post("/signup", async (req, res) => {
   const { email, username, password } = req.body;
   let emailDouble = await pool.query(
      `SELECT id FROM Users WHERE email = '${email}'`
   );
   let usernameDouble = await pool.query(
      `SELECT id FROM Users WHERE username = '${username}'`
   );
   if (emailDouble.recordset[0] || usernameDouble.recordset[0])
      return res.status(409).send({ error: "Username already in use" });

   const salt = saltGen(20);
   const hash = SHA256(password + salt);

   const id = await pool.query(
      `INSERT INTO Users (email, username, hash, salt) VALUES ('${email}', '${username}','${hash}', '${salt}');
        SELECT SCOPE_IDENTITY() AS id`
   );

   if (!id) return res.status(500).send("Failed to create new account");

   const sessionId = sessionManager.addSession(id);
   res.cookie("sessionId", sessionId);

   res.send({ ok: "account created" });
});

accountRouter.post("/logout", (req, res) => {
   const { sessionId } = req.cookies;
   if (!sessionId) return res.send({ error: "User are not logged in" });
   sessionManager.clearSession(sessionId, "manual termination");
   res.clearCookie("sessionId");
   res.send({ ok: "Successfuly logged out" });
});

module.exports = accountRouter;
