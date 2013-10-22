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

	if(logE < Math.log(5)) return '0;0;0';

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

function SiLiEfficiency(param, loParam, hiParam, logE){
	var i,
		loDelta = 0,
		hiDelta = 0,
		E = Math.exp(logE),
		eff = param[5]*param[0]*Math.exp(param[1]*Math.pow(E, param[2]))*(1 - Math.exp(param[3]*Math.pow(E, param[4])));

	if(logE < Math.log(15)) return '0;0;0';

	return (eff - eff*loDelta) + ';' + eff + ';' + (eff + eff*hiDelta);	
}

function DESCANTefficiency(logE){
	if(logE >= Math.log(1000) && logE <= Math.log(5000))
		return '0.27;0.27;0.27';  //100% efficient * 27% geometric acceptance
	else{
		confirm('DESCANT Energy Out of Range', 'DESCANT neutron efficiencies are not reported below 1 MeV or above 5 MeV at this time.');
		return 'NaN;NaN;NaN'
	}
}

function SCEPTARefficiency(detector, logE){

	if(detector == 'SCEPTAR')
		return '0.8;0.8;0.8';
	else if(detector == 'SCEPTARZDS')
		return '0.65;0.65;0.65';
	else if(detector == 'SCEPTARPACES')
		return '0.4;0.4;0.4';
	else if(detector == 'PACESZDS')
		return '0.25;0.25;0.25';
}