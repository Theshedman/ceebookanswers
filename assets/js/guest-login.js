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
    window.localStorage.setItem('examType', guestLoginData.data.guest.examType);
    window.localStorage.setItem('subject', guestLoginData.data.guest.subject);

    guestLoginSpanner.classList.add('d-none');
    window.location = './guest-answers.html';
  } catch (e) {
    guestLoginErrorMessage.classList.remove('d-none');
    guestLoginSpanner.classList.add('d-none');
    guestLoginErrorMessage.textContent = e.message;
  }

});

const guestSubmitLoginDetails = async (phone, password) => {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/guests/login`;
  const data = { phone: phone, password: password };
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
    const responseJson = await response.json();

    return responseJson;
  } catch (e) {
    throw new Error(e.message);
  }
};
