
const charactersDiv = document.querySelector('.characters-container'),
charList = document.querySelector('.characters-list'),
charOptions = document.querySelector('.character-options'),
rightWrapper = document.querySelector('.right-wrapper')
const newBtn = document.querySelector('#new-character')
var charId = null,
gridStart = 0
const blankData = {
  user_id: null,
  name: '',
  class: {
    class_0: {
      name: '',
      lvl: null
    },
    class_1: {
      name: '',
      lvl: null
    }
  },
  experience: null,
  background: '',
  race: '',
  alignment: '',
  stats: {
    str: {
      base: null,
      save: false
    },
    dex: {
      base: null,
      save: false
    },
    con: {
      base: null,
      save: false
    },
    int: {
      base: null,
      save: false
    },
    wis: {
      base: null,
      save: false
    },
    cha: {
      base: null,
      save: false
    }
  },
  speed: null,
  inspiration: null,
  hp: { current: null, max: null, temp: null, hit_dice: ''},
  death_saves: { pass: 0, fail: 0},
  proficiency_bonus: null,
  skills: {
    acrobatics: false,
    animal_handling: false,
    athletics: false,
    deception: false,
    history: false,
    insight: false,
    intimidation: false,
    investigation: false,
    medicine: false,
    nature: false,
    perception: false,
    performance: false,
    persuasion: false,
    religion: false,
    sleight_of_hand: false,
    stealth: false,
    survival: false
  },
  equipment: {},
  spells: {},
  abilities: {
    tags: ['active', 'passive'],
    list: []
  },
}
let charData = blankData,
aseTabs,
aseWrapper

