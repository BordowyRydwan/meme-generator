const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const topCaptionInput = document.querySelector('#topCaption');
const bottomCaptionInput = document.querySelector('#bottomCaption');
const linkInput = document.querySelector('#linkInput');
const downloadButton = document.querySelector('#download');

const memeInfo = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    return {
        width: canvas.width,
        height: canvas.height,
        topCaption: topCaptionInput.value,
        bottomCaption: bottomCaptionInput.value,
        URL: linkInput.value,
    }
};

const downloadImage = () => {
    const img = canvas.toDataURL("image/jpg");
    downloadButton.href = img;
};

const canvasRender = () => {
    let meme = memeInfo();
    let img = new Image();

    img.src = meme.URL;

    context.drawImage(img, 0, 0);

    context.font = "20px Impact";
    context.textAlign = "center";

    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.strokeText(meme.topCaption, meme.width/2, 25);

    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.fillText(meme.topCaption, meme.width/2, 25);

    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.strokeText(meme.bottomCaption, meme.width/2, meme.height - 10);

    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.fillText(meme.bottomCaption, meme.width/2, meme.height - 10);
};

topCaptionInput.addEventListener('keyup', canvasRender, false);
bottomCaptionInput.addEventListener('keyup', canvasRender, false);
linkInput.addEventListener('keyup', canvasRender, false);

downloadButton.addEventListener('click', downloadImage, false);