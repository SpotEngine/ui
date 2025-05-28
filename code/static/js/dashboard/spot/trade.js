async function createTradeTable(){
    console.log('createTradeTable');
    let div = document.getElementById('trade-div');
    div.innerHTML = '<table id="trade-table" class="display" style="width:100%"></table>';
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
            data: 'quantity', 
            title: 'quantity',
            render: getPriceFormatter('quantity'),
        },
        { 
            data: 'price', 
            title: 'price',
            render: getPriceFormatter('price'),
        },
        { 
            data: 'paid_rebate', 
            title: 'rebate',
            render: function (data, type, full) {
                return `${formatNumber(full['paid_rebate'])} ${full['paid_token']}`
            }        
        },
        { 
            data: 'received_fee', 
            title: 'fee',
            render: function (data, type, full) {
                return `${formatNumber(full['received_fee'])} ${full['received_token']}`
            }        
        },
        { 
            title: 'time',
            render: function (data, type, full) {
                let t = new Date(full['ctime']);
                return t.toLocaleString()
            }        
        },
    ];
    let conf = await getBaseDataTableConf(`/spot/trader/trade/`, columns);
    let table = $('#trade-table').DataTable(conf);
}
