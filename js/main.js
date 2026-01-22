// ==================== العناصر الأساسية ====================
const loginForm = document.querySelector(".login-form form");
const loginModal = document.getElementById("login");
const closeBtn = document.getElementById("close");
const body = document.querySelector("body");
const signInBtn = document.getElementById("signIn");
const userBox = document.getElementById("user");
const logoutBtn = document.getElementById("logoutBtn");

// ==================== إظهار/إخفاء الـ Password ====================
const passwordInput = document.getElementById("passwordField");
const togglePassword = document.getElementById("togglePassword");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    togglePassword.classList.toggle("bi-eye");
    togglePassword.classList.toggle("bi-eye-slash");
  });
}

// ==================== فتح/إغلاق المودال ====================
if (signInBtn) {
  signInBtn.addEventListener("click", () => {
    loginModal.style.display = "flex";
    body.style.overflow = "hidden";
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    loginModal.style.display = "none";
    body.style.overflow = "auto";
  });
}

// ==================== تحميل حالة تسجيل الدخول عند فتح الصفحة ====================
function updateUIBasedOnLoginState() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const userName = sessionStorage.getItem("userName");

  if (isLoggedIn && userName) {
    // المستخدم مسجل دخول
    if (signInBtn) {
      signInBtn.style.display = "none";
      signInBtn.classList.remove("show");
    }
    if (userBox) {
      userBox.style.display = "flex";
      userBox.classList.add("show");
      const userNameDisplay = userBox.querySelector(".user-name");
      if (userNameDisplay) {
        userNameDisplay.innerText = userName;
      }
    }
  } else {
    // المستخدم غير مسجل دخول
    if (signInBtn) {
      signInBtn.style.display = "flex";
      signInBtn.classList.add("show");
    }
    if (userBox) {
      userBox.style.display = "none";
      userBox.classList.remove("show");
    }
  }
}

// استدعاء الـ function عند تحميل الصفحة
updateUIBasedOnLoginState();

// ==================== معالجة تسجيل الدخول ====================
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = loginForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    if (email === "Ahmed@example.com" && password === "123456") {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userName", "Ahmed Mohamed");
      sessionStorage.setItem("userEmail", email);

      updateUIBasedOnLoginState();

      loginModal.style.display = "none";
      body.style.overflow = "auto";

      alert("Login successful!");

      emailInput.value = "";
      passwordInput.value = "";
    } else {
      alert("Invalid email or password!");
    }
  });
}

// ==================== معالجة تسجيل الخروج ====================
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");

    if (userBox) {
      userBox.style.display = "none";
      userBox.classList.remove("show");
      userBox.classList.remove("dropdown-open");
    }

    if (signInBtn) {
      signInBtn.style.display = "flex";
      signInBtn.classList.add("show");
    }

    alert("Logged out successfully");
  });
}

// ==================== Toggle الـ Dropdown ====================
const userInfo = userBox ? userBox.querySelector(".user-info") : null;

if (userInfo) {
  userInfo.addEventListener("click", (e) => {
    e.stopPropagation();
    userBox.classList.toggle("dropdown-open");
  });
}

// ==================== إغلاق الـ Dropdown عند الضغط خارجه ====================
document.addEventListener("click", (e) => {
  if (userBox && !userBox.contains(e.target)) {
    userBox.classList.remove("dropdown-open");
  }
});

// ==================== Header Scroll Effect ====================
const header = document.getElementById("Header");
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("headerFixed");
    navbar.classList.add("navbarFixed");
    backToTop.classList.remove("hide");
  } else {
    header.classList.remove("headerFixed");
    navbar.classList.remove("navbarFixed");
    backToTop.classList.add("hide");
  }
});

if (backToTop) {
  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// ==================== Dropdown Submenu ====================
document.querySelectorAll(".dropdown-submenu > a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    link.parentElement.classList.toggle("show");
  });
});

