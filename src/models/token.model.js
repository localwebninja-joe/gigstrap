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

module.exports = {
  schemaObj,
  create,
};