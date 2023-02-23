const weaviate = require("weaviate-client");
const { User, Token } = require('../models');
const moment = require('moment');
// set up client
const client = weaviate.client({
	scheme: 'http',
	host: 'localhost:8080'
});



const models = [
  User, Token
];

models.forEach(function(model){
  try {
    client.schema.classDeleter().withClassName(model.schemaObj.class).do()
    .then(() => {
      console.log(`Class ${model.schemaObj.class} deleted successfully`);
    })
    .catch((error) => {
      console.error(`Error deleting class: ${error.message}`);
    });

    client
    .schema
    .classCreator()
    .withClass(model.schemaObj)
    .do()
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.error(err)
    });


  } catch(e) { console.log(e) }
});
