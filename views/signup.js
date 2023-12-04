async function signup(e) {
    try {
        e.preventDefault();

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            password: e.target.password.value
        };

        const response = await axios.post('http://localhost:3000/api/users/signup', signupDetails);

        if (response.status === 201) {
            alert('Successfully signed up!');
            window.location.href = './login.html'; // Redirect to login page on successful signup
        } else if (response.status === 409) {
            alert('User already exists. Please Login.');
        } else {
            throw new Error('Failed to signup');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}
