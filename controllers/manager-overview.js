window.onload = () => {
    $.post('/send-session', null, session => {
        console.log(session);
        if (JSON.parse(session.superUser)) document.querySelector('body').innerHTML += '<a class="menu-button" href="/manager-managers">Managers</a>';
    });
};