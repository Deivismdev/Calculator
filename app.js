class Calculator {
  constructor(displayMain, displaySecondary, hpDots, lvlDots) {
    this.displayMain = displayMain;
    this.displaySecondary = displaySecondary;
    this.hpDots = hpDots;
    this.lvlDots = lvlDots;
    this.clear();
    this.gameOn = false;
    this.level = 1; // why am i starting from 1 not 0 idk but too late now + lvl and level choose one or another smh
    this.hp = 3;
    this.streak = 0;
  }

  clear() {
    this.operandMain = "";
    this.operandSecond = "";
    this.operation = undefined;
  }
  delete() {
    this.operandMain = this.operandMain.toString().slice(0, -1);
  }
  appendNumber(number) {
    if (!this.gameOn) {
      if (number === "." && this.operandMain.includes(".")) return;
      this.operandMain = this.operandMain.toString() + number.toString();
    }
    if (this.gameOn) {
      this.operandMain = this.operandMain.toString() + number.toString();
    }
  }

  handleKeyPress(key) {
    const operationSymbols = ["+", "-", "*", "/"];
    if (parseInt(key.key) >= 0 && parseInt(key.key) <= 9 || key.key == '.') {
      this.appendNumber(key.key);
    } else if (key.key === "Enter") {
      if (this.operandSecond !== "") {
        this.compute();
      }
    } else if (operationSymbols.includes(key.key)) {
      this.chooseOperation(key.key);
    } else if (key.key === "Backspace") {
      this.delete();
    }
    if (key.ctrlKey && key.key === "Backspace") {
      this.clear();
    }
  }

  chooseOperation(operation) {
    if(!this.gameOn){
        if (this.operandMain === "") return;
        if (this.operandSecond !== "") {
          this.compute();
        }
        this.operation = operation;
        this.operandSecond = this.operandMain;
        this.operandMain = "";
    }
  }

  resetGame() {
    hpDots.forEach(dot => {
      dot.classList.replace("hp-dot-red","hp-dot-green");
    })    
    this.displayMain.innerText = '';
    this.displaySecondary.innerText = '';

    this.lvlDots[0].classList.replace("lvl-dot-yellow","lvl-dot",);
    this.lvlDots[1].classList.replace("lvl-dot-yellow","lvl-dot");
    this.lvlDots[2].classList.replace("lvl-dot-yellow","lvl-dot");
    // ^ :D
    this.gameOn = false;
    return;
  }

  compute() {
    if(!this.gameOn){
        let result;
        const prev = parseFloat(this.operandSecond);
        const current = parseFloat(this.operandMain);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
          case "+":
            result = prev + current;
            break;
          case "-":
            result = prev - current;
            break;
          case "*":
            result = prev * current;
            break;
          case "/":
            result = prev / current;
            break;
          default:
            return;
        }
        this.operandMain = result;
        this.operation = undefined;
        this.operandSecond = "";
    }
    if(this.gameOn){
        if(isNaN(parseFloat(this.operandMain))){ // or just = '' wat u doink
          return;
        } 
        if(this.result == this.operandMain){
            this.streak += 1;
            if(this.streak == 3){
              this.level+=1;
              this.streak = 0;
            }

            switch(this.level){
              // case(1):
              //   this.lvlDots[this.level-1].classList.replace("lvl-dot","lvl-dot-yellow");
              //   break;
              case(2):
                this.lvlDots[this.level-1].classList.replace("lvl-dot","lvl-dot-orange");

                break;
              case(3):
                this.lvlDots[this.level-1].classList.replace("lvl-dot","lvl-dot-red");
                break;
            }

            this.displaySecondary.innerText += ` = ${this.result}`
            this.displaySecondary.style.color = "green";
            if(this.hp < 3) {
              this.hp += 1; 
            };
            // console.log(this.hpDots[this.hp-1])
            this.hpDots[this.hp-1].classList.replace("hp-dot-red","hp-dot-green");

            setTimeout(() => { this.genProblem() }, 1000);
        }
        else{
            this.streak = 0;
            this.displayMain.style.color = "red";
            console.log(this.hp)
            this.hp -= 1;
            this.hpDots[this.hp].classList.replace("hp-dot-green","hp-dot-red");
            if(this.hp == 0){
              this.displaySecondary.innerText = "Game over"
              // console.log("RIP")
              setTimeout(() =>{ this.resetGame(); }, 2000);
             
            }
            setTimeout(() => {
                this.displayMain.innerText = "";
                this.operandMain = ''; 
                this.displayMain.style.color = "white"; }
                , 1000);

        }
    }
  }
  

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }


  updateDisplay() {
    if (!this.gameOn) {
      this.displayMain.innerText = this.getDisplayNumber(this.operandMain);
      if (this.operation != null) {
        this.displaySecondary.innerText = `${this.getDisplayNumber(
          this.operandSecond
        )} ${this.operation}`;
      } else {
        this.displaySecondary.innerText = "";
      }
    }
    if (this.gameOn) {
      this.displayMain.innerText = this.getDisplayNumber(this.operandMain);
      if (this.operation != null) {
        this.displaySecondary.innerText = `${this.getDisplayNumber(
          this.operandSecond
        )} ${this.operation}`;
      }
    }
  }


  resetColors(){
    numLock.style.backgroundColor = "Grey";
    this.displaySecondary.innerText = "";
    this.displayMain.innerText = "";
    this.operandMain = '';
    this.operandSecond = '';
    // console.log("Game off")
    this.displaySecondary.style.color = "grey";
  }

  startGame(){
    this.lvlDots[this.level-1].classList.replace("lvl-dot","lvl-dot-yellow");
    if (this.gameOn == true) {
        this.gameOn = false;
        this.resetColors();
        return;
      } else {
        this.gameOn = true;
        numLock.style.backgroundColor = "Green";
        // console.log("Game on")
        this.operandMain = '';
        this.operandSecond = '';
        this.genProblem()
      }
  }

  // 3 levels mby ?
  // 1 - sudetis,atimtis  1 - 10
  // 2 - daugyba, dalyba  1 - 10
  // 3 - sudetis, atimtis 100 - 9999
  // 4 - daugyba, dalyba  100 - 9999
  // ps: pries dalybos uzduoti duodant checkint ar sveikas skaicius gaunasi padalinus

  genProblem() {
    this.resetColors();
    let operand1 = 0;
    let operand2 = 0;
    let operation = '';
    switch(this.level){
      case 1:
        operand1 = Math.floor(Math.random() * 10 + 1);
        operand2 = Math.floor(Math.random() * 10 + 1);
        operation = ["+", "-"][Math.floor(Math.random() * 2)];

        // i dont have negative numbers rn so ye :D
        if(operand2 > operand1 && operation == '-'){
          operation = '+';
        }
        break;
      case 2:
        console.log('lvl 2')
        operand1 = Math.floor(Math.random() * 10 + 1);
        operand2 = Math.floor(Math.random() * 10 + 1);
        operation = ["*", "/"][Math.floor(Math.random() * 2)];
        break;
      case 3:
        console.log('lvl 3')
        operand1 = Math.floor(Math.random() * 100 + 1);
        operand2 = Math.floor(Math.random() * 100 + 1);
        operation = ["+","-","*", "/"][Math.floor(Math.random() * 4)];
        break;
    }
    // let operand1 = Math.floor(Math.random() * 10 + 1);
    // let operand2 = Math.floor(Math.random() * 10 + 1);
    // let operation = ["*", "+", "/", "-"][Math.floor(Math.random() * 4)];
    let result = 0;
    switch (operation) {
      case "+":
        result = operand1 + operand2;
        break;
      case "-":
        result = operand1 - operand2;
        break;
      case "*":
        result = operand1 * operand2;
        break;
      case "/":
        result = operand1 / operand2;
        break;
    }
    console.log(`${operand1} ${operation} ${operand2} = ${result}`);
    this.result = result;
    this.displaySecondary.innerText = `${operand1} ${operation} ${operand2}`;
    this.displayMain.innerText = "";
  }
}

