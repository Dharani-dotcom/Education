// auth.js - Authentication functionality

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    checkAuthStatus();
});

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // ✅ Save loginTime so session can expire after 7 days
        const sessionUser = {
            ...user,
            loginTime: Date.now()
        };
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));

        if (user.role === 'admin') {
            window.location.href = 'admin/index.html';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        alert('User already exists');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: 'user',
        loginTime: Date.now() // ✅ Save loginTime on register too
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('Registration successful!');
    window.location.href = 'index.html';
}

function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        // ✅ Check if session has expired (7 days)
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
        const isExpired = !currentUser.loginTime || (Date.now() - currentUser.loginTime > SEVEN_DAYS);

        if (isExpired) {
            localStorage.removeItem('currentUser');
            // If on a protected page, redirect to login
            if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
                window.location.href = 'login.html';
            }
            return;
        }

        // Prevent admin accessing user pages and vice versa
        if (window.location.pathname.includes('admin') && currentUser.role !== 'admin') {
            window.location.href = '../index.html';
        }

        // ✅ If already logged in, skip login/register pages
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Initialize with admin user
function initializeAdmin() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.find(u => u.role === 'admin');

    if (!adminExists) {
        const admin = {
            id: 0,
            name: 'Admin',
            email: 'admin@edulearn.com',
            password: 'admin123',
            role: 'admin'
        };
        users.push(admin);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

initializeAdmin();
