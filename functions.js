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