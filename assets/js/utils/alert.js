export const alert = (heading, message) => `<strong>${heading}!</strong> ${message}.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>`;

export const manipulateAlert = (alertElement, formElement) => {
  setTimeout(() => {
    alertElement.classList.add('d-none');

    formElement.classList.remove('d-none');
  }, 3500);
};

export const manipulatePasswordUpdateElements = (alertElement, passwordBtn) => {
  setTimeout(() => {
    alertElement.classList.add('d-none');

    passwordBtn.classList.add('d-flex');
    passwordBtn.classList.remove('d-none');
  }, 3500);
};

export const accessDeniedMessage = () => {
  return `<div class="highlight-clean">
    <div class="container">
        <div class="intro">
            <h2 class="text-center">Access Denied.</h2>
            <p class="text-center text-danger">Please Login to view answers. You can only login in to one device. Logging in to another device will log you out from the first one. So make sure that you do not share your password with anyone to avoid being logged out from your device. </p>
        </div>
        </div>
</div>
`;
}
