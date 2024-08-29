{
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata for the specific sample
    let metadata = data.metadata.filter(obj => obj.id == sample)[0];

    // Select the panel with id of `#sample-metadata` and clear any existing metadata
    let panel = d3.select("#sample-metadata");
    panel.html("");

    // Loop through each key-value pair in the filtered metadata and append new HTML tags
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleData = samples.filter(obj => obj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sampleData.otu_ids;
    let otuLabels = sampleData.otu_labels;
    let sampleValues = sampleData.sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds
      },
      text: otuLabels
    }];

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample", // Add title to the bubble chart
      xaxis: {
        title: {
          text: 'OTU ID' // Add bottom label
        }
      },
      yaxis: {
        title: {
          text: 'Number of Bacteria' // Add side label
        }
      }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yTicks = otuIds.map(id => `OTU ${id}`);

    // Build a Bar Chart
    let barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yTicks.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
      text: otuLabels.slice(0, 10).reverse(), // Add text labels to the bars
      marker: {
        color: 'rgb(158,202,225)' // Change bar color
      }
    }];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found", // Add title to the bar chart
      xaxis: {
        title: {
          text: 'Number of Bacteria' // Add bottom label
        }
      }
    };

    // Don't forget to slice and reverse the input data appropriately
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to display the sample's metadata
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let metadata = data.metadata.filter(obj => obj.id == sample)[0];
    let panel = d3.select("#sample-metadata");
    panel.html("");

    // Loop through each key-value pair in the filtered metadata and append new HTML tags
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function for event listener
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let sampleNames = data.names;
    let dropdown = d3.select("#selDataset");

    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).attr("value", sample);
    });

    let firstSample = sampleNames[0];

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialise the dashboard
init();