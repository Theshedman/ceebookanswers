import {
  alert as answerAlert,
  baseUrl,
  examTypes,
  examYears,
  manipulateAlert,
  postFormData,
  get, post, deleteData, update
} from './utils/index.js';

const answerSubject = document.querySelector('#answer-subject');
const answerExamType = document.querySelector('#answer-exam-type');
const answerExamYear = document.querySelector('#answer-exam-year');
const answerAnswers = document.querySelector('#answer-answers');
const answerExamNumber = document.querySelector('#answer-exam-number');
const answerPhoto = document.querySelector('#answer-photo');
const submitAnswer = document.querySelector('#submit-answer');
const submitAnswerSpannerBtn = document.querySelector('#submit-answer-spanner-btn');
const submitAnswerAlert = document.querySelector('#submit-answer-alert');
const answerForm = document.querySelector('#answer-form');
const answerSubjectValue = document.querySelector('#answer-subject-value');
const answerBoard = document.querySelector('#answer-board');

window.addEventListener('DOMContentLoaded', loadNecessaryData);
submitAnswer.addEventListener('click', async () => {
  submitAnswerSpannerBtn.classList.remove('d-none');

  const formData = new FormData();
  formData.append('photo', answerPhoto.files[0]);
  formData.append('answer', answerAnswers.value);
  formData.append('answerNumber', answerExamNumber.value);
  formData.append('subject', answerSubjectValue.value);
  formData.append('examType', answerExamType.value);
  formData.append('examYear', answerExamYear.value);

  try {
    const response = await postAnswer(formData);
    if (response.error) {
      throw new Error(response.error.message);
    }

    submitAnswerSpannerBtn.classList.add('d-none');
    answerForm.classList.add('d-none');

    submitAnswerAlert.classList.add('d-none', 'alert-success');
    submitAnswerAlert.innerHTML = answerAlert('Success', 'Answer successfully posted.');
    submitAnswerAlert.classList.remove('d-none');
    manipulateAlert(submitAnswerAlert, answerForm);

    await populateAnswerBoard();
  } catch (e) {
    submitAnswerSpannerBtn.classList.add('d-none');

    submitAnswerAlert.classList.remove('d-none', 'alert-success');
    submitAnswerAlert.classList.add('alert-primary');
    submitAnswerAlert.innerHTML = answerAlert('Error', e.message);
    manipulateAlert(submitAnswerAlert, answerForm);
  }
});

async function loadNecessaryData() {
  loadExamYear();
  loadExamType();
  await loadSubjects();
  await populateAnswerBoard();
}

function loadExamYear() {
  answerExamYear.innerHTML = examYears();
}

function loadExamType() {
  answerExamType.innerHTML = examTypes();
}

async function loadSubjects() {
  const url = `${baseUrl}/subjects`;
  try {
    const subjects = await get(url);

    if (subjects.error) {
      throw new Error(subjects.error.message);
    }

    let subjectElements = '';

    subjects.data.map(subject => {
      subjectElements += `
          <option value="${subject.subject}">${subject.subject}</option>
      `;
    });

    answerSubject.innerHTML = subjectElements;
  } catch (e) {
    console.log(e.message);
  }
}

