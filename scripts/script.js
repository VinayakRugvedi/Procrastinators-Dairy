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

function useContent () {
  var taskEntered = document.querySelector('input')
  if (taskEntered.value.length !== 0) {
    var dataOfTask = {}
    dataOfTask.name = taskEntered.value
    dataOfTask.notes = ''
    toDoTasksArray.push(dataOfTask)
    localStorage.setItem('toDoTasks', JSON.stringify(toDoTasksArray))
    taskEntered.value = ''
    buildContent(dataOfTask, document.querySelector('.addedTaskContainer'))
  }
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
  console.log('clicked')
  console.log(this)
  var editContent = this.parentNode.children[0]
  var color = editContent.style.backgroundColor
  editContent.removeAttribute('disabled')
  editContent.style.backgroundColor = 'rgba(243, 11, 135, 0.3)'
  this.removeEventListener('click', editTask)
  this.textContent = '\u{0270C}'
  this.addEventListener('click', completeEditing => {
    this.parentNode.children[0].setAttribute('disabled', 'edited')
    this.parentNode.children[0].style.backgroundColor = color
    this.textContent = '\u270E'
    this.removeEventListener('click', completeEditing)
    this.addEventListener('click', editTask)
  })
}

function addNotes () {
  this.textContent = '\u{0270C}'
  console.log(this.parentNode.children[5])
  this.parentNode.children[5].style.display = null
  this.removeEventListener('click', addNotes)
  this.addEventListener('click', closeNotes => {
    this.parentNode.children[5].style.display = 'none'
    this.textContent = '\u{1f4dd}'
    this.removeEventListener('click', closeNotes)
    this.addEventListener('click', addNotes)
  })
}

function moveToCompletedTasks () {
  console.log(this, 'the object complete')
  console.log(this.parentNode)
  var parent = this.parentNode
  parent.children[3].textContent = '\u{21B0}'
  parent.children[3].removeEventListener('click', moveToCompletedTasks)
  parent.children[3].addEventListener('click', backToDo)
  parent.parentNode.removeChild(parent)
  var completedTasks = document.querySelector('.completedTaskContainer')
  completedTasks.appendChild(parent)
}

function backToDo () {
  var parent = this.parentNode
  parent.children[3].textContent = '\u2714'
  parent.children[3].removeEventListener('click', backToDo)
  parent.children[3].addEventListener('click', moveToCompletedTasks)
  var mainContainer = document.querySelector('.addedTaskContainer')
  mainContainer.appendChild(parent)
}

function deleteTask () {
  this.parentNode.parentNode.removeChild(this.parentNode)
}
