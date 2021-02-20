const INITIAL_CANVAS_WIDTH = 300;
const INITIAL_CANVAS_HEIGHT = 300;

class MemeModel {

    getImageFile(upload){
        let image = new Image();

        if (upload.files && upload.files[0]) {
            let reader = new FileReader();

            reader.addEventListener("load", e => {
                image.src = e.target.result;
            })

            reader.readAsDataURL(upload.files[0]);
        }

        return image;
    }

    parseCaptionsToView(captions, width, font){
        const maxLineWidth = width - 40;
        const dummyCanvas = document.createElement('canvas');
        const dummyContext = dummyCanvas.getContext('2d');

        let parsedCaptionsObject = {};

        dummyContext.font = font;
        dummyContext.width = width;

        for(let [key, value] of Object.entries(captions)){
            let line = '';
            let numberOfLines = 0;
            let captionObject = {
                text: null,
            };

            value.split(' ').forEach(word => {
                line += word + ' ';

                if(dummyContext.measureText(line).width - numberOfLines * (width - 40) > maxLineWidth){
                    line += '\n';
                    numberOfLines++;
                }
            });

            captionObject.text = line.split('\n');
            parsedCaptionsObject[key + 'Lines'] = captionObject;
        }

        parsedCaptionsObject.bottomLines.text = parsedCaptionsObject.bottomLines.text.reverse();

        return parsedCaptionsObject;
    }
}

class MemeView {
    canvas = document.querySelector('canvas');
    context = this.canvas.getContext('2d');
    image = new Image();

    constructor(){
        this.canvas.width = INITIAL_CANVAS_WIDTH;
        this.canvas.height = INITIAL_CANVAS_HEIGHT;
    } 

    clear(){
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.drawImage(this.image, 0, 0, this.width, this.height);
    }

    setNewImageOnView(image){ 
        const FORM_OFFSET = window.innerWidth > 900 ? 400 : 0;
        const MAX_IMAGE_HEIGHT = window.innerHeight - 50;
        const MAX_IMAGE_WIDTH = window.innerWidth - 50 - FORM_OFFSET;

        image.addEventListener("load", e => {
            const currentImage = e.target;
            let {width: imageWidth, height: imageHeight} = currentImage;
            
            if (imageHeight > MAX_IMAGE_HEIGHT || imageWidth > MAX_IMAGE_WIDTH){
                const maxCanvasSize = Math.min(MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT);
                const maxImageDimension = Math.max(imageWidth, imageHeight);

                const zoom = maxCanvasSize / maxImageDimension;
                
                imageWidth *= zoom;
                imageHeight *= zoom;
            }

            this.width = imageWidth;
            this.height = imageHeight;
            
            this.context.drawImage(currentImage, 0, 0, imageWidth, imageHeight);
        });

        this.image = image; //saving image into object field for reloading purposes;
    }

    reloadImageOnView(){
        this.context.drawImage(this.image, 0, 0, this.width, this.height);
    }

    setTextOnView(parsedCaptions){
        const fontSize = this.canvas.height / 15;
        const lineHeight = fontSize * 1.5;
        const frameWidth = 0.1 * fontSize;

        const topY = fontSize * 1.25;
        const bottomY = this.height - fontSize * 0.5;

        let {topLines, bottomLines} = parsedCaptions;

        this.fontSize = fontSize;
        this.context.textAlign = "center";
        this.context.lineWidth = frameWidth;

        topLines.position = topY;
        topLines.shift = lineHeight;

        bottomLines.position = bottomY;
        bottomLines.shift = -lineHeight;

        for(let captionObj of Object.values(parsedCaptions)){
            let {position, shift} = captionObj;

            for(let line of captionObj.text){
                //set frame of text
                this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
                this.context.strokeText(line, this.width / 2, position);
        
                //set text
                this.context.fillStyle = "rgba(255, 255, 255, 1.0)";
                this.context.fillText(line, this.width / 2, position);

                position += shift;
            }
        }
    }

    updateFontSize(){
        this.fontSize = this.canvas.height / 15;
    }

    set width(size) {
        this.canvas.width = size;
    }

    get width() {
        return this.canvas.width;
    }

    set height(size) {
        this.canvas.height = size;
    }

    get height() {
        return this.canvas.height;
    }

    set fontSize(size){
        this.context.font = `${size}px Anton`;
    }

    get font(){
        return this.context.font;
    }
}

class MemeController {
    topCaptionInput = document.querySelector('#topCaption') || '';
    bottomCaptionInput = document.querySelector('#bottomCaption') || '';

    upload = document.querySelector('#imageFile');
    download = document.querySelector('#download');

    model = new MemeModel();
    view = new MemeView();

    get captions() {
        return {
            top: this.topCaptionInput.value,
            bottom: this.bottomCaptionInput.value,
        }
    }

    downloadMeme(handler){
        return function (){
            const {view, download} = handler;

            download.href = view.canvas.toDataURL("image/jpeg");
        }
    }

    runEvents(){
        this.download.addEventListener("click", this.downloadMeme(this));
        this.upload.addEventListener("change", this.handleImageLoad(this));
        this.topCaptionInput.addEventListener("keyup", this.setTextOnView(this));
        this.bottomCaptionInput.addEventListener("keyup", this.setTextOnView(this));

        window.addEventListener('resize', this.reloadImage(this));
        window.addEventListener('resize', this.setTextOnView(this));

        this.view.updateFontSize();
    }

    handleImageLoad(handler){
        return function (){
            const {model, view} = handler;
            const image = model.getImageFile(this);

            view.setNewImageOnView(image);
            handler.setTextOnView(handler);
        }
    }

    reloadImage(handler){
        return function () {
            handler.view.reloadImageOnView();
        }
    }

    setTextOnView(handler){
        return function (){
            const {model, view, captions} = handler;
            const parsedCaptions = model.parseCaptionsToView(captions, view.width, view.font);

            handler.view.clear();
            handler.view.setTextOnView(parsedCaptions);
        }
    }
}

const memeGenerator = new MemeController();

memeGenerator.runEvents();