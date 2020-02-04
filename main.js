const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const topCaptionInput = document.querySelector('#topCaption');
const bottomCaptionInput = document.querySelector('#bottomCaption');
const imageInput = document.querySelector('#imageFile');
const downloadButton = document.querySelector('#download');

let meme = {
    width: canvas.height,
    height: canvas.width,
    topCaption: '', 
    bottomCaption: '',
};

let image = new Image();

const downloadImage = () => {
    downloadButton.href = canvas.toDataURL("image/jpeg");
};

const canvasImageRender = () => {

    image.addEventListener("load", () => {
        context.drawImage(image, 0, 0, meme.width, meme.height);
    }, false);

    if(imageInput.files && imageInput.files[0]){
        let reader = new FileReader();

        reader.addEventListener("load", e => {
            image.src = e.target.result;
        })

        reader.readAsDataURL(imageInput.files[0]);
    }

    image.src = meme.src;

    canvasTextRender();
};

const canvasTextRender = () => {
    context.clearRect(0, 0, meme.width, meme.height);

    context.drawImage(image, 0, 0, meme.width, meme.height);

    meme.topCaption = topCaptionInput.value;
    meme.bottomCaption = bottomCaptionInput.value;

    context.font = "20px Anton";
    context.textAlign = "center";
    context.lineWidth = 3;

    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.strokeText(meme.topCaption, meme.width/2, 25);

    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.fillText(meme.topCaption, meme.width/2, 25);

    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.strokeText(meme.bottomCaption, meme.width/2, meme.height - 10);

    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.fillText(meme.bottomCaption, meme.width/2, meme.height - 10);
};

topCaptionInput.addEventListener("keyup", canvasTextRender, false);
bottomCaptionInput.addEventListener("keyup", canvasTextRender, false);
imageInput.addEventListener("change", canvasImageRender, false);

downloadButton.addEventListener("click", downloadImage, false);