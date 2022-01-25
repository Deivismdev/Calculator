class Calculator {
  constructor(displayMain, displaySecondary) {
    this.displayMain = displayMain;
    this.displaySecondary = displaySecondary;
    this.clear();
    this.gameOn = false;
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
    if (parseInt(key.key) >= 0 && parseInt(key.key) <= 9) {
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
        if(this.result == this.operandMain){
            console.log("correct")
            this.displaySecondary.innerText += ` = ${this.result}`
            this.displaySecondary.style.color = "green";
            setTimeout(() => { this.genProblem() }, 1000);
        }
        else{
            this.displayMain.style.color = "red";
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

  // 3 levels mby ?
  // 1 - sudetis,atimtis  1 - 10
  // 2 - daugyba, dalyba  1 - 10
  // 3 - sudetis, atimtis 100 - 9999
  // 4 - daugyba, dalyba  100 - 9999
  // ps: pries dalybos uzduoti duodant checkint ar sveikas skaicius gaunasi padalinus

  resetColors(){
    console.log("resetColors")
    numLock.style.backgroundColor = "Grey";
    this.displaySecondary.innerText = "";
    this.displayMain.innerText = "";
    this.operandMain = '';
    this.operandSecond = '';
    console.log("Game off")
    this.displaySecondary.style.color = "grey";
  }

  startGame(){
    if (this.gameOn == true) {
        this.gameOn = false;
        this.resetColors();
        return;
      } else {
        this.gameOn = true;
        numLock.style.backgroundColor = "Green";
        console.log("Game on")
        this.operandMain = '';
        this.operandSecond = '';
        this.genProblem()
      }
  }

  genProblem() {
    this.resetColors();
    let operand1 = Math.floor(Math.random() * 10 + 1);
    let operand2 = Math.floor(Math.random() * 10 + 1);
    let operation = ["*", "+", "/", "-"][Math.floor(Math.random() * 4)];
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

const calculator = new Calculator(displayMain, displaySecondary);

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
  calculator.handleKeyPress(e);
  calculator.updateDisplay();
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

// am i going crazy or whats happening?