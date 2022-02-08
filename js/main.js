import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

const toDoList = new ToDoList();

// Launch app
document.addEventListener("readystatechange", event => {
    if (event.target.readyState === "complete") {
        initApp();
    }
});

const initApp = () => {
    // Add listeners
    const itemEntryForm = document.getElementById("item-entry-form");
    itemEntryForm.addEventListener("submit", event => {
        event.preventDefault();
        processSubmission();
    });

    const clearItems = document.getElementById('clearItems');
    clearItems.addEventListener("click", event => {
        const list = toDoList.getList();
        if (list.length ) {
            const confirmed = confirm("Are you sure you want to clear the list?");
            if (confirmed) {
                toDoList.clearList();
                updatePersistentData(toDoList.getList());
                refreshPage();
            }
        }
    })

    // Procedural
    // Load list object
    loadListObject();
    // refresh page
    refreshPage();
}

const loadListObject = () => {
    const storedList = localStorage.getItem("todo-list");
    if (typeof storedList !== 'string') {
        return;
    }
    const parsedList = JSON.parse(storedList);
    parsedList.forEach(itemObj => {
        const newToDoItem = createNewItem(itemObj._id, itemObj._item);
        toDoList.addItemToList(newToDoItem);
    })
}

const refreshPage = () => {
    clearListDisplay();
    renderList();
    addConfirmationP();
    clearItemEntryField();
    setFocusOnItemEntryField();
}

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");
    deleteContents(parentElement);
}

const deleteContents = list => {
    let child = list.lastElementChild;
    while (child) {
        list.removeChild(child);
        child = list.lastElementChild;
    }
}

const renderList = () => {
    const list = toDoList.getList();
    list.forEach(item => {
        buildListItem(item);
    });
}

const addConfirmationP = () => {
    const paragraph = document.createElement("p");
    paragraph.className = "confirmation";
    paragraph.id = "confirmation";
    document.getElementById("listItems").appendChild(paragraph);
}

const buildListItem = listItem => {
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = listItem.getID();
    check.tabIndex = 0;
    addClickListenerToCheckbox(check);
    const label = document.createElement("label");
    label.htmlFor = listItem.getID();
    label.textContent = listItem.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItems");
    container.appendChild(div);
}

const addClickListenerToCheckbox = checkbox => {
    checkbox.addEventListener("click", event => {
        toDoList.removeItemFromList(checkbox.id);
        updatePersistentData(toDoList.getList());
        const removedText = getLabelTextByID(checkbox.id);
        updateScreenReaderConfirmation(removedText, "completed");
        setTimeout(() => {
            refreshPage();
        }, 5000);
    });
}

const getLabelTextByID = checkboxID => {
    return document.getElementById(checkboxID).nextElementSibling.textContent;
}

const updatePersistentData = listArray => {
    localStorage.setItem("todo-list", JSON.stringify(listArray));
}

const clearItemEntryField = () => {
    document.getElementById("newItem").value = "";
}

const setFocusOnItemEntryField = () => {
    document.getElementById("newItem").focus();
}

const processSubmission = () => {
    const newItemEntryText = getNewEntry();
    if (!newItemEntryText.length) {
        return;
    }
    const nextItemId = calcNextItemId();
    const newItem = createNewItem(nextItemId, newItemEntryText);
    toDoList.addItemToList(newItem);
    updatePersistentData(toDoList.getList());
    updateScreenReaderConfirmation(newItemEntryText, "added");
    refreshPage();
}

const getNewEntry = () => {
    return document.getElementById('newItem').value.trim();
}

const calcNextItemId = () => {
    let nextId = 1;
    const list = toDoList.getList();
    if (list.length > 0) {
        nextId = list[list.length - 1].getID() + 1;
    }
    return nextId;
}

const createNewItem = (id, text) => {
    const todo = new ToDoItem();
    todo.setID(id);
    todo.setItem(text);
    return todo;
}

const updateScreenReaderConfirmation = (newText, actionVerb) => {
    document.getElementById("confirmation").textContent = `${newText} ${actionVerb}.`;
}
