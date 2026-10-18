
import proxy from "express-http-proxy";

export const proxyWithHeaders = (serviceUrl, { limit = "1mb" } = {}) => {
  return proxy(serviceUrl, {
    limit,

    // Preserve the original request path when forwarding.
    proxyReqPathResolver: (req) => {
      return req.originalUrl;
    },

    // Forward the logged-in user's ID.
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user?.userId) {
        proxyReqOpts.headers["x-user-id"] =
          String(srcReq.user.userId);
      }

      return proxyReqOpts;
    },

    // Log upstream errors for debugging.
    proxyErrorHandler: (err, res, next) => {
      console.error("Interview/Resume proxy error:", err.message);

      if (res.headersSent) {
        return next(err);
      }

      res.status(502).json({
        success: false,
        message: "Unable to connect to the downstream service",
      });
    },
  });
};
