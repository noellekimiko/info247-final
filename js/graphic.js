var oldWidth = 0
function render(){
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth

  var margin = 15;
  var radius = 3;
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

  // Define the tooltip
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("text-align", "center")
    .style("width", "60px")
    .style("padding", "2px")
    .style("background", "white")
    .style("border", "1px solid black")
    .style("border-radius", "3px")
    .style("pointer-events", "none");


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
        .attr("stroke-width",5)
        .attr("stroke-miterlimit","1")
      .on('mouseover', function (d) {
            d3.select(this).transition()
            .attr("stroke-width", 5)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
        })
      .on('mouseout', function (d) {
            d3.select(this).transition()
            .attr("stroke-width", 5)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
        })
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
        .attr("stroke-width",5)
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
        .style('opacity', '0.5')
      .on('mouseover', function (d, i) {
          d3.select(this).transition()
            .attr("r", (radius*2));
          var change = (d.change).toFixed(2).toString() + '%';
          var date = d3.timeFormat("%b %Y")(d3.timeParse("%Y-%m-%d")(d.date));
          var tooltipText = date + " " + change;

          var rect = this.getBoundingClientRect();
          tooltip.transition()    
            .duration(200)  
            .style("opacity", .9);  
          tooltip.html(tooltipText) 
            .style("left", (rect.left + 5 + window.scrollX) + "px")
            .style("top", (rect.top + window.scrollY)+ "px"); 
        })
      .on('mouseout', function (d, i) {
          d3.select(this).transition()
            .attr("stroke-width", 5)
            .attr("r", radius);
          tooltip.transition()    
            .duration(500)    
            .style("opacity", 0); 
        });
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
  var graph1_width = d3.select(' #container-1 .graph').node().offsetWidth;
  var graph1_height = d3.select(' #container-1 .graph').node().offsetHeight;
  var graph1_verticalSize = graph1_height - margin * 2;
  var graph1_horizontalSize = graph1_width - margin * 2;
  var graph1Svg = d3.select('#container-1 .graph').html('')
    .append('svg')
      .attrs({width: graph1_width, height: graph1_height});

  var gs1 = d3.graphScroll()
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
      graph_totalNonFarm_jan_to_apr_2020(graph1Svg,_graph1_x, _graph1_y, _graph1_line_generator, false, false);
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
  var graph2_height = (d3.select(' #container-2 .graph').node().offsetHeight);
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

  // Graph 4
  var graph4_width = d3.select(' #container-4 .graph').node().offsetWidth;
  var graph4_height = (d3.select(' #container-4 .graph').node().offsetHeight);
  var graph4_verticalSize = graph4_height - margin * 2;
  var graph4_horizontalSize = graph4_width - margin * 2;

  var graph4Svg = d3.select('#container-4 .graph').html('')
    .append('svg')
      .attrs({width: graph4_width, height: graph4_height});

  //constrants|
  const duration = 600;
  const opacityHidden = 0;
  const opacityVisible = 1;
  
  // helpers
  function circleConst(group,idNum,r,fill,opacity) {
    group.append("circle")
      .classed("graph4_circle",true)
      .attr("id", "circle"+idNum)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", r)
      .style("fill", fill)
      .attr("opacity", opacity);
  }
  function labelConst(group,idNum,y,text,fontSize,opacity) {
    group.append("text")
      .classed("graph4_label",true)
      .attr("id", "label"+idNum)
      .attr("x", 0)
      .attr("y", y)
      .attr("font-size", fontSize)
      .attr("font-family", "Arial")
      .style("text-anchor", "middle")
      .attr("font-weight",800)
      .attr("fill","white")
      .text(text)
      .attr("opacity", opacity);
  } 
  function textConst(group,idNum,y,text,opacity) {
    group.append("text")
      .classed("graph4_text",true)
      .attr("id", "text"+idNum)
      .attr("x", 0)
      .attr("y", y)
      .attr("fill", "darkgrey")
      .attr("font-size", 18)
      .attr("font-family", "Arial")
      .style("text-anchor", "middle")
      .text(text)
      .attr("opacity", opacity)
      .attr("font-weight",800);
  }

 function graph4_clearItems() {
    var chart = graph4Svg.selectAll('.chart');
    chart.selectAll(".graph4_group").remove();
    chart.selectAll(".graph4_circle").remove();
    chart.selectAll(".graph4_label").remove();
    chart.selectAll(".graph4_text").remove();
  }

  function graph4_circle(idNum,x,y,r,fill,labelY,label,textY,text,fontSize,opacity) {
    var chart = graph4Svg.selectAll('.chart');
    var group = chart.append("g")
      .attr("id", "graph4_group_"+idNum)
      .classed("graph4_group", true)
      .attr("transform", "translate(" + x + "," + y + ")");

    circleConst(group,idNum,r,fill,opacity);
    labelConst(group,idNum,labelY,label,fontSize,opacity);
    textConst(group,idNum,textY,text,opacity);
  }

  function circle1(isInitial) {
    if (isInitial){
      graph4_circle(1,(graph2_width*0.5),(graph2_height*0.5),20,"darkred","2%","34%","10%","Nurses plan to resign by 2022",15,opacityHidden);
    } else {
      graph4_circle(1,(graph2_width*0.5),(graph2_height*0.1),50,"darkred","2%","34%","10%","Nurses plan to resign by 2022",35,opacityVisible);
    }
  }

  function circle2(isInitial) {
    if (isInitial){
      graph4_circle(2,(graph2_width*0.2),(graph2_height*0.5),20,"grey","1.5%","44%","9%","Burnout & High Stress",15,opacityHidden);
    } else {
      graph4_circle(2,(graph2_width*0.25),(graph2_height*0.35),40,"grey","1.5%","44%","9%","Burnout & High Stress",30,opacityVisible);
    }
  }

  function circle3(isInitial) {
    if (isInitial){
      graph4_circle(3,(graph2_width*0.8),(graph2_height*0.5),20,"grey","1.5%","27%","9%","Benefits & Pay",15,opacityHidden);
    } else {
      graph4_circle(3,(graph2_width*0.75),(graph2_height*0.35),40,"grey","1.5%","27%","9%","Benefits & Pay",30,opacityVisible);
    }
  }

  function circle4(isInitial) {
    if (isInitial){
      graph4_circle(4,(graph2_width*0.1),(graph2_height*0.8),20,"grey","1%","66%","7%","Not appreciated by community",15,opacityHidden);
    } else {
      graph4_circle(4,(graph2_width*0.25),(graph2_height*0.6),30,"grey","1%","66%","7%","Not appreciated by community",20,opacityVisible);
    }
  }

  function circle5(isInitial) {
    if (isInitial){
      graph4_circle(5,(graph2_width*0.1),(graph2_height*0.8),20,"grey","1%","64%","7%","Mental & Physical Abuse",15,opacityHidden);
    } else {
      graph4_circle(5,(graph2_width*0.25),(graph2_height*0.8),30,"grey","1%","64%","7%","Mental & Physical Abuse",20,opacityVisible);
    }
  }

  function circle6(isInitial) {
    if (isInitial){
      graph4_circle(6,(graph2_width*0.1),(graph2_height*0.8),20,"grey","1%","32%","7%","Workplace Discrimination/Racism",15,opacityHidden);
    } else {
      graph4_circle(6,(graph2_width*0.25),(graph2_height*1),30,"grey","1%","32%","7%","Workplace Discrimination/Racism",20,opacityVisible);
    }
  }

  function circle7(isInitial) {
    if (isInitial){
      graph4_circle(7,(graph2_width*0.9),(graph2_height*0.8),20,"grey","1%","58%","7%","Want to move for a higher pay",15,opacityHidden);
    } else {
      graph4_circle(7,(graph2_width*0.75),(graph2_height*0.6),30,"grey","1%","58%","7%","Want to move for a higher pay",20,opacityVisible);
    }
  }

  function circle8(isInitial) {
    if (isInitial){
      graph4_circle(8,(graph2_width*0.9),(graph2_height*0.8),20,"grey","1%","31%","7%","Want to move for an improved schedule",15,opacityHidden);
    } else {
      graph4_circle(8,(graph2_width*0.75),(graph2_height*0.8),30,"grey","1%","31%","7%","Want to move for an improved schedule",20,opacityVisible);
    }
  }

  function circle9(isInitial) {
    if (isInitial){
      graph4_circle(9,(graph2_width*0.9),(graph2_height*0.8),20,"grey","1%","31%","7%","Want to move for better career opportunities",15,opacityHidden);
    } else {
      graph4_circle(9,(graph2_width*0.75),(graph2_height*1),30,"grey","1%","31%","7%","Want to move for better career opportunities",20,opacityVisible);
    }
  }

  function circleTransition(idNum,r,fontSize,xTranslate,yTranslate){
    d3.select("#circle"+idNum).transition()
        .duration(duration)
        .attr("opacity", opacityVisible)
      .transition() 
        .duration(duration)         
        .attr("r", r);
    d3.select("#label"+idNum).transition()
        .duration(duration)
        .attr("opacity", opacityVisible)
      .transition()
        .duration(duration)
        .attr("font-size", fontSize);
    d3.select("#text"+idNum).transition()
        .delay(duration)
        .duration(duration)
        .attr("opacity", opacityVisible);
    d3.select("#graph4_group_"+idNum).transition()
        .delay(duration)
        .attr("transform", "translate(" + (graph2_width*xTranslate) + "," + (graph2_height*yTranslate) + ")");
  }

  var graph4Steps = [
    function() {
      graph4_clearItems();
      circle1(true);

      //transition circle 1
      d3.select("#circle1").transition() 
        .duration(duration)         
        .attr("r", 50)
        .attr("opacity", opacityVisible);
      d3.select("#label1").transition()
        .duration(duration)
        .attr("y", "2%")
        .attr("font-size", 35)
        .attr("opacity", opacityVisible);
      d3.select("#text1").transition()
        .duration(duration)
        .attr("opacity", opacityVisible);
      d3.select("#graph4_group_1").transition()
          .delay(duration)
          .attr("transform", "translate(" + (graph2_width*0.5) + "," + (graph2_height*0.1) + ")");
    },

    function() {
      graph4_clearItems();
      circle1(false);
      circle2(true);
      circle3(true);

      circleTransition(2,40,30,0.25,0.35);
      circleTransition(3,40,30,0.75,0.35);
    },

    function() {
      graph4_clearItems();
      circle1(false);
      circle2(false);
      circle3(false);
      circle4(true);
      circle5(true);
      circle6(true);

      circleTransition(4,30,20,0.25,0.6);
      circleTransition(5,30,20,0.25,0.8);
      circleTransition(6,30,20,0.25,1);
    },
    function() {
      graph4_clearItems();
      circle1(false);
      circle2(false);
      circle3(false);
      circle4(false);
      circle5(false);
      circle6(false);
      circle7(true);
      circle8(true);
      circle9(true);

      circleTransition(7,30,20,0.75,0.6);
      circleTransition(8,30,20,0.75,0.8);
      circleTransition(9,30,20,0.75,1);
    }
  ];

  var gs4 = d3.graphScroll()
    .container(d3.select('#container-4'))
    .graph(d3.selectAll('#container-4 .graph'))
    .eventId('uniqueId4')  // namespace for scroll and resize events
    .sections(d3.selectAll('#container-4 .sections > div'))
    .on('active', function(i){
      if(i <= graph4Steps.length-1) {
        graph4Steps[i]();
      }        
    });
  
  // Graph 5
  var data_jobsproj_healthcare = [{"year":"2006","jobs":"15253300"},{"year":"2008","jobs":"16188600"},{"year":"2009","jobs":"16539800"},{"year":"2016","jobs":"19056300"},{"year":"2018","jobs":"19939300"},{"year":"2019","jobs":"20412600"},{"year":"2026","jobs":"23054600"},{"year":"2028","jobs":"23335400"},{"year":"2029","jobs":"23491700"}];
  var data_jobsproj_all = [{"year":"2006","jobs":"1437174"},{"year":"2008","jobs":"1151898"},{"year":"2009","jobs":"1370560"},{"year":"2016","jobs":"1426075"},{"year":"2018","jobs":"1274724"},{"year":"2019","jobs":"1498067"},{"year":"2026","jobs":"1583244"},{"year":"2028","jobs":"1352409"},{"year":"2029","jobs":"1612747"}];
  var graph5_width = d3.select(' #container-5 .graph').node().offsetWidth;
  var graph5_height = d3.select(' #container-5 .graph').node().offsetHeight;
  var graph5_verticalSize = graph5_height - margin * 2;
  var graph5_horizontalSize = graph5_width - margin * 2;

  var graph5Svg = d3.select('#container-5 .graph').html('')
    .append('svg')
      .attrs({width: graph5_width, height: graph5_height});

  var _graph5_x = d3.scaleTime()
    .domain(d3.extent(data_jobsproj_healthcare, d=>d3.timeParse("%Y")(d.year)))
    .range([margin, graph5_horizontalSize]);

  var _graph5_y = d3.scaleLinear()
    .domain([0,d3.max(data_jobsproj_healthcare, d=>d.jobs)])
    .range([graph5_verticalSize, margin]);

  var _graph5_line_generator = d3.line()
    .x(d => _graph5_x(d3.timeParse("%Y")(d.year)))
    .y(d => _graph5_y(d.jobs));

  function _graph5_path_generator(data,id,title,strokeColor) {
    var chart = graph5Svg.selectAll('.chart');
      chart.append('path')
          .attr("id", id)
          .classed('timeseries', true)
          .attr("d",_graph5_line_generator(data))
          .attr("fill","none")
          .attr("stroke",strokeColor)
          .attr("stroke-width",5)
          .attr("stroke-miterlimit","1")
          .call(transition)
        .append("title")
          .text(title);
  }

  function graph5_jobsproj_all() {
    _graph5_path_generator(data_jobsproj_all,"graph5_jobsproj_all","All Industries","darkgrey");
  }

  function graph5_jobsproj_healthcare() {
    _graph5_path_generator(data_jobsproj_healthcare,"graph5_jobsproj_healthcare","Projected Healthcare","green");
  }
  function graph5_clearItems() {
    var chart = graph5Svg.selectAll('.chart');
    chart.selectAll(".timeseries").remove();
  }

  var graph5Steps = [
    function() {
      graph5_clearItems();
      graph5_jobsproj_all();
      graph5_jobsproj_healthcare();
    }
  ];
  var gs5 = d3.graphScroll()
      .container(d3.select('#container-5'))
      .graph(d3.selectAll('#container-5 .graph'))
      .eventId('uniqueId5')  // namespace for scroll and resize events
      .sections(d3.selectAll('#container-5 .sections > div'))
      .on('active', function(i){
        if(i <= graph5Steps.length-1) {
          graph5Steps[i]();
        }        
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

    var chart4 = graph4Svg.append('g')
      .classed('chart', true)
      .attr('transform', 'translate(' + margin + ',0)')
      .attr('pointer-events', 'all');

    var chart5 = graph5Svg.append('g')
      .classed('chart', true)
      .attr('transform', 'translate(' + margin + ',0)')
      .attr('pointer-events', 'all');

    // Axes
    chart5.append('g')
      .attr("transform", `translate(0,${graph5_height - margin*2})`)
      .call(d3.axisBottom(_graph5_x));
    chart5.append('g')
      .attr("transform", `translate(${margin},0)`)
      .call(d3.axisLeft(_graph5_y).tickFormat(d=>d3.format(".1s")(d)));
  }

  setupCharts();
}
render()
d3.select(window).on('resize', render)