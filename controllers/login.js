window.onload = () => {
    $.post('/send-session', null, session => {
        if (session) window.location = `${session.isAdmin ? 'manager' : 'team'}-overview`;
    });
};

async function submit() {
    const form = document.getElementById('login-form');
    const username = form.username.value;
    const password = form.password.value;
    let userdata;
    await $.post('/select', {
        table: 'managers',
        options: {
            attributes: [
                'id',
                'password',
                'superUser'
            ],
            where: { username }
        }
    }, data => {
        if (!userdata && data[0]) userdata = {
            ...data[0],
            table: 'managers'
        };
    });
    await $.post('/select', {
        table: 'teams',
        options: {
            attributes: [
                'id',
                'password'
            ],
            where: { username }
        }
    }, data => {
        if (!userdata && data[0]) userdata = {
            ...data[0],
            table: 'teams'
        };
    });
    if (!userdata) return alert('Onbekende gebruikersnaam.');
    $.post('/verify', { password, hash: userdata.password, id: userdata.id, table: userdata.table, superUser: userdata.superUser }, passMatched => {
        if (passMatched) window.location = `/${userdata.table.slice(0, -1)}-overview`;
        else alert('Wachtwoord onjuist.');
    });
}