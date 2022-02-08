export default class ToDoItem {
    constructor() {
        this._id = null;
        this._item = null;
    }

    getID() {
        return this._id;
    }

    setID(newId) {
        this._id = newId;
    }

    getItem() {
        return this._item;
    }

    setItem(newItem) {
        this._item = newItem;
    }
}
