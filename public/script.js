document.addEventListener('DOMContentLoaded', async () => {
    // Vérification de l'authentification
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

    // Gestion de la déconnexion
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

    // Fonction pour charger les données du profil
    const loadProfileData = async () => {
        try {
            const response = await fetch('/profileData');
            const data = await response.json();

            if (response.ok) {
                document.getElementById('firstNameDisplay').textContent = `Prénom: ${data.first_name}`;
                document.getElementById('lastNameDisplay').textContent = `Nom: ${data.last_name}`;
                document.getElementById('profilePicture').src = data.profile_image || 'default.jpg';
                document.getElementById('matchHistory').innerHTML = data.match_history.map(match => `<li>${match}</li>`).join('');
                document.getElementById('affiliationStatus').textContent = data.affiliation_status;

                // Pré-remplir le formulaire de modification
                document.getElementById('first_name').value = data.first_name;
                document.getElementById('last_name').value = data.last_name;
            } else {
                alert('Erreur lors de la récupération des données du profil');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Si nous sommes sur la page de profil, charger les données du profil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        await loadProfileData();

        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('first_name', document.getElementById('first_name').value);
            formData.append('last_name', document.getElementById('last_name').value);
            if (document.getElementById('profileImage').files[0]) {
                formData.append('profileImage', document.getElementById('profileImage').files[0]);
            }

            try {
                const response = await fetch('/updateProfile', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Profil mis à jour avec succès');
                    window.location.reload();
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        });

        // Gestion du popup de modification de profil
        const editProfileBtn = document.getElementById('editProfileBtn');
        const modal = document.getElementById('profileModal');
        const closeBtn = document.getElementsByClassName('close')[0];

        // Afficher le popup de modification du profil
        editProfileBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        // Fermer le popup
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Gestion du formulaire d'inscription
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
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

    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
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
});
