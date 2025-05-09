const HttpError = require('../models/http-error');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Aiu',
    image:
      'https://images.pexels.com/photos/7046685/pexels-photo-7046685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    places: 3,
  },
];

const getUsers = (req, res, next) => {
  if (!DUMMY_USERS) {
    return next(new HttpError('No users found', 404));
  }

  res.status(200).json({ users: DUMMY_USERS });
};

exports.getUsers = getUsers;
