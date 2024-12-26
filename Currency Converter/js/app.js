let isValidRate = (fixerResponse) => {
  let isValid = true;
  if (fixerResponse.error)
      isValid = false;
    else{
      if (Object.values(fixerResponse.rates).length > 0)
        isValid = true;
      else
        isValid = false;
    }
    return isValid;
}

let isFloat = (n) =>{
    return Number(n) === n && n % 1 !== 0;
}

let calcRate = (quantity, value) => {
  return parseFloat(quantity)*parseFloat(value);
}

let changeBtnProperties = (isLoading) => {
  if (isLoading){
    document.getElementById("btn-convert").disabled = true;
    document.getElementById("btn-convert").innerHTML = 'Loading...'  
  }
  else{
   document.getElementById("btn-convert").disabled = false;
    document.getElementById("btn-convert").innerHTML = 'Convert'   
  }

}


async function convertRates(from, to, quantity) {
  changeBtnProperties(true);
  let url = 'http://api.fixer.io/latest?base='+from+'&symbols='+to+'?app_id=e1a03227b2e444538bd8ed483a35da7b'
  fetch(url).then(function(response) {
    return response.json().then(latest => {
      if (isValidRate(latest)){
        // Conversion Rocks
        document.getElementById("conversion-rocks").style.visibility = "visible";
        document.getElementById("currency-to-one-value").innerHTML = Object.values(latest.rates) + ' ' + to;
        document.getElementById("currency-to-one-title").innerHTML = from;

        // Conversion value
        document.getElementById("quantity-to").value = calcRate(quantity, Object.values(latest.rates));
      }
      else{
        alert('Invalid conversion');
        document.getElementById("conversion-rocks").style.visibility = "hidden";
        document.getElementById("quantity-to").value = "";
      }
      changeBtnProperties(false);
    });
  }).catch(function(error) {
    console.log(error);
  });
}

async function getCurrencies() {
  let url = 'https://openexchangerates.org/api/currencies.json'
  fetch(url).then(function(response) {
    return response.json().then(currencies => {
        let html='';
        Object.keys(currencies).forEach(function (key) {
          html += `<option value='${key}'>${currencies[key]}</option>`;
        });
        document.getElementById("currency-from").innerHTML = html;
        document.getElementById("currency-to").innerHTML = html;
    });
  }).catch(function(error) {
    console.log(error);
  });
}


document.getElementById('btn-convert').addEventListener('click', () => {
  let from = document.getElementById("currency-from").value;
  let to = document.getElementById("currency-to").value;
  let quantity = document.getElementById("quantity-from").value;
  
  convertRates(from, to, quantity);
  document.getElementById('btn-convert').disabled = false;

});


// Initialize
getCurrencies();
document.getElementById("conversion-rocks").style.visibility = "hidden";