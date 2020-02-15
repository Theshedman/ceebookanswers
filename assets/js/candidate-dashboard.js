const candidateChangePassword = document.querySelector('#candidate-change-password');
const candidateLogout = document.querySelector('#candidate-logout');
const candidateSubjectsContainer = document.querySelector('#candidate-subjects-container');
const greetCandidate = document.querySelector('#candidate-greeting');

window.addEventListener('DOMContentLoaded', getCandidateSubjects);
candidateSubjectsContainer.addEventListener('click', (e) => {
  e.preventDefault();
  window.localStorage.removeItem('subject');
  window.localStorage.setItem('subject', e.target.textContent);
  window.location = './candidate-answers.html'
});

async function getCandidateSubjects () {
  const body = document.querySelector('body');
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/candidates/me`;
  try {
    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    });
    const candidateProfile = await response.json();

    if (candidateProfile.error) {
      throw new Error(candidateProfile.error.message);
    }

    greetCandidate.textContent = candidateProfile.data.phone;
    candidateProfile.data.subjects.map(value => {
      const subject = `
      <li class="d-flex align-content-center justify-content-center list-group-item text-primary border m-1 rounded-pill border-primary shadow swing animated flex-grow-1">
        <span>${value}</span>
      </li>
      `;
      candidateSubjectsContainer.insertAdjacentHTML('beforeend', subject);
    })
  } catch (e) {
    body.innerHTML = `<div class="highlight-clean">
    <div class="container">
        <div class="intro">
            <h2 class="text-center">Access Denied.</h2>
            <p class="text-center text-danger">Please Login to view answers. You can only login in to one device. Logging in to another device will log you out from the first one. So make sure that you do not share your password with anyone to avoid being logged out from your device. </p>
        </div>
        </div>
</div>
`
  }
};
