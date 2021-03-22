const renderTodoCard = todo => `
    <div class="card todo-card searchable mb-2" data-todo-id="${todo.id}" data-todo-title="${todo.title}" data-todo-description="${todo.description}">
      <button type="button" class="delete align-self-end" style="border: none; background-color: transparent;"><img src="icon-x.svg"></button>
      <div class="card-body pt-0">
        <form class="todo-form" action="/todo/${todo.id}">
          <div class="mb-3">
            <label for="title-${todo.id}" class="form-label">Title</label>
            <input type="text" class="form-control" id="title-${todo.id}" name="title" value="${todo.title}" required>
          </div>
          <div class="mb-3">
            <label for="description-${todo.id}" class="form-label">Description</label>
            <textarea class="form-control" id="description-${todo.id}" name="description" rows="4">${todo.description}</textarea>
          </div>
          <div class="form-button-wrapper" style="display: none;">
            <button type="submit" class="btn btn-primary">Update</button>
            <button type="reset" class="btn btn-secondary">Reset</button>
          </div>
        </form>
      </div>
    </div>
`;

window.onload = () => {
    // ~~~~~~~~~~~~~~~~
    // ~~ searchTool ~~
    // ~~~~~~~~~~~~~~~~
    const searchTool = document.getElementById('search-tool');
    const searchToolInput = searchTool.querySelector('input');
    const searchToolResetButton = searchTool.querySelector('button[type="reset"]');

    searchToolInput.addEventListener('input', function() {
        const searchables = document.getElementsByClassName('searchable');
        if (!searchables.length) { // nothing to search
            return;
        }
        const searchValue = this.value.toLowerCase();
        // filter searchables
        let searchableValue;
        for (let searchable of searchables) {
            searchableValue = Object.values(searchable.dataset).join('\n').toLowerCase();
            if (!(searchableValue.includes(searchValue))) { // hide non-matches
                searchable.style.display = 'none';
                continue;
            }
            // show matches
            searchable.style.display = null;
        }
    });

    searchToolResetButton.addEventListener('click', () => {
        searchToolInput.value = null;
        searchToolInput.dispatchEvent(new Event('input'));
    });

    // ~~~~~~~~~~~~~
    // ~~ newTodo ~~
    // ~~~~~~~~~~~~~
    const newTodoForm = document.getElementById('new-todo-form');
    const todoContainer = document.getElementById('todo-container');
    const newTodoCollapseButton = document.getElementById('new-todo-collapse-button');

    newTodoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const request = new XMLHttpRequest();
        request.responseType = 'json';
        request.onreadystatechange = function() {
            if (this.readyState !== 4) {
              return;
            }
            if (this.status !== 201) {
              console.error(this);
              return;
            }
            todoContainer.insertAdjacentHTML('beforeend', renderTodoCard(this.response));
            newTodoCollapseButton.dispatchEvent(new Event('click'));
            newTodoForm.reset();
        }
        request.open(this.method, this.action);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(Object.fromEntries(new FormData(this))));
    });

    // ~~~~~~~~~~~~~~~
    // ~~ todoCards ~~
    // ~~~~~~~~~~~~~~~
    const setTodoCardHandlers = todoCard => {
        const todoForm = todoCard.querySelector('form.todo-form');
        const formButtonWrapper = todoForm.querySelector('div.form-button-wrapper');

        todoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const request = new XMLHttpRequest();
            request.responseType = 'json';
            request.onreadystatechange = function() {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.status !== 200) {
                    console.error(this);
                    return;
                }
                todoCard.outerHTML = renderTodoCard(this.response);
            }
            request.open('PUT', this.action);
            request.setRequestHeader('Content-type', 'application/json');
            request.send(JSON.stringify(Object.fromEntries(new FormData(this))));
        });

        todoForm.addEventListener('input', () => {
            formButtonWrapper.style.display = null;
        });

        todoForm.addEventListener('reset', () => {
            formButtonWrapper.style.display = 'none';
        });

        todoCard.querySelector('button.delete').addEventListener('click', () => {
            const response = window.confirm(`Delete Todo ${todoCard.dataset.todoId}?`);
            if (!response) {
                return;
            }
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState !== 2) {
                    return;
                }
                if (this.status !== 204) {
                    console.error(this);
                    return;
                }
                todoCard.remove();
            }
            request.open('DELETE', todoForm.action);
            request.send();
        });
    }

    const todoCards = todoContainer.querySelectorAll('div.todo-card');
    if (todoCards.length) {
        for (let todoCard of todoCards) {
            setTodoCardHandlers(todoCard);
        }
    }

    const todoContainerObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (!mutation.addedNodes.length) {
                return;
            }
            for (let addedNode of mutation.addedNodes) {
                if (addedNode.nodeType !== 1) {
                    continue;
                }
                setTodoCardHandlers(addedNode);
            }
        });
    });
    todoContainerObserver.observe(todoContainer, {childList: true});
}