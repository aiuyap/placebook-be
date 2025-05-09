const { Router } = require('express');
const { check } = require('express-validator');

const placesController = require('../controllers/places-controller');

const router = Router();

const placeValidation = [
  check('title').not().isEmpty(),
  check('description').isLength({ min: 5 }),
  check('address').not().isEmpty(),
];

router.get('/:pid', placesController.getPlaceById);
router.get('/user/:uid', placesController.getPlacesByUserId);

router.post('/', placeValidation, placesController.createPlace);

router.patch('/:pid', placeValidation, placesController.updatePlace);

router.delete('/:pid', placesController.deletePlace);

module.exports = router;
