const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const darkModeBtn = document.getElementById('darkModeBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

// Add task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
});

// Toggle dark mode
darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Save tasks
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    // Sort: incomplete first
    tasks.sort((a, b) => a.completed - b.completed);
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.draggable = true;
        li.innerHTML = `
            <span onclick="toggleTask(${index})">${task.text}</span>
            <div>
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;

        // Drag events
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            const fromIndex = e.dataTransfer.getData('text/plain');
            const toIndex = index;
            moveTask(fromIndex, toIndex);
        });

        taskList.appendChild(li);
    });
    updateProgress();
}

// Toggle task complete
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Edit task
function editTask(index) {
    const newText = prompt("Edit Task:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Move task (drag & drop)
function moveTask(fromIndex, toIndex) {
    const task = tasks.splice(fromIndex, 1)[0];
    tasks.splice(toIndex, 0, task);
    saveTasks();
    renderTasks();
}

// Update progress
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressBar.value = percent;
    progressPercent.textContent = percent + '%';
}
