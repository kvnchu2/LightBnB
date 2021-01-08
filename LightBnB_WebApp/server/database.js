const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1;
  `, [email])
  .then(res => {
    return res.rows[0];
  })
  .catch(err => {
    console.log('insidecatch')
  });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE users.id = $1;
  `, [id])
  .then(res => {
    return res.rows[0];
  })
  .catch(err => {
    console.log('insidecatch')
  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3) returning *;
  `, [user.name, user.email, user.password])
  .then(res => {
    return res.rows[0]; 
  })
  .catch(err => {
    console.log('insidecatch')
  });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
    SELECT properties.*, reservations.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id 
    WHERE reservations.guest_id = $1
    AND reservations.end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
    `, [Number(guest_id), limit])
    .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3

  //get objKeys of options
  let optionsKeys = Object.keys(options).filter(x => options[x] !== '');

  if (optionsKeys.length > 0) {
    queryString += 'WHERE' 
    for(let x = 0; x < optionsKeys.length; x++) {
      //city is first
      if (optionsKeys[x] === 'city' && x === 0) {
        queryParams.push(`%${options[optionsKeys[x]]}%`);
        queryString += ` ${optionsKeys[x]} LIKE $${queryParams.indexOf(`%${options[optionsKeys[x]]}%`) + 1} `;
      //city is not first
      } else if (optionsKeys[x] === 'city' && x > 0) {
        queryParams.push(`%${options[optionsKeys[x]]}%`);
        queryString += ` AND ${optionsKeys[x]} LIKE $${queryParams.indexOf(`%${options[optionsKeys[x]]}%`) + 1} `;
      //owner_id is first
      } else if(optionsKeys[x] === 'owner_id' && x === 0) {
        queryParams.push(Number(`${options[optionsKeys[x]]}`));
        queryString += ` ${optionsKeys[x]} = $${queryParams.indexOf(Number(`${options[optionsKeys[x]]}`)) + 1}`;
      //owner_id is not first
      } else if (optionsKeys[x] === 'owner_id' && x > 0){
        queryParams.push(Number(`${options[optionsKeys[x]]}`));
        queryString += ` AND ${optionsKeys[x]} = $${queryParams.indexOf(Number(`${options[optionsKeys[x]]}`)) + 1}`;
      //minimum price per night is first
      } else if(optionsKeys[x] === 'minimum_price_per_night' && x === 0) {
        queryParams.push(Number(`${options[optionsKeys[x]]}`) * 100.0);
        queryString += ` cost_per_night > $${queryParams.indexOf(Number(`${options[optionsKeys[x]]}`) * 100.0) + 1}`;
      //minimum price per night is not first
      } else if (optionsKeys[x] === 'minimum_price_per_night' && x > 0){
        queryParams.push(Number(`${options[optionsKeys[x]]}`) * 100.0);
        queryString += ` AND cost_per_night > $${queryParams.indexOf(Number(`${options[optionsKeys[x]]}`) * 100.0) + 1}`;
      //maximum price per night is first
      } else if(optionsKeys[x] === 'maximum_price_per_night' && x === 0) {
        queryParams.push(Number(`${options[optionsKeys[x]]}`) * 100.0);
        queryString += ` cost_per_night < $${queryParams.indexOf(Number(`${options[optionsKeys[x]]}`) * 100.0) + 1}`;
      //maximum price per night is not first
      } else if (optionsKeys[x] === 'maximum_price_per_night' && x > 0){
        queryParams.push(Number(`${options[optionsKeys[x]]}`) * 100.0);
        queryString += ` AND cost_per_night < $${queryParams.indexOf(Number(`${options[optionsKeys[x]]}`) * 100.0) + 1}`;
        //minimum rating is first
      } else if(optionsKeys[x] === 'minimum_rating' && x === 0) {
        queryParams.push((`${options[optionsKeys[x]]}`));
        queryString += ` rating >= $${queryParams.indexOf((`${options[optionsKeys[x]]}`)) + 1}`;
      //minimum rating is not first
      } else if (optionsKeys[x] === 'minimum_rating' && x > 0){
        queryParams.push((`${options[optionsKeys[x]]}`));
        queryString += ` AND rating >= $${queryParams.indexOf((`${options[optionsKeys[x]]}`)) + 1}`;
      } 
    }
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
