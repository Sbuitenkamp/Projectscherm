const table = 'projects';
window.onload = () => {
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
            where: { managerId: '1' },
            order: [['lastUpdate', 'ASC']]
        }
    }, data => renderSelectData({ data, tableId: 'project-overview', deleteBtn: true }));
};

function remove(id) {
    const yes = confirm('Weet u zeker dat u dit project wilt verwijderen?');
    if (yes) $.post('/destroy', { table, options: { where: { id: parseInt(id) } } }, () => location.reload());
}