function setup(){
	var HPGeSwitch = document.getElementById('enableHPGe'),
		LaBr3Switch = document.getElementById('enableLaBr3'),
		LEPSSwitch = document.getElementById('enableLEPS'),
		singlesInput = document.getElementById('inputEnergy'),
		coincInput1 = document.getElementById('coincInputEnergy1'),
		coincInput2 = document.getElementById('coincInputEnergy2');

	//set up control panel//////////////////////////////////////
	HPGeSwitch.enabled = 0;
	HPGeSwitch.onclick = function(event){
		if (this.enabled){
			this.style.backgroundColor = '#444444';
			this.enabled = 0;
			toggleOutput('effWidgetResultHPGe', 0);
			toggleOutput('coincEffWidgetResultHPGe', 0);
			toggleOutput('rateWidgetResultHPGe', 0);
			toggleOutput('coincRateWidgetResultHPGe', 0);
		} else{
			this.style.backgroundColor = '#449944';
			this.enabled = 1;
			toggleOutput('effWidgetResultHPGe', 1);
			toggleOutput('coincEffWidgetResultHPGe', 1);
			toggleOutput('rateWidgetResultHPGe', 1);
			toggleOutput('coincRateWidgetResultHPGe', 1);
		}
		toggleHPGeControls();
		chooseGraphs();
	}
	LaBr3Switch.enabled = 0;
	LaBr3Switch.onclick = function(event){
		if (this.enabled){
			this.style.backgroundColor = '#444444';
			this.enabled = 0;
			toggleOutput('effWidgetResultLaBr3', 0);
			toggleOutput('coincEffWidgetResultLaBr3', 0);
			toggleOutput('rateWidgetResultLaBr3', 0);
			toggleOutput('coincRateWidgetResultLaBr3', 0);
		} else{
			this.style.backgroundColor = '#e67e22';
			this.enabled = 1;
			toggleOutput('effWidgetResultLaBr3', 1);
			toggleOutput('coincEffWidgetResultLaBr3', 1);
			toggleOutput('rateWidgetResultLaBr3', 1);
			toggleOutput('coincRateWidgetResultLaBr3', 1);
		}
		chooseGraphs();
	}
	/*
	LEPSSwitch.enabled = 0;
	LEPSSwitch.onclick = function(event){
		if (this.enabled){
			this.style.backgroundColor = '#444444';
			this.enabled = 0;
			toggleOutput('effWidgetResultLEPS', 0);
			toggleOutput('coincEffWidgetResultLEPS', 0);
			toggleOutput('rateWidgetResultLEPS', 0);
			toggleOutput('coincRateWidgetResultLEPS', 0);
		} else{
			this.style.backgroundColor = '#2980b9';
			this.enabled = 1;
			toggleOutput('effWidgetResultLEPS', 1);
			toggleOutput('coincEffWidgetResultLEPS', 1);
			toggleOutput('rateWidgetResultLEPS', 1);
			toggleOutput('coincRateWidgetResultLEPS', 1);
		}
		chooseGraphs();
	}
	*/

	//make sure the file name for image saving gets passed around:
	document.getElementById('filename').onchange = function(){
		//set the filename to whatever the user has requested:
		document.getElementById('savePlot').download = this.value;
	}

	//plot range control//////////////////////////////////////
	document.getElementById('xMin').onchange = updateXrange;
	document.getElementById('xMax').onchange = updateXrange;
	document.getElementById('yMin').onchange = updateYrange;
	document.getElementById('yMax').onchange = updateYrange;

	//default No. HPGe to 12:
	document.getElementById('nHPGeSwitch').value = 12;

	//default summing to per clover:
	document.getElementById('summingScheme').value = 'clover';

	//button setup//////////////////////////////////////////////
    document.getElementById('wikiLink').onclick = function(){
        window.location = 'https://www.triumf.info/wiki/tigwiki/index.php/GRIFFIN_User%27s_Web_Toolkit';
    };

	//set up singles efficiency widget//////////////////////////
	document.getElementById('inputEnergyLabel').innerHTML = 'keV '+String.fromCharCode(0x2192);
	singlesInput.onchange = computeSinglesEfficiency.bind(null);

	//set up coincidence efficiency widget//////////////////////////
	document.getElementById('coincInputEnergyLabel2').innerHTML = 'keV '+String.fromCharCode(0x2192);
	coincInput1.onchange = computeCoincEfficiency.bind(null, 16);
	coincInput2.onchange = computeCoincEfficiency.bind(null, 16);
	document.getElementById('coincEffWidget').whichInput = 0;

	//set up triples efficiency widget//////////////////////////////
	document.getElementById('tripleInputEnergyLabel3').innerHTML = 'keV '+String.fromCharCode(0x2192);

	//set up singles rate widget////////////////////////////////////
	document.getElementById('singlesRateEnergy').onchange = computeSinglesRate.bind(null);
	document.getElementById('singlesRateBR').onchange = computeSinglesRate.bind(null);
	document.getElementById('singlesRateIntensity').onchange = computeSinglesRate.bind(null);
	document.getElementById('ratePeriod').onchange = computeSinglesRate.bind(null);
	
	//set up coinc rate widget////////////////////////////////////////////
	document.getElementById('coincRateEnergy1').onchange = computeCoincRate.bind(null);
	document.getElementById('coincRateEnergy2').onchange = computeCoincRate.bind(null);
	document.getElementById('coincRateBR').onchange = computeCoincRate.bind(null);
	document.getElementById('coincRateIntensity').onchange = computeCoincRate.bind(null);
	document.getElementById('coincRatePeriod').onchange = computeCoincRate.bind(null);

	//default to on for demo:
	HPGeSwitch.onclick();
	LaBr3Switch.onclick();
	//LEPSSwitch.onclick();
}

