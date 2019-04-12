async function submit() {
    const form = document.getElementById('add-project-form');
    const formData = {
        status: 1,
        projectName: form.projectName.value,
        description: form.description.value,
        startDate: form.startDate.value,
        endDate: form.endDate.value
    };

    await $.post('/send-session', null, session => formData.managerId = session.id);

    for (const key in formData) {
        if (key === 'description') continue;
        if (!formData[key]) return alert('Zorg ervoor dat alle velden zijn ingevuld!');
    }
    $.post('/create', { table: 'projects', options: { ...formData } }, () => window.location = '/manager-projects');
}
