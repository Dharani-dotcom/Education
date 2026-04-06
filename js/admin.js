// admin.js - Admin panel functionality

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadCoursesForAdmin();
    setupAddCourseForm();
    setupEditForm();
    setupLogout();
});

function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = '../login.html';
    } else {
        document.getElementById('user-name').textContent = `Welcome, ${currentUser.name}!`;
    }
}

function loadCoursesForAdmin() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const adminCourseList = document.getElementById('adminCourseList');
    adminCourseList.innerHTML = '';

    courses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = 'admin-course-item';
        courseItem.innerHTML = `
            <div>
                <h4>${course.title}</h4>
                <p>${course.description}</p>
                <p>Instructor: ${course.instructor} | Price: $${course.price} | Image: ${course.image}</p>
                <p>Google Form: ${course.googleFormLink || 'Not set'}</p>
            </div>
            <div>
                <button class="edit-btn" data-id="Rs{course.id}">Edit</button>
                <button class="delete-btn" data-id="Rs{course.id}">Delete</button>
            </div>
        `;
        adminCourseList.appendChild(courseItem);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editCourse);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteCourse);
    });
}

function setupAddCourseForm() {
    const addCourseForm = document.getElementById('addCourseForm');
    addCourseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('courseTitle').value;
        const description = document.getElementById('courseDescription').value;
        const instructor = document.getElementById('courseInstructor').value;
        const price = document.getElementById('coursePrice').value;
        const image = document.getElementById('courseImage').value || 'images/course-placeholder.jpg';
        const googleFormLink = document.getElementById('courseGoogleForm').value || null;

        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        const newCourse = {
            id: Date.now(),
            title,
            description,
            instructor,
            price: parseFloat(price),
            image,
            googleFormLink
        };

        courses.push(newCourse);
        localStorage.setItem('courses', JSON.stringify(courses));

        addCourseForm.reset();
        loadCoursesForAdmin();
        alert('Course added successfully!');
    });
}

function editCourse(e) {
    const courseId = parseInt(e.target.getAttribute('data-id'));
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses.find(c => c.id === courseId);

    if (course) {
        document.getElementById('editCourseId').value = course.id;
        document.getElementById('editCourseTitle').value = course.title;
        document.getElementById('editCourseDescription').value = course.description;
        document.getElementById('editCourseInstructor').value = course.instructor;
        document.getElementById('editCoursePrice').value = course.price;
        document.getElementById('editCourseImage').value = course.image;
        document.getElementById('editGoogleForm').value = course.googleFormLink || '';

        document.getElementById('editForm').style.display = 'block';
        document.getElementById('adminCourseList').style.display = 'none';
    }
}

function deleteCourse(e) {
    const courseId = parseInt(e.target.getAttribute('data-id'));
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses = courses.filter(course => course.id !== courseId);
    localStorage.setItem('courses', JSON.stringify(courses));
    loadCoursesForAdmin();
    alert('Course deleted successfully!');
}

function setupEditForm() {
    const editCourseForm = document.getElementById('editCourseForm');
    editCourseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('editCourseId').value);
        const title = document.getElementById('editCourseTitle').value;
        const description = document.getElementById('editCourseDescription').value;
        const instructor = document.getElementById('editCourseInstructor').value;
        const price = parseFloat(document.getElementById('editCoursePrice').value);
        const image = document.getElementById('editCourseImage').value;
        const googleFormLink = document.getElementById('editGoogleForm').value || null;

        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        const courseIndex = courses.findIndex(c => c.id === id);
        if (courseIndex !== -1) {
            courses[courseIndex] = { id, title, description, instructor, price, image, googleFormLink };
            localStorage.setItem('courses', JSON.stringify(courses));
            loadCoursesForAdmin();
            cancelEdit();
            alert('Course updated successfully!');
        }
    });

    const cancelBtn = document.getElementById('cancelEdit');
    cancelBtn.addEventListener('click', cancelEdit);
}

function cancelEdit() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('adminCourseList').style.display = 'block';
    document.getElementById('editCourseForm').reset();
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    });
}
