async function submit() {
    const form = document.getElementById('add-task-form');
    const formData = {
        taskName: form.task.value,
        description: form.description.value,
        isApproved: false    
    };
    await $.post('/send-session', null, session => formData.teamId = session.id);
    $.post('/create', { table: 'tasks', options: { ...formData } }, () => window.location = '/team-tasks');
}