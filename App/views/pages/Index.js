import * as Utils from  './../../services/Utils.js'


let Index = {
    render: async () => {
        let view =  /*html*/`
        <body>
            <main>
                <div id="content">
                    <div id="search-container">
                        <ol id="predict-block"></ol>
                        <i class="fa fa-search search-icon"></i>
                        <input id="search-input" placeholder="One step remains...">
                    </div>
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
        var ref = firebase.app().database().ref();
        var memesRef = ref.child('memes/');
        var currentUser = firebase.auth().currentUser;
        var query = memesRef.orderByChild('timestamp');

        const searchbar = document.getElementById("search-input");

        var allmemes = null;

        searchbar.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.location.href = "/#/search/" + searchbar.value;
            } else {
                if (allmemes != null) {
                    document.getElementById("predict-block").innerHTML = ""
                    var len = searchbar.value.length
                    if (len > 0) {
                        var count = 3;
                        for (const meme of allmemes) {
                            if (meme.name.substring(0, len) == searchbar.value) {
                                count--
                                document.getElementById("predict-block").appendChild(Utils.renderPredict(meme))
                                if (count == 0) {
                                    break
                                }
                            }
                        }
                    }
                }
            }
        });

        Utils.getMemes(query)
        .then(function (memes) {
            allmemes = memes;
            document.getElementById("meme-container").innerHTML = ""

            var specialMeme = memes[Math.floor(Math.random()*memes.length)];
            document.getElementById("meme-container").appendChild(Utils.renderSpecialMeme(specialMeme));
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
    }
}

export default Index;