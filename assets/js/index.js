import { baseUrl, get, examTypes } from './utils/index.js';

const accordion = document.querySelector('#accordion-1');
const accordionSpanner = document.querySelector('#accordion-spanner');
const examTypeLogin = document.querySelector('#exam-type-login');
const guessExamTypeLogin = document.querySelector('#guess-exam-type-login');
const examTypeVerify = document.querySelector('#exam-type-verify');

async function getGeneralNotice() {
  const fetchUrl = `${baseUrl}/general-notices`;
  try {
    const noticeData = await get(fetchUrl);

    if (!noticeData.data.length) {
      throw new Error();
    }

    let notice = '';
    for (let i = 0; i < noticeData.data.length; i++) {
      const accordionResponse = accordionComponentBuilder(i, noticeData.data[i].heading, noticeData.data[i].notice);

      notice += accordionResponse;
    }

    return notice;
  } catch (e) {
    console.log(e.message);
  }
}

function accordionComponentBuilder(itemNumber, header, text) {
  const toggleItem = itemNumber === 0 ? 'show' : '';

  return (`<div class="card">
    <div class="card-header" role="tab">
    <h5 class="mb-0"><a data-toggle="collapse" aria-expanded="true" aria-controls="accordion-1 .item-${itemNumber}"
  href="#accordion-1 .item-${itemNumber}">${header}</a></h5>
  </div>
  <div class="collapse ${toggleItem} item-${itemNumber}" role="tabpanel" data-parent="#accordion-1">
    <div class="card-body">
    <div class="card-text text-black-50">${text}</div>
  </div>
  </div>
  </div>`);
}

document.addEventListener('DOMContentLoaded', async (e) => {
  loadExamType();
  const getNotice = await getGeneralNotice();

  accordionSpanner.classList.add('d-none');
  accordion.insertAdjacentHTML('beforeend', getNotice);
});

function loadExamType() {
  examTypeLogin.innerHTML = examTypes();
  guessExamTypeLogin.innerHTML = examTypes();
  examTypeVerify.innerHTML = examTypes();
}
