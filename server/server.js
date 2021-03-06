const express = require('express');
const db = require('../db/index');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient(6379, 'localhost');
const app = express();

// logs requests to the console
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/listings/:tagId', (req, res) => {
  redisClient.getAsync(req.params.tagId)
    .then((cachedListing) => {
      if (cachedListing !== null) {
        console.log('found a cached listing', cachedListing)
        res.status(200).send(cachedListing);
      } else {
        const listingData = {};
        db.any('SELECT DISTINCT reviews.body, reviews.overall, users.firstname, users.imageurl FROM reviews JOIN users ON reviews.user_id = users.id WHERE reviews.listing_id = $1', [req.params.tagId])
          .then((data) => {
            listingData.reviews = data;
            return db.any('SELECT * from listings where id = $1', [req.params.tagId]);
          })
          .then((data) => {
            listingData.overview = data;
          })
          .then(() => {
            res.status(200).send(listingData);
            const listingString = JSON.stringify(listingData);
            redisClient.set(req.params.tagId, listingString)
          })
          .catch((error) => {
            res.status(200).send({
              message: error,
            });
          });
      }
    })
    .catch((error) => {
      res.status(200).send({
        message: error,
      });
    });
});

app.listen(3000, () => {
  console.log('server running at: http://localhost:3000');
});

module.exports.app = app;
