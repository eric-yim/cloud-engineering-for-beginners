MAIN_FORM = """
    <form class="form">
      <h1 class="h3 mb-3 font-weight-normal">Answer these, Human!</h1>
      
      {quiz_items}

      <button class="btn btn-lg btn-primary btn-block" type="submit" onclick="submitQuiz(event)">Check</button>
    </form>
    <div id="quiz-results" class="hidden">
        <h2 class="h3 mb-3 font-weight-normal">Results</h2>
        <span id="results-span">---</span>
    </div>
"""

QUIZ_ITEM = """
        <div class="form-group">
            <label id="{question_id}">{question}</label>
            {answer_items}
        </div>
"""
ANSWER_ITEM = """
            <div class="form-check">
                  <input type="radio" id="{answer_id}" name="{question_id}" class="form-check-input" value="{val}" required>
                  <label class="form-check-label" for="{answer_id}">{answer}</label>
            </div>
"""

class HtmlConstructor:
    @staticmethod
    def construct_quiz(questions):
        quiz_items = ""
        for question_i, question in enumerate(questions):
            answer_items = ""
            answer_i = question['i']
            question_id = f"q{question_i}"
            for i, answer in enumerate(question['answers']):
                answer_id = f"{question_id}A{i}"
                val = '1' if i == answer_i else '0' 
                answer_items += ANSWER_ITEM.format(**{'val': val, 'answer': answer, 'answer_id':answer_id,'question_id':question_id})
            idx = f'question{question_i}'
            quiz_items += QUIZ_ITEM.format(**{
                'question_id':question_id, 
                'question':question['question'],
                'answer_items':answer_items })
        
        return MAIN_FORM.format(**{'quiz_items':quiz_items})
        