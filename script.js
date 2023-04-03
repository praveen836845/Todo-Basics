window.onload = () => {
    tasks.forEach(item => item.state = "show");
    Task.display();
}

let tasks = [];
const getTasks = localStorage.getItem('tasks');

if (getTasks) tasks = JSON.parse(getTasks);

const input = document.getElementById('task'),
    createBtn = document.getElementById('create-task'),
    search_btn = document.getElementById('search-task'),
    refresh = document.getElementById('refresh'),
    clear__all = document.querySelector('.clear__all'),
    select_all=document.getElementById('select-all')

class Task {
    // display tasks
    static display() {
        // Get the necessary DOM elements
        const tasks_container = document.getElementById('tasks');
        const alltasks = document.getElementById('alltasks');
        const cptask=document.getElementById('cptask')
        const notask=document.getElementById('notask')
      
        // Initialize variables to store HTML code for tasks
        let _tasks = '';
        let _alltaks='';
        let _cptask='';
        let _notask='';
      
        // Loop through tasks array and generate HTML for each task
        tasks.forEach((task, index) => {
          // Generate HTML code for a single task item
          _tasks += `                                         
            <div class="task-item ${task.state === "show" ? 'mt-2 d-flex justify-content-between align-items-center' : 'd-none'}">
              <div class="">
                <p class="${task.completed === 'true' ? ' task-name' : 'decor'}" id="task__name">${task.name}</p>
              </div>
              <div class="action btns action_button">
                <button type="button" class="btn btn-sm btn-success is__completed" onclick="Task.todoCompleted('${task.id}')"><i class="fa-solid fa-circle-check"></i></button>
                <button type="button" class="btn btn-sm btn-danger ms-1 delete" onclick="Task.delete('${task.id}')"><i class="fa-solid fa-trash-can"></i></button>
              </div>
            </div>
          `;
      
          // Generate HTML code for a single task item in "all tasks" view
          _alltaks += `                                         
            <div class="task-item ${task.state === "show" ? 'mt-2 d-flex justify-content-between align-items-center' : 'd-none'}">
              <div class="">
                <p class="c" id="decor">${task.name}</p>
              </div>
            </div>
          `;
      
          // Generate HTML code for a single task item in "completed tasks" view
          if(task.completed==='true'){
            _cptask += `                                         
              <div class="task-item ${task.state === "show" ? 'mt-2 d-flex justify-content-between align-items-center' : 'd-none'}">
                <div class="">
                  <p class="c" id="decor">${task.name}</p>
                </div>
              </div>
            `;
          }
      
          // Generate HTML code for a single task item in "incomplete tasks" view
          if(task.completed==='false'){
            _notask += `                                         
              <div class="task-item ${task.state === "show" ? 'mt-2 d-flex justify-content-between align-items-center' : 'd-none'}">
                <div class="">
                  <p class="c" id="decor">${task.name}</p>
                </div>
              </div>
            `;
          }
        });
        
        // Show or hide the "Clear All" button based on whether there are any tasks to clear
        (tasks.length === 0 || _tasks === '') ? clear__all.classList.add('d-none') : clear__all.classList.remove('d-none');
      
        // Update the DOM with the generated HTML code for each task view
        tasks_container.innerHTML = _tasks;
        alltasks.innerHTML=_alltaks
        cptask.innerHTML=_cptask
        notask.innerHTML=_notask
      
        // Save the updated tasks array to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
      


    // create task
    static create(task) {
        const generateRandomId = Math.floor(Math.random() * 99999);
        tasks.push({ id: generateRandomId, name: task, completed: 'false', state: 'show' });
        this.display();
    }

    // ****************************************** completed******************************
static todoCompleted(task) {
    // Loop through the tasks array and find the task that matches the given `task` parameter
    tasks.forEach(item => {
        if (`${item.id}` === task) {
            // If the task is currently marked as incomplete, mark it as complete; otherwise, mark it as incomplete
            if (item.completed === 'false')
                item.completed = 'true';
            else
                item.completed = 'false';
        }
    });

    // Call the `display` method to update the DOM with the new task information
    this.display();
}

// Define a static method `completeall`
static completeall() {
    // Loop through the tasks array and mark all tasks as complete
    tasks.forEach(item => {item.completed = 'true';});

    // Call the `display` method to update the DOM with the new task information
    this.display();
}



    // ***************************************** update/edit task****************************************
    // Define a static method `update` that takes a `task` parameter
static update(task) {
    // Select all task items from the DOM with a class of `.task-item`
    const taskItems = document.querySelectorAll('.task-item');

    // Select the task input field and all elements with a class of `.task-name`
    const taskInput = document.getElementById('task-input');
    const edit = document.querySelectorAll('.task-name');

    // Loop through the tasks array and find the task that matches the given `task` parameter
    tasks.forEach((item, index) => {
        if (`${item.id}` === task) {
            // Add a class to the task item to indicate that it is being edited
            taskItems[index].classList.add('task-editing');

            // Replace the task name text with an input field and a "Save" button
            edit[index].innerHTML = `
                <input style='width: 100px; ' type="text" id="" class="editinput" value="${item.name}" placeholder="Edit this Todo and Hit Enter!" title="Edit this Todo and Hit Enter!" />
                <button type="button" class="btn btn-primary save-edited-todo">Edit This</button>
            `;

            // Select all input fields with an ID of `task-input`
            const taskInputs = document.querySelectorAll('#task-input');

            // Select the "Save" button
            const saveEditTodo = document.querySelector('.save-edited-todo');

            // Add an event listener to each input field that checks for the "Enter" key to be pressed
            if (taskInputs) {
                taskInputs.forEach(input => {
                    input.addEventListener('keydown', e => {
                        if (e.key === 'Enter') {
                            // Show an error message if the input field is empty
                            if (input.value === '') showError('.error', 'Edit Field Cannot be Empty!');

                            // Add an event listener to the "Save" button that updates the task with the new name
                            saveEditTodo.addEventListener('click', e => {
                                let input_value = input.value;
                                if (input_value) this.update(task, input_value);
                            });

                            // Simulate a click on the "Save" button
                            saveEditTodo.click();
                        }
                    });
                });
            }

            // If the task input field is empty, exit the function
            if (taskInput.value === '') return;

            // Update the task name with the value of the task input field
            item.name = taskInput.value;
        }
    });

    // Call the `display` method to update the DOM with the new task information
    this.display();
}


    // delete task
    static delete(task) {
        tasks = tasks.filter(item => `${item.id}` !== task);

        // tasks.forEach((item, index) => {
        //     if(`${item.id}` === task) {
        //         tasks.splice(index, 1)
        //     }
        // });
        this.display();
    }

    static selecteddelete(task) {
        const data=[]
        tasks.map((item,index)=>{
            // console.log(item.completed)
            if(item.completed==='false'){
                data.push(item)
            }
        })
        // console.log(data)
       tasks=data

        this.display();
    }

    // search task
    static search(task) {
        tasks = tasks.filter(item => item.name.toLowerCase() === task ? item.state = "show" : item.state = "hide");

        const checkTask = element => element.name.toLowerCase() === `${task.toString()}`;
        if (tasks.some(checkTask) === false) {
            showError('.error', 'Todo, Does not Exists!');
            return clear__all.classList.add('d-none');
        } else clear__all.classList.remove('d-none');

        this.display();
    }
}


createBtn.addEventListener('click', (e) => {
    const input_value = input.value;
    if (input_value !== '') {
        input.value = '';
        Task.create(input_value);
    } else {
        showError('.error', 'Cannot Add Todo!');
    }
});

search_btn.addEventListener('click', e => {
    let task = input;
    let search_value = input.value;

    if (search_value != '') {
        task.style.border = '1px solid gray';
        input.value = '';
        Task.search(search_value.toLowerCase());
    } else {
        showError('.error', 'Search Field Cannot be Empty!');
        task.style.border = '1px solid red';
    }
});


let form = document.querySelector('.form');
form.addEventListener('submit', e => {
    e.preventDefault();
});


input.addEventListener('keydown', e => {
    if (e.key === 'Enter') createBtn.click();

    if (e.key === 'ArrowRight') search_btn.click();
});


function showError(error_place, error_message) {
    const error_container = document.querySelector(error_place);
    if (error_container) {
        error_container.innerHTML = `
            <div class="alert alert-danger error" role="alert">
                ${error_message}
            </div>
        `;
        setTimeout(() => error_container.innerHTML = '', 3000);
    }
}


function clearAll() {
    tasks = [];
    Task.display();
}

clear__all.addEventListener('click', clearAll);


refresh.addEventListener('click', () => location.href = location.href);