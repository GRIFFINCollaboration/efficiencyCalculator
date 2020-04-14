function setup(){
    var i, nodes,
        HPGeSwitch = document.getElementById('enableHPGe'),
        LaBr3Switch = document.getElementById('enableLaBr3'),
        SiLiSwitch = document.getElementById('enableSiLi');

    //call the parameter dump
    loadParameters();
    loadLaBrParameters();
    loadSCEPTARParameters();
    //SiLi parameters taken from presentation by D. Cross, simulations from Ma & Wang
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

    //set up gamma control panel//////////////////////////////////////
    HPGeSwitch.onchange = function(event){
        toggleHPGeControls();
        chooseGraphs();
    }
    LaBr3Switch.onchange = function(event){
        chooseGraphs();
    }
    SiLiSwitch.onchange = function(event){
        chooseGraphs();
    }

    //make sure the file name for image saving gets passed around:
    document.getElementById('gammaPlotName').onchange = function(){
        //set the filename to whatever the user has requested:
        document.getElementById('saveGammaPlot').download = this.value;
    }
    //and similarly for the csv filename:
    document.getElementById('gammaCSVname').onchange = function(){
        //set the filename to whatever the user has requested:
        document.getElementById('saveGammaCSV').download = this.value;
    }   
    document.getElementById('betaPlotName').onchange = function(){
        //set the filename to whatever the user has requested:
        document.getElementById('saveBetaPlot').download = this.value;
    }
    //and similarly for the csv filename:
    document.getElementById('betaCSVname').onchange = function(){
        //set the filename to whatever the user has requested:
        document.getElementById('saveBetaCSV').download = this.value;
    }

// Options for Num of Clovers are dependent on chamber configuration
var NumCloverOptions={
    "USEDSEnodescant":["12,15,16","12,15,16"],
    "USSDSSnodescant":["12,15,16","12,15,16"],
    "USPDSEnodescant":["12,15","12,15"],
    "USEDSEdescant":["11,12","11,12"],
    "USSDSSdescant":["11,12","11,12"],
    "USPDSEdescant":["11","11"]
};

    // Set the Options for Num of Clovers based on value for Chamber
    document.getElementById('chamberScheme').onchange = function(){
	var key = document.getElementById('chamberScheme').value;
	var vals = [];
	var valNames = [];

	// Grab the set of options for Num of Clovers based on choice of Array configuration
	vals = NumCloverOptions[key][0].split(",");
	valNames = NumCloverOptions[key][1].split(",");
	// Clear existing options
	document.getElementById('nHPGeSwitch').options.length = 0;
	// Set new set of options
        vals.forEach(function(item,index) {
	    var thisOption = document.createElement("option");
	    thisOption.text = valNames[index];
	    thisOption.value = item;
	    document.getElementById('nHPGeSwitch').add(thisOption);
	});
	// select the last option as the default
	document.getElementById('nHPGeSwitch').options.selectedIndex = document.getElementById('nHPGeSwitch').options.length-1;
} 
    
// Options for Shields are dependent on Distance
var ShieldOptions={
    "11.0":["noshields,sideshields","No shields,Side and back shields"],
    "14.5":["noshields,sideshields,fullshields","No shields,Side and back only,Full shields"]
};

    // Set the Options for Shields based on value for Distance
    document.getElementById('HPGeDistanceSwitch').onchange = function(){
	var key = document.getElementById('HPGeDistanceSwitch').value;
	var vals = [];
	var valNames = [];

	// Grab the set of options for Shields based on choice of Distance
	vals = ShieldOptions[key][0].split(",");
	valNames = ShieldOptions[key][1].split(",");
	// Clear existing options
	document.getElementById('shieldsScheme').options.length = 0;
	// Set new set of options
        vals.forEach(function(item,index) {
	    var thisOption = document.createElement("option");
	    thisOption.text = valNames[index];
	    thisOption.value = item;
	    document.getElementById('shieldsScheme').add(thisOption);
	});
	// select the last option as the default
	document.getElementById('shieldsScheme').options.selectedIndex = document.getElementById('shieldsScheme').options.length-1;
} 
    
    
    //default No. HPGe to 16:
    document.getElementById('nHPGeSwitch').value = 16;

    //default HPGe distance to 14.5:
    document.getElementById('HPGeDistanceSwitch').value = 14.5;

    //default summing to per clover:
    document.getElementById('summingScheme').value = 'clover';

    //default shields configuration to full:
    document.getElementById('shieldsScheme').value = 'fullshields';

    //default chamber configuration to SCEPTAR:
    document.getElementById('chamberScheme').value = 'USSDSSnodescant';

    //default delrin thickness to zero:
    document.getElementById('delrinSwitch').value = 0;

    
    //repaint the plot when anything in the form changes:
    document.getElementById('plotOptions').onchange = chooseGraphs;
    document.getElementById('betaPlotOptions').onchange = chooseBetaGraphs;

    //Set up widgets///////////////////////////////////////////////////////////////////////
    //Singles
    document.getElementById('singlesForm').onchange = computeSingles.bind(null);

    //Coincidences
    document.getElementById('coincidenceWidget').whichInput = 0;
    document.getElementById('coincForm').onchange = computeCoincidence.bind(null);    

    //Triples
    document.getElementById('triplesWidget').whichInput = 0;
    document.getElementById('triplesForm').onchange = computeTriples.bind(null);     
    
    // draw initial plots
    chooseGraphs();
    chooseBetaGraphs();
    //evaluate all widgets at defaults
    computeSingles();
    computeCoincidence();
    computeTriples();
}

