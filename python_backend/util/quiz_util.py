PROMPT_USER = """
Create a multiple-choice quiz for me regarding the CONTENT below.
The NUMBER of questions will be specified below. Each question you generate should have 2-4 possible answers.
You should provide your questions and answers in the following format:

Question: Some question about the content?
Answers: [answer1, answer2, answer3]
Correct: answer2

NUMBER: {NUMBER}
CONTENT: {CONTENT}
"""

def prepare_message(NUMBER, CONTENT):
    return PROMPT_USER.format(**{"NUMBER":NUMBER,"CONTENT":CONTENT})

def prepare_messages(NUMBER, CONTENT):
    return [
        {'role': 'system', 'content': 'Your are an assistant who creates quizzes.'},
        {'role': 'user', 'content': prepare_message(NUMBER, CONTENT)}
    ]
    
class Question:
    def __init__(self):
        self.question = None
        self.answers = None
        self.correct = None
        self.correct_i = None
        self.complete = False
    def add(self, k, v):
        k = k.replace(':','').lower()
        print(k)
        print(v)
        setattr(self, k, v)
        self.check()
    def check(self):
        if (self.question is not None) and (self.answers is not None) and (self.correct is not None):
            for i,answer in enumerate(self.answers):
                if self.correct.lower()==answer.lower():
                    self.correct_i = i
                    self.complete = True
                    print("COMPLTE")
    def is_complete(self):
        return self.complete
    def get_items(self):
        return {
            "question": self.question,"answers": self.answers, "i":self.correct_i
        }

class ResponseParser:
    @staticmethod
    def parse_from_text(text):
        lines = text.splitlines()
        ordered_items = ['Question:','Answers:','Correct:']
        o_i = 0
        questions = []
        question = Question()
        for line in lines:
            if line.startswith(ordered_items[o_i]):
                linetype = ordered_items[o_i]
                question.add(linetype, ResponseParser.parse_type(linetype, line))
                question.check()
                o_i +=1
                if o_i >= len(ordered_items):
                    if question.is_complete():
                        questions.append(question)
                    question = Question()
                    o_i = 0
 
        return [question.get_items() for question in questions]

    @staticmethod
    def parse_type(linetype, line):
        line = line.replace(linetype,'')
        if linetype in ['Question:', 'Correct:']:
            return line.strip()
        if linetype == 'Answers:':
            line = line.strip()
            if line[0]=='[':
                line = line[1:]
            if line[-1]==']':
                line = line[:-1]
            return [word.strip() for word in line.split(',')]
                