async function populateAnswerBoard() {
  try {
    let response = await getAnswers();

    if (response.error) {
      throw new Error(response.error.message);
    }

    let rowNum = 0;
    let answerContent = [];

    for (let res of response.data) {
      ++rowNum;
      answerContent.unshift(`<tr>
                    <td id="answer-edit-number-${rowNum}" style="width: 5%;">${res.answerNumber}</td>
                    <td id="answer-edit-subject-${rowNum}" style="width: 25%;">${res.subject}</td>
                    <td id="answer-edit-answer-${rowNum}" style="width: 68%;">${res.answer}</td>
                    <td id="answer-edit-exam-type-${rowNum}" style="width: 5%;">${res.examType}</td>
                    <td id="answer-edit-exam-year-${rowNum}" style="width: 5%;">${res.examYear}</td>
                    <td id="answer-edit-id-${rowNum}" class="d-none id">${res._id}</td>
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
    answerBoard.innerHTML = answerContent.join('');
    // Clear previous notice content
    answerContent = [];
  } catch (e) {
    console.log(e);
  }
}


answerBoard.addEventListener('click', async (e) => {
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
  const id = document.querySelector(`#answer-edit-id-${rowNum}`).textContent.trim();
  const deleteSpanner = document.querySelector(`#delete-spanner-${rowNum}`);

  deleteSpanner.classList.remove('d-none');

  await deleteAnswer(id);
  await populateAnswerBoard();
}

function editRow(rowNum) {
  const btnGroup = document.querySelector(`#btn-group-${rowNum}`);
  const updateBtn = document.querySelector(`#update-btn-${rowNum}`);
  const answerNumberColumn = document.querySelector(`#answer-edit-number-${rowNum}`);
  const subjectColumn = document.querySelector(`#answer-edit-subject-${rowNum}`);
  const answerColumn = document.querySelector(`#answer-edit-answer-${rowNum}`);
  const examTypeColumn = document.querySelector(`#answer-edit-exam-type-${rowNum}`);
  const examYearColumn = document.querySelector(`#answer-edit-exam-year-${rowNum}`);

  const subject = subjectColumn.textContent.trim();
  const examType = examTypeColumn.textContent.trim();
  const examYear = examYearColumn.textContent.trim();
  const answerNumber = answerNumberColumn.textContent.trim();
  const answer = answerColumn.textContent.trim();

  btnGroup.classList.add('d-none');
  updateBtn.classList.remove('d-none');

  answerNumberColumn.innerHTML = `<input class="form-control" id="answer-edit-number-text-${rowNum}" type="text" value="${answerNumber}" />`;
  subjectColumn.innerHTML = `<input class="form-control" id="answer-edit-subject-text-${rowNum}" type="text" value="${subject}" />`;
  examTypeColumn.innerHTML = `<input class="form-control" id="answer-edit-exam-type-text-${rowNum}" type="text" value="${examType}" />`;
  examYearColumn.innerHTML = `<input class="form-control" id="answer-edit-exam-year-text-${rowNum}" spellcheck="true" autocomplete="on" value="${examYear}" />`;
  answerColumn.innerHTML = `<textarea class="form-control" id="answer-edit-answer-text-${rowNum}" spellcheck="true" autocomplete="on" required="">${answer}</textarea>`;
}

async function updateRow(rowNum) {
  const id = document.querySelector(`#answer-edit-id-${rowNum}`).textContent.trim();
  const examTypeText = document.querySelector(`#answer-edit-exam-type-text-${rowNum}`);
  const exaYearText = document.querySelector(`#answer-edit-exam-year-text-${rowNum}`);
  const subjectText = document.querySelector(`#answer-edit-subject-text-${rowNum}`);
  const answerText = document.querySelector(`#answer-edit-answer-text-${rowNum}`);
  const answerNumberText = document.querySelector(`#answer-edit-number-text-${rowNum}`);
  const updateSpanner = document.querySelector(`#update-spanner-${rowNum}`);

  updateSpanner.classList.remove('d-none');

  const data = {
    answer: answerText.value,
    examType: examTypeText.value,
    examYear: exaYearText.value,
    subject: subjectText.value,
    answerNumber: answerNumberText.value,
  };

  try {
    const response = await updateAnswer(id, data);

    if (response.error) {
      throw new Error(response.error);
    }

    updateSpanner.classList.add('d-none');
    await populateAnswerBoard();

  } catch (e) {
    console.log(e);
  }
}

async function postAnswer(answer = {}) {
  const url = `${baseUrl}/answers`;
  return await postFormData(url, answer);
}

async function getAnswers() {
  const url = `${baseUrl}/answers`;
  return await get(url);
}

async function deleteAnswer(id) {
  const url = `${baseUrl}/answers/${id}`;
  return await deleteData(url);
}

async function updateAnswer(id, data) {
  const url = `${baseUrl}/answers/${id}`;
  return await update(url, data);
}

