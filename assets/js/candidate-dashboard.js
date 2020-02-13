const candidateChangePassword = document.querySelector('#candidate-change-password');
const candidateLogout = document.querySelector('#candidate-logout');
const candidateSubjectsContainer = document.querySelector('#candidate-subjects-container');
const greetCandidate = document.querySelector('#candidate-greeting');

window.addEventListener('DOMContentLoaded', getCandidateSubjects);
candidateSubjectsContainer.addEventListener('click', (e) => {
  e.preventDefault();
  window.localStorage.setItem('subject', e.target.textContent);
  window.location = './candidate-answers.html'
});
async function getCandidateSubjects() {
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
      <li class="list-group-item text-primary border m-1 rounded-pill border-primary shadow swing animated flex-grow-1">
        <span>${value}</span>
      </li>
      `;
      candidateSubjectsContainer.insertAdjacentHTML('beforeend', subject);
    })
  } catch (e) {
    throw  new Error(e.message);
  }
};
