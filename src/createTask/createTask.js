import $ from 'jquery';
import axios from 'axios';
import apiKeys from '../../db/apiKeys.json';
import getTasks from '../getTasks';

const createTask = () => {
  $('#createTaskButton').click(() => {
    const tempString = `<div>
                    <p>Task name</p>
                    <input type='text' placeholder='Task name' id='nameInput'/>
                   </div>`;
    $('#modalBody').html(tempString);
    const buttonString = `
    <button type="button" class="btn btn-primary createSaveButton" id='creatorModalSaveButton' data-toggle="modal" data-target="#creatorModal">Save changes</button>`;
    $('.modal-footer').html(buttonString);
  });
};

const saveCreatedTask = () => {
  $('.createSaveButton').click(() => {
    const createdTask = {
      task: $('#nameInput').val(),
      isCompleted: false,
    };
    axios.post(`${apiKeys.firebaseKeys.databaseURL}/tasks.json`, JSON.stringify(createdTask))
      .then(() => {
        getTasks.getTasks().then((data) => {
          getTasks.showTasks(data);
        });
      });
  });
};

export default {
  createTask,
  saveCreatedTask,
};
