function setup(){
	var HPGeSwitch = document.getElementById('enableHPGe'),
		LaBr3Switch = document.getElementById('enableLaBr3'),
		LEPSSwitch = document.getElementById('enableLEPS'),
		singlesInput = document.getElementById('inputEnergy'),
		coincInput1 = document.getElementById('coincInputEnergy1'),
		coincInput2 = document.getElementById('coincInputEnergy2'),
		triplesInput1 = document.getElementById('tripleInputEnergy1'),
		triplesInput2 = document.getElementById('tripleInputEnergy2'),
		triplesInput3 = document.getElementById('tripleInputEnergy3');
		triplesAuxDet = document.getElementById('tripleAux');

	//call the parameter dump
	loadParameters();
	loadLaBrParameters();

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
		toggleLaBrControls();
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

	//default x axis to log
	document.getElementById('xScale').value = 'log';
	document.getElementById('xScale').onchange = chooseGraphs.bind(null);

	//repaint the plot when anything in the form changes:
	document.getElementById('plotOptions').onchange = chooseGraphs.bind(null);

	//button setup//////////////////////////////////////////////
    document.getElementById('wikiLink').onclick = function(){
        window.open('https://www.triumf.info/wiki/tigwiki/index.php/GRIFFIN_User%27s_Web_Toolkit','wikiTab');
    };

    document.getElementById('yieldDB').onclick = function(){
        window.open('http://mis.triumf.ca/science/planning/yield/beam', 'yieldTab');
    };

    document.getElementById('ENSDF').onclick = function(){
        window.open('http://www.nndc.bnl.gov/ensdf/', 'ENSDFtab');
    };

	//set up singles efficiency widget//////////////////////////
	document.getElementById('inputEnergyLabel').innerHTML = 'keV '+String.fromCharCode(0x2192);
	singlesInput.onchange = computeSinglesEfficiency.bind(null);

	//set up coincidence efficiency widget//////////////////////////
	document.getElementById('coincInputEnergyLabel2').innerHTML = 'keV '+String.fromCharCode(0x2192);
	coincInput1.onchange = computeCoincEfficiency.bind(null);
	coincInput2.onchange = computeCoincEfficiency.bind(null);
	document.getElementById('coincEffWidget').whichInput = 0;

	//set up triples efficiency widget//////////////////////////////
	document.getElementById('tripleResultLabel').innerHTML = String.fromCharCode(0x2192);
	triplesInput1.onchange = function(){
		validateDESCANTinput();
		computeTriplesEfficiency.bind(null)();
	}
	triplesInput2.onchange = computeTriplesEfficiency.bind(null);
	triplesInput3.onchange = computeTriplesEfficiency.bind(null);
	triplesAuxDet.onchange = computeTriplesEfficiency.bind(null);

	document.getElementById('tripleEffWidget').whichInput = 0;

	//set up singles rate widget////////////////////////////////////
	document.getElementById('singlesRateEnergy').onchange = computeSinglesRate.bind(null);
	document.getElementById('singlesRateBR').onchange = computeSinglesRate.bind(null);
	document.getElementById('singlesRateIntensity').onchange = computeSinglesRate.bind(null);
	document.getElementById('ratePeriod').onchange = computeSinglesRate.bind(null);
	document.getElementById('nSingles').onchange = computeSinglesRate.bind(null);
	
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

function validateDESCANTinput(){
	var auxDetectorSelect = document.getElementById('tripleAux'),
		auxDetector = auxDetectorSelect.options[auxDetectorSelect.selectedIndex].value,
		input = document.getElementById('tripleInputEnergy1');

	if(auxDetector == 'DESCANT' && (parseFloat(input.value)<1000 || parseFloat(input.value)>5000)){
		confirm('DESCANT Energy Out of Range', 'DESCANT neutron efficiencies are not reported below 1 MeV or above 5 MeV at this time.');
		input.value = 1000;
	}
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
	var energy = Math.log(parseFloat(document.getElementById('inputEnergy').value)),
		HPGeEff = window.HPGeFunc(energy),
		LaBrEff = window.LaBrFunc(energy);

	HPGeEff = parseFloat(HPGeEff.slice(HPGeEff.indexOf(';')+1, HPGeEff.lastIndexOf(';') ));
	LaBrEff = parseFloat(LaBrEff.slice(LaBrEff.indexOf(';')+1, LaBrEff.lastIndexOf(';') ));

	document.getElementById('effWidgetResultHPGe').innerHTML = (HPGeEff > 0.1) ? HPGeEff.toFixed(2) : sciNot(HPGeEff, 1);
	document.getElementById('effWidgetResultLaBr3').innerHTML = (LaBrEff > 0.1) ? LaBrEff.toFixed(2) : sciNot(LaBrEff, 1);
}

function computeCoincEfficiency(){
	var e1 = Math.log(parseFloat(document.getElementById('coincInputEnergy1').value)),
		e2 = Math.log(parseFloat(document.getElementById('coincInputEnergy2').value)),
		HPGeEff1 = window.HPGeFunc(e1),
		HPGeEff2 = window.HPGeFunc(e2),
		LaBrEff1 = window.LaBrFunc(e1),
		LaBrEff2 = window.LaBrFunc(e2),
		nHPGeSelect = document.getElementById('nHPGeSwitch'),
		nHPGe = parseFloat(nHPGeSelect.options[nHPGeSelect.selectedIndex].value),
		HPGeEff, LaBrEff;

	HPGeEff1 = parseFloat(HPGeEff1.slice(HPGeEff1.indexOf(';')+1, HPGeEff1.lastIndexOf(';') ));
	HPGeEff2 = parseFloat(HPGeEff2.slice(HPGeEff2.indexOf(';')+1, HPGeEff2.lastIndexOf(';') ));
	LaBrEff1 = parseFloat(LaBrEff1.slice(LaBrEff1.indexOf(';')+1, LaBrEff1.lastIndexOf(';') ));
	LaBrEff2 = parseFloat(LaBrEff2.slice(LaBrEff2.indexOf(';')+1, LaBrEff2.lastIndexOf(';') ));

	HPGeEff = (HPGeEff1*HPGeEff2*(nHPGe-1)/nHPGe);
	LaBrEff = (LaBrEff1*LaBrEff2*7/8);
	document.getElementById('coincEffWidgetResultHPGe').innerHTML = (HPGeEff > 0.1) ? HPGeEff.toFixed(2) : sciNot(HPGeEff, 1);
	document.getElementById('coincEffWidgetResultLaBr3').innerHTML = (LaBrEff > 0.1) ? LaBrEff.toFixed(2) : sciNot(LaBrEff, 1);
} 

function computeTriplesEfficiency(){
	var e1 = Math.log(parseFloat(document.getElementById('tripleInputEnergy1').value)),
		e2 = Math.log(parseFloat(document.getElementById('tripleInputEnergy2').value)),
		e3 = Math.log(parseFloat(document.getElementById('tripleInputEnergy3').value)),
		auxDetectorSelect = document.getElementById('tripleAux'),
		auxDetector = auxDetectorSelect.options[auxDetectorSelect.selectedIndex].value,
		//auxEff = window.HPGeFunc(e1),
		LaBrEff1 = window.LaBrFunc(e2),
		LaBrEff2 = window.LaBrFunc(e3),
		LaBrEff, tripleEff, auxEff;

	if(auxDetector == 'HPGe'){
		auxEff = window.HPGeFunc(e1);
		auxEff = parseFloat(auxEff.slice(auxEff.indexOf(';')+1, auxEff.lastIndexOf(';') ));
	} else if(auxDetector == 'DESCANT'){
		validateDESCANTinput();
		e1 = Math.log(parseFloat(document.getElementById('tripleInputEnergy1').value));
		auxEff = DESCANTefficiency(e1);
	} else{
		auxEff = SCEPTARefficiency(e1);
	}

	LaBrEff1 = parseFloat(LaBrEff1.slice(LaBrEff1.indexOf(';')+1, LaBrEff1.lastIndexOf(';') ));
	LaBrEff2 = parseFloat(LaBrEff2.slice(LaBrEff2.indexOf(';')+1, LaBrEff2.lastIndexOf(';') ));

	LaBrEff = (LaBrEff1*LaBrEff2*7/8);
	tripleEff = auxEff*LaBrEff;

	document.getElementById('tripleEffWidgetResult').innerHTML = (tripleEff > 0.1) ? tripleEff.toFixed(2) : sciNot(tripleEff, 1);
}

function toggleHPGeControls(){
	if(document.getElementById('enableHPGe').enabled){
		document.getElementById('HPGeControl').style.height = '21em';
	} else{
		document.getElementById('HPGeControl').style.height = 0;
	}
}

function toggleLaBrControls(){
	if(document.getElementById('enableLaBr3').enabled){
		document.getElementById('LaBr3Control').style.height = '5em';
	} else{
		document.getElementById('LaBr3Control').style.height = 0;
	}
}

//decide which plots to send to a call to deployGraph
function chooseGraphs(){
	var funcs = [],
		titles = [],
		colors = [],
		min = parseFloat(document.getElementById('xMin').value),
		max = parseFloat(document.getElementById('xMax').value),
		HPGeMinCoef = {},
		HPGeMaxCoef = {},
		requestString, LaBrString, i;

	HPGeMinCoef['dummy'] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	HPGeMaxCoef['dummy'] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	if(document.getElementById('enableHPGe').enabled){
		requestString = constructPlotKey();
		window.HPGeFunc = HPGeEfficiency.bind(null, HPGeCoef[requestString], HPGeMinCoef['dummy'], HPGeMaxCoef['dummy']);
		funcs[funcs.length] = window.HPGeFunc;
		titles[titles.length] = 'HPGe';
		colors[colors.length] = '#449944';
	}
	if(document.getElementById('enableLaBr3').enabled){
		LaBrString = constructLaBrPlotKey();
		window.LaBrFunc = LaBrEfficiency.bind(null, LaBrCoef[LaBrString], HPGeMinCoef['dummy'], HPGeMaxCoef['dummy']);
		funcs[funcs.length] = window.LaBrFunc;
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
	var i, j, logx, deltaLow, deltaHigh, eff,
		data = 'Energy[keV]',
		nPoints = 1000,
		scaleSelect = document.getElementById("xScale"),
	    scale = scaleSelect.options[scaleSelect.selectedIndex].value;


	for(i=0; i<titles.length; i++){
		data += ', '+titles[i];
	}
	data += '\n';

	for(i=0; i<nPoints+1; i++){
			if(scale=='lin'){
				logx = (max-min)/nPoints*i+min;
				data += logx;
				logx = Math.log(logx);
			} else{
				logx = (Math.log(max)-Math.log(min))/nPoints*i+Math.log(min);
				data += logx;
			}
			for(j=0; j<func.length; j++){
				data+=',';
				eff = func[j].bind(null, logx)();
				data += eff;
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
		legend: 'always',
		customBars: true,
		axes:{
			x: {
				valueFormatter: function(number, opts, dygraph){
					if(scale=='log')
						return Math.exp(number).toFixed() + ' keV';
					else
						return number.toFixed() + ' keV';
				},
				axisLabelFormatter: function(number, gran, opts, dygraph){
					var val = Math.round(Math.exp(number));
					if(scale=='lin')
						return Math.round(number);
					else
						return Math.round(Math.exp(number));
				}
			}
		}
	});

	g.updateOptions({
		drawCallback: repaint,
	});

	repaint(g);

}

//construct the correct plot key based on whatever is selected in the plot options
//HPGeCoef holds the coefficients for all HPGe fits in a key value store
//where the key is the string concatenation of all the control panel values in 
//the order:
//summing scheme + nDetectors + HPGe Distance + Delrin thickness
//so 'clover1214.520' is 12 detectors at 14.5cm with 20mm delrin and per-clover summing.
//HPGeCoef['clover811.00'] = [-8.0309801002962706e+02, 1.1187177193972436e+03, -6.7413427087340233e+02, 2.2869743662093572e+02, -4.7716717011091916e+01, 6.2669769394841666e+00, -5.0603869584892447e-01, 2.2979902406689505e-02, -4.4966824986778788e-04];
//HPGeMinCoef and HPGeMaxCoef are packed the same way as HPGeCoef, but hold the 1-sigma extrema for the coefficients:
function constructPlotKey(){
	var summingOptions = document.getElementById('summingScheme'),
		summing = summingOptions.options[summingOptions.selectedIndex].value,
		nHPGeOptions = document.getElementById('nHPGeSwitch'),
		nHPGe = nHPGeOptions.options[nHPGeOptions.selectedIndex].value,
		HPGeDistanceOptions = document.getElementById('HPGeDistanceSwitch'),
		HPGeDistance = HPGeDistanceOptions.options[HPGeDistanceOptions.selectedIndex].value,
		absorberOptions = document.getElementById('delrinSwitch'),
		absorber = absorberOptions.options[absorberOptions.selectedIndex].value,
		plotKey = summing + nHPGe + HPGeDistance + absorber;

		return plotKey;
}

//LaBr's only option is summing per detector or over the whole array:
function constructLaBrPlotKey(){
	var LaBrSummingSelect = document.getElementById('LaBrSummingScheme'),
		summing = LaBrSummingSelect.options[LaBrSummingSelect.selectedIndex].value;

		return summing;
}

//callback to run every time the function repaints
function repaint(dygraph){
	var xMin = document.getElementById('xMin'),
		xMax = document.getElementById('xMax'),
		yMin = document.getElementById('yMin'),
		yMax = document.getElementById('yMax'),
		scaleSelect = document.getElementById("xScale"),
	    scale = scaleSelect.options[scaleSelect.selectedIndex].value;

	prepImageSave(dygraph);

	if(scale=='lin'){
		xMin.value = g.xAxisRange()[0].toFixed();
		xMax.value = g.xAxisRange()[1].toFixed();
	}else{
		xMin.value = Math.exp(g.xAxisRange()[0]).toFixed();
		xMax.value = Math.exp(g.xAxisRange()[1]).toFixed();
	}
	yMin.value = g.yAxisRange()[0].toFixed();
	yMax.value = g.yAxisRange()[1].toFixed();

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
		rateInput = document.getElementById('singlesRateEnergy'),
		triplesWidget = document.getElementById('tripleEffWidget'),
		triplesInput1 = document.getElementById('tripleInputEnergy1'),
		triplesInput2 = document.getElementById('tripleInputEnergy2'),
		triplesInput3 = document.getElementById('tripleInputEnergy3'),
		scaleSelect = document.getElementById("xScale"),
	    scale = scaleSelect.options[scaleSelect.selectedIndex].value,
	    reportEnergy = (scale=='lin') ? energy.toFixed() : Math.exp(energy).toFixed();

	//singles efficiency
	singlesInput.value = reportEnergy;
	singlesInput.onchange();

	//coinc efficiency & rate
	if(coincWidget.whichInput==0){
		coincInput1.value = reportEnergy;
		coincInput1.onchange();
		rateInput1.value = reportEnergy;
		rateInput1.onchange();
		coincWidget.whichInput = 1;
	} else{
		coincInput2.value = reportEnergy;
		coincInput2.onchange();
		rateInput2.value = reportEnergy;
		rateInput2.onchange();
		coincWidget.whichInput = 0;
	}

	//triple efficiency
	if(triplesWidget.whichInput==0){
		triplesInput1.value = reportEnergy;
		triplesInput1.onchange();
		triplesWidget.whichInput=1;
	} else if(triplesWidget.whichInput==1){
		triplesInput2.value = reportEnergy;
		triplesInput2.onchange();
		triplesWidget.whichInput=2;
	} else if(triplesWidget.whichInput==2){
		triplesInput3.value = reportEnergy;
		triplesInput3.onchange();
		triplesWidget.whichInput=0;
	}


	//singles rate
	rateInput.value = reportEnergy;
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
	var energy = Math.log(parseFloat(document.getElementById('singlesRateEnergy').value)),
		BR = parseFloat(document.getElementById('singlesRateBR').value),
		intensity = parseFloat(document.getElementById('singlesRateIntensity').value),
		HPGeEff = window.HPGeFunc(energy),
		LaBrEff = window.LaBrFunc(energy),
		periodSelect = document.getElementById("ratePeriod"),
		period = parseFloat(periodSelect.options[periodSelect.selectedIndex].value),
		nCounts = parseFloat(document.getElementById('nSingles').value),
		HPGeSeconds, LaBrSeconds, HPGeUnit, LaBrUnit;

	HPGeEff = parseFloat(HPGeEff.slice(HPGeEff.indexOf(';')+1, HPGeEff.lastIndexOf(';') ));
	LaBrEff = parseFloat(LaBrEff.slice(LaBrEff.indexOf(';')+1, LaBrEff.lastIndexOf(';') ));

	//rate
	document.getElementById('rateWidgetResultHPGe').innerHTML = sciNot(intensity*BR*HPGeEff*period, 2);
	document.getElementById('rateWidgetResultLaBr3').innerHTML = sciNot(intensity*BR*LaBrEff*period, 2);

	//time to accrue:
	HPGeSeconds = nCounts/(intensity*BR*HPGeEff);
	HPGeUnit = chooseTimeUnit(HPGeSeconds);
	document.getElementById('nSinglesHPGe').innerHTML = sciNot(HPGeSeconds/HPGeUnit[0], 2)+' '+HPGeUnit[1];
	
	LaBrSeconds = nCounts/(intensity*BR*LaBrEff);
	LaBrUnit = chooseTimeUnit(LaBrSeconds);
	document.getElementById('nSinglesLaBr3').innerHTML = sciNot(LaBrSeconds/LaBrUnit[0], 2)+' '+LaBrUnit[1];
}

function chooseTimeUnit(nSeconds){
	var unit = 's',
		factor = 1;

	if(nSeconds>60){
		unit = 'min';
		factor = 60;
	} 
	if(nSeconds>3600){
		unit = 'h';
		factor = 3600;
	}
	if(nSeconds>86400){
		unit = 'days';
		factor = 86400;
	}
	return [factor, unit];
}

function computeCoincRate(){
	var e1 = Math.log(parseFloat(document.getElementById('coincRateEnergy1').value)),
		e2 = Math.log(parseFloat(document.getElementById('coincRateEnergy2').value)),
		BR = parseFloat(document.getElementById('coincRateBR').value),
		intensity = parseFloat(document.getElementById('coincRateIntensity').value),
		nHPGeSelect = document.getElementById('nHPGeSwitch'),
		nHPGe = parseFloat(nHPGeSelect.options[nHPGeSelect.selectedIndex].value),	
		HPGeEff1 = window.HPGeFunc(e1),
		HPGeEff2 = window.HPGeFunc(e2),
		LaBrEff1 = window.LaBrFunc(e1),
		LaBrEff2 = window.LaBrFunc(e2),	
		periodSelect = document.getElementById("coincRatePeriod"),
		period = parseFloat(periodSelect.options[periodSelect.selectedIndex].value),
		HPGeEff, LaBrEff;

	HPGeEff1 = parseFloat(HPGeEff1.slice(HPGeEff1.indexOf(';')+1, HPGeEff1.lastIndexOf(';') ));
	HPGeEff2 = parseFloat(HPGeEff2.slice(HPGeEff2.indexOf(';')+1, HPGeEff2.lastIndexOf(';') ));
	LaBrEff1 = parseFloat(LaBrEff1.slice(LaBrEff1.indexOf(';')+1, LaBrEff1.lastIndexOf(';') ));
	LaBrEff2 = parseFloat(LaBrEff2.slice(LaBrEff2.indexOf(';')+1, LaBrEff2.lastIndexOf(';') ));

	HPGeEff = (HPGeEff1*HPGeEff2*(nHPGe-1)/nHPGe);
	LaBrEff = (LaBrEff1*LaBrEff2*7/8);

	document.getElementById('coincRateWidgetResultHPGe').innerHTML = sciNot(intensity*BR*HPGeEff*period, 2);
	document.getElementById('coincRateWidgetResultLaBr3').innerHTML = sciNot(intensity*BR*LaBrEff*period, 2);	
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

//more flexible DOM injector; <properties> is an object containing property.value pairs for all properties to be set: 
function injectDOM(element, id, wrapperID, properties){
    var key, elt,
        newElement = document.createElement(element);
    //explicit ID
    newElement.setAttribute('id', id);
    //append to document:
    if(wrapperID == 'body')
        document.body.appendChild(newElement)
    else
        document.getElementById(wrapperID).appendChild(newElement);
    elt = document.getElementById(id);

    //some things need to be set specially:
    if(properties['innerHTML']){
        elt.innerHTML = properties['innerHTML'];
        delete properties['innerHTML'];
    }
    if(properties['onclick']){
        elt.onclick = properties['onclick'];
        delete properties['onclick'];
    }
    //send in the clowns:
    for(key in properties){
        elt.setAttribute(key, properties[key]);
    }

}

//generic confirmation dialog
function confirm(headline, detailText){
    var i, j, ODBpath;

    //insert div and title
    injectDOM('div', 'tempDiv', 'body', {'class':'tempDialog'});
    var dialogue = document.getElementById('tempDiv');
    injectDOM('h2', 'dialogHeader', 'tempDiv', {
        'style' : 'position:relative; font:24px Raleway; top:10px; margin-bottom:6%; margin-left:auto; margin-right:auto;',
        'innerHTML' : headline
    })

    //fix dimensions
    var width = 0.35*window.innerWidth;
    document.getElementById('dialogHeader').setAttribute('width', width);

    //center dialogue
    document.getElementById('tempDiv').style.left = document.body.offsetWidth/2 - width/2;

    //warning text
    injectDOM('p', 'warning', 'tempDiv', {'style':'padding: 1em; font-size:120%;', 'innerHTML':detailText});

    //insert submit & abort button
    injectDOM('input', 'abortChoice', 'tempDiv', {
        'class' : 'standardButton',
        'style' : 'width:auto; height:auto; padding:0.5em; margin-bottom:1em',
        'type' : 'button',
        'value' : 'Abort'
    });

    document.getElementById('abortChoice').onclick = function(event){
        document.getElementById('tempDiv').style.opacity = 0;
        setTimeout(function(){
            var element = document.getElementById('tempDiv');
            element.parentNode.removeChild(element);            
        }, 500);
    }

    //fade the div in:
    dialogue.style.opacity = 1
}


//functions//////////////////////////////////////////////////////////////////////////////////

//an eighth order polynomial for logEff in logE with coef. param = [0th order, 1st order, ..., 8th order].
//lo and hiParam are the 1-sigma extremes of the parameters
//returns string formatted for inclusion in dygraphs customGraph object.
function HPGeEfficiency(param, loParam, hiParam, logE){
	var i,
		logEff = 0,
		loDelta = 0,
		hiDelta = 0,
		eff;

	for(i=0; i<9; i++){
		logEff += param[i]*Math.pow(logE,i);
		//loDelta += Math.pow((param[i] - loParam[i])*Math.pow(logE,i), 2);
		//hiDelta += Math.pow((hiParam[i] - param[i])*Math.pow(logE,i), 2);
	}
	//loDelta = Math.sqrt(loDelta);  //leave these errors out until we have a better grasp of what they should be.
	//hiDelta = Math.sqrt(hiDelta);

	eff = Math.exp(logEff);
	return (eff - eff*loDelta) + ';' + eff + ';' + (eff + eff*hiDelta);
}

function LaBrEfficiency(param, loParam, hiParam, logE){
	var i,
		logEff = 0,
		loDelta = 0,
		hiDelta = 0,
		eff;

	if(logE < Math.log(40)) return '0;0;0';

	for(i=0; i<9; i++){
		logEff += param[i]*Math.pow(logE,i);
		//loDelta += Math.pow((param[i] - loParam[i])*Math.pow(logE,i), 2);
		//hiDelta += Math.pow((hiParam[i] - param[i])*Math.pow(logE,i), 2);
	}
	//loDelta = Math.sqrt(loDelta);  //leave these errors out until we have a better grasp of what they should be.
	//hiDelta = Math.sqrt(hiDelta);

	eff = Math.exp(logEff);
	return (eff - eff*loDelta) + ';' + eff + ';' + (eff + eff*hiDelta);
}

function DESCANTefficiency(logE){
	if(logE < Math.log(1000)){
		return 0;
	} else if(logE > Math.log(5000)){
		return 0;
	} else{
		return 0.27;  //100% efficient * 27% geometric acceptance
	}
}

function SCEPTARefficiency(logE){
	var auxDetectorSelect = document.getElementById('tripleAux'),
	auxDetector = auxDetectorSelect.options[auxDetectorSelect.selectedIndex].value;

	if(auxDetector == 'SCEPTAR')
		return 0.8;
	else if(auxDetector == 'SCEPTARZDS')
		return 0.65;
	else if(auxDetector == 'SCEPTARPACES')
		return 0.4;
	else if(auxDetector == 'PACESZDS')
		return 0.25;
}

/////Dygraph hax/////////////////////////////////////////////////////////////

//hack to cope with the questionable decision to not support logarithmic x-axes:
Dygraph.numericTicks = function(a, b, pixels, opts, dygraph, vals) {
  var pixels_per_tick = /** @type{number} */(opts('pixelsPerLabel'));
  var ticks = [];
  var i, j, tickV, nTicks;
  if (vals) {
    for (i = 0; i < vals.length; i++) {
      ticks.push({v: vals[i]});
    }
  } else {
    // TODO(danvk): factor this log-scale block out into a separate function.
    if (opts("logscale")) {
      nTicks  = Math.floor(pixels / pixels_per_tick);
      var minIdx = Dygraph.binarySearch(a, Dygraph.PREFERRED_LOG_TICK_VALUES, 1);
      var maxIdx = Dygraph.binarySearch(b, Dygraph.PREFERRED_LOG_TICK_VALUES, -1);
      if (minIdx == -1) {
        minIdx = 0;
      }
      if (maxIdx == -1) {
        maxIdx = Dygraph.PREFERRED_LOG_TICK_VALUES.length - 1;
      }
      // Count the number of tick values would appear, if we can get at least
      // nTicks / 4 accept them.
      var lastDisplayed = null;
      if (maxIdx - minIdx >= nTicks / 4) {
        for (var idx = maxIdx; idx >= minIdx; idx--) {
          var tickValue = Dygraph.PREFERRED_LOG_TICK_VALUES[idx];
          var pixel_coord = Math.log(tickValue / a) / Math.log(b / a) * pixels;
          var tick = { v: tickValue };
          if (lastDisplayed === null) {
            lastDisplayed = {
              tickValue : tickValue,
              pixel_coord : pixel_coord
            };
          } else {
            if (Math.abs(pixel_coord - lastDisplayed.pixel_coord) >= pixels_per_tick) {
              lastDisplayed = {
                tickValue : tickValue,
                pixel_coord : pixel_coord
              };
            } else {
              tick.label = "";
            }
          }
          ticks.push(tick);
        }
        // Since we went in backwards order.
        ticks.reverse();
      }
    }

    // ticks.length won't be 0 if the log scale function finds values to insert.
    if (ticks.length === 0) {
      // Basic idea:
      // Try labels every 1, 2, 5, 10, 20, 50, 100, etc.
      // Calculate the resulting tick spacing (i.e. this.height_ / nTicks).
      // The first spacing greater than pixelsPerYLabel is what we use.
      // TODO(danvk): version that works on a log scale.
      var kmg2 = opts("labelsKMG2");
      var mults, base;
      if (kmg2) {
        mults = [1, 2, 4, 8, 16, 32, 64, 128, 256];
        base = 16;
      } else {
        mults = [1, 2, 5, 10, 20, 50, 100];
        base = 10;
      }
      //hack
	  var scaleSelect = document.getElementById("xScale"),
	      scale = scaleSelect.options[scaleSelect.selectedIndex].value;
	  if(scale == 'log'){
	      mults = [1*Math.log(10), 2*Math.log(10), 5*Math.log(10), 10*Math.log(10), 20*Math.log(10), 50*Math.log(10), 100*Math.log(10)]//[Math.log(10)]
    	  base = 10
      }
      //end hack

      // Get the maximum number of permitted ticks based on the
      // graph's pixel size and pixels_per_tick setting.
      var max_ticks = Math.ceil(pixels / pixels_per_tick);

      // Now calculate the data unit equivalent of this tick spacing.
      // Use abs() since graphs may have a reversed Y axis.
      var units_per_tick = Math.abs(b - a) / max_ticks;

      // Based on this, get a starting scale which is the largest
      // integer power of the chosen base (10 or 16) that still remains
      // below the requested pixels_per_tick spacing.
      var base_power = Math.floor(Math.log(units_per_tick) / Math.log(base));
      var base_scale = Math.pow(base, base_power);

      // Now try multiples of the starting scale until we find one
      // that results in tick marks spaced sufficiently far apart.
      // The "mults" array should cover the range 1 .. base^2 to
      // adjust for rounding and edge effects.
      var scale, low_val, high_val, spacing;
      for (j = 0; j < mults.length; j++) {
        scale = base_scale * mults[j];
        low_val = Math.floor(a / scale) * scale;
        high_val = Math.ceil(b / scale) * scale;
        nTicks = Math.abs(high_val - low_val) / scale;
        spacing = pixels / nTicks;
        if (spacing > pixels_per_tick) break;
      }

      // Construct the set of ticks.
      // Allow reverse y-axis if it's explicitly requested.
      if (low_val > high_val) scale *= -1;
      for (i = 0; i <= nTicks; i++) {
        tickV = low_val + i * scale;
        ticks.push( {v: tickV} );
      }
    }
  }

  var formatter = /**@type{AxisLabelFormatter}*/(opts('axisLabelFormatter'));

  // Add labels to the ticks.
  for (i = 0; i < ticks.length; i++) {
    if (ticks[i].label !== undefined) continue;  // Use current label.
    // TODO(danvk): set granularity to something appropriate here.
    ticks[i].label = formatter(ticks[i].v, 0, opts, dygraph);
  }

  return ticks;
};