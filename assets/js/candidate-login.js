import { baseUrl, post } from './utils/index.js';

const candidatePhoneField = document.querySelector('#candidate-phone');
const candidatePasswordField = document.querySelector('#candidate-password');
const candidateLoginBtn = document.querySelector('#candidate-login-btn');
const candidateLoginErrorMessage = document.querySelector('#candidate-login-error-message');
const candidateLoginSpanner = document.querySelector('#candidate-login-spanner');
const examTypeLogin = document.querySelector('#exam-type-login');

candidateLoginBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const phone = candidatePhoneField.value;
  const password = candidatePasswordField.value;
  const examType = examTypeLogin.value;

  candidateLoginErrorMessage.textContent = '';
  candidateLoginErrorMessage.classList.add('d-none');
  candidateLoginSpanner.classList.remove('d-none');

  try {
    const candidateLoginData = await candidateSubmitLoginDetails(phone, password, examType);

    if (candidateLoginData.error) {
      throw new Error(candidateLoginData.error.message);
    }

    window.localStorage.setItem('token', candidateLoginData.data.token);
    window.localStorage.setItem('type', candidateLoginData.data.candidate.type);
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

const candidateSubmitLoginDetails = async (phone, password, examType) => {
  try {
    const fetchUrl = `${baseUrl}/candidates/login`;
    const data = { phone, password, examType };
    return await post(fetchUrl, data);
  } catch (e) {
    throw  new Error(e.message);
  }
};
