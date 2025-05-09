const { Router } = require('express');
const { check } = require('express-validator');

const userControllers = require('../controllers/users-controller');

const router = Router();

const userSignupValidation = [
  check('name').not().isEmpty(),
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 5 }),
];

router.get('/', userControllers.getUsers);

router.post('/signup', userSignupValidation, userControllers.signUp);
router.post('/login', userControllers.login);

module.exports = router;
