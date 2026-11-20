// Last stop for every error. Sends JSON like { error: "..." }.
// Unexpected errors (status 500) hide their details from the user.
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
  return res.status(status).json({ error: err.message });
}

module.exports = errorHandler;
