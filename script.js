"use strict";

// Shared helpers keep number validation and result messaging consistent.
function readFiniteNumber(input) {
  const value = input.value.trim();
  if (value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function showError(element, message) {
  element.textContent = message;
}

function clearError(element) {
  element.textContent = "";
}

// Convert the entered value using the selected temperature, length, or currency rate.
function convertUnits(value, conversionType) {
  switch (conversionType) {
    case "c-to-f":
      return { value: (value * 9) / 5 + 32, unit: "°F" };
    case "f-to-c":
      return { value: ((value - 32) * 5) / 9, unit: "°C" };
    case "m-to-km":
      return { value: value / 1000, unit: "km" };
    case "km-to-m":
      return { value: value * 1000, unit: "m" };
    case "m-to-in":
      return { value: value * 39.3701, unit: "in" };
    case "pkr-to-usd":
      return { value: value / 280, unit: "USD" };
    case "usd-to-pkr":
      return { value: value * 280, unit: "PKR" };
    default:
      return null;
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(value);
}

function initializeConverter() {
  const form = document.querySelector("#converter-form");
  const typeInput = document.querySelector("#conversion-type");
  const valueInput = document.querySelector("#conversion-value");
  const unitLabel = document.querySelector("#conversion-unit");
  const output = document.querySelector("#conversion-output");
  const error = document.querySelector("#converter-error");

  function updateUnitLabel() {
    const units = {
      "c-to-f": "°C",
      "f-to-c": "°F",
      "m-to-km": "m",
      "km-to-m": "km",
      "m-to-in": "m",
      "pkr-to-usd": "PKR",
      "usd-to-pkr": "USD",
    };
    unitLabel.textContent = units[typeInput.value];
    output.textContent = "—";
    clearError(error);
  }

  typeInput.addEventListener("change", updateUnitLabel);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = readFiniteNumber(valueInput);
    if (value === null) {
      output.textContent = "—";
      showError(error, "Please enter a valid number to convert.");
      valueInput.focus();
      return;
    }

    const conversion = convertUnits(value, typeInput.value);
    if (!conversion) {
      output.textContent = "—";
      showError(error, "Please select a valid conversion type.");
      return;
    }

    clearError(error);
    output.textContent = `${formatNumber(conversion.value)} ${conversion.unit}`;
  });
}

// Add the five subject marks, calculate their percentage, and assign a grade.
function calculateMarks(marks) {
  const total = marks.reduce((sum, mark) => sum + mark, 0);
  const percentage = total / marks.length;
  let grade;

  if (percentage >= 90) {
    grade = "A+";
  } else if (percentage >= 80) {
    grade = "A";
  } else if (percentage >= 70) {
    grade = "B";
  } else if (percentage >= 60) {
    grade = "C";
  } else {
    grade = "Fail";
  }

  return { total, percentage, grade };
}

function initializeMarksCalculator() {
  const form = document.querySelector("#marks-form");
  const inputs = Array.from(form.querySelectorAll('input[name="mark"]'));
  const error = document.querySelector("#marks-error");
  const totalOutput = document.querySelector("#marks-total");
  const percentageOutput = document.querySelector("#marks-percentage");
  const gradeOutput = document.querySelector("#marks-grade");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const marks = inputs.map(readFiniteNumber);
    const invalidIndex = marks.findIndex((mark) => mark === null || mark < 0 || mark > 100);

    if (invalidIndex !== -1) {
      totalOutput.textContent = "—";
      percentageOutput.textContent = "—";
      gradeOutput.textContent = "—";
      showError(error, "Enter a mark from 0 to 100 for all five subjects.");
      inputs[invalidIndex].focus();
      return;
    }

    const result = calculateMarks(marks);
    clearError(error);
    totalOutput.textContent = `${formatNumber(result.total)} / 500`;
    percentageOutput.textContent = `${formatNumber(result.percentage)}%`;
    gradeOutput.textContent = result.grade;
  });
}

// Generate and render ten multiplication results for the chosen number.
function generateMultiplicationTable(number) {
  return Array.from({ length: 10 }, (_, index) => ({
    multiplier: index + 1,
    result: number * (index + 1),
  }));
}

function initializeTableGenerator() {
  const form = document.querySelector("#table-form");
  const numberInput = document.querySelector("#table-number");
  const output = document.querySelector("#table-output");
  const error = document.querySelector("#table-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const number = readFiniteNumber(numberInput);
    if (number === null) {
      const emptyState = document.createElement("p");
      emptyState.className = "empty-state";
      emptyState.textContent = "Your 1–10 times table will appear here.";
      output.replaceChildren(emptyState);
      showError(error, "Please enter a valid number for the table.");
      numberInput.focus();
      return;
    }

    clearError(error);
    const rows = generateMultiplicationTable(number);
    output.replaceChildren(
      ...rows.map(({ multiplier, result }) => {
        const line = document.createElement("div");
        line.className = "table-line";
        line.innerHTML = `${formatNumber(number)} × ${multiplier} = <strong>${formatNumber(result)}</strong>`;
        return line;
      }),
    );
  });
}

// Check divisibility only up to the square root to identify prime numbers efficiently.
function isPrime(number) {
  if (!Number.isInteger(number) || number < 2) {
    return false;
  }

  for (let divisor = 2; divisor <= Math.sqrt(number); divisor += 1) {
    if (number % divisor === 0) {
      return false;
    }
  }

  return true;
}

function initializeNumberChecker() {
  const form = document.querySelector("#checker-form");
  const numberInput = document.querySelector("#check-number");
  const error = document.querySelector("#checker-error");
  const parityOutput = document.querySelector("#parity-result");
  const primeOutput = document.querySelector("#prime-result");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const number = readFiniteNumber(numberInput);
    if (number === null || !Number.isInteger(number)) {
      parityOutput.textContent = "—";
      primeOutput.textContent = "—";
      showError(error, "Please enter a valid whole number.");
      numberInput.focus();
      return;
    }

    clearError(error);
    parityOutput.textContent = number % 2 === 0 ? "Even" : "Odd";
    primeOutput.textContent = isPrime(number) ? "Prime" : "Not prime";
  });
}

// Switch the page theme and keep the selected appearance clear to assistive technology.
function initializeThemeControls() {
  const lightButton = document.querySelector("#light-theme");
  const darkButton = document.querySelector("#dark-theme");

  function setTheme(isDark) {
    document.body.classList.toggle("dark-theme", isDark);
    lightButton.setAttribute("aria-pressed", String(!isDark));
    darkButton.setAttribute("aria-pressed", String(isDark));
  }

  lightButton.addEventListener("click", () => setTheme(false));
  darkButton.addEventListener("click", () => setTheme(true));
}

initializeConverter();
initializeMarksCalculator();
initializeTableGenerator();
initializeNumberChecker();
initializeThemeControls();
