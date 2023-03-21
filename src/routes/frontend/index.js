const express = require('express');
const socialMediaAuthRoute = require('./socialMediaAuth.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: socialMediaAuthRoute,
  }
];
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
