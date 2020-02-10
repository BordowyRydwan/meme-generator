const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const topCaptionInput = document.querySelector('#topCaption');
const bottomCaptionInput = document.querySelector('#bottomCaption');
const imageInput = document.querySelector('#imageFile');
const downloadButton = document.querySelector('#download');

canvas.height = 300;
canvas.width = 300;

canvas.style.width = 300;
canvas.style.height = 300;

let meme = {
    width: canvas.width,
    height: canvas.height,
    topCaption: '', 
    bottomCaption: '',
};

let image = new Image();

const textWrap = (text, isTop) => {
    const lineHeight = 30;
    const maxLineWidth = canvas.width - 20;

    if(isTop){
        yPos = 25;
    } else{
        yPos = meme.height - 10;
    }

    let words = text.slice(' ');
    let line = '';
    let n = 0;

    for(let i = 0; i < words.length; ++i){

        line += words[i];

        const lineWidth = context.measureText(line).width - n*meme.width;

        if(lineWidth > maxLineWidth){
            line += 'space';
            n += 1;
        };
    }

    let lines = line.split('space');

    lines = isTop ? lines : lines.reverse();

    lines.forEach(textLine => {

        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.strokeText(textLine, meme.width/2, yPos);

        context.fillStyle = "rgba(255, 255, 255, 1.0)";
        context.fillText(textLine, meme.width/2, yPos);

        isTop ? yPos += lineHeight : yPos -= lineHeight;
    
    });
}

const downloadImage = () => {
    downloadButton.href = canvas.toDataURL("image/jpeg");
};

const resizeImage = (height, width) => {
    let maxCanvasSize = 300;
    const zoom = Math.max(height, width) / maxCanvasSize;

    if(height > width){
        height = maxCanvasSize;
        width /= zoom;
    } else{
        width = maxCanvasSize;
        height /= zoom;
    };

    return {
        x: width,
        y: height
    };
};

const canvasImageRender = () => {
    image = new Image();

    if(imageInput.files && imageInput.files[0]){
        let reader = new FileReader();

        reader.addEventListener("load", e => {
            image.src = e.target.result;
        })

        reader.readAsDataURL(imageInput.files[0]);
    }

    image.addEventListener("load", e => {
        const currentImage = e.target;

        const size = resizeImage(currentImage.height, currentImage.width);

        currentImage.width = size.x;
        currentImage.height = size.y;

        meme.width = size.x;
        meme.height = size.y;
    
        canvas.height = size.y;
        canvas.width = size.x;

        /*canvas.style.width = meme.width;
        canvas.style.height = meme.height;*/

        context.drawImage(currentImage, 0, 0, meme.width, meme.height);
    }, false);

    canvasTextRender();
};

const canvasTextRender = () => {
    const fontSize = 20;

    context.clearRect(0, 0, meme.width, meme.height);
    context.drawImage(image, 0, 0, meme.width, meme.height);

    meme.topCaption = topCaptionInput.value;
    meme.bottomCaption = bottomCaptionInput.value;

    context.font = `${fontSize}px Anton`;
    context.textAlign = "center";
    context.lineWidth = 5;

    textWrap(meme.topCaption, true);
    textWrap(meme.bottomCaption, false);
};

topCaptionInput.addEventListener("keyup", canvasTextRender, false);
bottomCaptionInput.addEventListener("keyup", canvasTextRender, false);
imageInput.addEventListener("change", canvasImageRender, false);
imageInput.addEventListener("change", canvasTextRender, false);

downloadButton.addEventListener("click", downloadImage, false);