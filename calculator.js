// Percent Solids Calculator - Vanilla JavaScript Implementation

class PercentSolidsCalculator {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.calculate(); // Initial calculation
    }

    initializeElements() {
        this.form = document.getElementById('calculator-form');
        this.diameterInput = document.getElementById('diameter');
        this.diameterUnitSelect = document.getElementById('diameter-unit');
        this.compositionSelect = document.getElementById('composition');
        this.customDensityGroup = document.getElementById('custom-density-group');
        this.densityInput = document.getElementById('density');
        this.solidsInput = document.getElementById('solids');
        this.resultDisplay = document.getElementById('result');
        this.customDensityValue = this.densityInput.value;

        this.updateDensityInputState();
    }

    attachEventListeners() {
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            this.calculate();
        });

        this.diameterInput.addEventListener('input', () => this.calculate());
        this.diameterUnitSelect.addEventListener('change', () => this.calculate());
        this.densityInput.addEventListener('input', () => {
            if (this.compositionSelect.value === 'custom') {
                this.customDensityValue = this.densityInput.value;
            }

            this.calculate();
        });
        this.solidsInput.addEventListener('input', () => this.calculate());

        this.compositionSelect.addEventListener('change', () => {
            this.updateDensityInputState();
            this.calculate();
        });
    }

    updateDensityInputState() {
        const selectedComposition = this.compositionSelect.value;

        if (selectedComposition === 'custom') {
            this.customDensityGroup.classList.remove('hidden');
            this.densityInput.value = this.customDensityValue;
            return;
        }

        this.customDensityGroup.classList.add('hidden');
        this.densityInput.value = this.getSelectedCompositionDensity();
    }

    getSelectedCompositionDensity() {
        const selectedOption = this.compositionSelect.selectedOptions[0];
        return selectedOption ? parseFloat(selectedOption.dataset.density) : NaN;
    }

    getInputValues() {
        const diameterVal = parseFloat(this.diameterInput.value);
        const selectedComposition = this.compositionSelect.value;
        const densityVal = selectedComposition === 'custom'
            ? parseFloat(this.densityInput.value)
            : this.getSelectedCompositionDensity();
        const solidsVal = parseFloat(this.solidsInput.value);

        if (!Number.isFinite(diameterVal) || !Number.isFinite(densityVal) || !Number.isFinite(solidsVal)) {
            return { 
                valid: false, 
                error: 'Please enter numbers for all fields.'
            };
        }

        if (diameterVal <= 0 || densityVal <= 0 || solidsVal < 0) {
            return {
                valid: false,
                error: 'Diameter and density must be greater than zero. Percent solids cannot be negative.'
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
        if (!Number.isFinite(calc) || calc < 0) {
            this.displayError('Calculation result is invalid.');
            return;
        }

        if (calc === 0) {
            this.resultDisplay.innerHTML = '0 particles mL<sup>-1</sup>';
            this.resultDisplay.className = 'result-display success';
            return;
        }

        let power = Math.floor(Math.log10(calc));
        let mantissa = Number((calc / Math.pow(10, power)).toFixed(3));

        if (mantissa >= 10) {
            mantissa /= 10;
            power += 1;
        }

        const resultString = `${mantissa.toFixed(3)} × 10<sup>${power}</sup> particles mL<sup>-1</sup>`;

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
