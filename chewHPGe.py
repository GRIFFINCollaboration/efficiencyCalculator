
parameters = open('fitParams.js', 'w');

parameters.write('function loadParameters(){\n');
parameters.write('\tHPGeCoef = {};\n');

evan = [
		'/Users/billmills/Desktop/results/v01_8Griffin_11cm_Sceptar_VacChamber_0Delrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v01_8Griffin_11cm_Sceptar_VacChamber_0Delrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v01_8Griffin_11cm_Sceptar_VacChamber_0Delrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v02_8Griffin_11cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v02_8Griffin_11cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v02_8Griffin_11cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v03_8Griffin_11cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v03_8Griffin_11cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v03_8Griffin_11cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v04_8Griffin_14.5cm_Sceptar_VacChamber_0Delrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v04_8Griffin_14.5cm_Sceptar_VacChamber_0Delrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v04_8Griffin_14.5cm_Sceptar_VacChamber_0Delrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v05_8Griffin_14.5cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v05_8Griffin_14.5cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v05_8Griffin_14.5cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v06_8Griffin_14.5cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v06_8Griffin_14.5cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v06_8Griffin_14.5cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v07_12Griffin_11cm_Sceptar_VacChamber_0Delrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v07_12Griffin_11cm_Sceptar_VacChamber_0Delrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v07_12Griffin_11cm_Sceptar_VacChamber_0Delrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v08_12Griffin_11cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v08_12Griffin_11cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v08_12Griffin_11cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v09_12Griffin_11cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v09_12Griffin_11cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v09_12Griffin_11cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v10_12Griffin_14.5cm_Sceptar_VacChamber_0Delrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v10_12Griffin_14.5cm_Sceptar_VacChamber_0Delrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v10_12Griffin_14.5cm_Sceptar_VacChamber_0Delrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v11_12Griffin_14.5cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v11_12Griffin_14.5cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v11_12Griffin_14.5cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v12_12Griffin_14.5cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v12_12Griffin_14.5cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v12_12Griffin_14.5cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v13_16Griffin_11cm_Sceptar_VacChamber_0Delrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v13_16Griffin_11cm_Sceptar_VacChamber_0Delrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v13_16Griffin_11cm_Sceptar_VacChamber_0Delrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v14_16Griffin_11cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v14_16Griffin_11cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v14_16Griffin_11cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v15_16Griffin_11cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v15_16Griffin_11cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v15_16Griffin_11cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v16_16Griffin_14.5cm_Sceptar_VacChamber_0Delrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v16_16Griffin_14.5cm_Sceptar_VacChamber_0Delrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v16_16Griffin_14.5cm_Sceptar_VacChamber_0Delrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v17_16Griffin_14.5cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v17_16Griffin_14.5cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v17_16Griffin_14.5cm_Sceptar_VacChamber_10mmDelrin/g4FitResults_Full_Array_Add-Back.txt',
		'/Users/billmills/Desktop/results/v18_16Griffin_14.5cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Single_Hit.txt',
		'/Users/billmills/Desktop/results/v18_16Griffin_14.5cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Clover_Add-Back.txt',
		'/Users/billmills/Desktop/results/v18_16Griffin_14.5cm_Sceptar_VacChamber_20mmDelrin/g4FitResults_Full_Array_Add-Back.txt'
	]

keys = [
		'crystal811.00',
		'clover811.00',
		'array811.00',
		'crystal811.010',
		'clover811.010',
		'array811.010',
		'crystal811.020',
		'clover811.020',
		'array811.020',
		'crystal814.50',
		'clover814.50',
		'array814.50',
		'crystal814.510',
		'clover814.510',
		'array814.510',
		'crystal814.520',
		'clover814.520',
		'array814.520',
		'crystal1211.00',
		'clover1211.00',
		'array1211.00',
		'crystal1211.010',
		'clover1211.010',
		'array1211.010',
		'crystal1211.020',
		'clover1211.020',
		'array1211.020',
		'crystal1214.50',
		'clover1214.50',
		'array1214.50',
		'crystal1214.510',
		'clover1214.510',
		'array1214.510',
		'crystal1214.520',
		'clover1214.520',
		'array1214.520',
		'crystal1611.00',
		'clover1611.00',
		'array1611.00',
		'crystal1611.010',
		'clover1611.010',
		'array1611.010',
		'crystal1611.020',
		'clover1611.020',
		'array1611.020',
		'crystal1614.50',
		'clover1614.50',
		'array1614.50',
		'crystal1614.510',
		'clover1614.510',
		'array1614.510',
		'crystal1614.520',
		'clover1614.520',
		'array1614.520'
	]

for j in range(0,54):

    f = open(evan[j], 'r');
    for i in range(0,6):
        f.readline();

    coef = '\tHPGeCoef[\'' + keys[j] + '\'] = [';
    for line in f:
        coef += line.split('\t')[2] + ',';

    coef = coef[:-1];
    coef += '];\n';
    parameters.write(coef);

parameters.write('}');

