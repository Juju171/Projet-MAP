document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
      loginForm.addEventListener('submit', async function(e) {
          e.preventDefault();

          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          try {
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
              } else {
                  alert(result.error);
              }
          } catch (error) {
              console.error('Erreur:', error);
              alert('Une erreur est survenue. Veuillez réessayer.');
          }
      });
  }
});
