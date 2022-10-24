const yogBtn = document.getElementById('characterBtn')
const baseUrl = window.location.origin
const host = window.location.host
console.log(baseUrl)
console.log(host)
var character
// Gets Yog's character info
yogBtn.addEventListener('click', async () => {
  const characterUrl = baseUrl + '/js/campaigns/test/characters/PCs/Yog.json'
  const response = await fetch(characterUrl)
  const yogJson = await response.text()
  character = JSON.parse(yogJson)
  // Attaches character sheet to body
  document.body.appendChild(createSheet(character))
  underminer()
  console.log(character.Character_Name)
  const saveBtn = document.createElement('input')
  saveBtn.setAttribute('type', 'button')
  saveBtn.setAttribute('value', 'Save')
  saveBtn.className = 'option'
  saveBtn.addEventListener('click', async () => {

    const saveUrl = baseUrl + `/save/character/${character.Character_Name}`
    fetch(saveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(character)
    })
  })
  document.body.appendChild(saveBtn)
})
// Creates a sheet element using Character obj
function createSheet (chr) {
  const characterSheet = document.createElement('div')
  characterSheet.className = 'sheet'
  characterSheet.appendChild(boxer(chr))
  // Calculates the modifier for stat checks
  const stats = 
     characterSheet.querySelector("div.Stats div").children
  const statsArray = Array.from(stats)
  statsArray.forEach((statName, i) => {

    const statsValue = stats[i].querySelector("input[type='text']").getAttribute('value')
    const modValue = modCalc(statsValue)

    const modBox = document.createElement('div')
    modBox.className = 'Mod'
    modBox.innerHTML = `
    <h1>Mod:</h1>
    <p>${modValue}</p>
    `
    stats[i].querySelector('div').appendChild(modBox)
  })
  // Calculates the modifier for skill checks
  const skills = 
  characterSheet.querySelector('div.Skills div').children
  const skillsArray = Array.from(skills)
  skillsArray.forEach((skillName, i) => {
    const skillModBox = skills[i].querySelector('div.Mod')
    const skillProfBool = skills[i].querySelector('div.Proficiency input')
    const skillStat = skillModBox.querySelector('input').value
    var skillModVal = modCalc(
      characterSheet.querySelector(`div.${skillStat} div.Base input`).value
    )
    if (skillProfBool.getAttribute('value') == 'true') {
      skillModVal = skillModVal + character.Proficiency_Bonus
    }
    const skillMod = document.createElement('p')
    skillMod.classList = `${skillStat}Dep proficiencyDep`
    skillMod.innerText = `${skillModVal}`
    skillModBox.querySelector('input').replaceWith(skillMod)
  })

  const abilities = characterSheet.querySelector('div.Abilities')
  const addAbility = document.createElement('input')
  addAbility.setAttribute('type', 'button')
  addAbility.setAttribute('value', 'New Ability')
  addAbility.className = 'option'
  addAbility.addEventListener('click', async () => {
    const response = await fetch('/forms/addingAbility', {
      method: 'GET',
    })
    const form = await response.text()
    const formDiv = document.createElement('div')
    formDiv.innerHTML = form
    formDiv.className = 'form'
    if (abilities.querySelector('div.form') == null){
      abilities.appendChild(formDiv)
      addAbility.remove()
    }
    const addButton = formDiv.querySelector('button.add')
    addButton.addEventListener('click', () => {
      const newName = abilities.querySelector('input#abilityName').value
      const description = abilities.querySelector('textarea#description').value
      const refLink = abilities.querySelector('input#refLink').value
      const abilityData = {
          "description": description,
          "refLink": refLink
        }
      character['Abilities'][newName] = abilityData
      const newAbility = createAbilityEle(newName)
      formDiv.replaceWith(newAbility)
      abilities.appendChild(addAbility)
    })
    const cancelBtn = formDiv.querySelector('button.cancel')
    cancelBtn.addEventListener('click', () => {
      formDiv.replaceWith(addAbility)
    })
  })
  abilities.appendChild(addAbility)

  return characterSheet
}
// Creates the sections of the sheet and puts in a header
function createBox (boxName) {
  const box = document.createElement('div')
  box.className = boxName
  box.innerHTML = `<h1>${boxName}:</h1>`
  return box
}
// Decides make sections, or fill the sections with inputs
function boxer (obj) {
  const box = document.createElement('div')
  Object.keys(obj).forEach((thing, i) => {
    const thingsBox = createBox(thing)
    const thingsValue = Object.values(obj)[i]
    // Will create a subsection if the value of a property 
    // is also an object
    if (typeof thingsValue !== 'object') {
      thingsBox.appendChild(inputMaker(thingsValue))
    } else if (thing == "Abilities"){
      Object.keys(character.Abilities).forEach((ability) => {
        thingsBox.appendChild(createAbilityEle(ability))
      }) 
    } else {
      thingsBox.appendChild(boxer(thingsValue))
    }
    box.appendChild(thingsBox)
  })
  return box
}
// creates inputs for users to modify the sheet with
function inputMaker (value) {
  const valueElement = document.createElement('input')
  // Creates a button if the value is a boolean, text input if not
  if (typeof value !== 'boolean') {
    valueElement.setAttribute('type', 'text')
    valueElement.setAttribute('value', `${value}`)
    const inputSize = `${value}`.length
    valueElement.setAttribute('size', `${inputSize + 2}`)
    valueElement.addEventListener('change', function (e){
      updateChr(this, this.value)
      this.setAttribute('size', `${this.value.length + 2}`)
    })
    return valueElement
  } else {
    valueElement.setAttribute('type', 'button')
    valueElement.addEventListener('click', function (e){
      checkUncheck(this)
    })
    if (value == true){
      valueElement.setAttribute('value', 'true')
      return valueElement
    } 
    valueElement.setAttribute('value', 'false')
    return valueElement
  }
}
// Changes the values of buttons
function checkUncheck (boxElement) {
  if (boxElement.getAttribute('value') != 'true') {
    boxElement.setAttribute('value', 'true')
    updateChr(boxElement, true)
    
    const boxParent = boxElement.parentNode
    // Checks to see if if it should add or sub the proficiency bonus to its sibling modifier
    if (boxParent.className = 'Proficiency') {
      const changedMod = boxParent.parentNode.querySelector('.Mod p')
      var modVal = parseInt(changedMod.innerText, 10)
      modVal = modVal + character.Proficiency_Bonus
      changedMod.innerHTML = `${modVal}`
    }
  } else {
    boxElement.setAttribute('value', 'false')
    updateChr(boxElement, false)

    const boxParent = boxElement.parentNode
    if (boxParent.className = 'Proficiency') {
      const changedMod = boxParent.parentNode.querySelector('.Mod p')
      var modVal = parseInt(changedMod.innerText, 10)
      modVal = modVal - character.Proficiency_Bonus
      changedMod.innerHTML = `${modVal}`
    }
  }
}
// Will find the nested property of an object when given a string of properties using dot notation i.e 'orange.peel.zest'
// Based on stack overflow user RobG's answer
function getPropByString(obj, propString) {
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
} // This changes the property that is looked for
function editPropByString(obj, propString, newValue) {
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
// Updates the character obj when the user changes a value on the character sheet
function updateChr (changedElement, newValue ) {
  const branch = findParents(changedElement)
  // Updates the modifier, and all things affected by the modifer, when base stat is updated
  if (branches.includes('.Base')){
    const newMod = modCalc(newValue)
    const modBox = document.querySelector(`${branches[0]} ${branches[1]} .Mod`)
    const affectedEle = document.querySelectorAll(`${branches[1]}Dep`)
    const affectedEleArray = Array.from(affectedEle)
    const oldVal = parseInt(modBox.querySelector('p').innerText, 10)
    affectedEleArray.forEach((ele, i) => {
      var newText = parseInt(affectedEle[i].innerText, 10)
      newText = newText - oldVal
      newText = newText + newMod
      affectedEle[i].innerText = `${newText}`
    })
    modBox.querySelector('p').innerText = `${newMod}`
  }
  // Updates all stats using the proficiency bonus when changed
  if (branches.includes('.Proficiency_Bonus')){
    const affectedMods = document.querySelectorAll('.proficiencyDep')
    const affectedArray = Array.from(affectedMods)  
    affectedArray.forEach((ele, i) => {
      const modEle = affectedMods[i]
      const modParent = modEle.parentElement.parentElement
      const profCheck = modParent.querySelector('.Proficiency input')
      if (profCheck.value == 'true') {
        var modVal = parseInt(modEle.innerText, 10)
        modVal = modVal - character.Proficiency_Bonus
        modVal = modVal + parseInt(newValue,10)
        modEle.innerHTML = `${modVal}`
      }
    })
  }
  editPropByString(character, branch, newValue)
  branches = []
}
// Creates a string of properties for the updateChr function
let branches = []
function findParents (orphan) {
  const parents = orphan.parentNode
  if (parents.className !== "sheet"){
    if (parents.className != ''){
      branches.unshift(`.${parents.className}`)
    }
    findParents(parents)
  }
  let branchString = ''.concat(...branches)
  branchString = branchString.slice(1)
  return branchString
}
function createAbilityEle(abilityName) {
  const abilityEle = document.createElement('div')
  abilityEle.className = 'abilityBox'
  const ability = character['Abilities'][abilityName]
  const description = ability.description
  const refLink = ability.refLink
  abilityEle.innerHTML = `
  <div>
    <p><b>${abilityName}: </b>${description}</p>
  </div>
  `
  if (refLink != '') {
    const refBtn = document.createElement('button')
    refBtn.innerHTML = 'Reference Page'
    refBtn.className = 'refbtn'
    refBtn.addEventListener('click', () => {
      window.open(refLink, '_blank')
    })
    abilityEle.appendChild(refBtn)
  }

  const editBtn = document.createElement('button')
  editBtn.innerHTML = 'Edit'
  editBtn.className = 'editBtn'
  editBtn.addEventListener('click', async () => {
    const response = await fetch('/forms/addingAbility', {
      method: 'GET',
    })
    const form = await response.text()
    const formDiv = document.createElement('div')
    formDiv.innerHTML = form
    formDiv.className = 'form'
    const nameInput = formDiv.querySelector('input#abilityName')
    nameInput.setAttribute('value', abilityName)
    const descriptionInput = formDiv.querySelector('textarea#description')
    descriptionInput.innerHTML = description
    const refLinkInput = formDiv.querySelector('input#refLink')
    refLinkInput.setAttribute('value', refLink)
    const addButton = formDiv.querySelector('button.add')
    addButton.innerHTML = 'Update Ability'
    addButton.addEventListener('click', () => {
      const abilityData = {
        "description": descriptionInput.value,
        "refLink": refLinkInput.value
      }
      character['Abilities'][nameInput.value] = abilityData
      if (abilityName !== nameInput.value) {
        delete character['Abilities'][abilityName]
      }
      const newAbility = createAbilityEle(nameInput.value)
      formDiv.replaceWith(newAbility)
    })
    const cancelBtn = formDiv.querySelector('button.cancel')
    cancelBtn.addEventListener('click', () => {
      formDiv.replaceWith(abilityEle)
    })
    abilityEle.replaceWith(formDiv)
  })
  abilityEle.appendChild(editBtn)

  const delBtn = document.createElement('button')
  delBtn.innerHTML = 'Delete Ability'
  delBtn.className = 'delBtn'
  delBtn.addEventListener('click', () => {
    delete character['Abilities'][abilityName]
    abilityEle.remove()
  })
  abilityEle.appendChild(delBtn)
  return abilityEle
}