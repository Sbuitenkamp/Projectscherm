let id;
let form;
window.onload = () => {
    form = document.getElementById('edit-team-form');
    $.post('/send-session', null, session => {
        id = session.savedId;
        $.post('/select', {
            table: 'teams',
            options: {
                attributes: [
                    'id',
                    'username',
                    'password',
                    'members'
                ],
                where: { managerId: session.id },
            }
        }, projectData => {
            for (const key in projectData[0]) {
                if (projectData[0][key]) form[key].value = projectData[0][key].toString();
            }
        });
    });
};

function submit() {
    $.post('/update', {
        table: 'teams',
        values: {
            username: form.username.value,
            password: form.password.value,
            members: form.members.value
        },
        options: { where: { id } }
    }, result => {
        if (!result) alert('Er is iets misgegaan met het updaten van het team');
        else window.location = '/manager-teams';
    });
}