////////////////////////////
// efficiency functions
////////////////////////////

function constructFunctions(){
    //update the efficiency functions with the current state of the control pane
    var HPGeString = constructPlotKey(),
        LaBrString = constructLaBrPlotKey(), 
        SiLiString = constructSiLiPlotKey(), 
        SCEPTARString = constructSCEPTARPlotKey();

    window.HPGeFunc = HPGeEfficiency.bind(null, HPGeCoef[HPGeString], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]);
    window.LaBrFunc = LaBrEfficiency.bind(null, LaBrCoef[LaBrString], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]);
    window.SiLiFunc = SiLiEfficiency.bind(null, SiLiCoef[SiLiString], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]);
    window.SCEPTARFunc = SCEPTAREfficiency.bind(null, SCEPTARCoef[SCEPTARString], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]);
}

//construct the correct plot key based on whatever is selected in the plot options
//HPGeCoef holds the coefficients for all HPGe fits in a key value store
//where the key is the string concatenation of all the control panel values in 
//the order:
//summing scheme + chamber arrangement + shields scheme + nDetectors + HPGe Distance + Delrin thickness
//so 'cloverUSEDSEnodescantfullshields1214.520' is 12 detectors at 14.5cm with 20mm delrin, full BGO shields and per-clover summing with an empty chamber and no descant.
//HPGeCoef['crystalUSSDSSnodescantnoshields1611.00'] = [-2.073762404,-0.6236115083 , 0.0177262309 ,-0.0888048161 ,-0.0399939387 , 0.0195879118 , 0.0054905134 ,-0.0017446712 ,-0.0004583284 ];
//HPGeMinCoef and HPGeMaxCoef are packed the same way as HPGeCoef, but hold the 1-sigma extrema for the coefficients:
function constructPlotKey(){
    var summingOptions = document.getElementById('summingScheme'),
        summing = summingOptions.options[summingOptions.selectedIndex].value,
        chamberOptions = document.getElementById('chamberScheme'),
        chamber = chamberOptions.options[chamberOptions.selectedIndex].value,
        shieldsOptions = document.getElementById('shieldsScheme'),
        shields = shieldsOptions.options[shieldsOptions.selectedIndex].value,
        nHPGeOptions = document.getElementById('nHPGeSwitch'),
        nHPGe = nHPGeOptions.options[nHPGeOptions.selectedIndex].value,
        HPGeDistanceOptions = document.getElementById('HPGeDistanceSwitch'),
        HPGeDistance = HPGeDistanceOptions.options[HPGeDistanceOptions.selectedIndex].value,
        absorberOptions = document.getElementById('delrinSwitch'),
        absorber = absorberOptions.options[absorberOptions.selectedIndex].value,
        plotKey = summing + chamber + shields + nHPGe + HPGeDistance + absorber;
        //console.log(plotKey);
        return plotKey;
}
function constructHPGeLongString(){
    var summingOptions = document.getElementById('summingScheme'),
        summing = summingOptions.options[summingOptions.selectedIndex].value,
        chamberOptions = document.getElementById('chamberScheme'),
        chamber = chamberOptions.options[chamberOptions.selectedIndex].value,
        shieldsOptions = document.getElementById('shieldsScheme'),
        shields = shieldsOptions.options[shieldsOptions.selectedIndex].value,
        nHPGeOptions = document.getElementById('nHPGeSwitch'),
        nHPGe = nHPGeOptions.options[nHPGeOptions.selectedIndex].value,
        HPGeDistanceOptions = document.getElementById('HPGeDistanceSwitch'),
        HPGeDistance = HPGeDistanceOptions.options[HPGeDistanceOptions.selectedIndex].value,
        absorberOptions = document.getElementById('delrinSwitch'),
        absorber = absorberOptions.options[absorberOptions.selectedIndex].value,
        plotKey = summing + chamber + shields + nHPGe + HPGeDistance + absorber,
        longString;
        longString = nHPGe;
	if(shields == "noshields"){ longString += " naked Clovers at " + HPGeDistance + "cm with "; }
	     else{ longString += " Compton-suppressed Clovers at " + HPGeDistance + "cm with "; }
        if(parseInt(absorber)==0){ longString += "no delrin absorber"; }
             else{ longString += absorber + "mm delrin absorber"; }
    switch(chamber){
    case("USEDSEnodescant"): longString += " around an empty chamber."; break;
    case("USSDSSnodescant"): longString += " around full sceptar."; break;
    case("USPDSEnodescant"): longString += " around PACES and ZDS."; break;
    case("USEDSEdescant"): longString += " coupled with DESCANT and an empty chamber."; break;
    case("USSDSSdescant"): longString += " coupled with DESCANT around full sceptar."; break;
    case("USPDSEdescant"): longString += " coupled with DESCANT, PACES and ZDS."; break;
        }
        //console.log(plotKey,", ",longString);
        return longString;
}

