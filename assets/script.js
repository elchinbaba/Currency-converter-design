const round4 = (number) => Math.round(number*10000)/10000;

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
    static input = 10000;

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
            document.querySelector('.input2').value = round4(input*data.rates[to]);
        })
        .catch(error => alert(error.message));

        CurrencyConverter.click_th();
        CurrencyConverter.inputs_input();
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
                const input1 = document.querySelector('.input1');
                input1.style.width = "231px";

                CurrencyConverter.input = +document.querySelector('.input2').value;
                CurrencyConverter.from = event.target.innerText;
                from = CurrencyConverter.from;

                if (event.target.innerText != to) {
                    fetch(CurrencyConverter.link + `?base=${from}&symbols=${to}`)
                    .then(response => response.json())
                    .then(data => {
                        document.querySelector('.from .info').innerText = `1 ${from} = ${round4(data.rates[to])} ${to}`;
                        document.querySelector('.to .info').innerText = `1 ${to} = ${round4(1/data.rates[to])} ${from}`;

                        input1.value = round4(CurrencyConverter.input/data.rates[to]);
                    })
                    .catch(error => alert(error.message));
                }
                else {
                    document.querySelectorAll('.info').forEach(element => element.innerText = `1 ${from} = 1 ${to}`);

                    input1.value = CurrencyConverter.input;
                }
            });
        });

        document.querySelectorAll('.to>th').forEach(element => {
            element.addEventListener('click', event => {
                const input2 = document.querySelector('.input2');
                input2.style.width = "231px";

                CurrencyConverter.input = +document.querySelector('.input1').value;
                CurrencyConverter.to = event.target.innerText;
                to = CurrencyConverter.to;
                
                if (event.target.innerText != from) {
                    fetch(CurrencyConverter.link + `?base=${to}&symbols=${from}`)
                    .then(response => response.json())
                    .then(data => {
                        document.querySelector('.from .info').innerText = `1 ${from} = ${round4(1/data.rates[from])} ${to}`
                        document.querySelector('.to .info').innerText = `1 ${to} = ${round4(data.rates[from])} ${from}`;

                        input2.value = round4(CurrencyConverter.input/data.rates[from]);
                    })
                    .catch(error => alert(error.message));
                }
                else {
                    document.querySelectorAll('.info').forEach(element => element.innerText = `1 ${from} = 1 ${to}`);

                    input2.value = CurrencyConverter.input;
                }
            });
        });
    }

    static inputs_input() {
        const input1 = document.querySelector('.input1');
        const input2 = document.querySelector('.input2');

        input1.addEventListener('input', event => {
            input1.style.width = "124px";
            event.target.maxLength = "6";
            input2.style.width = "231px";

            let value = event.target.value;
            value = +value.replace(',', '.');

            if (!isNaN(value)) {
                CurrencyConverter.input = value;

                const to = CurrencyConverter.to;
            
                fetch(CurrencyConverter.link + `?base=${CurrencyConverter.from}&symbols=${to}`)
                .then(response => response.json())
                .then(data => {
                    input2.value = round4(CurrencyConverter.input*data.rates[to]);
                })
                .catch(error => alert(error.message));
            }
            else {
                event.target.value = CurrencyConverter.input;
            }
        });
        
        input2.addEventListener('input', event => {
            input2.style.width = "124px";
            event.target.maxLength = "6";
            input1.style.width = "231px";

            let value = event.target.value;
            value = +value.replace(',', '.');

            if (!isNaN(value)) {
                CurrencyConverter.input = value;

                const from = CurrencyConverter.from;
            
                fetch(CurrencyConverter.link + `?base=${CurrencyConverter.to}&symbols=${from}`)
                .then(response => response.json())
                .then(data => {
                    input1.value = round4(CurrencyConverter.input*data.rates[from]);
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