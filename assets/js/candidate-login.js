const candidatePhoneField = document.querySelector('#candidate-phone');
const candidatePasswordField = document.querySelector('#candidate-password');
const candidateLoginBtn = document.querySelector('#candidate-login-btn');
const candidateLoginErrorMessage = document.querySelector('#candidate-login-error-message');
const candidateLoginSpanner = document.querySelector('#candidate-login-spanner');

candidateLoginBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const phone = candidatePhoneField.value;
  const password = candidatePasswordField.value;

  candidateLoginErrorMessage.textContent = '';
  candidateLoginErrorMessage.classList.add('d-none');
  candidateLoginSpanner.classList.remove('d-none');

  try {
    const candidateLoginData = await candidateSubmitLoginDetails(phone, password);

    if (candidateLoginData.error) {
      throw new Error(candidateLoginData.error.message);
    }

    window.localStorage.setItem('token', candidateLoginData.data.token);
    window.localStorage.setItem('phone', candidateLoginData.data.candidate.phone);
    window.localStorage.setItem('examType', candidateLoginData.data.candidate.examType);

    candidateLoginSpanner.classList.add('d-none');

    window.localStorage.removeItem('subject');
    window.location = './candidate-dashboard.html';
  } catch (e) {
    candidateLoginErrorMessage.classList.remove('d-none');
    candidateLoginSpanner.classList.add('d-none');
    candidateLoginErrorMessage.textContent = e.message;
  }
});

const candidateSubmitLoginDetails = async (phone, password) => {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/candidates/login`;
  const data = { phone, password };
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
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (e) {
    throw  new Error(e.message);
  }
};
