let usernameInput = document.getElementById("username");
let emailInput = document.getElementById("email");
let passInput = document.getElementById("password");
let cpassInput = document.getElementById("cpassword");
let submit = document.getElementById("submit");

submit.addEventListener("click", createAccount);


function createAccount() {
    let payload = {
        username: usernameInput.value,
        email: emailInput.value,
        password: passInput.value,
        cpassword: cpassInput.value
    };

        fetch("/api/users/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Account creation successful");
                    window.location.href = "login";
                }

            })
            .catch((error) => {
                console.log(error);
            });

}