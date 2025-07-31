// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');
const searchInput = document.getElementById('searchInput');
const taskCount = document.getElementById('taskCount');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const toast = document.getElementById('toast');

// Initialize tasks array
let tasks = [];

// Initialize the app
function init() {
    loadTasks();
    renderTasks();
    updateTaskCount();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    clearAllBtn.addEventListener('click', clearAllTasks);
    searchInput.addEventListener('input', filterTasks);
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (!taskText) {
        showToast('Please enter a task', 'error');
        taskInput.focus();
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        timestamp: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateTaskCount();
    taskInput.value = '';
    taskInput.focus();
    showToast('Task added successfully', 'success');
}

// Render tasks to the DOM
function renderTasks(filteredTasks = null) {
    const tasksToRender = filteredTasks || tasks;
    
    if (tasksToRender.length === 0) {
        taskList.innerHTML = '<li class="no-tasks">No tasks found. Add a task to get started!</li>';
        return;
    }
    
    taskList.innerHTML = tasksToRender.map(task => `
        <li class="task-item" data-id="${task.id}">
            <div class="task-content">
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <span class="task-timestamp">${formatDate(task.timestamp)}</span>
            </div>
            <div class="task-actions">
                <button class="complete-btn" title="Mark as complete">
                    <i class="fas fa-check"></i>
                </button>
                <button class="delete-btn" title="Delete task">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </li>
    `).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', toggleTaskComplete);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
}

// Toggle task completion status
function toggleTaskComplete(e) {
    const taskId = parseInt(e.target.closest('.task-item').dataset.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
        const message = tasks[taskIndex].completed ? 'Task completed!' : 'Task marked incomplete';
        showToast(message, 'success');
    }
}

// Delete a single task
function deleteTask(e) {
    const taskItem = e.target.closest('.task-item');
    const taskId = parseInt(taskItem.dataset.id);
    
    // Add animation
    taskItem.style.transform = 'translateX(100px)';
    taskItem.style.opacity = '0';
    taskItem.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        updateTaskCount();
        showToast('Task deleted', 'warning');
    }, 300);
}

// Clear all tasks
function clearAllTasks() {
    if (tasks.length === 0) {
        showToast('No tasks to clear', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
        updateTaskCount();
        showToast('All tasks cleared', 'warning');
    }
}

// Filter tasks based on search input
function filterTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm)
    );
    renderTasks(filteredTasks);
}

// Update task counter
function updateTaskCount() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    if (totalTasks === 0) {
        taskCount.textContent = 'No tasks';
    } else if (completedTasks === totalTasks) {
        taskCount.textContent = `All ${totalTasks} tasks completed!`;
    } else {
        taskCount.textContent = `${completedTasks} of ${totalTasks} tasks completed`;
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Format date for display
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    
    // Format time (HH:MM:SS AM/PM)
    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Format date (Weekday, Month Day, Year)
    const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    timeElement.textContent = time;
    dateElement.textContent = date;
}

// Show toast notification
function showToast(message, type) {
    toast.textContent = message;
    toast.className = 'toast show';
    toast.classList.add(type);
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);