//LaBr's only option is summing per detector or over the whole array, and we're not interested in the array option.
function constructLaBrPlotKey(){
        return 'detector';
}

function constructSiLiPlotKey(){
        return 'detector';
}

function constructSCEPTARPlotKey(){
    var leptonOptions = document.getElementById('decayMode'),
        lepton = leptonOptions.options[leptonOptions.selectedIndex].value,
        zOptions = document.getElementById('parentZ'),
        z = zOptions.options[zOptions.selectedIndex].value,
        thresholdOptions = document.getElementById('betaThreshold'),
        threshold = thresholdOptions.options[thresholdOptions.selectedIndex].value,
        plotKey = ''+lepton+z+threshold;

        return plotKey;
}

//an eighth order polynomial for logEff in logE with coef. param = [0th order, 1st order, ..., 8th order].
//lo and hiParam are the 1-sigma extremes of the parameters
//returns string formatted for inclusion in dygraphs customGraph object.
function HPGeEfficiency(param, loParam, hiParam, logE){
    var i,
        logEff = 0,
        loDelta = 0,
        hiDelta = 0,
        eff,
	logEn;

    //Convert MeV to keV
    logEn = logE - 6.907755279;
    
    if(logE < Math.log(5)) return '0;0;0';

    for(i=0; i<9; i++){
        logEff += param[i]*Math.pow(logEn,i);
        //loDelta += Math.pow((param[i] - loParam[i])*Math.pow(logEn,i), 2);
        //hiDelta += Math.pow((hiParam[i] - param[i])*Math.pow(logEn,i), 2);
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
        alert('DESCANT Energy Out of Range\nDESCANT neutron efficiencies are not reported below 1 MeV or above 5 MeV at this time.');
        return 'NaN;NaN;NaN'
    }
}

