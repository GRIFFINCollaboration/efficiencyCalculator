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
	if(intensity*BR*HPGeEff != 0)
		document.getElementById('nSinglesHPGe').innerHTML = sciNot(HPGeSeconds/HPGeUnit[0], 2)+' '+HPGeUnit[1];
	else 
		document.getElementById('nSinglesHPGe').innerHTML = String.fromCharCode(0x221E);
	
	LaBrSeconds = nCounts/(intensity*BR*LaBrEff);
	LaBrUnit = chooseTimeUnit(LaBrSeconds);
	if(intensity*BR*LaBrEff != 0)
		document.getElementById('nSinglesLaBr3').innerHTML = sciNot(LaBrSeconds/LaBrUnit[0], 2)+' '+LaBrUnit[1];
	else 
		document.getElementById('nSinglesLaBr3').innerHTML = String.fromCharCode(0x221E);
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
		nCounts = parseFloat(document.getElementById('nCoinc').value),
		HPGeEff, LaBrEff, HPGeSeconds, LaBrSeconds, HPGeUnit, LaBrUnit;

	HPGeEff1 = parseFloat(HPGeEff1.slice(HPGeEff1.indexOf(';')+1, HPGeEff1.lastIndexOf(';') ));
	HPGeEff2 = parseFloat(HPGeEff2.slice(HPGeEff2.indexOf(';')+1, HPGeEff2.lastIndexOf(';') ));
	LaBrEff1 = parseFloat(LaBrEff1.slice(LaBrEff1.indexOf(';')+1, LaBrEff1.lastIndexOf(';') ));
	LaBrEff2 = parseFloat(LaBrEff2.slice(LaBrEff2.indexOf(';')+1, LaBrEff2.lastIndexOf(';') ));

	HPGeEff = (HPGeEff1*HPGeEff2*(nHPGe-1)/nHPGe);
	LaBrEff = (LaBrEff1*LaBrEff2*7/8);

	document.getElementById('coincRateWidgetResultHPGe').innerHTML = sciNot(intensity*BR*HPGeEff*period, 2);
	document.getElementById('coincRateWidgetResultLaBr3').innerHTML = sciNot(intensity*BR*LaBrEff*period, 2);

	//time to accrue:
	HPGeSeconds = nCounts/(intensity*BR*HPGeEff);
	HPGeUnit = chooseTimeUnit(HPGeSeconds);
	if(intensity*BR*HPGeEff != 0)
		document.getElementById('nCoincHPGe').innerHTML = sciNot(HPGeSeconds/HPGeUnit[0], 2)+' '+HPGeUnit[1];
	else
		document.getElementById('nCoincHPGe').innerHTML = String.fromCharCode(0x221E);
	
	LaBrSeconds = nCounts/(intensity*BR*LaBrEff);
	LaBrUnit = chooseTimeUnit(LaBrSeconds);
	if(intensity*BR*LaBrEff != 0)
		document.getElementById('nCoincLaBr3').innerHTML = sciNot(LaBrSeconds/LaBrUnit[0], 2)+' '+LaBrUnit[1];
	else
		document.getElementById('nCoincLaBr3').innerHTML = String.fromCharCode(0x221E);
}