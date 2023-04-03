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
        const tasks_container = document.getElementById('tasks');
        const alltasks = document.getElementById('alltasks');
        const cptask=document.getElementById('cptask')
        const notask=document.getElementById('notask')
        let _tasks = '';
        let _alltaks='';
        let _cptask='';
        let _notask='';
        console.log(tasks)
        tasks.forEach((task, index) => {
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
            _alltaks += `                                         
                <div class="task-item ${task.state === "show" ? 'mt-2 d-flex justify-content-between align-items-center' : 'd-none'}">
                    <div class="">
                        <p  class="c" id="decor">${task.name}</p>
                    </div>
                </div>
            `;

            if(task.completed==='false'){
                _notask += `                                         
                <div class="task-item ${task.state === "show" ? 'mt-2 d-flex justify-content-between align-items-center' : 'd-none'}">
                    <div class="">
                        <p  class="c" id="decor">${task.name}</p>
                    </div>
                </div>
            `;
            }

            if(task.completed==='true'){
                _cptask += `                                         
                <div class="task-item ${task.state === "show" ? 'mt-2 d-flex justify-content-between align-items-center' : 'd-none'}">
                    <div class="">
                        <p  class="c" id="decor">${task.name}</p>
                    </div>
                </div>
            `;
            }


        });
        

        (tasks.length === 0 || _tasks === '') ? clear__all.classList.add('d-none') : clear__all.classList.remove('d-none');
        tasks_container.innerHTML = _tasks;
        alltasks.innerHTML=_alltaks
        cptask.innerHTML=_cptask
        notask.innerHTML=_notask
        localStorage.setItem('tasks', JSON.stringify(tasks));

       

    }  // <button type="button" class="btn btn-sm btn-primary edit" onclick="Task.update('${task.id}')"><i class="fa-solid fa-pen-to-square"></i></button>



    // create task
    static create(task) {
        const generateRandomId = Math.floor(Math.random() * 99999);
        tasks.push({ id: generateRandomId, name: task, completed: 'false', state: 'show' });
        this.display();
    }

    // completed
    static todoCompleted(task) {
        tasks.forEach(item => {
            if (`${item.id}` === task) {
                if (item.completed === 'false')
                    item.completed = 'true';
                else
                    item.completed = 'false';
            }
        });

        this.display();
    }

    static completeall() {
        tasks.forEach(item => {item.completed = 'true';});
        this.display();
    }
    // update/edit task
    static update(task) {
        const taskItems = document.querySelectorAll('.task-item');
        const taskInput = document.getElementById('task-input');
        const edit = document.querySelectorAll('.task-name');

        tasks.forEach((item, index) => {
            if (`${item.id}` === task) {
                taskItems[index].classList.add('task-editing');
                edit[index].innerHTML = `
                    
                    <input style='width: 100px; ' type="text" id="" class="editinput" value="${item.name}" placeholder="Edit this Todo and Hit Enter!" title="Edit this Todo and Hit Enter!" />
                    <button type="button" class="btn btn-primary save-edited-todo">Edit This</button>
                `;

                const taskInputs = document.querySelectorAll('#task-input');
                const saveEditTodo = document.querySelector('.save-edited-todo');
                if (taskInputs) {
                    taskInputs.forEach(input => {
                        input.addEventListener('keydown', e => {
                            if (e.key === 'Enter') {
                                if (input.value === '') showError('.error', 'Edit Field Cannot be Empty!');

                                saveEditTodo.addEventListener('click', e => {
                                    let input_value = input.value;
                                    if (input_value) this.update(task, input_value);
                                });

                                saveEditTodo.click();
                            }
                        });
                    });
                }

                if (taskInput.value === '') return;

                item.name = taskInput.value;
            }
        });

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