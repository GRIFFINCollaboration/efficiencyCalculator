Current Release: ![DOI Badge](https://zenodo.org/badge/3877/BillMills/efficiencyTracker.png)

Release History:

version | DOI
--------|------
1.2     | 10.5281.zenodo.9887

# Efficiency Tracker

The Efficiency Calculator summarizes the results of a series of GEANT 4 simulations of the GRIFFIN detector and several ancillary detectors, by visualizing efficiency curves and calculating predicted efficiencies for photons and electrons under an array of experimental conditions.

## Dependencies & Setup

The Efficiency Calculator runs 100% client side; simply open `index.html` in the latest Firefox or Chrome locally, or serve from any static page server.

This project uses [Dygraphs](http://dygraphs.com/) for plotting, and [Twitter Bootstrap](http://getbootstrap.com/) for layout.
 
## Programmatic Logic

 - **Setup**: on page load, parameters from the GEANT simulation are loaded from `fitParams.js`, `fitParamsSCEPTAR.js`, and `fitParamsLaBr.js`. These parameters are the coefficients of 8th order polynomials, fit to efficiency as a function of ln(gamma energy) or ln(beta Q). The rest of `setup()` plugs in callbacks and UI.
 - **Plot updating**: whenever any plot control UI is changed, `chooseGraphs()` and / or `chooseBetaGraphs()` call a series of functions to read the new UI parameters, use them to select the appropriate set of fit parameters loaded by `setup()`, and re-draw the dygraphs.
 - **Rate Calculators** provide efficiency and rate estimates for singles, coincidences and triples; their behavior is governed by `computeSingles()`, `computeCoincidence()` and `computeTriples()`. 