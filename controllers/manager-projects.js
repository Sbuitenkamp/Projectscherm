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
    }, data => {
        data.forEach((result) => {
            const index = result.id;
            document.getElementById('project-overview').innerHTML += `<tr id="result${index}"></tr>`;
            for (const col in result) {
                if (col.trim().toLowerCase() === 'id') continue;
                parseDates(result, col);
                document.getElementById(`result${index}`).innerHTML += `<td>${result[col] || 'geen'}</td>`
            }
            document.getElementById(`result${index}`).innerHTML += `<td><button onclick="remove(${index});">Verwijderen</button></td>`
        });
    });
};

function remove(id) {
    const yes = confirm('Weet u zeker dat u dit project wilt verwijderen?');
    if (yes) $.post('/destroy', { table, options: { where: { id: parseInt(id) } } }, () => location.reload());
}