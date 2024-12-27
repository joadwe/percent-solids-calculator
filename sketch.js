let diamInput, diamUnitSelect;
let densityInput, densityUnitSelect;
let solidsInput;
let resultSpan;

// Positions and sizes (can be adjusted for layout)
const xPos = 15;
const xSize = 70;
const ySpacing = 35;
const labelOffsetX = 160;
const initialY = 20;

function setup() {
  createCanvas(280, 160);
  textSize(14);

  // Diameter Input
  diamInput = createInput('100');
  diamInput.position(xPos, initialY);
  diamInput.size(60);
  diamInput.input(draw);

  diamUnitSelect = createSelect();
  diamUnitSelect.position(xPos + 65, initialY);
  diamUnitSelect.option('nm');
  diamUnitSelect.option('µm');
  diamUnitSelect.selected('nm');
  diamUnitSelect.size(xSize);
  diamUnitSelect.input(draw);

  // Density Input
  densityInput = createInput('1.05');
  densityInput.position(xPos, initialY + ySpacing);
  densityInput.size(60);
  densityInput.input(draw);

  densityUnitSelect = createSelect();
  densityUnitSelect.position(xPos + 65, initialY + ySpacing);
  densityUnitSelect.option('g/mL');
  densityUnitSelect.option('g/L');
  densityUnitSelect.selected('g/mL');
  densityUnitSelect.size(xSize);
  densityUnitSelect.input(draw);

  // Percent Solids Input
  solidsInput = createInput('1');
  solidsInput.position(xPos, initialY + 2 * ySpacing);
  solidsInput.size(60);
  solidsInput.input(draw);

  // Result span
  resultSpan = createSpan('');
  resultSpan.position(15, initialY + 3 * ySpacing + 10);
  resultSpan.style('font-size', '16px');
  resultSpan.style('font-weight', 'bold');

  // Initial draw
  draw();
}

function draw() {
  background(245);

  fill(0);
  noStroke();
  textAlign(LEFT);

  // Labels
  text('Diameter:', labelOffsetX, initialY + 15);
  text('Density:', labelOffsetX, initialY + ySpacing + 15);
  text('% Solids:', labelOffsetX, initialY + 2 * ySpacing + 15);

  // Retrieve input values
  const diameterStr = diamInput.value();
  const densityStr = densityInput.value();
  const solidsStr = solidsInput.value();

  // Validate and convert input strings to numbers
  const diameterVal = parseFloat(diameterStr);
  const densityVal = parseFloat(densityStr);
  const solidsVal = parseFloat(solidsStr);

  // Basic input validation
  if (
    isNaN(diameterVal) ||
    isNaN(densityVal) ||
    isNaN(solidsVal) ||
    diameterVal <= 0 ||
    densityVal <= 0 ||
    solidsVal < 0
  ) {
    resultSpan.html('Please enter valid, positive values.');
    return;
  }

  // Convert diameter if needed
  let diameterInMicrometers = diameterVal;
  if (diamUnitSelect.value() === 'nm') {
    // 1 nm = 0.001 µm
    diameterInMicrometers = diameterVal * 0.001;
  }

  // Perform the calculation
  // a1 = 6 * (s / 100) * 10^12
  // calc = a1 / (w * π * d^3)
  // For clarity, let's break it down:
  const sFactor = solidsVal / 100;
  const a1 = 6 * sFactor * Math.pow(10, 12);

  // Convert density to g/mL if user selected g/L (1 g/L = 0.001 g/mL)
  let densityInGPerMl = densityVal;
  if (densityUnitSelect.value() === 'g/L') {
    densityInGPerMl = densityVal * 0.001;
  }

  // Final calculation
  const calc =
    a1 / (densityInGPerMl * Math.PI * Math.pow(diameterInMicrometers, 3));

  // Format the result in scientific notation
  if (calc <= 0) {
    resultSpan.html('Calculation result is invalid (≤ 0).');
    return;
  }
  const power = Math.floor(Math.log10(calc));
  const mantissa = (calc / Math.pow(10, power)).toFixed(3);
  const resultString = `${mantissa} × 10<sup>${power}</sup> particles mL<sup>-1</sup>`;

  // Display the result
  resultSpan.html(resultString);
}