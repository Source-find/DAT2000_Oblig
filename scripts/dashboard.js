(function () {
    // Simple protection: check localStorage flag set by login page.
    if (localStorage.getItem('adminLoggedIn') !== '1') {
        // not logged in -> redirect to login
        window.location.href = 'admin.html';
    }

    document.getElementById('logout').addEventListener('click', function () {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'Admin.html';
    });
})();