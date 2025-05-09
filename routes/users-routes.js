const { Router } = require('express');

const userControllers = require('../controllers/users-controller');

const router = Router();

router.get('/', userControllers.getUsers);

module.exports = router;
