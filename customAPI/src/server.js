/* eslint-disable no-underscore-dangle */
import http from 'http';
import config from 'config';

import { user } from '../lib/user';

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
