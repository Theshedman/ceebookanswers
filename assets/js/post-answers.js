import { baseUrl, post } from './utils/index.js';

const answerSubject = document.querySelector('#answer-subject');
const answerExamType = document.querySelector('#answer-exam-type');
const answerExamYear = document.querySelector('#answer-exam-year');
const answerAnswers = document.querySelector('#answer-answers');
const answerExamNumber = document.querySelector('#answer-exam-number');
const answerPhoto = document.querySelector('#answer-photo');
const submitAnswer = document.querySelector('#submit-answer');
const submitAnswerSpannerBtn = document.querySelector('#submit-answer-spanner-btn');

submitAnswer.addEventListener('click', async () => {
  const answer = {
    answer: answerAnswers.value,
    answerNumber: answerExamNumber.value,
    subject: answerSubject.value,
    photo: answerPhoto.value,
    examType: answerExamType.value,
    examYear: answerExamYear.value
  };
  console.log('answer:', answer);
});

async function postAnswer(answer = {}) {
  const url = `${baseUrl}/answers`;
  await post(url, answer);
}
