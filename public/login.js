document.addEventListener('DOMContentLoaded', () => {
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
              window.location.href = 'index.html'; // Redirection après connexion réussie
          } else {
              alert(result.error);
          }
      });
  }
});
