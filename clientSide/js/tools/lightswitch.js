const lightswitch = document.body.querySelector('#lightswitch')
lightswitch.addEventListener('click', function (e) {
  if (lightswitch.value == 'light') {
    lightswitch.value = 'dark'
    document.body.className = ''
    return
  }
  lightswitch.value = 'light'
  document.body.className = 'light-mode'
})