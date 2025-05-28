
async function createToken(){
    let params = {
        ticker: document.getElementById("ticker").value,
        name: document.getElementById("name").value,
        supply: document.getElementById("supply").value,
    };
    let response = await send_request('POST', "/wallet/trader/token/", params, true);
    if ('is_active' in response){
        console.log(response);
        alert("token created!")
        createTokenTable();
        // showSignals();
    }

}
async function getSymbol(symbol) {
    let params = await send_request('GET', `/spot/market/symbol/${symbol}/`, {})
    return params
}

async function createTokenTable(showAction){
    let div = document.getElementById('token-div');
    div.innerHTML = '<table id="token-table" class="display" style="width:100%"></table>';
    let columns= [
        { 
            data: 'ticker', 
            title: 'ticker',
            orderable: true,
        },
        { 
            data: 'name', 
            title: 'name',
            orderable: true,
        },
        { 
            data: 'supply', 
            title: 'supply',
            orderable: true,
        },
        // { 
        //     data: 'tp', 
        //     title: 'tp',
        //     orderable: true,
        //     render: getPriceFormatter(10),
        // },
    ];
    if (showAction){
        columns.push({ 
            title: 'action',
            // visible: false,
            render: function (data, type, row, full) {
                let toggleText = document.getElementById('base').value === ""? 'base': 'quote';
                return `<button class="btn btn-outline-primary btn-sm"  onClick="selectBaseQuote('${row.ticker}')">select as <span class="baseQuoteSelectName">${toggleText}</span></button>`
            }        
        });
    }
    let conf = await getBaseDataTableConf(`/wallet/trader/token/`, columns, true);
    let table = $('#token-table').DataTable(conf);
}

function selectBaseQuote(ticker){
    console.log(ticker);
    let base = document.getElementById('base');
    let quote = document.getElementById('quote');
    let symbol = document.getElementById('symbol');
    if (base.value === ""){
        base.value = ticker;
        // document.getElementById('baseQuoteSelectName').innerHTML = "quote";
        let allItemsByClass = document.getElementsByClassName('baseQuoteSelectName');
        for (let i = 0; i < allItemsByClass.length; i++) {
            allItemsByClass[i].innerHTML = 'quote';
        }
    }else if (base.value !== ticker){

        quote.value = ticker;
        document.getElementById('selectBaseQuoteTable').style.display = 'none';
        document.getElementById('symbol-form').style.display = 'block';
        symbol.value = `${base.value}${quote.value}`
    }else {
        alert("Base and quote can't be the same!");
    }
}
function resetForm(){
    let empty_inputs = ['base', 'quote', 'symbol'];
    empty_inputs.forEach(function (_id){
        document.getElementById(_id).value = "";
    });
    document.getElementById('selectBaseQuoteTable').style.display = 'block';
    document.getElementById('symbol-form').style.display = 'none';
}
async function changesymbolSetup(){
    let params = {
        leverage: document.getElementById("leverage").value,
    };
    let response = await send_request('PATCH',`/spot/trader/setup/${SELECTED_SYMBOL}/`, params, true);
    if ('symbol' in response){
        alert("Leverage updated!")
        return true
    }else{
        return false
    }
}

async function setsymbolSetup(){
    let response = await send_request('GET',`/spot/trader/setup/${SELECTED_SYMBOL}/`, {}, true);
    if ('symbol' in response){
        document.getElementById("leverage").value = response['leverage'];
        return true
    }else{
        return false
    }
}
