Release History:

version | DOI
--------|------
1.4   | [![DOI](https://zenodo.org/badge/doi/10.5281/zenodo.597971.svg)](http://dx.doi.org/10.5281/zenodo.3752130)
1.3.1   | [![DOI](https://zenodo.org/badge/doi/10.5281/zenodo.35023.svg)](http://dx.doi.org/10.5281/zenodo.35023)
1.2.1   | [![DOI](https://zenodo.org/badge/doi/10.5281/zenodo.9887.svg)](http://dx.doi.org/10.5281/zenodo.9887)

# Efficiency Calculator

The Efficiency Calculator summarizes the results of a series of GEANT 4 simulations of the GRIFFIN detector and several ancillary detectors, by visualizing efficiency curves and calculating predicted efficiencies for photons and electrons under an array of experimental conditions.

## Dependencies & Setup

The Efficiency Calculator runs 100% client side; simply open `index.html` in the latest Firefox or Chrome locally, or serve from any static page server.

This project uses [Dygraphs](http://dygraphs.com/) for plotting, and [Twitter Bootstrap](http://getbootstrap.com/) for layout.
 
## Programmatic Logic

 - **Setup**: on page load, parameters from the GEANT simulation are loaded from `fitParams.js`, `fitParamsSCEPTAR.js`, and `fitParamsLaBr.js`. These parameters are the coefficients of 8th order polynomials, fit to efficiency as a function of ln(gamma energy) or ln(beta Q). The rest of `setup()` plugs in callbacks and UI.
 - **Plot updating**: whenever any plot control UI is changed, `chooseGraphs()` and / or `chooseBetaGraphs()` call a series of functions to read the new UI parameters, use them to select the appropriate set of fit parameters loaded by `setup()`, and re-draw the dygraphs.
 - **Rate Calculators** provide efficiency and rate estimates for singles, coincidences and triples; their behavior is governed by `computeSingles()`, `computeCoincidence()` and `computeTriples()`.

## Contributing

Contributions are very welcome! If you have an idea, question or comment, please open an issue. If you would like to make a change to the Efficiency Calculator, please follow these steps:
 - start by opening an issue or empty PR to discuss your ideas
 - please limit individual PRs to less than 500 lines (Why? See figure 1 [here](https://smartbear.com/SmartBear/media/pdfs/11_Best_Practices_for_Peer_Code_Review.pdf)).
 - please encapsulate all new behavior wherever possible in functions of 50 lines or less each.

## Citation & Deployment

If you use a result from this project, **be sure to site it using the correct DOI**. This will allow you to go back and reproduce your results later, with the same software version you used originally. To find the correct DOI, look in the footer of the app.

If you push changes to this project onto GRIFFIN's live toolkit, **be sure to update the DOI in the footer and in the table at the top of this file**. To get a new DOI, simply [make a new release via GitHub](https://help.github.com/articles/creating-releases/), then [visit Zenodo](https://zenodo.org/account/settings/github/), sign in with your GitHub credentials, and find this project in the list on that page; clicking on the badge will give you a bunch of options to cut and paste into the appropriate places. Add the markdown one to this document, and the HTML one to the footer.
