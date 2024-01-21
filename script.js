document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-task-btn');
    const inputField = document.getElementById('new-task');
    const tasksList = document.getElementById('tasks-list');
    let draggedItem = null;

    addButton.addEventListener('click', () => {
        addTask(inputField.value);
        inputField.value = '';
    });

    inputField.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            addTask(inputField.value);
            inputField.value = '';
        }
    });

    function addTask(taskContent) {
        if (taskContent.trim() === '') return;

        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.draggable = true;
        taskItem.innerHTML = `
            <span class="task-content">${taskContent}</span>
            <span class="remove-task">×</span>
        `;

        const removeBtn = taskItem.querySelector('.remove-task');
        removeBtn.addEventListener('click', () => {
            taskItem.remove();
        });

        taskItem.addEventListener('dragstart', (e) => {
            draggedItem = taskItem;
            setTimeout(() => {
                taskItem.classList.add('hide');
                taskItem.classList.add('dragging');
            }, 0);
        });

        taskItem.addEventListener('dragend', () => {
            setTimeout(() => {
                draggedItem.classList.remove('hide');
                draggedItem.classList.remove('dragging');
            }, 0);
        });

        tasksList.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        tasksList.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.target.className === 'task-item') {
                const afterElement = getDragAfterElement(tasksList, e.clientY);
                if (afterElement == null) {
                    tasksList.appendChild(draggedItem);
                } else {
                    tasksList.insertBefore(draggedItem, afterElement);
                }
            }
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.task-item:not(.hide)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        tasksList.appendChild(taskItem);
    }
});
