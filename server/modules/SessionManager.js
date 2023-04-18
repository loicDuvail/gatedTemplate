const { v4 } = require("uuid");

class SessionManager {
   constructor(managerName) {
      this.sessions = [];
      this.managerName = managerName;
      this.timer = null;
   }

   addSession(clientId, maxAge = 7200_000) {
      let newSession = {
         clientId,
         sessionId: v4(),
         lifetime: maxAge,
      };

      this.sessions.push(newSession);
      console.log(
         `
New session for ${this.managerName}:
id: ${newSession.sessionId},
clientId: ${newSession.clientId}
`
      );

      return newSession.sessionId;
   }

   clearSession(sessionId, cause) {
      const session = this.sessions.find(
         (session) => session.sessionId == sessionId
      );
      if (!session) return;

      this.sessions.splice(this.sessions.indexOf(session), 1);

      console.log(`
    ---Session terminated---

sessionManager: ${this.managerName}
id: ${sessionId}
cause: ${cause}
    `);
   }

   sessionExists(sessionId) {
      return this.sessions.some((session) => session.sessionId == sessionId);
   }

   startAging(interval) {
      this.timer = setInterval(() => {
         this.sessions.forEach((session) => {
            session.lifetime -= interval;
            if (session.lifetime <= 0)
               this.clearSession(session.sessionId, "session expired");
         });
      }, interval);
   }

   stopAging() {
      clearInterval(this.timer);
   }
}

module.exports = SessionManager;
