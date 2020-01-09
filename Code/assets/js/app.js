
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create a place for the chart
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data.csv")
  .then(function(stateData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      //console.log(data.poverty);
    });
    
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([6, d3.max(stateData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(stateData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    
      

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5")
    //.attr("class", "nodetext")
    .text(d => d.abbr);

    //create bubble text
    var text = chartGroup.selectAll("null")
      //.attr("class", "labels")
      //.selectAll("text")
      .data(stateData)
      .enter()
      .append("text");
  
    var textLabels = text
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .text(d => d.abbr)
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "white");
    

     // Create axes labels
     chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left + 40)
     .attr("x", 0 - (height)+ 150)
     .attr("dy", "1em")
     .attr("class", "axisText")
     .text("Without Healthcare (%)");

   chartGroup.append("text")
     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
     .attr("class", "axisText")
     .text("In Poverty (%)");
});