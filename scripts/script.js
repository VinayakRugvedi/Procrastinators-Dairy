var toDoTasksArray = localStorage.getItem('toDoTasks') ? JSON.parse(localStorage.getItem('toDoTasks')) : []
var completedTasksArray = localStorage.getItem('completedTasks') ? JSON.parse(localStorage.getItem('completedTasks')) : []

toDoTasksArray.forEach(item => {
  console.log(item, 'todo')
  buildContent(item, document.querySelector('.addedTaskContainer'))
})

completedTasksArray.forEach(item => {
  console.log(item, 'completed')
  buildContent(item, document.querySelector('.completedTaskContainer'))
})

// To handle the modal window
var closer = document.querySelector('.close')
closer.addEventListener('click', closeIt => {
  var toBeClosed = document.querySelector('.modalWindow')
  console.log(toBeClosed)
  toBeClosed.style.display = 'none'
})

var taskAddButton = document.querySelector('.taskAddButton')
taskAddButton.addEventListener('click', useContent)
var taskEntered = document.querySelector('.taskAddSpace')
taskEntered.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    useContent()
  }
})

function useContent () {
  if (taskEntered.value.length !== 0 && sameTaskValidation()) {
    var dataOfTask = {}
    dataOfTask.name = taskEntered.value
    dataOfTask.notes = ''
    toDoTasksArray.push(dataOfTask)
    localStorage.setItem('toDoTasks', JSON.stringify(toDoTasksArray))
    taskEntered.value = ''
    buildContent(dataOfTask, document.querySelector('.addedTaskContainer'))
  }
}

function sameTaskValidation() {
  for(let obj of toDoTasksArray) {
    if(obj.name === taskEntered.value) {
      console.log("This task already exists")
      document.querySelector('.alertbg').style.display = 'flex'
      var closer = document.querySelector('.closeAlert')
      closer.addEventListener('click', () => {
        var toBeClosed = document.querySelector('.alertbg')
        console.log(toBeClosed)
        toBeClosed.style.display = 'none'
      })
      return false
    }
  }
  return true;
}

function buildContent (item, mainContainer) {
  console.log(item, 'item')
  var container = document.createElement('div')
  var addedTask = document.createElement('input')
  var editButton = document.createElement('button')
  var deleteButton = document.createElement('button')
  var switchButton = document.createElement('button')
  var notesButton = document.createElement('button')
  var notes = document.createElement('textarea')

  var className = mainContainer.getAttribute('class')

  notes.setAttribute('placeholder', 'Your notes...')
  notes.style.display = 'none'

  addedTask.setAttribute('type', 'text')
  addedTask.setAttribute('disabled', '')

  addedTask.setAttribute('class', 'addedTaskContent')
  addedTask.value = item.name
  notes.value = item.notes

  editButton.textContent = '\u270E'
  deleteButton.textContent = '\u2716'
  notesButton.textContent = '\u{1f4dd}'

  if(className === 'addedTaskContainer') {
    switchButton.textContent = '\u2714'
    switchButton.addEventListener('click', moveToCompletedTasks)
  }
  else {
    switchButton.textContent = '\u{21B0}'
    switchButton.addEventListener('click', backToDo)
  }
  editButton.setAttribute('class', 'editButton')
  deleteButton.setAttribute('class', 'deleteButton')
  switchButton.setAttribute('class', 'switchButton')
  notesButton.setAttribute('class', 'notesButton')

  container.style.position = 'relative'
  container.appendChild(addedTask)
  container.appendChild(editButton)
  container.appendChild(notesButton)
  container.appendChild(switchButton)
  container.appendChild(deleteButton)
  container.appendChild(notes)

  editButton.addEventListener('click', editTask)
  notesButton.addEventListener('click', addNotes)
  deleteButton.addEventListener('click', deleteTask)
  mainContainer.appendChild(container)
}

