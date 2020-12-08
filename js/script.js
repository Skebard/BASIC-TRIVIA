const BASE_URL = "https://opentdb.com/";
const DEF_NUM_QUE = 10; //default number of questions for quiz
const SHOW_ANSWER_TIME = 1000; //milliseconds after choosing an answer

let token; // the token is used to avoid getting repeated questions
let categories;
let url = BASE_URL + "api_category.php";
let categoriesContainer = document.getElementById("categories-id");
let gameSettings = document.getElementById("game-settings-id");
let gameBoard = document.querySelector(".game-board");
let gameMenu = document.getElementById("game-menu-id");
let answersHTML = Array.from(document.getElementById("answers-id").children);
let questionHTML = document.getElementById("question-id");
let endGameHTML = document.getElementById("end-game-screen-id");
let mainMenuBtn = document.getElementById("main-menu-btn-id");
updateToken();
displayLoading();
getAllCategories()
    .then((data) => createCategoryBtns(data))
    .then(hideLoading)
    .then(() => {
        gameSettings.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validateGameSettings){
                let number = parseInt(gameSettings.elements.number.value);
                let category = categoriesContainer.querySelector(".selected").id.slice(9);
                let difficulty = gameSettings.elements.difficulty.value.toLowerCase();
                let newGame = new Game(number,category,difficulty);
                newGame.startGame();
            }
        });
    });
    mainMenuBtn.addEventListener("click",()=>{
        endGameHTML.classList.add("hide");
        gameMenu.classList.remove("hide");
    });
//click






//Function to get the id and name of the categories in an array
function getAllCategories() {
    let categoriesURL = BASE_URL + "api_category.php";
    return fetch(categoriesURL)
        .then(response => response.json())
        .then((data) => {
            return data.trivia_categories;
        });
}

function createCategoryBtns(data) {
    let any = {
        id: "any",
        name: "All categories"
    };
    data.unshift(any);
    data.forEach((category) => {
        let btn = document.createElement("button");
        btn.id = "category-" + category.id;
        let title = document.createElement("span");
        title.textContent = category.name;
        btn.appendChild(title);
        btn.classList.add("category-btn");
        btn.addEventListener("click", () => {
            categoriesContainer.querySelector(".selected").classList.remove("selected");
            btn.classList.add("selected");
        });
        categoriesContainer.appendChild(btn);
    });
    categoriesContainer.children[0].classList.add("selected");
}





// max exclusive
function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

function hideLoading() {
    document.getElementById("loading-animation").classList.add("hide");
}

function displayLoading() {
    document.getElementById("loading-animation").classList.remove("hide");
}

function updateToken() {
    let requestTokenUrl = BASE_URL + "api_token.php?command=request";
    fetch(requestTokenUrl)
        .then((response) => response.json())
        .then((data) => {
            token = "token=" + data.token;
        });
}


function validateGameSettings() {
    let errorMessage = docuemnt.getElementById("error-message-id");
    let numQuestions = gameSettings.elements[0].value;
    if (numQuestions < 10 || numQuestions > 30) {
        //print invalid number
        errorMessage.classList.remove("hide");
        return false;
    }
    errorMessage.classList.add("hide");
    return true;
}




function Game(quantity, category, difficulty, user = false) {
    let parser = new DOMParser();
    let questions;
    let currentQuestion = 0;
    let rightAnsPosition;
    let correctAnswers = 0;

    function getQuestions(number = DEF_NUM_QUE, categoryId = "any", difficulty = "any", type = "multiple") {
        let selectedCategory = (categoryId === "any") ? "" : `category=${categoryId}`;
        let selectedDifficulty = (difficulty === "any") ? "" : `difficulty=${difficulty}`;
        let selectedType = `type=${type}`;
        let requestURL = BASE_URL + `api.php?amount=${number}&${selectedCategory}&${selectedDifficulty}&${selectedType}&${token}`;
        return fetch(requestURL)
            .then(response => response.json())
            .then((data) => {
                return data.results;
            });
    }

    function displayQuestions(data) {
        gameBoard.classList.remove("hide");
        printAnswers(0);
        printQuestion(0);

        answersHTML.forEach((ans) => {
            ans.addEventListener("click", answersEvent);
        });
    }

    function nextQuestion() {
        printAnswers(currentQuestion);
        printQuestion(currentQuestion);
    }

    function printAnswers(position) {
        rightAnsPosition = randomInt(0, 4);
        let incorrectAns = 0;
        answersHTML.forEach((ans, index) => {
            if (index === rightAnsPosition) {
                ans.textContent = questions[position].correct_answer;
            } else {
                ans.textContent = questions[position].incorrect_answers[incorrectAns];
                incorrectAns++;
            }
            ans.classList = "";
        });
    }

    function printQuestion(position) {
        let text = convertToText(questions[position].question);
        questionHTML.innerHTML = text;
    }


    function answersEvent(e) {
        showAnswers(e.currentTarget);
        currentQuestion++;
        if (currentQuestion === quantity) { //-1 cause the array index starts by 0
            setTimeout(endGame,SHOW_ANSWER_TIME);
            return true;
        }
        
        setTimeout(nextQuestion, SHOW_ANSWER_TIME);
    }

    function showAnswers(clickedAnswer) {
        if (parseInt(clickedAnswer.dataset.pos) === rightAnsPosition) {
            clickedAnswer.classList.add("correct");
            correctAnswers++;
            return true;
        }
        answersHTML.forEach((ans, index) => {
            if (index === rightAnsPosition) {
                ans.classList.add("correct");
            } else {
                ans.classList.add("incorrect");
            }
        });

    }

    function removeEvents() {
        answersHTML.forEach((ans) => {
            ans.removeEventListener("click", answersEvent);
        });
    }

    this.startGame = async function () {
        gameMenu.classList.add("hide");
        displayLoading();
        questions = await getQuestions(quantity, category, difficulty, "multiple");
        hideLoading();
        displayQuestions();
    }


     function endGame() {
        removeEvents();
        gameBoard.classList.add("hide");
        endGameHTML.classList.remove("hide");
        endGameHTML.querySelector("#points-id").textContent = correctAnswers;
        correctAnswers=0;
        currentQuestion=0;
        updateToken();
    }
    this.showValues = function(){
    }
    this.disQuestions = function () {
    }
    this.quest = displayQuestions;
    this.remov = removeEvents;


}

function convertToText(text){
    let tempoDom = document.createElement("div");
    tempoDom.innerHTML = text;
    return tempoDom.textContent;
}