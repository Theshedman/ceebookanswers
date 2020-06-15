import {
  alert as passwordAlert,
  manipulatePasswordUpdateElements
} from './alert.js';
import { baseUrl } from './base-url.js';
import { update } from './request.js';

export async function updatePassword(newPasswordField,confirmPasswordField, oldPasswordField, passwordErrorField, passwordSpanner, changePasswordForm, passwordAlertField, passwordBtnContainer) {

  passwordSpanner.classList.remove('d-none');
  const password = newPasswordField.value;
  const confirmPassword = confirmPasswordField.value;
  const oldPassword = oldPasswordField.value;
  const phone = window.localStorage.getItem('phone');

  if (!password || !confirmPassword || !oldPassword) {
    passwordErrorField.textContent = 'Fill the empty fields.';
    passwordErrorField.classList.remove('d-none');
    passwordSpanner.classList.add('d-none');
    return;
  }
  if (password !== confirmPassword) {
    passwordErrorField.textContent = 'Password do not match.';
    passwordSpanner.classList.add('d-none');
    passwordErrorField.classList.remove('d-none');
    return;
  } else {
    passwordErrorField.classList.add('d-none');
  }
  try {
    const changePassword = await changePasswordHelper(phone, oldPassword, password);

    if (changePassword.error) {
      throw new Error(changePassword.error.message);
    }

    passwordSpanner.classList.add('d-none');
    changePasswordForm.classList.remove('d-flex');
    changePasswordForm.classList.add('d-none');

    passwordAlertField.innerHTML = passwordAlert('Success', 'You have successfully changed your password');
    passwordAlertField.classList.remove('d-none');

    manipulatePasswordUpdateElements(passwordAlertField, passwordBtnContainer);
    newPasswordField.value = '';
    confirmPasswordField.value = '';
    oldPasswordField.value = '';
  } catch (e) {
    passwordSpanner.classList.add('d-none');

    changePasswordForm.classList.remove('d-flex');
    changePasswordForm.classList.add('d-none');

    passwordAlertField.classList.remove('d-none', 'alert-success');
    passwordAlertField.classList.add('alert-primary');
    passwordAlertField.innerHTML = passwordAlert('Error', e.message);
  }
}

async function changePasswordHelper(phone, oldPassword, password) {
  try {
    const type = window.localStorage.getItem('type');
    const data = { phone, password };
    let fetchUrl = '';

    if (type === 'admin') {
      fetchUrl = `${baseUrl}/admins/me`;
    } else if (type === 'candidate') {
      fetchUrl = `${baseUrl}/candidates/me/updatePassword`;
      data.oldPassword = oldPassword;
    }

    return await update(fetchUrl, data);
  } catch (e) {
    throw new Error(e.message);
  }
}

export function togglePasswordFormAndAlert(passwordBtnContainer, passwordForm) {
  passwordBtnContainer.classList.add('d-none');
  passwordBtnContainer.classList.remove('d-flex');

  passwordForm.classList.add('d-flex');
  passwordForm.classList.remove('d-none');
}