//SCEPTAR simulation
function SCEPTAREfficiency(param, loParam, hiParam, logE){
    var eff,
        Q = Math.exp(logE), //this fit was done in a linear-linear space, but we still pass in logE for consistency upstream from here.
        leptonOptions = document.getElementById('decayMode'),
        lepton = leptonOptions.options[leptonOptions.selectedIndex].value;

    if(Q<100)
        return '0;0;0';

    //Evan & Carl requested the 0.8 hack-in instead of param[6]
    eff = 0.8*(1-1/(Math.exp((Q-param[0])/param[1])+1)-1/(Math.exp((Q-param[2])/param[3])+1)-1/(Math.exp((Q-param[4])/param[5])+1));
    if(lepton == 1) eff = Math.max(eff, 0.00065); //only for positrons
    eff = Math.max(eff, 0); //negative excursions occur at energies ~100 keV for electrons, suppress. 

    return eff + ';' + eff + ';' + eff;
}

//SCEPTAR & friends estimates
function SCEPTARauxEfficiency(detector, logE){

    if(detector == 'SCEPTAR')
        return '0.8;0.8;0.8';
    else if(detector == 'SCEPTARZDS')
        return '0.8;0.8;0.8';
    else if(detector == 'SCEPTARPACES')
        return '0.4;0.4;0.4';
    else if(detector == 'PACESZDS')
        return '0.4;0.4;0.4';
}

function chooseFunction(detector){
    if(detector == 'HPGe')
        return window.HPGeFunc;
    else if(detector == 'LaBr3')
        return window.LaBrFunc;
    else if(detector == 'SiLi')
        return window.SiLiFunc;
    else if(detector == 'DESCANT')
        return DESCANTefficiency;
    else if(detector == 'SCEPTAR')
        return window.SCEPTARFunc;
    else
        return SCEPTARauxEfficiency.bind(null, detector) //SCEPTARauxEfficiency contains a whole stable of detectors, use the catch all for this.
}

////////////////////////
// dygraph drawing
////////////////////////

//decide which plots to send to a call to deployGraph for gamma plots
function chooseGraphs(){
    var funcs = [],
        titles = [],
        colors = [],
        min = parseFloat(document.getElementById('minE').value),
        max = parseFloat(document.getElementById('maxE').value),
        i;

    //make sure specified plot maxima aren't silly:
    document.getElementById('maxE').min = parseFloat(document.getElementById('minE').value);
    document.getElementById('maxEffic').min = parseFloat(document.getElementById('minEffic').value);

    //update plot data
    constructFunctions()
    if(document.getElementById('enableHPGe').checked){
        funcs[funcs.length] = window.HPGeFunc;
        titles[titles.length] = 'HPGe';
        colors[colors.length] = colorCodes['HPGe'];
    }
    if(document.getElementById('enableLaBr3').checked){
        funcs[funcs.length] = window.LaBrFunc;
        titles[titles.length] = 'LaBr3';
        colors[colors.length] = colorCodes['LaBr3'];
    }
    if(document.getElementById('enableSiLi').checked){
        funcs[funcs.length] = window.SiLiFunc;
        titles[titles.length] = 'Si(Li)';
        colors[colors.length] = colorCodes['SiLi'];
    }

    deployGraph(funcs, titles, colors, min, max);
}

//as chooseGraphs but for beta plots
function chooseBetaGraphs(){
    var funcs = [],
        titles = [],
        colors = [],
        min = parseFloat(document.getElementById('minQ').value),
        max = parseFloat(document.getElementById('maxQ').value),
        i;

    //make sure specified plot maxima aren't silly:
    document.getElementById('maxQ').min = parseFloat(document.getElementById('minQ').value);
    document.getElementById('maxQEffic').min = parseFloat(document.getElementById('minQEffic').value);

    //sceptar currently always enabled
    constructFunctions()
    funcs[funcs.length] = window.SCEPTARFunc;
    titles[titles.length] = 'SCEPTAR';
    colors[colors.length] = colorCodes['SCEPTAR'];
    
    deployBetaGraph(funcs, titles, colors, min, max);
}

