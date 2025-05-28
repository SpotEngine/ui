async function createOrder(client_order_id){
    let endpoint;
    let order_type = document.getElementById("type").value;
    let params = {
        contract: SELECTED_SYMBOL,
        client_order_id: client_order_id,
        direction: document.getElementById("direction").value,
        size: document.getElementById("size").value,
    };
    if (order_type === 'limit'){
        endpoint = '/perp/trader/order/limit/';
        params['price'] = document.getElementById("price").value;
    }else {
        endpoint = '/perp/trader/order/market/reduce/';
    }
    let response = await send_request('POST', endpoint, params, true);
    if ('id' in response){
        // console.log(response);
        // showSignals();
    }
}  
async function cancelOrder(order_id){
    let endpoint = `/perp/trader/order/${order_id}/`;
    let response = await send_request('DELETE', endpoint, {}, true);
    console.log(response);
}  
async function createOrderTable(status, cancelable){
    let div = document.getElementById('order-div');
    div.innerHTML = '<table id="order-table" class="display" style="width:100%"></table>';
    let columns= [
        { 
            data: '-id', 
            title: 'id',
            visible: false,
            render: function (data, type, row, full) {
                return null
            }        
        },
        { 
            data: 'contract', 
            title: 'contract',
            // orderable: true,
        },
        { 
            data: 'direction', 
            title: 'direction',
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
            data: 'size', 
            title: 'size',
            render: getPriceFormatter('size'),
        },
        { 
            data: 'status', 
            title: 'status',
        },
        // { 
        //     data: 'tp', 
        //     title: 'tp',
        //     orderable: true,
        //     render: getPriceFormatter(10),
        // },
    ];
    if (cancelable){
        columns.push({ 
            title: 'action',
            render: function (data, type, row, full) {
                console.log(data, type, row, full);
                return `<button class="btn btn-outline-danger btn-sm" onclick=cancelOrder(${row['id']})>cancel</button>`;
            }
        });
    }
    let conf = await getBaseDataTableConf(`/perp/trader/order/?status=${status}`, columns);
    let table = $('#order-table').DataTable(conf);
}
