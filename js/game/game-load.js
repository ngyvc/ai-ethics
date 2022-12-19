let gameloader = document.querySelector(".gameloader");
let gameJsonPath = "js/json/";
let gameArea = document.createElement("article");
let lang = "en";
let levelSelectTextHeading = "h2";

if (!localStorage.getItem("currentLevel")) {
  localStorage.setItem("currentLevel", 0);
}
if (!localStorage.getItem("currentStep")) {
  localStorage.setItem("currentStep", 0);
}
let gameObj = {};
let levelsObj = [];
let stepsObj = [];

function loadGame(gameObj) {
  gameArea.id = gameObj.id;
  gameArea.classList = gameObj.class;
  console.log("game", gameObj);
  let levelsSelect = document.createElement("section");
  levelsSelect.classList = "level-select";
  // for (const level of gameObj.levels) {
  // }
  fetchAllLevels(0, gameObj.levels, levelsSelect, levelsObj);
  gameloader.appendChild(gameArea);
}

function fetchAllLevels(i, levels, levelsSelect, levelsObj) {
  fetch(`${gameJsonPath}level${levels[i]}.json`)
    .then((res) => res.json())
    .then((data) => {
      levelsObj.push(data);
      let levelSelect = document.createElement("section");
      levelSelect.id = data.icon[0].id;
      levelSelect.classList = data.icon[0].class;
      let levelSelectImg = document.createElement("img");
      levelSelectImg.src = data.icon[0].src;
      levelSelectImg.alt = data.icon[0].name[lang];
      levelSelect.appendChild(levelSelectImg);
      let levelSelectTxt = document.createElement(levelSelectTextHeading);
      levelSelectTxt.textContent = data.name[lang];
      levelSelect.appendChild(levelSelectTxt);
      levelSelect.addEventListener("click", (event) => {
        loadLevel(event, levels[i]);
      });
      levelsSelect.appendChild(levelSelect);
      gameArea.appendChild(levelsSelect);
    })
    .then(() => {
      if (i !== levels.length - 1) {
        fetchAllLevels(i + 1, levels, levelsSelect, levelsObj);
      }
    });
}

function loadLevel(event, level) {
  let levelArea = document.createElement("section");
  console.log("selected level", level, event.currentTarget);
  currentLevel = levelsObj[level - 1];
  gameArea.innerHTML = "";
  levelArea.id = `level${level}`;
  levelArea.classList = "level";
  let levelBg = document.createElement("section");
  levelBg.classList = "bg";
  levelBg.id = `bg-level${level}`;
  levelArea.appendChild(levelBg);
  console.log("current level", currentLevel);
  if (currentLevel.assets) {
    for (let asset of currentLevel.assets) {
      let assetImg = document.createElement("img");
      assetImg.alt = asset.name[lang];
      assetImg.classList = asset.class;
      assetImg.id = asset.id;
      assetImg.src = asset.src;
      levelArea.appendChild(assetImg);
    }
  }

  fetchAllSteps(0, currentLevel.steps, level, stepsObj);
  console.log(stepsObj);
  gameArea.appendChild(levelArea);
}

function fetchAllSteps(i, steps, level, stepsObj) {
  fetch(`${gameJsonPath}level${level}-step${steps[i]}.json`)
    .then((res) => res.json())
    .then((data) => {
      stepsObj.push(data);
    })
    .then(() => {
      if (i !== steps.length - 1) {
        fetchAllSteps(i + 1, steps, level, stepsObj);
      }
    });
}

// load json
fetch("js/json/game.json")
  .then((res) => res.json())
  .then((data) => {
    gameObj = data;
    loadGame(gameObj);
  });
