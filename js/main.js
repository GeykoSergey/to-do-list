const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const wrapper = document.querySelector('.wrapper');

// const formEdit = document.querySelector('#form-edit');
// const inputEdit =document.querySelector('#taskInputEdit');
// const btnEdit = document.querySelector('.btn-edit');
    
// массив для задач, храниться в LS
let tasks = [];
  
// получаем данные из LS
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
}
  
// рендер задач из массива
tasks.forEach(function (task) {
  renderTask(task);
});
  
// проверка наличия задач и отображение "Список дел пуст"
checkEmptyList();
  
// прослушка формы
form.addEventListener('submit', addTask);
  
// прослушка ul
taskList.addEventListener('click', deleteTask);
  
taskList.addEventListener('click', doneTask);

taskList.addEventListener('click', editTask);
  

// =======================================================================
// Добавить задачу
// =======================================================================
function addTask(event) {
  event.preventDefault();
  
  // получаем значение поля ввода (текст задачи)
  const taskText = taskInput.value;
  
  // обьект, который будет описывать задачу
  const newTask = {
    id: Date.now(),
    // dateCreate: new Date(),
    text: taskText,
    done: false,
  }
  
  // добавляем задачу в массив с задачами
  tasks.push(newTask);
  
  saveToLocalStorage ();
  
  // рендерим добавленную задачу, из этой ф-ции addTask
  // аргументом является обьект задачи const newTask
  renderTask(newTask);
      
  // Очищаем поле ввода и возвращаем на него фокус
  taskInput.value = '';
  taskInput.focus();
  
  // проверка наличия задач и отображение "Список дел пуст"
  checkEmptyList();
  
}
  
// тк список динамичен, мы будем слушать клик по родителю списка задач, те ul
function deleteTask(event) {
  
  // проверяем, что клик был по кнопке "удалить задачу"
  // для того что бы работать с дата атрибутами, необходимо использовать 
  // свойство dataset, указываем его название без приставки data-
  
  // если целью события является <button type="button" data-action="delete"
  // тег с дата атрибутом data-action="delete"
  // то  мы находим его родителя с классом '.task-item' (тег li) и записываем
  // в переменную и удаляем
  if(event.target.dataset.action === 'delete') {
  
    const parentNode = event.target.closest('.task-item');
  
    // удаляем задачу из данных
    // определяем id задачи
    // тот id который мы получаем из разметки является строкой
    const id = Number(parentNode.id);
  
    // фильтруем исходный массив и делаем так чтобы 
    // найденная задача не попала в новый массив
    // исходный массив заменяется на новый 
    tasks = tasks.filter(function (task) {
      if (task.id === id) {
        return false;
      } else {
        return true;
      }
    });
  
    saveToLocalStorage ();
  
    parentNode.remove();
  
    // проверка наличия задач и отображение "Список дел пуст"
    checkEmptyList();
  
  }
}

// =======================================================================
// Задача выполнена
// =======================================================================
function doneTask(event) {
  // проверяем, что клик был по кнопке "задача выполнена"
  // находим родительскую ноду
  // затем внутри род ноды находим спан с классом '.task-title'
  // далле к спану добавляем модифицирующий спан (выделяем)
  if (event.target.dataset.action === 'done') {
  
    const parentNode = event.target.closest('.task-item');
  
    // определяем id задачи
    const id = Number(parentNode.id);
  
    // находим задачу в массиве задач
    // find возвращает найденный элемент
    // функция сработает для каждого элемента
    const task = tasks.find(function(task) {
      if (task.id === id) {
        return true;
      }
    });
  
    // меняем статус done на обратный
    task.done = !task.done;
  
    saveToLocalStorage ();
  
    const taskTitle = parentNode.querySelector('.task-item__text');
    taskTitle.classList.toggle('task-item__text--done');
  }
}

// =======================================================================
// Редактирование задачи
// =======================================================================
function editTask(event) {
  if(event.target.dataset.action === "edit") {

    const parentNode = event.target.closest('.task-item');
    const id = Number(parentNode.id);

    const task = tasks.find(function(task) {
      if(task.id === id) {
        return true;
      }
    });

    const editTaskModalHtml = `
      <div class="modal__overlay">
        <div class="modal__content">
          <form class="form task__form" id="form-edit">
            <label class="form__label">
              <textarea class="input-reset form__input" type="text" name="task" id="taskInputEdit" placeholder="Enter the task text" required rows="10" cols="33"></textarea>
            </label>
            <button class="btn-reset btn btn--action btn-edit" type="submit">
              Save changes
            </button>
          </form> 
        </div>
      </div>
    `;

    wrapper.insertAdjacentHTML('beforeend', editTaskModalHtml);

    const modalEdit = document.querySelector('.modal__overlay');
    const inputEdit = document.querySelector('#taskInputEdit');
    const btnEdit = document.querySelector('.btn-edit');

    inputEdit.value = task.text;

    btnEdit.addEventListener('click', function(event) {
      event.preventDefault();
      task.text = inputEdit.value;
      console.log('!!!');
      saveToLocalStorage();
      let editTaskText = parentNode.querySelector('.task-item__text');
      editTaskText.innerText = task.text;
      // let editTaskDate = parentNode.querySelector('.task-item__date-edit');
      // editTaskDate.innerText = new Date();
      
      modalEdit.remove();
    });
  }      
}

// =======================================================================
// проверка наличия задач и отображение "Список дел пуст"
// =======================================================================
// checkEmptyList() запускается каждый раз, при изменении данных
function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
      <li class="empty-list" id="emptyList">
        <div class="empty-list__title">To-do list is empty<div>
      </li>
    `;
        
    taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
  };
  
  if(tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    // если emptyListEl есть, то тогда удаляем его, иначе возвращаем null
    emptyListEl ? emptyListEl.remove() : null;
  }
};
  
function saveToLocalStorage () {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
  
// первый параметр - имя ключа под которым записываем данные
// второй - что записываем плюс преобразуем в JSON - строку
  
function renderTask(task) {
  const cssClass = task.done ? 'task-item__text task-item__text--done' : 'task-item__text';
    
  // формируем разметку для новой задачи данные получаем из обьекта массива
  const taskHtml = `
    <li id="${task.id}" class="task-item">
      <div class="${cssClass}">${task.text}</div>
        <div class="task-item__buttons">
        <button class="btn-reset btn btn--action" type="button" data-action="done">
          Done
        </button>
        <button class="btn-reset btn btn--action" type="button" data-action="delete">
          Delete
        </button>
        <button class="btn-reset btn btn--action" type="button" data-action="edit">
          Edit
        </button>
        </div>
      </div>
    </li>
  `;
    
  // Добавляем задачу на страницу
  taskList.insertAdjacentHTML('beforeend', taskHtml);
}




const body = document.querySelector('body');
const toggle = document.querySelector('#toggle');

toggle.addEventListener('change', () => {
  body.classList.toggle('dark');
});