function updateXrange(){
	//g.updateOptions({
	//	dateWindow : [parseFloat(document.getElementById('xMin').value), parseFloat(document.getElementById('xMax').value)]	
	//});
	chooseGraphs();	
}

function updateYrange(){
	g.updateOptions({
		valueRange : [parseFloat(document.getElementById('yMin').value), parseFloat(document.getElementById('yMax').value)]	
	});	
}

function toggleOutput(id, state){
	if(state == 0){
		document.getElementById(id).style.width = 0;
		document.getElementById(id).style.padding = 0;
		document.getElementById(id).style.opacity = 0;
	} else if(state == 1){
		document.getElementById(id).style.width = 'auto';
		document.getElementById(id).style.padding = '0.5em';
		document.getElementById(id).style.opacity = 1;
	}
}

function computeSinglesEfficiency(){
	document.getElementById('effWidgetResultHPGe').innerHTML = efficient(parseFloat(document.getElementById('inputEnergy').value)).toFixed(2);
	document.getElementById('effWidgetResultLaBr3').innerHTML = dummy(parseFloat(document.getElementById('inputEnergy').value)).toFixed(2);
	//document.getElementById('effWidgetResultLEPS').innerHTML = fake(parseFloat(document.getElementById('inputEnergy').value)).toFixed(2);
}

function computeCoincEfficiency(nDetectors){
	var e1 = parseFloat(document.getElementById('coincInputEnergy1').value),
		e2 = parseFloat(document.getElementById('coincInputEnergy2').value);
	document.getElementById('coincEffWidgetResultHPGe').innerHTML = (efficient(e1)*efficient(e2)*(nDetectors-1)/nDetectors).toFixed(2);
	document.getElementById('coincEffWidgetResultLaBr3').innerHTML = (dummy(e1)*dummy(e2)*(nDetectors-1)/nDetectors).toFixed(2);
	//document.getElementById('coincEffWidgetResultLEPS').innerHTML = (fake(e1)*fake(e2)*(nDetectors-1)/nDetectors).toFixed(2);
} 

