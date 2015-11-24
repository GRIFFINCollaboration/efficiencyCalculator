
parameters = open('fitParamsLaBr.js', 'w');

parameters.write('function loadLaBrParameters(){\n');
parameters.write('\tLaBrCoef = {};\n');

evan = [
		'/Users/billmills/Desktop/v19_8LaBr3_12.5cm_Just_LaBr3/g4FitResults_Det.txt',
		'/Users/billmills/Desktop/v19_8LaBr3_12.5cm_Just_LaBr3/g4FitResults_Sum.txt'
	]

keys = [
		'detector',
		'array'
	]

for j in range(0,2):

    f = open(evan[j], 'r');
    for i in range(0,6):
        f.readline();

    coef = '\tLaBrCoef[\'' + keys[j] + '\'] = [';
    for line in f:
        coef += line.split('\t')[2] + ',';

    coef = coef[:-1];
    coef += '];\n';
    parameters.write(coef);

parameters.write('}');

