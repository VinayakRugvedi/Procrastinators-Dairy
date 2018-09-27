console.log('coming')
var closer = document.querySelector('.close')
closer.addEventListener('click', closeIt => {
  var toBeClosed = document.querySelector('.startImg')
  toBeClosed.parentNode.removeChild(toBeClosed)
})

var taskAddButton = document.querySelector('.taskAddButton')
taskAddButton.addEventListener('click', useContent)
function useContent () {
  var taskEntered = document.querySelector('input')
  if (taskEntered.value.length !== 0) {
    var container = document.createElement('div')
    var addedTask = document.createElement('input')
    var editButton = document.createElement('button')
    var deleteButton = document.createElement('button')
    var completeButton = document.createElement('button')
    var notesButton = document.createElement('button')
    var notes = document.createElement('textarea')

    notes.setAttribute('placeholder', 'Your notes...')
    notes.style.display = 'none'

    addedTask.setAttribute('type', 'text')
    addedTask.setAttribute('disabled', '')
    addedTask.value = taskEntered.value
    addedTask.setAttribute('class', 'addedTaskContent')
    taskEntered.value = ''

    editButton.textContent = '\u270E'
    deleteButton.textContent = '\u2716'
    completeButton.textContent = '\u2714'
    notesButton.textContent = '\u{1f4dd}'

    editButton.setAttribute('class', 'editButton')
    deleteButton.setAttribute('class', 'deleteButton')
    completeButton.setAttribute('class', 'completeButton')
    notesButton.setAttribute('class', 'notesButton')

    var mainContainer = document.querySelector('.addedTaskContainer')

    container.style.position = 'relative'
    container.appendChild(addedTask)
    container.appendChild(editButton)
    container.appendChild(notesButton)
    container.appendChild(completeButton)
    container.appendChild(deleteButton)
    container.appendChild(notes)

    editButton.addEventListener('click', editTask)
    notesButton.addEventListener('click', addNotes)
    completeButton.addEventListener('click', moveToCompletedTasks)
    deleteButton.addEventListener('click', deleteTask)

    mainContainer.appendChild(container)
  }
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
