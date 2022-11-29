const picRoutes = require('./pics');

const constructorMethod = (app) => {
  app.use('/pics', picRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
