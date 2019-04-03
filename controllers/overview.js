window.onload = () => {
    $.post('/select', {
        table: 'projects',
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
            order: [['lastUpdate', 'ASC']]
        }
    }, data => renderSelectData({ data, tableId: 'project-overview', deleteBtn: false }));
};