// Elements
const mainForm = document.getElementById("triviaForm");
const settingsContainer = document.getElementById("settings-container");
const questionContainer = document.getElementById("question-container");
const scoreContainer = document.getElementById("score-container");
const bestScoresContainer =  document.getElementById("best-scores");
const loader = document.getElementsByClassName("#lds-default");

// Global Variables
let questions = [];
let totalQuestions = 0;
let questionCounter = 0;
let score = 0;

// Build the URL 
const createApiUrl = e => {
    e.preventDefault();
    showLoader();
    settingsContainer.classList.add("hide");
    questionContainer.classList.remove("hide");
    let amount = document.getElementById("amount").value;
    totalQuestions = amount;
    let category = document.getElementById("category").value;
    let difficulty = document.getElementById("difficulty").value;
    let type = document.getElementById("type").value;
    const URL_API = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${category}&type=${type}`;
    fetchDataAPI(URL_API);
};

// Fetching the Data
const fetchDataAPI = url => {
    fetch(url)
    .then(response => response.json())
    .then(result => fillQuestions(result.results))
    .catch(error => console.log(error));
};

// Saved Data on Global variable
const fillQuestions = questionsAPI => {
    questions = questionsAPI;
    showQuestion()
};

// Show Boolean or Multiple Choices Questions
const showQuestion = () => {
    console.log(questions);
    if (questionCounter >= totalQuestions) {
        console.log("Game Over");
        questionCounter = 0;
        showScore();
        score = 0;
    }else {
        questions[questionCounter].type === 'boolean'? 
            booleanQuestion(questions[questionCounter]) : 
            multipleQuestion(questions[questionCounter]);
    };       
};

// Multiple Choice Question Component
const multipleQuestion = (question) => {
    const allAnswers = shuffleArray([question.correct_answer, ...question.incorrect_answers]);
    console.log(allAnswers);

    questionContainer.innerHTML = `
    <h2 class="answer" id="answer">${question.question}?</h2>
    <ul>
        <li><button class="btn btn-answer" onclick="handleAnswer(this)">${allAnswers[0]}</button></li>
        <li><button class="btn btn-answer" onclick="handleAnswer(this)">${allAnswers[1]}</button></li>
        <li><button class="btn btn-answer" onclick="handleAnswer(this)">${allAnswers[2]}</button></li>
        <li><button class="btn btn-answer" onclick="handleAnswer(this)">${allAnswers[3]}</button></li>
    </ul>
    <div class="question-score-container" id="score">
            <h4>Question: ${questionCounter+1} of ${totalQuestions}</h4>
            <h4>Score: ${score}</h4>
    </div>
    `;
};

// Boolean Question Component
const booleanQuestion = (question) => {
    questionContainer.innerHTML = `
    <h2 class="answer" id="answer">${question.question}?</h2>
    <ul>
        <li><button class="btn btn-answer" onclick="handleAnswer(this)">True</button></li>
        <li><button class="btn btn-answer" onclick="handleAnswer(this)">False</button></li>
    </ul>
    <div class="question-score-container" id="score">
            <h4>Question: ${questionCounter+1} of ${totalQuestions}</h4>
            <h4>Score: ${score}</h4>
    </div>
    `;
};

// Loader Component
const showLoader = () => {
    questionContainer.innerHTML = `
        <div class="lds-default">
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
    `;
};

// Final Score Component
const showScore = () => {
    questionContainer.classList.add("hide");
    scoreContainer.classList.remove("hide");
    scoreContainer.innerHTML = `
        <h2>Your Score is:</h2>    
        <h2 class="final-score">${score}</h2>
        <input type="text" class="name-input" id="name" placeholder="Enter Your Name to Save Your Score"></input>
        <button class="btn btn-answer" onclick="saveScore(${score})")>SAVE SCORE <i class="fas fa-save"></i></button>
        <button class="btn btn-answer" onclick="startAgain()")>GO HOME <i class="fas fa-home"></i></button>
    `;
};

// Show Top Five Best Scores Saved On LocalStorage
const bestScores = () => {
    bestScoresContainer.classList.remove("hide");
    let allScores = [];
    if (localStorage.getItem("historyScores")){
        allScores =  JSON.parse(localStorage.getItem("historyScores"));
        let topFive = allScores.sort(compare).slice(0,5);
        let emptyItem = {name: "[Empty]", score:[0]};
        if (topFive.length === 1) {
            topFive.push(emptyItem);
            topFive.push(emptyItem);
            topFive.push(emptyItem);
            topFive.push(emptyItem);
        }

        if (topFive.length === 2) {
            topFive.push(emptyItem);
            topFive.push(emptyItem);
            topFive.push(emptyItem);
        }

        if (topFive.length === 3) {
            topFive.push(emptyItem);
            topFive.push(emptyItem);
        }

        if (topFive.length === 4) {
            topFive.push(emptyItem);
        }

        settingsContainer.classList.add("hide");
        bestScoresContainer.innerHTML = `
        <h2 class="final-score">TOP FIVE HIGH SCORES</h2>
        <ul>
            <li><h4>1.- ${topFive[0].name} ..... ${topFive[0].score}</h4></li>
            <li><h4>2.- ${topFive[1].name} ..... ${topFive[1].score}</h4></li>
            <li><h4>3.- ${topFive[2].name} ..... ${topFive[2].score}</h4></li>
            <li><h4>4.- ${topFive[3].name} ..... ${topFive[3].score}</h4></li>
            <li><h4>5.- ${topFive[4].name} ..... ${topFive[4].score}</h4></li>
        </ul>
        <button class="btn btn-answer" onclick="startAgain()")>GO HOME <i class="fas fa-home"></i></button>
        `;
    }else {
        settingsContainer.classList.add("hide");
        bestScoresContainer.innerHTML = `
        <h2 class="final-score">NO RECORDS</h2>
        <button class="btn btn-answer" onclick="startAgain()")>GO HOME <i class="fas fa-home"></i></button>
        `;
    }

    
};

// Save Scores in the Local Storage
const saveScore = (globalScore) => {
    console.log(globalScore);
    let allScores = [];
    let currentScore = {
        name: document.getElementById("name").value,
        score: globalScore
    };
    if (localStorage.getItem("historyScores")){
        allScores =  JSON.parse(localStorage.getItem("historyScores"));
        console.log(allScores)
        allScores.push(currentScore);
        localStorage.setItem("historyScores", JSON.stringify(allScores));
    }else {
        allScores.push(currentScore);
        localStorage.setItem("historyScores", JSON.stringify(allScores));
    }

    scoreContainer.innerHTML = `<h2 class="final-score">Saved!</h2>`;
    setTimeout(() => {
        startAgain();
    }, 1500)
};

const handleAnswer = (button) => {
    if (button.innerText === questions[questionCounter].correct_answer){
        button.classList.add("correct");
        handleCorrectAnswer();
    } else {
        button.classList.add("incorrect");
        console.log("Incorrecto");
    }
    setTimeout(() => {
        questionCounter += 1;
        showQuestion();
    },1000)
};

const handleCorrectAnswer = () => {
    if (questions[questionCounter].difficulty === "easy") {
        score += 50;
    } else {
        questions[questionCounter].difficulty === "medium" ? score += 75 : score += 100;
    }
    console.log(score);
};

// Start Again Function
const startAgain = () => {
    scoreContainer.classList.add("hide");
    bestScoresContainer.classList.add("hide")
    settingsContainer.classList.remove("hide");
    mainForm.reset();
}

// Shuffle the answers of the Multiple Choices Questions
const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
};

// Compare Function for Sort Object
function compare (a, b) {
    const bandA = a.score;
    const bandB = b.score;

    let comparison = 0;
    if (bandA > bandB) {
        comparison = -1;
    } else if (bandA < bandB) {
        comparison = 1;
    }
    return comparison;
};

mainForm.onsubmit = createApiUrl;