let id;

function submit() {
    const form = document.getElementById('edit-task-form');
    $.post('/send-session', null, session => {
        id = session.savedId;
    $.post('/update', {
        table: 'tasks',
        values: {
            isApproved: form.status.value
        },
        options: { where: { id } }
    }, result => {
        if (!result) alert('Er is iets misgegaan met het updaten van de task');
        else window.location = '/team-tasks';
    });
});
}