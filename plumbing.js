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

function toggleHPGeControls(){
	if(document.getElementById('enableHPGe').enabled){
		document.getElementById('HPGeControl').style.height = '21em';
	} else{
		document.getElementById('HPGeControl').style.height = 0;
	}
}

//generate a hidden image and send its data uri to the appropriate place for saving:
function prepImageSave(dygraph){
	var options = {
	    //Texts displayed below the chart's x-axis and to the left of the y-axis 
	    titleFont: "bold 30px sans-serif",
	    titleFontColor: "black",

	    //Texts displayed below the chart's x-axis and to the left of the y-axis 
	    axisLabelFont: "bold 24px sans-serif",
	    axisLabelFontColor: "black",

	    // Texts for the axis ticks
	    labelFont: "normal 18px sans-serif",
	    labelFontColor: "black",

	    // Text for the chart legend
	    legendFont: "bold 18px sans-serif",
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
/*
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
*/
	//singles rate
	rateInput.value = reportEnergy;
	rateInput.onchange();
}

// http://stackoverflow.com/a/934925/298479 + hax
function getBase64Image(img) {
	var summingOptions = document.getElementById('summingScheme'),
		summing = summingOptions.options[summingOptions.selectedIndex].value,
		nHPGeOptions = document.getElementById('nHPGeSwitch'),
		nHPGe = nHPGeOptions.options[nHPGeOptions.selectedIndex].value,
		HPGeDistanceOptions = document.getElementById('HPGeDistanceSwitch'),
		HPGeDistance = HPGeDistanceOptions.options[HPGeDistanceOptions.selectedIndex].value,
		absorberOptions = document.getElementById('delrinSwitch'),
		absorber = absorberOptions.options[absorberOptions.selectedIndex].value;

    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    //construct parameter report to imprint on canvas
    ctx.font = '24px sans-serif';
    ctx.fillText('No. HPGe: ' + nHPGe, img.width-ctx.measureText('HPGe Distance: ' + HPGeDistance + ' cm').width-20, 90);
    ctx.fillText('HPGe Distance: ' + HPGeDistance + ' cm', img.width-ctx.measureText('HPGe Distance: ' + HPGeDistance + ' cm').width-20, 115);
    ctx.fillText('Absorber: ' + absorber + ' mm Delrin', img.width-ctx.measureText('HPGe Distance: ' + HPGeDistance + ' cm').width-20, 140);
    ctx.fillText('Addback: ' + summing, img.width-ctx.measureText('HPGe Distance: ' + HPGeDistance + ' cm').width-20, 165);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
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

function sciNot(val, sig){
	if(val>100 || val<1){
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
    injectDOM('p', 'warning', 'tempDiv', {'style':'padding: 1em; font-size:120%; line-height:1.5; text-align:left', 'innerHTML':detailText});

    //insert submit & abort button
    injectDOM('input', 'abortChoice', 'tempDiv', {
        'class' : 'standardButton',
        'style' : 'width:auto; height:auto; padding:0.5em; margin-bottom:1em',
        'type' : 'button',
        'value' : 'Dismiss'
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