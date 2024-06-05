// nav.js

document.addEventListener('DOMContentLoaded', function () {
    const navbarContainer = document.getElementById('navbar-container');

    const navbarHTML = `
        <nav class="navbar">
            <ul class="navbar-list">
                <li class="navbar-item"><a href="index.html">Accueil</a></li>
                <li class="navbar-item"><a href="actualites.html">Actualités</a></li>
                <li class="navbar-item"><a href="contact.html">Contact</a></li>
                <li class="navbar-item"><a href="about.html">À propos</a></li>
            </ul>
        </nav>
    `;

    navbarContainer.innerHTML = navbarHTML;
});
