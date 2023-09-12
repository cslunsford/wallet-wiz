const loginFormHandler = async (event) => {
    event.preventDefault();

    const email = document.querySelector('#loginInput').value.trim();
    const password = document.querySelector('#loginPassword').value.trim();

    if (email && password) {
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
};

const registerFormHandler = async (event) => {
    event.preventDefault();

    const email = document.querySelector('#registerEmail').value.trim();
    const password = document.querySelector('#registerPassword').value.trim();

    if (email && password) {
        const response = await fetch('/register', {
            method: 'POST',
            body: JSON.Stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
};

document.querySelector('#login').addEventListener('click', loginFormHandler);
document.querySelector('#register').addEventListener('click', registerFormHandler);