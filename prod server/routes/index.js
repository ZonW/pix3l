const picRoutes = require('./api');

const constructorMethod = (app) => {
  app.use('/api', picRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
