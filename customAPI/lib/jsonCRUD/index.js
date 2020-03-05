import fs from 'fs';
import config from 'config';

const FILE_NAME = config.get('FILE_NAME');
const ENCODING = config.get('ENCODING');
const spacesInJson = config.get('spacesInJson');

/**
 * Replaces all content of the FILE using fs Module
 * @param  {object} data data to be written in file
 * @param  {function} callback callback function to be executed
 */
const writeDataInFile = data => {
  fs.writeFileSync(FILE_NAME, JSON.stringify(data, null, spacesInJson), ENCODING);
};

/**
 * Function to add new user into the database
 * @param  {string} userDetails details of the user
 * @param  {function} callback callback function to be executed
 */
const addUser = (userId, userDetails) => {
  try {
    const allUsers = JSON.parse(fs.readFileSync(FILE_NAME, 'utf-8'));
    allUsers[userId] = userDetails;
    writeDataInFile(allUsers);
    return JSON.stringify({ statusCode: 200, message: 'User Has Been created' });
  } catch (error) {
    return JSON.stringify({ statusCode: 500, message: error.message });
  }
};

/**
 * Function to delte a user from data base
 * @param {string} userId Id of users to be deleted
 */
const deleteUser = userId => {
  try {
    const allUsers = JSON.parse(fs.readFileSync(FILE_NAME, 'utf-8'));
    if (!(userId in allUsers)) {
      throw new Error('User Not Found');
    }
    delete allUsers[userId];
    writeDataInFile(allUsers);
    return JSON.stringify({ statusCode: 200, message: 'User Has Been deleted' });
  } catch (error) {
    return JSON.stringify({ statusCode: 500, message: error.message });
  }
};

/**
 * Update exisiting user in the database
 * @param  {string} userId Id of user to be deleted
 * @param  {string} userDetails Details about the user
 */
const updateUser = (userId, userDetails) => {
  try {
    const allUsers = JSON.parse(fs.readFileSync(FILE_NAME, 'utf-8'));
    if (!allUsers[userId]) {
      throw new Error('User Not Found');
    }
    allUsers[userId] = userDetails;
    writeDataInFile(allUsers);
    return JSON.stringify({ statusCode: 200, message: 'User Has Been updated' });
  } catch (error) {
    return JSON.stringify({ statusCode: 500, message: error.message });
  }
};

/**
 * return data of all of the users
 * @returns {string} Data of all of the users
 */
const readAllUsers = () => {
  try {
    const allUsers = fs.readFileSync(FILE_NAME, 'utf-8');
    return JSON.stringify({ statusCode: 200, message: allUsers });
  } catch (error) {
    return JSON.stringify({ statusCode: 500, message: error.message });
  }
};

/**
 * Returns data of specific user
 * @param {string} userId Id of user whose data is to be found
 * @returns {string} Details about that user if found, empty string otherwise
 */
const readUserById = userId => {
  try {
    const allUsers = JSON.parse(fs.readFileSync(FILE_NAME));
    if (!allUsers[userId]) {
      throw new Error('User Not Found');
    }
    return JSON.stringify({ statusCode: 200, message: allUsers[userId] });
  } catch (error) {
    return JSON.stringify({ statusCode: 500, message: error.message });
  }
};

export {
  addUser,
  deleteUser,
  updateUser,
  readAllUsers,
  readUserById,
};
