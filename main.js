const canvas = document.querySelector('canvas'),
      context = canvas.getContext('2d'),

      topCaptionInput = document.querySelector('#topCaption'),
      bottomCaptionInput = document.querySelector('#bottomCaption'),
      imageInput = document.querySelector('#imageFile'),
      downloadButton = document.querySelector('#download');

canvas.height = 300;
canvas.width = 300;

let meme = {
    width: canvas.width,
    height: canvas.height,
    topCaption: '', 
    bottomCaption: ''
};

let image = new Image();

const printWrappedText = (text, isTop) => {

    const maxLineWidth = canvas.width - 20;
    const fontSize = canvas.height / 15;
    const lineHeight = fontSize * 1.5;
    const frameWidth = 0.10 * fontSize; 
    let yPos;

    if(isTop){
        yPos = fontSize * 1.25;
    } else{
        yPos = meme.height - fontSize * 0.5;
    }

    let words = text.slice(' ');
    let line = '';
    let numberOfLines = 0;

    for(let i = 0; i < words.length; ++i){

        line += words[i];

        const lineWidth = context.measureText(line).width - numberOfLines * meme.width;

        if(lineWidth > maxLineWidth){
            line += '\n';
            numberOfLines += 1;
        };
    }

    let lines = [...line.split('\n')];

    if(!isTop){
        lines = [...lines.reverse()];
    }

    context.font = `${fontSize}px Anton`;
    context.lineWidth = frameWidth;

    lines.forEach(textLine => {

        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.strokeText(textLine, meme.width/2, yPos);

        context.fillStyle = "rgba(255, 255, 255, 1.0)";
        context.fillText(textLine, meme.width/2, yPos);

        if(isTop){
            yPos += lineHeight;
        } else{
            yPos -= lineHeight;
        }
    
    });
}

const downloadImage = () => {
    downloadButton.href = canvas.toDataURL("image/jpeg");
};

const resizeImage = (height, width) => {
    let maxCanvasSize = Math.min(window.innerHeight - 50, window.innerWidth - 50);
    
    if(height < maxCanvasSize && width < maxCanvasSize){
        maxCanvasSize = Math.max(height, width);
    }

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
    
        canvas.width = size.x;
        canvas.height = size.y;

        context.drawImage(currentImage, 0, 0, meme.width, meme.height);
    }, false);

    canvasTextRender();
};

const canvasTextRender = () => {

    context.clearRect(0, 0, meme.width, meme.height);
    context.drawImage(image, 0, 0, meme.width, meme.height);

    meme.topCaption = topCaptionInput.value;
    meme.bottomCaption = bottomCaptionInput.value;

    context.textAlign = "center";

    printWrappedText(meme.topCaption, true);
    printWrappedText(meme.bottomCaption, false);
};

topCaptionInput.addEventListener("keyup", canvasTextRender, false);
bottomCaptionInput.addEventListener("keyup", canvasTextRender, false);
imageInput.addEventListener("change", canvasImageRender, false);
downloadButton.addEventListener("click", downloadImage, false);

window.addEventListener('resize', canvasImageRender);
window.addEventListener('resize', canvasTextRender);