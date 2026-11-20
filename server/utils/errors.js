// An error that carries an HTTP status code, e.g. new AppError(404, 'Game not found').
class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = { AppError };