//deploy graphs of [func]tions with [titles]
function deployGraph(func, titles, colors, min, max){
    var i, j, logx, deltaLow, deltaHigh, eff, textBlob,
        scale = checkedRadio('energyScale').value; 
        isLog = (scale == 'lin') ? '' : 'Log ',
        CSV = isLog + 'Energy[keV]',
        data = isLog + 'Energy[keV]',
        nPoints = 1000,
        yScale = checkedRadio('efficScale').value == 'log';
        //don't let the user switch to log scale with a 0 min
        if(yScale && parseFloat(document.getElementById('minEffic').value)==0 )
            document.getElementById('minEffic').value = 0.001;

    for(i=0; i<titles.length; i++){
        data += ', '+titles[i];
        CSV += ', '+titles[i];
    }
    data += '\n';
    CSV += '\n';

    for(i=0; i<nPoints+1; i++){
            if(scale=='lin'){
                logx = (max-min)/nPoints*i+min;
                data += logx;
                CSV += logx;
                logx = Math.log(logx);
            } else{
                logx = (Math.log(max)-Math.log(min))/nPoints*i+Math.log(min);
                data += logx;
                CSV += logx;
            }
            for(j=0; j<func.length; j++){
                data+=',';
                CSV += ', '
                eff = func[j].bind(null, logx)();
                data += eff;
                CSV += eff.slice(0, eff.indexOf(';'));
            }
            data += '\n';
            CSV += '\n';
    }

    //Greg's request: log CSV values every keV for nice values on linear scale; don't bother on log scale
    if(scale == 'lin'){
        CSV = CSV.slice(0, CSV.indexOf('\n')) + '\n'; //keep the header, redo the rest
        for(i=0; i<max-min+1; i++){
            CSV += min + i;
            for(j=0; j<func.length; j++){
                CSV += ', ';
                eff = func[j].bind(null, Math.log(min+i) )();
                CSV += eff.slice(0, eff.indexOf(';'));
            }
            CSV += '\n';
        }
    }

    textBlob = new Blob([CSV], {type: 'text/plain'});
    URL.revokeObjectURL(window.textBlobURL);
    window.textBlobURL = URL.createObjectURL(textBlob);
    document.getElementById('saveGammaCSV').setAttribute('href', window.textBlobURL);

    g = new Dygraph(document.getElementById('gammaPlot'), data, {
        title: 'Simulated Efficiency v. Energy',
        xlabel: 'Energy [keV]',
        ylabel: 'Efficiency',
        sigFigs: 3,
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
                },

                axisLabelWidth: 75               
            }
        }
    });

    g.updateOptions({
        drawCallback: repaint,
    });

    repaint(g);

}

//deploy graphs of [func]tions with [titles] for beta plots
function deployBetaGraph(func, titles, colors, min, max){
    var i, j, logx, deltaLow, deltaHigh, eff, textBlob,
        scale = checkedRadio('qScale').value,
        isLog = (scale == 'lin') ? '' : 'Log ',
        data = isLog + 'Q [keV]',
        CSV = isLog + 'Q [keV]',
        nPoints = 1000,

        yScale = checkedRadio('qefficScale').value == 'log';
        //don't let the user switch to log scale with a 0 min
        if(yScale && parseFloat(document.getElementById('minQEffic').value)==0 )
            document.getElementById('minQEffic').value = 0.001;

    for(i=0; i<titles.length; i++){
        data += ', '+titles[i];
        CSV += ', '+titles[i];
    }
    data += '\n';
    CSV += '\n';

    for(i=0; i<nPoints+1; i++){
            if(scale=='lin'){
                logx = (max-min)/nPoints*i+min;
                data += logx;
                CSV += logx;
                logx = Math.log(logx);
            } else{
                logx = (Math.log(max)-Math.log(min))/nPoints*i+Math.log(min);
                data += logx;
                CSV += logx;
            }
            for(j=0; j<func.length; j++){
                data+=',';
                CSV +=', '
                eff = func[j].bind(null, logx)();
                data += eff;
                CSV += eff.slice(0, eff.indexOf(';'));
            }
            data += '\n';
            CSV += '\n';
    }

    //Greg's request: log CSV values every keV for nice values on linear scale; don't bother on log scale
    if(scale == 'lin'){
        CSV = CSV.slice(0, CSV.indexOf('\n')) + '\n'; //keep the header, redo the rest
        for(i=0; i<max-min+1; i++){
            CSV += min + i;
            for(j=0; j<func.length; j++){
                CSV += ', ';
                eff = func[j].bind(null, Math.log(min+i) )();
                CSV += eff.slice(0, eff.indexOf(';'));
            }
            CSV += '\n';
        }
    }

    textBlob = new Blob([CSV], {type: 'text/plain'});
    URL.revokeObjectURL(window.betaTextBlobURL);
    window.betaTextBlobURL = URL.createObjectURL(textBlob);
    document.getElementById('saveBetaCSV').setAttribute('href', window.betaTextBlobURL);

    b = new Dygraph(document.getElementById('betaPlot'), data, {
        title: 'Simulated Efficiency v. Q',
        xlabel: 'Q [keV]',
        ylabel: 'Efficiency',
        sigFigs: 3,
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
                },
                axisLabelWidth: 75           
            }
        }
    });

    b.updateOptions({
        drawCallback: repaintBeta,
    });

    repaintBeta(b);

}

