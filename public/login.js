const loginText = document.querySelector('.title-text .login')
const loginForm = document.querySelector('form.login')
const loginBtn = document.querySelector('label.login')
const signupBtn = document.querySelector('label.signup')
const signupLink = document.querySelector('form .signup-link a')
signupBtn.onclick = () => {
  loginForm.style.marginLeft = '-50%'
  loginText.style.marginLeft = '-50%'
}
loginBtn.onclick = () => {
  loginBtn.click()
  loginForm.style.marginLeft = '0%'
  loginText.style.marginLeft = '0%'
}

function signupClicked() {
  if ($('#username').val() == '' && $('#psw').val() == '') {
    alert('Username and Password are Missing')
  } else if ($('#username').val() == '') {
    alert('Username is Missing')
  } else if ($('#psw').val() == '') {
    alert('Password is Missing')
  } else {
    let newID = 0
    $.ajax({
      url: '/getID',
      type: 'GET',
      data: {},
      success: function (data) {
        if (data.error) {
        } else {
          newID = data.newID
        }
      },
      dataType: 'json',
    })

    $.post('/create', { username: $('#username').val() }, function (data) {})
    $.post(
      '/signup',
      { username: $('#username').val(), password: $('#psw').val() },
      function (data) {
        if (data.error) {
          alert('Error! Someone Already has that name!')
        } else {
          window.location = data.redirect
        }
      }
    )
  }
  return false
}
function loginClicked() {
  if ($('#lusername').val() == '' && $('#lpsw').val() == '') {
    alert('Username and Password are Missing')
  } else if ($('#lusername').val() == '') {
    alert('Username is Missing')
  } else if ($('#lpsw').val() == '') {
    alert('Password is Missing')
  } else {
    $.post(
      '/login',
      { username: $('#lusername').val(), password: $('#lpsw').val() },
      function (data) {
        if (data.error) {
          alert('Error! Make sure to double check your information!')
        } else {
          window.location = data.redirect
        }
      }
    )
  }
}

$(document).ready(function () {
  $('#username').keydown(function (event) {
    if (event.which === 13) {
      signupClicked()
      event.preventDefault()
      return false
    }
  })

  $('#psw').keydown(function (event) {
    if (event.which === 13) {
      signupClicked()
      event.preventDefault()
      return false
    }
  })

  $('#lusername').keydown(function (event) {
    if (event.which === 13) {
      loginClicked()
      event.preventDefault()
      return false
    }
  })

  $('#lpsw').keydown(function (event) {
    if (event.which === 13) {
      loginClicked()
      event.preventDefault()
      return false
    }
  })
})
