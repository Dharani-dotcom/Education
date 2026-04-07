// ✅ Wait for DOM to be ready before running anything
document.addEventListener('DOMContentLoaded', function () {
    initializeCourses();
    loadCourses();
    setupNavigation();
    setupContactForm();
    checkLoginStatus();
});

function initializeCourses() {
    // ✅ Always reset courses so latest data is used (remove stale localStorage data)
    const defaultCourses = [
        {
            id: 1,
            title: 'AI - Future?',
            description: 'Learn what will be the future of developers.',
            instructor: 'Gowthan Sevathan - AI Research Scientist - IBM',
            price: 99,
            image: 'images/course-placeholder.jpg',
            googleFormLink: "https://docs.google.com/forms/d/e/1FAIpQLSdAEze1SfSo3G8coG7-_g5elkcVfvxz7IbkiY2omfggXUpwPA/viewform?usp=dialog"
        },
        {
            id: 2,
            title: 'Web Development Fundamentals',
            description: 'Build modern websites with React, HTML, CSS, and JavaScript.',
            instructor: 'Guru',
            price: 119,
            image: 'images/course-placeholder.jpg',
            googleFormLink: null
        },
        {
            id: 3,
            title: 'Data Science Essentials',
            description: 'Explore data analysis and machine learning basics.',
            instructor: 'Ittyavira C Abhaham',
            price: 199,
            image: 'images/course-placeholder.jpg',
            googleFormLink: null
        }
    ];
    localStorage.setItem('courses', JSON.stringify(defaultCourses));
}

function loadCourses() {
    const courses = JSON.parse(localStorage.getItem('courses'));

    // ✅ Guard: make sure the element exists before using it
    const courseGrid = document.getElementById('courseGrid');
    if (!courseGrid) {
        console.warn('courseGrid element not found on this page.');
        return;
    }

    courseGrid.innerHTML = '';

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card'; // ✅ matches CSS selector

        const isEnrolled = currentUser &&
            currentUser.enrolledCourses &&
            currentUser.enrolledCourses.includes(course.id);

        const buttonText = course.googleFormLink
            ? 'Enroll via Form'
            : (isEnrolled ? 'Enrolled' : 'Enroll');

        const buttonClass = isEnrolled ? 'enrolled' : '';

        courseCard.innerHTML = `
            <img src="${course.image}" alt="${course.title}" onerror="this.src='https://placehold.co/400x200?text=Course'">
            <div class="course-info">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <p class="price">$${course.price}</p>
                <p><strong>Instructor:</strong> ${course.instructor}</p>
                ${currentUser
                    ? `<button class="enroll-btn ${buttonClass}" data-id="${course.id}">${buttonText}</button>`
                    : '<p class="login-prompt">Login to enroll</p>'
                }
            </div>
        `;

        courseGrid.appendChild(courseCard);
    });

    // ✅ Attach enroll listeners after cards are in the DOM
    document.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', enrollInCourse);
    });
}

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you! We will contact you soon.');
        contactForm.reset();
    });
}

function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');

    // ✅ Guard each element before touching it
    if (currentUser) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (userInfo) userInfo.style.display = 'block';
        if (userName) userName.textContent = `Welcome, ${currentUser.name}!`;
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }

    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            location.reload();
        });
    }
}

function enrollInCourse(e) {
    const courseId = parseInt(e.target.getAttribute('data-id'));
    const courses = JSON.parse(localStorage.getItem('courses'));
    const course = courses.find(c => c.id === courseId);

    if (!course) return;

    // ✅ Open Google Form in new tab if linked
    if (course.googleFormLink) {
        window.open(course.googleFormLink, '_blank');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('Please login first!');
        return;
    }

    if (!currentUser.enrolledCourses) {
        currentUser.enrolledCourses = [];
    }

    if (currentUser.enrolledCourses.includes(courseId)) {
        // Toggle off: unenroll
        currentUser.enrolledCourses = currentUser.enrolledCourses.filter(id => id !== courseId);
        e.target.textContent = 'Enroll';
        e.target.classList.remove('enrolled');
    } else {
        // Enroll
        currentUser.enrolledCourses.push(courseId);
        e.target.textContent = 'Enrolled';
        e.target.classList.add('enrolled');
    }

    // ✅ Persist updated user to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // ✅ Also update the users array so enrollment survives logout/login
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}
