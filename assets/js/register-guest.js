import {
  alert as guestPasswordAlert,
  baseUrl,
  examTypes,
  examYears,
  manipulateAlert,
  post,
  get
} from './utils/index.js';

const guestSubjectValue = document.querySelector('#guest-subject-value');
const guestSubject = document.querySelector('#guest-subject');
const guestExamType = document.querySelector('#guest-exam-type');
const guestExamYear = document.querySelector('#guest-exam-year');
const guestPassword = document.querySelector('#guest-password');
const btnSubmitGuessPassword = document.querySelector('#submit-guest-password');
const submitGuessSpannerBtn = document.querySelector('#submit-guest-password-spanner-btn');
const submitGuessPasswordAlert = document.querySelector('#submit-guest-password-alert');
const guestPasswordForm = document.querySelector('#guest-password-form');

window.addEventListener('DOMContentLoaded', loadNecessaryData);
btnSubmitGuessPassword.addEventListener('click', async () => {
  submitGuessSpannerBtn.classList.remove('d-none');

  const data = {
  password: guestPassword.value,
  subject: guestSubjectValue.value,
  examType: guestExamType.value,
  examYear: guestExamYear.value,
}

  try {
    const response = await createGuessPassword(data);
    if (response.error) {
      throw new Error(response.error.message);
    }

    submitGuessSpannerBtn.classList.add('d-none');
    guestPasswordForm.classList.add('d-none');

    submitGuessPasswordAlert.classList.add('d-none', 'alert-success');
    submitGuessPasswordAlert.innerHTML = guestPasswordAlert('Success', 'Guess Password created successfully.');
    submitGuessPasswordAlert.classList.remove('d-none');
    manipulateAlert(submitGuessPasswordAlert, guestPasswordForm);
  } catch (e) {
    submitGuessSpannerBtn.classList.add('d-none');

    submitGuessPasswordAlert.classList.remove('d-none', 'alert-success');
    submitGuessPasswordAlert.classList.add('alert-primary');
    submitGuessPasswordAlert.innerHTML = guestPasswordAlert('Error', e.message);
    manipulateAlert(submitGuessPasswordAlert, guestPasswordForm);
  }
});

async function loadNecessaryData() {
  guestLoadExamYear();
  guestLoadExamType();
  await guestLoadSubjects();
}

function guestLoadExamYear() {
  guestExamYear.innerHTML = examYears();
}

function guestLoadExamType() {
  guestExamType.innerHTML = examTypes();
}

async function guestLoadSubjects() {
  try {
    const subjects = await get(`${baseUrl}/subjects`);

    if (subjects.error) {
      throw new Error(subjects.error.message);
    }

    let subjectElements = '';

    subjects.data.map(subject => {
      subjectElements += `
          <option value="${subject.subject}">${subject.subject}</option>
      `;
    });

    guestSubject.innerHTML = subjectElements;
  } catch (e) {
    console.log(e.message);
  }
}

async function createGuessPassword(guestData = {}) {
  const url = `${baseUrl}/guests/register`;
  return await post(url, guestData);
}
