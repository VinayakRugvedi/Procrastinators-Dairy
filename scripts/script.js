var toDoTasksArray = localStorage.getItem('toDoTasks') ? JSON.parse(localStorage.getItem('toDoTasks')) : []
var completedTasksArray = localStorage.getItem('completedTasks') ? JSON.parse(localStorage.getItem('completedTasks')) : []

toDoTasksArray.forEach(item => {
  buildContent(item, document.querySelector('.addedTaskContainer'))
})

completedTasksArray.forEach(item => {
  buildContent(item, document.querySelector('.completedTaskContainer'))
})

function buildContent (item, mainContainer) {
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

  if (className === 'addedTaskContainer') {
    switchButton.textContent = '\u2714'
    switchButton.addEventListener('click', moveToCompletedTasks)

    var criticalTask = document.createElement('a')
    criticalTask.setAttribute('class', 'topPriority')
    criticalTask.setAttribute('href', '#')
    criticalTask.textContent = '\u2605'

    if (item.priority === 1) {
      criticalTask.setAttribute('title', 'Marked as Top Priority task')
      criticalTask.style.color = 'yellow'
    } else {
      criticalTask.setAttribute('title', 'Mark as Critical Task - Top Priority')
      criticalTask.style.color = 'white'
    }
  } else {
    switchButton.textContent = '\u{21B0}'
    switchButton.addEventListener('click', backToDo)
  }
  editButton.setAttribute('class', 'editButton')
  deleteButton.setAttribute('class', 'deleteButton')
  switchButton.setAttribute('class', 'switchButton')
  notesButton.setAttribute('class', 'notesButton')

  container.style.position = 'relative'
  container.style.paddingLeft = '5px'

  container.appendChild(addedTask)
  container.appendChild(editButton)
  container.appendChild(notesButton)
  container.appendChild(switchButton)
  container.appendChild(deleteButton)
  container.appendChild(notes)

  if (className === 'addedTaskContainer') {
    container.appendChild(criticalTask)
    if (item.priority === 1) {
      criticalTask.parentNode.setAttribute('class', 'impTask')
      criticalTask.addEventListener('click', normalTask)
    } else {
      criticalTask.addEventListener('click', markTaskAsImp)
    }
  }

  editButton.addEventListener('click', editTask)
  notesButton.addEventListener('click', addNotes)
  deleteButton.addEventListener('click', deleteTask)
  mainContainer.appendChild(container)
}

// To handle the modal window
var closer = document.querySelector('.close')
closer.addEventListener('click', () => {
  var toBeClosed = document.querySelector('.modalWindow')
  toBeClosed.style.display = 'none'
})

// Creation of new tasks
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

function sameTaskValidation () {
  for (let obj of toDoTasksArray) {
    if (obj.name === taskEntered.value) {
      document.querySelector('.alertbg').style.display = 'flex'
      var closer = document.querySelector('.closeAlert')
      closer.addEventListener('click', () => {
        var toBeClosed = document.querySelector('.alertbg')
        toBeClosed.style.display = 'none'
      })
      return false
    }
  }
  return true
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
    if (container === 'addedTaskContainer') {
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

  if (container === 'addedTaskContainer') {
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
      obj.priority = 0 // No priorities are retained
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
  } else {
    array = completedTasksArray
    string = 'completedTasks'
  }

  for (let obj of array) {
    if ( obj.name === this.parentNode.children[0].value) {
      array.splice(array.indexOf(obj), 1)
      localStorage.setItem(string, JSON.stringify(array))
      break
    }
  }
}

function markTaskAsImp () {
  var taskToBeMarked = this.parentNode
  var container = taskToBeMarked.parentNode
  this.style.color = 'yellow'
  this.setAttribute('title', 'Marked as Top Priority task')
  taskToBeMarked.setAttribute('class', 'impTask')
  var objectInConcern
  for (let obj of toDoTasksArray) {
    if (obj.name === this.parentNode.children[0].value) {
      objectInConcern = obj
      obj.priority = 1
      toDoTasksArray.splice(toDoTasksArray.indexOf(obj), 1)
      toDoTasksArray.unshift(obj)
      localStorage.setItem('toDoTasks', JSON.stringify(toDoTasksArray))
      break
    }
  }
  // Removing this task from the normal flow
  taskToBeMarked.parentNode.removeChild(taskToBeMarked)
  // And adding it to the top
  container.insertBefore(taskToBeMarked, container.children[1])
  this.removeEventListener('click', markTaskAsImp)
  this.addEventListener('click', normalTask)
}

function normalTask () {
  var taskContainer = this.parentNode
  var container = taskContainer.parentNode
  this.style.color = 'white'
  this.setAttribute('title', 'Mark as Critical Task - Top Priority')
  let count = 0
  for (let task of toDoTasksArray) {
    if (task.priority === 1) {
      count++
    } else {
      break
    }
  }
  for (let obj of toDoTasksArray) {
    if (obj.name === this.parentNode.children[0].value) {
      obj.priority = 0
      toDoTasksArray.splice(toDoTasksArray.indexOf(obj), 1)
      toDoTasksArray.splice(count - 1, 0, obj)
      localStorage.setItem('toDoTasks', JSON.stringify(toDoTasksArray))
      break
    }
  }
  this.parentNode.removeAttribute('class')
  taskContainer.parentNode.removeChild(taskContainer)
  container.insertBefore(taskContainer, container.children[count])
  this.removeEventListener('click', normalTask)
  this.addEventListener('click', markTaskAsImp)
}
