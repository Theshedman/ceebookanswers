import {
  alert as candidateAlert,
  baseUrl,
  get,
  manipulateAlert as manipulateUpdateCandidateElements,
  update,
  examTypes,
  deleteData
} from './utils/index.js';

const candidatePhone = document.querySelector('#candidate-phone');
const examType = document.querySelector('#exam-type');
const examYear = document.querySelector('#exam-year');
const subscriptionType = document.querySelector('#subscription-type');
const allSubjects = document.querySelector('#all-subjects');
const subjectContainer = document.querySelector('#subject-container');
const updateCandidateBtn = document.querySelector('#update-candidate-btn');
const updateCandidateAlert = document.querySelector('#update-candidate-alert');
const candidateDefaultPassword = document.querySelector('#candidate-default-password');
const updateCandidateSpannerBtn = document.querySelector('#update-candidate-spanner-btn');
const candidateFormContainer = document.querySelector('#update-form');
const candidateForm = document.querySelector('#candidate-form');
const editCandidateBtn = document.querySelector('#edit-candidate-btn');
const editCandidateSpinnerBtn = document.querySelector('#edit-candidate-spanner-btn');
const deleteCandidateBtn = document.querySelector('#delete-candidate-btn');
const deleteCandidateSpinnerBtn = document.querySelector('#delete-candidate-spanner-btn');
const searchCandidatePhone = document.querySelector('#search-phone');
const searchFormContainer = document.querySelector('#search-form');
const viewExamType = document.querySelector('#view-exam-type');
const viewExamYear = document.querySelector('#view-exam-year');
const viewSubscriptionType = document.querySelector('#view-subscription-type');
const viewCandidateBtn = document.querySelector('#view-candidate-btn');
const viewCandidateSpannerBtn = document.querySelector('#view-candidate-spanner-btn');
const viewCandidate = document.querySelector('#view-candidate');
const viewSubjectContainer = document.querySelector('#view-subject-container');
const viewSubjectParentContainer = document.querySelector('#view-subject-container-parent');
const examTypeModify = document.querySelector('#exam-type-modify');

let subjectArray = [];

window.addEventListener('DOMContentLoaded', loadExamData);
editCandidateBtn.addEventListener('click', searchCandidate);
deleteCandidateBtn.addEventListener('click', deleteCandidate);
viewCandidateBtn.addEventListener('click', getCandidatePhoneNumbers);

async function getCandidatePhoneNumbers() {
  viewCandidateSpannerBtn.classList.remove('d-none');
  viewCandidate.classList.add('d-none');

  const examYear = viewExamYear.value;
  const examType = viewExamType.value;
  const subscriptionType = viewSubscriptionType.value;
  const subject = viewSubjectParentContainer.value;

  const queryValues = [];
  let queryString = `?`;

  if (examYear) {
    queryValues.push(`examYear=${examYear}`);
  }
  if (examType) {
    queryValues.push(`examType=${examType}`);
  }
  if (subscriptionType) {
    queryValues.push(`subscriptionType=${subscriptionType}`);
  }
  if (subject) {
    queryValues.push(`subject=${subject}`);
  }

  const queryValueLength = queryValues.length;
  let count = 0;

  if (queryValues.length) {
    queryValues.map(query => {
      count++;
      queryString += query;
      if (count !== queryValueLength) {
        queryString += `&`;
      }
    });
  }

  const fetchUrl = `${baseUrl}/candidates${queryString}`;

  try {
    const responseData = await get(fetchUrl);
    if (responseData.error) {
      throw new Error(responseData.error.message);
    }

    const totalCandidateNumbers = responseData.data.length;
    let candidateNumbers = '';
    let count = 0;

    for (let candidate of responseData.data) {
      count++;
      candidateNumbers += candidate.phone;
      if (count !== totalCandidateNumbers) {
        candidateNumbers += `;`;
      }
    }

    viewCandidateSpannerBtn.classList.add('d-none');
    viewCandidate.classList.remove('d-none');
    viewCandidate.textContent = candidateNumbers;

  } catch (e) {
    updateCandidateSpannerBtn.classList.add('d-none');

    updateCandidateAlert.classList.remove('d-none', 'alert-success');
    updateCandidateAlert.classList.add('alert-primary');
    updateCandidateAlert.innerHTML = candidateAlert('Error', e.message);
    manipulateUpdateCandidateElements(updateCandidateAlert, candidateForm);
  }
}

async function searchCandidate() {
  const phone = searchCandidatePhone.value;
  editCandidateSpinnerBtn.classList.remove('d-none');
  const subjects = [...document.querySelectorAll('[name=subjects]')];

  try {
    if (!phone) throw new Error('Please Enter a phone number to continue!');
    const fetchUrl = `${baseUrl}/candidates/one?phone=${phone}&examType=${examTypeModify.value}`;
    const responseData = await get(fetchUrl);

    if (responseData.error) {
      throw new Error(responseData.error.message);
    }

    const allSubjectCount = subjects.length;
    let count = 0;

    // Update form fields with the candidate data
    candidatePhone.value = responseData.data.phone;
    examType.value = responseData.data.examType;
    examYear.value = responseData.data.examYear;
    subscriptionType.value = responseData.data.subscriptionType;
    subjectArray = responseData.data.subjects;
    for (let candidateSubject of subjectArray) {
      for (let editSubject of subjects) {
        if (editSubject.value === candidateSubject) {
          count++;
          editSubject.checked = true;
        }

        allSubjects.checked = count === allSubjectCount;
      }
    }


    editCandidateSpinnerBtn.classList.add('d-none');
    searchFormContainer.classList.add('d-none');
    candidateFormContainer.classList.remove('d-none');
  } catch (e) {
    editCandidateSpinnerBtn.classList.add('d-none');

    candidateForm.classList.add('d-none');
    searchFormContainer.classList.add('d-none');

    updateCandidateAlert.classList.remove('d-none', 'alert-success');
    updateCandidateAlert.classList.add('alert-primary');
    updateCandidateAlert.innerHTML = candidateAlert('Error', e.message);
    manipulateUpdateCandidateElements(updateCandidateAlert, searchFormContainer);
  }
}

