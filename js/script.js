const BASE_URL = "https://opentdb.com/";
const DEF_NUM_QUE =10; //default number of questions for quiz

let token; // the token is used to avoid getting repeated questions
let categories;
let url = BASE_URL +"api_category.php";
console.log("\n hi\n");
let categoriesContainer = document.getElementById("categories-id");


updateToken();

getAllCategories()
    .then((data)=>createCategoryBtns(data))
    .then(hideLoading);
//click
//loading
//getQuestions
//hide loading
//update used questions (maybe update token)
//start game

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
    data.forEach((category)=>{
        let btn = document.createElement("button");
        btn.id = "category-"+category.id;
        btn.textContent = category.name;
        btn.classList.add("category-btn");
        categoriesContainer.appendChild(btn);
    });
    data.forEach(e=>console.log(e));
}
function hideLoading(){}
function updateToken(){
    let requestTokenUrl=BASE_URL+"api_token.php?command=request";
    fetch(requestTokenUrl)
        .then((response)=>response.json())
        .then((data)=>{
            token = data.token;
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
    let selectedCategory = (categoryId==="any")? "":`category=${category}`;
    let selectedDifficulty = (difficulty==="any")?"": `difficulty=${difficulty}`;
    let selectedType = (type==="any")?"":`type=${type}`;
    let requestURL = BASE_URL + `api.php?amount=${number}&${selectedCategory}&${selectedDifficulty}&${selectedType}&${token}`;
    return fetch(requestURL)
    .then(response=>response.json())
    .then((data)=>{
        console.log(data.results);
        return data.results;
    });
}
function getNumQuestions(){

}
function printQuestion(){

}
