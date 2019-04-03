
// TODO: the hash function should later be moved to the projectmangerpage
function hashPassword() {
    const password = document.getElementById("login-form").password.value;
    console.log(password);

    $.post('/hash', { password }, hashedPass => {
        console.log(hashedPass);
    });
}

// unhash function
function unHashPassword(hashedPassword) {
  const form = document.getElementById('login-form');

    const dataToCompare = {
      password: form.password.value,
      hash: hashedPassword
    }
  
    return $.post('/unhash', dataToCompare, passMatched => {
      passMatched;
    });
  }

  // login
  function submit() {
    const table = 'managers';
    const form = document.getElementById('login-form');
    const formData = {
        username: form.username.value,
        password: form.password.value
    };

    $.post('/select', {
      table,
      options: {
          attributes: [
            'username',
            'password'
          ],
          where: { username: formData.username }
      }
  }, data => {
    data.forEach((result) => {
      unHashPassword(result.password); // how to know if the object is true or false?

      //TODO: create session if unHashPassword() password returns true
  });
  });
}
