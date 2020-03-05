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

export {
  send404Error,
  writeResponse,
  methodNotAllowed,
};
