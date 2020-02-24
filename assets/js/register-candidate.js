const candidatePhone = document.querySelector("#candidate-phone");
const examType = document.querySelector("#exam-type");
const examYear = document.querySelector("#exam-year");
const subscriptionType = document.querySelector("#subscription-type");
const allSubjects = document.querySelector("#all-subjects");
const subjectContainer = document.querySelector("#subject-container");
const registerCandidateBtn = document.querySelector("#register-candidate");

window.addEventListener("DOMContentLoaded", loadExamYearAndSubjects);


function loadExamYearAndSubjects () {
  loadExamYear();
  loadSubjects();
}

function loadExamYear () {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  examYear.innerHTML = `
  <optgroup label="Exam Year">
      <option value="" selected="">Select Year</option>
      <option value="${currentYear}">${currentYear}</option>
      <option value="${nextYear}">${nextYear}</option>
  </optgroup>
  `;
}

async function loadSubjects () {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/subjects`;
  try {
    const response = await fetch(fetchUrl, {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });
    const subjects = await response.json();

    if (subjects.error) {
      throw new Error(subjects.error.message);
    }

    let subjectElements = "";

    subjects.data.map(subject => {
      subjectElements += `
          <div class="form-check">
              <input class="form-check-input" type="checkbox" id="${subject._id}">
              <label class="form-check-label" for="formCheck-1">${subject.subject}</label>
          </div>
      `
    });

    subjectContainer.innerHTML = subjectElements;
  } catch (e) {
    console.log(e.message);
  }
}

async function createCandidate (candidateDetails = {}) {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/candidates/register`;
  try {
    const response = await fetch(fetchUrl, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(candidateDetails)
    });
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
}
