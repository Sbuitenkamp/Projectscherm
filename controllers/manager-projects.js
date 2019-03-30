window.onload = () => {
    $.post('/select', {
        table: 'projects',
        options: {
            attributes: [
                'projectName',
                'status',
                'startDate',
                'endDate',
                'delay',
                'description'
            ],
            where: { id: '1' },
            order: [['lastUpdate', 'ASC']]

        }
    }, data => {
        data.forEach((result, index) => {
            document.getElementById('project-overview').innerHTML += `<tr id="result${index}"></tr>`;
            for (const col in result) {
                parseDates(result, col);
                document.getElementById(`result${index}`).innerHTML += `<td>${result[col] || 'geen'}</td>`
            }
        });
    });
};