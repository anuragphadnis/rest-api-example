import * as jsonDB from '../jsonCRUD';
import {methodNotAllowed, writeResponse} from '../response';
/**
 * Get data of all users
 * @param {object} response response object to be sent to the user
 */
const _allUserGet = response => {
  const apiResponse = JSON.parse(jsonDB.readAllUsers());
  writeResponse(response, apiResponse.statusCode, '{content-type:text}', apiResponse.message);
};

/**
 * Calls supported functions for operations on all users
 * @param  {object} request request from the user
 * @param  {object} response response sent to the user
 */
const operationOnAllUsers = (request, response) => {
  switch (request.method) {
    case 'GET':
      _allUserGet(response);
      break;
    default:
      methodNotAllowed(request, response);
  }
};

/**
 * Gets the data of user by its Id from database
 * @param {*} userId userid of the user
 * @param  {object} response response sent to the user
 */
const _singleUserGet = (userId, response) => {
  const apiResponse = JSON.parse(jsonDB.readUserById(userId));
  writeResponse(response, apiResponse.statusCode, '{content-type:text}', apiResponse.message);
};

/**
 * Stores data of new user in the database, updates data if user already exists
 * @param {string} userId userid of the user
 * @param {object} request request sent from the user
 * @param  {object} response response sent to the user
 */
const _singleUserPOST = (userId, request, response) => {
  let requestBody = '';
  request.on('data', chunk => {
    requestBody += chunk;
  });
  request.on('end', () => {
    const apiResponse = JSON.parse(jsonDB.addUser(userId, requestBody));
    writeResponse(response, apiResponse.statusCode, '{content-type:text}', apiResponse.message);
  });
};

/**
 * Updates data of existing user
 * @param {string} userId userid of the user
 * @param {object} request request sent from the user
 * @param  {object} response response sent to the user
 */
const _singleUserPut = (userId, request, response) => {
  let requestBody = '';
  request.on('data', chunk => {
    requestBody += chunk;
  });
  request.on('end', () => {
    const apiResponse = JSON.parse(jsonDB.updateUser(userId, requestBody));
    writeResponse(response, apiResponse.statusCode, '{content-type:text}', apiResponse.message);
  });
};

/**
 * Deletes already existing user
 * @param {string} userId userid of the user
 * @param  {object} response response sent to the user
 */
const _singleUserDelete = (userId, response) => {
  const apiResponse = JSON.parse(jsonDB.deleteUser(userId));
  writeResponse(response, apiResponse.statusCode, '{content-type:text}', apiResponse.message);
};

/**
 * Calls respective functions for all supported operations on a single user identified by its userId
 * @param {array} attributes url splitted in the form of array
 * @param {object} request request sent from the user
 * @param  {object} response response sent to the user
 */
const operationOnSingleUser = (attributes, request, response) => {
  const userId = attributes[0];
  switch (request.method) {
    case 'GET':
      _singleUserGet(userId, response);
      break;

    case 'POST':
      _singleUserPOST(userId, request, response);
      break;

    case 'PUT':
      _singleUserPut(userId, request, response);
      break;

    case 'DELETE':
      _singleUserDelete(userId, response);
      break;

    default:
      methodNotAllowed(request, response);
  }
};

/**
 * All operations on user endpoint
 * @param {array} attributes url splitted in the form of array
 * @param {object} request request sent from the user
 * @param  {object} response response sent to the user
 */
const user = (attributes, request, response) => {
  if (attributes.length === 0) {
    operationOnAllUsers(request, response);
  }
  if (attributes.length !== 0) {
    operationOnSingleUser(attributes, request, response);
  }
};

export { user };
