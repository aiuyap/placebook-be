const { Router } = require('express');

const userControllers = require('../controllers/users-controller');

const router = Router();

router.get('/', userControllers.getUsers);

router.post('/signup', userControllers.signUp);
router.post('/login', userControllers.login);

module.exports = router;
