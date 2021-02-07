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
            listItem.innerHTML = `<img src="check-box.svg"> <p>${detailsInfo[ingredientMeasure]} ${detailsInfo[ingredient]}</p>`;
            document.getElementById("ingredients-list").appendChild(listItem);
        }
    }
}

//to display full details of a meal
const displayMealDetails = mealId => {
    const api = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const detailsSection = document.getElementById("details-area");

    getServerdata(api).then(data => {
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
    }).catch(error => {
        document.getElementById("error-message").innerText = "Connection Lost! Please Check Your Internet Connection";
        document.getElementById("error-message").style.display = "block";
    });
}

//to display food image and name into search result section
const displaySearchResult = mealName => {
    const api = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
    const resultSection = document.getElementById("search-results-area");

    getServerdata(api).then( data => {
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

                displayMealDetails(meal.idMeal);
            });
        });
    }).catch(error => {
        document.getElementById("error-message").style.display = "block";
    });
}

//function expression to get input from search bar input element
const getInputValue = () => document.getElementById("meal-input").value;

//to add event handler to the Search Button
document.getElementById("search-btn").addEventListener("click", () => {
    document.getElementById("search-results-area").innerHTML = '';
    document.getElementById("error-message").style.display = "none";
    const mealName = getInputValue();
    displaySearchResult(mealName);
});