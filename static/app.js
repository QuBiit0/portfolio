document.addEventListener('DOMContentLoaded', () => {
    let form = document.getElementById('form');
    let formSubmitBtn = document.getElementById('form-submit');
    let formName = document.getElementById('form-name');
    let formEmail = document.getElementById('form-email');
    let formMessage = document.getElementById('form-message');

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    const showPassword = document.querySelector('.show-password');
    if (showPassword) {
        showPassword.addEventListener('click', () => {
            const passwordInput = document.querySelector('#password-input');
            if (passwordInput.type == 'password') {
                passwordInput.type = 'text';
                showPassword.classList.remove('fa-eye')
                showPassword.classList.add('fa-eye-slash')
            } else {
                passwordInput.type = 'password'
                showPassword.classList.remove('fa-eye-slash')
                showPassword.classList.add('fa-eye')
            }
        })
    }
    const formSubmitBtn = document.getElementById('form-submit');
    if (formSubmitBtn) {
        formSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Build formData object.
            let formData = new FormData();
            formData.append('name', formName.value);
            formData.append('email', formEmail.value);
            formData.append('message', formMessage.value);

            fetch("/", {
                body: formData,
                method: "post",
                credentials: 'same-origin',
                headers: {
                    "X-CSRFToken": csrftoken
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formName.value = '';
                    formEmail.value = '';
                    formMessage.value = '';
                    document.getElementById('modal-toggle').click();
                } else {
                    if (data.errors.name) {
                        document.getElementById('name-error').innerHTML = `<small class="error-text"><i class="fa fa-exclamation-triangle"></i> ${data.errors.name}</small>`
                    } else {
                        document.getElementById('name-error').innerHTML = '';
                    }

                    if (data.errors.email) {
                        document.getElementById('email-error').innerHTML = `<small class="error-text"><i class="fa fa-exclamation-triangle"></i> ${data.errors.email}</small>`
                    } else {
                        document.getElementById('email-error').innerHTML = '';
                    }
                    if (data.errors.message) {
                        document.getElementById('message-error').innerHTML = `<small class="error-text"><i class="fa fa-exclamation-triangle"></i> ${data.errors.message}</small>`
                    } else {
                        document.getElementById('message-error').innerHTML = '';
                    }
                }
            });
        })
    }

    function truncateString(str, num) {
        if (str.length > num) {
            return str.slice(0, num) + "...";
        } else {
            return str;
        }
    }

    const searchBtn = document.querySelector('#search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // document.getElementById('search-form').submit();
            searchText = document.getElementById('search-input');
            if (searchText.value.length != 0) {
                // Build formData object.
                let formData = new FormData();
                formData.append('searchText', searchText.value);

                fetch("/search/",
                    {
                        body: formData,
                        method: "post",
                        credentials: 'same-origin',
                        headers: {
                            "X-CSRFToken": csrftoken
                        }
                    }).then(response => response.json())
                    .then(data => {
                        projectsContainer = document.getElementById('projectsContainer');
                        if (data.success == true) {
                            projectsContainer.innerHTML = '';
                            data.projects.forEach(project => {
                                projectsContainer.innerHTML += `
                                <div class="col-lg-4 mb-4">
                                    <div class="card-loader card-loader--tabs"></div>
                                </div>
                                `;
                            });

                            setTimeout(() => {
                                projectsContainer.innerHTML = '';
                                data.projects.forEach(project => {
                                    projectsContainer.innerHTML += `
                                    <div class="col-lg-4 mb-4 ">
                                        <a href="${project.url}">
                                            <div class="card project-card mirror-face">
                                                <div class="project-card-img">
                                                    <img src="${project.image_url}">
                                                </div>
                                                <div class="card-body pt-0">
                                                    <h1 class="project-card-title">${truncateString(project.title, 22)}</h1>
                                                    <p class="project-card-disc">${truncateString(project.description, 100)}</p>
                                                </div>
                                            </div>
                                            </a>
                                    </div>
                                    `;
                                });
                                projectsContainer.innerHTML += `
                                <div class="col-12 my-4 text-center">
                                    <div class="back-to-projects">
                                        <a href="/projects">Back to Projects</a>
                                    </div>
                                </div>
                                `;
                            }, 2000);
                        } else {
                            projectsContainer.classList.add('justify-content-center')
                            projectsContainer.innerHTML = `
                                <div class="col-lg-4 text-center s-color">
                                    <p>There are no projects with the name '<strong class="color-primary">${data.searchText}</strong>'</p>
                                    <div class="back-to-projects">
                                        <a href="/projects">Back to Projects</a>
                                    </div>
                                </div>
                                `;
                        }
                    })
            }
        })
    }
});
