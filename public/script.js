document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/isAuthenticated');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result.authenticated) {
            document.getElementById('navProfile').style.display = 'inline';
            document.getElementById('navLogout').style.display = 'inline';
        } else {
            document.getElementById('navRegister').style.display = 'inline';
            document.getElementById('navLogin').style.display = 'inline';
        }
    } catch (error) {
        console.error('Erreur:', error);
    }

    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/logout');
                const result = await response.json();
                if (response.ok) {
                    window.location.href = 'index.html';
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        });
    }
});

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, email: email, password: password })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = 'index.html';
        } else {
            alert(result.error);
        }
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = 'index.html';
        } else {
            alert(result.error);
        }
    });
}
