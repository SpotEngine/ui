async function createContract(){
    let params = {
        base: document.getElementById("base").value,
        quote: document.getElementById("quote").value.toUpperCase(),
        tick_size: document.getElementById("tick_size").value,
        lot_size: document.getElementById("lot_size").value,
        max_size: document.getElementById("max_size").value,
    };
    let response = await send_request('POST', "/perp/trader/contract/", params, true);
    if ('base' in response){
        console.log(response);
        alert("Contract created!")
        // showSignals();
    }

}
async function getContract(symbol) {
    let params = await send_request('GET', `/perp/market/contract/${symbol}/`, {})
    return params
}

async function createContractTable(onClickCallback, selectSymbol){
    let div = document.getElementById('contract-div');
    div.innerHTML = '<table id="contract-table" class="display" style="width:100%"></table>';
    let columns= [
        { 
            data: '-id', 
            title: 'id',
            visible: false,
            render: function (data, type, row, full) {
                if (SELECTED_SYMBOL === undefined){
                    SELECTED_SYMBOL = row['symbol'];
                    selectSymbol();
                }
                return null
            }        
        },
        { 
            data: 'symbol', 
            title: 'contract',
            orderable: true,
        },
        // { 
        //     data: 'quote', 
        //     title: 'quote',
        //     orderable: true,
        // },
    ];
    let conf = await getBaseDataTableConf(`/perp/market/contract/`, columns, false);
    let table = $('#contract-table').DataTable(conf);
    table.on('click', 'tr', function () {
        onClickCallback(table.row(this));
    } );

}

async function changeContractSetup(){
    let params = {
        leverage: document.getElementById("leverage").value,
    };
    let response = await send_request('PATCH',`/perp/trader/setup/${SELECTED_SYMBOL}/`, params, true);
    if ('contract' in response){
        alert("Leverage updated!")
        return true
    }else{
        return false
    }
}

async function setContractSetup(){
    let response = await send_request('GET',`/perp/trader/setup/${SELECTED_SYMBOL}/`, {}, true);
    if ('contract' in response){
        document.getElementById("leverage").value = response['leverage'];
        return true
    }else{
        return false
    }
}
