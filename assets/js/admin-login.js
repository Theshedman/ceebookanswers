import { baseUrl, post } from './utils/index.js';

const adminPhoneField = document.querySelector('#admin-phone');
const adminPasswordField = document.querySelector('#admin-password');
const adminLoginBtn = document.querySelector('#admin-login-btn');
const adminLoginErrorMessage = document.querySelector('#admin-login-error-message');
const adminLoginSpanner = document.querySelector('#admin-login-spanner');

adminLoginBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const phone = adminPhoneField.value;
  const password = adminPasswordField.value;

  adminLoginErrorMessage.textContent = '';
  adminLoginErrorMessage.classList.add('d-none');
  adminLoginSpanner.classList.remove('d-none');

  try {
    const adminLoginData = await adminSubmitLoginDetails(phone, password);

    if (adminLoginData.error) {
      throw new Error(adminLoginData.error.message);
    }

    window.localStorage.setItem('token', adminLoginData.data.token);
    window.localStorage.setItem('phone', adminLoginData.data.admin.phone);
    window.localStorage.setItem('type', adminLoginData.data.admin.type);
    window.localStorage.setItem('firstName', adminLoginData.data.admin.firstName);
    window.localStorage.setItem('lastName', adminLoginData.data.admin.lastName);

    adminLoginSpanner.classList.add('d-none');
    window.location = './admin-dashboard.html';
  } catch (e) {
    adminLoginErrorMessage.classList.remove('d-none');
    adminLoginSpanner.classList.add('d-none');
    adminLoginErrorMessage.textContent = e.message;
  }
});

const adminSubmitLoginDetails = async (phone, password) => {
  try {
    const fetchUrl = `${baseUrl}/admins/login`;
    const data = { phone, password };
    return await post(fetchUrl, data);
  } catch (e) {
    console.log(e.message);
  }
};
