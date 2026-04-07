<script>
document.addEventListener('DOMContentLoaded', function () {
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
}

function loadCourses() {
    let courses = JSON.parse(localStorage.getItem('courses'));
    const courseGrid = document.getElementById('courseGrid');
    courseGrid.innerHTML = '';

    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const isEnrolled = currentUser && currentUser.enrolledCourses && currentUser.enrolledCourses.includes(course.id);

        const buttonText = course.googleFormLink 
            ? 'Enroll via Form' 
            : (isEnrolled ? 'Enrolled' : 'Enroll');

        const buttonClass = isEnrolled ? 'enrolled' : '';

        courseCard.innerHTML = `
            <img src="${course.image}" alt="${course.title}">
            <div class="course-info">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <p class="price">$${course.price}</p>
                <p><strong>Instructor:</strong> ${course.instructor}</p>
                ${currentUser 
                    ? `<button class="enroll-btn ${buttonClass}" data-id="${course.id}">${buttonText}</button>` 
                    : '<p>Login to enroll</p>'}
            </div>
        `;

        courseGrid.appendChild(courseCard);
    });

    document.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', enrollInCourse);
    });
}

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
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
        currentUser.enrolledCourses = currentUser.enrolledCourses.filter(id => id !== courseId);
        e.target.textContent = 'Enroll';
        e.target.classList.remove('enrolled');
    } else {
        currentUser.enrolledCourses.push(courseId);
        e.target.textContent = 'Enrolled';
        e.target.classList.add('enrolled');
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}
</script>
