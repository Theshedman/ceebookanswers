import {
  alert as answerNoticeAlert,
  baseUrl,
  examTypes,
  examYears,
  manipulateAlert,
  post,
  get, deleteData, update
} from './utils/index.js';

const answerNoticeSubjectValue = document.querySelector('#answer-notice-subject-value');
const answerNoticeSubject = document.querySelector('#answer-notice-subject');
const answerNoticeExamType = document.querySelector('#answer-notice-exam-type');
const answerNoticeTime = document.querySelector('#answer-notice-time');
const answerNotice = document.querySelector('#answer-notice');
const btnSubmitAnswerNotice = document.querySelector('#submit-answer-notice');
const submitGuessSpannerBtn = document.querySelector('#submit-answer-notice-spanner-btn');
const submitAnswerNoticeAlert = document.querySelector('#submit-answer-notice-alert');
const answerNoticeForm = document.querySelector('#answer-notice-form');
const passwordBoard = document.querySelector('#password-board');

window.addEventListener('DOMContentLoaded', loadNecessaryData);
btnSubmitAnswerNotice.addEventListener('click', async () => {
  submitGuessSpannerBtn.classList.remove('d-none');

  const data = {
    notice: answerNotice.value,
    subject: answerNoticeSubjectValue.value,
    examType: answerNoticeExamType.value,
    examTime: answerNoticeTime.value,
  }

  try {
    const response = await createAnswerNotice(data);
    if (response.error) {
      throw new Error(response.error.message);
    }

    submitGuessSpannerBtn.classList.add('d-none');
    answerNoticeForm.classList.add('d-none');

    submitAnswerNoticeAlert.classList.add('d-none', 'alert-success');
    submitAnswerNoticeAlert.innerHTML = answerNoticeAlert('Success', 'Guess Password created successfully.');
    submitAnswerNoticeAlert.classList.remove('d-none');
    manipulateAlert(submitAnswerNoticeAlert, answerNoticeForm);

    await populatePasswordBoard();
  } catch (e) {
    submitGuessSpannerBtn.classList.add('d-none');

    submitAnswerNoticeAlert.classList.remove('d-none', 'alert-success');
    submitAnswerNoticeAlert.classList.add('alert-primary');
    submitAnswerNoticeAlert.innerHTML = answerNoticeAlert('Error', e.message);
    manipulateAlert(submitAnswerNoticeAlert, answerNoticeForm);
  }
});

async function loadNecessaryData() {
  answerNoticeLoadExamType();
  await answerNoticeLoadSubjects();
  await populatePasswordBoard();
}

function answerNoticeLoadExamType() {
  answerNoticeExamType.innerHTML = examTypes();
}

async function answerNoticeLoadSubjects() {
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

    answerNoticeSubject.innerHTML = subjectElements;
  } catch (e) {
    console.log(e.message);
  }
}

async function populatePasswordBoard() {
  try {
    let response = await getAnswerNotice();

    if (response.error) {
      throw new Error(response.error.message);
    }

    let rowNum = 0;
    let noticeContent = [];

    for (let res of response.data) {
      ++rowNum;
      noticeContent.unshift(`<tr>
                    <td id="answer-notice-edit-${rowNum}" style="width: 45%;">${res.notice}</td>
                    <td id="answer-notice-edit-exam-year-${rowNum}" style="width: 35%;">${res.examTime}</td>
                    <td id="answer-notice-edit-subject-${rowNum}" style="width: 8%;">${res.subject}</td>
                    <td id="answer-notice-edit-exam-type-${rowNum}" style="width: 5%;">${res.examType}</td>
                    <td id="answer-notice-edit-id-${rowNum}" class="d-none id">${res._id}</td>
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
  const id = document.querySelector(`#answer-notice-edit-id-${rowNum}`).textContent.trim();
  const deleteSpanner = document.querySelector(`#delete-spanner-${rowNum}`);

  deleteSpanner.classList.remove('d-none');

  await deleteAnswerNotice(id);
  await populatePasswordBoard();
}

function editRow(rowNum) {
  const btnGroup = document.querySelector(`#btn-group-${rowNum}`);
  const updateBtn = document.querySelector(`#update-btn-${rowNum}`);
  const subjectColumn = document.querySelector(`#answer-notice-edit-subject-${rowNum}`);
  const examTypeColumn = document.querySelector(`#answer-notice-edit-exam-type-${rowNum}`);
  const examTimeColumn = document.querySelector(`#answer-notice-edit-exam-year-${rowNum}`);
  const answerNoticeColumn = document.querySelector(`#answer-notice-edit-${rowNum}`);
  const subject = subjectColumn.textContent.trim();
  const examType = examTypeColumn.textContent.trim();
  const examTime = examTimeColumn.textContent.trim();
  const notice = answerNoticeColumn.textContent.trim();

  btnGroup.classList.add('d-none');
  updateBtn.classList.remove('d-none');

  subjectColumn.innerHTML = `<input class="form-control" id="answer-notice-edit-subject-text-${rowNum}" type="text" value="${subject}" />`;
  examTypeColumn.innerHTML = `<input class="form-control" id="answer-notice-edit-exam-type-text-${rowNum}" type="text" value="${examType}" />`;
  examTimeColumn.innerHTML = `<textarea class="form-control" id="answer-notice-edit-exam-time-text-${rowNum}" spellcheck="true" autocomplete="on" required="">${examTime}</textarea>`;
  answerNoticeColumn.innerHTML = `<textarea class="form-control" id="answer-notice-edit-text-${rowNum}" spellcheck="true" autocomplete="on" required="">${notice}</textarea>`;
}

async function updateRow(rowNum) {
  const id = document.querySelector(`#answer-notice-edit-id-${rowNum}`).textContent.trim();
  const examTypeText = document.querySelector(`#answer-notice-edit-exam-type-text-${rowNum}`);
  const examTimeText = document.querySelector(`#answer-notice-edit-exam-time-text-${rowNum}`);
  const subjectText = document.querySelector(`#answer-notice-edit-subject-text-${rowNum}`);
  const noticeText = document.querySelector(`#answer-notice-edit-text-${rowNum}`);
  const updateSpanner = document.querySelector(`#update-spanner-${rowNum}`);

  updateSpanner.classList.remove('d-none');

  const data = {
    notice: noticeText.value,
    examType: examTypeText.value,
    examTime: examTimeText.value,
    subject: subjectText.value,
  };

  try {
    const response = await updateAnswerNotice(id, data);

    if (response.error) {
      throw new Error(response.error);
    }

    updateSpanner.classList.add('d-none');
    await populatePasswordBoard();

  } catch (e) {
    console.log(e);
  }
}

async function createAnswerNotice(answerNoticeData = {}) {
  const url = `${baseUrl}/answer-notices`;
  return await post(url, answerNoticeData);
}

async function getAnswerNotice() {
  const url = `${baseUrl}/answer-notices`;
  return await get(url);
}

async function deleteAnswerNotice(id) {
  const url = `${baseUrl}/answer-notices/${id}`;
  return await deleteData(url);
}

async function updateAnswerNotice(id, data) {
  const url = `${baseUrl}/answer-notices/${id}`;
  return await update(url, data);
}
