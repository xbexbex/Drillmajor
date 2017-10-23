const user = require('./database/user');

module.exports = (app) => {
  app.use('/api/user', user);
}