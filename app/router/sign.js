module.exports = app => {
  app.router.post('/api/v1/sign/createUser', app.controller.sign.createUser);
  app.router.get('/api/v1/sign/sign', app.jwt, app.controller.sign.sign);
  app.router.get('/api/v1/sign/getUserSign', app.jwt, app.controller.sign.getUserSign);
  app.router.get('/api/v1/sign/getUserInfo', app.jwt, app.controller.sign.getUserInfo);
  app.router.post('/api/v1/sign/login', app.controller.sign.login);
  app.router.get('/api/v1/sign/logout', app.jwt, app.controller.sign.logout);
  app.router.post('/api/v1/sign/setGlobalDate', app.jwt, app.controller.sign.setGlobalDate);
  app.router.get('/api/v1/sign/getGlobalDate', app.jwt, app.controller.sign.getGlobalDate);
};