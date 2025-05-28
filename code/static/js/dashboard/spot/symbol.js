async function createSymbol(){
    let params = {
        base: document.getElementById("base").value,
        quote: document.getElementById("quote").value.toUpperCase(),
        tick_size: document.getElementById("tick_size").value,
        lot_size: document.getElementById("lot_size").value,
    };
    let response = await send_request('POST', "/spot/trader/symbol/", params, true);
    if ('symbol' in response){
        console.log(response);
        alert("symbol created!")
        createMySymboltTable();
        // showSignals();
    }

}
async function getSymbol(symbol) {
    let params = await send_request('GET', `/spot/market/symbol/${symbol}/`, {})
    return params
}

async function createSymboltTable(onClickCallback, selectSymbol){
    let div = document.getElementById('symbol-div');
    div.innerHTML = '<table id="symbol-table" class="display" style="width:100%"></table>';
    let columns= [
        { 
            data: '-id', 
            title: 'id',
            visible: false,
            render: function (data, type, row, full) {
                if (SELECTED_SYMBOL === undefined){
                    // SELECTED_SYMBOL = row['symbol'];
                    SELECTED_SYMBOL = DEFAULT_SYMBOL;
                    selectSymbol();
                }
                return null
            }        
        },
        { 
            data: 'symbol', 
            title: 'symbol',
            orderable: true,
        },
        // { 
        //     data: 'quote', 
        //     title: 'quote',
        //     orderable: true,
        // },
    ];
    let conf = await getBaseDataTableConf(`/spot/market/symbol/`, columns, false);
    let table = $('#symbol-table').DataTable(conf);
    table.on('click', 'tr', function () {
        onClickCallback(table.row(this));
    } );

}


async function createMySymboltTable(){
    let div = document.getElementById('symbol-div');
    div.innerHTML = '<table id="symbol-table" class="display" style="width:100%"></table>';
    let columns= [
        // { 
        //     data: '-id', 
        //     title: 'id',
        //     visible: false,
        //     render: function (data, type, row, full) {
        //         if (SELECTED_SYMBOL === undefined){
        //             SELECTED_SYMBOL = row['symbol'];
        //             selectSymbol();
        //         }
        //         return null
        //     }        
        // },
        { 
            data: 'symbol', 
            title: 'symbol',
            orderable: true,
        },
        { 
            data: 'base', 
            title: 'base',
            orderable: true,
        },
        { 
            data: 'quote', 
            title: 'quote',
            orderable: true,
        },
        { 
            data: 'tick_size', 
            title: 'tick',
            orderable: false,
        },
        { 
            data: 'lot_size', 
            title: 'lot',
            orderable: false,
        },
    ];
    let conf = await getBaseDataTableConf(`/spot/trader/symbol/`, columns, true);
    let table = $('#symbol-table').DataTable(conf);
}