// ==================== Course Management ====================
let courses = [];
let currentIndex = -1;

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchBtn = document.getElementById("searchBtn");
const courseName = document.getElementById("courseName");
const courseCategory = document.getElementById("courseCategory");
const courseLevel = document.getElementById("courseLevel");
const lectuersNumber = document.getElementById("lectuersNumber");
const coursePrice = document.getElementById("coursePrice");
const courseImage = document.getElementById("courseImage");
const courseMedia = document.getElementById("courseMedia");
const courseRating = document.getElementById("courseRating");
const form = document.getElementById("form");

// تحميل الكورسات من localStorage
if (localStorage.getItem("ourcourses") != null) {
  courses = JSON.parse(localStorage.getItem("ourcourses"));
  displayCourses();
} else {
  courses = [];
}

// معالجة إضافة الكورس
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addCourse();
  });
}

function addCourse() {
  let course = {
    name: courseName.value,
    category: courseCategory.value,
    level: courseLevel.value,
    numbers: lectuersNumber.value,
    price: coursePrice.value,
    rating: courseRating.value,
    img: courseImage.files.length ? `img/${courseImage.files[0].name}` : "img/default.jpg",
    media: courseMedia.files.length ? courseMedia.files[0].name : "",
  };

  if (currentIndex === -1) {
    courses.push(course);
    notifyAlert("✅ Course added successfully!");
  } else {
    courses[currentIndex] = course;
    notifyAlert("✏️ Course updated successfully!");
    currentIndex = -1;
    submitBtn.innerText = "Add Course";
    cancelBtn.classList.add("d-none");
  }

  localStorage.setItem("ourcourses", JSON.stringify(courses));
  displayCourses();
  emptyInp();
}

function editForUpdate(index) {
  currentIndex = index;
  courseName.value = courses[index].name;
  courseCategory.value = courses[index].category;
  courseLevel.value = courses[index].level;
  lectuersNumber.value = courses[index].numbers;
  coursePrice.value = courses[index].price;
  courseRating.value = courses[index].rating;

  submitBtn.innerText = "Update Course";
  cancelBtn.classList.remove("d-none");
}

function cancelUpdate() {
  currentIndex = -1;
  emptyInp();
  submitBtn.innerText = "Add Course";
  cancelBtn.classList.add("d-none");
}

function notifyAlert(message) {
  alert(message);
}

function isCourseEnrolled(courseName) {
  let enrolledCourses = [];
  if (localStorage.getItem("enrolledCourses") != null) {
    enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses"));
  }
  return enrolledCourses.some(course => course.name === courseName);
}

