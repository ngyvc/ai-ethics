console.log('survey.js loaded');

async function fetchQuestions() {
  const response = await fetch("js/questions.json");
  const data = await response.json();
  //console.log(data);
  display(data);
}

fetchQuestions();

let keys = ['strongly agree', '&nbsp;', 'neutral', '&nbsp;', 'strongly disagree'];

function display(data){
  let dataSection = document.querySelector('#dataform');
  
  data.forEach((question, index) => {
    let hr  = document.createElement('hr');
    dataSection.appendChild(hr);
    let section = document.createElement('section');
    //console.log(index, question.question);
    
    let article = document.createElement('article');
    article.className = 'scale';
    let h4 = document.createElement('h4');
    h4.textContent = question.question;
    article.appendChild(h4);
    

    for(let i = 0; i < 5; i++){
      let input = document.createElement('input');
      input.type = 'radio';
      input.id = `q${index}_option${i+1}`;
      input.name = `q${index}`;
      input.value = i+1;
      article.appendChild(input);
      input.addEventListener('change', function(){
        //console.log(this.id, this.value);
        submitForm(this.name, this.value);
      })
    }
    let figures = document.createElement('div');
    figures.className = 'figures';
    for (let i = 0; i < 5; i++) {
      let figure = document.createElement('figure');
      figure.innerHTML = keys[i];
      figures.appendChild(figure);
    }
    article.appendChild(figures);
    
    dataSection.appendChild(article);
  })
}


function submitForm(key, value){
  //console.log(key, value);
  let dataform = document.querySelector('#dataform');
  
  // let response = document.querySelector('#response');
  // console.log(dataform);
  const formdata = new FormData(dataform);
  formdata.append('key', key);
  formdata.append('value', value);
  // const value = Object.fromEntries(formdata.entries());
  // console.log({ value });

  fetch('app/insert.php', {
    method: "POST",
    body: formdata
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
    //   if (data[0].match == true) {
    //     location.href='../ai-ethics/game.html';
    //   } else {
    //     response.innerHTML = 'Woops! Is that the right password?';
    //   }
      
    })
}