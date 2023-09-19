const loginFormHandler = async (event) => {
    event.preventDefault();

    const email = $('#loginEmail').val().trim();
    const password = $('#loginPassword').val().trim();

    if (email && password) {
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            const errorMessage = await response.json();
            alert(errorMessage.message);
        }
    }
};

const registerFormHandler = async (event) => {
    event.preventDefault();

    const email = $('#registerEmail').val().trim();
    const password = $('#registerPassword').val().trim();
    const passwordConfirm = $('#repeatPassword').val().trim();

    if (email && password) {
        const response = await fetch('/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, passwordConfirm }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            const errorMessage = await response.json();
            alert(errorMessage.message);
        }
    }
};

if ($('#registerButton')) {
    $('#registerButton').on('click', function () {
        window.location.href = '/register';
    });
};

if ($('#loginButton')) {
    $('#loginButton').on('click', loginFormHandler);
};

if ($('#register')) {
    $('#register').on('click', registerFormHandler);
};