updateCandidateBtn.addEventListener('click', async () => {
  const subjects = [...document.querySelectorAll('[name=subjects]')];
  updateCandidateSpannerBtn.classList.remove('d-none');

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

  const fetchUrl = `${baseUrl}/candidates/one?phone=${phone}&examType=${exam_type}`;
  try {
    const responseData = await update(fetchUrl, candidateData);
    if (responseData.error) {
      throw new Error(responseData.error.message);
    }

    updateCandidateSpannerBtn.classList.add('d-none');
    candidateForm.classList.add('d-none');

    updateCandidateAlert.classList.add('d-none', 'alert-success');
    updateCandidateAlert.innerHTML = candidateAlert('Success', 'Candidate is successufully updateed.');
    updateCandidateAlert.classList.remove('d-none');
    manipulateUpdateCandidateElements(updateCandidateAlert, candidateForm);

    allSubjects.checked = false;
    subjects.map(subject => subject.checked = false);
    subjectArray = [];
  } catch (e) {
    updateCandidateSpannerBtn.classList.add('d-none');

    candidateForm.classList.add('d-none');

    updateCandidateAlert.classList.remove('d-none', 'alert-success');
    updateCandidateAlert.classList.add('alert-primary');
    updateCandidateAlert.innerHTML = candidateAlert('Error', e.message);
    manipulateUpdateCandidateElements(updateCandidateAlert, candidateForm);
  }
});

allSubjects.addEventListener('click', () => {
  const subjects = [...document.querySelectorAll('[name=subjects]')];
  subjectArray = [];
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


async function loadExamData() {
  loadExamYear();
  await loadSubjects();
  loadExamType();
}

function loadExamYear() {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  examYear.innerHTML = `
  <optgroup label="Exam Year">
      <option value="" selected="">Select Year</option>
      <option value="${currentYear}">${currentYear}</option>
      <option value="${nextYear}">${nextYear}</option>
  </optgroup>
  `;

  viewExamYear.innerHTML = `
  <optgroup label="Exam Year">
      <option value="" selected="">Exam Year</option>
      <option value="${currentYear}">${currentYear}</option>
      <option value="${nextYear}">${nextYear}</option>
  </optgroup>
  `;
}

async function loadSubjects() {
  try {
    const fetchUrl = `${baseUrl}/subjects`;
    const subjects = await get(fetchUrl);

    if (subjects.error) {
      throw new Error(subjects.error.message);
    }

    let subjectElements = '';
    let viewSubjectElements = '';

    subjects.data.map(subject => {
      subjectElements += `
          <div class="form-check">
              <input class="form-check-input" name="subjects" value="${subject.subject}" type="checkbox" id="${subject._id}">
              <label class="form-check-label" for="formCheck-1">${subject.subject}</label>
          </div>
      `;

      viewSubjectElements += `<option value="${subject.subject}">${subject.subject}</option>`;
    });

    subjectContainer.innerHTML = subjectElements;
    viewSubjectContainer.insertAdjacentHTML('beforeend', viewSubjectElements);
  } catch (e) {
    console.log(e.message);
  }
}

function loadExamType() {
  viewExamType.innerHTML = examTypes();
  examType.innerHTML = examTypes();
  examTypeModify.innerHTML = examTypes();
}

async function deleteCandidate() {
  const phone = searchCandidatePhone.value;
  deleteCandidateSpinnerBtn.classList.remove('d-none');

  try {
    if (!phone) throw new Error('Please Enter a phone number to continue!');
    const fetchUrl = `${baseUrl}/candidates/one?phone=${phone}&examType=${examTypeModify.value}`;
    const responseData = await deleteData(fetchUrl);
    if (responseData.error) {
      throw new Error(responseData.error.message);
    }

    deleteCandidateSpinnerBtn.classList.add('d-none');
    searchFormContainer.classList.add('d-none');

    updateCandidateAlert.classList.add('d-none', 'alert-success');
    updateCandidateAlert.innerHTML = candidateAlert('Success', 'Candidate is successufully Deleted.');
    updateCandidateAlert.classList.remove('d-none');
    manipulateUpdateCandidateElements(updateCandidateAlert, searchFormContainer);
  } catch (e) {
    deleteCandidateSpinnerBtn.classList.add('d-none');

    candidateForm.classList.add('d-none');
    searchFormContainer.classList.add('d-none');

    updateCandidateAlert.classList.remove('d-none', 'alert-success');
    updateCandidateAlert.classList.add('alert-primary');
    updateCandidateAlert.innerHTML = candidateAlert('Error', e.message);
    manipulateUpdateCandidateElements(updateCandidateAlert, searchFormContainer);
  }
}
