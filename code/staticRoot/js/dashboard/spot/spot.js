let SELECTED_SYMBOL,
    SELECTED_SYMBOL_PARAMS,
    DEFAULT_SYMBOL= "EURUSD";

async function initAccount(){
    // selectSymbol();
    getSelectedSymbol();
    document.getElementById("order-form").addEventListener("submit", function(event){
        event.preventDefault();
        let client_order_id = uid4();
        createOrder(client_order_id);
    });
    createSymboltTable(symbolOnClickCallback, selectSymbol);
    showAccountSpotPreview();
}
initAccount();

async function toogleLeverage(){
    let leverageSelect = document.getElementById("leverage");
    if (leverageSelect.disabled){
        leverageSelect.disabled = false;
        document.getElementById('leverage-btn').innerText = 'save';
    }else {
        let updated = await changeContractSetup();
        if (updated){
            leverageSelect.disabled = true;
            document.getElementById('leverage-btn').innerText = 'change';    
        }
    }
}


function symbolOnClickCallback(row){
    // $(this).toggleClass('active');
    let data = row.data();
    SELECTED_SYMBOL = data.symbol;
    selectSymbol();
}


async function createOrderBookTable(){
    let orderbook = await send_request('GET', `/spot/market/symbol/${SELECTED_SYMBOL}/orderbook/`, {});
    let bids_count = orderbook.bids.length;
    let asks_count = orderbook.asks.length;
    let trs = ""
    for (let i = 0; i < bids_count + asks_count; i++) {
        let break_counter = 0;
        let tds = "";
        if (bids_count > i){
            tds += `<td class="bidRow">${formatNumber(orderbook.bids[i].fee)}</td><td class="bidRow">${formatNumber(orderbook.bids[i].quantity)}</td><td class="bidRow">${formatNumber(orderbook.bids[i].price)}</td>`;
        }else{
            tds += `<td class="bidRow"></td><td class="bidRow"></td><td class="bidRow"></td>`;
            break_counter += 1;
        }

        if (asks_count > i){
            tds += `<td class="askRow">${formatNumber(orderbook.asks[i].price)}</td><td class="askRow">${formatNumber(orderbook.asks[i].quantity)}</td><td class="askRow">${formatNumber(orderbook.asks[i].fee)}</td>`;
        }else{
            tds += `<td class="askRow"></td><td class="askRow"></td><td class="askRow"></td>`;
            break_counter += 1;
        }
        if (break_counter === 2){
            break
        } else {
            trs += `<tr>${tds}</tr>`;
        }
    } 
    let th = "<thead><th>fee</th><th>quantity</th><th>bid</th><th>ask</th><th>quantity</th><th>fee</th></thead>";
    document.getElementById('orderbook').innerHTML = th + trs;

}
async function setSymbolParams(){
    let data = await getSymbol(SELECTED_SYMBOL);
    SELECTED_SYMBOL_PARAMS = data;
    document.getElementById('symbol').value = SELECTED_SYMBOL;
    document.getElementById('quote').innerHTML = data['quote'];
    document.getElementById('base').innerHTML = data['base'];
    document.getElementById('price').step = data['tick_size'];
    document.getElementById('price').value = "";
    document.getElementById('quantity').step = data['lot_size'];
    document.getElementById('quantity').value = "";
    setWalletBalance();
}
function selectSymbol(){
    const url = new URL(window.location.href);
    url.searchParams.set('symbol', SELECTED_SYMBOL);
    window.history.pushState(null, '', url.toString());
    setSymbolParams();
    createOrderBookTable();
}

async function setWalletBalance(){
    let response = await send_request('GET', `/wallet/trader/asset/`, {'token': `${SELECTED_SYMBOL_PARAMS['quote']},${SELECTED_SYMBOL_PARAMS['base']}`}, true);
    let assets = response['results'];
    let balances = {
        "base": {
            "balance": "0",
            "token": SELECTED_SYMBOL_PARAMS['base'],
        },
        "quote": {
            "balance": "0",
            "token": SELECTED_SYMBOL_PARAMS['quote'],
        },
    };
    if (assets.length > 0){
        assets.forEach(function (asset){
            
            let token = asset['token'];
            if (token === SELECTED_SYMBOL_PARAMS['base']){
                balances.base['balance'] = formatNumber(asset['free']);
            }else {
                balances.quote['balance'] = formatNumber(asset['free']);
            }
        });
    }
    Object.keys(balances).forEach(function (place){
        let div = document.getElementById(`${place}-balance`);
        div.innerHTML = `<input type="text" class="form-control" id="${balances[place].token}-balance" value="${balances[place].balance}" disabled></input>`
    });
}


// async function set_symbols(symbols){
//     let div = document.getElementById("symbols-list");
//     let selectedSymbol = getSelectedSymbol(symbols);
//     console.log(selectedSymbol)
//     div.innerHTML = '';
//     symbols.forEach(symbol => {
//         div.innerHTML += `<option ${symbol.symbol===selectedSymbol? 'selected' : ''} value="${symbol.symbol}">${symbol.symbol}</option>`;
//     });
// }

async function getSelectedSymbol(){
    let searchParams = new URLSearchParams(window.location.search),
        selectedSymbol;
    if (searchParams.has('symbol')){
        selectedSymbol = searchParams.get('symbol');
        let contract_params = await getSymbol(selectedSymbol);
        // console.log(contract_params);
        if ('symbol' in contract_params){
            SELECTED_SYMBOL = selectedSymbol;
            selectSymbol();
        }else{
            console.log('invalid symbol');
            window.location = window.location.pathname;
        }
    }
}

function showAccountSpotPreview(){
    let select = document.getElementById('account-preview');
    ['order-div', 'trade-div'].forEach(function (elm_id){
        document.getElementById(elm_id).innerHTML = "";
    });
    if (select.value === 'trade_history'){  
        createTradeTable();
    }else if (select.value === 'open_orders'){
        createOrderTable('placed,received', true);
    }else if (select.value === 'orders_history'){
        createOrderTable('filled,canceled', false);
    }
}