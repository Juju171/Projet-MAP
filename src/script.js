document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const firstName = document.getElementById('first_name').value;
  const lastName = document.getElementById('last_name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email: email, password: password })
  });

  const result = await response.json();
  if (response.ok) {
      alert(result.message);
  } else {
      alert(result.error);
  }
});
