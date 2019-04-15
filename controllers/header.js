$.post('/send-session', null, session => {
    if (session) document.getElementById('page-header').innerHTML += '<button class="logout-button" onclick="logOut()">Uitloggen</button>';
});