function login(e) {
    e.preventDefault();
    console.log(e.target.name);

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    };

    console.log(loginDetails);

    axios.post('http://localhost:3000/user/login', loginDetails)
        .then(response => {
            if (response.data.success) {
                alert(response.data.message);
                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                window.location.href = "./chat.html";
            } else {
                alert(response.data.message); // Display error message
            }
        })
        .catch(err => {
            console.log(JSON.stringify(err));
            document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
        });
}
