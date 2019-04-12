const table = 'projects';
async function submit() {
    const form = document.getElementById('request-status-update-form');
    const formData = {
        requestedStatus: form.status.value,
        description: form.description.value, 
        taskId: form.completedTasks.value,
        // manager-projects.js and db.js for relations 
    };

    await $.post('/send-session', null, session => formData.teamId = session.id);

     await $.post('/select', {
        table,
        options: {
            attributes: [
                'id',
                'managerId'
            ],
            where: { teamId: formData.teamId },
        }
    }, data => {
        // console.log(data[0].id);
        formData.managerId = data[0].managerId; 
        formData.projectId = data[0].id;
    });
    
    console.log(formData);
    $.post('/create', { table: 'requests', options: { ...formData } });
}
// , () => window.location = '/team-overview.html')