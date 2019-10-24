function generateLoginForm (e) {
  e.preventDefault();

  // Empties the modal to prevent redunt forms being appended
  while (modalForm.firstChild) modalForm.removeChild(modalForm.firstChild);

  modal.classList.toggle('visible');
  modal.classList.add('is-active');

  let emailLabel = document.createElement('label');
  let emailInput = document.createElement('input');
  let passwordLabel = document.createElement('label');
  let passwordInput = document.createElement('input');
  let emailField = document.createElement('div');
  let passwordField = document.createElement('div');
  let loginHeading = document.createElement('h2');
  let submitBtn = createButton('submitBtn', 'Login', 'button');

  loginHeading.innerHTML = "Login To Redd Clone </br></br>";
  loginHeading.setAttribute('class', 'is-size-5');

  emailField.setAttribute('class', 'field');
  passwordField.setAttribute('class', 'field');
  
  emailInput = attrSetter(emailInput, [ 
    [ 'placeholder', 'email@domain.com' ], 
    [ 'for', 'email' ], [ 'class','input' ] ]);
  passwordInput = attrSetter(passwordInput, [ 
    [ 'placeholder', 'password' ], 
    [ 'for', 'password' ], 
    [ 'class', 'input' ] ]);

  emailLabel = attrSetter(emailLabel, [ [ 'class', 'label' ], [ 'for', 'email' ] ]);
  emailLabel.innerText = 'Enter email address';

  passwordLabel = attrSetter(passwordLabel, [ [ 'class', 'label' ], [ 'for', 'password' ] ]);
  passwordLabel.innerText = 'Enter your password';

  submitBtn.innerText = 'Login';
  submitBtn.classList.add('is-dark')

  modalForm = multiAppender(modalForm, [ loginHeading, emailField, passwordField ]);
  emailField = multiAppender(emailField, [ emailInput, emailLabel ]);
  passwordField = multiAppender(passwordField, [ passwordInput, passwordLabel ]);

  modalForm.append(submitBtn);

  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();

    let emailText = emailInput.value;
    let passwordText = passwordInput.value;

    submitLogin(emailText, passwordText);   
  });
}

function submitLogin(email, password) {
  fetch(`http://localhost:8080/redd-clone/user/login`, {
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email,
        password
    })})
    .then(response => response.json())
    .then(response => {
      if (!!response.token) {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('username', response.username);
        isAuthenticated = !!sessionStorage.getItem('token');
        logout();
        modal.classList.remove('is-active');
        modal.classList.toggle('visible');
      } else {
        alert('Email or password is incorrect');
      }
    })
    .catch(err => console.log(err));
}