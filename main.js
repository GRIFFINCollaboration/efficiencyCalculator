function setup(){
	var i, nodes,
		HPGeSwitch = document.getElementById('enableHPGe'),
		LaBr3Switch = document.getElementById('enableLaBr3'),
		SiLiSwitch = document.getElementById('enableSiLi'),
		SCEPTARSwitch = document.getElementById('enableSCEPTAR'),
		switchToBeta = document.getElementById('toBetaPlots'),
		betaReminder = document.getElementById('lookAtBeta'),
		switchToGamma = document.getElementById('toGammaPlots'),
		gammaReminder = document.getElementById('lookAtGamma'),
		detailMessage = 'HPGe, LaBr3, SCEPTAR Simulations: E. Rand<sup>1</sup><br>'
		detailMessage += 'Si(Li) Simulation:  D. Cross<sup>2</sup>, R. Dunlop<sup>1</sup>, W. Mills<sup>3</sup>, Z. -M. Wang<sup>2, 3</sup>, C. Andreoiu<sup>2</sup>, T. Ma<sup>2, 3</sup><br>'
		detailMessage += 'Web App: W. Mills<sup>3</sup><br>'
		detailMessage += '<sup>1</sup> University of Guelph, Guelph, ON, Canada, N1G 2W1<br>'
		detailMessage += '<sup>2</sup> Simon Fraser University, Burnaby, BC, Canada, V5A 1S6<br>'
		detailMessage += '<sup>3</sup> TRIUMF, 4004 Wesbrook Mall, Vancouver, BC, Canada, V6T 2A3<br><br>'
		detailMessage += 'HPGe GEANT4 Simulation: 8th order polynomial fit including SCEPTAR and Delrin vacuum chamber.<br><br>';
		detailMessage +='LaBr3 GEANT4 Simulation: 8th order polynomial fit above 40 keV including SCEPTAR and Delrin vacuum chamber.<br><br>'
		detailMessage +='Si(Li) Simulation: Relative Efficiency curve shape based on formalism referenced in Radiation Detection & Measurement (G.F. Knoll, Wiley 2000).  An '
		detailMessage +='absolute normalization is applied per Masters Thesis of Ryan Dunlop, University of Guelph, 2012, "High-precision branching ratio measurement for the superallowed beta+ emitter 74Rb", based on the analysis of in-beam 80Rb decay.<br><br>'
		detailMessage +='SCEPTAR GEANT4 Simulation: triple Fermi function fit adjusted to asymptotically approach 0.8 '
		detailMessage +='at high Q per experiment.  Low-Q position efficiencies fixed to 0.065% per simulated annihilation photopeak efficiency.<br><br>'
		detailMessage +='The following four configuration efficiencies are based on solid angle coverage of detectors:<br>'
		detailMessage +='DESCANT: 27% efficient between 1 and 5 MeV; efficiency lower outside this range, and no value is reported here.<br>'
		detailMessage +='SCEPTAR + ZDS: 65% efficient.<br>'
		detailMessage +='SCEPTAR + PACES: 40% efficient.<br>'
		detailMessage +='PACES + ZDS: 25% efficient.'
	//call the parameter dump
	loadParameters();
	loadLaBrParameters();
	loadSCEPTARParameters();
	//SiLi parameters taken from presentation by D. Cross, simulations from Ma & Wang
	//last parameter is an overall normalization to fix eff(603keV) = 0.0342, per
	//Masters Thesis of Ryan Dunlop, University of Guelph, 2012, 
	//High-precision branching ratio measurement for the superallowed beta+ emitter 74Rb
	SiLiCoef = {};
	SiLiCoef['detector'] = [71.131, 7.97308, -0.474268, -0.00120224, 1.40317, .0342/104.30174050118521];

	//Set up color codes
	colorCodes = {};
	colorCodes['HPGe'] = '#449944';
	colorCodes['LaBr3'] = '#e67e22';
	colorCodes['SiLi'] = '#2980b9';
	colorCodes['DESCANT'] = '#8e44ad';
	colorCodes['SCEPTAR'] = '#c0392b';
	colorCodes['SCEPTARZDS'] = '#c0392b';
	colorCodes['SCEPTARPACES'] = '#c0392b';
	colorCodes['PACESZDS'] = '#f1c40f';

	//set up gamma control panel//////////////////////////////////////
	HPGeSwitch.enabled = 0;
	HPGeSwitch.onclick = function(event){
		if (this.enabled){
			this.style.backgroundColor = '#444444';
			this.enabled = 0;
		} else{
			this.style.backgroundColor = '#449944';
			this.enabled = 1;
		}
		toggleHPGeControls();
		chooseGraphs();
	}
	LaBr3Switch.enabled = 0;
	LaBr3Switch.onclick = function(event){
		if (this.enabled){
			this.style.backgroundColor = '#444444';
			this.enabled = 0;
		} else{
			this.style.backgroundColor = '#e67e22';
			this.enabled = 1;
		}
		chooseGraphs();
	}
	SiLiSwitch.enabled = 0;
	SiLiSwitch.onclick = function(event){
		if (this.enabled){
			this.style.backgroundColor = '#444444';
			this.enabled = 0;
		} else{
			this.style.backgroundColor = '#2980b9';
			this.enabled = 1;
		}
		chooseGraphs();
	}
	switchToBeta.onclick = function(){
		document.getElementById('plots').shuffleTo(1);
		repaintBeta(b); //repaint to make sure the saved image has the right view-dependent imprint
	}
	//same as switchToBeta:
	betaReminder.onclick = function(){
		document.getElementById('plots').shuffleTo(1);
		repaintBeta(b); //repaint to make sure the saved image has the right view-dependent imprint
	}

	//make sure the file name for image saving gets passed around:
	document.getElementById('filename').onchange = function(){
		//set the filename to whatever the user has requested:
		document.getElementById('savePlot').download = this.value;
	}
	//and similarly for the csv filename:
	document.getElementById('CSVfilename').onchange = function(){
		//set the filename to whatever the user has requested:
		document.getElementById('downloadGammaCSV').download = this.value;
	}	
	document.getElementById('betaFilename').onchange = function(){
		//set the filename to whatever the user has requested:
		document.getElementById('saveBetaPlot').download = this.value;
	}
	//and similarly for the csv filename:
	document.getElementById('betaCSVfilename').onchange = function(){
		//set the filename to whatever the user has requested:
		document.getElementById('downloadBetaCSV').download = this.value;
	}

	//default No. HPGe to 12:
	document.getElementById('nHPGeSwitch').value = 12;

	//default summing to per clover:
	document.getElementById('summingScheme').value = 'clover';

	//repaint the plot when anything in the form changes:
	document.getElementById('plotOptions').onchange = chooseGraphs;

	//setup beta control panel//////////////////////////////////
	SCEPTARSwitch.enabled = 1; //SCEPTAR is the only beta plot now, so always active
	SCEPTARSwitch.onclick = chooseBetaGraphs;

	switchToGamma.onclick = function(){
		document.getElementById('plots').shuffleTo(0);
		repaint(g); //repaint to make sure the saved image has the right view-dependent imprint
	}
	gammaReminder.onclick = function(){
		document.getElementById('plots').shuffleTo(0);
		repaint(g); //repaint to make sure the saved image has the right view-dependent imprint
	}

	//beta plot range control//////////////////////////////////////
	document.getElementById('betaPlotOptions').onchange = chooseBetaGraphs;

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

    document.getElementById('BrIcc').onclick = function(){
        window.open('http://bricc.anu.edu.au/', 'BrIcctab');
    };    

    document.getElementById('details').onclick = function(){
    	if(!document.getElementById('warning'))
	        confirm('GRIFFIN Simulated Efficiency Calculator', detailMessage)
    };    

    //make sure the plot area is a sane size:
    document.getElementById('graphDiv').style.width = (window.innerWidth - document.getElementById('controlPanel').offsetWidth)*0.95;
    document.getElementById('graphDiv').style.height = document.getElementById('controlPanel').offsetHeight*1.05;
    document.getElementById('betaGraphDiv').style.width = (window.innerWidth - document.getElementById('controlPanel').offsetWidth)*0.95;
    document.getElementById('betaGraphDiv').style.height = document.getElementById('controlPanel').offsetHeight*1.05;
    document.getElementById('plots').style.height = document.getElementById('controlPanel').offsetHeight*1.1;

    //Set up widgets///////////////////////////////////////////////////////////////////////
    //Singles
    document.getElementById('singlesForm').onchange = computeSingles.bind(null);

    //Coincidences
    document.getElementById('coincidenceWidget').whichInput = 0;
    document.getElementById('coincForm').onchange = computeCoincidence.bind(null);    

    //Triples
    document.getElementById('triplesWidget').whichInput = 0;
    document.getElementById('triplesForm').onchange = computeTriples.bind(null);     

    //must validate by hand until FF implements number-type inputs:
    nodes = document.querySelectorAll('input.widgetInput')
    for(i=0; i<nodes.length; i++ ){
    	nodes[i].onchange = validateNumber.bind(null, nodes[i].id);
    }

	//default to on for demo:
	HPGeSwitch.onclick();
	LaBr3Switch.onclick();
	SiLiSwitch.onclick();
	SCEPTARSwitch.onclick();
	//evaluate all widgets at defaults
	computeSingles();
	computeCoincidence();
	computeTriples();

}

