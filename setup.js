function setup(){
	var HPGeSwitch = document.getElementById('enableHPGe'),
		DANTESwitch = document.getElementById('enableDANTE'),
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
		} else{
			this.style.backgroundColor = '#449944';
			this.enabled = 1;
		}

	}
	//default HPGe to on:
	HPGeSwitch.onclick();
	DANTESwitch.enabled = 0;
	DANTESwitch.onclick = function(event){
		if (this.enabled){
			this.style.backgroundColor = '#444444';
			this.enabled = 0;
		} else{
			this.style.backgroundColor = '#e67e22';
			this.enabled = 1;
		}

	}
	LEPSSwitch.enabled = 0;
	LEPSSwitch.onclick = function(event){
		if (this.enabled){
			this.style.backgroundColor = '#444444';
			this.enabled = 0;
		} else{
			this.style.backgroundColor = '#2980b9';
			this.enabled = 1;
		}

	}

	//set up singles efficiency widget//////////////////////////
	document.getElementById('inputEnergyLabel').innerHTML = 'keV '+String.fromCharCode(0x2192);
	singlesInput.onchange = computeSinglesEfficiency.bind(null);

	//set up coincidence efficiency widget//////////////////////////
	document.getElementById('coincInputEnergyLabel2').innerHTML = 'keV '+String.fromCharCode(0x2192);
	coincInput1.onchange = computeCoincEfficiency.bind(null, 16);
	coincInput2.onchange = computeCoincEfficiency.bind(null, 16);
	
}

function computeSinglesEfficiency(){
	var result = efficient(parseFloat(document.getElementById('inputEnergy').value));
	result = result.toFixed(2);
	document.getElementById('effWidgetResult').innerHTML = result;
}

function computeCoincEfficiency(nDetectors){
	var e1 = parseFloat(document.getElementById('coincInputEnergy1').value),
		e2 = parseFloat(document.getElementById('coincInputEnergy2').value);

	document.getElementById('coincEffWidgetResult').innerHTML = (efficient(e1)*efficient(e2)*(nDetectors-1)/nDetectors).toFixed(2);
} 

function deployGraph(func){
	var i, x,
		data = 'Energy[keV], Efficiency\n',
		nPoints = 10000,
		min = 0, 
		max = 8;

	for(i=0; i<nPoints; i++){
		x = parseFloat(((max-min)/nPoints*i).toFixed(2));
		data += x +','+func.bind(null, x)()+'\n';
	}

	g = new Dygraph(document.getElementById('graphDiv'), data, {
		//labels: ['X', 'HPGe'],
		title: 'Gamma Efficiency v. Energy',
		xlabel: '',
		ylabel: '',
		sigFigs: 2,
		strokeWidth: 4,
		colors: ['#449944', '#e67e22', '#2980b9'],
		highlightCircleSize: 6
	});
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
	var f = Math.exp(-(x-6)*(x-6)/16);
	return f;
}

function exponent(x){
	var f = Math.pow(2, -x);
	return f
}