const { v4: uuid } = require('uuid');
const HttpError = require('../models/http-error');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Aiu',
    email: 'test@test.com',
    password: 'testsss',
  },
];

const getUsers = (req, res, next) => {
  if (!DUMMY_USERS) {
    return next(new HttpError('No users found', 404));
  }

  res.status(200).json({ users: DUMMY_USERS });
};

const signUp = (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = DUMMY_USERS.find((user) => user.email === email);

  if (existingUser) {
    return next(new HttpError('Email already exists', 422));
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const loggedInUser = DUMMY_USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!loggedInUser) {
    return next(new HttpError('Invalid Username / Password', 404));
  }

  res.status.json({ message: 'Successfully logged in' });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
