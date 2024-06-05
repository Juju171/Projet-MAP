// Crée une fonction pour générer la barre de navigation
function createNavbar() {
  return `
      <nav>
          <ul>
              <li><a href="index.html">Accueil</a></li>
              <li><a href="actualites.html">Actualités</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="a_propos.html">À propos</a></li>
          </ul>
      </nav>
  `;
}

// Insère la barre de navigation dans l'élément avec l'ID "navbar"
document.getElementById('navbar').innerHTML = createNavbar();
