const adminChangePassword = document.querySelector('#admin-change-password');
const adminLogout = document.querySelector('#admin-logout');
const greetAdmin = document.querySelector('#admin-greeting');
const adminOldPassword = document.querySelector('#admin-old-password');
const adminNewPassword = document.querySelector('#admin-new-password');
const adminConfirmNewPassword = document.querySelector('#admin-confirm-new-password');
const changeAdminPasswordBtn = document.querySelector('#change-admin-password');
const adminChangePasswordForm = document.querySelector('#admin-change-password-form');
const adminPasswordBtnsContainer = document.querySelector('#admin-password-btns-container');
const adminPasswordAlert = document.querySelector('#admin-password-alert');
const adminPasswordError = document.querySelector('#admin-password-error');
const changeAdminPasswordSpanner = document.querySelector('#change-admin-password-spanner');
const adminLogoutBtnSpanner = document.querySelector('#admin-logout-spanner');
const registerCandidate = document.querySelector('#register-candidate');
const manageAccordion = document.querySelector('#manage-accordion');
const postAnswers = document.querySelector('#post-answers');
const createGuestsPassword = document.querySelector('#create-guests-password');
const manageAnswerNotices = document.querySelector('#manage-answer-notices');
const manageCandidate = document.querySelector('#manage-candidate');
const manageExternalLink = document.querySelector('#manage-external-link');
const manageSubjects = document.querySelector('#manage-subjects');

// TODO - externalLink, Subjects, createGuestsPassword, manageAnswerNotices

window.addEventListener('DOMContentLoaded', () => {
  const firstName = window.localStorage.getItem('firstName');
  const lastName = window.localStorage.getItem('lastName');
  const fullname = `${firstName} ${lastName}`;

  greetAdmin.textContent = fullname;
});

registerCandidate.addEventListener('click', () => {
  window.location = './register-candidate.html';
});

manageAccordion.addEventListener('click', () => {
  window.location = './general-notice.html';
});

manageCandidate.addEventListener('click', () => {
  window.location = './manage-candidate.html';
});

postAnswers.addEventListener('click', () => {
  window.location = './post-answers.html';
});

adminChangePassword.addEventListener('click', (e) => {
  adminPasswordBtnsContainer.classList.add('d-none');
  adminPasswordBtnsContainer.classList.remove('d-flex');

  adminChangePasswordForm.classList.add('d-flex');
  adminChangePasswordForm.classList.remove('d-none');
});

changeAdminPasswordBtn.addEventListener('click', async (e) => {
  changeAdminPasswordSpanner.classList.remove('d-none');
  const passwordAlert = (heading, message) => `<strong>${heading}!</strong> ${message}.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>`;
  const manipulatePasswordUpdateElements = (alertElement, passwordBtn) => {
    setTimeout(() => {
      alertElement.classList.add('d-none');

      passwordBtn.classList.add('d-flex');
      passwordBtn.classList.remove('d-none');
    }, 3500);
  };
  const password = adminNewPassword.value;
  const confirmPassword = adminConfirmNewPassword.value;
  const oldPassword = adminOldPassword.value;
  const phone = window.localStorage.getItem('phone');

  if (!password || !confirmPassword || !oldPassword) {
    adminPasswordError.textContent = 'Fill the empty fields.';
    adminPasswordError.classList.remove('d-none');
    changeAdminPasswordSpanner.classList.add('d-none');
    return;
  }
  if (password !== confirmPassword) {
    adminPasswordError.textContent = 'Password do not match.';
    changeAdminPasswordSpanner.classList.add('d-none');
    adminPasswordError.classList.remove('d-none');
    return;
  }
  if (password === confirmPassword) {
    adminPasswordError.classList.add('d-none');
  }
  try {
    const changePassword = await changeAdminPassword(phone, oldPassword, password);

    if (changePassword.error) {
      throw new Error(changePassword.error.message);
    }

    changeAdminPasswordSpanner.classList.add('d-none');
    adminChangePasswordForm.classList.remove('d-flex');
    adminChangePasswordForm.classList.add('d-none');

    adminPasswordAlert.innerHTML = passwordAlert('Success', 'You have successfully changed your password');
    adminPasswordAlert.classList.remove('d-none');

    manipulatePasswordUpdateElements(adminPasswordAlert, adminPasswordBtnsContainer);
    adminNewPassword.value = '';
    adminConfirmNewPassword.value = '';
    adminOldPassword.value = '';
  } catch (e) {
    changeAdminPasswordSpanner.classList.add('d-none');

    adminChangePasswordForm.classList.remove('d-flex');
    adminChangePasswordForm.classList.add('d-none');

    adminPasswordAlert.classList.remove('d-none', 'alert-success');
    adminPasswordAlert.classList.add('alert-primary');
    adminPasswordAlert.innerHTML = passwordAlert('Error', e.message);
  }
});

const changeAdminPassword = async (phone, oldPassword, password) => {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/admins/me`;
  const data = { phone, password };
  try {
    const response = await fetch(fetchUrl, {
      method: 'PATCH',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });

    return await response.json();
  } catch (e) {
    throw  new Error(e.message);
  }
};

adminLogout.addEventListener('click', async (e) => {
  e.preventDefault();

  const fetchUrl = `https://ceebookanswers.herokuapp.com/admins/logout`;
  adminLogoutBtnSpanner.classList.remove('d-none');

  try {
    const logout = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      },
      method: 'POST'
    });
    const loggedOut = logout.json();

    if (loggedOut.error) {
      throw new Error(loggedOut.error.message);
    }
    adminLogoutBtnSpanner.classList.add('d-none');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('subject');
    window.localStorage.removeItem('examType');
    window.localStorage.removeItem('phone');
    window.location = './index.html';
  } catch (e) {
    alert(e.message);
  }
});


