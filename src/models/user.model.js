const bcrypt = require('bcryptjs');
// const { roles } = require('../config/roles');
const weaviate = require('weaviate-client');

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

// User schema
const schemaObj = {
  class: 'User',
  description: 'Various Info about user',
  properties: [
    {
      name: 'uuid',
      dataType: ['string'],
      description: 'The UUID of the object',
      indexInverted: true,
      indexVector: false,
      isPrimaryKey: true
    },
    {
      name: 'username',
      dataType: ['string'],
      description: 'The username of the user',
    },
    {
      name: 'email',
      dataType: ['string'],
      description: 'The email of the user',
    },
    {
      name: 'firstname',
      dataType: ['string'],
      description: 'The firstname of the user',
    },
    {
      name: 'lastname',
      dataType: ['string'],
      description: 'The lastname of the user',
    },
    {
      name: 'password',
      dataType: ['string'],
      description: 'The password of the user',
    },
    {
      name: 'rememberToken',
      dataType: ['string'],
      description: 'The password of the user',
    }
  ]
};

/**
 * Create user
 * @param {data} [data] - The data of the user to be created
 * @returns {Promise<object>}
 */
 const create = async function (data) {
  let res;
  try {
    data.password = await bcrypt.hash(data.password, 8);
    res = await client.data
     .creator()
     .withClassName('User')
     .withProperties(data)
     .do();
     return res;
  } catch(e) { console.log(e) }
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async function (email) {
  let user;
  try {
    user = await client.graphql
    .get()
    .withClassName('User')
    .withFields('email')
    .withWhere({
      operator: 'Equal',
      path: ['email'],
      valueString: email,
    })
    .do();
    return user.data.Get.User.length > 0;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Check if username is taken
 * @param {string} username - The user's username
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
const isUsernameTaken = async function (username) {
  let user;
  try {
    user = await client.graphql
    .get()
    .withClassName('User')
    .withFields('username')
    .withWhere({
      operator: 'Equal',
      path: ['username'],
      valueString: username,
    })
    .do();
    return user.data.Get.User.length > 0;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Find user by ID
 * @param {string} userId - The user's ID
 * @returns {Promise<User>}
 */
 const findById = async function (userId) {
  let user;
  try {
    user = await client.graphql
    .get()
    .withClassName('User')
    .withFields([ '_additional { id }', 'email'])
    .withWhere({
      operator: 'Equal',
      path: ['id'],
      valueString: userId,
    })
    .do();
    return user.data.Get.User[0];
  } catch (error) {
    console.error(error);
  }
};

/**
 * Find one user that matches the email
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
 const findOne = async function (email) {
  let user;
  try {
    user = await client.graphql
    .get()
    .withClassName('User') 
    .withFields([ '_additional { id }', 'email', 'password'])
    .withWhere({
      operator: 'Equal',
      path: ['email'],
      valueString: email,
    })
    .do();
    return user.data.Get.User[0];
  } catch (error) {
    console.error(error);
  }
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
const isPasswordMatch = async function (password, user) {
  return bcrypt.compare(password, user.password);
};

// const preSave = async function ('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

module.exports = {
  schemaObj,
  create,
  findOne,
  findById,
  isPasswordMatch,
  isEmailTaken,
  isUsernameTaken,
};
