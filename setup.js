function setup(){
	var HPGeSwitch = document.getElementById('enableHPGe'),
		LaBr3Switch = document.getElementById('enableLaBr3'),
		LEPSSwitch = document.getElementById('enableLEPS'),
		singlesInput = document.getElementById('inputEnergy'),
		coincInput1 = document.getElementById('coincInputEnergy1'),
		coincInput2 = document.getElementById('coincInputEnergy2');

	//call the parameter dump
	loadParameters();

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

	//default x axis to log
	document.getElementById('xScale').value = 'log';
	document.getElementById('xScale').onchange = chooseGraphs.bind(null);

	//button setup//////////////////////////////////////////////
    document.getElementById('wikiLink').onclick = function(){
        window.location = 'https://www.triumf.info/wiki/tigwiki/index.php/GRIFFIN_User%27s_Web_Toolkit';
    };
    document.getElementById('yieldDB').onclick = function(){
        window.location = 'http://mis.triumf.ca/science/planning/yield/beam';
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
	//LaBr3Switch.onclick();
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
		max = parseFloat(document.getElementById('xMax').value),
		HPGeMinCoef = {},
		HPGeMaxCoef = {},
		requestString, i;

	//HPGeCoef holds the coefficients for all HPGe fits in a key value store
	//where the key is the string concatenation of all the control panel values in 
	//the order:
	//summing scheme + nDetectors + HPGe Distance + Delrin thickness
	//so 'clover1214.520' is 12 detectors at 14.5cm with 20mm delrin and per-clover summing.
	//HPGeCoef['clover811.00'] = [-8.0309801002962706e+02, 1.1187177193972436e+03, -6.7413427087340233e+02, 2.2869743662093572e+02, -4.7716717011091916e+01, 6.2669769394841666e+00, -5.0603869584892447e-01, 2.2979902406689505e-02, -4.4966824986778788e-04];
	//HPGeMinCoef and HPGeMaxCoef are packed the same way as HPGeCoef, but hold the 1-sigma extrema for the coefficients:
	HPGeMinCoef['dummy'] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	HPGeMaxCoef['dummy'] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	if(document.getElementById('enableHPGe').enabled){
		requestString = 'clover811.00';
		funcs[funcs.length] = HPGeEfficiency.bind(null, HPGeCoef[requestString], HPGeMinCoef['dummy'], HPGeMaxCoef['dummy']);
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
	var i, j, logx, deltaLow, deltaHigh, eff,
		data = 'Energy[keV]',
		nPoints = 1000,
		scaleSelect = document.getElementById("xScale"),
	    scale = scaleSelect.options[scaleSelect.selectedIndex].value;


	for(i=0; i<titles.length; i++){
		data += ', '+titles[i];
	}
	data += '\n';

	for(i=0; i<nPoints; i++){
			if(scale=='lin'){
				logx = parseFloat( ( (max-min)/nPoints*i+min ).toFixed(2) );
				data += logx;
				logx = Math.log(logx);
			} else{
				logx = parseFloat( ( (Math.log(max)-Math.log(min))/nPoints*i+Math.log(min) ).toFixed(2) );
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
		xMin.value = parseFloat(g.xAxisRange()[0].toFixed(2));
		xMax.value = parseFloat(g.xAxisRange()[1].toFixed(2));
	}else{
		xMin.value = Math.exp(parseFloat(g.xAxisRange()[0].toFixed(2)));
		xMax.value = Math.exp(parseFloat(g.xAxisRange()[1].toFixed(2)));
	}
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