// Set the URL for the JSON data source
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use D3 to fetch the JSON data and log it to the console
d3.json(url).then(function(data) {
  buildCharts(data.names[0]);
  buildMetadata(data.names[0]);
  updateGaugeChart(data.metadata[0].wfreq);
});
    
// Function for when the user selects a new sample from the dropdown menu
function optionChanged(newSample) {
    d3.json(url).then(function(data) {
        var metadata = data.metadata;
        var result = metadata.filter(sampleObj => sampleObj.id == newSample)[0];
        buildCharts(newSample);
        buildMetadata(newSample);
        updateGaugeChart(result.wfreq);
    });
}
// Function to update the gauge chart based on the washing frequency
function updateGaugeChart(wfreq) {
  var level = parseFloat(wfreq) * 10;

  
  var degrees = (180 - level) * 2,
      radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Create the path for the needle of the gauge
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(-x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  // Define the data and layout for the gauge chart
  var data = [    
    {
    // Marker for the needle of the gauge      
    type: 'scatter',      x: [0], y:[0],
    marker: {size: 18, color:'850000'},
    showlegend: false,
    },
    {
      // Pie chart to show the different washing frequency ranges
      values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
      textinfo: 'text',
      textposition:'inside',
      marker: {
        colors: [
          '#66240F',
          '#993D16',
          '#BF5B1B',
          '#E68425',
          '#FF992C',
          '#FFAE60',
          '#FFC484',
          '#FFD8A8',
          '#FFEDCC',
          '#FFFFFF'
        ]
      },
      hole: .4,
      type: 'pie',
      showlegend: false,
    }
  ];
  // Add the needle
  var layout = {
    shapes: [
      {
        type: 'path',
        path: path + 'Z',
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }
    ],
    // Set gauge chart properties
    title: '<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week',
    height: 600,
    width: 600,
    xaxis: {zeroline:false, showticklabels:false,
            showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
            showgrid: false, range: [1, -1]}
  };
  
  Plotly.newPlot('gauge', data, layout);
}