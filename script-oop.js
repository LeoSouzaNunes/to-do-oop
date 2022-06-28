class Task {
    constructor(id, name, completed) {
        this.id = id;
        this.name = name;
        this.completed = completed;
    }

    getTaskView(boardId) {
        const taskContainer = document.createElement("li");
        taskContainer.classList.add("task");
        taskContainer.dataset.taskId = this.id;
        taskContainer.dataset.boardId = boardId;
        if (this.completed) {
            taskContainer.classList.add("completed");
        }

        const taskCheckbox = document.createElement("input");
        taskCheckbox.id = `checkbox-${this.id}-${Date.now()}`;
        taskCheckbox.classList.add("checkbox");
        taskCheckbox.type = "checkbox";
        taskCheckbox.checked = this.completed;
        taskCheckbox.addEventListener("click", () =>
            onCompleteTask(boardId, this.id)
        );
        taskContainer.appendChild(taskCheckbox);

        const taskName = document.createElement("label");
        taskName.classList.add("task-name");
        taskName.textContent = this.name;
        taskName.htmlFor = taskCheckbox.id;
        taskContainer.appendChild(taskName);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "X";
        deleteButton.addEventListener("click", () =>
            onDeleteTask(boardId, this.id)
        );
        taskContainer.appendChild(deleteButton);

        return taskContainer;
    }
}

class Board {
    constructor(id, title, tasks) {
        this.id = id;
        this.title = title;
        this.tasks = tasks;
    }

    onDeleteTask(taskId) {
        const board = boards.find((board) => board.id === this.id);
        board.tasks = board.tasks.filter((task) => task.id !== taskId);

        const taskContainer = document.querySelector(
            `[data-task-id="${taskId}"][data-board-id="${this.id}"]`
        );
        taskContainer.remove();
    }

    onCompleteTask(taskId) {
        const board = boards.find((board) => board.id === this.id);

        const completedTask = board.tasks.find((task) => task.id === taskId);
        completedTask.completed = !completedTask.completed;

        const taskContainer = document.querySelector(
            `[data-task-id="${taskId}"][data-board-id="${this.id}"]`
        );
        taskContainer.classList.toggle("completed");
    }

    onAddTask(newTaskName) {
        const board = boards.find((board) => board.id === this.id);
        const task = {
            id: getNextTaskId(board.tasks),
            name: newTaskName,
            completed: false,
        };
        board.tasks.push(task);

        const tasksContainer = document.querySelector(
            `[data-board-id="${this.id}"] .tasks`
        );
        const taskContainer = getTaskView(this.id, task);
        tasksContainer.appendChild(taskContainer);
    }

    handleNewTaskInputKeypress(e) {
        if (e.key === "Enter") {
            onAddTask(Number(e.target.dataset.boardId), e.target.value);
            e.target.value = "";
        }
    }

    getBoardView() {
        const boardContainer = document.createElement("div");
        boardContainer.classList.add("board");
        boardContainer.dataset.boardId = this.id;

        const htmlRow = document.createElement("div");
        htmlRow.classList.add("row");

        const duplicateButton = document.createElement("button");
        duplicateButton.classList.add("duplicate-button");
        duplicateButton.textContent = "Duplicate board";
        duplicateButton.addEventListener("click", () => onDuplicateBoard(this));
        htmlRow.appendChild(duplicateButton);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "X";
        deleteButton.addEventListener("click", () => onDeleteBoard(this.id));
        htmlRow.appendChild(deleteButton);

        boardContainer.appendChild(htmlRow);

        const boardTitle = document.createElement("p");
        boardTitle.classList.add("board-title");
        boardTitle.textContent = this.title;
        boardTitle.addEventListener("click", () => onBoardTitleClick(this.id));
        boardContainer.appendChild(boardTitle);

        const tasksContainer = document.createElement("ul");
        tasksContainer.classList.add("tasks");
        boardContainer.appendChild(tasksContainer);

        this.tasks.forEach((task) => {
            const taskContainer = getTaskView(this.id, task);
            tasksContainer.appendChild(taskContainer);
        });

        const newTaskInput = document.createElement("input");
        newTaskInput.dataset.boardId = this.id;
        newTaskInput.classList.add("new-task-input");
        newTaskInput.type = "text";
        newTaskInput.placeholder = "Nova tarefa";
        newTaskInput.addEventListener("keypress", handleNewTaskInputKeypress);
        boardContainer.appendChild(newTaskInput);

        return boardContainer;
    }
}

class Todo {
    onAddBoard(newBoardTitle) {
        const board = {
            id: getNextBoardId(),
            title: newBoardTitle,
            tasks: [],
        };
        boards.push(board);

        const boardsContainer = document.querySelector(".boards");
        const boardContainer = getBoardView(board);
        boardsContainer.appendChild(boardContainer);
    }

    handleNewBoardInputKeypress(e) {
        if (e.key === "Enter") {
            onAddBoard(e.target.value);
            e.target.value = "";
        }
    }

    renderizarBoards(boards) {
        const boardsContainer = document.querySelector(".boards");

        boards.forEach((board) => {
            const boardContainer = getBoardView(board);

            boardsContainer.appendChild(boardContainer);
        });
    }

    onDuplicateBoard(board) {
        const boardsContainer = document.querySelector(".boards");
        const newBoard = structuredClone(board);
        newBoard.id = getNextBoardId();
        newBoard.title = `${newBoard.title} Copy`;

        const boardContainer = getBoardView(newBoard);
        boardsContainer.appendChild(boardContainer);
        boards.push(newBoard);
    }

    onBoardTitleClick(boardId) {
        const newTitle = prompt("Novo titulo do board");
        if (!newTitle) {
            alert("Insira o novo título!");
            return;
        }

        const boardTitleElement = document.querySelector(
            `[data-board-id="${boardId}"] .board-title`
        );
        boardTitleElement.textContent = newTitle;
    }

    onDeleteBoard(boardId) {
        boards = boards.filter((board) => board.id !== boardId);

        const boardContainer = document.querySelector(
            `[data-board-id="${boardId}"]`
        );
        boardContainer.remove();
    }

    onAddBoard(newBoardTitle) {
        const board = {
            id: getNextBoardId(),
            title: newBoardTitle,
            tasks: [],
        };
        boards.push(board);

        const boardsContainer = document.querySelector(".boards");
        const boardContainer = getBoardView(board);
        boardsContainer.appendChild(boardContainer);
    }
}
