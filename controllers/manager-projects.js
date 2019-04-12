const table = 'projects';
let id;
window.onload = () => {
    $.post('/send-session', null, session => id = session.id);
    $.post('/select', {
        table,
        options: {
            attributes: [
                'id',
                'projectName',
                'status',
                'startDate',
                'endDate',
                'delay',
                'description'
            ],
            include: [{
                association: 'teamProject',
                attributes: ['username']
            }],
            where: { managerId: id },
            order: [['lastUpdate', 'ASC']]
        }
    }, data => renderSelectData({ data, tableId: 'project-overview', deleteBtn: true, editBtn: true }));
};

function edit(id) {
    $.post('/save-id', { id });
    window.location = '/manager-edit-project';
}

function remove(id) {
    const yes = confirm('Weet u zeker dat u dit project wilt verwijderen?');
    if (yes) $.post('/destroy', { table, options: { where: { id: parseInt(id) } } }, () => location.reload());
}