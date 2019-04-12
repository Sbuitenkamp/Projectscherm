// only if you use Model.findAll();
function parseDates(table, col) {
    if (['startDate', 'endDate'].includes(col)) {
        table[col] = (() => {
            const date = new Date(table[col]);
            let month = String(date.getMonth() + 1);
            let day = String(date.getDate());
            const year = String(date.getFullYear());
            if (day.length < 2) day = '0' + day;
            if (month.length < 2) month = '0' + month;
            return `${day}-${month}-${year}`;
        })();
    }
    if (col === 'delay') table[col] = table[col] ? `+${table[col]} ${table[col] === 1 ? ' dag' : 'dagen'}` : 'geen';
}

function renderSelectData({ data, tableId, deleteBtn, editBtn }) {
    data.forEach((result) => {
        const index = result.id;
        document.getElementById(tableId).innerHTML += `<tr id='result${index}'></tr>`;
        for (const col in result) {
            if (col.trim().toLowerCase() === 'id') continue;
            parseDates(result, col);
            document.getElementById(`result${index}`).innerHTML += `<td>${result[col] ? result[col].username || result[col] : 'geen'}</td>`
        }
        if (deleteBtn) document.getElementById(`result${index}`).innerHTML += `<td><button onclick="remove(${index});">Verwijderen</button></td>`;
        if (editBtn) document.getElementById(`result${index}`).innerHTML += `<td><button onclick="edit(${index});">Aanpassen</button></td>`;
    });
}

function logOut() {
    $.post('/logout', null, completed => {
        if (completed) window.location = '/';
    });
}