function toggleHPGeControls(){
	if(document.getElementById('enableHPGe').enabled){
		document.getElementById('HPGeControl').style.height = '21em';
	} else{
		document.getElementById('HPGeControl').style.height = 0;
	}
}

//decide which plots to send to a call to deployGraph
function chooseGraphs(){
	var funcs = [],
		titles = [],
		colors = [],
		min = parseFloat(document.getElementById('xMin').value),
		max = parseFloat(document.getElementById('xMax').value);

	if(document.getElementById('enableHPGe').enabled){
		funcs[funcs.length] = efficient;
		titles[titles.length] = 'HPGe';
		colors[colors.length] = '#449944';
	}
	if(document.getElementById('enableLaBr3').enabled){
		funcs[funcs.length] = dummy;
		titles[titles.length] = 'LaBr3';
		colors[colors.length] = '#e67e22';
	}
	/*
	if(document.getElementById('enableLEPS').enabled){
		funcs[funcs.length] = fake;
		titles[titles.length] = 'LEPS';
		colors[colors.length] = '#2980b9';
	}
	*/
	deployGraph(funcs, titles, colors, min, max);
}

//deploy graphs of [func]tions with [titles]
function deployGraph(func, titles, colors, min, max){
	var i, j, x,
		data = 'Energy[keV]',
		nPoints = 10000;


	for(i=0; i<titles.length; i++){
		data += ', '+titles[i];
	}
	data += '\n';

	for(i=0; i<nPoints; i++){
			x = parseFloat(((max-min)/nPoints*i).toFixed(2));
			data += x;
			for(j=0; j<func.length; j++){
				data += ','+func[j].bind(null, x)();
			}
			data += '\n';
	}

	g = new Dygraph(document.getElementById('graphDiv'), data, {
		title: 'Simulated Gamma Efficiency v. Energy',
		xlabel: 'Energy [keV]',
		ylabel: 'Efficiency',
		sigFigs: 2,
		strokeWidth: 4,
		colors: colors,
		highlightCircleSize: 6,
		labelsSeparateLines : true,
		clickCallback : passClickToWidget,
		legend: 'always'
	});

	g.updateOptions({
		drawCallback: repaint
	});

	repaint(g);

}

//callback to run every time the function repaints
function repaint(dygraph){
	var xMin = document.getElementById('xMin'),
		xMax = document.getElementById('xMax'),
		yMin = document.getElementById('yMin'),
		yMax = document.getElementById('yMax');

	prepImageSave(dygraph);

	xMin.value = parseFloat(g.xAxisRange()[0].toFixed(2));
	xMax.value = parseFloat(g.xAxisRange()[1].toFixed(2));
	yMin.value = parseFloat(g.yAxisRange()[0].toFixed(2));
	yMax.value = parseFloat(g.yAxisRange()[1].toFixed(2));

}

//generate a hidden image and send its data uri to the appropriate place for saving:
function prepImageSave(dygraph){
	var options = {
	    //Texts displayed below the chart's x-axis and to the left of the y-axis 
	    titleFont: "bold 18px sans-serif",
	    titleFontColor: "black",

	    //Texts displayed below the chart's x-axis and to the left of the y-axis 
	    axisLabelFont: "bold 14px sans-serif",
	    axisLabelFontColor: "black",

	    // Texts for the axis ticks
	    labelFont: "normal 14px sans-serif",
	    labelFontColor: "black",

	    // Text for the chart legend
	    legendFont: "bold 14px sans-serif",
	    legendFontColor: "black",

	    legendHeight: 40    // Height of the legend area
	};

	Dygraph.Export.asPNG(dygraph, document.getElementById('pngDump'), options);
	document.getElementById('savePlot').href = getBase64Image(document.getElementById('pngDump'));	
}

