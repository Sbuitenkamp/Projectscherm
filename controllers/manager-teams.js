const table = 'teams';
window.onload = () => {
    $.post('/send-session', null, session => {
        $.post('/select', {
            table,
            options: {
                attributes: [
                    'id',
                    'username',
                    'password',
                    'members'
                ],
                where: { managerId: session.id }
            }
        }, data => renderSelectData({ data, tableId: 'team-overview', deleteBtn: true, editBtn: true }));
    });
};

function remove(id) {
    const yes = confirm('Weet u zeker dat u dit team wilt verwijderen?');
    if (yes) $.post('/destroy', { table, options: { where: { id: parseInt(id) } } }, () => location.reload());
}

function edit(id) {
    $.post('/save-id', { id });
    window.location = '/manager-edit-team';
}