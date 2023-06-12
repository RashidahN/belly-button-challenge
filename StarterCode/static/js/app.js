let data = null

async function load() {
    let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
    let obj = await (await fetch(url)).json();
    // console.log(obj);
    return obj
}

(async () => {
    data = await load();

    //populate dropdown with 'ids' from 'names' object
    const select = document.getElementById("selDataset");
    const options = data.names
    console.log(options)
    for (var i = 0; i < options.length; i++) {
        const opt = options[i];
        const el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }

})();

//select an 'id' in the dropdown
function optionChanged(value) {

    if (value) {

        console.log(value)

        //get top 10 'otu_ids' for 'id' in 'samples'
        const samples = data.samples
        if (samples) {
            samples.forEach(sample => {
                const sampleId = Object.values(sample)[0]
                if (sampleId === value) {
                    console.log('sample data for id: ', sample)

                    //get the top 10 'otu_ids' for the 'id'
                    const otus = sample.otu_ids.slice(0, 10)
                    console.log('otus: ', otus)

                    const sampleVals = sample.sample_values.slice(0, 10)
                    console.log('sampleVals: ', sampleVals)

                    //create a map of otu ids and respective sample values
                    let otuSamples = {}
                    otus.forEach((k, v) => { otuSamples[k] = sampleVals[v] })
                    //NOTE: could not figure out how to preserve order becuase JS Object ruins it

                    console.log(otuSamples)

                    //create a visual diagrams based on selected 'id'
                    createBarGraph(otuSamples)
                    createBubbleGraph(sample)
                    populateDemographics(value, data.metadata)

                }
            });
        }

    }
}

function populateDemographics(id, metadata) {
    const infoElement = document.getElementById("sample-metadata")
    //remove previously created Elements
    infoElement.innerHTML = "";

    //get metadata for id
    metadata.forEach(meta => {

        if (parseInt(meta.id) === parseInt(id)) {

            //create a text HTML block for meta data
            const preElement = document.createElement("pre");
            let formattedText = "";
            for (const key in meta) {
                formattedText += `${key}: ${meta[key]}\n`;
            }

            preElement.textContent = formattedText;
            infoElement.appendChild(preElement);
        }
    })

}

function createBarGraph(data) {
    //remove previously created Elements
    const elementToRemove = document.getElementById("bar");
    elementToRemove.innerHTML = "";

    // Convert the object to an array of key-value pairs
    const dataArray = Object.entries(data);

    // Set up the chart dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 100 };

    // Create an SVG element
    const svg = d3.select("#bar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Create a scale for the x-axis
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(dataArray, d => d[1])])
        .range([0, width]);

    // Create x-axis
    const xAxis = d3.axisBottom(xScale);

    // Append x-axis to the chart
    svg.append("g")
        .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
        .call(xAxis);

    // Create a scale for the y-axis
    const yScale = d3.scaleBand()
        .domain(dataArray.map(d => d[0]))
        .range([0, height])
        .padding(0.1);

    // Create a group for the bars and labels
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add bars to the chart
    chartGroup.selectAll("rect")
        .data(dataArray)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => yScale(d[0]))
        .attr("width", d => xScale(d[1]))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue");

    // Add labels to the left of the bars
    chartGroup.selectAll("text")
        .data(dataArray)
        .enter()
        .append("text")
        .text(d => 'OTU ' + d[0])
        .attr("x", -10)
        .attr("y", d => yScale(d[0]) + yScale.bandwidth() / 2)
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle");
}

function createBubbleGraph(data) {

    // Sample data
    // const data = {
    //     otu_ids: [1, 2, 3],
    //     sample_values: [10, 20, 30],
    //     otu_labels: ['Label 1', 'Label 2', 'Label 3'],
    // };
    // const data = {
    //     otu_ids: data.otu_ids,
    //     sample_values: data.sample_values,
    //     otu_labels: data.otu_labels,
    // };

    //remove previously created Elements
    const elementToRemove = document.getElementById("bubble");
    elementToRemove.innerHTML = "";

    // Chart dimensions
    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    // Create the SVG container
    const svg = d3.select('#bubble')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Extract data arrays from the object
    const otu_ids = data.otu_ids;
    const sample_values = data.sample_values;
    const otu_labels = data.otu_labels;

    // Calculate the maximum values for scaling
    const maxSampleValue = d3.max(sample_values);
    const maxOtuID = d3.max(otu_ids);

    // Create scales for x, y, and radius
    const xScale = d3.scaleLinear()
        .domain([0, maxOtuID])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, maxSampleValue])
        .range([height - margin.bottom, margin.top]);

    const radiusScale = d3.scaleSqrt()
        .domain([0, maxSampleValue])
        .range([2, 10]);

    // Create color scale using categorical colors
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create x-axis
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));
    // Add x-axis label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .style('text-anchor', 'middle')
        .text('OTU ID');


    // Create y-axis
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Create bubbles
    svg.selectAll('circle')
        .data(otu_ids)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => xScale(d))
        .attr('cy', (d, i) => yScale(sample_values[i]))
        .attr('r', (d, i) => radiusScale(sample_values[i]))
        .attr('fill', (d, i) => colorScale(d))
        .attr('opacity', 0.7)
        .append('title')
        .text((d, i) => otu_labels[i]);
}