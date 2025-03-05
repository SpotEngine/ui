let SELECTED_SYMBOL,
    SELECTED_SYMBOL_PARAMS,
    a;
async function initAccount(){
    // selectSymbol();
    getSelectedSymbol();
    document.getElementById("order-form").addEventListener("submit", function(event){
        event.preventDefault();
        let client_order_id = uid4();
        createOrder(client_order_id);
    });
    createContractTable(contractOnClickCallback, selectSymbol);
    showAccountPerpPreview();
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


function contractOnClickCallback(row){
    // $(this).toggleClass('active');
    let data = row.data();
    SELECTED_SYMBOL = data.symbol;
    selectSymbol();
}


async function createOrderBookTable(){
    // ['bids', 'asks'].forEach(function (elm_id){
    //     document.getElementById(elm_id).innerHTML = "";
    // });
    let orderbook = await send_request('GET', `/perp/market/contract/${SELECTED_SYMBOL}/orderbook/`, {});
    let bids_count = orderbook.bids.length;
    let asks_count = orderbook.asks.length;
    let trs = ""
    for (let i = 0; i < bids_count + asks_count; i++) {
        let break_counter = 0;
        let tds = "";
        if (bids_count > i){
            tds += `<td>${formatNumber(orderbook.bids[i].size)}</td><td>${formatNumber(orderbook.bids[i].price)}</td>`;
        }else{
            tds += `<td></td><td></td>`;
            break_counter += 1;
        }

        if (asks_count > i){
            tds += `<td>${formatNumber(orderbook.asks[i].price)}</td><td>${formatNumber(orderbook.asks[i].size)}</td>`;
        }else{
            tds += `<td></td><td></td>`;
            break_counter += 1;
        }
        if (break_counter === 2){
            break
        } else {
            trs += `<tr>${tds}</tr>`;
        }
    } 
    let th = "<thead><th>size</th><th>bids</th><th>asks</th><th>size</th></thead>";
    document.getElementById('orderbook').innerHTML = th + trs;

}
async function setSymbolParams(){
    let data = await getContract(SELECTED_SYMBOL);
    SELECTED_SYMBOL_PARAMS = data;
    document.getElementById('symbol').value = SELECTED_SYMBOL;
    document.getElementById('quote').innerHTML = data['quote'];
    document.getElementById('price').step = data['tick_size'];
    document.getElementById('price').value = "";
    document.getElementById('size').step = data['lot_size'];
    document.getElementById('size').value = "";
    setWalletBalance();
}
function selectSymbol(){
    const url = new URL(window.location.href);
    url.searchParams.set('symbol', SELECTED_SYMBOL);
    window.history.pushState(null, '', url.toString());
    setSymbolParams();
    createOrderBookTable();
    setContractSetup();
}

async function setWalletBalance(){
    let response = await send_request('GET', `/perp/trader/wallet/`, {'token__ticker': SELECTED_SYMBOL_PARAMS['quote']}, true);
    let wallets = response['results'];
    let free_balance = "0";
    if (wallets.length > 0){
        free_balance = wallets[0]['free'];
    }
    document.getElementById('balance').value = free_balance;
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
        let contract_params = await getContract(selectedSymbol);
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

function showAccountPerpPreview(){
    let select = document.getElementById('account-preview');
    ['order-div', 'position-div'].forEach(function (elm_id){
        document.getElementById(elm_id).innerHTML = "";
    });
    if (select.value === 'positions'){  
        createPositionTable();
    }else if (select.value === 'open_orders'){
        createOrderTable('placed,received', true);
    }else if (select.value === 'orders_history'){
        createOrderTable('filled,canceled', false);
    }
}