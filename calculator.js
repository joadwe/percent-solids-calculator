// Percent Solids Calculator - Vanilla JavaScript Implementation

class PercentSolidsCalculator {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.calculate(); // Initial calculation
    }

    initializeElements() {
        this.diameterInput = document.getElementById('diameter');
        this.diameterUnitSelect = document.getElementById('diameter-unit');
        this.compositionSelect = document.getElementById('composition');
        this.customDensityGroup = document.getElementById('custom-density-group');
        this.densityInput = document.getElementById('density');
        this.solidsInput = document.getElementById('solids');
        this.resultDisplay = document.getElementById('result');

        this.compositionDensities = {
            polystyrene: 1.05,
            silica: 2.0
        };

        this.updateDensityInputState();
    }

    attachEventListeners() {
        // Add event listeners to all inputs
        const inputs = [
            this.diameterInput,
            this.diameterUnitSelect,
            this.compositionSelect,
            this.densityInput,
            this.solidsInput
        ];

        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculate());
            input.addEventListener('change', () => this.calculate());
        });

        this.compositionSelect.addEventListener('change', () => {
            this.updateDensityInputState();
            this.calculate();
        });
    }

    updateDensityInputState() {
        const selectedComposition = this.compositionSelect.value;

        if (selectedComposition === 'custom') {
            this.customDensityGroup.classList.remove('hidden');
            return;
        }

        this.customDensityGroup.classList.add('hidden');
        this.densityInput.value = this.compositionDensities[selectedComposition];
    }

    getInputValues() {
        const diameterVal = parseFloat(this.diameterInput.value);
        const selectedComposition = this.compositionSelect.value;
        const densityVal = selectedComposition === 'custom'
            ? parseFloat(this.densityInput.value)
            : this.compositionDensities[selectedComposition];
        const solidsVal = parseFloat(this.solidsInput.value);

        // Validation
        if (isNaN(diameterVal) || isNaN(densityVal) || isNaN(solidsVal) ||
            diameterVal <= 0 || densityVal <= 0 || solidsVal < 0) {
            return { 
                valid: false, 
                error: 'Please enter valid, positive values for all fields.' 
            };
        }

        return {
            valid: true,
            diameter: diameterVal,
            density: densityVal,
            solids: solidsVal,
            diamUnit: this.diameterUnitSelect.value
        };
    }

    performCalculation(inputs) {
        // Convert diameter to micrometers
        let diameterInMicrometers = inputs.diameter;
        if (inputs.diamUnit === 'nm') {
            diameterInMicrometers = inputs.diameter * 0.001;
        }

        // Calculate: a1 = 6 * (s / 100) * 10^12, calc = a1 / (w * π * d^3)
        const sFactor = inputs.solids / 100;
        const a1 = 6 * sFactor * Math.pow(10, 12);
        const calc = a1 / (inputs.density * Math.PI * Math.pow(diameterInMicrometers, 3));

        return calc;
    }

    displayResult(calc) {
        if (calc <= 0) {
            this.displayError('Calculation result is invalid (≤ 0).');
            return;
        }

        const power = Math.floor(Math.log10(calc));
        const mantissa = (calc / Math.pow(10, power)).toFixed(3);
        const resultString = `${mantissa} × 10<sup>${power}</sup> particles mL<sup>-1</sup>`;

        this.resultDisplay.innerHTML = resultString;
        this.resultDisplay.className = 'result-display success';
    }

    displayError(message) {
        this.resultDisplay.innerHTML = message;
        this.resultDisplay.className = 'result-display error';
    }

    calculate() {
        // Get and validate input values
        const inputs = this.getInputValues();
        if (!inputs.valid) {
            this.displayError(inputs.error);
            return;
        }

        // Perform calculation
        const result = this.performCalculation(inputs);
        this.displayResult(result);
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PercentSolidsCalculator();
});