//decide which plots to send to a call to deployGraph for gamma plots
function chooseGraphs(){
	var funcs = [],
		titles = [],
		colors = [],
		min = parseFloat(document.getElementById('xMin').value),
		max = parseFloat(document.getElementById('xMax').value),
		HPGeMinCoef = {},
		HPGeMaxCoef = {},
		HPGeString, LaBrString, SiLiString, i;

	HPGeMinCoef['dummy'] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	HPGeMaxCoef['dummy'] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	//make sure specified plot maxima aren't silly:
	document.getElementById('xMax').min = parseFloat(document.getElementById('xMin').value);
	document.getElementById('yMax').min = parseFloat(document.getElementById('yMin').value);

	if(document.getElementById('enableHPGe').enabled){
		HPGeString = constructPlotKey();
		window.HPGeFunc = HPGeEfficiency.bind(null, HPGeCoef[HPGeString], HPGeMinCoef['dummy'], HPGeMaxCoef['dummy']);
		funcs[funcs.length] = window.HPGeFunc;
		titles[titles.length] = 'HPGe';
		colors[colors.length] = colorCodes['HPGe'];
	}
	if(document.getElementById('enableLaBr3').enabled){
		LaBrString = constructLaBrPlotKey();
		window.LaBrFunc = LaBrEfficiency.bind(null, LaBrCoef[LaBrString], HPGeMinCoef['dummy'], HPGeMaxCoef['dummy']);
		funcs[funcs.length] = window.LaBrFunc;
		titles[titles.length] = 'LaBr3';
		colors[colors.length] = colorCodes['LaBr3'];
	}
	if(document.getElementById('enableSiLi').enabled){
		SiLiString = constructSiLiPlotKey();
		window.SiLiFunc = SiLiEfficiency.bind(null, SiLiCoef[SiLiString], HPGeMinCoef['dummy'], HPGeMaxCoef['dummy']);
		funcs[funcs.length] = window.SiLiFunc;
		titles[titles.length] = 'Si(Li)';
		colors[colors.length] = colorCodes['SiLi'];
	}

	deployGraph(funcs, titles, colors, min, max);
}

