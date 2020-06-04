import * as Utils from  './../../services/Utils.js'


let MyMemes = {
    render: async () => {
        let view =  /*html*/`
        <body>
            <main>
                <div id="content">
                    <ol id='meme-container'>
                    <article class="meme-ghost">
                        <div class="meme-head">
                            <h1 class="meme-name-ghost"></h1>
                            <button class="button-ghost"></button>
                        </div>
                        <p class="meme-text-ghost"></p>
                    </article>
                    <article class="meme-ghost">
                        <div class="meme-head">
                            <h1 class="meme-name-ghost"></h1>
                            <button class="button-ghost"></button>
                        </div>
                        <p class="meme-text-ghost"></p>
                    </article>
                    <article class="meme-ghost">
                        <div class="meme-head">
                            <h1 class="meme-name-ghost"></h1>
                            <button class="button-ghost"></button>
                        </div>
                        <p class="meme-text-ghost"></p>
                    </article>
                    <article class="meme-ghost">
                        <div class="meme-head">
                            <h1 class="meme-name-ghost"></h1>
                            <button class="button-ghost"></button>
                        </div>
                        <p class="meme-text-ghost"></p>
                    </article>
                    <article class="meme-ghost">
                        <div class="meme-head">
                            <h1 class="meme-name-ghost"></h1>
                            <button class="button-ghost"></button>
                        </div>
                        <p class="meme-text-ghost"></p>
                    </article>
                    <article class="meme-ghost">
                        <div class="meme-head">
                            <h1 class="meme-name-ghost"></h1>
                            <button class="button-ghost"></button>
                        </div>
                        <p class="meme-text-ghost"></p>
                    </article>
                </ol>

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
        await Utils.getCurrentAuthState().then(function (email) {
                var ref = firebase.app().database().ref();
                var memesRef = ref.child('memes/');


                var query = memesRef.orderByChild('author').equalTo(email);
                Utils.getMemes(query)
                .then(function (memes) {
                    document.getElementById("meme-container").innerHTML = ""
                    for (const meme of memes.reverse()) {
                        console.log(meme.picture)
                        document.getElementById("meme-container").appendChild(Utils.renderMeme(meme));

                        document.getElementById("like_" + meme.id).addEventListener("click", () => {
                            event.preventDefault();
                            Utils.like(event.target.getAttribute("data-attr"));
                        });

                        document.getElementById("dislike_" + meme.id).addEventListener("click", () => {
                            event.preventDefault();
                            Utils.dislike(event.target.getAttribute("data-attr"));
                        });

                        document.getElementById("report_" + meme.id).addEventListener("click", () => {
                            event.preventDefault();
                            Utils.report(event.target.getAttribute("data-attr"));
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