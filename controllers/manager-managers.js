const table = 'managers';
window.onload = () => {
    $.post('/send-session', null, session => {
        $.post('/select', {
            table,
            options: {
                attributes: [
                    'id',
                    'username'
                ],
                include: [{
                    association: 'managerTeams',
                    attributes: ['username']
                }],
                where: { superUser: false }
            }
        }, data => {
            renderSelectData({ data, tableId: 'manager-overview', deleteBtn: true, editBtn: true })
        });
    });
};

function remove(id) {
    const yes = confirm('Weet u zeker dat u dit team wilt verwijderen?');
    if (yes) $.post('/destroy', { table, options: { where: { id: parseInt(id) } } }, () => location.reload());
}