//callback to run every time the function repaints
function repaint(dygraph){
    var xMin = document.getElementById('minE'),
        xMax = document.getElementById('maxE'),
        yMin = document.getElementById('minEffic'),
        yMax = document.getElementById('maxEffic'),
        scale = checkedRadio('energyScale').value;

    prepImageSave(dygraph, 'saveGammaPlot', 'gammaPNG');

    if(scale=='lin'){
        xMin.value = g.xAxisRange()[0].toFixed();
        xMax.value = g.xAxisRange()[1].toFixed();
    }else{
        xMin.value = Math.exp(g.xAxisRange()[0]).toFixed();
        xMax.value = Math.exp(g.xAxisRange()[1]).toFixed();
    }
    yMin.value = g.yAxisRange()[0].toFixed(3);
    yMax.value = g.yAxisRange()[1].toFixed(3);

    computeSingles();
    computeCoincidence();
    computeTriples();

}

//callback to run every time the function repaints the beta plots
function repaintBeta(dygraph){
    var xMin = document.getElementById('minQ'),
        xMax = document.getElementById('maxQ'),
        yMin = document.getElementById('minQEffic'),
        yMax = document.getElementById('maxQEffic'),
        scale = checkedRadio('qScale').value;

    prepImageSave(dygraph, 'saveBetaPlot', 'betaPNG');

    if(scale=='lin'){
        xMin.value = b.xAxisRange()[0].toFixed();
        xMax.value = b.xAxisRange()[1].toFixed();
    }else{
        xMin.value = Math.exp(b.xAxisRange()[0]).toFixed();
        xMax.value = Math.exp(b.xAxisRange()[1]).toFixed();
    }
    yMin.value = b.yAxisRange()[0].toFixed(3);
    yMax.value = b.yAxisRange()[1].toFixed(3);

    computeSingles();
    computeCoincidence();
    computeTriples();

}

function passClickToWidget(event, energy){
    var singlesForm = document.getElementById('singlesForm'),
        coincWidget = document.getElementById('coincidenceWidget'),
        triplesWidget = document.getElementById('triplesWidget'),
        coincForm = document.getElementById('coincForm'),
        triplesForm = document.getElementById('triplesForm'),
        scale = checkedRadio('energyScale').value,
        reportEnergy = (scale=='lin') ? energy.toFixed() : Math.exp(energy).toFixed(),
        SCEPTARclick = event.target.parentNode.parentNode.id == 'betaPlot'; //swimming up through the dom dygraphs creates....

    //singles
    document.getElementById('singlesInputEnergy').value = reportEnergy;
    if(SCEPTARclick)
        document.getElementById('singlesDetectors').value = 'SCEPTAR';
    singlesForm.onchange();

    //coincidences
    if(coincWidget.whichInput == 0){
        document.getElementById('coincEnergy1').value = reportEnergy;
        if(SCEPTARclick)
            document.getElementById('coincDetectorsA').value = 'SCEPTAR';
        coincWidget.whichInput = 1;
    } else {
        document.getElementById('coincEnergy2').value = reportEnergy;
        if(SCEPTARclick)
            document.getElementById('coincDetectorsB').value = 'SCEPTAR';
        coincWidget.whichInput = 0;
    }
    coincForm.onchange();

    //triple efficiency
    if(triplesWidget.whichInput==0){
        document.getElementById('triplesEnergy1').value = reportEnergy;
        triplesForm.onchange();
        triplesWidget.whichInput=1;
    } else if(triplesWidget.whichInput==1){
        document.getElementById('triplesEnergy2').value = reportEnergy;
        triplesForm.onchange();
        triplesWidget.whichInput=2;
    } else if(triplesWidget.whichInput==2){
        document.getElementById('triplesEnergy3').value = reportEnergy;
        triplesForm.onchange();
        triplesWidget.whichInput=0;
    }
}

