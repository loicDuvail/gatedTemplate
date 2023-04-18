class RejectionHandler {
   constructor(req, res, next, fallbackUrl) {
      this.req = req;
      this.res = res;
      this.next = next;
      this.fallbackUrl = fallbackUrl;
   }
   handleReject() {
      if (!this.fallbackUrl) return this.res.status(403).end();
      this.res.redirect(this.fallbackUrl);
   }
}

function authMiddlewareGenerator(sessionManager, fallbackRoute) {
   return function authMiddleware(req, res, next) {
      const rejectionHandler = new RejectionHandler(
         req,
         res,
         next,
         fallbackRoute
      );
      const { sessionId } = req.cookies;
      if (!sessionId) return rejectionHandler.handleReject();
      if (sessionManager.sessionExists(sessionId)) return next();
      return rejectionHandler.handleReject();
   };
}

module.exports = authMiddlewareGenerator;
