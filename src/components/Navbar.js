// navbar.js

// Fonction pour injecter la barre de navigation
function loadNavbar() {
  const navbarHTML = `
      <header>
          <nav>
              <ul>
                  <li><a href="index.html">Accueil</a></li>
                  <li><a href="actualites.html">Actualités</a></li>
                  <li><a href="classement.html">Classement</a></li>
                  <li><a href="recherche_joueur.html">Recherche de joueur</a></li>
                  <li><a href="galerie.html">Galerie</a></li>
                  <li><a href="tournoi.html">Tournoi</a></li>
                  <li><a href="profil.html">Profil</a></li>
              </ul>
          </nav>
      </header>
  `;
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
}

// Charger la barre de navigation lorsque le document est prêt
document.addEventListener('DOMContentLoaded', loadNavbar);
