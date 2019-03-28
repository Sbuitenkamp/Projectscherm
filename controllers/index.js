$.post('/select', { table: 'projects', options: { where: { id: 1 } } }, data => {
    console.log(data);
});