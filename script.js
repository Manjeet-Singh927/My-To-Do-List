document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Render tasks
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        const filteredTasks = filter === 'all' 
            ? tasks 
            : filter === 'active' 
                ? tasks.filter(task => !task.completed) 
                : tasks.filter(task => task.completed);
        
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                <span>${task.text}</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            
            taskList.appendChild(li);
        });
    }
    
    // Add new task
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            taskInput.value = '';
            renderTasks();
        }
    }
    
    // Toggle task completion
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    }
    
    // Delete task
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
    }
    
    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Filter tasks
    function filterTasks(e) {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderTasks(e.target.dataset.filter);
    }
    
    // Event listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('task-checkbox')) {
            toggleTask(e.target.dataset.index);
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTask(e.target.dataset.index);
        }
    });
    
    filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));
    
    // Initial render
    renderTasks();
});
