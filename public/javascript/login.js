//create event listener from login.handlebars
async function loginFormHandler(event) {
    event.preventDefault();
  
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {
        //new request to /api/users/login
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            //console.log('success')
            document.location.replace('/');
        } else {
            alert(response.statusText);
        }
    }
}

//create event listener from login.handlebars
//add async/await it makes the code more readable no need of then or catch 
async function signupFormHandler(event) {
    event.preventDefault();
    //create the user in a POST method using the login.handlebars page
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    
    //await fetch('/api/users', { //assign the result into a variable
    if (username && email && password) {
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        })//.then((response) => {console.log(response)})//no need of "then" bc of async/await
        //check response status
        if(response.ok){
            console.log('success');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
