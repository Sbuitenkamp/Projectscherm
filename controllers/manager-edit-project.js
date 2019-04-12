let id;
window.onload = () => {
    const dropdown = document.getElementById('teamlist');
    $.post('/send-session', null, session => {
        id = session.savedId;
        $.post('/select', {
            table: 'teams',
            options: {
                attributes: [
                    'id',
                    'username'
                ],
                where: { managerId: session.id },
            }
        }, data => {
            for (const team of data) dropdown.innerHTML += `<option value="${team.id}">${team.username}</option>`;
        });
    });
};

function submit() {
    const dropdown = document.getElementById('teamlist');
    console.log(dropdown.value);
    $.post('/update', {
        table: 'projects',
        values: { teamId: dropdown.value },
        options: { where: { id } }
    }, result => {
        if (!result) alert('Er is iets misgegaan met het updaten van het project');
        else window.location = '/manager-projects';
    });
}