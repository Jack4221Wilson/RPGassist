

// Replaces all '_' from all headers with a space 
function underminer () {
  const h1s = document.body.querySelectorAll('h1')
  const h1Array = Array.from(h1s)

  h1Array.forEach((ele, i) => {
    const oldText = h1s[i].innerText
    const newText = oldText.replaceAll('_', ' ')
    h1s[i].innerText = newText
  })
}
// Calculates a modifier based on the stat value
function modCalc (baseStat) {
  let mod = -6
  if (baseStat > 0) {
    for (let i = 0; i <= baseStat; i++) {
      if (i % 2 === 0) {
        mod = mod + 1
      }
    }
  }
  return mod  
}
// Changes the theme of the site
const lightswitch = document.body.querySelector('#lightswitch')
if (lightswitch != null) {
  lightswitch.addEventListener('click', function (e) {
    if (lightswitch.value == 'light') {
      lightswitch.value = 'dark'
      document.body.className = ''
      return
    }
    lightswitch.value = 'light'
    document.body.className = 'light-mode'
  })
}
/* 
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
  })
} 
*/