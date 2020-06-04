let Header = {
    render: async () => {
        let view =  /*html*/`
        <body>
            <header>
                <div id="header-titles">
                    <h1 id="main-header">MEMEDICT</h1>
                    <h2 id="main-sub-header">ミームでは信頼する</h2>
                </div>
                <nav class="header-buttons-nav">
                    <a class="header-button" href="/#/">All memes</a>
                    <a class="header-button" href="/#/my">My memes</a>
                    <a class="header-button" id="login" href="/#/login">Enter heaven</a>
                    <a class="header-button hide" id="logout" href="/#/">Leave heaven</a>
                </nav>
            </header>
        </body>
        `
        return view
    },
    after_render: async () => {

        const login = document.getElementById("login");
        const logout = document.getElementById("logout");

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser){
                login.classList.add('hide');
                logout.classList.remove('hide');

            }else{
                login.classList.remove('hide');
                logout.classList.add('hide');
            }
        });
        
        logout.addEventListener ("click",  () => {
            firebase.auth().signOut()
                    .then(function(firebaseUser) {
                        alert(`THAT WAS A MISTAKE`);
                    })
                    .catch(function(err) {
                        console.log(err.message)
                    })
        })
    }
}

export default Header;