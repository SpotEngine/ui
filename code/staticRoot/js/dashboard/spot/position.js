function createPositionTable(onClickCallback){
    let div = document.getElementById('position-div');
    div.innerHTML = '<table id="position-table" class="display" style="width:100%"></table>';
    let columns= [
        { 
            data: '-id', 
            title: 'id',
            visible: false,
            render: function (data, type, full) {
                return null
            }        
        },
        { 
            data: 'contract', 
            title: 'contract',
        },
        { 
            data: 'direction', 
            title: 'direction',
        },
        { 
            data: 'entry_price', 
            title: 'entry price',
            render: getPriceFormatter(10),
        },
        { 
            data: 'size', 
            title: 'size',
            render: getPriceFormatter(10),
        },
        { 
            data: 'leverage', 
            title: 'leverage',
        },
        { 
            data: 'liquidation_price', 
            title: 'liquidation',
        },
        { 
            data: 'margin', 
            title: 'margin',
        },
        { 
            data: 'margin_amount', 
            title: 'margin_amount',
        },
        // {
        //     title: 'action',
        //     render: function (data, type, row, meta) {
        //         return `<button class="btn btn-outline-danger btn-sm" onclick=closePosition(${JSON.stringify(row)})>close</button>`;
        //     }
        // },
    ];
    let conf = getBaseDataTableConf(`/perp/trader/position/`, columns, true);
    let table = $('#position-table').DataTable(conf);
}

async function closePosition(position){
    // console.log(raw_position);
    // let position = JSON.parse(raw_position);
    let params = {
        contract: position.contract,
        client_order_id: uid4(),
        direction: position.direction === 'long'? 'short': 'long',
        size: position.size,
    };
    console.log(params);
    let endpoint = '/perp/trader/order/market/reduce/';
    let response = await send_request('POST', endpoint, params, true);
    if ('id' in response){
        console.log(response);
        // showSignals();
    }    
}