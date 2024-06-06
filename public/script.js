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

    const loadProfileData = async () => {
        try {
            const response = await fetch('/profileData');
            const data = await response.json();

            if (response.ok) {
                console.log('Profil data:', data);
                document.getElementById('firstNameDisplay').textContent = `Prénom: ${data.first_name}`;
                document.getElementById('lastNameDisplay').textContent = `Nom: ${data.last_name}`;
                document.getElementById('profilePicture').src = data.profile_image || 'default.jpg';
                document.getElementById('subscriptionValidUntil').textContent = `Cotisation valable jusqu'au: ${data.subscription_valid_until || 'Non spécifiée'}`;
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

        const editProfileBtn = document.getElementById('editProfileBtn');
        const modal = document.getElementById('profileModal');
        const closeBtn = document.getElementsByClassName('close')[0];

        editProfileBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }
});
