var oldWidth = 0
function render(){
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth

  var margin = 15;
  var radius = 3;
  var graph1_width = d3.select(' #container-1 .graph').node().offsetWidth;
  var graph1_height = d3.select(' #container-1 .graph').node().offsetHeight;
  var graph1_verticalSize = graph1_height - margin * 2;
  var graph1_horizontalSize = graph1_width - margin * 2;
  var scaleX = null;
  var scaleY = null;
  
  //code for line animation borrowed from Pablo Gutierrez (https://observablehq.com/@blosky/animated-line-chart)
  function transition(path) {
      path.transition()
          .duration(2000)
          .attrTween("stroke-dasharray", tweenDash)
          .on("end", () => { d3.select('.temperature-line').call(transition); });
  }

  function tweenDash() {
      const l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l);
      return function(t) { return i(t) };
  }

  // Reusable employment trends
  var global_change_min = -18;
  var global_change_max = 4;
  var global_date_start = new Date(2020, 0, 1);
  var global_date_end = new Date(2022, 0, 1);
  var data_totalNonFarm_jan_to_apr_2020 = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.247160286},{"date":"2020-03-01","change":-0.737536811},{"date":"2020-04-01","change":-14.20842974}];
  var data_totalNonFarm = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.247160286},{"date":"2020-03-01","change":-0.737536811},{"date":"2020-04-01","change":-14.20842974},{"date":"2020-05-01","change":-12.47173433},{"date":"2020-06-01","change":-9.510412284},{"date":"2020-07-01","change":-8.598022718},{"date":"2020-08-01","change":-7.503549642},{"date":"2020-09-01","change":-6.899453092},{"date":"2020-10-01","change":-6.474153345},{"date":"2020-11-01","change":-6.255258729},{"date":"2020-12-01","change":-6.330852966},{"date":"2021-01-01","change":-5.989035549},{"date":"2021-02-01","change":-5.522323307},{"date":"2021-03-01","change":-5.059555111},{"date":"2021-04-01","change":-4.886674379},{"date":"2021-05-01","change":-4.592842869},{"date":"2021-06-01","change":-4.226703828},{"date":"2021-07-01","change":-3.773795751},{"date":"2021-08-01","change":-3.433950358},{"date":"2021-09-01","change":-3.155237695},{"date":"2021-10-01","change":-2.710217711},{"date":"2021-11-01","change":-2.284917964},{"date":"2021-12-01","change":-1.949673959},{"date":"2022-01-01","change":-1.642695625}];
  var data_healthcareAndSocialAssistance_jan_to_apr_2020 = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.29},{"date":"2020-03-01","change":-0.35},{"date":"2020-04-01","change":-10.87}];
  var data_healthcareAndSocialAssistance = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.29},{"date":"2020-03-01","change":-0.35},{"date":"2020-04-01","change":-10.87},{"date":"2020-05-01","change":-9.06},{"date":"2020-06-01","change":-6.77},{"date":"2020-07-01","change":-5.87},{"date":"2020-08-01","change":-5.2},{"date":"2020-09-01","change":-4.69},{"date":"2020-10-01","change":-4.27},{"date":"2020-11-01","change":-3.99},{"date":"2020-12-01","change":-3.68},{"date":"2021-01-01","change":-3.98},{"date":"2021-02-01","change":-3.71},{"date":"2021-03-01","change":-3.41},{"date":"2021-04-01","change":-3.28},{"date":"2021-05-01","change":-3.21},{"date":"2021-06-01","change":-3.22},{"date":"2021-07-01","change":-3.05},{"date":"2021-08-01","change":-2.98},{"date":"2021-09-01","change":-2.98},{"date":"2021-10-01","change":-2.8},{"date":"2021-11-01","change":-2.62},{"date":"2021-12-01","change":-2.47},{"date":"2022-01-01","change":-2.39}];
  var data_ambulatory = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.31},{"date":"2020-03-01","change":-0.81},{"date":"2020-04-01","change":-16.83},{"date":"2020-05-01","change":-11.77},{"date":"2020-06-01","change":-6.95},{"date":"2020-07-01","change":-5.23},{"date":"2020-08-01","change":-4.05},{"date":"2020-09-01","change":-3.15},{"date":"2020-10-01","change":-2.43},{"date":"2020-11-01","change":-1.97},{"date":"2020-12-01","change":-1.54},{"date":"2021-01-01","change":-1.62},{"date":"2021-02-01","change":-1.13},{"date":"2021-03-01","change":-0.74},{"date":"2021-04-01","change":-0.29},{"date":"2021-05-01","change":-0.1},{"date":"2021-06-01","change":0.02},{"date":"2021-07-01","change":0.41},{"date":"2021-08-01","change":0.56},{"date":"2021-09-01","change":0.99},{"date":"2021-10-01","change":1.42},{"date":"2021-11-01","change":1.69},{"date":"2021-12-01","change":1.84},{"date":"2022-01-01","change":2.03}];
  var data_hospital = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.12},{"date":"2020-03-01","change":0.13},{"date":"2020-04-01","change":-2.37},{"date":"2020-05-01","change":-3.04},{"date":"2020-06-01","change":-2.88},{"date":"2020-07-01","change":-2.6},{"date":"2020-08-01","change":-2.43},{"date":"2020-09-01","change":-2.42},{"date":"2020-10-01","change":-2.18},{"date":"2020-11-01","change":-2.08},{"date":"2020-12-01","change":-1.36},{"date":"2021-01-01","change":-2.04},{"date":"2021-02-01","change":-2.07},{"date":"2021-03-01","change":-1.87},{"date":"2021-04-01","change":-1.97},{"date":"2021-05-01","change":-1.95},{"date":"2021-06-01","change":-1.98},{"date":"2021-07-01","change":-1.98},{"date":"2021-08-01","change":-1.9},{"date":"2021-09-01","change":-2.06},{"date":"2021-10-01","change":-2.04},{"date":"2021-11-01","change":-1.98},{"date":"2021-12-01","change":-1.94},{"date":"2022-01-01","change":-1.88}];
  var data_nursing = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":-0.04},{"date":"2020-03-01","change":-0.22},{"date":"2020-04-01","change":-4},{"date":"2020-05-01","change":-5.29},{"date":"2020-06-01","change":-5.85},{"date":"2020-07-01","change":-6.48},{"date":"2020-08-01","change":-6.85},{"date":"2020-09-01","change":-7.02},{"date":"2020-10-01","change":-7.25},{"date":"2020-11-01","change":-7.57},{"date":"2020-12-01","change":-7.96},{"date":"2021-01-01","change":-8.59},{"date":"2021-02-01","change":-8.86},{"date":"2021-03-01","change":-9.02},{"date":"2021-04-01","change":-9.58},{"date":"2021-05-01","change":-9.89},{"date":"2021-06-01","change":-10.27},{"date":"2021-07-01","change":-10.6},{"date":"2021-08-01","change":-10.76},{"date":"2021-09-01","change":-12.02},{"date":"2021-10-01","change":-12.12},{"date":"2021-11-01","change":-12.17},{"date":"2021-12-01","change":-12.15},{"date":"2022-01-01","change":-12.15}];

  function _emp_path_generator(chart,line_generator,data,idName,title,strokeColor) {
    chart.append('path')
        .attr("id", idName)
        .classed('timeseries', true)
        .attr("d",line_generator(data))
        .attr("fill","none")
        .attr("stroke",strokeColor)
        .attr("stroke-width","1.5")
        .attr("stroke-miterlimit","1")
      .append("title")
        .text(title);
  }

  function _emp_path_generator_transition(chart,line_generator,data,idName,title,strokeColor) {
    chart.append('path')
        .attr("id", idName)
        .classed('timeseries', true)
        .attr("d",line_generator(data))
        .attr("fill","none")
        .attr("stroke",strokeColor)
        .attr("stroke-width","1.5")
        .attr("stroke-miterlimit","1")
        .call(transition)
      .append("title")
        .text(title);
  }

  function _emp_points_generator(chart,x,y,data,forPathId,title,fillColor) {
    chart.selectAll('circle'+'.'+forPathId+'_point')
      .data(data)
      .enter()
      .append('circle')
        .attr('id', function(d,i) {return forPathId + '_point_' + i})
        .attr('class', ' dataPoint ' + forPathId + '_point')
        .attr('cx', function(d) {return x(d3.timeParse("%Y-%m-%d")(d.date))})
        .attr('cy', function(d) {return y(d.change)})
        .attr('r',  radius)
        .style('fill', fillColor)
        .style('opacity', '0.5');
  }

  function _emp_generator(svg,x,y,line_generator,data,pathIdName,title,color,includePoints,includeTransition) {
    var chart = svg.selectAll('.chart');
    if (includeTransition) {
      _emp_path_generator_transition(chart,line_generator,data,pathIdName,title,color);
    } else {
      _emp_path_generator(chart,line_generator,data,pathIdName,title,color);
    }
    if(includePoints) {
      _emp_points_generator(chart,x,y,data,pathIdName,title,color);
    }
  }

  function graph_totalNonFarm_jan_to_apr_2020(svg,x,y,line_generator,includePoints,includeTransition) {
    _emp_generator(svg,x,y,line_generator,data_totalNonFarm_jan_to_apr_2020,"totalNonFarm_jan_to_apr_2020","Total","grey",includePoints,includeTransition);
  }
  
  function graph_totalNonFarm(svg,x,y,line_generator,includePoints,includeTransition) {
    _emp_generator(svg,x,y,line_generator,data_totalNonFarm,"totalNonFarm","Total","grey",includePoints,includeTransition);
  }

  function graph_healthcareAndSocialAssistance_jan_to_apr_2020(svg,x,y,line_generator,includePoints,includeTransition) {
    _emp_generator(svg,x,y,line_generator,data_healthcareAndSocialAssistance_jan_to_apr_2020,"healthcareAndSocialAssistance_jan_to_apr_2020","Healthcare and Social Assistance","green",includePoints,includeTransition);
  }

  function graph_healthcareAndSocialAssistance(svg,x,y,line_generator,includePoints,includeTransition) {
    _emp_generator(svg,x,y,line_generator,data_healthcareAndSocialAssistance,"healthcareAndSocialAssistance","Healthcare and Social Assistance","green",includePoints,includeTransition);
  }

  function graph_ambulatory(svg,x,y,line_generator,includePoints,includeTransition) {
    _emp_generator(svg,x,y,line_generator,data_ambulatory,"ambulatory","Ambulatory Care","steelblue",includePoints,includeTransition);
  }

  function graph_hospital(svg,x,y,line_generator,includePoints,includeTransition) {
    _emp_generator(svg,x,y,line_generator,data_hospital,"hospital","Hospitals","orange",includePoints,includeTransition);
  }

  function graph_nursing(svg,x,y,line_generator,includePoints,includeTransition) {
    _emp_generator(svg,x,y,line_generator,data_nursing,"nursing","Nursing and Residential Care","salmon",includePoints,includeTransition);
  }

  function graph_allLines(svg,x,y,line_generator,includePoints,includeTransition) {
    graph_totalNonFarm(svg,x,y,line_generator,includePoints,includeTransition);
    graph_healthcareAndSocialAssistance(svg,x,y,line_generator,includePoints,includeTransition);
    graph_ambulatory(svg,x,y,line_generator,includePoints,includeTransition);
    graph_hospital(svg,x,y,line_generator,includePoints,includeTransition);
    graph_nursing(svg,x,y,line_generator,includePoints,includeTransition);
  }
  function graph_totalAndSector(svg,x,y,line_generator,includePoints,includeTransition) {
    graph_totalNonFarm(svg,x,y,line_generator,includePoints,includeTransition);
    graph_healthcareAndSocialAssistance(svg,x,y,line_generator,includePoints,includeTransition);
  }
  function graph_allSubsectors(svg,x,y,line_generator,includePoints,includeTransition) {
    graph_ambulatory(svg,x,y,line_generator,includePoints,includeTransition);
    graph_hospital(svg,x,y,line_generator,includePoints,includeTransition);
    graph_nursing(svg,x,y,line_generator,includePoints,includeTransition);
  }

  // Graphic 1: Total employment trends
  var graph1Svg = d3.select('#container-1 .graph').html('')
    .append('svg')
      .attrs({width: graph1_width, height: graph1_height});

  var gs = d3.graphScroll()
      .container(d3.select('#container-1'))
      .graph(d3.selectAll('#container-1 .graph'))
      .eventId('uniqueId1')  // namespace for scroll and resize events
      .sections(d3.selectAll('#container-1 .sections > div'))
      .on('active', function(i){
        if(i <= graph1Steps.length-1) {
          graph1Steps[i]();
        }        
      })

  var _graph1_x = d3.scaleTime()
    .domain([global_date_start,global_date_end])
    .range([margin, graph1_horizontalSize]);

  var _graph1_y = d3.scaleLinear()
    .domain([global_change_min,global_change_max])
    .range([graph1_verticalSize, margin]);

  var _graph1_line_generator = d3.line()
    .x(d => _graph1_x(d3.timeParse("%Y-%m-%d")(d.date)))
    .y(d => _graph1_y(d.change));

  function graph1_clearItems() {
      var chart = graph1Svg.selectAll('.chart');
      chart.selectAll(".timeseries")
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();
      chart.selectAll(".dataPoint")
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();
  }

  var graph1Steps = [
    function () {
      graph1_clearItems();
      graph_totalNonFarm_jan_to_apr_2020(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, true);
    },

    function () {
      graph1_clearItems();
      graph_totalNonFarm_jan_to_apr_2020(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, false);
      graph_healthcareAndSocialAssistance_jan_to_apr_2020(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, true);
    },

    function () {
      graph1_clearItems();
      // These are to make the animation appear for only the part after the drop
      graph_totalNonFarm_jan_to_apr_2020(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, false);
      graph_healthcareAndSocialAssistance_jan_to_apr_2020(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, false);
      // Animated lines
      graph_totalNonFarm(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, true);
      graph_healthcareAndSocialAssistance(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, true);
    },

    function () {
      graph1_clearItems();
      graph_ambulatory(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, false);
    },

    function () {
      graph1_clearItems();
      graph_ambulatory(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, false);
      graph_hospital(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, true);
    },

    function () {
      graph1_clearItems();
      graph_ambulatory(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, false);
      graph_hospital(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, false);
      graph_nursing(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, true);
    },
  ]

  // Graph 2
  var graph2_width = d3.select(' #container-2 .graph').node().offsetWidth;
  var graph2_height = (d3.select(' #container-2 .graph').node().offsetHeight)*0.90; // size this down to allow space for selector
  var graph2_verticalSize = graph2_height - margin * 2;
  var graph2_horizontalSize = graph2_width - margin * 2;

  var graph2Svg = d3.select('#container-2 .graph').html('')
    .append('svg')
      .attrs({width: graph2_width, height: graph2_height});

  var _graph2_x = d3.scaleTime()
    .domain([global_date_start,global_date_end])
    .range([margin, graph2_horizontalSize]);

  var _graph2_y = d3.scaleLinear()
    .domain([global_change_min,global_change_max])
    .range([graph2_verticalSize, margin]);

  var _graph2_line_generator = d3.line()
    .x(d => _graph2_x(d3.timeParse("%Y-%m-%d")(d.date)))
    .y(d => _graph2_y(d.change));

  function graph2_clearItems() {
      var chart = graph2Svg.selectAll('.chart');
      chart.selectAll(".timeseries").remove();
      chart.selectAll(".dataPoint").remove();
  }

  var selector = d3.select('#container-2>select');

  const graphFunctions = [
     graph_allLines,
     graph_totalNonFarm,
     graph_totalAndSector,
     graph_healthcareAndSocialAssistance,
     graph_allSubsectors,
     graph_ambulatory,
     graph_hospital,
     graph_nursing
  ];
    
   selector.on('change', function() {
     var selectedGraph = +this.value;
     var selectedGraphIndex = selectedGraph - 1;
     if (selectedGraphIndex < 0) {
       return;
     }
     if (selectedGraphIndex > graphFunctions.length -1) {
       return;
     }
     graph2_clearItems();
     graphFunctions[selectedGraphIndex](graph2Svg,_graph2_x,_graph2_y,_graph2_line_generator,true);
   });
  
  // footer
  d3.select('.footer')
      .styles({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'});

  function setupCharts() { 
    var chart1 = graph1Svg.append('g')
      .classed('chart', true)
      .attr('transform', 'translate(' + margin + ',0)')
      .attr('pointer-events', 'all');

    // Axes
    chart1.append('g')
      .attr("transform", `translate(0,${graph1_height - margin*2})`)
      .call(d3.axisBottom(_graph1_x));
    chart1.append('g')
      .attr("transform", `translate(${margin},0)`)
      .call(d3.axisLeft(_graph1_y));

    var chart2 = graph2Svg.append('g')
      .classed('chart', true)
      .attr('transform', 'translate(' + margin + ',0)')
      .attr('pointer-events', 'all');

    // Axes
    chart2.append('g')
      .attr("transform", `translate(0,${graph2_height - margin*2})`)
      .call(d3.axisBottom(_graph2_x));
    chart2.append('g')
      .attr("transform", `translate(${margin},0)`)
      .call(d3.axisLeft(_graph2_y));
  }

  setupCharts();
}
render()
d3.select(window).on('resize', render)