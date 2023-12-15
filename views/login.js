function showSignUpForm() {
    document.getElementById("signupForm").style.display = "flex";
    document.getElementById("loginForm").style.display = "none";
}

function showSignInForm() {
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "flex";
}

async function logInUser(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const user = {
        email, password
    };
    try {
        const response = await axios.post("http://3.110.103.250:3000/user/login", user);
        if (response.data.success) {
            alert(response.data.message);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            window.location.href = "./chatApp.html";
        } else {
            alert(response.data.message);
        }
    } catch (err) {
        console.log(err);
    }
}

function saveUser(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email1.value;
    const phone = event.target.phone.value;
    const password = event.target.password1.value;
    const user = { name, email, phone, password };

    axios.post("http://3.110.103.250:3000/user/signup", user)
        .then(response => {
            console.log(response.data); // Log the response for debugging
            alert(response.data.message);
            if (response.data.success) {
                // Redirect to the login page after successful signup
                showSignInForm();

            }
        })
        .catch(err => console.log(err));
}
