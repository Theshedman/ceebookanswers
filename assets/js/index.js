const accordion = document.querySelector('#accordion-1');
const externalLink = document.querySelector('#external-link');

async function getExternalLink() {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/external-links`;
  try {
    const externalLinkResponse = await fetch(fetchUrl);
    return await externalLinkResponse.json();
  } catch (e) {
    console.log(e.message);
  }
}

async function generalNotice() {
  const fetchUrl = ` https://ceebookanswers.herokuapp.com/general-notices`;
  try {
    const generalNoticeResponse = await fetch(fetchUrl);
    return await generalNoticeResponse.json();
  } catch (e) {
    console.log(e.message);
  }
}

document.addEventListener('DOMContentLoaded', async (e) => {
  const btnLink = await getExternalLink();
  console.log('btnLink:', btnLink);
  externalLink.href = `http://${btnLink.data[0].link}`;
  externalLink.innerHTML = btnLink.data[0].text;
});
