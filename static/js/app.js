// defining the variable for url
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// using D3 to fetch data
d3.json(url).then(function(data) {
    buildCharts(data.names[0]);
    buildMetadata(data.names[0]);
});

// function to initialize the dropdown menu
function init() {
  // slecting the element
  var selector = d3.select("#selDataset");

  // D3 to get the sample names
  d3.json(url).then((data) => {
    var sampleNames = data.names;
    // looping through samples
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // building insitial plot from first sample
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// init dashboard
init();
// Define function charts and metadata
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}
// defining the metadata
function buildMetadata(sample) {
  // D3 to get all the samples
  d3.json(url).then((data) => {
    var metadata = data.metadata;

    // filtering through the samples
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
  
    // selecting metadata pannel
    var PANEL = d3.select("#sample-metadata");

    // clearing the previous result
    PANEL.html("");

    // looping to key values
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });
  });
}


// Building horizontal bar chart
function buildCharts(sample) {
  // Using D3 to fetch data for all samples
  d3.json(url).then((data) => {
    var samples = data.samples;

    // Filtering the data for desired sample number
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Get the top 10 otu's with values
    var otuIds = result.otu_ids.slice(0, 10).reverse();
    var otuLabels = result.otu_labels.slice(0, 10).reverse();
    var sampleValues = result.sample_values.slice(0, 10).reverse();

    // Format the otu IDs for to display in the bar chart
    var otuIdsFormatted = otuIds.map(id => "OTU " + id);

    // Create the bar chart trace
    var trace = {
      x: sampleValues,
      y: otuIdsFormatted,
      text: otuLabels,
      type: "bar",
      orientation: "h",
      marker: {color: otuIds}
      };

      // Add the bar chart trace to the data array
      var data = [trace];

      // Define the chart layout
      var layout = {
      title: "Top 10 Bacteria Cultures Found",
      };
      // Create the bar chart
      Plotly.newPlot("bar", data, layout);
      
// Create the trace for the bubble chart
    var trace2 = {
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: "markers",
      marker: {
        size: result.sample_values,
        color: result.otu_ids
      }
    };

// Add the bubble chart trace to the data array
    var data2 = [trace2];

    // Define the bubble chart layout
    var layout2 = {
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      hovermode: "closest",
      showlegend: false
    };
    // Create the bubble chart
    Plotly.newPlot("bubble", data2, layout2);

});
}