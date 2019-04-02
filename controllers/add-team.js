function submit() {
    const form = document.getElementById('add-team-form');
    const formData = {
        managerId: 1,
        username: form.username.value,
        password: form.password.value,
        members: form.members.value
    };
    for (const key in formData) {
        if (key === 'members') continue;
        if (!formData[key]) return alert('Zorg ervoor dat alle velden zijn ingevuld!');
    }
    $.post('/create', { table: 'teams', options: { ...formData } }, () => window.location = '/manager-teams');
}