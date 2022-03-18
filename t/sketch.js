let side;
let h;
let w;

let photo;
let fingerprint;
let layer0 = [];
let layer1 = [];
let layer2 = [];
let layer3 = [];
let layer4 = [];
let layer5 = [];
let layer6 = [];
let layer7 = [];
let pg;
function selectAndLoadImage(folder_name, count, ext = ".png", nmbr=-1){
    let rnd;
    if(nmbr == -1){
        rnd = int(floor(fxrand()*count));
    }
    else{
        rnd = nmbr;
    }    
    return loadImage("pics/"+folder_name+"/"+nf(rnd+1,3)+ext);
}

function preload() {
    layer0 = selectAndLoadImage("layer0",1, ".JPG");
    layer1 = selectAndLoadImage("layer1",1, ".PNG");
    layer2 = selectAndLoadImage("layer2",1, ".PNG");
    layer3 = selectAndLoadImage("layer3",8, ".PNG");
    layer4 = selectAndLoadImage("layer4",8, ".PNG");
    layer5 = selectAndLoadImage("layer5",7, ".PNG");
    layer6 = selectAndLoadImage("layer6",7, ".PNG");
    layer7 = selectAndLoadImage("layer7",7, ".PNG");
}

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.mousePressed(canvasPressed);
    windowResized();
    construct();
}
function canvasPressed() {
    let g_side=layer1.width;
    pg = createGraphics(g_side,g_side)
    pg.image(layer0, 0, 0, g_side, g_side)
	pg.image(layer1, 0, 0, g_side, g_side)
	pg.image(layer2, 0, 0, g_side, g_side)
	pg.image(layer3, 0, 0, g_side, g_side)
	pg.image(layer4, 0, 0, g_side, g_side)
	pg.image(layer5, 0, 0, g_side, g_side)
	pg.image(layer6, 0, 0, g_side, g_side)
	pg.image(layer7, 0, 0, g_side, g_side)
    pg.save("pic.png")
}

function construct() {
    background(0);
	image(layer0, 0, 0, side, side)
	image(layer1, 0, 0, side, side)
	image(layer2, 0, 0, side, side)
	image(layer3, 0, 0, side, side)
	image(layer4, 0, 0, side, side)
	image(layer5, 0, 0, side, side)
	image(layer6, 0, 0, side, side)
	image(layer7, 0, 0, side, side)
    // blend(fingerprint, 0, 0, fingerprint.height, fingerprint.width,0, 0, side, side,EXCLUSION)
    // blend(fingerprint, 0, 0, fingerprint.height, fingerprint.width,0, 0, side, side,EXCLUSION)
    if(isFxpreview){
        fxpreview();
    }
    // BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD or NORMAL.
}


function windowResized() {
    const css = getComputedStyle(canvas.parentElement),
            marginWidth = round(float(css.marginLeft) + float(css.marginRight)),
            marginHeight = round(float(css.marginTop) + float(css.marginBottom));
            w = windowWidth - marginWidth, h = windowHeight - marginHeight;
    resizeCanvas(w, h, true);
    side=w>h?h:w;
    construct()
}