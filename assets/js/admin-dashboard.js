import {
  togglePasswordFormAndAlert,
  logout,
  updatePassword
} from './utils/index.js';

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
  greetAdmin.textContent = `${firstName} ${lastName}`;
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

createGuestsPassword.addEventListener('click', () => {
  window.location = './register-guess.html';
});

manageAnswerNotices.addEventListener('click', () => {
  window.location = './answer-notice.html';
});

adminChangePassword.addEventListener('click', (e) => {
  togglePasswordFormAndAlert(adminPasswordBtnsContainer, adminChangePasswordForm);
});

changeAdminPasswordBtn.addEventListener('click', async (e) => {
  await updatePassword(
    adminNewPassword,
    adminConfirmNewPassword,
    adminOldPassword,
    adminPasswordError,
    changeAdminPasswordSpanner,
    adminChangePasswordForm,
    adminPasswordAlert,
    adminPasswordBtnsContainer
  );
});

adminLogout.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    adminLogoutBtnSpanner.classList.remove('d-none');
    await logout(adminLogoutBtnSpanner);
  } catch (e) {
    alert(e.message);
  }
});


