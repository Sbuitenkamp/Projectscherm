const table = 'teams';
window.onload = () => {
    $.post('/select', {
        table,
        options: {
            attributes: [
                'id',
                'username',
                'password',
                'members'
            ],
            where: { managerId: '1' }
        }
    }, data => {
        data.forEach((result) => {
            const index = result.id;
            document.getElementById('team-overview').innerHTML += `<tr id="result${index}"></tr>`;
            for (const col in result) {
                if (col.trim().toLowerCase() === 'id') continue;
                if (col.trim().toLowerCase() === 'members') {
                    const names = result[col].split(/,+/g);
                    names.forEach((name, index) => names[index] = name.charAt(0).toUpperCase() + name.slice(1));
                    result[col] = names.join(', ');
                }
                if (col.trim().toLowerCase() === 'password') {
                    // $.post('/unhash')
                    // TODO unhash function
                }
                document.getElementById(`result${index}`).innerHTML += `<td>${result[col] || 'geen'}</td>`
            }
            document.getElementById(`result${index}`).innerHTML += `<td><button onclick="remove(${index});">Verwijderen</button></td>`
        });
    });
};

function remove(id) {
    const yes = confirm('Weet u zeker dat u dit team wilt verwijderen?');
    if (yes) $.post('/destroy', { table, options: { where: { id: parseInt(id) } } }, () => location.reload());
}