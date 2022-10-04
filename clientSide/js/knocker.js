const doorBell = document.getElementById('knockBtn')
const yogBtn = document.getElementById('characterBtn')
let greeter

doorBell.addEventListener('click', () => {
  fetch('http://localhost:8001/knock')
    .then(response => response.json())
    .then(json => {
      console.log(json)
      greeter = json.answer

      if (greeter !== true) {
        console.log('no response')
      } else {
        const element = document.createElement('p')
        element.innerHTML = 'Yes? who is it'
        document.body.appendChild(element)
      }
    })
    .catch(err => console.log(err))
})

yogBtn.addEventListener('click', async () => {
  const characterUrl = 'http://localhost:8001/js/campaigns/test/characters/PCs/Yog.json'
  const response = await fetch(characterUrl)
  const yogJson = await response.text()
  const yog = JSON.parse(yogJson)
  console.log(yog)
  document.body.appendChild(createSheet(yog))
})

function createSheet (chrObj) {
  const sheetElement = document.createElement('div')
  sheetElement.id = 'sheet'

  const charIdentity = document.createElement('div')
  charIdentity.id = 'identity'
  const charName = document.createElement('h1')
  charName.id = 'name'
  charName.innerHTML = chrObj.characterName
  charIdentity.appendChild(charName)

  const charClasses = document.createElement('div')
  charClasses.id = 'classes'
  charClasses.innerHTML = `
    <h2>Classes:</h2>
    <p>${chrObj.classes}</p>`
  charIdentity.appendChild(charClasses)

  const charBackground = document.createElement('div')
  charBackground.id = 'background'
  charBackground.innerHTML = `
  <h2>Background:</h2>
  <p>${chrObj.background}</p>`
  charIdentity.appendChild(charBackground)

  const charRace = document.createElement('div')
  charRace.id = 'race'
  charRace.innerHTML = `
  <h2>Race:</h2>
  <p>${chrObj.race}`
  charIdentity.appendChild(charRace)

  const charAlignment = document.createElement('div')
  charAlignment.id = 'alignment'
  charAlignment.innerHTML = `
  <h2>Alignment:</h2>
  <p>${chrObj.alignment}`
  charIdentity.appendChild(charAlignment)

  const charExperience = document.createElement('div')
  charExperience.id = 'experience'
  charExperience.innerHTML = `
  <h2>Experience:</h2>
  <p>${chrObj.experience}XP</p>`
  charIdentity.appendChild(charExperience)

  sheetElement.appendChild(charIdentity)

  const charHp = document.createElement('div')
  charHp.id = 'hp'
  const charHpTitle = document.createElement('h2')
  charHpTitle.innerHTML = 'Health Points'
  charHp.appendChild(charHpTitle)
  chrObj.hp.forEach((type, i) => {
    const hpElement = document.createElement('div')
    const name = Object.keys(type)[0]
    hpElement.id = name
    const value = Object.values(type)[0]
    console.log(value)
    hpElement.innerHTML = `
    <h3>${name}:</h3>
    <p>${value}</p>`
    charHp.appendChild(hpElement)
  })
  sheetElement.appendChild(charHp)

  const charDeathSaves = document.createElement('div')
  charDeathSaves.id = 'deathSaves'
  const charDeathTitle = document.createElement('h2')
  charDeathTitle.innerHTML = 'Death Saves'
  charDeathSaves.appendChild(charDeathTitle)
  Object.keys(chrObj.deathSaves).forEach((type, i) => {
    const dsElement = document.createElement('div')
    const name = type
    dsElement.id = name
    const value = Object.values(chrObj.deathSaves)[i]
    dsElement.innerHTML = `
    <h3>${name}:</h3>
    <p>${value}</p>`
    charDeathSaves.appendChild(dsElement)
    console.log(type)
    console.log(value)
  })
  sheetElement.appendChild(charDeathSaves)

  const charHD = document.createElement('div')
  charHD.id = 'hitDice'
  charHD.innerHTML = `
  <h2>Hit Dice:</h2>
  <p>${chrObj.hitDice}</p>`
  sheetElement.appendChild(charHD)

  const charStats = document.createElement('div')
  charStats.id = 'Stats'
  charStats.innerHTML = '<h2>Stats</h2'
  chrObj.stats.forEach((stat, i) => {
    let statName
    let statBase
    let statSave
    Object.keys(stat).forEach((type, i) => {
      statName = type
    })
    Object.values(stat).forEach((values, i) => {
      statBase = Object.values(values)[0]
      statSave = Object.values(values)[1]
    })
    const statElement = document.createElement('div')
    statElement.innerHTML = `
    <h3>${statName}:</h3>
    <p><b>Base:</b> ${statBase}</p>
    <p><b>Save:</b> ${statSave}</p>`
    charStats.appendChild(statElement)
    console.log(stat)
  })
  sheetElement.appendChild(charStats)

  const charSkills = document.createElement('div')
  charSkills.id = 'skills'
  charSkills.innerHTML = '<h2>Skills</h2>'
  Object.keys(chrObj.skills).forEach((name, i) => {
    const values = Object.values(chrObj.skills)[i]

    const skillElement = document.createElement('div')
    skillElement.id = name
    skillElement.innerHTML = `
    <h3>${name}</h3>
    <p><b>Proficiency:</b> ${values.proficiency}</p>
    <p><b>Mod:</b> ${values.mod}`
    charSkills.appendChild(skillElement)
  })
  sheetElement.appendChild(charSkills)

  return sheetElement
}
