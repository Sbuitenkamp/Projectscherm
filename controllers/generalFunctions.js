// only if you use Model.findAll();
function parseDates(table, col) {
    if (['startDate', 'endDate'].includes(col)) {
        table[col] = (() => {
            const date = new Date(table[col]);
            return `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
        })();
    }
    if (col === 'delay') table[col] = `+${table[col]} ${table[col] === 1 ? ' dag' : 'dagen'}`;
}