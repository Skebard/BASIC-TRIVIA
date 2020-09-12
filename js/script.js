const BASE_URL = "https://opentdb.com/";
const DEF_NUM_QUE =10; //default number of questions for quiz

let token; // the token is used to avoid getting repeated questions
let categories;
let url = BASE_URL +"api_category.php";
console.log("\n hi\n");
let categoriesContainer = document.getElementById("categories-id");
let gameSettings = document.getElementById("game-settings-id");
updateToken();
displayLoading();
getAllCategories()
    .then((data)=>createCategoryBtns(data))
    .then(hideLoading);
//click

gameSettings.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(validateGameSettings) startGame();
});



//Function to get the id and name of the categories in an array
function getAllCategories(){
    let categoriesURL = BASE_URL+"api_category.php";
    return fetch(categoriesURL)
        .then(response=>response.json())
        .then((data)=>{
            return data.trivia_categories;
        });
}

function createCategoryBtns(data){
    let any = {id:"any",name:"All categories"};
    data.unshift(any);
    data.forEach((category)=>{
        let btn = document.createElement("button");
        btn.id = "category-"+category.id;
        let title = document.createElement("span");
        title.textContent = category.name;
        btn.appendChild(title);
        btn.classList.add("category-btn");
        btn.addEventListener("click",()=>{
            categoriesContainer.querySelector(".selected").classList.remove("selected");
            btn.classList.add("selected");
        });
        categoriesContainer.appendChild(btn);
    });
    categoriesContainer.children[0].classList.add("selected");
}


function startGame(id){
    gameSettings.classList.add("hide");
    categoriesContainer.classList.add("hide");
    displayLoading();
    let number = gameSettings.querySelector("input[type='number'").value;
    let categoryId = categoriesContainer.querySelector(".selected").id.slice(9);//slice to remove "category-" from the id
    let difficulty = gameSettings.querySelector("#difficulty-id > [selected]").textContent.toLowerCase();
    getQuestions(number,categoryId,difficulty,"multiple")
        .then((data)=>{
            hideLoading();
            displayQuestions(data);
        });
    //displayQuestions board
    //update used questions check token
}

function questionsDisplay(data){
    document.getElementById("answers-id");

    console.log("diplay");
}

function hideLoading(){
    document.getElementById("loading-animation").classList.add("hide");

}
function displayLoading(){
    document.getElementById("loading-animation").classList.remove("hide");
}
function updateToken(){
    let requestTokenUrl=BASE_URL+"api_token.php?command=request";
    fetch(requestTokenUrl)
        .then((response)=>response.json())
        .then((data)=>{
            token = "token="+data.token;
        });
}

/**
 * 
 * @param {int} number  number of requested questions
 * @param {int} categoryId each category has assigned and id
 * @param {string} difficulty "easy", "medium" or "difficult"
 * @param {string} type  "multiple" or "boolean"
 * @retuns {array}
 */
function getQuestions(number=DEF_NUM_QUE,categoryId="any",difficulty="any",type="any"){
    let selectedCategory = (categoryId==="any")? "":`category=${categoryId}`;
    let selectedDifficulty = (difficulty==="any")?"": `difficulty=${difficulty}`;
    let selectedType = (type==="any")?"":`type=${type}`;
    let requestURL = BASE_URL + `api.php?amount=${number}&${selectedCategory}&${selectedDifficulty}&${selectedType}&${token}`;
    console.log(requestURL);
    return fetch(requestURL)
    .then(response=>response.json())
    .then((data)=>{
        console.log(data.results);
        return data.results;
    });
}

function validateGameSettings(){
    let erroMessage = docuemnt.getElementById("error-message-id");
    let numQuestions = gameSettings.elements[0].value;
    if(numQuestions < 10 || numQuestions > 30){
        //print invalid number
        errorMessage.classList.remove("hide");
        return false;
    }
    errorMessage.classList.add("hide");
    return true;
}
