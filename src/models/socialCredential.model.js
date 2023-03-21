const weaviate = require('weaviate-client');

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

// User schema
const schemaObj = {
  class: 'SocialCredential',
  description: 'authentication credential for social medias for user',
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
      name: 'socialId',
      dataType: ['string'],
      description: 'The userId of the user provided by the social media',
    },
    {
      name: 'userId',
      dataType: ['string'],
      description: 'The userId of the user',
    },
    {
      name: 'provider',
      dataType: ['string'],
      description: 'The name of the social media',
    },
    {
      name: 'email',
      dataType: ['string'],
      description: 'The unique email and provider',
    },
  ]
};


/**
 * Check if social id is taken
 * @param {string} socialId - The user's social ID
 * @param {ObjectId} [provider] - The social providers name
 * @returns {Promise<boolean>}
 */
 const isSocialIdTaken = async function (socialId, provider) {
  let socialCredential;
  try {
    let operandList = [];
    if (socialId) {
      operandList.push({
        path: ['socialId'],
        operator: 'Equal',
        valueString: socialId,
      });
    }

    if (provider) {
      operandList.push({
        operator: 'Equal',
        path: ['provider'],
        valueString: provider,
      });
    }

    socialCredential = await client.graphql
    .get()
    .withClassName('SocialCredential')
    .withFields('socialId', 'userId', 'provider', 'email')
    .withWhere({
      operator: 'And',
      operands: operandList
    }).do();
    return socialCredential.data.Get.SocialCredential.length > 0;
  } catch (error) {
    console.error(error);
  }
};


/**
 * Create user
 * @param {data} [data] - The data of the user to be created
 * @returns {Promise<object>}
 */
 const createUserViaSocial = async function (data) {
  let res;
  try {
    // data.password = await bcrypt.hash(data.password, 8);
    res = await client.data
     .creator()
     .withClassName('SocialCredential')
     .withProperties(data)
     .do();
     return res;
  } catch(e) { console.log(e) }
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
    .withClassName('SocialCredential')
    .withFields([ '_additional { id }', 'socialId', 'userId', 'provider', 'email'])
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
 const findOne = async function (userId) {
  let user;
  try {
    user = await client.graphql
    .get()
    .withClassName('SocialCredential') 
    .withFields([ '_additional { id }', 'socialId', 'userId', 'provider', 'email'])
    .withWhere({
      operator: 'Equal',
      path: ['userId'],
      valueString: userId,
    })
    .do();
    return user.data.Get.User[0];
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  schemaObj,
  isSocialIdTaken,
  findOne,
  findById,
};
