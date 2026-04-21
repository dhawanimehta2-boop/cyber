// CyberShield Academy - Frontend Script
// Handles UI interactions and API communication

let currentGrade = null;
let currentAnswers = {};
let stealthMode = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Stealth toggle
    const stealthToggle = document.getElementById('stealthToggle');
    stealthToggle.addEventListener('click', toggleStealthMode);
    
    // Load scoreboard from localStorage
    loadScoreboard();
});

// Toggle Stealth Mode (Light/Dark)
function toggleStealthMode() {
    stealthMode = !stealthMode;
    const body = document.body;
    const toggle = document.getElementById('stealthToggle');
    
    if (stealthMode) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        toggle.textContent = '☀️ Normal Mode';
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        toggle.textContent = '🌙 Stealth Mode';
    }
    
    localStorage.setItem('stealthMode', stealthMode);
}

// Select Grade and Load Quiz
function selectGrade(grade) {
    currentGrade = grade;
    currentAnswers = {};
    
    // Hide dashboard, show quiz section
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('scoreboardSection').style.display = 'none';
    document.getElementById('quizSection').style.display = 'block';
    
    // Fetch quiz data
    fetch(`/api/quiz/${grade}`)
        .then(response => response.json())
        .then(data => {
            displayQuiz(data);
        })
        .catch(error => {
            console.error('Error loading quiz:', error);
            alert('Failed to load quiz. Please try again.');
        });
}

// Display Quiz Questions
function displayQuiz(data) {
    const quizTitle = document.getElementById('quizTitle');
    const quizContent = document.getElementById('quizContent');
    const submitBtn = document.getElementById('submitBtn');
    
    quizTitle.textContent = data.title;
    quizContent.innerHTML = '';
    
    data.questions.forEach((question, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        
        let optionsHTML = '';
        question.options.forEach((option, optionIndex) => {
            const optionId = `option-${question.id}-${optionIndex}`;
            optionsHTML += `
                <label class="option">
                    <input type="radio" name="question-${question.id}" value="${optionIndex}" 
                           onchange="selectAnswer(${question.id}, ${optionIndex})">
                    <span>${option}</span>
                </label>
            `;
        });
        
        questionCard.innerHTML = `
            <div class="question-number">Question ${index + 1} of ${data.questions.length}</div>
            <div class="question-text">${question.question}</div>
            <div class="options">${optionsHTML}</div>
        `;
        
        quizContent.appendChild(questionCard);
    });
    
    // Update progress
    updateProgress(data.questions.length);
    
    // Show submit button
    submitBtn.style.display = 'block';
}

// Handle Answer Selection
function selectAnswer(questionId, optionIndex) {
    currentAnswers[questionId] = optionIndex;
    
    // Visual feedback
    const radio = document.querySelector(`input[name="question-${questionId}"][value="${optionIndex}"]`);
    if (radio) {
        radio.parentElement.classList.add('selected');
    }
}

// Update Progress Display
function updateProgress(total) {
    const answered = Object.keys(currentAnswers).length;
    const progress = document.getElementById('progress');
    progress.textContent = `${answered}/${total} answered`;
}

// Submit Quiz
function submitQuiz() {
    // Count answered questions
    const questionCards = document.querySelectorAll('.question-card');
    const totalQuestions = questionCards.length;
    const answeredQuestions = Object.keys(currentAnswers).length;
    
    if (answeredQuestions < totalQuestions) {
        alert(`Please answer all questions. You've answered ${answeredQuestions}/${totalQuestions}.`);
        return;
    }
    
    // Send answers to backend
    fetch('/api/submit-quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grade: currentGrade,
            answers: currentAnswers
        })
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data);
        // Save to scoreboard
        saveScore(data);
    })
    .catch(error => {
        console.error('Error submitting quiz:', error);
        alert('Error submitting quiz. Please try again.');
    });
}

// Display Results
function displayResults(data) {
    document.getElementById('quizSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    // Update rank badge
    const rankBadge = document.getElementById('rankBadge');
    rankBadge.textContent = data.rank;
    
    // Update score display
    document.getElementById('scorePercentage').textContent = data.percentage + '%';
    document.getElementById('scoreValue').textContent = data.score;
    document.getElementById('totalValue').textContent = data.total;
    
    // Display results
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    
    data.results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = result.is_correct ? 'result-item' : 'result-item incorrect';
        
        resultItem.innerHTML = `
            <div class="result-question">${result.is_correct ? '✓' : '✗'} ${result.question}</div>
            <div class="result-answer">
                Your answer: <span class="${result.is_correct ? 'result-correct' : 'result-incorrect'}">
                    ${result.user_answer}
                </span>
            </div>
            ${!result.is_correct ? `
                <div class="result-answer">
                    Correct answer: <span class="result-correct">${result.correct_answer}</span>
                </div>
            ` : ''}
            <div class="result-explanation">💡 ${result.explanation}</div>
        `;
        
        resultsList.appendChild(resultItem);
    });
}

// Save Score to Scoreboard
function saveScore(data) {
    let scoreboard = JSON.parse(localStorage.getItem('cybershield-scoreboard')) || [];
    
    // Check if this is a Cyber Expert
    if (data.rank === '🔐 Cyber Expert') {
        const gradeNames = {
            '8': 'Grade 8 (Passwords & Phishing)',
            '9': 'Grade 9 (Network Safety)',
            '10': 'Grade 10 (Encryption & SQLi)'
        };
        
        scoreboard.push({
            grade: gradeNames[currentGrade],
            rank: data.rank,
            score: data.score,
            total: data.total,
            percentage: data.percentage,
            date: new Date().toLocaleDateString()
        });
        
        localStorage.setItem('cybershield-scoreboard', JSON.stringify(scoreboard));
    }
}

// View Scoreboard
function viewScoreboard() {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('scoreboardSection').style.display = 'block';
    
    loadScoreboard();
}

// Load and Display Scoreboard
function loadScoreboard() {
    const scoreboardContent = document.getElementById('scoreboardContent');
    const scoreboard = JSON.parse(localStorage.getItem('cybershield-scoreboard')) || [];
    
    if (scoreboardContent) {
        if (scoreboard.length === 0) {
            scoreboardContent.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No Cyber Experts yet. Complete all quizzes with 100% to claim your spot! 🎯</p>';
            return;
        }
        
        scoreboardContent.innerHTML = '';
        scoreboard.forEach((entry, index) => {
            const entry_div = document.createElement('div');
            entry_div.className = 'scoreboard-entry expert';
            
            entry_div.innerHTML = `
                <div>
                    <div class="scoreboard-name">🏆 #${index + 1} | ${entry.grade}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Completed: ${entry.date}</div>
                </div>
                <div class="scoreboard-rank">${entry.rank}</div>
            `;
            
            scoreboardContent.appendChild(entry_div);
        });
    }
}

// Back to Dashboard
function backToDashboard() {
    currentGrade = null;
    currentAnswers = {};
    
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('quizSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('scoreboardSection').style.display = 'none';
}

// Load saved theme preference
window.addEventListener('load', function() {
    const savedStealthMode = localStorage.getItem('stealthMode') === 'true';
    if (savedStealthMode) {
        document.getElementById('stealthToggle').click();
    }
});
