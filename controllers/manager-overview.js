const table = 'projects';
//TODO show status requests (not only the id's but the projectName, team, etc to)
window.onload = () => {
    $.post('/send-session', null, session => {
        if (JSON.parse(session.superUser)) document.getElementById('buttonWrapper').innerHTML += '<a class="menu-button" href="/manager-managers">Managers</a>';
        $.post('/select', {
            table: 'projects',
            options: {
                attributes: [
                    'id',
                    'projectName',
                    'status'
                ],
                include: [{
                    association: 'projectTeam',
                    attributes: [
                        'id',
                        'members'
                    ],
                    include: [{
                        association: 'teamRequests',
                        attributes: [
                            'id',
                            'teamId',
                            'taskId',
                            'managerId',
                            'projectId',
                            'requestedStatus',
                            'description'
                        ]
                    }]
                }],
                where: { managerId: session.id }
            }
        }, data => {
            console.log(data);
            data.forEach((result) => {
                const index = result.id;
                document.getElementById('request-overview').innerHTML += `<tr id='result${index}'></tr>`;
                const resElement = document.getElementById(`result${index}`);
                resElement.innerHTML +=
                    `<td>${result.projectName}</td>
                    <td>${result.projectTeam.members || 'geen'}</td>
                    <td>${result.status}</td>
                    <td>${result.projectTeam.teamRequests[0].requestedStatus || 'geen'}</td>
                    <td>${result.projectTeam.teamRequests[0].description || 'geen'}</td>`;
                document.getElementById(`result${index}`).innerHTML += `<td><button onclick="deny(${index});">weigeren</button></td>`;
                document.getElementById(`result${index}`).innerHTML += `<td><button onclick="accept(${index, result});">accepteren</button></td>`;
            });
        });

    });
};

//todo: accept, deny, delete request

function accept(id, result) {
    console.log(result.projectTeam.teamRequests[0].requestedStatus);
    $.post('/update', {
        table,
        values: {
            status: requestedStatus
        },
        options: { where: { id } }
    }, result => {
        if (!result) alert('Er is iets misgegaan met het updaten van het project');
        else window.location = '/manager-overview';
    });
}

function deny(id) {
    const yes = confirm('Weet u zeker dat u deze task wilt verwijderen?');
    if (yes) $.post('/destroy', { table, options: { where: { id: parseInt(id) } } }, () => location.reload());
}