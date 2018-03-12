function changeContainerDim(containerHeight, containerWidth) {
    var element = document.getElementById('leonardoContainer');
    containerHeight = parseInt(containerHeight.trim());
    containerWidth = parseInt(containerWidth.trim());
    element.style.width = containerWidth + "px";
    element.style.height = containerHeight + "px";
    document.getElementById("input1").value = containerWidth;
    document.getElementById("input2").value = containerHeight;
}

function updateContainerUI(){
    
    this.leonardoWidget.destroy();

    var widgetStyles = getValue("widgetStyles");
    var mode = getValue('mode');
    var usecase = getValue('usecase');

    var height = getValue("height");
    var horizontalAlignment = getValue("alignment");

    var uiStyle={};
    uiStyle["widgetStyles"] =  JSON.parse(widgetStyles);
    uiStyle["height"] = height;
    uiStyle["horizontalAlignment"] = horizontalAlignment;

    var inputHeight = getValue("input2");
    var inputWidth = getValue("input1");
    var containerHeight = inputHeight !="" ? inputHeight : leoConfigNew.type[usecase].dim.height;
    var containerWidth = inputWidth !="" ? inputWidth : leoConfigNew.type[usecase].dim.width;

    var heightDiff = parseInt(leoConfigNew.type[usecase].dim.height.trim()) - inputHeight;
    document.getElementById("buttonPanel").style.marginTop = heightDiff + "px";

    changeContainerDim(containerHeight, containerWidth);
    paintLeonardoWidget(mode, usecase, uiStyle);
}

// getting value from input boxes
function getValue(id) {
    var selectedInput = document.getElementById(id).value;
    return selectedInput;
}

function checkAnswer() {
    var currUsecase = getValue('usecase');
    var scoreObj = this.leonardoWidget.score(this.leonardoWidget.getState().grid);
    // var scoreObj = this.leonardoWidget.score(leoConfigNew["type"][currUsecase]["config"]);
    this.leonardoWidget.displayFeedback(scoreObj);
}
function tryAgain() {
    this.leonardoWidget.clearFeedback();
}
function reset() {
    this.leonardoWidget.reset();
}

function paintLeonardoWidget(mode, usecaseValue, uiOverride) {

    var uiStyle = uiOverride;

    if(uiOverride == undefined){
        var uiStyle = {
            widgetStyles: {
                "box-shadow":"6px 6px 9px #ddd",
                "border": "1px solid #ddd"
                }
            };
    }

    document.getElementById("widgetStyles").innerHTML = JSON.stringify(uiStyle.widgetStyles,null,2);

    if (!leoConfigNew.type[usecaseValue].config.meta) {
        leoConfigNew.type[usecaseValue].config.meta = {};
    }

    var originalConfig = leoConfigNew.type[usecaseValue].config.meta.type;
    leoConfigNew.type[usecaseValue].config.meta.type = mode;

    if (mode == "Question") {
        document.querySelector(".buttonPanel").classList.remove("hideBtns");
    }
    else {
        document.querySelector(".buttonPanel").classList.add("hideBtns");
    }
    uiStyle.widgetStyles  = JSON.stringify(uiStyle.widgetStyles);

    this.leonardoWidget = this.leonardoPlayer.addWidget("WB1", document.querySelector("#leonardoContainer"), { config: leoConfigNew.type[usecaseValue].config, events: {}, uiStyle: uiStyle });

    leoConfigNew.type[usecaseValue].config.meta.type = originalConfig;
}

function changeConfig() {
    var mode = getValue('mode');
    var usecase = getValue('usecase');

    this.leonardoWidget.destroy();
    let uiStyle = (mode == "Presentation") ? { widgetStyles: '{"box-shadow": "6px 6px 9px #ddd", "border": "1px solid #ddd"}', horizontalAlignment: "center" } : {};
    changeContainerDim(leoConfigNew.type[usecase].dim.height, leoConfigNew.type[usecase].dim.width)
    paintLeonardoWidget(mode, usecase);

    document.getElementById("alignment").value="default";
    document.getElementById("height").value="default";
    document.getElementById("buttonPanel").style.marginTop =  "0px";
}
function onModeChange(mode) {
    var select = document.getElementById('usecase');

    var useCaseArr = [];

    while (select.hasChildNodes()) {
        select.removeChild(select.firstChild);
    }
    /*if ((mode.toLowerCase()) == "question") {
        for (var type in leoConfigNew["type"]) {
            leoConfigNew["type"][type].config.meta.type == (mode.toLowerCase()) ? useCaseArr.push(type) : null;
        }

    } else {
        useCaseArr = Object.keys(leoConfigNew["type"]);
    }*/

    for (var type in leoConfigNew["type"]) {
        leoConfigNew["type"][type].config.meta.type == (mode.toLowerCase()) ? useCaseArr.push(type) : null;
    }
    populateDropdown(select, useCaseArr);
}
//starting function initialized once (on load of body)
function populateDropdown(dropDownElement, dropdownValueArr) {
    for (var i = 0; i < dropdownValueArr.length; i++) {
        var opt = document.createElement("option")
        opt.value = dropdownValueArr[i];
        opt.innerHTML = dropdownValueArr[i];
        dropDownElement.appendChild(opt);
    }
}

function init() {

    var modeDropdown = document.getElementById('mode');
    leoConfigNew.mode;
    populateDropdown(modeDropdown, leoConfigNew.mode); // populate mode

    var usecaseDropdown = document.getElementById('usecase');
    var typeArr = leoConfigNew.mode;                   //  presen and ques
    var useCaseArr = Object.keys(leoConfigNew.type);   // type populated
    populateDropdown(usecaseDropdown, useCaseArr);     // populate use cases

    var mode = typeArr[0]; // presentation
    var useCase = useCaseArr[0]; // type1
    this.leonardoPlayer = new LeonardoPlayer.init();

    document.querySelector(".buttonPanel").classList.add("hideBtns");

    onModeChange(mode);
    changeContainerDim(leoConfigNew.type[useCase].dim.height, leoConfigNew.type[useCase].dim.width);
    paintLeonardoWidget(mode, useCase);
}

function toggleConfiguratorPane() {
    configVisible = !configVisible;
    if (configVisible == true) {
        document.querySelector(".configuratorPane").classList.remove("hideConfigPane");
        document.querySelector(".spreadsheetpane").classList.remove("expandSpreadsheetPane");
        document.querySelector(".splitter>button").innerHTML = "&lt;&lt;"; //select all buttons where parent is splitter class
    }
    else {
        document.querySelector(".configuratorPane").classList.add("hideConfigPane");
        document.querySelector(".spreadsheetpane").classList.add("expandSpreadsheetPane");
        document.querySelector(".splitter>button").innerHTML = "&lt;&lt;";
    }
}
var configVisible = true;
