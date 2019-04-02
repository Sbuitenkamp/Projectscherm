// TODO: the hash function should later be moved to the projectmangerpage
function hashPassword() {
  const password = document.getElementById("login-form").password.value;
  console.log(password);

$.post('/hash', { password }, hashedPass => {
    console.log(hashedPass);
  });
}

// unhash function
function unHashPassword() {
    const password = document.getElementById("login-form").password.value;
    console.log(password);
  
  $.post('/unhash', { password }, passMatched => {
      console.log(passMatched);
    });
  }
