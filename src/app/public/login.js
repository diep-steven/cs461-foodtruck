const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submit = document.getElementById("submit");

submit.addEventListener("click", loginUser);

function loginUser() {
    const payload = {
        username: usernameInput.value,
        password: passwordInput.value
    };

        fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.status === 200) {
                    window.location.reload();
                } else {
                    console.log("Failed to login");
                }
            })
            .catch((error) => {
                console.log(error);
            });
}