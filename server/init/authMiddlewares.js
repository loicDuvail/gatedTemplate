const auth = require("../modules/authMiddleware");
const sessionManagers = require("./sessionManagers");

const authMiddlewares = {
   sessionAuth: auth(sessionManagers.sessionManager, "/login"),
   adminSessionAuth: auth(sessionManagers.adminSessionManager, "/login"),
};

module.exports = authMiddlewares;
