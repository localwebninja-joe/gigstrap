const weaviate = require('weaviate-client');

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

// User schema
const schemaObj = {
  class: 'Token',
  description: 'Various Info about token',
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
      name: 'token',
      dataType: ['string'],
      description: 'The token',
    },
    {
      name: 'user',
      dataType: ['string'],
      description: 'The Object reference to User',
    },
    {
      name: 'type',
      dataType: ['string'],
      description: 'The type of token [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL]',
    },
    {
      name: 'expires',
      dataType: ['string'],
      description: 'The expiration of the token',
    },
    {
      name: 'blacklisted',
      dataType: ['boolean'],
      description: 'The blacklisted token',
    },
    {
      name: 'timestamps',
      dataType: ['string'],
      description: 'The timestamp',
    }
  ]
};

/**
 * Save a token
 * @param {Object} data
 *           {string} token
 *           {ObjectId} user
 *           {Moment} expires
 *           {string} type
 *           {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
 const create = async function (data) {
  let res;
  try {
    res = await client.data
     .creator()
     .withClassName('Token')
     .withProperties(data)
     .do();
     return res;
  } catch(e) { console.log(e) }
};

/**
 * Find one token that matches the refresh token type
 * @param {string} token - The token string
 * @param {string} type - The token type
 * @param {string} user - The user id that owns the token
 * @param {boolean} blacklisted - The boolean object if needs to mark as blacklisted the token
 * @returns {Promise<boolean>}
 */
 const findOne = async function ({token, type, user, blacklisted}) {
  try {

    let operandList = [];
    if (token) {
      operandList.push({
        path: ['token'],
        operator: 'Equal',
        valueString: token,
      });
    }

    if (type) {
      operandList.push({
        operator: 'Equal',
        path: ['type'],
        valueString: type,
      });
    }

    if (blacklisted) {
      operandList.push({
        operator: 'Equal',
        path: ['blacklisted'],
        valueBoolean: blacklisted,
      });
    }

    if (user) {
      operandList.push({
        operator: 'Equal',
        path: ['user'],
        valueString: user,
      });
    }

    const query = await client.graphql.get()
      .withClassName('Token')
      .withFields(['_additional { id }', 'token', 'user', 'type', 'expires', 'blacklisted'])
      .withWhere({
        operator: 'And',
        operands: operandList
      }).do();
      
    return query.data.Get.Token[0];
  } catch (error) {
    console.error(error);
  }
};

/**
 * Remove token that matches the parameters
 * @param {object} _additional - The object with unique id
 * @returns {Promise<boolean>}
 */
 const remove = async function ({_additional}) {
  let resToken;
  try {
    resToken = await client.data
      .deleter()
      .withClassName('Token')
      .withId(_additional.id)
      .do()
      .then(res => {
        console.log(res)
      })
      .catch(err => {
          console.error(err)
      });
    return resToken == null;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  schemaObj,
  create,
  findOne,
  remove,
};