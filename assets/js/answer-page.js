import { accessDeniedMessage, baseUrl, get, logout } from './utils/index.js';

const guestRefreshPage = document.querySelector('#guest-refresh-page');
const guestLogout = document.querySelector('#guest-logout');
const guestAnswerSpanner = document.querySelector('#guest-answer-spanner');
const guestRefreshBtnSpanner = document.querySelector('#guest-refresh-btn-spanner');
const guestLogoutBtnSpanner = document.querySelector('#guest-logout-btn-spanner');


loadAnswerNotice().then();

guestRefreshPage.addEventListener('click', getAllAnswers);
window.addEventListener('DOMContentLoaded', getAllAnswers);

async function getAllAnswers(e) {
  e.preventDefault();
  guestAnswerSpanner.classList.remove('d-none');
  guestAnswerSpanner.classList.add('d-flex');
  guestRefreshBtnSpanner.classList.remove('d-none');

  const body = document.querySelector('body');

  const subject = localStorage.getItem('subject');
  const examType = localStorage.getItem('examType');
  const fetchUrl = `${baseUrl}/answers?subject=${subject}&examType=${examType}`;

  try {
    const answers = await get(fetchUrl);

    if (answers.error) {
      throw new Error(answers.error.message);
    }


    renderAnswers(answers.data);
  } catch (e) {
    body.innerHTML = accessDeniedMessage();
  }
}

function renderAnswers(answers) {
  const answerContainer = document.querySelector('#answers');
  const sortedAnswers = answers.sort((a, b) => {
    return a.answerNumber - b.answerNumber;
  });
  let answerContent = [];

  for (let answer of sortedAnswers) {
    let answerPhoto = '';

    if (answer.photoUrl) {
      answerPhoto = `<img width="80%" src="${answer.photoUrl}" alt="answer image" />`;
    }

    answerContent.push(`<div class="row">
            <div class="col d-md-flex align-items-md-start col-2">
                <button class="btn btn-primary" 
                 type="button">${answer.answerNumber}</button>
            </div>
            <div class="col">
                <div>${answer.answer}</div>${answerPhoto}
            </div>
        </div>
<hr/>
<hr/>`);
  }

  guestRefreshBtnSpanner.classList.add('d-none');
  guestAnswerSpanner.classList.add('d-none');
  guestAnswerSpanner.classList.remove('d-flex');
  answerContainer.innerHTML = answerContent.join('');
  answerContent = [];
}

guestLogout.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    guestLogoutBtnSpanner.classList.remove('d-none');
    await logout(guestLogoutBtnSpanner);
  } catch (e) {
    alert(e.message);
  }
});

async function loadAnswerNotice() {
  const subjectName = document.querySelector('#subject-name');
  const examTime = document.querySelector('#exam-time');
  const noticeBoard = document.querySelector('#notice-board');
  const subject = window.localStorage.getItem('subject');
  const fetchUrl = `${baseUrl}/answer-notices?subject=${subject}`;

  try {
    const answerNotice = await get(fetchUrl);

    if (answerNotice.error) {
      throw new Error(answerNotice.error.message);
    }

    const notice = answerNotice.data[0];

    if (notice) {
      subjectName.textContent = notice.subject + ' answers';
      examTime.innerHTML = notice.examTime;
    } else {
      subjectName.textContent = 'Answer';
    }

    if (notice?.notice) {
      noticeBoard.classList.remove('d-none');
      noticeBoard.innerHTML = notice.notice;
    }

  } catch (e) {
    console.log(e.message);
  }
}
