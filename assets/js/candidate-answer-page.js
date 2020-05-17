const candidateRefreshPage = document.querySelector('#candidate-refresh-page');
const candidateLogout = document.querySelector('#candidate-logout');
const candidateAnswerSpanner = document.querySelector('#candidate-answer-spanner');
const candidateRefreshBtnSpanner = document.querySelector('#candidate-refresh-btn-spanner');
const candidateLogoutBtnSpanner = document.querySelector('#candidate-logout-btn-spanner');


candidateLoadAnswerNotice();

candidateRefreshPage.addEventListener('click', getAllAnswers);
window.addEventListener('DOMContentLoaded', getAllAnswers);

async function getAllAnswers(e) {
  e.preventDefault();
  candidateAnswerSpanner.classList.remove('d-none');
  candidateAnswerSpanner.classList.add('d-flex');
  candidateRefreshBtnSpanner.classList.remove('d-none');

  const body = document.querySelector('body');

  const subject = localStorage.getItem('subject');
  const examType = localStorage.getItem('examType');
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/answers?subject=${subject}&examType${examType}`;

  try {
    const data = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    });
    const answers = await data.json();

    if (answers.error) {
      throw new Error(answers.error.message);
    }


    renderAnswers(answers.data);
  } catch (e) {
    body.innerHTML = `<div class="highlight-clean">
    <div class="container">
        <div class="intro">
            <h2 class="text-center">Access Denied.</h2>
            <p class="text-center text-danger">Please Login to view answers. You can only login in to one device. Logging in to another device will log you out from the first one. So make sure that you do not share your password with anyone to avoid being logged out from your device. </p>
        </div>
        </div>
</div>
`;
  }
}

function renderAnswers(answers) {
  const answerContainer = document.querySelector('#answers');
  const sortedAnswers = answers.sort((a, b) => {
    return a.answerNumber - b.answerNumber;
  });
  let answerContent = '';

  for (let answer of sortedAnswers) {
    let answerPhoto = '';

    if (answer.photoUrl) {
      answerPhoto = `<img width="80%" src="${answer.photoUrl}" alt="" />`;
    }

    answerContent += `<div class="row">
            <div class="col d-md-flex align-items-md-start col-2">
                <button class="btn btn-primary" type="button">${answer.answerNumber}</button>
            </div>
            <div class="col">
                <div>${answer.answer}</div>${answerPhoto}
            </div>
        </div>
<hr/>
<hr/>`;
  }

  candidateRefreshBtnSpanner.classList.add('d-none');
  candidateAnswerSpanner.classList.add('d-none');
  candidateAnswerSpanner.classList.remove('d-flex');
  answerContainer.insertAdjacentHTML('beforeend', answerContent);
}

candidateLogout.addEventListener('click', async (e) => {
  e.preventDefault();

  const fetchUrl = `https://ceebookanswers.herokuapp.com/candidates/logout`;
  candidateLogoutBtnSpanner.classList.remove('d-none');

  try {
    const logout = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      },
      method: 'POST'
    });
    const loggedOut = logout.json();

    if (loggedOut.error) {
      throw new Error(loggedOut.error.message);
    }
    candidateLogoutBtnSpanner.classList.add('d-none');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('subject');
    window.localStorage.removeItem('examType');
    window.localStorage.removeItem('phone');
    window.location = './index.html';
  } catch (e) {
    alert(e.message);
  }
});

async function candidateLoadAnswerNotice() {
  const subjectName = document.querySelector('#subject-name');
  const examTime = document.querySelector('#exam-time');
  const noticeBoard = document.querySelector('#notice-board');
  const subject = window.localStorage.getItem('subject');
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/answer-notices?subject=${subject}`;

  try {
    const data = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    });
    const answerNotice = await data.json();

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

    if (notice.notice) {
      noticeBoard.classList.remove('d-none');
      noticeBoard.innerHTML = notice.notice;
    }

  } catch (e) {
    console.log(e.message);
  }
}
