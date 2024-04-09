import { createTooltip } from "./tooltip.js";

let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data 
let values = [];

let heightScale  
let xScale 
let xAxisScale  
let yAxisScale  

let width = 900;
let height = 600;
let padding = 50;

let svg = d3.select("svg");

let drawCanvas = () => {
    svg.attr("width", width);
    svg.attr("height", height);
};

let generateScales = () => {
    //Defining the space where the data values will be positioned within the d3 visualization
    heightScale = d3.scaleLinear()
        .domain([0, d3.max(values, (item) => item[1])])
        .range([0, height - (2 * padding)]);

    xScale = d3.scaleLinear()
        .domain([0, values.length]) //Stablishing an x scale from the first (0) to the last (values.length - 1) data point in the array
        .range([padding, width - padding]);
    
    //Mapping each data item's first value to a JS Date object
    let datesArray = values.map((item) => {
        return new Date(item[0]);
    })

    //Positioning the earliest and latest dates along the x-axis
    xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([padding, width - padding]);

    //Positioning values from min to max (GDP) along the y-axis
    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(values, (item) => item[1])])
        .range([height - padding, padding]);
};

let generateAxes = () => {
    //Creating axis generators
    let xAxis = d3.axisBottom(xAxisScale);  //Rendering tick marks and labels along the bottom of the visualization
    let yAxis = d3.axisLeft(yAxisScale); //Rendering tick marks and labels along the left side of the visualization

    //Appending <g> (group) elements to the SVG container
    svg.append("g")
        .call(xAxis) //This generates the actual axis elements with labels based on the scale (xAxisScale)
        .attr("id", "x-axis")
        //Translating it to the bottom of the SVG, first argument "0" represents "x" axis position, second (" + (height - padding) + ") represents "y" axis position
        .attr("transform", "translate(0, " + (height - padding) + ")") 

    svg.append("g")
        .call(yAxis) //This generates the actual axis elements with labels based on the scale (yAxisScale)
        .attr("id", "y-axis")
        //Translating it to the left side of the SVG, first argument (" + padding + ") represents "x" axis position, second (0) represents "y" axis position
        .attr("transform", "translate(" + padding + ", 0)") 
};

const tooltip = createTooltip("#tooltip");

//Creating the bars of the scale
let drawBars = () => {
    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", (width - padding) / values.length)
        .attr("data-date", (item) => item[0])
        .attr("data-gdp", (item) => item[1])
        .attr("height", (item) => heightScale(item[1]))
        .attr("x", (item, index) => xScale(index))
        .attr("y", (item) => (height - padding) - heightScale(item[1]))
        .on("mouseover", (event, item) => {
            tooltip.showTooltip(event, item);
        })
        .on("mousemove", event => {
            tooltip.updateTooltipPosition(event);
        })
        .on("mouseout", () => {
            tooltip.hideTooltip();
        })
};

req.open("GET", url, true) //argument "true" because we want this to be managed asychronously
req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;

    drawCanvas();
    generateScales();
    drawBars();
    generateAxes();
}
req.send();