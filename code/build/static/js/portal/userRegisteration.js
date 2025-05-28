function setToken(token){
    // let token = btoa(text);
    window.localStorage.setItem('token', token);
}
async function register(redirect_url){
    let params = {
        "password": document.getElementById("password").value,
        "username": document.getElementById("username").value,
        "email": document.getElementById("email").value,
        "password_confirm": document.getElementById("password_confirm").value,
    };
    let response = await send_request('POST', '/auth/trader/register/', params);
    if ('id' in response){
        window.location = redirect_url;
    }
}  

async function login(redirect_url){
    let params = {
        "password": document.getElementById("password").value,
        "username": document.getElementById("username").value,
    };

    let response = await send_request('POST', '/auth/trader/token/', params,);
    if ('access' in response){
        setToken(response['access']);
        window.location = redirect_url;    
    }
}  