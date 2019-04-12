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
    }, data => renderSelectData({ data, tableId: 'task-overview'}));
});
};

//TODO: edit tasks(completed/not completed), delete

