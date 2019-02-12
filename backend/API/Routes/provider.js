const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Provider = require('../Models/deliveryProvider');


//get all delivery providers
router.get('/', (req, res, next) => {
  Provider
    .aggregate([
        {
            $geoNear: {
              near: { type: "Point", coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)] },
              distanceField: "dist.calculated",
              query: { specialty: req.query.foodType },
              maxDistance: 1609.34 * 100,   //convert to meters
              spherical: false
            }
        }
    ])
    .then(docs => {
      //craft the response
      const response = {
        count: docs.length,
        providers: docs.map(doc => {
          return {
            name: doc.name,
            specialty: doc.specialty,
            orders: doc.orders,
            distance: doc.dist.calculated/1609.34,  //convert to miles
            request: {
              type: 'GET',
              description: 'Get delivery provider details',
              url: "http://localhost:4000/providers/" + doc._id
              }
            }
          })
        };

        //check if there are any providers
        if (docs.length >= 0) {
          res.status(200).json(response);
        } else {
          res.status(404).json({
            message: 'No delivery provider entries found'
          });
        }

      })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});



//creating new delivery provider
router.post('/', (req, res, next) => {
  const provider = new Provider({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    specialty: req.body.specialty,
    location: {
      type: req.body.location.type,
      coordinates: req.body.location.coordinates
    }
  });

  //save the entry in the database
  provider
    .save()
    .then(result => {
      res.status(201).json({
        message: 'New provider was created',
        provider: {
          _id: result._id,
          name: result.name,
          specialty: result.specialty
        },
        request: {
          type: 'GET',
          desciption: 'get delivery provider details',
          url: "http://localhost:4000/providers/" + result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});



//get details of a delivery provider
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Provider
    .findById(id)
    .exec()
    .then(result => {
      result ? res.status(200).json(result) :
        res.status(404).json({ message: 'No valid entry found for the provided ID'});
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
});



//update the delivery provider specified
//Three ways:
//   - update # of orders completed
//   - update name of provider
//   - update specialty of provider
router.patch('/:id', (req, res, next) => {
  const id = req.params.id;

  //get the parameters that were provided for update
  const allUpdates = {};
  const updateParams = {};
  const incrementParams = {};
  for (const param of req.body) {
    if (param.propName === 'orders') {
      incrementParams[param.propName] = param.value;
      allUpdates['$inc'] = incrementParams;
    } else {
      updateParams[param.propName] = param.value;
      allUpdates['$set'] = updateParams;
    }
  }

  //update the params that were provided
  Provider
    .updateMany({ _id: id }, allUpdates)
    .then(result => {
      res.status(200).json({
        message: 'Provider details were updated!',
        request: {
          type: 'GET',
          description: 'Get delivery provider details',
          url: "http://localhost:4000/providers/" + id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
});



//delete a delivery provider
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Provider
    .deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Delivery provider was deleted!',
        request: {
          type: 'POST',
          description: 'Create a new delivery provider',
          url: "http://localhost:4000/providers/",
          body: '{ name: \'String\', specialty: \'String\', location: { type: \"Point\", coordinates: [\'Float\', \'Float\']} }'
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
});

module.exports = router;
