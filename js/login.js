document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    if (res.ok) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      window.location.href = 'index.html';
    } else {
      const data = await res.json();
      document.getElementById('loginMessage').textContent = data.error || 'Innlogging feilet';
    }
  } catch (err) {
    document.getElementById('loginMessage').textContent = 'Serverfeil';
  }
});
<html lang="no">
<head>
  <meta charset="UTF-8">
  <title>Logg inn - UT.no-klone</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <h1>Logg inn</h1>
  <form id="loginForm">
    <label for="email">E-post:</label>
    <input type="email" id="email" name="email" required>
    <label for="name">Navn:</label>
    <input type="text" id="name" name="name" required>
    <button type="submit">Logg inn</button>
  </form>
  <div id="loginMessage"></div>
  <script src="js/login.js"></script>
</body>
</html>

