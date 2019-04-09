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
    }, data => renderSelectData({ data, tableId: 'task-overview', deleteBtn: true }));
});
};

function remove(id) {
    const yes = confirm('Weet u zeker dat u dit project wilt verwijderen?');
    if (yes) $.post('/destroy', { table, options: { where: { id: parseInt(id) } } }, () => location.reload());
}