const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
const pageLength = 20;
let userWalletAddress;
let chainId;

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{([0-9]+)}/g, function (match, index) {
      return typeof args[index] == 'undefined' ? match : args[index];
    });
};
function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}
  


function get_url(endpoint){
    return API_HOST + '/api/v1' + endpoint
}
function signout(){
    remove_token();
    window.location = '/connect';
}
function getToken(){
    return localStorage.getItem('token');
}
function set_token(token){
    localStorage.setItem('token', token);
    console.log(token);
}
function remove_token(){
    localStorage.removeItem('token');
}

function get_headers(auth){
    headers = {
        'Content-Type':	'application/json',
    }
    if (auth){
        let token = getToken();
        headers['Authorization'] = "Bearer " + token;
    }
    return headers
}

async function send_request(method, endpoint, params={}, auth=false, non_fields_error_div_id='non_fields_error_div'){
    let non_fields_error_div = document.getElementById(non_fields_error_div_id);
    if (non_fields_error_div){
        non_fields_error_div.innerText = '';
        non_fields_error_div.style.display = 'none';    
    }
    method = method.toUpperCase();

    
    let fetch_params = {
        method: method,
        headers: get_headers(auth),
    };

    if (method == 'GET'){
        endpoint += "?" + new URLSearchParams(params);
    }else {
        fetch_params['body'] = JSON.stringify(params)
    }

    let url = get_url(endpoint);
    let response = await fetch(url, fetch_params)
    let status_code = response.status;
    let result = {};
    if (status_code == 401){
        window.location = LOGIN_URL;
        // let signin_success = await signin();
        // if (signin_success){
        //     return await send_request(method, endpoint, params, non_fields_error_div_id)
        // }
    } else if (status_code == 500) {
        
    } else if (status_code == 204) {
        result = true;
    } else if ([200, 201, 400].indexOf(status_code) >= 0){
        result = await response.json()
        if (status_code == 400) {
            handle400errors(result, non_fields_error_div);
        }
    } else {

    }
    return result
}

function handle400errors(errors, non_fields_error_div){
    let validationKey = 'validation';
    let keys = Object.keys(errors);
    keys.forEach(function (key) {
        let value = errors[key];
        let elm = document.getElementById(key);
        if (elm){
            let validation_div_id = validationKey + '-' + key;
            let validation = document.getElementById(validation_div_id);
            if (validation === null){
                validation = document.createElement('div');
                validation.id = validationKey + '-' + key;
            }
            validation.classList.add("invalid-feedback");
            validation.innerText = Array.isArray(value) ? value.join('\n') : value;
            elm.classList.add("is-invalid");
            elm.after(validation);
            elm.addEventListener('change', function (_){
                this.classList.remove('is-invalid');
                validation.remove();
            });
        } else if (value.length > 0){
            // let non_fields_error_div = document.getElementById(non_fields_error_div_id);
            let errors = Array.isArray(value) ? value.join('\n') : value;
            if (non_fields_error_div){
                non_fields_error_div.innerText = errors;
                non_fields_error_div.style.display = 'block';    
            }else{
                alert(errors);
            }
        }
    });
}

function getBaseDataTableConf(endpoint, columns, auth=true){
    let baseDataTableConf = {
        paging: true,
        processing: true,
        serverSide: true,
        ajax: {
            url: get_url(endpoint),
            dataSrc: 'results',
            headers: get_headers(auth),
            dataFilter: function (data){
                response = JSON.parse(data)
                response.recordsTotal = response.count;
                response.recordsFiltered = response.count;
                return JSON.stringify(response);
            },
            data: function(data){
                let query = {
                    page: data['start'] + 1,
                }
                let search = data['search']['value'];
                if (search){
                    query['search'] = search;
                }
                let ordering = data['order'];
                if (ordering){
                    let orderingInfo = ordering[0];
                    let column = data['columns'][orderingInfo['column']]['data'];
                    let is_asc = orderingInfo['dir'] === 'asc';
                    query['ordering'] = `${is_asc? '': '-'}${column}`
                }
                // console.log(query);
                return query
            },
            error: function (xhr, error, code) {
                if (code === 'Unauthorized'){
                    console.log('Unauthorized')
                    window.location = LOGIN_URL;
                }
            }    
        }, 
        // initComplete: function () {
        //     console.log('page');  
        // },
        deferRender: true,
        searching: true,
        lengthChange: false,
        fixedColumns: true,
        pageLength: pageLength,
        columnDefs: [
            { orderable: false, className: 'capitalizeTitle', targets: '_all' }
        ],
        columns: columns,
    }
    
    return baseDataTableConf
}

// function getPriceFormatter(precision=10, prefix=''){
//     return DataTable.render.number( ',', '.', precision, prefix)
//     // return DataTable.render.number( ',', '.')
// }
function getPriceFormatter(key, prefix='') {
    return (data, type, row, full) => formatNumber(row[key])
}
function formatNumber(number){
    return Number(number).toLocaleString('en-US', 
        {
            // style: "currency", 
            // currency: "USD", 
            maximumFractionDigits:20
        }
    )
}
function uid4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }
  