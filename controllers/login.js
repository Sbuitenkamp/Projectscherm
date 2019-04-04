// TODO: the hash function should later be moved to the projectmangerpage

// login
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
                'password'
            ],
            where: { username }
        }
    }, data => {
        if (!userdata) userdata = {
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
        if (!userdata) userdata = {
            ...data[0],
            table: 'teams'
        };
    });
    $.post('/verify', { password, hash: userdata.password, id: userdata.id }, passMatched => {
        if (passMatched) {
            console.log('yes');
            if (userdata.table === 'managers') window.location = '/manager-overview';
            else window.location = '/team-overview';
        }
    });
}