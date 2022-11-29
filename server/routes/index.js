const sweetRoutes = require('./sweet');

const constructorMethod = (app) => {
  app.use('/sweets', sweetRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
