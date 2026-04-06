// script.js - Main page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeCourses();
    loadCourses();
    setupNavigation();
    setupContactForm();
    checkLoginStatus();
});

function initializeCourses() {
    if (!localStorage.getItem('courses')) {
        const defaultCourses = [
            {
                id: 1,
                title: 'Introduction to Programming',
                description: 'Learn the basics of programming with Python.',
                instructor: 'John Doe',
                price: 99,
                image: 'images/course-placeholder.jpg',
                googleFormLink: null
            },
            {
                id: 2,
                title: 'Web Development Fundamentals',
                description: 'Build modern websites with HTML, CSS, and JavaScript.',
                instructor: 'Jane Smith',
                price: 149,
                image: 'images/course-placeholder.jpg',
                googleFormLink: null
            },
            {
                id: 3,
                title: 'Data Science Essentials',
                description: 'Explore data analysis and machine learning basics.',
                instructor: 'Bob Johnson',
                price: 199,
                image: 'images/course-placeholder.jpg',
                googleFormLink: null
            }
        ];
        localStorage.setItem('courses', JSON.stringify(defaultCourses));
    }
}

function loadCourses() {
    let courses = JSON.parse(localStorage.getItem('courses'));
    if (!courses) {
        courses = getDefaultCourses();
        localStorage.setItem('courses', JSON.stringify(courses));
    }
    const courseGrid = document.getElementById('courseGrid');
    courseGrid.innerHTML = '';

    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const isEnrolled = currentUser && currentUser.enrolledCourses && currentUser.enrolledCourses.includes(course.id);
        const buttonText = course.googleFormLink ? 'Enroll via Form' : (isEnrolled ? 'Enrolled' : 'Enroll');
        const buttonClass = course.googleFormLink ? '' : (isEnrolled ? 'enrolled' : '');
        courseCard.innerHTML = `
            <img src="${course.image || 'images/course-placeholder.jpg'}" alt="${course.title}">
            <div class="course-info">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <p class="price">$${course.price}</p>
                <p><strong>Instructor:</strong> ${course.instructor}</p>
                ${currentUser ? `<button class="enroll-btn ${buttonClass}" data-id="${course.id}">${buttonText}</button>` : '<p>Login to enroll</p>'}
            </div>
        `;
        courseGrid.appendChild(courseCard);
    });

    // Add event listeners for enroll buttons
    document.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', enrollInCourse);
    });
}

function getDefaultCourses() {
    return [
        {
            id: 1,
            title: 'Introduction to Programming',
            description: 'Learn the basics of programming with Python.',
            instructor: 'John Doe',
            price: 99,
            image: 'images/course-placeholder.jpg',
            googleFormLink: null
        },
        {
            id: 2,
            title: 'Web Development Fundamentals',
            description: 'Build modern websites with HTML, CSS, and JavaScript.',
            instructor: 'Jane Smith',
            price: 149,
            image: 'images/course-placeholder.jpg',
            googleFormLink: null
        },
        {
            id: 3,
            title: 'Data Science Essentials',
            description: 'Explore data analysis and machine learning basics.',
            instructor: 'Bob Johnson',
            price: 199,
            image: 'images/course-placeholder.jpg',
            googleFormLink: null
        }
    ];
}

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');

    if (currentUser) {
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        userInfo.style.display = 'block';
        userName.textContent = `Welcome, ${currentUser.name}!`;
    } else {
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        userInfo.style.display = 'none';
    }

    // Setup logout
    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        location.reload();
    });
}

function enrollInCourse(e) {
    const courseId = parseInt(e.target.getAttribute('data-id'));
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses.find(c => c.id === courseId);
    
    if (course && course.googleFormLink) {
        window.open(course.googleFormLink, '_blank');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to enroll in courses.');
        return;
    }

    if (!currentUser.enrolledCourses) {
        currentUser.enrolledCourses = [];
    }

    if (currentUser.enrolledCourses.includes(courseId)) {
        // Unenroll
        currentUser.enrolledCourses = currentUser.enrolledCourses.filter(id => id !== courseId);
        e.target.textContent = 'Enroll';
        e.target.classList.remove('enrolled');
    } else {
        // Enroll
        currentUser.enrolledCourses.push(courseId);
        e.target.textContent = 'Enrolled';
        e.target.classList.add('enrolled');
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    // Update users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}