let gameloader = document.querySelector(".gameloader");

// load json
fetch("game.json")
  .then((res) => res.json())
  .then((data) => {
    let gameStyle = document.createElement("link");
    gameStyle.setAttribute("rel", "stylesheet");
    gameStyle.setAttribute("type", "text/css");
    gameStyle.setAttribute("href", data.style);
    document.querySelector("head").appendChild(gameStyle);
    console.log(data.style);
    let game = document.createElement("section");
    game.id = data.name;
    let gameMsg = document.createElement("section");
    gameMsg.id = `${data.name}-msg`;
    for (let asset of data.assets) {
      let img = document.createElement("img");
      img.src = asset.src;
      img.classList = asset.class;
      img.dataset.id = asset.name;
      img.id = asset.id;
      game.appendChild(img);
    }
    for (let asset of data.choices) {
      let img = document.createElement("img");
      img.src = asset.src;
      img.classList = asset.class;
      img.dataset.id = asset.name;
      img.id = asset.id;
      game.appendChild(img);
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
            game.replaceChild(
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
              },
              { once: true }
            );

            gameResponse.appendChild(endGame);
          } else {
            let gameResponse = document.createElement("section");
            gameResponse.textContent = data.responses.incorrect;
            game.replaceChild(
              gameResponse,
              document.querySelector(`#${data.name}-msg`)
            );
            gameResponse.id = `${data.name}-msg`;
          }
        },
        { once: true }
      );
    }
    game.appendChild(gameMsg);
    gameloader.appendChild(game);
  });
