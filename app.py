from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# Quiz Questions Database
QUIZ_DATA = {
    "8": {
        "title": "Grade 8: Passwords & Phishing",
        "questions": [
            {
                "id": 1,
                "question": "What is the WEAKEST password?",
                "options": ["password123", "X#9@mK$2L", "qwerty", "P@ssw0rd!2024"],
                "correct": 2,
                "explanation": "'qwerty' is the weakest—it's a common keyboard pattern. Always use a mix of uppercase, lowercase, numbers, and symbols."
            },
            {
                "id": 2,
                "question": "You receive an email asking to 'verify your PayPal account urgently'. What should you do?",
                "options": ["Click the link immediately", "Check PayPal.com directly (don't use email link)", "Reply with your account info", "Forward to friends"],
                "correct": 1,
                "explanation": "Never click links in unexpected emails. Go directly to the official website by typing the URL yourself. This is a phishing tactic."
            },
            {
                "id": 3,
                "question": "A strong password should contain:",
                "options": ["Only letters", "Uppercase, lowercase, numbers, and symbols", "Your name or birthday", "At least 200 characters"],
                "correct": 1,
                "explanation": "A strong password combines uppercase, lowercase, numbers, and special characters—8+ characters is ideal for most accounts."
            }
        ]
    },
    "9": {
        "title": "Grade 9: Network Safety",
        "questions": [
            {
                "id": 1,
                "question": "What is a VPN primarily used for?",
                "options": ["Download files faster", "Encrypt your internet connection and hide IP address", "Protect against viruses", "Increase device storage"],
                "correct": 1,
                "explanation": "A VPN (Virtual Private Network) encrypts your data and masks your IP, making your internet activity more private and secure on public Wi-Fi."
            },
            {
                "id": 2,
                "question": "When using public Wi-Fi, what should you AVOID?",
                "options": ["Browsing social media", "Online banking and password entry", "Watching videos", "Checking weather"],
                "correct": 1,
                "explanation": "Public Wi-Fi is unsecured. Avoid sensitive transactions. Use a VPN if you must access sensitive information on public networks."
            },
            {
                "id": 3,
                "question": "What does HTTPS indicate?",
                "options": ["Faster internet speed", "A secure, encrypted connection", "The website is free", "More storage available"],
                "correct": 1,
                "explanation": "HTTPS (with the padlock icon) means the connection is encrypted. Always look for it before entering personal or financial info."
            }
        ]
    },
    "10": {
        "title": "Grade 10: Encryption & SQL Injection Basics",
        "questions": [
            {
                "id": 1,
                "question": "What does encryption do?",
                "options": ["Deletes data", "Scrambles data so only authorized users can read it", "Speeds up data transfer", "Makes files smaller"],
                "correct": 1,
                "explanation": "Encryption converts readable data into coded form using mathematical algorithms. Only those with the key can decrypt it."
            },
            {
                "id": 2,
                "question": "What is SQL Injection?",
                "options": ["A fast internet connection", "Attackers insert malicious code into database queries", "A type of vaccine", "A software update"],
                "correct": 1,
                "explanation": "SQL Injection occurs when attackers insert malicious SQL code into input fields to access, modify, or delete database data. Always validate user input!"
            },
            {
                "id": 3,
                "question": "To prevent SQL Injection, developers should:",
                "options": ["Allow any user input", "Use parameterized queries and input validation", "Ignore security warnings", "Store passwords in plain text"],
                "correct": 1,
                "explanation": "Parameterized queries and proper input validation prevent attackers from injecting malicious code. Input validation is critical!"
            }
        ]
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/quiz/<grade>', methods=['GET'])
def get_quiz(grade):
    """Fetch quiz for selected grade"""
    if grade not in QUIZ_DATA:
        return jsonify({"error": "Invalid grade"}), 400
    
    quiz = QUIZ_DATA[grade]
    # Don't send correct answers to frontend
    questions = [
        {
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        }
        for q in quiz["questions"]
    ]
    return jsonify({"title": quiz["title"], "questions": questions})

@app.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():
    """Process quiz submission and calculate score"""
    data = request.json
    grade = data.get('grade')
    answers = data.get('answers')  # Dict of {question_id: selected_option_index}
    
    if grade not in QUIZ_DATA:
        return jsonify({"error": "Invalid grade"}), 400
    
    quiz = QUIZ_DATA[grade]
    score = 0
    total = len(quiz["questions"])
    results = []
    
    for question in quiz["questions"]:
        q_id = question["id"]
        user_answer = answers.get(str(q_id))
        correct_answer = question["correct"]
        
        is_correct = user_answer == correct_answer
        if is_correct:
            score += 1
        
        results.append({
            "question_id": q_id,
            "question": question["question"],
            "user_answer": question["options"][user_answer] if user_answer is not None else None,
            "correct_answer": question["options"][correct_answer],
            "is_correct": is_correct,
            "explanation": question["explanation"]
        })
    
    # Rank logic
    rank = "Novice Hacker"
    if score == total:
        rank = "🔐 Cyber Expert"
    elif score >= total * 0.7:
        rank = "🛡️ Security Scholar"
    elif score >= total * 0.5:
        rank = "👾 Code Warrior"
    
    return jsonify({
        "score": score,
        "total": total,
        "percentage": round((score / total) * 100, 1),
        "rank": rank,
        "results": results
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
