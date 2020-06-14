import {
  alert as noticeAlert,
  baseUrl,
  deleteData,
  get,
  manipulateAlert,
  post,
  update
} from './utils/index.js';

const noticeHeading = document.querySelector('#notice-heading');
const noticeBody = document.querySelector('#notice-body');
const createNotice = document.querySelector('#create-notice');
const noticeBoard = document.querySelector('#notice-board');
const submitNoticeSpannerBtn = document.querySelector('#submit-notice-spanner-btn');
const editNoticeSpannerBtn = document.querySelector('#edit-notice-spanner-btn');
const submitNoticeAlert = document.querySelector('#submit-notice-alert');
const noticeForm = document.querySelector('#notice-form');

window.addEventListener('DOMContentLoaded', populateNoticeBoard);
createNotice.addEventListener('click', async () => {
  submitNoticeSpannerBtn.classList.remove('d-none');

  const noticeData = {};
  noticeData.heading = noticeHeading.value;
  noticeData.notice = noticeBody.value;

  try {
    const response = await postGenerateNotice(noticeData);
    if (response.error) {
      throw new Error(response.error.message);
    }

    await populateNoticeBoard();

    submitNoticeSpannerBtn.classList.add('d-none');
    noticeForm.classList.add('d-none');

    submitNoticeAlert.classList.add('d-none', 'alert-success');
    submitNoticeAlert.innerHTML = noticeAlert('Success', 'General notice posted successfully.');
    submitNoticeAlert.classList.remove('d-none');
    manipulateAlert(submitNoticeAlert, noticeForm);
  } catch (e) {
    submitNoticeSpannerBtn.classList.add('d-none');

    submitNoticeAlert.classList.remove('d-none', 'alert-success');
    submitNoticeAlert.classList.add('alert-primary');
    submitNoticeAlert.innerHTML = noticeAlert('Error', e.message);
    manipulateAlert(submitNoticeAlert, noticeForm);
  }
});

async function populateNoticeBoard() {
  try {
    let response = await getGenerateNotice();

    if (response.error) {
      throw new Error(response.error.message);
    }

    let rowNum = 0;
    let noticeContent = [];

    for (let res of response.data) {
      ++rowNum;
      noticeContent.unshift(`<tr>
                    <td id="heading-${rowNum}" style="width: 15%;">${res.heading}</td>
                    <td id="notice-${rowNum}" style="width: 55%;">${res.notice}</td>
                    <td id="id-${rowNum}" class="d-none id">${res._id}</td>
                    <td style="width: 20%;">
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
    noticeBoard.innerHTML = noticeContent.join('');
    // Clear previous notice content
    noticeContent = [];
  } catch (e) {
    console.log(e);
  }
}


noticeBoard.addEventListener('click', async (e) => {
  const tableRow = e.target.parentNode.parentNode.parentNode;
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
  const id = document.querySelector(`#id-${rowNum}`).textContent.trim();
  const deleteSpanner = document.querySelector(`#delete-spanner-${rowNum}`);

  deleteSpanner.classList.remove('d-none');

  await deleteGeneralNotice(id);
  await populateNoticeBoard();
}

function editRow(rowNum) {
  const btnGroup = document.querySelector(`#btn-group-${rowNum}`);
  const updateBtn = document.querySelector(`#update-btn-${rowNum}`);
  const noticeColumn = document.querySelector(`#notice-${rowNum}`);
  const headingColumn = document.querySelector(`#heading-${rowNum}`);
  let notice = noticeColumn.textContent.trim();
  const heading = headingColumn.textContent.trim();
  const detectUrlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

  notice = notice.replace(detectUrlRegex, (url) => {
    return `[${url}]`;
  });

  btnGroup.classList.add('d-none');
  updateBtn.classList.remove('d-none');

  noticeColumn.innerHTML = `<textarea style="height: 40px;" class="form-control" id="notice-text-${rowNum}">${notice}</textarea>`;
  headingColumn.innerHTML = `<input class="form-control" id="heading-text-${rowNum}" type="text" value="${heading}" />`;
}

async function updateRow(rowNum) {
  const id = document.querySelector(`#id-${rowNum}`).textContent.trim();
  const noticeText = document.querySelector(`#notice-text-${rowNum}`);
  const headingText = document.querySelector(`#heading-text-${rowNum}`);
  const updateBtn = document.querySelector(`#update-btn-${rowNum}`);
  const updateSpanner = document.querySelector(`#update-spanner-${rowNum}`);

  updateSpanner.classList.remove('d-none');

  const data = {};
  data.notice = noticeText.value;
  data.heading = headingText.value;

  try {
    const response = await updateGeneralNotice(id, data);

    if (response.error) {
      throw new Error(response.error);
    }

    updateSpanner.classList.add('d-none');
    await populateNoticeBoard();

  } catch (e) {
    console.log(e);
  }
}

async function postGenerateNotice(notice = {}) {
  const url = `${baseUrl}/general-notices`;
  return await post(url, notice);
}

async function getGenerateNotice() {
  const url = `${baseUrl}/general-notices`;
  return await get(url);
}

async function deleteGeneralNotice(id) {
  const url = `${baseUrl}/general-notices/${id}`;
  return await deleteData(url);
}

async function updateGeneralNotice(id, data) {
  const url = `${baseUrl}/general-notices/${id}`;
  return await update(url, data);
}
