console.log('survey.js loaded');

//removed:   {"question":"I feel that ChatGPT is a good poet"},

/* language picker */
// set default to fr.
// if language is set in localstorage, use that.
// else if use navigator.languages[1] set to en

function getLanguage() {
  if(localStorage.getItem('language') == 'fr' || localStorage.getItem('language') == 'en'){
    setLanguagePicker(localStorage.getItem('language'));
    updateLanguage(localStorage.getItem('language'));
    return localStorage.getItem('language');
  }else if(navigator.languages[1] == 'en'){
    setLanguagePicker('en');
    updateLanguage('en');
    return navigator.languages[1];
  }else{
    return 'fr';
  }
}

function changeLanguage() {
  let lang = getLanguage();
  if(lang == 'fr'){
    setLanguagePicker('en');
    localStorage.setItem('language', 'en'); 
    updateLanguage('en');
  }else{  
    setLanguagePicker('fr');
    localStorage.setItem('language', 'fr');
    updateLanguage('fr');
  }
  fetchQuestions();
}

function setLanguagePicker(lang){
  if(lang == 'fr'){
    languagePicker.dataset.language = 'en';
    languagePicker.textContent = 'English'; 
    continueButton.textContent = 'Continuons >';
  }else{  
    languagePicker.dataset.language = 'fr';
    languagePicker.textContent = 'français';
    continueButton.textContent = 'Let\'s Continue';
  }
}

function updateLanguage(lang){
  //console.log(lang);
  if(lang == 'fr'){
    fetchHTML('nav_fr.html', 'header');
    fetchHTML('intro_fr.html', '#intro');
    continueButton.textContent = 'Continuons >';
  }else{
    fetchHTML('nav_en.html', 'header');
    fetchHTML('intro_en.html', '#intro');
    continueButton.textContent = 'Let\'s Continue';
  }
}

async function fetchHTML(url, target) {
  const response = await fetch(url);
  const data = await response.text();
  displayHTML(data, target);
}


displayHTML = (data,target) => {
  let element = document.querySelector(target);
  element.innerHTML = data;
}



let languagePicker = document.querySelector('#language-picker');
// languagePicker.addEventListener('click', function(event){
//   console.log(getLanguage());
//   changeLanguage();

// });

let header = document.querySelector('header');
header.addEventListener('click', function(event){
  if(event.target.id == 'language-picker'){
    changeLanguage(getLanguage());
  }
});



/* da code */

async function fetchQuestions() {
  const response = await fetch("js/questions.json");
  const data = await response.json();
  //console.log(data);
  display(data);
}

fetchQuestions();

let keys = {'en':['strongly agree', '&nbsp;', 'neutral', '&nbsp;', 'strongly disagree'],
            'fr':['tout à fait d\'accord', '&nbsp;', 'neutre', '&nbsp;', 'tout à fait en désaccord']};

let counter = 0;

function display(data){
  let dataSection = document.querySelector('#dataform');
  dataSection.innerHTML = '';
  dataLanguage = getLanguage();
  data = data[dataLanguage];
  data.forEach((question, index) => {
    let hr  = document.createElement('hr');
    hr.className = 'hidden';
    dataSection.appendChild(hr);

    let section = document.createElement('section');
    //console.log(index, question.question);
    
    let article = document.createElement('article');
    article.className = 'scale hidden';
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
      figure.innerHTML = keys[getLanguage()][i];
      figures.appendChild(figure);
    }
    article.appendChild(figures);
    
    dataSection.appendChild(article);
  })
  displayNext(counter);
}

function displayNext(counter){
  let tranche = counter +6;
  for(let i = 0; i < tranche; i++){
    let articles = document.querySelectorAll('article');
    let hrs = document.querySelectorAll('hr');
    articles[i].classList.remove('hidden');
    hrs[i].classList.remove('hidden');
  }
  if(counter == 12){
    console.log('disable continue');
    continueButton.classList.add('hidden');
    merciButton.classList.remove('hidden');
  }

}

let continueButton = document.querySelector('#continue');
let merciButton = document.querySelector('#merci');
continueButton.addEventListener('click', function(){
  counter += 6;
  displayNext(counter);
});




//call this every input change
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