//as chooseGraphs but for beta plots
function chooseBetaGraphs(){
	var funcs = [],
		titles = [],
		colors = [],
		min = parseFloat(document.getElementById('betaxMin').value),
		max = parseFloat(document.getElementById('betaxMax').value),
		HPGeMinCoef = {},
		HPGeMaxCoef = {},
		SCEPTARString, i;

	HPGeMinCoef['dummy'] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	HPGeMaxCoef['dummy'] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	//make sure specified plot maxima aren't silly:
	document.getElementById('betaxMax').min = parseFloat(document.getElementById('betaxMin').value);
	document.getElementById('betayMax').min = parseFloat(document.getElementById('betayMin').value);

	//should always be true for now
	if(document.getElementById('enableSCEPTAR').enabled){
		SCEPTARString = constructSCEPTARPlotKey();
		window.SCEPTARFunc = SCEPTAREfficiency.bind(null, SCEPTARCoef[SCEPTARString], HPGeMinCoef['dummy'], HPGeMaxCoef['dummy']);
		funcs[funcs.length] = window.SCEPTARFunc;
		titles[titles.length] = 'SCEPTAR';
		colors[colors.length] = colorCodes['SCEPTAR'];
	}
	
	deployBetaGraph(funcs, titles, colors, min, max);
}

