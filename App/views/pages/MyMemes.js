import * as Actions from  './../../services/Actions.js'


let MyMemes = {
    render: async () => {
        let view =  /*html*/`
<body>
    <main>
        <div id="content">
            <div id="search-container">
                <i class="fa fa-search search-icon"></i>
                <input id="search-input" placeholder="One step remains...">
            </div>
            <ol id='meme-container'></ol>

            <div id="add-meme-button-div">
                <a class="add-meme-button" href="/#/new">Add meme</a>
            </div>
        </div>
    </main>
</body>
        `
        return view
    },
    after_render: async () => {
        await Actions.getCurrentAuthState().then(function (email) {
                var ref = firebase.app().database().ref();
                var memesRef = ref.child('memes/');


                var query = memesRef.orderByChild('author').equalTo(email);
                Actions.getMemes(query)
                .then(function (memes) {
                    for (const meme of memes.reverse()) {
                        console.log(meme.picture)
                        document.getElementById("meme-container").appendChild(Actions.renderMeme(meme));

                        document.getElementById("like_btn_" + meme.id).addEventListener("click", () => {
                            event.preventDefault();
                            Actions.like(event.target.getAttribute("data-attr"));
                        });

                        document.getElementById("dislike_btn_" + meme.id).addEventListener("click", () => {
                            event.preventDefault();
                            Actions.dislike(event.target.getAttribute("data-attr"));
                        });

                        document.getElementById("report_btn_" + meme.id).addEventListener("click", () => {
                            event.preventDefault();
                            Actions.report(event.target.getAttribute("data-attr"));
                        });
                    }
                })
        }).catch(function (err) {
            alert("LOG IN FIRST!");
            window.location.href = '/#/login';
        }); 
    }
}

export default MyMemes;