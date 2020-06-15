import { baseUrl } from './base-url.js';
import { post } from './request.js';

export async function logout(spanner) {
  const type = window.localStorage.getItem('type');
  let fetchUrl = '';

  if (type === 'admin') {
    fetchUrl = `${baseUrl}/admins/logout`;
  } else if (type === 'guest') {
    fetchUrl = `${baseUrl}/guests/logout`;
  } else if (type === 'candidate') {
    fetchUrl = `${baseUrl}/candidates/logout`;
  }

  const loggedOut = await post(fetchUrl);

  if (loggedOut.error) {
    throw new Error(loggedOut.error.message);
  }
  spanner.classList.add('d-none');
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('type');
  window.localStorage.removeItem('subject');
  window.localStorage.removeItem('examType');
  window.localStorage.removeItem('phone');
  window.localStorage.removeItem('firstName');
  window.localStorage.removeItem('lastName');
  window.location = './index.html';
}