//deploy graphs of [func]tions with [titles]
function deployGraph(func, titles, colors, min, max){
	var i, j, logx, deltaLow, deltaHigh, eff, textBlob,
		scaleSelect = document.getElementById("xScale"),
	    scale = scaleSelect.options[scaleSelect.selectedIndex].value; 
		isLog = (scale == 'lin') ? '' : 'Log ',
	    CSV = isLog + 'Energy[keV]',
		data = isLog + 'Energy[keV]',
		nPoints = 1000,
		yScaleSelect = document.getElementById("yScale"),
	    yScale = yScaleSelect.options[yScaleSelect.selectedIndex].value;
	    if(yScale=='true') yScale = true;
	    else yScale = false;
	    //don't let the user switch to log scale with a 0 min
	    if(yScale && parseFloat(document.getElementById('yMin').value)==0 )
	    	document.getElementById('yMin').value = 0.001;

	for(i=0; i<titles.length; i++){
		data += ', '+titles[i];
		CSV += ', '+titles[i];
	}
	data += '\n';
    CSV += '\n';

	for(i=0; i<nPoints+1; i++){
			if(scale=='lin'){
				logx = (max-min)/nPoints*i+min;
				data += logx;
				CSV += logx;
				logx = Math.log(logx);
			} else{
				logx = (Math.log(max)-Math.log(min))/nPoints*i+Math.log(min);
				data += logx;
				CSV += logx;
			}
			for(j=0; j<func.length; j++){
				data+=',';
				CSV += ', '
				eff = func[j].bind(null, logx)();
				data += eff;
				CSV += eff.slice(0, eff.indexOf(';'));
			}
			data += '\n';
			CSV += '\n';
	}

    //Greg's request: log CSV values every keV for nice values on linear scale; don't bother on log scale
    if(scale == 'lin'){
    	CSV = CSV.slice(0, CSV.indexOf('\n')) + '\n'; //keep the header, redo the rest
		for(i=0; i<max-min+1; i++){
			CSV += min + i;
			for(j=0; j<func.length; j++){
				CSV += ', ';
				eff = func[j].bind(null, Math.log(min+i) )();
				CSV += eff.slice(0, eff.indexOf(';'));
			}
			CSV += '\n';
		}
	}

	textBlob = new Blob([CSV], {type: 'text/plain'});
    URL.revokeObjectURL(window.textBlobURL);
    window.textBlobURL = URL.createObjectURL(textBlob);
    document.getElementById('downloadGammaCSV').setAttribute('href', window.textBlobURL);

	g = new Dygraph(document.getElementById('graphDiv'), data, {
		title: 'Simulated Efficiency v. Energy',
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
		logscale: yScale,
		titleHeight: 30,
		xLabelHeight: 24,
		yLabelWidth: 24,
		yAxisLabelWidth: 75,
		axes:{
			x: {
				valueFormatter: function(number, opts, dygraph){
					if(scale=='log')
						return Math.exp(number).toFixed() + ' keV';
					else
						return number.toFixed() + ' keV';
				},
				axisLabelFormatter: function(number, gran, opts, dygraph){
					if(scale=='lin')
						return Math.round(number);
					else
						return Math.round(Math.exp(number));
				}
			},
			y: {
				axisLabelFormatter: function(number, gran, opts, dygraph){
					if(number<0.1){
						return number.toExponential(1)
					} else
						return number.toFixed(2);
				}				
			}
		}
	});

	g.updateOptions({
		drawCallback: repaint,
	});

	repaint(g);

}

