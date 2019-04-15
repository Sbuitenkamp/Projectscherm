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
            data.forEach((result) => {

                if (!result.projectTeam) {
                    console.log('no team assigned to project');
                    return;
                }
                if (!result.projectTeam.teamRequests[0]){
                  console.log('no requests');
                  return;
                }

                const index = result.id;
                document.getElementById('request-overview').innerHTML += `<tr id='result${index}'></tr>`;
                const resElement = document.getElementById(`result${index}`);
                resElement.innerHTML +=
                    `<td>${result.projectName}</td>
                    <td>${result.projectTeam.members || 'geen'}</td>
                    <td>${result.status}</td>
                    <td>${result.projectTeam.teamRequests[0].requestedStatus || 'geen'}</td>
                    <td>${result.projectTeam.teamRequests[0].description || 'geen'}</td>`;
                document.getElementById(`result${index}`).innerHTML += `<td><button onclick="deny(${result.projectTeam.teamRequests[0].id});">weigeren</button></td>`;
                document.getElementById(`result${index}`).innerHTML += `<td><button onclick="accept(${index}, ${result.projectTeam.teamRequests[0].requestedStatus}, ${result.projectTeam.teamRequests[0].id});">accepteren</button></td>`;
            });
        });

    });
};

function accept(id, result, requestId) {
    $.post('/update', {
        table: 'projects',
        values: {
            status: result
        },
        options: { where: { id } }
    }, result => {
        if (!result) alert('Er is iets misgegaan met het updaten van het project');
        else {
            $.post('/destroy', { table: 'requests', options: { where: { id: parseInt(requestId) } } }, () => location.reload());
            alert('status is geupdate');
        }
    });
}

function deny(requestId) {
    const yes = confirm('Weet u zeker dat u de request wilt verwijderen?');
    if (yes) $.post('/destroy', { table: 'requests', options: { where: { id: parseInt(requestId) } } }, () => location.reload());
}