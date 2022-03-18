const express = require('express');
var ObjectID = require('mongodb').ObjectID;
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the records.
recordRoutes.route('/listings').get(async function (_req, res) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('users')  
    .find({})
    .toArray(function (err, result) { 
      if (err) { 
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

recordRoutes.route('/listings/search').get(async function (_req, res) {
  const dbConnect = dbo.getDb();
  const query = _req.query.q;
  dbConnect
    .collection('users')  
    .find({
      $or: [
        {'name' :  {'$regex': query}}, 
        {'birthdate' :  {'$regex': query}}, 
        {'email' :  {'$regex': query}} 
      ]
    })
    .toArray(function (err, result) { 
      if (err) { 
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

recordRoutes.route('/listings/getbyid').get(async function (_req, res) {
  const dbConnect = dbo.getDb();
  const query = _req.query.q;
  var o_id = new ObjectID(query);
  dbConnect
    .collection('users')  
    .find({ "_id" : o_id }  )
    .toArray(function (err, result) { 
      console.log(result); 
      if (err) {  
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

// This section will help you create a new record.
recordRoutes.route('/listings/recordSwipe').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    listing_id: req.body.id,
    last_modified: new Date(),
    session_id: req.body.session_id,
    direction: req.body.direction,
  };

  dbConnect
    .collection('matches')
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting matches!');
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
});

// This section will help you update a record by id.
recordRoutes.route('/listings/update').post(function (req, res) {
  const dbConnect = dbo.getDb();

  const listingQuery = { _id: ObjectID(req.body.id) };
  const updates = {
    $set: {
      name: req.body.name,
      email: req.body.email,
      birthdate: req.body.birthdate
    },
  };
  console.log(listingQuery);
  console.log(updates);
  dbConnect
    .collection('users')
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
      }
    });
});

// This section will help you delete a record.
recordRoutes.route('/listings/delete/:id').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { listing_id: req.body.id };

  dbConnect
    .collection('listingsAndReviews')
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});

module.exports = recordRoutes;
