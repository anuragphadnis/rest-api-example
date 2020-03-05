/* eslint-disable no-underscore-dangle */
import http from 'http';
import config from 'config';

import * as users from '../lib/jsonCRUD';

const sendError = (statusCode, response) => {
  response.writeHead(statusCode, '{content-type: text}');
  response.write('Resource not found');
  response.end();
};

const writeResponse = (response, statusCode, contentType, body) => {
  response.writeHead(statusCode, contentType);
  response.write(body);
  response.end();
};

const methodNotAllowed = (request, response) => {
  const apiResponse = `${request.method} cannot be done on this url`;
  const statusCode = 405;
  writeResponse(response, statusCode, '{content-type:text}', apiResponse);
};

const _allUserGet = response => {
  const apiResponse = JSON.parse(users.readAllUsers());
  writeResponse(response, apiResponse.statusCode, '{content-type:text}', apiResponse.message);
};

const operationOnAllUsers = (request, response) => {
  switch (request.method) {
    case 'GET':
      _allUserGet(response);
      break;
    default:
      methodNotAllowed(request, response);
  }
};

const _singleUserGet = (userId, response) => {
  const apiResponse = JSON.parse(users.readUserById(userId));
  writeResponse(response, apiResponse.statusCode, '{content-type:text}', apiResponse.message);
};
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

const _singleUserDelete = (userId, response) => {
  const apiResponse = JSON.parse(users.deleteUser(userId));
  writeResponse(response, apiResponse.statusCode, '{content-type:text}', apiResponse.message);
};

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
      sendError(404, response);
  }
}).listen(config.get('PORT'));
