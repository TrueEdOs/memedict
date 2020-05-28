import * as Actions from  './../../services/Actions.js'

let AddMeme = {
    render: async () => {
        let view =  /*html*/`
    <body>
        <main>
            <div id="content">
                <section id="new-meme-section">
                    <div id="new-meme-section-inner">
                        <label class="new-meme-h" for="new-meme-name">Meme name</label>
                        <input id="new-meme-name" placeholder="Mememememe...">
                        <label class="new-meme-h" for="new-meme-description">Description</label>
                        <textarea id="new-meme-description" cols="40" rows="5"></textarea>
                        <div id="picture-load">
                            <canvas id="preview" style="display: none;"></canvas>
                            <label class="picture-load-button" id="upload-file-button-label">Load picture
                                <input type='file' id="upload-file-button">
                            </label>
                            
                            <p id="picture-load-link" href="">picture link</p>
                        </div>
                        <pre id="ascii"></pre>
                        <button id="new-meme-submit">Submit</button>
                    <div>
                </section>
            </div>
        </main>
    </body>
        `
        return view
    },
    after_render: async () => {
        await Actions.getCurrentAuthState().then(function (email) {
            const canvas = document.getElementById('preview');
            const fileInput = document.getElementById('upload-file-button');
            const asciiImage = document.getElementById('ascii');
            
            const context = canvas.getContext('2d');
            
            const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;
            
            const getFontRatio = () => {
                const pre = document.createElement('pre');
                pre.style.display = 'inline';
                pre.textContent = ' ';
            
                document.body.appendChild(pre);
                const { width, height } = pre.getBoundingClientRect();
                document.body.removeChild(pre);
            
                return height / width;
            };
            
            const fontRatio = getFontRatio();
            
            const convertToGrayScales = (context, width, height) => {
                const imageData = context.getImageData(0, 0, width, height);
            
                const grayScales = [];
            
                for (let i = 0 ; i < imageData.data.length ; i += 4) {
                    const r = imageData.data[i];
                    const g = imageData.data[i + 1];
                    const b = imageData.data[i + 2];
            
                    const grayScale = toGrayScale(r, g, b);
                    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;
            
                    grayScales.push(grayScale);
                }
            
                context.putImageData(imageData, 0, 0);
            
                return grayScales;
            };
            
            const MAXIMUM_WIDTH = 40;
            const MAXIMUM_HEIGHT = 40;
            const clampDimensions = (width, height) => {
                const rectifiedWidth = Math.floor(getFontRatio() * width);
            
                if (height > MAXIMUM_HEIGHT) {
                    const reducedWidth = Math.floor(rectifiedWidth * MAXIMUM_HEIGHT / height);
                    return [reducedWidth, MAXIMUM_HEIGHT];
                }
            
                if (width > MAXIMUM_WIDTH) {
                    const reducedHeight = Math.floor(height * MAXIMUM_WIDTH / rectifiedWidth);
                    return [MAXIMUM_WIDTH, reducedHeight];
                }
            
                return [rectifiedWidth, height];
            };
            
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
            
                const reader = new FileReader();
                reader.onload = (event) => {
                    const image = new Image();
                    image.onload = () => {
                        const [width, height] = clampDimensions(image.width, image.height);
            
                        canvas.width = width;
                        canvas.height = height;
            
                        context.drawImage(image, 0, 0, width, height);
                        const grayScales = convertToGrayScales(context, width, height);
            
                        fileInput.style.display = 'none';
                        drawAscii(grayScales, width);
                    }
            
                    image.src = event.target.result;
                };
            
                reader.readAsDataURL(file);
            };
            
            const grayRamp = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~i!lI;:,"^`\'. ';
            const rampLength = grayRamp.length;
            
            const getCharacterForGrayScale = grayScale => grayRamp[Math.ceil((rampLength - 1) * grayScale / 255)];
            
            const drawAscii = (grayScales, width) => {
                const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
                    let nextChars = getCharacterForGrayScale(grayScale);
                    if ((index + 1) % width === 0) {
                        nextChars += '\n';
                    }
            
                    return asciiImage + nextChars;
                }, '');
                asciiImage.textContent = ascii;
            };

            document.getElementById("new-meme-submit").addEventListener("click", () => {
                let memeName = document.getElementById("new-meme-name");
                let description = document.getElementById("new-meme-description");
                let picture = asciiImage.textContent;
                if (memeName.value === '' | description.value === '') {
                    alert(`Fields can't be empty!`)
                } else {
                    var database = firebase.database();
                    var modEmail = email.replace(/\./g, '_');
                    database.ref('memes/' + memeName.value + "_by_" + modEmail).set({
                        name: memeName.value.toLowerCase(),
                        description: description.value,
                        picture: picture,
                        author: email,
                        rating: 0,
                        liked: [""],
                        disliked: [""],
                        timestamp: Date.now()
                    })
                    window.location.href = '/#/';
                }
            });
        }).catch(function (err) {
                alert("LOG IN FIRST!");
                window.location.href = '/#/login';
        });
    }
}

export default AddMeme;