// Selecet elements
let conuntSPan = document.querySelector(".count span"),
  bulletSpans = document.querySelector(".bullets .spans"),
  answerArea = document.querySelector(".answers-area"),
  sumitBtn = document.querySelector(".submit-button"),
  qTitle = document.querySelector(".quiz-area .question"),
  results = document.querySelector(".results"),
  countDownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0,
  rightAnswersCount = 0,
  countDownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let questionsOBject = JSON.parse(this.responseText);

      let qCount = questionsOBject.length;

      // Creat bullets function
      creatBullets(qCount);

      // Add data to the page
      AddQustionData(questionsOBject[currentIndex], qCount);

      // Start countdown
      countDown(5, qCount);

      // Submit answer
      sumitBtn.onclick = function () {
        theRightAnswer = questionsOBject[currentIndex]["right_answer"];

        currentIndex++;

        checkAnswer(theRightAnswer, qCount);

        // Remove old question
        qTitle.innerHTML = "";
        answerArea.innerHTML = "";

        AddQustionData(questionsOBject[currentIndex], qCount);

        // Handel Bullets
        handelBullets();

        // Start new countdown
        clearInterval(countDownInterval);
        countDown(5, qCount);

        // Show result
        showResult(qCount);
      };
    }
  };

  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}

getQuestions();

function creatBullets(num) {
  conuntSPan.textContent = num;

  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");

    if (i == 0) {
      span.classList.add("on");
    }

    bulletSpans.appendChild(span);
  }
}

function AddQustionData(obj, count) {
  if (currentIndex < count) {
    qTitle.textContent = obj["title"];

    for (let i = 1; i < 5; i++) {
      // creat answer container
      let answerDiv = document.createElement("div");
      answerDiv.classList.add("answer");
      answerDiv.classList.add("answer");

      // creat radio input
      let radioInput = document.createElement("input");
      radioInput.setAttribute("type", "radio");
      radioInput.setAttribute("id", `answer_${i}`);
      radioInput.setAttribute("data-answer", obj[`answer_${i}`]);
      radioInput.setAttribute("name", "questions");

      if (i == 1) {
        radioInput.checked = true;
      }

      // creat labal
      let answerLabel = document.createElement("label");
      answerLabel.setAttribute("for", `answer_${i}`);
      answerLabel.textContent = obj[`answer_${i}`];

      // append
      answerDiv.appendChild(radioInput);
      answerDiv.appendChild(answerLabel);

      answerArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let checkedRadio = document.querySelector("input:checked");

  if (checkedRadio.getAttribute("data-answer") == rAnswer) {
    rightAnswersCount++;
  }
}

function handelBullets() {
  let bulletSpans = document.querySelectorAll(".bullets .spans span");
  bulletSpans.forEach((span, index) => {
    if (currentIndex == index) {
      span.classList.add("on");
    }
  });
}

function showResult(count) {
  if (currentIndex == count) {
    let theResults;
    if (currentIndex === count) {
      document.querySelector(".quiz-area").remove();
      answerArea.remove();
      sumitBtn.remove();

      if (rightAnswersCount > count / 2 && rightAnswersCount < count) {
        results.innerHTML = `<span class="good">Good </span>: ${rightAnswersCount}/ ${count}`;
      } else if (rightAnswersCount == count) {
        results.innerHTML = `<span class="perfect">Perfect </span>: ${rightAnswersCount}/ ${count}`;
      } else {
        results.innerHTML = `<span class="bad">Bad </span>: ${rightAnswersCount}/ ${count}`;
      }
    }
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, secondes;

    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;

      secondes = parseInt(duration % 60);
      secondes = secondes < 10 ? `0${secondes}` : secondes;

      countDownElement.innerHTML = `${minutes}:${secondes}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        sumitBtn.click();
      }
    }, 1000);
  }
}
