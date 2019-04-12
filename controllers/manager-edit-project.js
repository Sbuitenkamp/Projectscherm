let id;
let form;
window.onload = () => {
    form = document.getElementById('edit-project-form');
    $.post('/send-session', null, session => {
        id = session.savedId;
        $.post('/select', {
            table: 'projects',
            options: {
                attributes: [
                    'teamId',
                    'projectName',
                    'status',
                    'startDate',
                    'endDate',
                    'description'
                ],
                include: [{
                    association: 'projectTeam',
                    attributes: [
                        'id',
                        'username'
                    ]
                }],
                where: { managerId: session.id },
            }
        }, projectData => {
            $.post('/select', {
                table: 'teams',
                options: {
                    attributes: [
                        'id',
                        'username'
                    ],
                    where: { managerId: session.id },
                }
            }, teams => {
                for (const key in projectData[0]) {
                    console.log(key)
                    if (key.match(/id+/i) || key.match(/team+/i)) continue;
                    if (projectData[0][key]) form[key].value = projectData[0][key].toString();
                }
                for (const team of teams) form.teamList.innerHTML += `<option value="${team.id}">${team.username}</option>`;
            });
        });
    });
};

function submit() {
    $.post('/update', {
        table: 'projects',
        values: {
            teamId: form.teamList.value,
            projectName: form.projectName.value,
            status: form.status.value,
            startDate: form.startDate.value,
            endDate: form.endDate.value,
            description: form.description.value
        },
        options: { where: { id } }
    }, result => {
        if (!result) alert('Er is iets misgegaan met het updaten van het project');
        else window.location = '/manager-projects';
    });
}
