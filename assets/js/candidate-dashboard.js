import {
  baseUrl,
  alert,
  accessDeniedMessage,
  get,
  logout,
  togglePasswordFormAndAlert,
  updatePassword
} from './utils/index.js';

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
  window.location = './answer-page.html';
});

candidateChangePassword.addEventListener('click', (e) => {
  togglePasswordFormAndAlert(candidatePasswordBtnsContainer, candidateChangePasswordForm);
});

changeCandidatePasswordBtn.addEventListener('click', async (e) => {
  await updatePassword(
    candidateNewPassword,
    candidateConfirmNewPassword,
    candidateOldPassword,
    candidatePasswordError,
    changeCandidatePasswordSpanner,
    candidateChangePasswordForm,
    candidatePasswordAlert,
    candidatePasswordBtnsContainer
  );
});

async function getCandidateSubjects() {
  const body = document.querySelector('body');
  const fetchUrl = `${baseUrl}/candidates/me`;
  try {
    const candidateProfile = await get(fetchUrl);

    if (candidateProfile.error) {
      throw new Error(candidateProfile.error.message);
    }

    greetCandidate.textContent = candidateProfile.data.phone;
    let candidateSubjectElements = '';

    candidateProfile.data.subjects.forEach(value => {
      const subject = `
      <li class="d-flex align-content-center justify-content-center list-group-item text-primary border m-1 rounded-pill border-primary shadow swing animated flex-grow-1">
        <span>${value}</span>
      </li>
      `;
      candidateSubjectElements += subject;
    });

    candidateSubjectsSpanner.classList.remove('d-flex');
    candidateSubjectsSpanner.classList.add('d-none');
    candidateSubjectsContainer.innerHTML = candidateSubjectElements;
  } catch (e) {
    body.innerHTML = accessDeniedMessage();
  }
}

candidateLogout.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    candidateLogoutBtnSpanner.classList.remove('d-none');
    await logout(candidateLogoutBtnSpanner);
  } catch (e) {
    alert(e.message);
  }
});
