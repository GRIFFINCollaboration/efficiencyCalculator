function setup(){
	var singlesInput = document.getElementById('inputEnergy'),
		coincInput1 = document.getElementById('coincInputEnergy1'),
		coincInput2 = document.getElementById('coincInputEnergy2');

	//set up singles efficiency widget//////////////////////////
	document.getElementById('inputEnergyLabel').innerHTML = 'keV '+String.fromCharCode(0x2192);
	singlesInput.onchange = function(event){
		var result = efficient(parseFloat(this.value));
		result = result.toFixed(2);
		document.getElementById('effWidgetResult').innerHTML = result;
	}

	//set up coincidence efficiency widget//////////////////////////
	document.getElementById('coincInputEnergyLabel2').innerHTML = 'keV '+String.fromCharCode(0x2192);
	coincInput1.onchange = computeCoincEfficiency.bind(null, 16);
	coincInput2.onchange = computeCoincEfficiency.bind(null, 16);
	
}

function computeCoincEfficiency(nDetectors){
	var e1 = parseFloat(document.getElementById('coincInputEnergy1').value),
		e2 = parseFloat(document.getElementById('coincInputEnergy2').value);

	document.getElementById('coincEffWidgetResult').innerHTML = (efficient(e1)*efficient(e2)*(nDetectors-1)/nDetectors).toFixed(2);
} 

function deployGraph(func){
	var i, x,
		data = 'x, f(x)\n',
		nPoints = 10000,
		min = 0, 
		max = 8;

	for(i=0; i<nPoints; i++){
		x = (max-min)/nPoints*i;
		data += x +','+func.bind(null, x)()+'\n';
	}

	g = new Dygraph(document.getElementById('graphDiv'), data, {
		title: 'Gamma Efficiency v. Energy',
		xlabel: '',
		ylabel: '',
	});
}

function efficient(x){
	var f = Math.exp(-(x-2)*(x-2)/4);
	return f;
}

function exponent(x){
	var f = Math.pow(2, -x);
	return f
}