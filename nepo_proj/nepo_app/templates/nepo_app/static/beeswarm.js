const height = 500;
const width = 1000;
const margin = {
   top: 50,
   left: 50,
   right: 50,
   bottom: 50
};
const padding = 10;

const numTypes = 2; // types of media (tv + film)
const numCols = 18; // number of boxes in a waffle graph

const boxSize = 12 // size of individual blocks (representing titles) in the waffle chart
const boxSpace = 14 // space in between boxes

const plotWidth = (width - padding) / numTypes - padding;
const plotHeight = height - padding * 2;

const nonepoColor = "#dbdbdb" // color for titles with 0% nepo babies in top cast
const nepoColor = "#ff0000" // color for titles with nepo babies in top cast

const svg = d3.select(".waffle")
  .append("svg")
  .attr("width", margin.left + width + margin.right)
  .attr("height", margin.top + height + margin.bottom);
  
const g = svg
  .append("g")
  .attr("transform","translate(" + [margin.left, margin.top] + ")");

const div = d3.select(".waffle")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)

d3.csv("https://raw.githubusercontent.com/jessvoiture/are_they_a_nepo/main/test_data.csv", d3.autoType).then(function(data){

    const dataset = data.sort(function(x, y){
        return d3.ascending(x.pct_nepo, y.pct_nepo);
    })

    console.log(dataset);

    const type = d3.group(dataset, d => d.type);

    svg.append("text")
        .attr("x", 0)
        .attr("y", -30)
        .text("Film")
        .style("font-weight", "bold")
        .style("font-size", 20)
        .style("font-family", "Helvetica")
    
    svg.append("text")
        .attr("x", 210)
        .attr("y", -30)
        .text("TV")
        .style("font-weight", "bold")
        .style("font-size", 20)
        .style("font-family", "Helvetica")
  
    const plots = g
        .selectAll(null)
        .data(type)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
          return "translate(" + [0.65 * i * (padding + plotWidth) + padding, padding] + ")";
        })
  
    plots
        .selectAll(null)
        .data(d => d[1])
        .enter()
        .append("rect")
        .attr("width", boxSize)
        .attr("height", boxSize)
        .attr("x", function(d, i){
            var colIndex = i % numCols
            return colIndex * boxSpace
        })
        .attr("y", function(d, i){
            var rowIndex = Math.floor(i/numCols)
            return rowIndex * boxSpace
        })
        .attr("r", 10)
        .style("fill", function (d){
          if (d.pct_nepo == 0) {
            return nonepoColor
          } else {
            return nepoColor
          }
        })
        .style("stroke", "none")
        .on("mouseover", function(event, d) {
              div.transition()
                .duration(200)
                .style("opacity", 1)
              var element = d3.select(this)
              element.style("fill", "Black")
              div.html("<span style = 'font-weight: bold'>" + d.fullTitle + "</span>" + "<br>" + 
                       "<span style = 'font-style: italic'>" + d.pct_nepo + "% of the top cast is a nepo baby" + "</span>")
                .style("left", (event.pageX - 100) + "px")
                .style("top", (event.pageY - 75) + "px");
              })
        .on("mouseout", function(d) {
              div.transition()
                .duration(100)
                .style("opacity", 0);
              var element = d3.select(this)
              element.style("fill", function (d){
                if (d.pct_nepo == 0) {
                  return nonepoColor
                } else {
                  return nepoColor
                }
              })
              });

    plots
      .append("text")
      .attr("x", plotWidth / 2 - 115)
      .attr("y", -10)
      .text(function(d) {
        return d[1][0].type;
      })
      .attr("text-anchor","middle");
})
