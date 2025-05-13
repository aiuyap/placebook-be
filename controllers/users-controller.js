const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/users-schema');

const getUsers = async (req, res, next) => {
  const users = await User.find({}, '-password').catch((err) =>
    next(new HttpError('Fetching users failed, please try again later', 500))
  );

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    next(new HttpError('Invalid inputs, please check your data', 422));
  }

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email }).catch((err) =>
    next(new HttpError('Sign up failed, please try again', 500))
  );

  if (existingUser) {
    return next(new HttpError('Email already exists', 422));
  }

  const createdUser = new User({
    name,
    email,
    image:
      'https://images.pexels.com/photos/7046685/pexels-photo-7046685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    password,
    places: [],
  });

  await createdUser
    .save()
    .catch((err) =>
      next(new HttpError('Sign up failed, please try again', 500))
    );

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email }).catch((err) =>
    next(new HttpError('Login failed, please try again later', 500))
  );

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError('Invalid credentials', 401));
  }

  res.json({ message: 'Successfully logged in' });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
