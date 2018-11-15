import $ from 'jquery';
import './index.scss';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'bootstrap';
import axios from 'axios';
import apiKeys from '../db/apiKeys.json';

const getTasks = () => new Promise((resolve, reject) => {
  axios
    .get(`${apiKeys.firebaseKeys.databaseURL}/tasks.json`)
    .then((data) => {
      const tasksObject = data.data;
      const tasksArray = [];
      if (tasksObject != null) {
        Object.keys(tasksObject).forEach((task) => {
          const taskForArray = tasksObject[task];
          taskForArray.id = task;
          tasksArray.push(taskForArray);
        });
      }
      resolve(tasksArray);
    })
    .catch((err) => {
      reject(err);
    });
});


const showTasks = (tasks) => {
  let tempString = '';
  tasks.forEach((task) => {
    if (task.isCompleted === false) {
      tempString += `<p>${task.task}</p>`;
    }
  });
  $('#tasksDiv').html(tempString);
  $('#tasksDiv').show();
};

const logInFunction = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

const logInButton = () => {
  $('#logInButton').click(() => {
    logInFunction();
    getTasks();
    $('#logInButton').hide();
    $('#logOutButton').show();
  });
};

const logInStatus = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      getTasks().then((tasks) => {
        showTasks(tasks);
      });
      console.log(user);
    }
  });
};

const logOutButton = () => {
  $('#logOutButton').on('click', () => {
    firebase.auth().signOut().then(() => {
      $('#logInButton').show();
      $('#logOutButton').hide();
      $('#tasksDiv').hide();
    });
  });
};

const init = () => {
  firebase.initializeApp(apiKeys.firebaseKeys);
  logInButton();
  logOutButton();
  logInStatus();
};

init();
