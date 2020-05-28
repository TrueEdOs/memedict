let SignUp = {
    render: async () => {
        let view =  /*html*/`
    <body>
        <main>
            <div id="content">
                    <i class="fa fa-search search-icon"></i>
                    <input id="search-input" placeholder="One step remains...">
                </div>
                <section id="auth-section">
                        <label class="center-header" id="email-helper" for="login-enter">Your email</label>
                        <input class="info-input" id="email-enter" placeholder="Email...">
                        <label class="center-header" id="password-helper" for="password-enter">Password</label>
                        <input type="password" class="info-input" id="password-enter" placeholder="Use qwertyui...">
                        <label class="center-header" id="repeat-password-helper" >Repeat password</label>
                        <input type="password" class="info-input" id="repeat-password-enter" placeholder="Repeat qwertyui...">
                        
                        <button id="login-submit" class="red-button">Register</button> 
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
            let password = document.getElementById("password-enter");
            let repeat = document.getElementById("repeat-password-enter");

            if (password.value !== repeat.value) {
                alert (`Passwords don't match!`)
            } else if (email.value ==='' | password.value === '' | repeat === '') {
                alert (`Fields can't be empty!`)
            } 
            else {
                firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
                    .then(function(firebaseUser) {
                        alert(`User with email ${email.value} was successfully submitted!`)
                        window.location.href = '/#/';
                    })
                    .catch(function (err) {
                        alert(err.message)
                    });
            }    
        })
    }
}

export default SignUp;