//when the plot is clicked, pass the corresponding energy to the widgets
function passClickToWidget(event, energy){
	var singlesInput = document.getElementById('inputEnergy'),
		coincWidget = document.getElementById('coincEffWidget'),
		coincInput1 = document.getElementById('coincInputEnergy1'),
		coincInput2 = document.getElementById('coincInputEnergy2'),
		rateInput1 = document.getElementById('coincRateEnergy1'),
		rateInput2 = document.getElementById('coincRateEnergy2'),
		rateInput = document.getElementById('singlesRateEnergy');

	//singles efficiency
	singlesInput.value = energy;
	singlesInput.onchange();

	//coinc efficiency & rate
	if(coincWidget.whichInput==0){
		coincInput1.value = energy;
		coincInput1.onchange();
		rateInput1.value = energy;
		rateInput1.onchange();
		coincWidget.whichInput = 1;
	} else{
		coincInput2.value = energy;
		coincInput2.onchange();
		rateInput2.value = energy;
		rateInput2.onchange();
		coincWidget.whichInput = 0;
	}

	//singles rate
	rateInput.value = energy;
	rateInput.onchange();
}

// http://stackoverflow.com/a/934925/298479 + hax
function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
}

function computeSinglesRate(){
	var energy = parseFloat(document.getElementById('singlesRateEnergy').value),
		BR = parseFloat(document.getElementById('singlesRateBR').value),
		intensity = parseFloat(document.getElementById('singlesRateIntensity').value),
		HPGeEff = efficient(energy),
		LaBr3Eff = dummy(energy),
		//LEPSEff = fake(energy),
		periodSelect = document.getElementById("ratePeriod"),
		period = parseFloat(periodSelect.options[periodSelect.selectedIndex].value);

	document.getElementById('rateWidgetResultHPGe').innerHTML = sciNot(intensity*BR*HPGeEff*period, 2);
	document.getElementById('rateWidgetResultLaBr3').innerHTML = sciNot(intensity*BR*LaBr3Eff*period, 2);
	//document.getElementById('rateWidgetResultLEPS').innerHTML = (intensity*BR*LEPSEff*period).toFixed();
}

function computeCoincRate(){
	var energy1 = parseFloat(document.getElementById('coincRateEnergy1').value),
		energy2 = parseFloat(document.getElementById('coincRateEnergy2').value),
		BR = parseFloat(document.getElementById('coincRateBR').value),
		intensity = parseFloat(document.getElementById('coincRateIntensity').value),
		HPGeEff = efficient(energy1)*efficient(energy2)*(15/16),
		LaBr3Eff = dummy(energy1)*dummy(energy2)*(15/16),
		//LEPSEff = fake(energy1)*fake(energy2)*(15/16),
		periodSelect = document.getElementById("coincRatePeriod"),
		period = parseFloat(periodSelect.options[periodSelect.selectedIndex].value);

	document.getElementById('coincRateWidgetResultHPGe').innerHTML = sciNot(intensity*BR*HPGeEff*period, 2);
	document.getElementById('coincRateWidgetResultLaBr3').innerHTML = sciNot(intensity*BR*LaBr3Eff*period, 2);
	//document.getElementById('coincRateWidgetResultLEPS').innerHTML = (intensity*BR*LEPSEff*period).toFixed();	
}

function sciNot(val, sig){
	if(val>10 || val<1){
		var string = val.toExponential(sig),
			out = parseFloat(string.slice(0, string.indexOf('e')))+' ' + String.fromCharCode(0x2A2F) + '10<sup>',
			exp = ((string.indexOf('+') != -1) ? string.slice(string.indexOf('e')+2, string.length) : string.slice(string.indexOf('e')+1, string.length));
		return out+exp+'</sup>'
	} else{
		return val.toFixed(sig);
	}
}

//functions//////////////////////////////////////////////////////////////////////////////////
function efficient(x){
	var f = Math.exp(-(x-2)*(x-2)/4);
	return f;
}

function dummy(x){
	var f = Math.exp(-(x-3)*(x-3)/9);
	return f;
}

function fake(x){
	var f = Math.exp(-(x-6)*(x-6)/1);
	return f;
}

function exponent(x){
	var f = Math.pow(2, -x);
	return f
}