function displayCourses() {
  const tbody = document.getElementById("tbody");
  if (tbody) {
    tbody.innerHTML = courses
      .map(
        (course, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${course.name}</td>
            <td>${course.category}</td>
            <td>${course.level}</td>
            <td>${course.price}</td>
            <td>
              <button onclick="deleteRow(${i})" class="btn btn-danger action-btn">Delete</button>
              <button onclick="editForUpdate(${i})" class="btn btn-warning action-btn">Update</button>
            </td>
          </tr>
        `
      )
      .join("");
  }

  const row = document.getElementById("row");
  if (row) {
    row.innerHTML = courses
      .map(
        (course, i) => `
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="cr">
              <div class="education-thumb">
                <img src="${course.img}" alt="${course.name}">
              </div>
              <div class="cr-body">
                <div class="education-title">
                  <h4><a href="#" class="a-style">${course.name}</a></h4>
                  <p>${course.category}</p>
                </div>
                <div class="courses-info">
                  <ul class="courses_info-ul">
                    <li class="courses_info-li">
                      <i class="bi bi-book"></i> ${course.numbers}
                    </li>
                    <li class="courses_info-li">
                      <i class="bi bi-bar-chart"></i> ${course.level}
                    </li>
                    <li class="courses_info-li">
                      <i class="bi bi-currency-dollar"></i> ${course.price}
                    </li>
                    <li class="courses_info-li">
                      <i class="bi bi-star-fill"></i> ${course.rating}K
                    </li>
                  </ul>
                </div>
                ${
                  isCourseEnrolled(course.name)
                    ? `<button class="btn btn-secondary w-100 mt-3" disabled>ENROLLED</button>`
                    : `<button onclick="enrollCourse(${i})" class="btn btn-main w-100 mt-3">Enroll Now</button>`
                }
              </div>
            </div>
          </div>
        `
      )
      .join("");
  }
}

function deleteAll() {
  courses.splice(0);
  localStorage.setItem("ourcourses", JSON.stringify(courses));
  displayCourses();
}

function deleteRow(i) {
  courses.splice(i, 1);
  localStorage.setItem("ourcourses", JSON.stringify(courses));
  displayCourses();
}

function emptyInp() {
  if (courseName) courseName.value = "";
  if (courseCategory) courseCategory.value = "";
  if (courseLevel) courseLevel.value = "";
  if (lectuersNumber) lectuersNumber.value = "";
  if (coursePrice) coursePrice.value = "";
  if (courseRating) courseRating.value = "";
  if (courseImage) courseImage.value = "";
  if (courseMedia) courseMedia.value = "";
}

function enrollCourse(courseIndex) {
  let enrolledCourses = [];
  if (localStorage.getItem("enrolledCourses") != null) {
    enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses"));
  }

  const selectedCourse = courses[courseIndex];
  const alreadyEnrolled = enrolledCourses.some(
    (course) => course.name === selectedCourse.name
  );

  if (alreadyEnrolled) {
    notifyAlert("⚠️ You already enrolled in this course");
    return;
  }

  enrolledCourses.push(selectedCourse);
  localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
  notifyAlert("🎉 Enrolled successfully!");
  displayCourses();
}

function displayEnrolledCourses() {
  const enrolledRow = document.getElementById("enrolledRow");
  if (!enrolledRow) return;

  const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses")) || [];

  if (enrolledCourses.length === 0) {
    enrolledRow.innerHTML = `
      <div class="col-12 text-center p-5">
        <p>You have not enrolled in any courses yet.</p>
      </div>
    `;
    return;
  }

  enrolledRow.innerHTML = enrolledCourses
    .map(
      (course, index) => `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="cr">
            <div class="education-thumb">
              <img src="${course.img}" alt="${course.name}">
            </div>
            <div class="cr-body">
              <div class="education-title">
                <h4><a href="#" class="a-style">${course.name}</a></h4>
                <p>${course.category}</p>
              </div>
              <div class="courses-info">
                <ul class="courses_info-ul">
                  <li class="courses_info-li">
                    <i class="bi bi-book"></i> ${course.numbers}
                  </li>
                  <li class="courses_info-li">
                    <i class="bi bi-bar-chart"></i> ${course.level}
                  </li>
                  <li class="courses_info-li">
                    <i class="bi bi-currency-dollar"></i> ${course.price}
                  </li>
                  <li class="courses_info-li">
                    <i class="bi bi-star-fill"></i> ${course.rating}K
                  </li>
                </ul>
              </div>
              <button onclick="removeEnrollment(${index})" class="btn btn-danger w-100 mt-3">
                Remove Enrollment
              </button>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

displayEnrolledCourses();

function removeEnrollment(index) {
  let enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
  enrolledCourses.splice(index, 1);
  localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
  displayEnrolledCourses();
  displayCourses();
}

function searchCourses(term) {
  term = term.toLowerCase().trim();
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(term) ||
    course.category.toLowerCase().includes(term) ||
    course.level.toLowerCase().includes(term)
  );
  renderCourseCards(filteredCourses);
}

function renderCourseCards(list) {
  const row = document.getElementById("row");
  if (!row) return;

  if (list.length === 0) {
    row.innerHTML = `
      <div class="col-12 text-center p-5">
        <h3>No courses found</h3>
      </div>
    `;
    return;
  }

  row.innerHTML = list
    .map(course => {
      const originalIndex = courses.findIndex(c => c.name === course.name);
      return `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="cr">
            <div class="education-thumb">
              <img src="${course.img}" alt="${course.name}">
            </div>
            <div class="cr-body">
              <div class="education-title">
                <h4><a href="#" class="a-style">${course.name}</a></h4>
                <p>${course.category}</p>
              </div>
              <div class="courses-info">
                <ul class="courses_info-ul">
                  <li class="courses_info-li">
                    <i class="bi bi-book"></i> ${course.numbers}
                  </li>
                  <li class="courses_info-li">
                    <i class="bi bi-bar-chart"></i> ${course.level}
                  </li>
                  <li class="courses_info-li">
                    <i class="bi bi-currency-dollar"></i> ${course.price}
                  </li>
                  <li class="courses_info-li">
                    <i class="bi bi-star-fill"></i> ${course.rating}K
                  </li>
                </ul>
              </div>
              ${
                isCourseEnrolled(course.name)
                  ? `<button class="btn btn-secondary w-100 mt-3" disabled>ENROLLED</button>`
                  : `<button onclick="enrollCourse(${originalIndex})" class="btn btn-main w-100 mt-3">Enroll Now</button>`
              }
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

if (searchBtn) {
  searchBtn.addEventListener("click", function () {
    const term = document.getElementById("search-input").value;
    sessionStorage.setItem("searchTerm", term);
    window.location.href = "courses.html";
  });
}

window.addEventListener("load", function () {
  const term = sessionStorage.getItem("searchTerm");
  if (term && document.getElementById("row")) {
    searchCourses(term);
    sessionStorage.removeItem("searchTerm");
  }
});

// ==================== Swiper Initialization ====================
if (typeof Swiper !== 'undefined') {
  // Team Swiper
  new Swiper(".teamSwiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 2000,
      reverseDirection: true,
      disableOnInteraction: false
    },
    speed: 800,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 4 },
    }
  });

  // Browse Course Swiper
  const browseCourseSwiper = new Swiper(".browseCourseSwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }
  });

  // Complete Course Swiper
  const completeCourseSwiper = new Swiper(".completeCourseSwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }
  });
}








// ==================== SLIDER INITIALIZATION ====================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
});

function initializeSlider() {
    // Check if tiny slider library is loaded
    if (typeof tns === 'undefined') {
        console.error('Tiny Slider library not loaded!');
        return;
    }

    // Check if slider container exists
    const sliderContainer = document.querySelector('.dash-course-slide');
    if (!sliderContainer) {
        console.warn('Slider container not found');
        return;
    }

    try {
        // Initialize the slider
        const slider = tns({
            container: '.dash-course-slide',
            items: 3,
            slideBy: 1,
            autoplay: true,
            autoplayTimeout: 2000,
            autoplayDirection: 'forward',
            autoplayButtonOutput: false,
            autoplayHoverPause: true,
            controls: true,
            controlsPosition: 'bottom',
            controlsText: [
                '<i class="bi bi-chevron-left"></i>',
                '<i class="bi bi-chevron-right"></i>'
            ],
            nav: false,
            mouseDrag: true,
            swipeAngle: 15,
            speed: 600,
            gutter: 20,
            edgePadding: 0,
            fixedWidth: false,
            autoWidth: false,
            loop: true,
            rewind: false,
            responsive: {
                0: {
                    items: 1,
                    gutter: 10
                },
                576: {
                    items: 1,
                    gutter: 15
                },
                768: {
                    items: 2,
                    gutter: 15
                },
                992: {
                    items: 3,
                    gutter: 20
                },
                1200: {
                    items: 3,
                    gutter: 20
                }
            },
            onInit: function(info) {
                console.log('Slider initialized successfully');
                updateControlsPosition();
            }
        });

        // Update controls position on window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                updateControlsPosition();
            }, 250);
        });

    } catch (error) {
        console.error('Error initializing slider:', error);
    }
}

function updateControlsPosition() {
    const controls = document.querySelector('.tns-controls');
    if (controls) {
        // Ensure controls are positioned correctly
        controls.style.position = 'absolute';
        controls.style.top = '50%';
        controls.style.transform = 'translateY(-50%)';
    }
}

// ==================== ALTERNATIVE SLIDER SETUP (FALLBACK) ====================

// If you prefer to initialize after window load
window.addEventListener('load', function() {
    // Double-check slider initialization
    const sliderElement = document.querySelector('.dash-course-slide .tns-slider');
    if (!sliderElement) {
        // Retry initialization if not already initialized
        setTimeout(initializeSlider, 100);
    }
});

// ==================== SLIDER UTILITIES ====================

// Function to go to specific slide
function goToSlide(slideNumber) {
    if (window.sliderInstance) {
        window.sliderInstance.goTo(slideNumber);
    }
}

// Function to get current slide info
function getCurrentSlide() {
    if (window.sliderInstance) {
        const info = window.sliderInstance.getInfo();
        return {
            currentIndex: info.index,
            slideCount: info.slideCount,
            displayIndex: info.displayIndex
        };
    }
    return null;
}

// ==================== TOUCH/SWIPE SUPPORT ====================

// Enhanced touch support for mobile devices
function enhanceTouchSupport() {
    const slider = document.querySelector('.dash-course-slide');
    if (!slider) return;

    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                const nextBtn = document.querySelector('[data-controls="next"]');
                if (nextBtn && !nextBtn.disabled) {
                    nextBtn.click();
                }
            } else {
                // Swipe right - previous slide
                const prevBtn = document.querySelector('[data-controls="prev"]');
                if (prevBtn && !prevBtn.disabled) {
                    prevBtn.click();
                }
            }
        }
    }
}

// Initialize touch support
enhanceTouchSupport();

// ==================== ACCESSIBILITY ENHANCEMENTS ====================

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    const sliderInFocus = document.activeElement.closest('.dash-course-slide');
    if (!sliderInFocus) return;

    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevBtn = document.querySelector('[data-controls="prev"]');
        if (prevBtn && !prevBtn.disabled) prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextBtn = document.querySelector('[data-controls="next"]');
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
    }
});

// ==================== ERROR HANDLING ====================

// Fallback if slider fails to load
setTimeout(function() {
    const sliderCheck = document.querySelector('.tns-slider');
    if (!sliderCheck) {
        console.warn('Slider may have failed to initialize. Applying fallback styles...');
        applyFallbackStyles();
    }
}, 2000);

function applyFallbackStyles() {
    const container = document.querySelector('.dash-course-slide');
    if (container) {
        container.style.display = 'flex';
        container.style.overflowX = 'auto';
        container.style.gap = '20px';
        
        const items = container.querySelectorAll('.singles_items');
        items.forEach(item => {
            item.style.flex = '0 0 auto';
            item.style.width = '350px';
        });
    }
}

// ==================== PERFORMANCE OPTIMIZATION ====================

// Lazy load slider if not in viewport
function lazyLoadSlider() {
    const sliderSection = document.querySelector('.dash-course-slide');
    if (!sliderSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initializeSlider();
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '100px'
    });

    observer.observe(sliderSection);
}

// Optional: Use lazy loading
// Uncomment the line below to enable lazy loading
// lazyLoadSlider();

// ==================== DEBUG MODE ====================

// Enable debug mode for development
const DEBUG_MODE = false;

if (DEBUG_MODE) {
    console.log('Slider Debug Mode Enabled');
    
    // Log slider events
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-controls]')) {
            console.log('Control clicked:', e.target.closest('[data-controls]').dataset.controls);
            const info = getCurrentSlide();
            console.log('Current slide info:', info);
        }
    });
}








