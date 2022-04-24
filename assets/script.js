function round4(number) {
    return Math.round(number*10000)/10000;
}

function thClick(th) {
    th.style.backgroundColor = "#833AE0";
    th.style.color = "white";
}

function back_thClick(th) {
    th.style.backgroundColor = "white";
    th.style.color = "#C6C6C6";
}

function design_th(element) {
    thClick(element);

    let prevSibling = element.previousElementSibling;
    while (prevSibling) {
        back_thClick(prevSibling);
        prevSibling = prevSibling.previousElementSibling;
    }

    let nextSibling = element.nextElementSibling;
    while (nextSibling) {
        back_thClick(nextSibling);
        nextSibling = nextSibling.nextElementSibling;
    }
}

class CurrencyConverter {
    static from = "AZN";
    static to = "USD";
    static link = 'https://api.exchangerate.host/latest';
    static input = 5000;

    static start() {
        document.querySelectorAll('.page-opening').forEach(item => thClick(item));
        
        const from = CurrencyConverter.from;
        const to = CurrencyConverter.to;
        const input = CurrencyConverter.input;
        fetch(CurrencyConverter.link + `?base=${from}&symbols=${to}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.from .info').innerText = `1 ${from} = ${round4(data.rates[to])} ${to}`;
            document.querySelector('.to .info').innerText = `1 ${to} = ${round4(1/data.rates[to])} ${from}`;

            document.querySelector('input').value = input;
            document.querySelector('.converted').innerText = round4(input*data.rates[to]);
        })
        .catch(error => alert(error.message));

        CurrencyConverter.click_th();
        CurrencyConverter.input_input();
    }

    static click_th() {
        document.querySelectorAll('th').forEach(element => {
            element.addEventListener('click', event => {
                design_th(event.target);
            });
        });

        let from = CurrencyConverter.from;
        let to = CurrencyConverter.to;

        document.querySelectorAll('.from>th').forEach(element => {
            element.addEventListener('click', event => {
                CurrencyConverter.from = event.target.innerText;
                from = CurrencyConverter.from;

                if (event.target.innerText != to) {
                    fetch(CurrencyConverter.link + `?base=${from}&symbols=${to}`)
                    .then(response => response.json())
                    .then(data => {
                        document.querySelector('.from .info').innerText = `1 ${from} = ${round4(data.rates[to])} ${to}`;
                        document.querySelector('.to .info').innerText = `1 ${to} = ${round4(1/data.rates[to])} ${from}`;

                        document.querySelector('.converted').innerText = round4(CurrencyConverter.input*data.rates[to]);
                    })
                    .catch(error => alert(error.message));
                }
                else {
                    document.querySelectorAll('.info').forEach(element => element.innerText = `1 ${from} = 1 ${to}`);

                    document.querySelector('.converted').innerText = CurrencyConverter.input;
                }
            });
        });

        document.querySelectorAll('.to>th').forEach(element => {
            element.addEventListener('click', event => {
                CurrencyConverter.to = event.target.innerText;
                to = CurrencyConverter.to;
                
                if (event.target.innerText != from) {
                    fetch(CurrencyConverter.link + `?base=${to}&symbols=${from}`)
                    .then(response => response.json())
                    .then(data => {
                        document.querySelector('.from .info').innerText = `1 ${from} = ${round4(1/data.rates[from])} ${to}`
                        document.querySelector('.to .info').innerText = `1 ${to} = ${round4(data.rates[from])} ${from}`;

                        document.querySelector('.converted').innerText = round4(CurrencyConverter.input/data.rates[from]);
                    })
                    .catch(error => alert(error.message));
                }
                else {
                    document.querySelectorAll('.info').forEach(element => element.innerText = `1 ${from} = 1 ${to}`);

                    document.querySelector('.converted').innerText = CurrencyConverter.input;
                }
            });
        });
    }

    static input_input() {
        document.querySelector('input').addEventListener('input', event => {
            let value = event.target.value;
            value = +value.replace(',', '.');

            if (!isNaN(value)) {
                CurrencyConverter.input = value;

                const from = CurrencyConverter.from;
                const to = CurrencyConverter.to;
            
                fetch(CurrencyConverter.link + `?base=${from}&symbols=${to}`)
                .then(response => response.json())
                .then(data => {
                    document.querySelector('.converted').innerText = round4(CurrencyConverter.input*data.rates[to]);
                })
                .catch(error => alert(error.message));
            }
            else {
                event.target.value = CurrencyConverter.input;
            }
        });
    }
}

CurrencyConverter.start();
