// only if you use Model.findAll();
function parseDates(table, col) {
    if (['startDate', 'endDate'].includes(col)) {
        table[col] = (() => {
            const date = new Date(table[col]);
            return `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
        })();
    }
    if (col === 'delay') table[col] = table[col] ? `+${table[col]} ${table[col] === 1 ? ' dag' : 'dagen'}` : 'geen';
}

function renderSelectData({ data, tableId, deleteBtn }) {
    data.forEach((result) => {
        const index = result.id;
        document.getElementById(tableId).innerHTML += `<tr id='result${index}'></tr>`;
        for (const col in result) {
            if (col.trim().toLowerCase() === 'id') continue;
            parseDates(result, col);
            document.getElementById(`result${index}`).innerHTML += `<td>${result[col] || 'geen'}</td>`
        }
        if (deleteBtn) document.getElementById(`result${index}`).innerHTML += `<td><button onclick='remove(${index});'>Verwijderen</button></td>`
    });
}

function logOut() {
    $.post('/logout', null, completed => {
        if (completed) window.location = '/';
    });
}