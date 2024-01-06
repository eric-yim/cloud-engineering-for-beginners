function generateQuiz(event) {
    const ENDPOINT = 'https://v12tnnnyee.execute-api.us-west-1.amazonaws.com/prod/chatGptWrapper';
    // Prevent the default form submission
    event.preventDefault();

    // Get the selected number of questions and content from the form
    var selectedNumber = document.getElementById("selectNumber").value;
    var content = document.getElementById("inputContent").value;
    // Perform any additional logic or actions here (e.g., generate quiz based on the input)

    var quizData = {
        number: selectedNumber,
        content: content
    };
    var quizElement = document.getElementById("generatedQuiz");
    fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
      })
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        quizElement.innerHTML = data.innerHTML;
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function submitQuiz(event) {
  event.preventDefault(); // Prevent the form from submitting and refreshing the page

  // Reset previous highlights
  resetHighlights();

  // Check each question
  const selectedOptions = document.querySelectorAll('.form-check-input');
  let totalAnswersCount = 0;
  selectedOptions.forEach(function (selectedOption) {
      const value = parseInt(selectedOption.value);

      // Highlight correct answers with value=1
      if (value === 1) {
          selectedOption.parentNode.classList.add("correct-answer");
          totalAnswersCount++;
      }
  });


  const questions = document.querySelectorAll('.form-group');

  let correctAnswersCount = 0;

  questions.forEach(function (question) {
    const selectedOption = question.querySelector('.form-check-input:checked');

    if (selectedOption) {
      const value = parseInt(selectedOption.value);

                  // Highlight correct answers with value=1
      if (value === 1) {
        correctAnswersCount++;
      }
    }
  });
  // Update the number of correct answers in the results span
  const resultsSpan = document.getElementById('results-span');
  resultsSpan.textContent = `Correct answers: ${correctAnswersCount} of ${totalAnswersCount}`;

}

function resetHighlights() {
  const highlightedAnswers = document.querySelectorAll(".correct-answer");

  highlightedAnswers.forEach(function (element) {
      element.classList.remove("correct-answer");
  });
}

