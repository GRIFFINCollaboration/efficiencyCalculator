function setup(){
	var HPGeSwitch = document.getElementById('enableHPGe'),
		LaBr3Switch = document.getElementById('enableLaBr3'),
		SiLiSwitch = document.getElementById('enableSiLi'),
		detailMessage = 'HPGe Simulation: 8th order polynomial fit.<br>LaBr3 Simulation: 8th order polynomial fit above 40 keV.<br>DESCANT: 27% efficient between 1 and 5 MeV, currently 0 elsewhere.<br>SCEPTAR: 80% efficient.<br>SCEPTAR + ZDS: 65% efficient.<br>SCEPTAR + PACES: 40% efficient.<br>PACES + ZDS: 25% efficient.';

	//call the parameter dump
	loadParameters();
	loadLaBrParameters();
	//SiLi parameters taken from CITATION NEEDED
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

	//set up control panel//////////////////////////////////////
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

	//make sure the file name for image saving gets passed around:
	document.getElementById('filename').onchange = function(){
		//set the filename to whatever the user has requested:
		document.getElementById('savePlot').download = this.value;
	}

	//plot range control//////////////////////////////////////
	document.getElementById('xMin').onchange = chooseGraphs;
	document.getElementById('xMax').onchange = chooseGraphs;
	document.getElementById('yMin').onchange = chooseGraphs;
	document.getElementById('yMax').onchange = chooseGraphs;
	document.getElementById('yScale').onchange = chooseGraphs;

	//default No. HPGe to 12:
	document.getElementById('nHPGeSwitch').value = 12;

	//default summing to per clover:
	document.getElementById('summingScheme').value = 'clover';

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

    document.getElementById('BrIcc').onclick = function(){
        window.open('http://bricc.anu.edu.au/', 'BrIcctab');
    };    

    document.getElementById('details').onclick = function(){
        confirm('GRIFFIN Simulated Efficiency Calculator', detailMessage)
    };    

    //make sure the plot area is a sane size:
    document.getElementById('graphDiv').style.width = (window.innerWidth - document.getElementById('controlPanel').offsetWidth)*0.95;
    document.getElementById('graphDiv').style.height = document.getElementById('controlPanel').offsetHeight*1.05;

    //Set up widgets///////////////////////////////////////////////////////////////////////
    //Singles
    document.getElementById('singlesForm').onchange = computeSingles.bind(null);

    //Coincidences
    document.getElementById('coincidenceWidget').whichInput = 0;
    document.getElementById('coincForm').onchange = computeCoincidence.bind(null);    

    //Triples
    document.getElementById('triplesWidget').whichInput = 0;
    document.getElementById('triplesForm').onchange = computeTriples.bind(null);     

	//default to on for demo:
	HPGeSwitch.onclick();
	LaBr3Switch.onclick();
	SiLiSwitch.onclick();

	//evaluate all widgets at defaults
	computeSingles();
	computeCoincidence();
	computeTriples();

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
		HPGeString, LaBrString, SiLiString, i;

	HPGeMinCoef['dummy'] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	HPGeMaxCoef['dummy'] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	if(document.getElementById('enableHPGe').enabled){
		HPGeString = constructPlotKey();
		window.HPGeFunc = HPGeEfficiency.bind(null, HPGeCoef[HPGeString], HPGeMinCoef['dummy'], HPGeMaxCoef['dummy']);
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
	if(document.getElementById('enableSiLi').enabled){
		SiLiString = constructSiLiPlotKey();
		window.SiLiFunc = SiLiEfficiency.bind(null, SiLiCoef[SiLiString], HPGeMinCoef['dummy'], HPGeMaxCoef['dummy']);
		funcs[funcs.length] = window.SiLiFunc;
		titles[titles.length] = 'Si(Li)';
		colors[colors.length] = '#2980b9';
	}

	deployGraph(funcs, titles, colors, min, max);
}

//deploy graphs of [func]tions with [titles]
function deployGraph(func, titles, colors, min, max){
	var i, j, logx, deltaLow, deltaHigh, eff,
		data = 'Energy[keV]',
		nPoints = 1000,
		scaleSelect = document.getElementById("xScale"),
	    scale = scaleSelect.options[scaleSelect.selectedIndex].value;
		yScaleSelect = document.getElementById("yScale"),
	    yScale = yScaleSelect.options[yScaleSelect.selectedIndex].value;
	    if(yScale=='true') yScale = true;
	    else yScale = false;
	    //don't let the user switch to log scale with a 0 min
	    if(yScale && parseFloat(document.getElementById('yMin').value)==0 )
	    	document.getElementById('yMin').value = 0.001;

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
	yMin.value = g.yAxisRange()[0].toFixed(2);
	yMax.value = g.yAxisRange()[1].toFixed(2);

	computeSingles();
	computeCoincidence();
	computeTriples();

}