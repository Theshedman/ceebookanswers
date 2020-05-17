const candidateChangePassword = document.querySelector('#candidate-change-password');
const candidateLogout = document.querySelector('#candidate-logout');
const candidateSubjectsContainer = document.querySelector('#candidate-subjects-container');
const greetCandidate = document.querySelector('#candidate-greeting');
const candidateOldPassword = document.querySelector('#candidate-old-password');
const candidateNewPassword = document.querySelector('#candidate-new-password');
const candidateConfirmNewPassword = document.querySelector('#candidate-confirm-new-password');
const changeCandidatePasswordBtn = document.querySelector('#change-candidate-password');
const candidateChangePasswordForm = document.querySelector('#candidate-change-password-form');
const candidatePasswordBtnsContainer = document.querySelector('#candidate-password-btns-container');
const candidatePasswordAlert = document.querySelector('#candidate-password-alert');
const candidatePasswordError = document.querySelector('#candidate-password-error');
const candidateSubjectsSpanner = document.querySelector('#candidate-subjects-spanner');
const changeCandidatePasswordSpanner = document.querySelector('#change-candidate-password-spanner');
const candidateLogoutBtnSpanner = document.querySelector('#candidate-logout-spanner');

window.addEventListener('DOMContentLoaded', getCandidateSubjects);
candidateSubjectsContainer.addEventListener('click', (e) => {
  e.preventDefault();
  window.localStorage.removeItem('subject');
  window.localStorage.setItem('subject', e.target.textContent);
  window.location = './candidate-answers.html';
});

candidateChangePassword.addEventListener('click', (e) => {
  candidatePasswordBtnsContainer.classList.add('d-none');
  candidatePasswordBtnsContainer.classList.remove('d-flex');

  candidateChangePasswordForm.classList.add('d-flex');
  candidateChangePasswordForm.classList.remove('d-none');
});

changeCandidatePasswordBtn.addEventListener('click', async (e) => {
  changeCandidatePasswordSpanner.classList.remove('d-none');
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
  const password = candidateNewPassword.value;
  const confirmPassword = candidateConfirmNewPassword.value;
  const oldPassword = candidateOldPassword.value;
  const phone = window.localStorage.getItem('phone');

  if (!password || !confirmPassword || !oldPassword) {
    candidatePasswordError.textContent = 'Fill the empty fields.';
    candidatePasswordError.classList.remove('d-none');
    changeCandidatePasswordSpanner.classList.add('d-none');
    return;
  }
  if (password !== confirmPassword) {
    candidatePasswordError.textContent = 'Password do not match.';
    changeCandidatePasswordSpanner.classList.add('d-none');
    candidatePasswordError.classList.remove('d-none');
    return;
  }
  if (password === confirmPassword) {
    candidatePasswordError.classList.add('d-none');
  }
  try {
    const changePassword = await changeCandidatePassword(phone, oldPassword, password);

    if (changePassword.error) {
      throw new Error(changePassword.error.message);
    }

    changeCandidatePasswordSpanner.classList.add('d-none');
    candidateChangePasswordForm.classList.remove('d-flex');
    candidateChangePasswordForm.classList.add('d-none');

    candidatePasswordAlert.innerHTML = passwordAlert('Success', 'You have successfully changed your password');
    candidatePasswordAlert.classList.remove('d-none');

    manipulatePasswordUpdateElements(candidatePasswordAlert, candidatePasswordBtnsContainer);
    candidateNewPassword.value = '';
    candidateConfirmNewPassword.value = '';
    candidateOldPassword.value = '';
  } catch (e) {
    changeCandidatePasswordSpanner.classList.add('d-none');

    candidateChangePasswordForm.classList.remove('d-flex');
    candidateChangePasswordForm.classList.add('d-none');

    candidatePasswordAlert.classList.remove('d-none', 'alert-success');
    candidatePasswordAlert.classList.add('alert-primary');
    candidatePasswordAlert.innerHTML = passwordAlert('Error', e.message);
  }
});

const changeCandidatePassword = async (phone, oldPassword, password) => {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/candidates/me/updatePassword`;
  const data = { phone, oldPassword, password };
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

async function getCandidateSubjects() {
  const body = document.querySelector('body');
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/candidates/me`;
  try {
    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    });
    const candidateProfile = await response.json();


    if (candidateProfile.error) {
      throw new Error(candidateProfile.error.message);
    }

    greetCandidate.textContent = candidateProfile.data.phone;
    let candidateSubjectElements = '';

    candidateProfile.data.subjects.map(value => {
      const subject = `
      <li class="d-flex align-content-center justify-content-center list-group-item text-primary border m-1 rounded-pill border-primary shadow swing animated flex-grow-1">
        <span>${value}</span>
      </li>
      `;
      candidateSubjectElements += subject;
    });

    candidateSubjectsSpanner.classList.remove('d-flex');
    candidateSubjectsSpanner.classList.add('d-none');
    candidateSubjectsContainer.insertAdjacentHTML('beforeend', candidateSubjectElements);
  } catch (e) {
    body.innerHTML = `<div class="highlight-clean">
    <div class="container">
        <div class="intro">
            <h2 class="text-center">Access Denied.</h2>
            <p class="text-center text-danger">Please Login to view answers. You can only login in to one device. Logging in to another device will log you out from the first one. So make sure that you do not share your password with anyone to avoid being logged out from your device. </p>
        </div>
        </div>
</div>
`;
  }
}

candidateLogout.addEventListener('click', async (e) => {
  e.preventDefault();

  const fetchUrl = `https://ceebookanswers.herokuapp.com/candidates/logout`;
  candidateLogoutBtnSpanner.classList.remove('d-none');

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
    candidateLogoutBtnSpanner.classList.add('d-none');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('subject');
    window.localStorage.removeItem('examType');
    window.localStorage.removeItem('phone');
    window.location = './index.html';
  } catch (e) {
    alert(e.message);
  }
});