/////////////////////////////////////////////////////////
// singles, coincidences, and triples calculator logic
/////////////////////////////////////////////////////////

function computeSingles(){
    var energy = Math.log(parseFloat(document.getElementById('singlesInputEnergy').value)),
        BR = parseFloat(document.getElementById('singlesBR').value),
        intensity = parseFloat(document.getElementById('singlesIntensity').value),
        DC = parseFloat(document.getElementById('singlesDutyCycle').value)/100,
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
    document.getElementById('singlesEfficiency').innerHTML = (efficiency > 0.1) ? efficiency.toFixed(3) : sciNot(efficiency, 2);

    // State obviously what this efficiency has been calculated for
    var HPGeLongString = constructHPGeLongString();
    document.getElementById('singlesWidgetEffLabel').innerHTML = "Using HPGe efficiency for " + HPGeLongString;
    
    //rate
    document.getElementById('singlesRate').innerHTML = sciNot(intensity*DC*BR*efficiency*period, 3);

    //time to accrue:
    nSeconds = nCounts/(intensity*DC*BR*efficiency);
    unit = chooseTimeUnit(nSeconds);
    if(intensity*DC*BR*efficiency != 0)
        document.getElementById('nSinglesTime').innerHTML = sciNot(nSeconds/unit[0], 3)+' '+unit[1];
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
        DC = parseFloat(document.getElementById('coincDutyCycle').value)/100,
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
    document.getElementById('coincEfficiency').innerHTML = (efficiency > 0.1) ? efficiency.toFixed(3) : sciNot(efficiency, 2);

    //compute and report rate
    document.getElementById('coincRate').innerHTML = sciNot(intensity*DC*BR1*BR2*efficiency*period, 3);

    // State obviously what this efficiency has been calculated for
    var HPGeLongString = constructHPGeLongString();
    document.getElementById('coincWidgetEffLabel').innerHTML = "Using HPGe efficiency for " + HPGeLongString;

    //time to accrue:
    nSeconds = nCounts/(intensity*DC*BR1*BR2*efficiency);
    unit = chooseTimeUnit(nSeconds);
    if(intensity*DC*BR1*BR2*efficiency != 0)
        document.getElementById('nCoincTime').innerHTML = sciNot(nSeconds/unit[0], 3)+' '+unit[1];
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
        DC = parseFloat(document.getElementById('triplesDutyCycle').value)/100,
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

    //choose the appropriate function and evaluate them
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
    document.getElementById('triplesEfficiency').innerHTML = (efficiency > 0.1) ? efficiency.toFixed(3) : sciNot(efficiency, 2);

    //compute and report rate
    document.getElementById('triplesRate').innerHTML = sciNot(intensity*DC*BR1*BR2*BR3*efficiency*period, 3);

    // State obviously what this efficiency has been calculated for
    var HPGeLongString = constructHPGeLongString();
    document.getElementById('triplesWidgetEffLabel').innerHTML = "Using HPGe efficiency for " + HPGeLongString;

    //time to accrue:
    nSeconds = nCounts/(intensity*DC*BR1*BR2*BR3*efficiency);
    unit = chooseTimeUnit(nSeconds);
    if(intensity*DC*BR1*BR2*BR3*efficiency != 0)
        document.getElementById('nTriplesTime').innerHTML = sciNot(nSeconds/unit[0], 3)+' '+unit[1];
    else
        document.getElementById('nTriplesTime').innerHTML = String.fromCharCode(0x221E);

    //set colors correctly
    assignTriplesColor(['triplesEfficiency', 'triplesRate', 'nTriplesTime']);
}

