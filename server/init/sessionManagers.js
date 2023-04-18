const SessionManager = require("../modules/SessionManager");

//-----------sessions manager Init-----------//

const sessionManager = new SessionManager("client sessions");
sessionManager.startAging(10_000);

const adminSessionManager = new SessionManager("admin sessions");
adminSessionManager.startAging(10_000);

module.exports = { sessionManager, adminSessionManager };
