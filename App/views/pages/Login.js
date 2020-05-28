let Login = {
    render: async () => {
        let view =  /*html*/`
        <body>
    
        <main>
            <div id="content">
                <section id="auth-section">
                    <label class="center-header" id="email-helper" for="email-enter">Nickname</label>
                    <input class="info-input" id="email-enter" placeholder="Choose wisely...">
                    <label class="center-header" id="password-helper" for="password-enter">Password</label>
                    <input type="password" class="info-input" id="password-enter" placeholder="Use qwertyui...">
                    <a id="reg-link" href="/#/sign-up">First time? Register!</a>
                    <button id="login-submit" class="red-button">Login</button> 
                </section>
            </div>
        </main>
    </body>
        `
        return view
    },
    after_render: async () => {
        document.getElementById("login-submit").addEventListener ("click",  () => {
            event.preventDefault();
            let email = document.getElementById("email-enter");
            let pass  = document.getElementById("password-enter");
             if (email.value ==='' | pass.value === '' ) {
                alert (`Fields can't be empty`)
            }   
            else {
                firebase.auth().signInWithEmailAndPassword(email.value, pass.value)
                    .then(function(firebaseUser) {
                        alert(`User with email ${email.value} was successfully logged in!`)
                        window.location.href = '/#/';
                    })
                    .catch(function(err) {
                       alert(err.message);
                    })
            }
        })
    }
}

export default Login;