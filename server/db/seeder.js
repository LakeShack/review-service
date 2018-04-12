const faker = require('faker');
const db = require('./index');

const insertUser = (inputArr) => {
  db.none('INSERT INTO users(firstname, lastname, imageurl) VALUES($1, $2, $3)', inputArr)
    .then(() => {
      console.log('inserted user');
    })
    .catch((error) => {
      console.log(error);
    });
};

const getNum = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;

const insertListing = (inputArr) => {
  db.none('INSERT INTO listings(overall, accuracy, communication, cleanliness, location, value) VALUES($1, $2, $3, $4, $5, $6)', inputArr)
    .then(() => {
      console.log('inserted listing');
    })
    .catch((error) => {
      console.log(error);
    });
};

const insertReview = (inputArr) => {
  db.none('INSERT INTO reviews(user_id, listing_id, body, accuracy, communication, cleanliness, location, value) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', inputArr)
    .then(() => {
      console.log('inserted review');
    })
    .catch((error) => {
      console.log(error);
    });
};

for (let l = 0; l < 100; l += 1) {
  const listing = [getNum(3, 5), getNum(3, 5), getNum(3, 5), getNum(3, 5), getNum(3, 5)];
  listing.unshift((listing[0] + listing[1] + listing[2] + listing[3] + listing[4]) / 5);
  insertListing(listing);
}

for (let r = 0; r < 10000; r += 1) {
  const review = [
    getNum(1, 100),
    getNum(1, 100),
    faker.lorem.paragraph(10),
    getNum(3, 5),
    getNum(3, 5),
    getNum(3, 5),
    getNum(3, 5),
    getNum(3, 5),
  ];
  insertReview(review);
}

for (let u = 0; u < 100; u += 1) {
  const user = [
    faker.name.firstName,
    faker.name.lastName,
    faker.image.avatar,
  ];
  insertUser(user);
}
