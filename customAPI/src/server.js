/* eslint-disable no-underscore-dangle */
import http from 'http';
import config from 'config';

import * as users from '../lib/jsonCRUD';

/**
 * Sends error response with status code 404
 * @param  {object} response Response object
 */
const send404Error = response => {
  response.writeHead(404, '{content-type: text}');
  response.write('Resource not found');
  response.end();
};

/**
 * Writes a response back to the user
 * @param  {object} response response object of the user
 * @param  {number} statusCode status code to be sent in reponse
 * @param  {string} contentType type of content in response
 * @param  {string} body body of the response to be sent
 */
const writeResponse = (response, statusCode, contentType, body) => {
  response.writeHead(statusCode, contentType);
  response.write(body);
  response.end();
};
/**
 * Sends a response of method not allowed
 * @param  {object} request request from the user
 * @param  {object} response response sent to the user
 */
const methodNotAllowed = (request, response) => {
  const apiResponse = `${request.method} cannot be done on this url`;
  const statusCode = 405;
  writeResponse(response, statusCode, '{content-type:text}', apiResponse);
};

/**
 * Get data of all users
 * @param {object} response response object to be sent to the user
 */
const _allUserGet = response => {
  const apiResponse = JSON.parse(users.readAllUsers());
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
  const apiResponse = JSON.parse(users.readUserById(userId));
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
    const apiResponse = JSON.parse(users.addUser(userId, requestBody));
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
    const apiResponse = JSON.parse(users.updateUser(userId, requestBody));
    writeResponse(response, apiResponse.statusCode, '{content-type:text}', apiResponse.message);
  });
};

/**
 * Deletes already existing user
 * @param {string} userId userid of the user
 * @param  {object} response response sent to the user
 */
const _singleUserDelete = (userId, response) => {
  const apiResponse = JSON.parse(users.deleteUser(userId));
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

http.createServer((request, response) => {
  const attributes = request.url.replace(/^\//, '').split('/');
  switch (attributes[0]) {
    case 'user':
      user(attributes.slice(1), request, response);
      break;
    default:
      send404Error(response);
  }
}).listen(config.get('PORT'));
