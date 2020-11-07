var express = require('express');
var router = express.Router();
const imagesController = require('../controllers/images');

router.get('/', imagesController.getImage);

module.exports = router;