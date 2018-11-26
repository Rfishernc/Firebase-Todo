import $ from 'jquery';
import axios from 'axios';
import apiKeys from '../db/apiKeys.json';

const getTasks = taskId => new Promise((resolve, reject) => {
  if (taskId !== undefined) {
    axios
      .get(`${apiKeys.firebaseKeys.databaseURL}/tasks/${taskId}.json`)
      .then((data) => {
        const taskObject = data.data;
        taskObject.id = taskId;
        resolve(taskObject);
      })
      .catch((err) => {
        reject(err);
      });
  } else {
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
  }
});

const saveEditedTask = (task) => {
  $('.editSaveButton').click(() => {
    const editedTask = task;
    editedTask.task = $('#nameInput').val();
    axios.put(`${apiKeys.firebaseKeys.databaseURL}/tasks/${editedTask.id}.json`, JSON.stringify(editedTask))
      .then(() => {
        getTasks().then((data) => {
          // eslint-disable-next-line no-use-before-define
          showTasks(data);
        });
      });
  });
};

const editTask = () => {
  $('body').on('click', '.editTaskButton', (event) => {
    const taskId = event.target.dataset.id;
    getTasks(taskId).then((task) => {
      const tempString = `<div>
                    <p>Task name</p>
                    <input type='text' placeholder='${task.task}' id='nameInput'/>
                   </div>`;
      $('#modalBody').html(tempString);
      const buttonString = `
      <button type="button" class="btn btn-primary editSaveButton" id='${task.task}' data-toggle="modal" data-target="#creatorModal">Save changes</button>`;
      $('.modal-footer').html(buttonString);
      saveEditedTask(task);
    });
  });
};

const deleteTask = () => {
  $('body').on('click', '.deleteButton', (event) => {
    const taskId = event.target.id;
    axios.delete(`${apiKeys.firebaseKeys.databaseURL}/tasks/${taskId}.json`).then(() => {
      getTasks().then((data) => {
        // eslint-disable-next-line no-use-before-define
        showTasks(data);
      });
    });
  });
};

const showTasks = (tasks) => {
  let tempString = '';
  tasks.forEach((task) => {
    if (task.isCompleted === false) {
      tempString += `<div class='taskDiv'>
                      <p class='taskText'>${task.task}</p>
                      <p class='deleteButton' id='${task.id}'>X</p>
                      <p class='editTaskButton' data-toggle="modal" data-target="#creatorModal" data-id='${task.id}'>Edit</p>
                     </div>`;
    }
  });
  deleteTask();
  editTask();
  $('#tasksDiv').html(tempString);
  $('#tasksDiv').show();
  $('#createTaskButton').show();
};

export default {
  getTasks,
  showTasks,
};