//////////////////////
// ui helpers
//////////////////////

function toggleHPGeControls(){
    //hide / show the hpge specific controls
    if(document.getElementById('enableHPGe').checked){
        document.getElementById('HPGeControl').style.height = 'auto';
    } else{
        document.getElementById('HPGeControl').style.height = 0;
    }
}

function assignSinglesColor(targets){
    var i,
        detectorSelect = document.getElementById('singlesDetectors'),
        detector = detectorSelect.options[detectorSelect.selectedIndex].value;

    for(i=0; i<targets.length; i++){
        document.getElementById(targets[i]).style.backgroundColor = colorCodes[detector];
    }
}

function assignCoincColor(targets){
    var i,
        detectorSelectA = document.getElementById('coincDetectorsA'),
        detectorA = detectorSelectA.options[detectorSelectA.selectedIndex].value,
        detectorSelectB = document.getElementById('coincDetectorsB'),
        detectorB = detectorSelectB.options[detectorSelectB.selectedIndex].value,
        colorA = colorCodes[detectorA],
        colorB = colorCodes[detectorB],
        gradientWebkit = '-webkit-linear-gradient(-45deg, ' + colorA + ' 50%, ' + colorB + ' 50%)',
        gradientMoz = '-moz-linear-gradient(-45deg, ' + colorA + ' 50%, ' + colorB + ' 50%)';

        for(i=0; i<targets.length; i++){
            document.getElementById(targets[i]).style.background = gradientWebkit;
            document.getElementById(targets[i]).style.background = gradientMoz;
        }
}

function assignTriplesColor(targets){
    var i,
        detectorSelectA = document.getElementById('triplesDetectorsA'),
        detectorA = detectorSelectA.options[detectorSelectA.selectedIndex].value,
        detectorSelectB = document.getElementById('triplesDetectorsB'),
        detectorB = detectorSelectB.options[detectorSelectB.selectedIndex].value,
        detectorSelectC = document.getElementById('triplesDetectorsC'),
        detectorC = detectorSelectC.options[detectorSelectC.selectedIndex].value,       
        colorA = colorCodes[detectorA],
        colorB = colorCodes[detectorB],
        colorC = colorCodes[detectorC],
        gradientWebkit = '-webkit-linear-gradient(-45deg, ' + colorA + ' 34%, ' + colorB + ' 34%, ' + colorB + ' 67%,' + colorC + ' 67%)',
        gradientMoz = '-moz-linear-gradient(-45deg, ' + colorA + ' 34%, ' + colorB + ' 34%, ' + colorB + ' 67%,' + colorC + ' 67%)';

        for(i=0; i<targets.length; i++){
            document.getElementById(targets[i]).style.background = gradientWebkit;
            document.getElementById(targets[i]).style.background = gradientMoz;
        }
}

///////////////
// helpers
///////////////

function checkedRadio(name){
    //given the name of a radio group, return the checked radio

    var i, radios = document.getElementsByName(name);

    for (i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i];
        }
    }

    return null
}

function sciNot(val, sig){
    //return a string representing <val> in scientific notation, with <sig> signigicant digits
    if(val>100 || val<1){
        var string = val.toExponential(sig),
            out = parseFloat(string.slice(0, string.indexOf('e')))+' ' + String.fromCharCode(0x2A2F) + '10<sup>',
            exp = ((string.indexOf('+') != -1) ? string.slice(string.indexOf('e')+2, string.length) : string.slice(string.indexOf('e')+1, string.length));
        return out+exp+'</sup>'
    } else{
        return val.toFixed(sig);
    }
}

function chooseTimeUnit(nSeconds){
    //return a reasonable time unit for nSeconds: s, min, h, or days, and the number of seconds is corresponds to as [number of seconds, unit]
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

//generate a hidden image and send its data uri to the appropriate place for saving:
function prepImageSave(dygraph, saveButton, imgID){
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

    Dygraph.Export.asPNG(dygraph, document.getElementById(imgID), options);
    document.getElementById(saveButton).href = document.getElementById(imgID).getAttribute('src');
}