// Creates a new blank character sheet
newBtn.addEventListener('click', async () => {
  // 'Clears' any previously opened character's data
  charData = blankData
  getBlank()
})
// Saves changes to an existing charcter in the data base,
// or it creates a new character if no matching ID is found
const saveBtn = document.createElement('button')
saveBtn.innerHTML = 'Save'
saveBtn.id = 'save'
saveBtn.className = 'character-options'
saveBtn.addEventListener('click', async () => {
  charData.user_id = userData.id
  const bodyData = {id: charId, data: charData}

  const response = await fetch('/character/save', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  })
  const resData = await response.json()
  console.log(resData.message)
  if (response.ok != true) {

  } else if (resData.id == 0) {
    // Gives the created character the ID generated for the 
    // new character
    charId = resData.data
  }
})
// Gives the user back their list of characters
const closeBtn = document.createElement('button')
closeBtn.innerHTML = 'Close'
closeBtn.id = 'close'
closeBtn.className = 'character-options'
closeBtn.addEventListener('click', async () =>{
  charactersDiv.replaceChildren(charList)
  charOptions.replaceChildren()
  rightWrapper.replaceChildren()
  fillGrid(userData.id)
})
/* 
  Opens a menu where they choose to either commit to 
  deleting the character or back out to the character sheet
*/
const deleteBtn = document.createElement('button')
deleteBtn.innerHTML = 'Delete'
deleteBtn.id = 'deleteBtn'
deleteBtn.className = 'character-options delete'
deleteBtn.addEventListener('click', async () => {
  const deleteConfirmation = document.createElement('div')
  deleteConfirmation.innerHTML = `
  <p>Are you Sure? Don't delete your character just because they died</p>
  <div class='flex-container'>
    <button class='character-options' id='deleteCancel'>
      No, go back
    </button>
    <button class='character-options delete' id='deleteConfirm'>
      Delete this character
    </button>
  </div>`
  deleteConfirmation.className = 'delete-confirmation'
  charOptions.appendChild(deleteConfirmation)
  // Locking the sheet from scrolling
  charactersDiv.setAttribute('style', 'overflow: hidden;')
  const cancelBtn = document.querySelector('#deleteCancel')
  cancelBtn.addEventListener('click', () => {
    deleteConfirmation.remove()
    charactersDiv.removeAttribute('style')
  })
  const confirmBtn = document.querySelector('#deleteConfirm')
  confirmBtn.addEventListener('click', async () => {
    const response = await fetch(`/character/delete/${charData.id}`, { method: 'GET'})
    const resData = await response.json()

    deleteConfirmation.remove()
    charactersDiv.removeAttribute('style')
    charactersDiv.replaceChildren(charList)
    charOptions.replaceChildren()
    fillGrid(userData.id)

    rightWrapper.replaceChildren()
  })
})
/* 
  Fetches the blank sheet element from the server and appends
  character option buttons 
*/
async function getBlank () {
  const sheetResponse = await fetch('/character/blank', {
    method: 'GET',
    headers: {
      'content-type': 'text/xml'
    }
  })
  const sheetData = await sheetResponse.text()
  const charSheet = document.createElement('div')
  charSheet.innerHTML = sheetData
  charactersDiv.replaceChildren(charSheet)

  // Gets the Abilities, Spells, and Equipment parts of the character
  const aseResponse = await fetch('/character/blankASE', {
    method: 'GET',
    headers: {'content-type': 'text/html'}
  })
  const aseData = await aseResponse.text()
  const aseDiv = document.createElement('div')
  aseDiv.innerHTML = aseData
  rightWrapper.replaceChildren(aseDiv)
  // Handles the Tabs to select which part to see
  aseTabs = aseDiv.querySelectorAll('.tab')
  aseWrapper = aseDiv.querySelector('.ase-wrapper')
  aseTabArray = Array.from(aseTabs)
  aseTabArray.forEach((thing, i) => {
    aseTabs[i].addEventListener('click', () => aseTabSelector(aseTabs[i]))
  })

  addAbilityButtons = aseWrapper.querySelectorAll('button.new[data-id="abilities"]')
  let addAbilityArray = Array.from(addAbilityButtons)
  addAbilityArray.forEach((thing, i) => {
    addAbilityButtons[i].addEventListener('click', async () => {
      const form = await addAbilityForm()
      addAbilityButtons[i].insertAdjacentElement('afterend', form)
      const addBtn = form.querySelector('#add'),
      cancelBtn = form.querySelector('#cancel')
      addBtn.addEventListener('click', () => {addAbility(formDiv)})
      cancelBtn.addEventListener('click', () => {
        form.remove()
      })
    })
  })

  const abilityTags = charData.abilities.tags
  const tagDiv = aseWrapper.querySelector('.abilities .tag-list')
  const abilityList = aseWrapper.querySelector('.abilities .list')
  abilityTags.forEach((thing, i) => {
    const tagChip = document.createElement('p')
    tagChip.className = 'tagChip'
    tagChip.innerHTML = `${charData.abilities.tags[i]}`
    tagChip.setAttribute('data-selected', 'false')
    tagChip.addEventListener('click', () => {
      if (tagChip.getAttribute('data-selected') == 'false') {
        tagChip.setAttribute('data-selected', 'true')
        tagChip.setAttribute('style', 'background-color: var(--green); border-color: var(--green); color: var(--dark)')
        abilityList.replaceChildren()
        showAbilities()
        return
      }
      tagChip.setAttribute('data-selected', 'false')
      tagChip.removeAttribute('style')
      abilityList.replaceChildren()
      showAbilities()
    })
    tagDiv.appendChild(tagChip)
  })

  findInputs()
  showAbilities()

  charOptions.appendChild(saveBtn)
  charOptions.appendChild(closeBtn)
  charOptions.appendChild(deleteBtn)
}
/*
  finds all of the input elements in the sheet and adds event
  listeners that modify the corrisponding property in the
  charData object. If the user is opening a character sheet to
  edit, this function also changes the values of the inputs to
  show the pre-existing data
*/
function findInputs () {
  const sheet = charactersDiv.querySelector('.sheet')

  const chrName = sheet.querySelector('.character-name')
  if (charData.name !== '') {
    chrName.innerText = `${charData.name}`
  }
  chrName.addEventListener('input', () => {
    charData.name = chrName.innerText
  })

  const inputs = sheet.querySelectorAll('input')
  const inputsArray = Array.from(inputs)
  inputsArray.forEach((thing, i) => {
    if (inputs[i].id !== ''){
      // Checks if the character has something stored for the 
      // corrisponding input
      if (gPropByString(charData, inputs[i].id) != null || '') {
        inputs[i].setAttribute(
          'value',
          `${gPropByString(charData, inputs[i].id)}`
        )
        if (inputs[i].id.includes('.base')) {
          // Calculates modifier for that stat and adds it to
          // dependent elements
          updateModDep(inputs[i])
        }
        if (inputs[i].id.includes('proficiency_bonus')) {
          // Adds proficiency bonus to dependent elements
          charData.proficiency_bonus = parseInt(charData.proficiency_bonus, 10)
          var oldVal = charData.proficiency_bonus
          if (oldVal == null) {oldVal = 0}
          updateProfDep(oldVal, inputs[i].value)
        }
        if (inputs[i].id.includes('skills')) {
          // Changes wether or not the character is proficient
          changeSkillProf(inputs[i])
        }
      }
      if (inputs[i].getAttribute('type') !== "button") {
        inputs[i].addEventListener('change', () => {
          if (inputs[i].getAttribute('type') !== "number") {
            ePropByString(charData, inputs[i].id, inputs[i].value)
          } else {
            ePropByString(charData, inputs[i].id, parseInt(inputs[i].value, 10))
          }
          if (inputs[i].id.includes('.base')) {
            updateModDep(inputs[i])
          }
          if (inputs[i].id.includes('proficiency_bonus')) {
            charData.proficiency_bonus = parseInt(charData.proficiency_bonus, 10)
            var oldVal = charData.proficiency_bonus
            if (oldVal == null) {oldVal = 0}
            updateProfDep(oldVal, inputs[i].value)
          }
        })
      } else {
        inputs[i].addEventListener('click', () =>{
          if (inputs[i].value == 'false') {
            inputs[i].setAttribute('value', 'true')
            if (inputs[i].id == "death_saves['fail']" || "death_saves['pass']") {
              ePropByString(charData, inputs[i].id,
                gPropByString(charData, inputs[i].id) + 1)
            }
          } else {
            inputs[i].setAttribute('value', 'false')
            if (inputs[i].id == "death_saves['fail']" || "death_saves['pass']") {
              ePropByString(charData, inputs[i].id,
                gPropByString(charData, inputs[i].id) - 1)
            }
          }
          ePropByString(charData, inputs[i].id, inputs[i].value)
          if (inputs[i].id.includes('skills')) {
            changeSkillProf(inputs[i])
          }
        })
      }
    }
  })
}
/*
  Will find the nested property of an object when given a string
  of properties using dot notation i.e 'orange.peel.zest'.

  written by RobG on stack overflow at:
  https://stackoverflow.com/questions/6906108/in-javascript-how-can-i-dynamically-get-a-nested-property-of-an-object/6906859#6906859
*/
function gPropByString(obj, propString) {
  if (!propString)
    return obj;

  var prop, props = propString.split('.');

  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];

    var candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
}
function ePropByString(obj, propString, newValue) {
  if (!propString)
    return obj

  var prop, props = propString.split('.')

  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i]

    var candidate = obj[prop]
    if (candidate !== undefined) {
      obj = candidate
    } else {
      break
    }
  }
  obj[props[i]] = newValue
  return obj[props[i]]
}
// Updates all elements that are dependent on a stat modifier
function updateModDep(inputEle) {
  const sheet = charactersDiv.querySelector('.sheet')

  const mod = inputEle.id.split('.')[1]
  const modVal = modCalc(inputEle.value)
  const depEle = sheet.querySelectorAll(`.${mod}-mod`)
  const depArray = Array.from(depEle)
  const oldVal = parseInt(
    sheet.querySelector(`.${mod} p.${mod}-mod`).innerText, 10)
  depArray.forEach((thing, i) => {
    var newVal = parseInt(depEle[i].innerText, 10)
    newVal = newVal - oldVal
    newVal = newVal + modVal
    depEle[i].innerText = `${newVal}`
  })
}
// Updates all elements dependent on the proficiency bonus
function updateProfDep(oldVal, currentVal) {
  const depEle = document.querySelectorAll('.prof-dep')
  const depArray = Array.from(depEle)
  depArray.forEach((thing, i) => {
    const newVal = parseInt(depEle[i].innerText, 10) - oldVal + currentVal
    depEle[i].innerText = `${newVal}`
  })
}
// Adds or subtracts the proficiency bonus from skills
function changeSkillProf(inputEle) {
  const sheet = charactersDiv.querySelector('.sheet')
  const skill = inputEle.id.split('.')[1]
  const skillModEle = sheet.querySelector(`.${skill} .mod`).lastElementChild
  if (inputEle.value !== 'false') {
    skillModEle.className += ' prof-dep'
    var newVal = parseInt(skillModEle.innerText,10)
    if (charData.proficiency_bonus == null) {return}
    newVal = newVal + charData.proficiency_bonus
    skillModEle.innerText = `${newVal}`
  } else {
    skillModEle.className = skillModEle.className.replace(' prof-dep', '')
    var newVal = parseInt(skillModEle.innerText, 10)
    newVal = newVal - charData.proficiency_bonus
    skillModEle.innerText = `${newVal}`
  }
}
// Creates a grid filled with characters the user has made
async function fillGrid (user_id) {
  const charGrid = charList.querySelector('.characters-grid')
  charGrid.replaceChildren()
  const response = await fetch(`/character/user/${user_id}.${gridStart}`, {
    method: 'GET'
  })
  const list = await response.json()
  list.forEach((char) => {
    const charEle = document.createElement('div')
    charEle.id = `charId=${char.id}`
    charEle.className = 'char-grid-item'
    let charDetails = `
      <p class='char-name'>${char.name}</p>
      <p class='char-race'>${char.race}</p>
      <p class='char-class'>Lvl ${char.class.class_0.lvl} ${char.class.class_0.name}`
    if (char.class.class_1.lvl !== null) {
      charDetails =+ `<p class='char-class'>Lvl ${char.class.class_1.lvl} ${char.class.class_1.name}`
    }
    charEle.innerHTML = charDetails
    charEle.addEventListener('click', async () => {
      const getCharData = await fetch(`/character/id/${char.id}`, {method: 'GET'})
      charData = await getCharData.json()
      charId = charData.id
      getBlank()
    })
    charGrid.appendChild(charEle)
  })
}
// Changes whether abilities, spells, or equipment is shown
function aseTabSelector (element) {
  const eleId = element.dataset.id
  const eleSelected = element.dataset.selected
  if (eleSelected !== 'true') {
    const oldSelected = rightWrapper.querySelector('button[data-selected="true"')
    const oldId = oldSelected.dataset.id
    const oldShown = aseWrapper.querySelector(`div[data-id="${oldId}"`)
    const eleToShow = aseWrapper.querySelector(`div[data-id="${eleId}"`)
    oldShown.removeAttribute('style')
    oldSelected.dataset.selected = false
    eleToShow.style.display = 'block'
    element.dataset.selected = true
  }
}
// Gets the ability form
async function addAbilityForm () {
  const getForm = await fetch('/character/form/abilityForm.html', {
    method: 'GET',
    headers: {'content-type': 'text/html'}
  })
  const form = await getForm.text()
  formDiv = document.createElement('div')
  formDiv.className = 'form abilities'
  formDiv.innerHTML = form
  
  return formDiv
}
function addAbility(abilityForm, place) {
  let newAbility = {}
  const typeInput = abilityForm.querySelector('#abilityType'),
  nameInput = abilityForm.querySelector('#abilityName'),
  descriptionInput = abilityForm.querySelector('#description'),
  refLinkInput = abilityForm.querySelector('#refrenceLink')
  newAbility.type = typeInput.value
  newAbility.name = nameInput.value
  newAbility.description = descriptionInput.value
  if (refLinkInput.value.length > 0) {
    newAbility.refLink = refLinkInput.value
  } else { newAbility.refLink = null }
  if (! Object.hasOwn(charData.abilities, 'list')) {
    console.log (Object.values(charData.abilities))
    console.log("reformating charData")
    charData.abilities = blankData.abilities
  }
  if (place === undefined) {
    charData.abilities.list.push(newAbility)
    abilityEle = createAbilityEle(newAbility, charData.abilities.list.length - 1)
    aseWrapper.querySelector('.abilities .list').append(abilityEle)
    abilityForm.remove()
  } else {
    charData.abilities.list[place] = newAbility
    abilityEle = createAbilityEle(newAbility, place)
    abilityForm.replaceWith(abilityEle)
  }
}
// Adds abilities to the list
function createAbilityEle (ability, place) {
  const abilityDiv = document.createElement('div'),
  buttonsDiv = document.createElement('div'),
  editBtn = document.createElement('button'),
  deleteAbilityBtn = document.createElement('button'),
  nameString = `<p class="group-header">${ability.name}</p>`,
  typeString = `<p class="tags">${ability.type}</p>`,
  description = `<p>${ability.description}</p>`

  if (ability.refLink != null || "") {
    const refBtn = document.createElement('button')
    refBtn.className = 'reference-button'
    refBtn.addEventListener('click', () => {window.open(`${ability.refLink}`)})
    refBtn.innerHTML = 'Refrence'
    buttonsDiv.appendChild(refBtn)
  }
  editBtn.className = 'edit-ability'
  editBtn.innerHTML = 'Edit'
  editBtn.addEventListener('click', () => {editAbilityForm(abilityDiv, place)})
  deleteAbilityBtn.className = 'delete delete-ability'
  deleteAbilityBtn.innerHTML = 'Delete'
  deleteAbilityBtn.addEventListener('click', () => {
    aseWrapper.querySelector('.abilities .list').replaceChildren()
    charData.abilities.list.splice(place, 1)
    showAbilities()
  })
  buttonsDiv.append(editBtn, deleteAbilityBtn)

  abilityDiv.className = 'ability'
  abilityDiv.setAttribute('data-place', place)
  let innerString = nameString + typeString + description
  abilityDiv.innerHTML = innerString
  abilityDiv.append(buttonsDiv)

  return abilityDiv
}
// Loads a character's abilities
function showAbilities () {
  if (charData.abilities.list == null) { console.log('no abilities'); return }

  const tagList = aseWrapper.querySelector('.abilities .tag-list').children
  const tagListArray = Array.from(tagList)
  let selectedTags = []
  tagListArray.forEach((thing, i) => {
    const tagEle = tagList[i]
    if (tagEle.dataset.selected === 'true') {selectedTags.push(tagEle.innerHTML)}
  })
  if (selectedTags.length > 0){
    console.log(selectedTags.length)
    charData.abilities.list.forEach((thing, i) => {
      const test = checkForTags(thing, selectedTags)
      if (test === true) {
        abilityEle = createAbilityEle(thing, i)
        aseWrapper.querySelector('.abilities .list').append(abilityEle)
      }
    })
    return
  }
  charData.abilities.list.forEach((thing, i) => {
    abilityEle = createAbilityEle(thing, i)
    aseWrapper.querySelector('.abilities .list').append(abilityEle)
  })
}
function checkForTags (ability, tags) {
  const abilityType = ability.type
  let check = false
  tags.forEach((thing) => {
    if (thing == abilityType) {check = true}
  })
  return check;
}

async function editAbilityForm (abilityEle, place) {
  const oldAbilityData = charData.abilities.list[place],
  abilityName = oldAbilityData.name,
  abilityType = oldAbilityData.type,
  abilityDescription = oldAbilityData.description,
  abilityRefLink = oldAbilityData.refLink,
  editForm = await addAbilityForm()
  const typeInput = editForm.querySelector('#abilityType'),
  nameInput = editForm.querySelector('#abilityName'),
  descriptionInput = editForm.querySelector('#description'),
  refLinkInput = editForm.querySelector('#refrenceLink'),
  addBtn = editForm.querySelector('#add'),
  cancelBtn = editForm.querySelector('#cancel')

  typeInput.setAttribute("value", `${abilityType}`)
  nameInput.setAttribute("value", `${abilityName}`)
  descriptionInput.setAttribute("value", `${abilityDescription}`)
  if (abilityRefLink !== null) { refLinkInput.setAttribute("value", `${abilityRefLink}`) }
  
  addBtn.addEventListener('click', () => {addAbility(editForm, place)})
  cancelBtn.addEventListener('click', () => {editForm.replaceWith(abilityEle)})

  abilityEle.replaceWith(editForm)
}