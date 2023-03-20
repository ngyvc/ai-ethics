let typeMessage = "Scanning the face now";

let typeSpeedFactor = 1 / 18;

let typeTextClass = "type-text";

let typeArea = document.querySelector(".type-area");
let next = document.querySelector("button");

function typeText(typeMessage) {
  typeArea.classList.remove(typeTextClass);
  typeArea.style.webkitAnimationName = "";
  typeArea.innerText = "";
  setTimeout(() => {
    typeArea.innerText = typeMessage;
    typeArea.classList.add(typeTextClass);

    typeArea.style.width = `${typeMessage.length}ch`;
    typeArea.style.webkitAnimationName = "typing, blink";
    typeArea.style.webkitAnimationDuration = `${
      typeMessage.length * typeSpeedFactor
    }s, 0.5s`;
    typeArea.style.webkitAnimationTimingFunction = `steps(${typeMessage.length}), step-end`;
    typeArea.style.webkitAnimationIterationCount = `1, infinite`;
    typeArea.style.webkitAnimationDirection = `alternate`;
  }, 200);
}

typeText(typeMessage);

document.querySelector("button").addEventListener("click", (event) => {
  typeText(document.querySelector(".user-text").value);
});
