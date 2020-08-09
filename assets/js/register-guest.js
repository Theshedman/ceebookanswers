import {
  alert as guestPasswordAlert,
  baseUrl,
  examTypes,
  examYears,
  manipulateAlert,
  post,
  get, deleteData, update
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
const passwordBoard = document.querySelector('#password-board');

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

    await populatePasswordBoard();
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
  await populatePasswordBoard();
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

async function populatePasswordBoard() {
  try {
    let response = await getGuestPassword();

    if (response.error) {
      throw new Error(response.error.message);
    }

    let rowNum = 0;
    let noticeContent = [];

    for (let res of response.data) {
      ++rowNum;
      noticeContent.unshift(`<tr>
                    <td id="guest-edit-subject-${rowNum}" style="width: 65%;">${res.subject}</td>
                    <td id="guest-edit-exam-type-${rowNum}" style="width: 25%;">${res.examType}</td>
                    <td id="guest-edit-exam-year-${rowNum}" style="width: 5%;">${res.examYear}</td>
                    <td id="guest-edit-password-${rowNum}" style="width: 10%;">${res.password}</td>
                    <td id="guest-edit-id-${rowNum}" class="d-none id">${res._id}</td>
                    <td style="width: 5%;">
                        <div id="btn-group-${rowNum}" class="btn-group" role="group">
                           <button class="btn btn-warning" type="button" name="${rowNum}">Edit</button>
                           <button style="display: flex;" class="btn btn-primary" type="button" name="${rowNum}">Del
                             <span id="delete-spanner-${rowNum}" role="status"
                                  class="d-none spinner-border text-white m-auto"
                                  style="width: 15px;height: 15px;">
                             </span>
                           </button>
                        </div>
                        <button style="width: 100%" id="update-btn-${rowNum}" class="btn btn-primary d-none" type="button" name="${rowNum}">Update
                            <span id="update-spanner-${rowNum}" role="status"
                                  class="d-none spinner-border text-white m-auto"
                                  style="width: 15px;height: 15px;">
                            </span>
                        </button>
                    </td>
                </tr>`);
    }
    passwordBoard.innerHTML = noticeContent.join('');
    // Clear previous notice content
    noticeContent = [];
  } catch (e) {
    console.log(e);
  }
}


passwordBoard.addEventListener('click', async (e) => {
  // Delete notice
  if (e.target.textContent.startsWith('Del')) {
    const rowNum = e.target.name;
    await deleteRow(rowNum);
  }

  // Edit Notice
  if (e.target.textContent.startsWith('Edit')) {
    const rowNum = e.target.name;
    editRow(rowNum);
  }

  // Update notice
  if (e.target.textContent.startsWith('Update')) {
    const rowNum = e.target.name;
    await updateRow(rowNum);
  }
});

async function deleteRow(rowNum) {
  const id = document.querySelector(`#guest-edit-id-${rowNum}`).textContent.trim();
  const deleteSpanner = document.querySelector(`#delete-spanner-${rowNum}`);

  deleteSpanner.classList.remove('d-none');

  await deleteGuestPassword(id);
  await populatePasswordBoard();
}

function editRow(rowNum) {
  const btnGroup = document.querySelector(`#btn-group-${rowNum}`);
  const updateBtn = document.querySelector(`#update-btn-${rowNum}`);
  const subjectColumn = document.querySelector(`#guest-edit-subject-${rowNum}`);
  const examTypeColumn = document.querySelector(`#guest-edit-exam-type-${rowNum}`);
  const examYearColumn = document.querySelector(`#guest-edit-exam-year-${rowNum}`);
  const passwordColumn = document.querySelector(`#guest-edit-password-${rowNum}`);
  const subject = subjectColumn.textContent.trim();
  const examType = examTypeColumn.textContent.trim();
  const examYear = examYearColumn.textContent.trim();
  const password = passwordColumn.textContent.trim();

  btnGroup.classList.add('d-none');
  updateBtn.classList.remove('d-none');

  subjectColumn.innerHTML = `<input class="form-control" id="guest-edit-subject-text-${rowNum}" type="text" value="${subject}" />`;
  examTypeColumn.innerHTML = `<input class="form-control" id="guest-edit-exam-type-text-${rowNum}" type="text" value="${examType}" />`;
  examYearColumn.innerHTML = `<input class="form-control" id="guest-edit-exam-year-text-${rowNum}" type="text" value="${examYear}" />`;
  passwordColumn.innerHTML = `<input class="form-control" id="guest-edit-password-text-${rowNum}" type="text" value="${password}" />`;
}

async function updateRow(rowNum) {
  const id = document.querySelector(`#guest-edit-id-${rowNum}`).textContent.trim();
  const examTypeText = document.querySelector(`#guest-edit-exam-type-text-${rowNum}`);
  const passwordText = document.querySelector(`#guest-edit-password-text-${rowNum}`);
  const updateSpanner = document.querySelector(`#update-spanner-${rowNum}`);

  updateSpanner.classList.remove('d-none');

  const data = {
    password: passwordText.value,
    examType: examTypeText.value,
  };

  try {
    const response = await updateGuestPassword(id, data);

    if (response.error) {
      throw new Error(response.error);
    }

    updateSpanner.classList.add('d-none');
    await populatePasswordBoard();

  } catch (e) {
    console.log(e);
  }
}

async function createGuessPassword(guestData = {}) {
  const url = `${baseUrl}/guests/register`;
  return await post(url, guestData);
}

async function getGuestPassword() {
  const url = `${baseUrl}/guests`;
  return await get(url);
}

async function deleteGuestPassword(id) {
  const url = `${baseUrl}/guests/${id}`;
  return await deleteData(url);
}

async function updateGuestPassword(id, data) {
  const url = `${baseUrl}/guests/${id}`;
  return await update(url, data);
}
