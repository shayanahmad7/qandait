// index.js
document.addEventListener('DOMContentLoaded', () => {
  // Fetch existing questions and display them
  fetch('/questions/')
    .then(response => response.json())
    .then(questions => {
      questions.forEach(question => {
        displayQuestion(question);
      });
    })
    .catch(error => {
      console.error('Error fetching questions:', error);
    });

  // Event listener for the Ask Question button
  const askButton = document.getElementById('btn-show-modal-question');
  askButton.addEventListener('click', () => showModal('modal-question'));

  // Event listeners for close buttons in modals
  const closeButtons = document.querySelectorAll('.modal .close');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) {
        hideModal(modal.id);
      }
    });
  });

  // Submit new question
  const createQuestionButton = document.getElementById('create-question');
  createQuestionButton.addEventListener('click', () => {
    const questionText = document.getElementById('question-text').value;
    if (questionText) {
      submitNewQuestion(questionText);
    }
  });

  // Handle adding answers
  const createAnswerButton = document.getElementById('create-answer');
  createAnswerButton.addEventListener('click', () => {
    const answerText = document.getElementById('answer-text').value;
    const questionId = document.getElementById('question-id').value;
    if (answerText && questionId) {
      submitNewAnswer(questionId, answerText);
    }
  });
});

// Function to show a modal
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
}

// Function to hide a modal
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// Function to create HTML elements
function createElement(type, attrs, ...children) {
  const ele = document.createElement(type);
  for (const prop in attrs) {
    if (attrs.hasOwnProperty(prop)) {
      ele.setAttribute(prop, attrs[prop]);
    }
  }
  children.forEach(c => ele.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return ele;
}

// Function to display a question
function displayQuestion(question) {
  const questionElement = createElement('h3', {}, question.question);
  const answersList = createElement('ul', {id: `answers-for-${question._id}`}, ...question.answers.map(answer => createElement('li', {}, answer)));

  const answerButton = createElement('button', { type: 'button' }, 'Add Answer');
  answerButton.addEventListener('click', () => {
    showModal('modal-answer');
    document.getElementById('question-id').value = question._id; // Set the hidden field for the question ID
  });

  const article = createElement('article', {}, questionElement, answersList, answerButton);
  document.querySelector('main').appendChild(article);
  
}

// Function to submit a new question
function submitNewQuestion(questionText) {
  fetch('/questions/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: questionText })
  })
  .then(response => response.json())
  .then(newQuestion => {
    if (newQuestion && !newQuestion.error) {
      // Display the new question
      displayQuestion(newQuestion);

      // Close the modal and clear the input field
      hideModal('modal-question');
      document.getElementById('question-text').value = '';
    } else {
      console.error('Error adding question:', newQuestion.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Function to submit a new answer
function submitNewAnswer(questionId, answerText) {
  fetch(`/questions/${questionId}/answers/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answer: answerText })
  })
  .then(response => response.json())
  .then(updatedQuestion => {
    if (updatedQuestion && !updatedQuestion.error) {
      // Correctly identify and update the answers list for the question
      const answersList = document.getElementById(`answers-for-${questionId}`);
      answersList.appendChild(createElement('li', {}, answerText));

      // Close the modal and clear the input fields
      hideModal('modal-answer');
      document.getElementById('answer-text').value = '';
    } else {
      console.error('Error adding answer:', updatedQuestion.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}