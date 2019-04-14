const table = 'projects';
async function submit() {
    const form = document.getElementById('request-status-update-form');
    const formData = {
        requestedStatus: form.status.value,
        description: form.description.value,
        taskId: 0
    };

    await $.post('/send-session', null, session => formData.teamId = session.id);
    if (!formData.teamId) return alert('geen project toegewezen');
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
        formData.managerId = data[0].managerId; 
        formData.projectId = data[0].id;
    });
    
    $.post('/create', { table: 'requests', options: { ...formData } }, () => window.location = '/team-overview.html');
}
