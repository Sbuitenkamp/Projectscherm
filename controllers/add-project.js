function submit() {
    const form = document.getElementById('add-project-form');
    const formData = {
        managerId: 1,
        projectName: form.projectName.value,
        description: form.description.value
    };
    $.post('/moment', {
        dates: {
            startDate: form.startDate.value,
            endDate: form.endDate.value
        }
    }, dates => {
        for (const date in dates) formData[date] = dates[date];
        for (const key in formData) {
            if (key === 'description') continue;
            if (!formData[key]) return alert('Zorg ervoor dat alle velden zijn ingevuld!');
        }
        $.post('/create', { table: 'projects', options: { ...formData } }, () => window.location = '/manager-projects');
    });
}
