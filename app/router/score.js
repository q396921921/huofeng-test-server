module.exports = app => {
  app.router.post('/api/v1/score/update', app.controller.score.update);
  app.router.get('/api/v1/score/list', app.controller.score.list);
};