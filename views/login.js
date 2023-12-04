// login.js

async function login(e) {
    e.preventDefault();

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    };

    try {
        // Use Axios to make a POST request for login
        const response = await axios.post('http://localhost:3000/api/users/login', loginDetails);

        // Handle the response
        if (response.status === 200) {
            const token = response.data.token;

            // Save the token in local storage
            localStorage.setItem('token', token);

            alert('Successfully logged in! Token saved in local storage.');

            // You may redirect the user to the dashboard or another page on successful login
        } else {
            alert(`Error: ${response.data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
