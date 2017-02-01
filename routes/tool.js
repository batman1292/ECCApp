var express = require('express');
var router = express.Router();

router.get('/RESTtool', function(req, res, next) {
  res.render('tool/testREST');
});

module.exports = router;