function editTask () {
  var editContent = this.parentNode.children[0]
  var color = editContent.style.backgroundColor
  var container = this.parentNode.parentNode.getAttribute('class')
  var array, string, objectInConcern

  if (container === 'addedTaskContainer') {
    array = toDoTasksArray
    string = 'toDoTasks'
  }
  else {
    array = completedTasksArray
    string = 'completedTasks'
  }

  for (let obj of array) {
    if (obj.name === this.parentNode.children[0].value) {
      objectInConcern = obj
      break
    }
  }
  editContent.removeAttribute('disabled')
  editContent.style.backgroundColor = 'rgba(243, 11, 135, 0.3)'
  editContent.style.boxShadow = 'none'
  this.removeEventListener('click', editTask)
  this.textContent = '\u{0270C}'


  this.addEventListener('click', completeEditing => {
    this.parentNode.children[0].setAttribute('disabled', 'edited')
    this.parentNode.children[0].style.backgroundColor = color
    if(container === 'addedTaskContainer'){
    editContent.style.boxShadow = '0 0 15px red'
    }
    this.textContent = '\u270E'
    this.removeEventListener('click', completeEditing)
    this.addEventListener('click', editTask)
    objectInConcern.name = this.parentNode.children[0].value
    localStorage.setItem(string, JSON.stringify(array))
  })
}

function addNotes () {
  this.textContent = '\u{0270C}'
  var container = this.parentNode.parentNode.getAttribute('class')
  var array, string

  if(container === 'addedTaskContainer') {
    array = toDoTasksArray
    string = 'toDoTasks'
  }
  else {
    array = completedTasksArray
    string = 'completedTasks'
  }

  var objectInConcern
  for (let obj of array) {
    if (obj.name === this.parentNode.children[0].value) {
      objectInConcern = obj
      break
    }
  }

  this.parentNode.children[5].style.display = null
  this.removeEventListener('click', addNotes)


  this.addEventListener('click', closeNotes => {
    this.parentNode.children[5].style.display = 'none'
    this.textContent = '\u{1f4dd}'
    this.removeEventListener('click', closeNotes)
    this.addEventListener('click', addNotes)
    objectInConcern.notes = this.parentNode.children[5].value
    localStorage.setItem(string, JSON.stringify(array))
  })
}

function moveToCompletedTasks () {
  var parent = this.parentNode
  parent.children[3].removeEventListener('click', moveToCompletedTasks)
  parent.parentNode.removeChild(parent)

  var objectInConcern
  for (let obj of toDoTasksArray) {
    if (obj.name === parent.children[0].value) {
      objectInConcern = obj
      toDoTasksArray.splice(toDoTasksArray.indexOf(obj), 1)
      completedTasksArray.push(obj)
      localStorage.setItem('completedTasks', JSON.stringify(completedTasksArray))
      localStorage.setItem('toDoTasks', JSON.stringify(toDoTasksArray))
      break
    }
  }
  buildContent(objectInConcern, document.querySelector('.completedTaskContainer'))
}

function backToDo () {
  var parent = this.parentNode

  parent.children[3].removeEventListener('click', backToDo)
  parent.parentNode.removeChild(parent)
  var objectInConcern
  for (let obj of completedTasksArray) {
    if (obj.name === parent.children[0].value) {
      objectInConcern = obj
      completedTasksArray.splice(completedTasksArray.indexOf(obj), 1)
      toDoTasksArray.push(obj)
      localStorage.setItem('completedTasks', JSON.stringify(completedTasksArray))
      localStorage.setItem('toDoTasks', JSON.stringify(toDoTasksArray))
      break
    }
  }
  buildContent(objectInConcern, document.querySelector('.addedTaskContainer'))
}

function deleteTask () {
  var container = this.parentNode.parentNode.getAttribute('class')
  this.parentNode.parentNode.removeChild(this.parentNode)

  var array, string
  if (container === 'addedTaskContainer') {
    array = toDoTasksArray
    string = 'toDoTasks'
  }
  else {
    array = completedTasksArray
    string = 'completedTasks'
  }

  for (let obj of array) {
    if( obj.name === this.parentNode.children[0].value) {
      array.splice(array.indexOf(obj), 1)
      localStorage.setItem(string, JSON.stringify(array))
      break
    }
  }
}
