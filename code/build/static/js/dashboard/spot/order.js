async function createOrder(client_order_id){
    let endpoint;
    let order_type = document.getElementById("type").value;
    let params = {
        symbol: SELECTED_SYMBOL,
        client_order_id: client_order_id,
        side: document.getElementById("side").value,
        quantity: document.getElementById("quantity").value,
        fee_rebate: document.getElementById("fee_rebate").value,
    };
    if (order_type === 'limit'){
        endpoint = '/spot/trader/order/limit/';
        params['price'] = document.getElementById("price").value;
    }else {
        endpoint = '/spot/trader/order/market/reduce/';
    }
    let response = await send_request('POST', endpoint, params, true);
    console.log(response);
    if ('id' in response){
        afterOrderEvent();
    }
}  

function afterOrderEvent(){
    setWalletBalance();
    showAccountSpotPreview();
    createOrderBookTable();
}
async function cancelOrder(order_id){
    let endpoint = `/spot/trader/order/${order_id}/`;
    let response = await send_request('DELETE', endpoint, {}, true);
    console.log(response);
    if (response){
        afterOrderEvent()
    }
}  
function createOrderTable(status, cancelable){
    let div = document.getElementById('order-div');
    div.innerHTML = '<table id="order-table" class="display" style="width:100%"></table>';
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
            data: 'symbol', 
            title: 'symbol',
            // orderable: true,
        },
        { 
            data: 'side', 
            title: 'side',
            // orderable: true,
        },
        { 
            data: 'type', 
            title: 'type',
            // orderable: true,
        },
        { 
            data: 'price', 
            title: 'price',
            render: getPriceFormatter('price'),
        },
        { 
            data: 'quantity', 
            title: 'quantity',
            render: getPriceFormatter('quantity'),
        },
        { 
            data: 'fee_rebate', 
            title: 'fee',
            render: getPriceFormatter('fee_rebate'),
        },
        { 
            data: 'status', 
            title: 'status',
        },
    ];
    if (cancelable){
        columns.push({ 
            title: 'action',
            render: function (data, type, row, meta) {
                return `<button class="btn btn-outline-danger btn-sm" onclick=cancelOrder(${row['id']})>cancel</button>`;
            }
        });
    }
    let conf = getBaseDataTableConf(`/spot/trader/order/?status=${status}`, columns);
    let table = $('#order-table').DataTable(conf);
}
