var crypto = require('crypto')
const path = require('path'),
express = require('express'),
fs = require('fs'),
{ PrismaClient } = require('@prisma/client'),
prisma = new PrismaClient(),
app = express(), // creates a server with the express library
port = 8001, // port for server
hashAlg = 'sha256'

// path to static 'front end' client-side files
const path2site = path.join(__dirname, './clientSide')
app.use(express.static(path2site))

// 3126952310
// Gets comuputer's IP for local network use
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = {}
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
      if (net.family === familyV4Value && !net.internal) {
          if (!results[name]) {
              results[name] = [];
          }
          results[name].push(net.address);
      }
  }
}

// Left over from learning
app.get('/knock', (req, res) => {
  res.status(200).send({
    answer: true
  })
  console.log('there is a knock at the door')
})
// Sends the requested character JSON to the user
app.get('/js/campaigns/test/characters/PCs/:name', (req, res, next) => {
  var characterName = req.params.name
  res.sendFile(characterName, (err) => {
    if (err) {
      next(err)
    }
  })
})
// Saves a modified character sheet
app.use(express.json())
app.post('/save/character/:name', (req, res, next) => {
  var chrData = req.body
  var path2chr = path2site + '/js/campaigns/test/characters/PCs' + `/${chrData.Character_Name}.json` 
  fs.writeFile(
    path2chr, JSON.stringify(chrData), (err) => {
      if(err) {
        next(err)
      } else {
        res.status(200).send('has been saved')
        console.log(chrData.Character_Name + ' has been updated')
      }
    })
})
function getHash(input, salt){
  var hash = crypto.createHash(hashAlg)
  hash.update(input + salt)
  return hash.digest('hex')
}
async function createNewUser(userData) {
 const creatingUser = await prisma.users.create({
    data: { user_key: `${userData.user_key}`, pass_word: `${userData.pass_word}`, name: `${userData.name}`}
   })
   console.log(creatingUser)
  }
async function login(user_key, password){
  const getUser = await prisma.users.findUnique({
    where:{ 'user_key': user_key},
  })
  if (getUser == null) {throw 'No user with that username'}
  else {
    let hashed = getHash(password, user_key)
    if (getUser['pass_word'] !== hashed) {throw 'wrong password'}
    else {
      console.log(getUser)
      return getUser
    }
  }
}
async function loadUser(hashedPas){
  let getUser = await prisma.users.findUnique({
    where:{'pass_word': hashedPas}
  })
  if (getUser = null) {throw 'bad token'}
  else {return getUser}
}
app.post('/users/user', async (req, res, next) => {
  const token = req.body
  console.log(token)
  const getUser = await prisma.users.findUnique({
    where:{'pass_word': token.token},
  })
  if (getUser == null) {console.log ('bad token')}
  else {res.send(getUser)}
})

app.post('/users/login', async (req, res, next) => {
  const loginData = req.body
  console.log(loginData)
  const getUser = await prisma.users.findUnique({
      where:{ 'user_key': loginData.user_key},
    })
  if (getUser == null) {console.log(
    'No user with that username'
  )}
  else {
    const hashed = getHash(loginData.pass_word, loginData.user_key)
    if (getUser.pass_word !== hashed) {
      console.log('wrong password'
    )}
    else {
      console.log(getUser)
      if (res.headersSent != true){
        console.log(getUser.pass_word)
        res.send({
          token: getUser.pass_word
        })
        
      }
    }
  }
})

app.post('/users/create-user', (req, res, next) => {
  const userData = req.body
  userData.pass_word = getHash(userData.pass_word, userData.user_key)
  createNewUser(userData)
  .catch(e => {
    console.error(e.message)
    res.status(500).send('No can do buckaroo')
    return
  })
  .finally(async () => {
    if (res.headersSent != true){
      res.status(200).send('user has been made')
    }
  })
})

app.use(express.urlencoded({extended: true}))
app.get('/forms/addingAbility', (req, res) => {
  res.status(200).send(
  `<form action="formSub/addingAbility" method="get">
  <ul>
    <li>
      <label for="abilityName">Ability Name:</label>
      <input type="text" id="abilityName" name="abilityName" required>
    </li>
    <li>
      <label for="description">Description:</label>
      <textarea id="description" name="description" required placeholder = "Add as much detail as you'd like. You can add a link to a better source in the next field if you don't want to get into the nitty gritty of what this ability does."></textarea>
    </li>
    <li>
      <label for="refLink">Refrence Link:</label>
      <input type="url" id="refLink" name="refLink" placeholder="https://referencePageHere.com">
      <div><p class="explainer">Optional. Will create a button linked to the given URL; it is meant to provide better refrence for this ability</p></div>
    </li>
    <li>
      <div>
        <button type="button" class="add">Add Ability</button>
        <button type="button" class="cancel">Cancel</button>
      </div>
    </li>
  </ul>
</form>`)
})

app.listen(
  port,
  () => {
    console.log(`Dance floor is at http://${results.en0[0]}:${port}`)
  }
)