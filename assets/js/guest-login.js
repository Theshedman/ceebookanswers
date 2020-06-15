import { baseUrl, post } from './utils/index.js';

const guestPhoneField = document.querySelector('#guest-phone');
const guestPasswordField = document.querySelector('#guest-password');
const guestLoginBtn = document.querySelector('#guest-login-btn');
const guestLoginErrorMessage = document.querySelector('#guest-login-error-message');
const guestLoginSpanner = document.querySelector('#guest-login-spanner');

guestLoginBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const phone = guestPhoneField.value;
  const password = guestPasswordField.value;

  guestLoginErrorMessage.textContent = '';
  guestLoginErrorMessage.classList.add('d-none');
  guestLoginSpanner.classList.remove('d-none');

  try {
    const guestLoginData = await guestSubmitLoginDetails(phone, password);

    if (guestLoginData.error) {
      throw new Error(guestLoginData.error.message);
    }

    window.localStorage.setItem('token', guestLoginData.data.token);
    window.localStorage.setItem('type', guestLoginData.data.guest.type);
    window.localStorage.setItem('examType', guestLoginData.data.guest.examType);
    window.localStorage.setItem('subject', guestLoginData.data.guest.subject);

    guestLoginSpanner.classList.add('d-none');
    window.location = './answer-page.html';
  } catch (e) {
    guestLoginErrorMessage.classList.remove('d-none');
    guestLoginSpanner.classList.add('d-none');
    guestLoginErrorMessage.textContent = e.message;
  }

});

const guestSubmitLoginDetails = async (phone, password) => {
  try {
    const fetchUrl = `${baseUrl}/guests/login`;
    const data = { phone, password };
    return await post(fetchUrl, data);
  } catch (e) {
    throw new Error(e.message);
  }
};
