
module.exports = (req, res, next) => {
  req.headersForBackend = {
    Authorization: req.headers.authorization
  };
  next();
};
