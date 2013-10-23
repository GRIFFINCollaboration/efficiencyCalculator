function computeSingles(){
	var energy = Math.log(parseFloat(document.getElementById('singlesInputEnergy').value)),
		BR = parseFloat(document.getElementById('singlesBR').value),
		intensity = parseFloat(document.getElementById('singlesIntensity').value),
		DC = parseFloat(document.getElementById('singlesDutyCycle').value),
		detectorSelect = document.getElementById('singlesDetectors'),
		detector = detectorSelect.options[detectorSelect.selectedIndex].value,
		periodSelect = document.getElementById("singlesPeriod"),
		period = parseFloat(periodSelect.options[periodSelect.selectedIndex].value),
		nCounts = parseFloat(document.getElementById('nSingles').value),
		efficiency, nSeconds, unit;

	//choose the appropriate function and evaluate it at <energy>
	efficiency = chooseFunction(detector).bind(null, energy)();
	efficiency = parseFloat(efficiency.slice(efficiency.indexOf(';')+1, efficiency.lastIndexOf(';') ));

	//write efficiency to widget
	document.getElementById('singlesEfficiency').innerHTML = (efficiency > 0.1) ? efficiency.toFixed(2) : sciNot(efficiency, 1);

	//rate
	document.getElementById('singlesRate').innerHTML = sciNot(intensity*DC*BR*efficiency*period, 2);

	//time to accrue:
	nSeconds = nCounts/(intensity*DC*BR*efficiency);
	unit = chooseTimeUnit(nSeconds);
	if(intensity*DC*BR*efficiency != 0)
		document.getElementById('nSinglesTime').innerHTML = sciNot(nSeconds/unit[0], 2)+' '+unit[1];
	else 
		document.getElementById('nSinglesTime').innerHTML = String.fromCharCode(0x221E);

	//set colors correctly
	assignSinglesColor(['singlesEfficiency', 'singlesRate', 'nSinglesTime']);
	
}

function computeCoincidence(){
	var e1 = Math.log(parseFloat(document.getElementById('coincEnergy1').value)),
		e2 = Math.log(parseFloat(document.getElementById('coincEnergy2').value)),
		BR1 = parseFloat(document.getElementById('coincBR1').value),
		BR2 = parseFloat(document.getElementById('coincBR2').value),
		intensity = parseFloat(document.getElementById('coincIntensity').value),
		DC = parseFloat(document.getElementById('coincDutyCycle').value),
		detectorASelect = document.getElementById('coincDetectorsA'),
		detectorA = detectorASelect.options[detectorASelect.selectedIndex].value,
		detectorBSelect = document.getElementById('coincDetectorsB'),
		detectorB = detectorBSelect.options[detectorBSelect.selectedIndex].value,
		periodSelect = document.getElementById("coincPeriod"),
		period = parseFloat(periodSelect.options[periodSelect.selectedIndex].value),
		nHPGeSelect = document.getElementById("nHPGeSwitch"),
		nHPGe = parseFloat(nHPGeSelect.options[nHPGeSelect.selectedIndex].value),
		nCounts = parseFloat(document.getElementById('nCoinc').value),
		eff1, eff2, efficiency, nSeconds, unit, countingFactor;

	//choose the appropriate function and evaluate it at <e1> and <e2>
	eff1 = chooseFunction(detectorA).bind(null, e1)();
	eff1 = parseFloat(eff1.slice(eff1.indexOf(';')+1, eff1.lastIndexOf(';') ));
	eff2 = chooseFunction(detectorB).bind(null, e2)();
	eff2 = parseFloat(eff2.slice(eff2.indexOf(';')+1, eff2.lastIndexOf(';') ));

	//compute counting factor:
	countingFactor = 1;
	if(detectorA == detectorB){
		if(detectorA == 'HPGe')
			countingFactor = (nHPGe-1) / nHPGe;
		else if(detectorA == 'LaBr3')
			countingFactor = 7/8;
		else if(detectorA == 'SiLi')
			countingFactor = 4/5;
	}

	//compute efficiency
	efficiency = eff1*eff2*countingFactor;
	document.getElementById('coincEfficiency').innerHTML = (efficiency > 0.1) ? efficiency.toFixed(2) : sciNot(efficiency, 1);

	//compute and report rate
	document.getElementById('coincRate').innerHTML = sciNot(intensity*DC*BR1*BR2*efficiency*period, 2);

	//time to accrue:
	nSeconds = nCounts/(intensity*DC*BR1*BR2*efficiency);
	unit = chooseTimeUnit(nSeconds);
	if(intensity*DC*BR1*BR2*efficiency != 0)
		document.getElementById('nCoincTime').innerHTML = sciNot(nSeconds/unit[0], 2)+' '+unit[1];
	else
		document.getElementById('nCoincTime').innerHTML = String.fromCharCode(0x221E);

	//set colors correctly
	assignCoincColor(['coincEfficiency', 'coincRate', 'nCoincTime']);
}

