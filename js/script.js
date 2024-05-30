// NRIC Algorithm
function getIdentificationNo(identification) {
    const weight = [2, 7, 6, 5, 4, 3, 2];
    const alphaSingaporean = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
    const alphaForeigner = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
    const alphaForeignerM = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'J', 'L', 'K'];

    let totalSum = 0;
    for (let i = 0; i < weight.length; i++) {
        const currentProduct = weight[i] * parseInt(identification[i + 1], 10);
        totalSum += currentProduct;
    }

    if (identification[0] === 'T' || identification[0] === 'G') {
        totalSum += 4;
    }

    if (identification[0] === 'M') {
        totalSum += 3;
    }

    const remainder = totalSum % 11;

    if (identification[0] === 'S' || identification[0] === 'T') {
        return identification + alphaSingaporean[remainder];
    } else if (identification[0] === 'F' || identification[0] === 'G') {
        return identification + alphaForeigner[remainder];
    } else if (identification[0] === 'M') {
        return identification + alphaForeignerM[remainder];
    }

    return identification;
}


// Generate Single NRIC Form
function generateSingleNric(category, year) {
    let prefix;
    let identification;
    if (category === 'Singaporean') {
        if (year < 1968) {
            prefix = Math.random() < 0.5 ? 'S0' : 'S1';
            identification = `${prefix}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
        } else {
            prefix = year < 2000 ? 'S' : 'T';
            const randomNumber = Math.floor(Math.random() * 100000);
            identification = `${prefix}${(year % 100).toString().padStart(2, '0')}${randomNumber.toString().padStart(5, '0')}`;
        }
    } else {
        prefix = year < 2000 ? 'F' : year < 2022 ? 'G' : 'M';
        const randomNumber = Math.floor(Math.random() * 10000000);
        identification = `${prefix}${randomNumber.toString().padStart(7, '0')}`;
    }
    
    return getIdentificationNo(identification);
}


document.addEventListener('DOMContentLoaded', function () {
    const categorySelect = document.getElementById('category');
    const yearLabel = document.getElementById('year-label');
    const yearOfBirthInput = document.getElementById('year-of-birth');
    const yearOfIssuanceSelect = document.getElementById('year-of-issuance');

    categorySelect.addEventListener('change', function () {
        if (categorySelect.value === 'Foreigner') {
            yearOfBirthInput.removeAttribute('required');
            yearOfIssuanceSelect.setAttribute('required', 'required');
            yearLabel.textContent = 'Year of Issuance';
            yearOfBirthInput.style.display = 'none';
            yearOfIssuanceSelect.style.display = 'inline-block';
        } else {
            yearOfIssuanceSelect.removeAttribute('required');
            yearOfBirthInput.setAttribute('required', 'required');
            yearLabel.textContent = 'Year of Birth';
            yearOfBirthInput.style.display = 'inline-block';
            yearOfIssuanceSelect.style.display = 'none';
        }
    });
});


document.getElementById('single-nric-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const category = document.getElementById('category').value;
    let year;
    if (category === 'Foreigner') {
        year = parseInt(document.getElementById('year-of-issuance').value, 10);
    } else {
        year = parseInt(document.getElementById('year-of-birth').value, 10);
    }
    const nric = generateSingleNric(category, year);
    document.getElementById('generated-nric').textContent = nric;
});


document.getElementById('year-of-birth').addEventListener('blur', function(event) {
    const yearOfBirthInput = event.target;
    let value = parseInt(yearOfBirthInput.value, 10);
    if (value < 1900) {
        value = 1900;
    } else if (value > 2099) {
        value = 2099;
    }
    yearOfBirthInput.value = value;
});


document.getElementById('copy-button').addEventListener('click', function() {
    const generatedNric = document.getElementById('generated-nric').textContent;
    const copyMessageElement = document.getElementById('copy-message');
    const copyButtonIcon = this.querySelector('i');
    if (generatedNric) {
        const tempInput = document.createElement('input');
        tempInput.value = generatedNric;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(tempInput.value)
            .then(() => {
                copyMessageElement.textContent = 'NRIC copied to clipboard!';
                copyMessageElement.style.color = '#03c04a';
                copyButtonIcon.classList.remove('fa-regular');
                copyButtonIcon.classList.add('fa');
            })
            .catch(err => {
                copyMessageElement.textContent = 'Failed to copy NRIC.';
                copyMessageElement.style.color = 'red';
            });
        document.body.removeChild(tempInput);
    } else {
        copyMessageElement.textContent = 'No NRIC to copy!';
        copyMessageElement.style.color = 'red';
    }
});


// Validate NRIC Form
function validateNric(nric) {
    const identification = nric.slice(0, -1);
    const validNric = getIdentificationNo(identification);
    return validNric === nric ? '<span style="color:#03c04a;font-size:1.2em">Valid <i class="fa-regular fa-circle-check"></i></span>' : `<span style="color:red;font-size:1.2em">Invalid <i class="fa-regular fa-circle-xmark"></i></span><br/>Correct NRIC: <span class="correct-nric">${validNric}</span>`;
}


document.getElementById('validate-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nric = document.getElementById('nric').value.toUpperCase();
    const result = validateNric(nric);
    document.getElementById('validation-result').innerHTML = result;
});


document.getElementById('nric').addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});


// Generate Range of NRICs Form
function generateNricForRange(minYear, maxYear) {
    let nrics = [];
    if (minYear < 1968) {
        for (let prefix of ['S0', 'S1']) {
            for (let i = 0; i < 1000000; i++) {
                let identification = `${prefix}${i.toString().padStart(6, '0')}`;
                nrics.push(getIdentificationNo(identification));
            }
        }
        minYear = 1968;
    }

    for (let year = minYear; year <= maxYear; year++) {
        let prefix = year < 2000 ? 'S' : 'T';
        for (let i = 0; i < 100000; i++) {
            let identification = `${prefix}${(year % 100).toString().padStart(2, '0')}${i.toString().padStart(5, '0')}`;
            nrics.push(getIdentificationNo(identification));
        }
    }

    return nrics.join('\n');
}


document.getElementById('nric-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const minYear = parseInt(document.getElementById('min-year').value, 10);
    const maxYear = parseInt(document.getElementById('max-year').value, 10);
    const messageElement = document.getElementById('generation-message');

    if (minYear > maxYear) {
        messageElement.textContent = "Max year should be more than or equal to Min year.";
        messageElement.style.color = 'red';
        return;
    }

    const nrics = generateNricForRange(minYear, maxYear);
    const blob = new Blob([nrics], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'nric.txt';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    messageElement.textContent = `Every possible NRIC generated for years ${minYear} to ${maxYear} in nric.txt`;
    messageElement.style.color = '#03c04a';
});


document.getElementById('min-year').addEventListener('blur', function(event) {
    const minYearInput = event.target;
    const messageElement = document.getElementById('generation-message');
    let value = parseInt(minYearInput.value, 10);
    const minValue = parseInt(minYearInput.min, 10);

    if (value < minValue) {
        value = minValue;
    } else if (value > 2099) {
        value = 2099;
    }
    minYearInput.value = value;

    if (value < 1968) {
        messageElement.textContent = "NRICs for Singaporeans born before 1968 do not relate to year of birth, so every possible NRIC before 1968 will be generated.";
        messageElement.style.color = 'darkorange';
    } else {
        messageElement.textContent = "";
    }
});


document.getElementById('max-year').addEventListener('blur', function(event) {
    const maxYearInput = event.target;
    const messageElement = document.getElementById('generation-message');
    let value = parseInt(maxYearInput.value, 10);
    const maxValue = parseInt(maxYearInput.max, 10);

    if (value > maxValue) {
        value = maxValue;
    } else if (value < 1900) {
        value = 1900;
    }
    maxYearInput.value = value;

    if (value < 1968) {
        messageElement.textContent = "NRICs for Singaporeans born before 1968 do not relate to year of birth, so every possible NRIC before 1968 will be generated.";
        messageElement.style.color = 'darkorange';
    } else {
        messageElement.textContent = "";
    }
});


// Miscellaneous
if (navigator.userAgent.match(/SamsungBrowser/i)) {
    var h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(function(h1Element) {
        h1Element.style.color = 'initial';
    });
}

var particlesClick = false;