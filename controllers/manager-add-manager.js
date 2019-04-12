async function submit() {
    const form = document.getElementById('add-manager-form');
    const formData = { username: form.username.value };
    await $.post('/hash', { password: form.password.value }, hashedPassword => formData.password = hashedPassword);
    for (const key in formData) if (!formData[key]) return alert('Zorg ervoor dat alle velden zijn ingevuld!');
    $.post('/create', { table: 'managers', options: { ...formData } }, () => window.location = '/manager-managers');
}