const displayMain = document.querySelector("[display-main]");
const displaySecondary = document.querySelector("[display-secondary]");
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const numLock = document.querySelector("[numlock]");
const lvlIndicator = document.querySelector("[level]")
const hpDots = document.querySelectorAll(".hp-dot-green")
const lvlDots = document.querySelectorAll(".lvl-dot")

const calculator = new Calculator(displayMain, displaySecondary, hpDots, lvlDots);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

numLock.addEventListener("click", () => {
//   calculator.genProblem();
  calculator.startGame();
  // calculator.updateDisplay();
});

document.addEventListener("keydown", (e) => {
  try{
    console.log(e);
      calculator.handleKeyPress(e);
      calculator.updateDisplay();

      // new tech! could use this instead of handleKeyPress() (maybe) but eeehh, don't fix what ain't broken
      var xpath = `//button[text()='${e.key}']`;
      var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // console.log(matchingElement);
      matchingElement.classList.add('button-down')
  }
  catch(e){
    // eh u know
  }

});


document.addEventListener("keyup", (e) => {
  try{
      var xpath = `//button[text()='${e.key}']`;
      var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      matchingElement.classList.remove('button-down')
  }
  catch(e){
    //
  }

});


operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

// allClearButton.addEventListener('click', () =>{
//     calculator.clear();
//     calculator.updateDisplay();
// });

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

// deleteButton.addEventListener('click',()=>{
//     calculator.delete();
//     calculator.updateDisplay();
// });


let year = document.querySelector('.year')
year.innerText = new Date().getFullYear()
