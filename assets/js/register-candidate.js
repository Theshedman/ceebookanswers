import {
  baseUrl,
  examTypes,
  examYears,
  subscriptionTypes,
  post,
  get,
  alert as candidateAlert,
  manipulateAlert as manipulateRegisterCandidateElements
} from './utils/index.js';

const candidatePhone = document.querySelector('#candidate-phone');
const examType = document.querySelector('#exam-type');
const examYear = document.querySelector('#exam-year');
const subscriptionType = document.querySelector('#subscription-type');
const allSubjects = document.querySelector('#all-subjects');
const subjectContainer = document.querySelector('#subject-container');
const registerCandidateBtn = document.querySelector('#register-candidate-btn');
const registerCandidateAlert = document.querySelector('#register-candidate-alert');
const candidateDefaultPassword = document.querySelector('#candidate-default-password');
const registerCandidateSpannerBtn = document.querySelector('#register-candidate-spanner-btn');
const candidateForm = document.querySelector('#candidate-form');

let subjectArray = [];

window.addEventListener('DOMContentLoaded', loadNecessaryData);
registerCandidateBtn.addEventListener('click', async () => {
  const subjects = [...document.querySelectorAll('[name=subjects]')];
  registerCandidateSpannerBtn.classList.remove('d-none');

  const phone = candidatePhone.value;
  const exam_year = examYear.value;
  const subType = subscriptionType.value;
  const exam_type = examType.value;
  const password = candidateDefaultPassword.value;
  const candidateData = {};

  if (phone) candidateData.phone = phone;
  if (exam_type) candidateData.examType = exam_type;
  if (exam_year) candidateData.examYear = exam_year;
  if (subType) candidateData.subscriptionType = subType;
  if (password) candidateData.password = password;
  if (subjectArray.length) candidateData.subjects = subjectArray;

  try {
    const responseData = await createCandidate(candidateData);
    if (responseData.error) {
      throw new Error(responseData.error.message);
    }

    registerCandidateSpannerBtn.classList.add('d-none');
    candidateForm.classList.add('d-none');

    registerCandidateAlert.classList.add('d-none', 'alert-success');
    registerCandidateAlert.innerHTML = candidateAlert('Success', 'Candidate is successufully registered.');
    registerCandidateAlert.classList.remove('d-none');
    manipulateRegisterCandidateElements(registerCandidateAlert, candidateForm);

    allSubjects.checked = false;
    subjects.map(subject => subject.checked = false);
    subjectArray = [];
  } catch (e) {
    registerCandidateSpannerBtn.classList.add('d-none');

    candidateForm.classList.add('d-none');

    registerCandidateAlert.classList.remove('d-none', 'alert-success');
    registerCandidateAlert.classList.add('alert-primary');
    registerCandidateAlert.innerHTML = candidateAlert('Error', e.message);
    manipulateRegisterCandidateElements(registerCandidateAlert, candidateForm);
  }
});

allSubjects.addEventListener('click', () => {
  const subjects = [...document.querySelectorAll('[name=subjects]')];
  if (allSubjects.checked === true) {
    subjects.map(subject => {
      subject.checked = true;
      subjectArray.push(subject.value);
    });
  } else {
    subjects.map(subject => {
      subject.checked = false;
      subjectArray = [];
    });
  }
});

subjectContainer.addEventListener('click', (e) => {
  const subjects = [...document.querySelectorAll('[name=subjects]')];
  const allSubjectCount = subjects.length;
  let count = 0;
  if (e.target.checked && !subjectArray.includes(e.target.value)) {
    subjectArray.push(e.target.value);
  } else {
    subjectArray = subjectArray.filter(value => e.target.value !== value);
  }

  for (let candidateSubject of subjectArray) {
    for (let editSubject of subjects) {
      if (editSubject.value === candidateSubject) {
        count++;
        editSubject.checked = true;
      }
      allSubjects.checked = count === allSubjectCount;
    }
  }
});

async function loadNecessaryData() {
  loadExamYear();
  loadExamType();
  loadSubscriptionType();
  await loadSubjects();
}

function loadExamYear() {
  examYear.innerHTML = examYears();
}

async function loadSubjects() {
  const fetchUrl = `${baseUrl}/subjects`;
  try {
    const subjects = await get(fetchUrl);

    if (subjects.error) {
      throw new Error(subjects.error.message);
    }

    let subjectElements = '';

    subjects.data.map(subject => {
      subjectElements += `
          <div class="form-check">
              <input class="form-check-input" name="subjects" value="${subject.subject}" type="checkbox" id="${subject._id}">
              <label class="form-check-label" for="formCheck-1">${subject.subject}</label>
          </div>
      `;
    });

    subjectContainer.innerHTML = subjectElements;
  } catch (e) {
    console.log(e.message);
  }
}

function loadExamType() {
  examType.innerHTML = examTypes();
}

function loadSubscriptionType() {
  subscriptionType.innerHTML = subscriptionTypes();
}

async function createCandidate(candidateDetails = {}) {
  const fetchUrl = `${baseUrl}/candidates/register`;
  return await post(fetchUrl, candidateDetails);
}
