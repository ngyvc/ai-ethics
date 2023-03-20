let gameloader = document.querySelector(".gameloader");
let gameJsonPath = "js/json/";
let gameArea = document.createElement("article");
let lang = "en";
let levelSelectTextHeading = "h2";

let txtBackToMenu = `Back To Menu`;

// if (!localStorage.getItem("currentLevel")) {
//   localStorage.setItem("currentLevel", 0);
// }
// if (!localStorage.getItem("currentStep")) {
//   localStorage.setItem("currentStep", 0);
// }

localStorage.clear();
localStorage.setItem("currentLevel", 0);
localStorage.setItem("currentStep", 0);

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
  console.log("fetching levels...");
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
  localStorage.setItem("currentLevel", level);
  currentLevel = levelsObj[level - 1];
  gameArea.innerHTML = "";
  levelArea.id = `level${level}`;
  levelArea.classList = "level";
  let backLevels = document.createElement("div");
  backLevels.classList = "back-to-levels";
  backLevels.id = `back-to-levels`;
  backLevels.innerText = txtBackToMenu;
  levelArea.appendChild(backLevels);
  backLevels.addEventListener("click", (event) => {
    console.log("object");
    backToLevels();
  });
  let levelBg = document.createElement("section");
  levelBg.classList = "level bg";
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
      localStorage.setItem("maxStep", steps.length - 1);
      if (i !== steps.length - 1) {
        fetchAllSteps(i + 1, steps, level, stepsObj);
      } else {
        loadStep(localStorage.getItem("currentStep"));
      }
    });
}

function loadStep(stepNum) {
  if (document.querySelector(".step")) {
    document.querySelector(".step").remove();
  }

  console.log(stepsObj[stepNum]);
  let data = stepsObj[stepNum];

  let gameStyle = document.createElement("link");
  gameStyle.setAttribute("rel", "stylesheet");
  gameStyle.setAttribute("type", "text/css");
  gameStyle.setAttribute("href", data.style);
  document.querySelector("head").appendChild(gameStyle);
  console.log(data.style);
  let step = document.createElement("section");
  step.id = data.name;
  step.classList = "step";
  let gameMsg = document.createElement("section");
  gameMsg.id = `${data.name}-msg`;
  for (let asset of data.assets) {
    let img = document.createElement("img");
    img.src = asset.src;
    img.classList = asset.class;
    img.dataset.id = asset.name;
    img.id = asset.id;
    step.appendChild(img);
  }
  if (data.type === "multi") {
    loadMulti(step, data);
  }
  if (data.type === "text") {
    loadText(step, data);
  }
  step.appendChild(gameMsg);
  document
    .querySelector(`#level${localStorage.getItem("currentLevel")}`)
    .appendChild(step);
}

// load json
fetch("js/json/game.json")
  .then((res) => res.json())
  .then((data) => {
    gameObj = data;
    loadGame(gameObj);
  });

// multi answer
function loadMulti(step, data) {
  for (let asset of data.choices) {
    let img = document.createElement("img");
    img.src = asset.src;
    img.classList = asset.class;
    img.dataset.id = asset.name;
    img.id = asset.id;
    step.appendChild(img);
    localStorage.setItem(`${data.name}-${asset.name}`, asset.answer);
    localStorage.setItem(`${data.name}-${asset.name}-status`, false);
    img.addEventListener(
      "click",
      (event) => {
        console.log(event.target.dataset.id, "clicked");
        event.target.classList.add("played");
        localStorage.setItem(`${data.name}-${asset.name}-status`, true);
        if (
          document.querySelectorAll(`.${asset.class}`).length ==
          document.querySelectorAll(".played").length
        ) {
          let gameResponse = document.createElement("section");
          gameResponse.textContent = data.responses.correct;
          step.replaceChild(
            gameResponse,
            document.querySelector(`#${data.name}-msg`)
          );
          gameResponse.id = `${data.name}-msg`;
          let endGame = document.createElement("section");
          endGame.classList = "end-game";
          endGame.textContent = data.responses.end;
          endGame.addEventListener(
            "click",
            (event) => {
              console.log("end the game");
              nextStep();
            },
            { once: true }
          );

          gameResponse.appendChild(endGame);
        } else {
          let gameResponse = document.createElement("section");
          gameResponse.textContent = data.responses.incorrect;
          step.replaceChild(
            gameResponse,
            document.querySelector(`#${data.name}-msg`)
          );
          gameResponse.id = `${data.name}-msg`;
        }
      },
      { once: true }
    );
  }
}

function loadText(step, data) {
  let typeArea = document.createElement("div");
  typeArea.classList = "type-area";
  step.appendChild(typeArea);

  let typeMessage = data.message;
  let typeSpeedFactor = 1 / 18;
  let typeTextClass = "type-text";

  function typeText(typeMessage) {
    typeArea.classList.remove(typeTextClass);
    typeArea.style.webkitAnimationName = "";
    typeArea.innerText = "";
    setTimeout(() => {
      typeArea.innerText = typeMessage;
      typeArea.classList.add(typeTextClass);

      typeArea.style.width = `${typeMessage.length}ch`;
      typeArea.style.animationName = "typing, blink";
      typeArea.style.animationDuration = `${
        typeMessage.length * typeSpeedFactor
      }s, 0.5s`;
      typeArea.style.animationTimingFunction = `steps(${typeMessage.length}), step-end`;
      typeArea.style.animationIterationCount = `1, infinite`;
      typeArea.style.animationDirection = `alternate`;
    }, 200);
  }

  typeText(typeMessage);

  let action = document.createElement("div");
  action.classList = "btn-action";
  action.innerText = data.action;
  step.appendChild(action);
  action.addEventListener("click", (event) => {
    nextStep();
  });
}

function nextStep() {
  console.log(localStorage.getItem("currentStep"));
  if (localStorage.getItem("currentStep") !== localStorage.getItem("maxStep")) {
    localStorage.setItem(
      "currentStep",
      parseInt(localStorage.getItem("currentStep")) + 1
    );
    loadStep(localStorage.getItem("currentStep"));
  } else {
    backToLevels();
  }
}

function backToLevels() {
  console.log("back to levels");
  document.querySelector(".game>.level").remove();
  // localStorage.clear();
  localStorage.setItem("currentStep", 0);
  localStorage.setItem("currentLevel", 0);
  stepsObj = [];
  loadGame(gameObj);
}
