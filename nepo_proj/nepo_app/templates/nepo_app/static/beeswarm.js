const waffle = d3.select('.waffle');
const histogram = d3.select('.histogram');

d3.csv("https://raw.githubusercontent.com/jessvoiture/are_they_a_nepo/main/test_data.csv").then(function(data){
    
    console.log(data);

    // WAFFLE CHART
    // the waffle chart will display the number of titles that do and do not have nepo babies in their top cast
    // split by type of media (film or tv)

    // sort titles by pct nepo so that the colors are uniform in the waffle chart
    const titles = data.sort(function(x, y){
        return d3.ascending(x.pct_nepo, y.pct_nepo);
     })

    // group data by type (film or tv) to split up waffle chart
    const grouped_type = d3.group(titles, d => d.type);

    // titles with no nepo babies should be grey (#CCCCCC) in waffle chart, everything else is #FE4A49
    const colors = ["#CCCCCC", "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49", 
    "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49", 
    "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49", "#FE4A49"];
    scaleColor = d3.scaleOrdinal()
        .domain(titles.map(d => d.pct_nepo))
        .range(colors);

    // create a container for each type of media (group) 
    const waff_group = waffle
        .selectAll(".container")
        .data(grouped_type)
        .join("div")
        .attr("class", "container");

    // create block within container for each title
    waff_group  
        .selectAll('.block')
	    .data(function(d) { return d[1]; })
	    .join("div")
        .attr("class", "block")
        .style("background-color", d => scaleColor(d.pct_nepo));

    // HISTOGRAM
    // histogram classes will be percent nepo babies, so chart will display number of titles 
    // which have n number/pct of nepo babies in the top cast 

    const grouped_nepo = d3.group(titles, d => d.pct_nepo);
    array_test = Array.from(grouped_nepo);

    const hist_group = histogram
	    .selectAll('.bar')
	    .data(array_test)
	    .enter()
	    .append('div')
	    .attr('class', 'bar');

     hist_group
        .selectAll('.block')
        .data(function(d) { return d[1]; })
        .enter()
        .append('div')
        .attr('class', 'block');

    hist_group.append('text').text(d => d.pct_nepo);

    test = array_test[1]

    console.log(test);
    })

