const phoneInput = document.querySelector("#verify-subscription-phone");
const submitBtn = document.querySelector("#verify-subscription-btn");
const verifiedMessage = document.querySelector("#verified-message");
const verifiedPhone = document.querySelector("#verified-phone");
const phoneTitle = document.querySelector("#phone-title");
const verifiedSubjects = document.querySelector("#verified-subjects");
const subjectTitle = document.querySelector("#subject-title");
const verifySubSpanner = document.querySelector('#verify-sub-spanner');

submitBtn.addEventListener("click", fetchApiBtn);
phoneInput.addEventListener("keypress", fetchApiEnter);

function fetchApiBtn (e) {
  e.preventDefault();
  verifiedMessage.textContent = '';

  fetchApi();
}

function fetchApiEnter (e) {
  if (e.key === "Enter") {
    e.preventDefault();

    fetchApi();
  }
}

async function fetchApi () {
  try {
    phoneTitle.classList.add("d-none");
    subjectTitle.classList.add("d-none");
    verifySubSpanner.classList.remove('d-none');
    if (!phoneInput.value) {
      throw new Error("Please enter your phone number to verify your subscripton!");
    }
    const phone = phoneInput.value;
    phoneInput.value = "";
    const fetchUrl = ` https://ceebookanswers.herokuapp.com/candidates/verifySubscription/${phone}`;

    const data = await fetch(fetchUrl);
    const verified = await data.json();

    if (verified.error) {
      phoneTitle.classList.add("d-none");
      subjectTitle.classList.add("d-none");
      throw new Error(verified.error.message);
    }

    phoneTitle.classList.remove("d-none");
    verifySubSpanner.classList.add('d-none');
    verifiedPhone.textContent = verified.data.phone;

    verifiedMessage.classList.remove("text-danger");
    subjectTitle.classList.remove("d-none");
    verifiedMessage.textContent = verified.message;

    let list = ""
    verified.data.subjects.map(subject => {
      list += "<li>" + subject + "</li>";
    });

    verifiedSubjects.innerHTML = list;
  } catch (e) {
    verifiedMessage.classList.add("text-danger");
    verifiedMessage.textContent = e.message;
    verifySubSpanner.classList.add('d-none');
    verifiedPhone.textContent = "";
    verifiedSubjects.innerHTML = "";
  }
}
