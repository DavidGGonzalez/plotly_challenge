// To set the data file location
const dataFileLocation = "./static/data/samples.json"

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json(dataFileLocation).then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json(dataFileLocation).then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json(dataFileLocation).then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var metadata = data.metadata;
    var metaResultArray = metadata.filter(sampleObj => sampleObj.id == sample);


    //  5. Create a variable that holds the first sample in the array.
    // For the person
    var result = resultArray[0];
    // for the person metadata
    var metadataResult = metaResultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    //Create a variable that converts the washing frequency to a floating point number
    var wfreq = parseFloat(metadataResult.wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values,
        text: otu_labels,
        type: "bar",
        orientation: "h",

      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: `<b>Top 10</b> Bacteria Cultures Found in Sample <b>${sample}</b>`
    };
    
    // 10. Use Plotly to plot the data with the layout.
    //Plot Bar chart
    Plotly.newPlot("bar", barData, barLayout);

    //Plot Bubble Chart
    //Data/Trace
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: `markers`,
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    
    //Layout
    var bubbleLayout = {
      title: `All Bacteria Cultures Per Sample <b>${sample}</b>`,
      showlegend: false,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Bacteria Count" },

    };

    //Plot it
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //Gauge
    //Data/Trace
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreq,
        title: { text: "<b>Belly Button Wash Frequency</b><br>Scrubs per Week", font: { size: 24 } },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "limegreen" },
            { range: [8, 10], color: "green" },
          ],
        }
      }
    ];

    //Layout
    var gaugeLayout = {
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: {color: "dblack", family: "Arial"},
    };

    //Plot it
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
