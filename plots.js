function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })
  buildMetadata("940");
  buildCharts("940");
}

  init();

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => PANEL.append("h6").text(key.toUpperCase() 
        + ': ' + value));
    });
  }
  
  // 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var newSampleData = samples.filter(sampleObj => sampleObj.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    result = newSampleData[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otu_ids = result.otu_ids
    otu_labels = result.otu_labels
    sample_values = result.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //var yticks_a = otu_ids.map(data => data).sort((a,b) => b-a).slice(0,10);
   // var yticks_a = otu_ids.slice(0,10);
    var yticks = []
    //yticks_a.forEach((data) => {yticks.push("OTU " + data);});
    otu_ids.slice(0,10).forEach((data) => {yticks.push("OTU " + data);});

    // 8. Create the trace for the bar chart. 
    var barData = {
        x: sample_values.map(data => data).sort((a,b) => b-a).slice(0,10).reverse(),
        y: yticks.reverse(),
        type: "bar",
        orientation: "h"
  };

    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacterial Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // Bubble chart
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values
      } 
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",[bubbleData], bubbleLayout); 

    // Gauge chart
    // Get wfreq
    var metadata = data.metadata;
    var filtMetadata = metadata.filter(sampleObj => sampleObj.id == sample);
    var result_meta = filtMetadata[0];
    var freq = result_meta.wfreq

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: freq,
        title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        gauge: {
          axis: { range: [null,10] },
          bar: { color: "black" },
          steps: [ 
            { range: [0,2], color: "Red" },
            { range: [2,4], color: "Orange" },
            { range: [4,6], color: "Yellow" },
            { range: [6,8], color: "YellowGreen" },
            { range: [8,10], color: "Green" }
          ]
        }
      }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
        width: 600,
        height: 450,
        margin: { t: 0, b: 0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
}