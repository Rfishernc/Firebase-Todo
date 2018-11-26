import $ from 'jquery';
import './index.scss';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'bootstrap';
import apiKeys from '../db/apiKeys.json';
import createTask from './createTask/createTask';
import getTasks from './getTasks';

const logInFunction = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

const logInButton = () => {
  $('#logInButton').click(() => {
    logInFunction();
    getTasks.getTasks();
    $('#logInButton').hide();
    $('#logOutButton').show();
  });
};

const logInStatus = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      getTasks.getTasks().then((tasks) => {
        getTasks.showTasks(tasks);
      });
    }
  });
};

const logOutButton = () => {
  $('#logOutButton').on('click', () => {
    firebase.auth().signOut().then(() => {
      $('#logInButton').show();
      $('#logOutButton').hide();
      $('#tasksDiv').hide();
      $('#createTaskButton').hide();
    });
  });
};

const init = () => {
  firebase.initializeApp(apiKeys.firebaseKeys);
  logInButton();
  logOutButton();
  logInStatus();
  createTask.createTask();
  createTask.saveCreatedTask();
};

init();

export default {
  logInStatus,
};
