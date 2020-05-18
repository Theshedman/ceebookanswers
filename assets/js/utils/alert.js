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
