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
  const allUsers = JSON.parse(fs.readFileSync(FILE_NAME));
  allUsers[userId] = userDetails;
  writeDataInFile(allUsers);
};

/**
 * Function to delte a user from data base
 * @param {string} userId Id of users to be deleted
 */
const deleteUser = userId => {
  const allUsers = JSON.parse(fs.readFileSync(FILE_NAME));
  delete allUsers[userId];
  writeDataInFile(allUsers);
};

/**
 * Update exisiting user in the database
 * @param  {string} userId Id of user to be deleted
 * @param  {string} userDetails Details about the user
 */
const updateUser = (userId, userDetails) => {
  const allUsers = JSON.parse(fs.readFileSync(FILE_NAME));
  allUsers[userId] = userDetails;
  writeDataInFile(allUsers);
};

/**
 * return data of all of the users
 * @returns {string} Data of all of the users
 */
const readAllUsers = () => {
  const allUsers = fs.readFileSync(FILE_NAME);
  return allUsers;
};

/**
 * Returns data of specific user
 * @param {string} userId Id of user whose data is to be found
 * @returns {string} Details about that user if found, empty string otherwise
 */
const readUserById = userId => {
  const allUsers = JSON.parse(fs.readFileSync(FILE_NAME));
  return allUsers[userId];
};

export {
  addUser,
  deleteUser,
  updateUser,
  readAllUsers,
  readUserById,
};
