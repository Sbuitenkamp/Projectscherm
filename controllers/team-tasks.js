const table = 'tasks';
window.onload = () => {
    $.post('/send-session', null, session => {
    $.post('/select', {
        table,
        options: {
            attributes: [
                'id',
                'taskName',
                'description',
                'isApproved'
            ],
            where: { teamId: session.id },
            order: [['isApproved', 'ASC']]
        }
    }, data => renderSelectData({ data, tableId: 'task-overview', deleteBtn: true, editBtn: true}));
});
};

//TODO: edit tasks(completed/not completed), delete

function edit(id) {
    $.post('/save-id', { id });
    window.location = '/team-edit-task';
}

function remove(id) {
    const yes = confirm('Weet u zeker dat u deze task wilt verwijderen?');
    if (yes) $.post('/destroy', { table, options: { where: { id: parseInt(id) } } }, () => location.reload());
}