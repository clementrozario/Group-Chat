document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Validate form fields
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const phone = form.querySelector('#phone').value;
        const password = form.querySelector('#password').value;

        if (!name || !email || !phone || !password) {
            alert('All fields are required');
            return;
        }

        // Send data to the server
        try {
            const response = await axios.post('http://localhost:3000/signup', {
                name,
                email,
                phone,
                password,
            });

            const data = response.data;

            if (response.status === 201) {
                alert('Sign up successful!');
                // Optionally, redirect to a new page or update UI
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Internal Server Error');
        }
    });
});
