const list_todo = document.querySelector('#my-todo')
const list_done = document.querySelector('#my-done')

const model = {
    // todos: ['Hit the gym', 'Read a book', 'Buy eggs', 'Organize office', 'Pay bills'],
    todos: [],
    dones:[],
    getLocalStorageData(){        
        const localTodos = JSON.parse(localStorage.getItem('todoList')) || []
        const localDones = JSON.parse(localStorage.getItem('doneList')) || []
        this.todos = localTodos
        this.dones = localDones
    },
    setLocalStorageData(){
        localStorage.setItem('todoList',JSON.stringify(this.todos));
        localStorage.setItem('doneList',JSON.stringify(this.dones));
    },
    addItemByTodos(todo){
        this.todos.push(todo)
        this.setLocalStorageData()
    },
    addItemByDones(done){
        this.dones.push(done)
        this.setLocalStorageData()
    },
    removeItemByTodos(text){
        this.todos.splice(this.todos.indexOf(text),1)
        this.setLocalStorageData()
    },
    removeItemByDones(text){
        this.dones.splice(this.dones.indexOf(text),1)
        this.setLocalStorageData()
    }
}

const view = {
    setTodoContent(todo){
        const newItem = document.createElement('li')
        newItem.setAttribute('class','todo__item')
        newItem.innerHTML = `
            <label for="todo">${todo}</label>
            <i class="delete fa fa-trash"></i>
        `
        return newItem
    },
    addTodo(todo){
        list_todo.appendChild(this.setTodoContent(todo))
        this.checkInputButton()
        this.checkListState()
    },
    addDone(todo){
        this.toggleTodo(todo,false)
        this.checkInputButton()
        this.checkListState()
    },
    checkInputButton(value){
        if(!value){
            addBtn.setAttribute('disabled','')
            return
        }
        addBtn.removeAttribute('disabled','')
    },
    toggleTodo(text,done){
        let checked = 'checked'
        let list = list_done
        if(done){
            checked = ''
            list = list_todo
        }
        let item = document.createElement('li')
        item.innerHTML += `
            <label for="todo" class="${checked}">${text}</label>
            <i class="delete fa fa-trash"></i>
        `;
        list.appendChild(item)
        this.checkListState()
    },
    deleteTodo(todo){
        todo.remove()
        this.checkListState()
    },
    checkListState(){
        const tipTodo = document.querySelector('.tip__todo')
        const tipDone = document.querySelector('.tip__done')
        if(model.todos.length === 0){
            tipTodo.classList.add('isshow')
        }else{
            tipTodo.classList.remove('isshow')
        }
        if(model.dones.length === 0){
            tipDone.classList.add('isshow')
        }else{
            tipDone.classList.remove('isshow')
        }
    }

}

const controller = {
    initialList(){
        this.setInputAction()
        this.setTodoAction()
        model.getLocalStorageData()
        for (let todo of model.todos) {
            view.addTodo(todo)
        }
        for (let done of model.dones) {
            view.addDone(done)
        }
        view.checkListState()
    },
    setInputAction(){
        const input = document.querySelector('#newTodo')
        const addBtn = document.querySelector('#addBtn')
        input.addEventListener('keyup', this.getInputValue)
        addBtn.addEventListener('click', ()=> {
            view.addTodo(input.value)
            model.addItemByTodos(input.value)
            input.value = ''
        })
    },
    getInputValue(event){
        let inputVal = event.target.value.trim()
        view.checkInputButton(inputVal.length)
        if(event.keyCode === 13 && inputVal.length){
            model.addItemByTodos(event.target.value)
            view.addTodo(event.target.value)
            this.value = ''
        }
    },
    setTodoAction(){
        list_todo.addEventListener('click', (event)=>{
            this.todoAction(event.target)
        })
        list_done.addEventListener('click', (event)=>{
            const done = true
            this.todoAction(event.target,done)
        })
    },
    todoAction(el,done){
        let text = el.innerHTML
        let li = el.parentNode
        if(el.classList.contains('delete')){
            let text = li.children[0].innerHTML
            if(!done){            
                model.removeItemByTodos(text)
            }else{
                model.removeItemByDones(text)
            }
            view.deleteTodo(li)
        }
        if(el.tagName === 'LABEL'){
            this.judgmentList(text,done)
            view.toggleTodo(text,done)
            view.deleteTodo(li)
        }
    },
    judgmentList(text,done){
        if(!done){            
            model.removeItemByTodos(text)
            model.addItemByDones(text)
        }else{
            model.removeItemByDones(text)
            model.addItemByTodos(text)
        }
    }
}

controller.initialList()