//deploy graphs of [func]tions with [titles] for beta plots
function deployBetaGraph(func, titles, colors, min, max){
	var i, j, logx, deltaLow, deltaHigh, eff, textBlob,
		scaleSelect = document.getElementById("betaxScale"),
	    scale = scaleSelect.options[scaleSelect.selectedIndex].value;
	    isLog = (scale == 'lin') ? '' : 'Log ',
		data = isLog + 'Q [keV]',
		CSV = isLog + 'Q [keV]',
		nPoints = 1000,

		yScaleSelect = document.getElementById("betayScale"),
	    yScale = yScaleSelect.options[yScaleSelect.selectedIndex].value;
	    if(yScale=='true') yScale = true;
	    else yScale = false;
	    //don't let the user switch to log scale with a 0 min
	    if(yScale && parseFloat(document.getElementById('betayMin').value)==0 )
	    	document.getElementById('betayMin').value = 0.001;

	for(i=0; i<titles.length; i++){
		data += ', '+titles[i];
		CSV += ', '+titles[i];
	}
	data += '\n';
	CSV += '\n';

	for(i=0; i<nPoints+1; i++){
			if(scale=='lin'){
				logx = (max-min)/nPoints*i+min;
				data += logx;
				CSV += logx;
				logx = Math.log(logx);
			} else{
				logx = (Math.log(max)-Math.log(min))/nPoints*i+Math.log(min);
				data += logx;
				CSV += logx;
			}
			for(j=0; j<func.length; j++){
				data+=',';
				CSV +=', '
				eff = func[j].bind(null, logx)();
				data += eff;
				CSV += eff.slice(0, eff.indexOf(';'));
			}
			data += '\n';
			CSV += '\n';
	}

    //Greg's request: log CSV values every keV for nice values on linear scale; don't bother on log scale
    if(scale == 'lin'){
    	CSV = CSV.slice(0, CSV.indexOf('\n')) + '\n'; //keep the header, redo the rest
		for(i=0; i<max-min+1; i++){
			CSV += min + i;
			for(j=0; j<func.length; j++){
				CSV += ', ';
				eff = func[j].bind(null, Math.log(min+i) )();
				CSV += eff.slice(0, eff.indexOf(';'));
			}
			CSV += '\n';
		}
	}

	textBlob = new Blob([CSV], {type: 'text/plain'});
    URL.revokeObjectURL(window.betaTextBlobURL);
    window.betaTextBlobURL = URL.createObjectURL(textBlob);
    document.getElementById('downloadBetaCSV').setAttribute('href', window.betaTextBlobURL);

	b = new Dygraph(document.getElementById('betaGraphDiv'), data, {
		title: 'Simulated Efficiency v. Q',
		xlabel: 'Q [keV]',
		ylabel: 'Efficiency',
		sigFigs: 2,
		strokeWidth: 4,
		colors: colors,
		highlightCircleSize: 6,
		labelsSeparateLines : true,
		clickCallback : passClickToWidget,
		legend: 'always',
		customBars: true,
		logscale: yScale,
		titleHeight: 30,
		xLabelHeight: 24,
		yLabelWidth: 24,
		yAxisLabelWidth: 75,
		axes:{
			x: {
				valueFormatter: function(number, opts, dygraph){
					if(scale=='log')
						return Math.exp(number).toFixed() + ' keV';
					else
						return number.toFixed() + ' keV';
				},
				axisLabelFormatter: function(number, gran, opts, dygraph){
					if(scale=='lin')
						return Math.round(number);
					else
						return Math.round(Math.exp(number));
				}
			},
			y: {
				axisLabelFormatter: function(number, gran, opts, dygraph){
					if(number<0.1){
						return number.toExponential(1)
					} else
						return number.toFixed(2);
				}				
			}
		}
	});

	b.updateOptions({
		drawCallback: repaintBeta,
	});

	repaintBeta(b);

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

//LaBr's only option is summing per detector or over the whole array, and we're not interested in the array option.
function constructLaBrPlotKey(){
		return 'detector';
}

function constructSiLiPlotKey(){
		return 'detector';
}

function constructSCEPTARPlotKey(){
	var leptonOptions = document.getElementById('lepton'),
		lepton = leptonOptions.options[leptonOptions.selectedIndex].value,
		zOptions = document.getElementById('parentZ'),
		z = zOptions.options[zOptions.selectedIndex].value,
		thresholdOptions = document.getElementById('betaThreshold'),
		threshold = thresholdOptions.options[thresholdOptions.selectedIndex].value,
		plotKey = ''+lepton+z+threshold;

		return plotKey;
}

//callback to run every time the function repaints
function repaint(dygraph){
	var xMin = document.getElementById('xMin'),
		xMax = document.getElementById('xMax'),
		yMin = document.getElementById('yMin'),
		yMax = document.getElementById('yMax'),
		scaleSelect = document.getElementById("xScale"),
	    scale = scaleSelect.options[scaleSelect.selectedIndex].value;

	prepImageSave(dygraph, 'savePlot');

	if(scale=='lin'){
		xMin.value = g.xAxisRange()[0].toFixed();
		xMax.value = g.xAxisRange()[1].toFixed();
	}else{
		xMin.value = Math.exp(g.xAxisRange()[0]).toFixed();
		xMax.value = Math.exp(g.xAxisRange()[1]).toFixed();
	}
	yMin.value = g.yAxisRange()[0].toFixed(2);
	yMax.value = g.yAxisRange()[1].toFixed(2);

	//FF form validation shenanigans again:
	validateNumber('xMin');
	validateNumber('xMax');
	validateNumber('yMin');
	validateNumber('yMax');

	computeSingles();
	computeCoincidence();
	computeTriples();

}

//callback to run every time the function repaints the beta plots
function repaintBeta(dygraph){
	var xMin = document.getElementById('betaxMin'),
		xMax = document.getElementById('betaxMax'),
		yMin = document.getElementById('betayMin'),
		yMax = document.getElementById('betayMax'),
		scaleSelect = document.getElementById("betaxScale"),
	    scale = scaleSelect.options[scaleSelect.selectedIndex].value;

	prepImageSave(dygraph, 'saveBetaPlot');

	if(scale=='lin'){
		xMin.value = b.xAxisRange()[0].toFixed();
		xMax.value = b.xAxisRange()[1].toFixed();
	}else{
		xMin.value = Math.exp(b.xAxisRange()[0]).toFixed();
		xMax.value = Math.exp(b.xAxisRange()[1]).toFixed();
	}
	yMin.value = b.yAxisRange()[0].toFixed(2);
	yMax.value = b.yAxisRange()[1].toFixed(2);

	//FF form validation shenanigans again:
	validateNumber('betaxMin');
	validateNumber('betaxMax');
	validateNumber('betayMin');
	validateNumber('betayMax');

	computeSingles();
	computeCoincidence();
	computeTriples();

}