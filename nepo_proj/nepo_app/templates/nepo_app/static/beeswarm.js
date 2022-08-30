gsap.registerPlugin(ScrollTrigger);

const height = 1000;
const width = 600;
const margin = {
   top: 50,
   left: 50,
   right: 50,
   bottom: 50
};

const padding = 10;

const numTypes = 2; // types of media (tv + film)
const numCols = 18; // number of boxes in a waffle graph

const boxSize = 6 // size of individual blocks (representing titles) in the waffle chart
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
  .style("opacity", 0);

d3.csv("https://raw.githubusercontent.com/jessvoiture/are_they_a_nepo/main/test_data.csv").then(function(data){

    // sort by the percent nepo baby in cast
    const dataset = data.sort(function(x, y){
        return d3.ascending(x.pct_nepo, y.pct_nepo);
    })

    console.log(dataset);

    // group by type of media (tv or film) to a plot for each
    const type = d3.group(dataset, d => d.type);

    // create two plots for each media type
    const plots = g
        .selectAll(null)
        .data(type)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
          return "translate(" + [i * (padding + plotWidth) + padding, padding] + ")";
        })
  
    // create individual block for each title    
    let boxes = plots
        .selectAll(null)
        .data(d => d[1])
        .enter()
        .append("circle")
        .attr("class", "blocks")
        .attr("r", boxSize)
        // .attr("height", boxSize)
        .attr("cx", function(d, i){
            var colIndex = i % numCols
            return colIndex * boxSpace
        })
        .attr('cy', () => Math.random() * height)
        // conditional fill based on percent nepo baby in top cast
        .style("fill", nonepoColor)
        .style("opacity", 0);
        // .on("mouseover", function(event, d) {
        //       div.transition()
        //         .duration(200)
        //         .style("opacity", 1);
        //       var element = d3.select(this)
        //       element.style("fill", "Black")
        //       div.html("<span style = 'font-weight: bold'>" + d.fullTitle + "</span>" + "<br>" +
        //                d.pct_nepo + "% nepo baby")
        //         .style("left", (event.pageX - width - 130) + "px")
        //         .style("top", (event.pageY - 80) + "px");
        //       })
        // .on("mouseout", function(d) {
        //       div.transition()
        //         .duration(100)
        //         .style("opacity", 0);
        //       var element = d3.select(this)
        //       element.style("fill", function (d){
        //         if (d.pct_nepo == 0) {
        //           return nonepoColor;
        //         } else {
        //           return nepoColor;
        //         }
        //       })
        //       });


      // add titles to each plot
    plots
      .append("text")
      .attr("x", plotWidth / 2)
      .attr("y", -10)
      .text(function(d) {
        return d[1][0].type;
      })
      .attr("text-anchor","middle");

    //sets up the class toggle on each scrolling text box
    //so that it becomes opaque when in view and transparent when exiting
    gsap.utils.toArray('.step').forEach(step => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 80%',
        end: 'center top',
        toggleClass: 'active',
        id: 'toggle-active-class'
      });
    });

    // Scroll trigger: organizes boxes into waffle graph
    ScrollTrigger.create({
      trigger: '#step1',
      start: 'top center',
      onEnter: block_entrance,
      markers: false,
      id: 'block entrance'
    });

    // Scroll trigger: colors blocks on whether they have nepo or not
    ScrollTrigger.create({
      trigger: '#step2',
      start: 'top center',
      onEnter: changeColor,
      onLeaveBack: changeColorBack,
      markers: false,
      id: 'change color'
    });

    // Scroll trigger: sizes blocks on pct_nepo
    ScrollTrigger.create({
      trigger: '#step3',
      start: 'top center',
      onEnter: nepoSize,
      markers: false,
      id: 'nepo size'
    });

    // organizes boxes into waffle graph
    function block_entrance() {
      boxes
        .transition()
        .duration(700)
        .attr("cy", function(d, i){
          var rowIndex = Math.floor(i/numCols)
          return rowIndex * boxSpace
        })
        .style("opacity", 1)
    }

    // colors blocks on whether they have nepo or not
    function changeColor() {
      boxes
        .transition()
        .duration(700)
        .style("fill", function (d){
          if (d.pct_nepo == 0) {
            return nonepoColor;
          } else {
            return nepoColor;
          }
      })
    }

    // colors blocks all no nepo color
    function changeColorBack() {
      boxes
        .transition()
        .duration(700)
        .style("fill", nonepoColor)
    }

    
})
