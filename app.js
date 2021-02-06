const getMealSearchResult = async mealName => {
    const api = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
    const response = await fetch(api);
    const data = await response.json();
    return data.meals;
}

//to display food image and name into search result section
const displaySearchResult = mealName => {
    const resultSection = document.getElementById("search-results-area");
    getMealSearchResult(mealName).then( data => {
        data.map(meal => {
            const mealDiv = document.createElement("div");
            const mealInfo = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}<h3>
            `;
            mealDiv.innerHTML = mealInfo;
            resultSection.appendChild(mealDiv);
        });
    });
}

//function expression to get input from search bar input element
const getInputValue = () => document.getElementById("meal-input").value;

//to add event handler to the search button
document.getElementById("search-btn").addEventListener("click", () => {
    document.getElementById("search-results-area").innerHTML = '';
    const mealName = getInputValue();
    displaySearchResult(mealName);
});