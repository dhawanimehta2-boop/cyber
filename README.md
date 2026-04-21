# 🛡️ CyberShield Academy

A cybersecurity learning platform designed for middle school students (Grades 8-10) with a **hacker aesthetic**, **dark mode**, and **interactive quiz engine**.

## 📋 Features

✅ **Grade-Based Learning Paths**
- **Grade 8**: Passwords & Phishing fundamentals
- **Grade 9**: Network Safety essentials
- **Grade 10**: Encryption & SQL Injection basics

✅ **Interactive Quiz Engine**
- Dynamic multiple-choice questions
- Real-time feedback with explanations
- Score tracking and ranking system

✅ **Hacker Aesthetic UI**
- Matrix/Terminal-inspired dark theme
- Glassmorphism effects for modern look
- Stealth toggle (light/dark mode)
- Smooth animations and transitions

✅ **Responsive Design**
- Mobile-friendly with Flexbox layout
- Optimized for tablets and desktop
- Touch-friendly interface

✅ **Scoreboard & Achievements**
- Track "Cyber Expert" completions
- LocalStorage-based persistence
- Rank progression system

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Flask 2.3.0

### Installation

1. **Clone/Navigate to the project directory**
   ```bash
   cd CyberShield-Academy
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask application**
   ```bash
   python app.py
   ```

4. **Open in browser**
   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
CyberShield-Academy/
├── app.py                 # Flask backend with quiz logic
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # HTML dashboard & quiz interface
└── static/
    ├── style.css         # Hacker theme & responsive design
    └── script.js         # Frontend interactions
```

## 🎮 How to Use

1. **Select Your Grade** - Choose Grade 8, 9, or 10
2. **Answer Questions** - Complete all multiple-choice questions
3. **Submit & Review** - Get your score and detailed explanations
4. **Track Progress** - Achieve "Cyber Expert" status for 100% scores

## 🎨 Customization

### Add More Questions
Edit the `QUIZ_DATA` dictionary in `app.py`:
```python
"question_number": {
    "question": "Your question here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct": 0,  # Index of correct option
    "explanation": "Why this is correct..."
}
```

### Change Theme Colors
Modify CSS variables in `static/style.css`:
```css
:root {
    --primary-color: #00ff88;      /* Green */
    --secondary-color: #00d9ff;    /* Cyan */
    --danger-color: #ff0055;       /* Pink */
    /* ... more colors ... */
}
```

## 🔐 Scoring & Ranking

| Score Range | Rank | Badge |
|-------------|------|-------|
| 100% | 🔐 Cyber Expert | Expert hacker status |
| 70-99% | 🛡️ Security Scholar | Advanced knowledge |
| 50-69% | 👾 Code Warrior | Intermediate skills |
| <50% | Novice Hacker | Keep learning! |

## 📊 Backend API Endpoints

- **GET `/`** - Serve main dashboard
- **GET `/api/quiz/<grade>`** - Fetch quiz questions for grade (8, 9, or 10)
- **POST `/api/submit-quiz`** - Submit answers and get results

### Example Request
```bash
POST /api/submit-quiz
{
  "grade": "8",
  "answers": {
    "1": 2,
    "2": 1,
    "3": 1
  }
}
```

## 🖥️ Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Android)

## 📝 License

Educational use only. Designed for cybersecurity awareness.

## 🤝 Contributing

To add more questions or features:
1. Edit `QUIZ_DATA` in `app.py`
2. Update CSS variables for theming
3. Test on multiple devices

## 🎓 Learning Outcomes

Students will learn:
- Password security best practices
- How to identify phishing attempts
- Network safety principles
- Basic encryption concepts
- SQL injection fundamentals

---

**Happy Learning! Stay Cyber Safe! 🛡️**
