  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
  
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // Build a Bubble Chart
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  
  function getUnique(arr, comp) {

    // store the comparison  values in array
    const unique =  arr.map(e => e[comp])

    // store the indexes of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the false indexes & return unique objects
    .filter((e) => arr[e]).map(e => arr[e]);

  return unique;
}

  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    const url = "/api/v1.0/spotify"
  
    // Use the list of unique countries to populate the select options
    d3.json(url).then((data) => {
      var countries = this.getUnique(data, "country");
  
      countries.forEach((country) => {
        selector
          .append("option")
          .text(country)
          .property("value", country);
      });
  
      // Use the first country from the list to build the initial plots
      var firstCountry = countries[0];
      buildCharts(firstCountry);
      buildMetadata(firstCountry);
    });
  }
  
  function optionChanged(newCountry) {
    // Fetch new data each time a new country is selected
    buildCharts(newCountry);
    buildMetadata(newCountry);
  }
  
  // Initialize the dashboard
  init();
  