const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place-schema');

// let DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'Empire State Building',
//     description: 'One of the most famous sky scrapers in the world!',
//     location: {
//       lat: 40.7484474,
//       lng: -73.9871516,
//     },
//     address: '20 W 34th St, New York, NY 10001',
//     creator: 'u1',
//   },
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  const place = await Place.findById(placeId).catch((err) =>
    next(new HttpError('Place ID not found', 404))
  );

  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided place id.', 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  const places = await Place.find({ creator: userId }).catch((err) =>
    next(new HttpError('No Places found with this user ID', 404))
  );

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    throw new HttpError('Invalid inputs, please check your data', 422);
  }

  const { title, description, address, creator } = req.body;

  const coordinates = getCoordsForAddress(address);

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://assets.simpleviewinc.com/simpleview/image/upload/crm/newyorkstate/GettyImages-486334510_CC36FC20-0DCE-7408-77C72CD93ED4A476-cc36f9e70fc9b45_cc36fc73-07dd-b6b3-09b619cd4694393e.jpg',
    creator,
  });

  await createdPlace
    .save()
    .catch((err) =>
      next(new HttpError('Creating place failed, please try again', 500))
    );

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    throw new HttpError('Invalid inputs, please check your data', 422);
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;
  const updatedPlace = await Place.findById(placeId).catch((err) =>
    next(new HttpError('Something went wrong, could not update place', 500))
  );

  if (!updatedPlace) {
    return next(new HttpError('Unable to updated, Place ID not found', 404));
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  await updatedPlace
    .save()
    .catch((err) =>
      next(new HttpError('Creating place failed, please try again', 500))
    );

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  const deletePlace = await Place.findByIdAndDelete(placeId).catch((err) =>
    next(new HttpError('Something went wrong. Deletion unsuccessful', 500))
  );

  if (!deletePlace) {
    return next(new HttpError('Place does not exist', 404));
  }

  res.json({ message: `Successfully deleted place id: ${placeId}` });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
