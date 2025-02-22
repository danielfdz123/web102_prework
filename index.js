/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // loop over each item in the data

    // * 'game' represents each game object in games.js *(11 total)
    for (let game of games) {

         // create a new div element, which will become the game card
        const gameCard = document.createElement("div");

        // add the class game-card to the list
        gameCard.classList.add("game-card");                 

        // set the inner HTML using a template literal to display some info
        // about each game
        gameCard.innerHTML = `
        <img src ="${game.img}" class = "game-img"/>
        <h3> ${game.name} </h3>
        <p> ${game.description}</p>  
        <p> <u> Pledged:</u> ${game.pledged}</p>
        <p> <u> Goal:</u> ${game.goal}</p>
        <p> <u> Backers:</u> ${game.backers}</p>
        `;

        // prompts the opening/closing of the modal (singleGameView) for easier visibility
        gameCard.addEventListener("click", () => {
            opensingGameView(game);
        });

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }                                                       
}

// allows us to see the details of each individual game using modal
const singGameView = document.getElementById("singGameView");

// function to open/close the single game view and populate the modal with corresponding game details
function opensingGameView(game) {
    
    // grab the modal content
    const gameDetails = singGameView.querySelector(".gameDetails");

    // using innerHTML to set game info which will be displayed (exactly as when we see them on the UI)
    gameDetails.innerHTML = `
        <span class="close-btn" id="closeModal"> Click here, or off this window to close </span>
        <h1>${game.name}</h1>
        <img src="${game.img}" class="game-img"/>
        <p>${game.description}</p>
        <p> <u> Pledged:</u> ${game.pledged}</p>
        <p> <u> Goal:</u> ${game.goal}</p>
        <p> <u> Backers:</u> ${game.backers}</p>
    `;

    // show the modal when clicked
    singGameView.style.display = "block";

    // closes singleGameView modal when clicked anywhere outside the modal (or on the X)
    document.getElementById("closeModal").addEventListener("click", function() {
        singGameView.style.display = "none";
    });

    window.onclick = function(event) {
        if(event.target == singGameView) {
            singGameView.style = "none"
        }
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers

    // sum = sum + total contributions
const totalContributions = GAMES_JSON.reduce(
    (sum, game) => sum + game.backers, 0,
);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
    <p> ${totalContributions.toLocaleString()} </p>
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
    
    // sum = sum + total pledged
const totalRaised = GAMES_JSON.reduce(
    (sum, game) => sum + game.pledged, 0
);

// set inner HTML using template literal
raisedCard.innerHTML = `
    <p> $${totalRaised.toLocaleString()} </p>
`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `
    <p> ${GAMES_JSON.length} </p>
`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const sumUnfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// create a string that explains the number of unfunded games using the ternary operator
let unfundedMsg = (sumUnfundedGames == 0)                                                               // If there are no UNFUNDED games...
        ? "All games reached our goal! "                                                                // say that we have reached our goal
        : `${sumUnfundedGames} of our games have not reached our goal. Please give us a hand!`;         // else, say how many games are UNFUNDED

// create a new DOM element containing the template string and append it to the description container
const msg = document.createElement("div");
msg.innerHTML = `
    ${unfundedMsg}
`;
descriptionContainer.appendChild(msg);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [game1, game2] = sortedGames;

// TOP FUNDED GAME: create a new element to hold the name of the top pledge game, then append it to the correct element
const topGame = document.createElement("div");
topGame.innerHTML = `
    <u> <i> ${game1.name} </i> </u>
`;
firstGameContainer.appendChild(topGame);

// RUNNER UP: do the same for the runner up item
const runnerUp = document.createElement("div");

runnerUp.innerHTML = `
    <u> <i> ${game2.name} </i> </u>
`;

secondGameContainer.appendChild(runnerUp);