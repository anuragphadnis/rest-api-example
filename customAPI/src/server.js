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

const user = (attributes, request, response) => {
  if (attributes.length === 0) {
    let userData;
    switch (request.method) {
      case 'GET':
        userData = users.readAllUsers();
        writeResponse(response, 200, '{content-type:text}', userData);
        break;
      default:
        writeResponse(
          response,
          404,
          '{content-type:text}',
          `${request.method} cannot be done on this url`,
        );
    }
  }
  if (attributes.length !== 0) {
    const userId = attributes[0];
    let userData;
    let requestBody;
    switch (request.method) {
      case 'GET':
        userData = users.readUserById(userId);
        writeResponse(response, 200, '{content-type:text}', userData);
        break;

      case 'POST':
        requestBody = '';
        request.on('data', chunk => {
          requestBody += chunk;
        });
        request.on('end', () => {
          users.addUser(userId, requestBody);
          writeResponse(response, 200, '{content-type:text}', 'User Added');
        });
        break;

      case 'PUT':
        requestBody = '';
        request.on('data', chunk => {
          requestBody += chunk;
        });
        request.on('end', () => {
          users.addUser(userId, requestBody);
          writeResponse(response, 200, '{content-type:text}', 'user updated');
        });
        break;

      case 'DELETE':
        users.deleteUser(userId);
        writeResponse(response, 200, '{content-type:text}', 'User Deleted');
        break;

      default:
        writeResponse(
          response,
          200,
          '{content-type:text}',
          `${request.method} cannot be done on this url`,
        );
    }
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
