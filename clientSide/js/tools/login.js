const signUpBtn = document.querySelector('button.sign-up')
if (signUpBtn != null) { 
  signUpBtn.addEventListener('click', () => {signUp(signUpBtn)})
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
    console.log(answer)
    signUpForm.replaceWith(signUpBtn)
  })
}

function createLoginForm (parentDiv) {
  const loginForm = document.createElement('form')
  loginForm.className = "login-form"
  loginForm.setAttribute('onsubmit', 'return login(".login-form")')
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
      <button class="login-form" type="submit">Login</button>
    </li>
  </ul>
  `
}
function login(source) {
  const sourceEle = document.querySelector(source)
  const user_key = sourceEle.querySelector('input#user_key').value
  const pass_word = sourceEle.querySelector('input#pass_word').value
  const data = {'user_key': user_key, 'pass_word': pass_word}
  
  fetch('/users/login',{
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((response) => JSON.parse(response))
  .then((responseData) => {
    if (responseData.status == 'ok') {
      console.log('successful login')
      localStorage.setItem('storedLogin', responseData.token)
      window.location.href = './index.html'
    } else {
      console.log('error')
    }
  })
}
function loadUser() {
  const token = localStorage.getItem('storedLogin')
  fetch('/users/user', {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(token)
  })
  .then((response) => JSON.parse(response))
  .then((responseData) => {
    console.log(responseData)
  })
}