function computeTriples(){
	var e1 = Math.log(parseFloat(document.getElementById('triplesEnergy1').value)),
		e2 = Math.log(parseFloat(document.getElementById('triplesEnergy2').value)),
		e3 = Math.log(parseFloat(document.getElementById('triplesEnergy3').value)),
		BR1 = parseFloat(document.getElementById('triplesBR1').value),
		BR2 = parseFloat(document.getElementById('triplesBR2').value),
		BR3 = parseFloat(document.getElementById('triplesBR3').value),
		intensity = parseFloat(document.getElementById('triplesIntensity').value),
		DC = parseFloat(document.getElementById('triplesDutyCycle').value),
		detectorASelect = document.getElementById('triplesDetectorsA'),
		detectorA = detectorASelect.options[detectorASelect.selectedIndex].value,
		detectorBSelect = document.getElementById('triplesDetectorsB'),
		detectorB = detectorBSelect.options[detectorBSelect.selectedIndex].value,
		detectorCSelect = document.getElementById('triplesDetectorsC'),
		detectorC = detectorCSelect.options[detectorCSelect.selectedIndex].value,
		periodSelect = document.getElementById("triplesPeriod"),
		period = parseFloat(periodSelect.options[periodSelect.selectedIndex].value),
		nHPGeSelect = document.getElementById("nHPGeSwitch"),
		nHPGe = parseFloat(nHPGeSelect.options[nHPGeSelect.selectedIndex].value),
		nCounts = parseFloat(document.getElementById('nTriples').value),
		eff1, eff2, eff3, efficiency, nSeconds, unit, countingFactor;

	//choose the appropriate function and evaluate it at <e1> and <e2>
	eff1 = chooseFunction(detectorA).bind(null, e1)();
	eff1 = parseFloat(eff1.slice(eff1.indexOf(';')+1, eff1.lastIndexOf(';') ));
	eff2 = chooseFunction(detectorB).bind(null, e2)();
	eff2 = parseFloat(eff2.slice(eff2.indexOf(';')+1, eff2.lastIndexOf(';') ));
	eff3 = chooseFunction(detectorC).bind(null, e3)();
	eff3 = parseFloat(eff3.slice(eff3.indexOf(';')+1, eff3.lastIndexOf(';') ));

	//compute counting factor:
	countingFactor = 1;
	if(detectorA == detectorB){
		if(detectorB == detectorC){  //all options the same
			if(detectorA == 'HPGe')
				countingFactor = (nHPGe-1)/nHPGe*(nHPGe-2)/nHPGe;
			else if(detectorA == 'LaBr3')
				countingFactor = 7/8*6/8;
			else if(detectorA == 'SiLi')
				countingFactor = 4/5*3/5;
			else if(detectorA == 'DESCANT')
				countingFactor = 69/70*68/70;
			else if(detectorA == 'SCEPTAR')
				countingFactor = 19/20*18/20;
			else if(detectorA == 'SCEPTARZDS')
				countingFactor = 10/11*9/11;
			else if(detectorA == 'SECEPTARPACES')
				countingFactor = 14/15*13/15;
			else if(detectorA == 'PACESZDS')
				countingFactor = 5/6*4/6;
		} else { //only A and B the same
			if(detectorB == 'HPGe')
				countingFactor = (nHPGe-1)/nHPGe;
			else if(detectorB == 'LaBr3')
				countingFactor = 7/8;
			else if(detectorB == 'SiLi')
				countingFactor = 4/5;
			else if(detectorB == 'DESCANT')
				countingFactor = 69/70;
			else if(detectorB == 'SCEPTAR')
				countingFactor = 19/20;
			else if(detectorB == 'SCEPTARZDS')
				countingFactor = 10/11;
			else if(detectorB == 'SECEPTARPACES')
				countingFactor = 14/15;
			else if(detectorB == 'PACESZDS')
				countingFactor = 5/6;

		}
	} else if(detectorB == detectorC){
			if(detectorB == 'HPGe')
				countingFactor = (nHPGe-1)/nHPGe;
			else if(detectorB == 'LaBr3')
				countingFactor = 7/8;
			else if(detectorB == 'SiLi')
				countingFactor = 4/5;
			else if(detectorB == 'DESCANT')
				countingFactor = 69/70;
			else if(detectorB == 'SCEPTAR')
				countingFactor = 19/20;
			else if(detectorB == 'SCEPTARZDS')
				countingFactor = 10/11;
			else if(detectorB == 'SECEPTARPACES')
				countingFactor = 14/15;
			else if(detectorB == 'PACESZDS')
				countingFactor = 5/6;		
	} else if(detectorA == detectorC){
			if(detectorA == 'HPGe')
				countingFactor = (nHPGe-1)/nHPGe;
			else if(detectorA == 'LaBr3')
				countingFactor = 7/8;
			else if(detectorA == 'SiLi')
				countingFactor = 4/5;
			else if(detectorA == 'DESCANT')
				countingFactor = 69/70;
			else if(detectorA == 'SCEPTAR')
				countingFactor = 19/20;
			else if(detectorA == 'SCEPTARZDS')
				countingFactor = 10/11;
			else if(detectorA == 'SECEPTARPACES')
				countingFactor = 14/15;
			else if(detectorA == 'PACESZDS')
				countingFactor = 5/6;		
	}

	//compute efficiency
	efficiency = eff1*eff2*eff3*countingFactor;
	document.getElementById('triplesEfficiency').innerHTML = (efficiency > 0.1) ? efficiency.toFixed(2) : sciNot(efficiency, 1);

	//compute and report rate
	document.getElementById('triplesRate').innerHTML = sciNot(intensity*DC*BR1*BR2*BR3*efficiency*period, 2);

	//time to accrue:
	nSeconds = nCounts/(intensity*DC*BR1*BR2*BR3*efficiency);
	unit = chooseTimeUnit(nSeconds);
	if(intensity*DC*BR1*BR2*BR3*efficiency != 0)
		document.getElementById('nTriplesTime').innerHTML = sciNot(nSeconds/unit[0], 2)+' '+unit[1];
	else
		document.getElementById('nTriplesTime').innerHTML = String.fromCharCode(0x221E);

	//set colors correctly
	assignTriplesColor(['triplesEfficiency', 'triplesRate', 'nTriplesTime']);
}