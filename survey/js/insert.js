
// check if password matches password hardcoded in php

let dataform = document.querySelector('#dataform');
//let response = document.querySelector('#response');

dataform.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log(event);
  const formdata = new FormData(dataform);
  
  const value = Object.fromEntries(formdata.entries());
  value.q0 = formdata.getAll("topics");
  console.log({ value });

  // fetch('app/insert.php', {
  //   method: "POST",
  //   body: formdata
  // })
  //   .then((resp) => resp.json())
  //   .then((data) => {
  //     console.log(data[0].match);
  //     if (data[0].match == true) {
  //       location.href='../ai-ethics/game.html';
  //     } else {
  //       response.innerHTML = 'Woops! Is that the right password?';
  //     }
      
  //   })
});