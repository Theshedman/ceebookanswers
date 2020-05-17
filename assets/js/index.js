const accordion = document.querySelector('#accordion-1');
const externalLink = document.querySelector('#external-link');
const accordionSpanner = document.querySelector('#accordion-spanner');

async function getExternalLink() {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/external-links`;
  try {
    const externalLinkResponse = await fetch(fetchUrl);
    return await externalLinkResponse.json();
  } catch (e) {
    console.log(e.message);
  }
}

async function getGeneralNotice() {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/general-notices`;
  try {
    const generalNoticeResponse = await fetch(fetchUrl);
    const noticeData = await generalNoticeResponse.json();

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
  const btnLink = await getExternalLink();
  const getNotice = await getGeneralNotice();

  externalLink.href = `http://${btnLink.data[0].link}`;
  externalLink.innerHTML = btnLink.data[0].text;

  accordionSpanner.classList.add('d-none');
  accordion.insertAdjacentHTML('beforeend', getNotice);
});
