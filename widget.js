function computeSingles(){
	var energy = Math.log(parseFloat(document.getElementById('singlesInputEnergy').value)),
		BR = parseFloat(document.getElementById('singlesBR').value),
		intensity = parseFloat(document.getElementById('singlesIntensity').value),
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
	document.getElementById('singlesRate').innerHTML = sciNot(intensity*BR*efficiency*period, 2);

	//time to accrue:
	nSeconds = nCounts/(intensity*BR*efficiency);
	unit = chooseTimeUnit(nSeconds);
	if(intensity*BR*efficiency != 0)
		document.getElementById('nSinglesTime').innerHTML = sciNot(nSeconds/unit[0], 2)+' '+unit[1];
	else 
		document.getElementById('nSinglesTime').innerHTML = String.fromCharCode(0x221E);

	//set colors correctly
	assignSinglesColor(['singlesEfficiency', 'singlesRate', 'nSinglesTime']);
	
}

function computeCoincidence(){
	var e1 = Math.log(parseFloat(document.getElementById('coincEnergy1').value)),
		e2 = Math.log(parseFloat(document.getElementById('coincEnergy2').value)),
		BR = parseFloat(document.getElementById('coincBR').value),
		intensity = parseFloat(document.getElementById('coincIntensity').value),
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
			countingFactor = 7/8;
	}

	//compute efficiency
	efficiency = eff1*eff2*countingFactor;
	document.getElementById('coincEfficiency').innerHTML = (efficiency > 0.1) ? efficiency.toFixed(2) : sciNot(efficiency, 1);

	//compute and report rate
	document.getElementById('coincRate').innerHTML = sciNot(intensity*BR*efficiency*period, 2);

	//time to accrue:
	nSeconds = nCounts/(intensity*BR*efficiency);
	unit = chooseTimeUnit(nSeconds);
	if(intensity*BR*efficiency != 0)
		document.getElementById('nCoincTime').innerHTML = sciNot(nSeconds/unit[0], 2)+' '+unit[1];
	else
		document.getElementById('nCoincTime').innerHTML = String.fromCharCode(0x221E);

	//set colors correctly
	assignCoincColor(['coincEfficiency', 'coincRate', 'nCoincTime']);
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