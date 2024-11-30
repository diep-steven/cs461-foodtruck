let usernameInput = document.getElementById("username");
let emailInput = document.getElementById("email");
let passInput = document.getElementById("password");
let cpassInput = document.getElementById("cpassword");
let submit = document.getElementById("submit");

submit.addEventListener("click", createAccount);


console.log("hi");
function createAccount() {
    console.log("btn submitted");
    let payload = {
        username: usernameInput.value,
        email: emailInput.value,
        password: passInput.value,
        cpassword: cpassInput.value
    };

    console.log("payload: ", payload);

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
                    window.location.reload();
                }

            })
            .catch((error) => {
                console.log(error);
            });

}