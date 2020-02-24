const candidatePhone = document.querySelector("#candidate-phone");
const examType = document.querySelector("#exam-type");
const examYear = document.querySelector("#exam-year");
const subscriptionType = document.querySelector("#subscription-type");
const allSubjects = document.querySelector("#all-subjects");
const subjectContainer = document.querySelector("#subject-container");
const registerCandidateBtn = document.querySelector("#register-candidate-btn");
const registerCandidateAlert = document.querySelector("#register-candidate-alert");
const candidateDefaultPassword = document.querySelector("#candidate-default-password");
const registerCandidateSpannerBtn = document.querySelector("#register-candidate-spanner-btn");
const candidateForm = document.querySelector("#candidate-form");

window.addEventListener("DOMContentLoaded", loadExamYearAndSubjects);
registerCandidateBtn.addEventListener("click", async () => {
  registerCandidateSpannerBtn.classList.remove("d-none");
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/candidates/register`;

  const phone = candidatePhone.value;
  const exam_year = examYear.value;
  const subType = subscriptionType.value;
  const exam_type = examType.value;
  const password = candidateDefaultPassword.value;
  const candidateData = {
    phone,
    examYear: exam_year,
    examType: exam_type,
    subscriptionType: subType,
    subjects: subjectArray,
    password
  };

  const candidateAlert = (heading, message) => `<strong>${heading}!</strong> ${message}.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>`;

  const manipulateRegisterCandidateElements = (alertElement, candidateForm) => {
    setTimeout(() => {
      alertElement.classList.add("d-none");

      candidateForm.classList.remove("d-none");
    }, 3500);
  };

  try {
    const response = await fetch(fetchUrl, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(candidateData)
    });

    const responseData = await response.json();
    if (responseData.error) {
      throw  new Error(responseData.error.message);
    }

    registerCandidateSpannerBtn.classList.add("d-none");
    candidateForm.classList.add("d-none");

    registerCandidateAlert.classList.add("d-none", "alert-success");
    registerCandidateAlert.innerHTML = candidateAlert("Success", "Candidate is successufully registered.");
    registerCandidateAlert.classList.remove("d-none");
    manipulateRegisterCandidateElements(registerCandidateAlert, candidateForm);

  } catch (e) {
    registerCandidateSpannerBtn.classList.add("d-none");

    candidateForm.classList.add("d-none");

    registerCandidateAlert.classList.remove("d-none", "alert-success");
    registerCandidateAlert.classList.add("alert-primary");
    registerCandidateAlert.innerHTML = candidateAlert("Error", e.message);
    manipulateRegisterCandidateElements(registerCandidateAlert, candidateForm);
  }
});

let subjectArray = [];

allSubjects.addEventListener('click', () => {
  const subjects = [...document.querySelectorAll("[name=subjects]")];
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

subjectContainer.addEventListener("click", (e) => {
  // const subjects = [...document.querySelectorAll("[name=subjects]")];
  console.log(e.target.value);
  if (e.target.checked && !subjectArray.includes(e.target.value)) {
    subjectArray.push(e.target.value);
  } else {
    subjectArray = subjectArray.filter(value => e.target.value !== value);
  }
});


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
              <input class="form-check-input" name="subjects" value="${subject.subject}" type="checkbox" id="${subject._id}">
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
