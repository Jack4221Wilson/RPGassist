const token = localStorage.getItem('storedLogin')
const origin = window.location.origin
if (token == null) {
  if (window.location.href !== origin + '/login.html') {
    console.log(window.location)
    window.location.href = 'login.html'
  }
} else {
  loadUser()
}


const signUpBtn = document.querySelector('button.sign-up')
if (signUpBtn != null) { 
  signUpBtn.addEventListener('click', () => {signUp(signUpBtn)})
}
const loginBtn = document.querySelector('button.sign-in')
if (loginBtn != null) { 
  loginBtn.addEventListener('click', () => {
    createLoginForm(loginBtn)
  })
}
function signUp (parentDiv) {
  const signUpForm = document.createElement('form')
  signUpForm.className = 'sign-up-form'
  signUpForm.innerHTML = `
  <ul>
    <li>
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" placeholder="jane doe" required>
    </li>
    <li>
      <label for="user_key">Username:</label>
      <input type="text" id="user_key" name="user_key" placeholder="johnPlaysRPGs123" required>
    </li>
    <li>
      <label for "pass_word">Password:</label>
      <input type="text" id="pass_word" name="pass_word" placeholder="Super5trongP@ssw0rd" required>
    </li>
    <li>
      <button class="sign-up-form" type="button">Create User</button>
    </li>
  </ul>
  `
  parentDiv.replaceWith(signUpForm)
  const subBtn = signUpForm.querySelector('button.sign-up-form')
  subBtn.addEventListener('click', async () => {
    const bodyObj = {
      name: signUpForm.querySelector('input#name').value,
      user_key: signUpForm.querySelector('input#user_key').value,
      pass_word: signUpForm.querySelector('input#pass_word').value 
    }
    const response = await fetch('/users/create-user', {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify(bodyObj),
    })
    const answer = await response.text()
    msgEle = document.createElement('p')
    if (response.ok == true) {
      msgEle.innerHTML = '<b>Success!</b> Now please log in'
      msgEle.className = 'success'
      signUpForm.replaceWith(msgEle)
      return
    }
    msgEle.innerHTML = `${answer}`
    msgEle.className = 'err'
    signUpForm.append(msgEle)
    const badInput = signUpForm.querySelector('input#user_key')
    badInput.style = 'outline: solid 3px var(--red)'
    badInput.addEventListener('focus', () => {
      badInput.style = ''
      msgEle.remove()
    })
  })
}

function createLoginForm (parentDiv) {
  const loginForm = document.createElement('form')
  loginForm.className = "login-form"
  loginForm.innerHTML = `
  <ul>
    <li>
      <label for="user_key">Username:</label>
      <input type="text" id="user_key" name="user_key" required>
    </li>
    <li>
      <label for "pass_word">Password:</label>
      <input type="text" id="pass_word" name="pass_word" placeholder="Super5trongP@ssw0rd" required>
    </li>
    <li>
      <button class="login-form" type="button">Login</button>
    </li>
  </ul>
  `
  parentDiv.replaceWith(loginForm)
  const subBtn = loginForm.querySelector('button.login-form')
  subBtn.addEventListener('click', () => {login('form.login-form')})
}
async function login(source) {
  const sourceEle = document.querySelector(source)
  const user_key = sourceEle.querySelector('input#user_key').value
  const pass_word = sourceEle.querySelector('input#pass_word').value
  const data = {'user_key': user_key, 'pass_word': pass_word}
  
  const response = await fetch('/users/login',{
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const resData = await response.json()
  console.log(resData)
  if (Object.keys(resData)[0] == 'error'){
    const errCode = resData.error.code
    const errMsg = resData.error.message
    const msgEle = document.createElement('p')
    msgEle.className = 'err'
    msgEle.innerHTML = `${errMsg}`
    console.log(errCode, errMsg)
    if (errCode === 0) {
      const badInput = sourceEle.querySelector('input#user_key')
      badInput.style = 'outline: solid 3px var(--red)'
      sourceEle.append(msgEle)
      badInput.addEventListener('focus', () => {
        badInput.style =''
        msgEle.remove()
      })
      return
    }
    const badInput = sourceEle.querySelector('input#pass_word')
    badInput.style = 'outline: solid 3px var(--red)'
    sourceEle.append(msgEle)
    badInput.addEventListener('focus', () => {
      badInput.style =''
      msgEle.remove()
      })
      return
  } else {
    localStorage.setItem('storedLogin', resData.token)
    window.location.href = './index.html'
  }
}
let userData
async function loadUser() {
  const token = localStorage.getItem('storedLogin')
  const response = await fetch('/users/user', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({token})
  })
  userData = await response.json()
  if (response.ok != true) {
    localStorage.removeItem('storedLogin')
    window.location.href = 'login.html'
    return
  }
  const nameEle = document.querySelector('h2.user-name')
  const userKeyEle = document.querySelector('p.user-key')
  nameEle.innerHTML = userData.name
  userKeyEle.innerHTML = `Username: ${userData.user_key}`
  
  const logoutBtn = document.querySelector('#logout')
  logoutBtn.addEventListener('click', () => {logout()})
  fillGrid(userData.id)
}

function logout() {
  localStorage.removeItem('storedLogin')
  window.location.href = 'login.html'
}