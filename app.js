const toggleSpinner = () => {
    const spinner = document.getElementById("spinner");
    spinner.classList.toggle("toggle");
}
// to get data from server
const getServerdata = async api => {
    const response = await fetch(api);
    const data = await response.json();
    return data;
}

//to display all ingredient into a list
const displayIngredients = detailsInfo => {
    //to get property value of properties `strIngredient1 to 20` and `strMeasure1 to 20`
    for (let i = 1; i <= 20; i++) {
        const ingredient = `strIngredient${i}`;
        const ingredientMeasure = `strMeasure${i}`;
        //"if" used to ignore null or empty("") value  
        if(detailsInfo[ingredient]){
            const listItem = document.createElement("li");
            listItem.innerHTML = `<img src="images/check-box.svg"> <p>${detailsInfo[ingredientMeasure]} ${detailsInfo[ingredient]}</p>`;
            document.getElementById("ingredients-list").appendChild(listItem);
        }
    }
}

//to display full details of a meal
const displayMealDetails = mealId => {
    const api = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const detailsSection = document.getElementById("details-area");

    getServerdata(api)
    .then(data => {
        const detailsInfo = data.meals[0];
        const info = `
            <div>
                <img src="${detailsInfo.strMealThumb}">
                <h1>${detailsInfo.strMeal}</h1>
                <h4>Ingredients</h4>
                <ul id="ingredients-list"></ul>
            </div>
        `;
        detailsSection.innerHTML = info;
        displayIngredients(detailsInfo);
        toggleSpinner();
    })
    .catch(error => {
        document.getElementById("error-message").innerText = "Fail to load data from Server";
        document.getElementById("error-message").style.display = "block";
        toggleSpinner();
    });
}

const displayIndividualMealName = data => {
    const resultSection = document.getElementById("search-results-area");
    //Server gives the array of multiple meal info of maximum keyword matching meal name
    //map used to display all meal name and image in individual div element
    data.meals.map(meal => {
        const mealDiv = document.createElement("div");
        const mealInfo = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}<h3>
        `;
        mealDiv.innerHTML = mealInfo;
        resultSection.appendChild(mealDiv);
        //to add event handler to individual area(div element) of Single Meal info
        mealDiv.addEventListener("click", () => {
            document.getElementById("search-bar").style.display = "none";
            document.getElementById("search-results-area").style.display = "none";
            document.getElementById("details-area").style.display = "block";
            toggleSpinner();

            displayMealDetails(meal.idMeal);
        });
    });
    toggleSpinner();
}

const displayIndividualMeal = api =>{
    getServerdata(api)
    .then( data => {
        displayIndividualMealName(data);
    })
    .catch(error => {
        displayResultByIngredient();
    });
}

const displayResultByIngredient = () => {
    const keyword = getInputValue();
    const api = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${keyword}`;
    
    getServerdata(api)
    .then( data => {
        displayIndividualMealName(data);
    })
    .catch(error => {
        displayResultByCategory();
    });
}

const displayResultByCategory = () => {
    const keyword = getInputValue();
    const api = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${keyword}`;
    
    getServerdata(api)
    .then( data => {
        displayIndividualMealName(data);
    })
    .catch(error => {
        displayResultByArea();
    });
}

const displayResultByArea = () => {
    const keyword = getInputValue();
    const api = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${keyword}`;
    
    getServerdata(api)
    .then( data => {
        displayIndividualMealName(data);
    })
    .catch(error => {
        document.getElementById("error-message").style.display = "block";
        toggleSpinner();
    });
}

//to display food image and name into search result section
const displayResult = mealName => {
    let api;
    // to add posiblity to search meals by first letter
    if(mealName.length == 1){
        api = `https://www.themealdb.com/api/json/v1/1/search.php?f=${mealName}`;
    } else{
        api = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
    }
    displayIndividualMeal(api);
}

//function expression to get input from search bar input element
const getInputValue = () => document.getElementById("meal-input").value;

//to add event handler to the Search Button
document.getElementById("search-btn").addEventListener("click", () => {
    document.getElementById("search-results-area").innerHTML = '';
    document.getElementById("error-message").style.display = "none";
    const mealName = getInputValue();
    toggleSpinner();
    displayResult(mealName);
});

document.getElementById("meal-input").addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        document.getElementById("search-btn").click();
    }
});

//IIFE to display Meal Category by Default
(function(){
    const categoryApi = "https://www.themealdb.com/api/json/v1/1/categories.php";
    const resultSection = document.getElementById("search-results-area");
    toggleSpinner();

    getServerdata(categoryApi)
    .then(data => {
        const categories = data.categories;
        categories.map(category => {
            const categoryDiv = document.createElement("div");
            const categoryInfo = `
                <img src="${category.strCategoryThumb}">
                <h3>${category.strCategory}<h3>
            `;
            categoryDiv.innerHTML = categoryInfo;
            resultSection.appendChild(categoryDiv);
            //to add event handler to individual area(div element) of Single Meal Category
            categoryDiv.addEventListener("click", () => {
                document.getElementById("search-results-area").innerHTML = "";
                toggleSpinner();
                // displayMealByCategory(category.strCategory);
                const singlecategoryApi = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`;
                displayIndividualMeal(singlecategoryApi);
            });
        });
        toggleSpinner();
    })
    .catch(error =>{
        document.getElementById("error-message").innerText = "Fail to load data from Server";
        document.getElementById("error-message").style.display = "block";
    });
})();
