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
          .duration(4000)
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
        .attr("stroke-width",5)
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
    _emp_generator(svg,x,y,line_generator,data_totalNonFarm_jan_to_apr_2020,"totalNonFarm_jan_to_apr_2020","Total Non-Farm","grey",includePoints,includeTransition);
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

  // Graphic 2: Total employment trends
  var graph2_width = d3.select(' #container-2 .graph').node().offsetWidth;
  var graph2_height = d3.select(' #container-2 .graph').node().offsetHeight;
  var graph2_verticalSize = graph2_height - margin * 4;
  var graph2_horizontalSize = graph2_width - (margin * 8);
  var graph2Svg = d3.select('#container-2 .graph').html('')
    .append('svg')
      .attrs({width: graph2_width, height: graph2_height});

  var gs2 = d3.graphScroll()
      .container(d3.select('#container-2'))
      .graph(d3.selectAll('#container-2 .graph'))
      .eventId('uniqueId2')  // namespace for scroll and resize events
      .sections(d3.selectAll('#container-2 .sections > div'))
      .on('active', function(i){
        if(i <= graph2Steps.length-1) {
          graph2Steps[i]();
        }        
      })

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

  var graph2Steps = [
    function () {
      graph2_clearItems();
      graph_totalNonFarm_jan_to_apr_2020(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, true);
    },

    function () {
      graph2_clearItems();
      graph_totalNonFarm_jan_to_apr_2020(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, false);
      graph_healthcareAndSocialAssistance_jan_to_apr_2020(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, true);
    },

    function () {
      graph2_clearItems();
      // These are to make the animation appear for only the part after the drop
      graph_totalNonFarm_jan_to_apr_2020(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, false);
      graph_healthcareAndSocialAssistance_jan_to_apr_2020(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, false);
      // Animated lines
      graph_totalNonFarm(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, true);
      graph_healthcareAndSocialAssistance(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, true);
    },

    function () {
      graph2_clearItems();
      graph_ambulatory(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, false);
    },

    function () {
      graph2_clearItems();
      graph_ambulatory(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, false);
      graph_hospital(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, true);
    },

    function () {
      graph2_clearItems();
      graph_ambulatory(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, false);
      graph_hospital(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, false);
      graph_nursing(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, false, true);
    },
  ]

  // Graph 3
  var graph3_value_max = 3.5;
  var graph3_date_start = new Date(2020, 0, 1);
  var graph3_date_end = new Date(2021, 11, 1);
  var graph3_data_construction = [{"month":"2020-01-01","name":"Construction","value":"0.70263789"},{"month":"2020-02-01","name":"Construction","value":"0.751861042"},{"month":"2020-03-01","name":"Construction","value":"0.576441103"},{"month":"2020-04-01","name":"Construction","value":"0.99047619"},{"month":"2020-05-01","name":"Construction","value":"0.387895461"},{"month":"2020-06-01","name":"Construction","value":"0.4609375"},{"month":"2020-07-01","name":"Construction","value":"0.75826972"},{"month":"2020-08-01","name":"Construction","value":"0.62628866"},{"month":"2020-09-01","name":"Construction","value":"0.596401028"},{"month":"2020-10-01","name":"Construction","value":"0.639896373"},{"month":"2020-11-01","name":"Construction","value":"0.689655172"},{"month":"2020-12-01","name":"Construction","value":"0.655256724"},{"month":"2021-01-01","name":"Construction","value":"0.851851852"},{"month":"2021-02-01","name":"Construction","value":"0.672774869"},{"month":"2021-03-01","name":"Construction","value":"0.756756757"},{"month":"2021-04-01","name":"Construction","value":"0.98502994"},{"month":"2021-05-01","name":"Construction","value":"1.003257329"},{"month":"2021-06-01","name":"Construction","value":"0.919770774"},{"month":"2021-07-01","name":"Construction","value":"0.923287671"},{"month":"2021-08-01","name":"Construction","value":"0.97574124"},{"month":"2021-09-01","name":"Construction","value":"1.005780347"},{"month":"2021-10-01","name":"Construction","value":"1.082872928"},{"month":"2021-11-01","name":"Construction","value":"0.855140187"},{"month":"2021-12-01","name":"Construction","value":"0.994459834"}];
  var graph3_data_education = [{"month":"2020-01-01","name":"Education and Health Services","value":"1.67"},{"month":"2020-02-01","name":"Education and Health Services","value":"1.616368286"},{"month":"2020-03-01","name":"Education and Health Services","value":"1.801515152"},{"month":"2020-04-01","name":"Education and Health Services","value":"1.790566038"},{"month":"2020-05-01","name":"Education and Health Services","value":"0.834605598"},{"month":"2020-06-01","name":"Education and Health Services","value":"1.169329073"},{"month":"2020-07-01","name":"Education and Health Services","value":"1.404205607"},{"month":"2020-08-01","name":"Education and Health Services","value":"1.675070028"},{"month":"2020-09-01","name":"Education and Health Services","value":"1.696551724"},{"month":"2020-10-01","name":"Education and Health Services","value":"1.819034853"},{"month":"2020-11-01","name":"Education and Health Services","value":"1.835180055"},{"month":"2020-12-01","name":"Education and Health Services","value":"1.785413745"},{"month":"2021-01-01","name":"Education and Health Services","value":"2.016369048"},{"month":"2021-02-01","name":"Education and Health Services","value":"2.185135135"},{"month":"2021-03-01","name":"Education and Health Services","value":"1.964613368"},{"month":"2021-04-01","name":"Education and Health Services","value":"2.011734029"},{"month":"2021-05-01","name":"Education and Health Services","value":"2.232984293"},{"month":"2021-06-01","name":"Education and Health Services","value":"2.221935484"},{"month":"2021-07-01","name":"Education and Health Services","value":"2.475195822"},{"month":"2021-08-01","name":"Education and Health Services","value":"2.286259542"},{"month":"2021-09-01","name":"Education and Health Services","value":"2.3757503"},{"month":"2021-10-01","name":"Education and Health Services","value":"2.53874092"},{"month":"2021-11-01","name":"Education and Health Services","value":"2.450980392"},{"month":"2021-12-01","name":"Education and Health Services","value":"2.585106383"}];
  var graph3_data_financial = [{"month":"2020-01-01","name":"Financial Activities","value":"1.949541284"},{"month":"2020-02-01","name":"Financial Activities","value":"1.723140496"},{"month":"2020-03-01","name":"Financial Activities","value":"1.502164502"},{"month":"2020-04-01","name":"Financial Activities","value":"1.698113208"},{"month":"2020-05-01","name":"Financial Activities","value":"1.5"},{"month":"2020-06-01","name":"Financial Activities","value":"1.703517588"},{"month":"2020-07-01","name":"Financial Activities","value":"1.207692308"},{"month":"2020-08-01","name":"Financial Activities","value":"1.281385281"},{"month":"2020-09-01","name":"Financial Activities","value":"1.253012048"},{"month":"2020-10-01","name":"Financial Activities","value":"1.297959184"},{"month":"2020-11-01","name":"Financial Activities","value":"1.338095238"},{"month":"2020-12-01","name":"Financial Activities","value":"1.439613527"},{"month":"2021-01-01","name":"Financial Activities","value":"1.346341463"},{"month":"2021-02-01","name":"Financial Activities","value":"1.557788945"},{"month":"2021-03-01","name":"Financial Activities","value":"1.634146341"},{"month":"2021-04-01","name":"Financial Activities","value":"1.990697674"},{"month":"2021-05-01","name":"Financial Activities","value":"1.922330097"},{"month":"2021-06-01","name":"Financial Activities","value":"1.715686275"},{"month":"2021-07-01","name":"Financial Activities","value":"2.186234818"},{"month":"2021-08-01","name":"Financial Activities","value":"2.262135922"},{"month":"2021-09-01","name":"Financial Activities","value":"1.510344828"},{"month":"2021-10-01","name":"Financial Activities","value":"2.041284404"},{"month":"2021-11-01","name":"Financial Activities","value":"2.111587983"},{"month":"2021-12-01","name":"Financial Activities","value":"2.052401747"}];
  var graph3_data_healthcare = [{"month":"2020-01-01","name":"Health Care and Social Assistance","value":"1.760115607"},{"month":"2020-02-01","name":"Health Care and Social Assistance","value":"1.664233577"},{"month":"2020-03-01","name":"Health Care and Social Assistance","value":"1.904761905"},{"month":"2020-04-01","name":"Health Care and Social Assistance","value":"1.864035088"},{"month":"2020-05-01","name":"Health Care and Social Assistance","value":"0.832869081"},{"month":"2020-06-01","name":"Health Care and Social Assistance","value":"1.226161369"},{"month":"2020-07-01","name":"Health Care and Social Assistance","value":"1.478723404"},{"month":"2020-08-01","name":"Health Care and Social Assistance","value":"1.760517799"},{"month":"2020-09-01","name":"Health Care and Social Assistance","value":"1.726851852"},{"month":"2020-10-01","name":"Health Care and Social Assistance","value":"1.89280245"},{"month":"2020-11-01","name":"Health Care and Social Assistance","value":"1.945773525"},{"month":"2020-12-01","name":"Health Care and Social Assistance","value":"1.860719875"},{"month":"2021-01-01","name":"Health Care and Social Assistance","value":"2.201096892"},{"month":"2021-02-01","name":"Health Care and Social Assistance","value":"2.311248074"},{"month":"2021-03-01","name":"Health Care and Social Assistance","value":"2.072617247"},{"month":"2021-04-01","name":"Health Care and Social Assistance","value":"2.080597015"},{"month":"2021-05-01","name":"Health Care and Social Assistance","value":"2.293154762"},{"month":"2021-06-01","name":"Health Care and Social Assistance","value":"2.3125"},{"month":"2021-07-01","name":"Health Care and Social Assistance","value":"2.585585586"},{"month":"2021-08-01","name":"Health Care and Social Assistance","value":"2.412371134"},{"month":"2021-09-01","name":"Health Care and Social Assistance","value":"2.456521739"},{"month":"2021-10-01","name":"Health Care and Social Assistance","value":"2.690677966"},{"month":"2021-11-01","name":"Health Care and Social Assistance","value":"2.53298153"},{"month":"2021-12-01","name":"Health Care and Social Assistance","value":"2.647849462"}];
  var graph3_data_information = [{"month":"2020-01-01","name":"Information","value":"1.739726027"},{"month":"2020-02-01","name":"Information","value":"1.453608247"},{"month":"2020-03-01","name":"Information","value":"1.680555556"},{"month":"2020-04-01","name":"Information","value":"3.128205128"},{"month":"2020-05-01","name":"Information","value":"1.318181818"},{"month":"2020-06-01","name":"Information","value":"1.754385965"},{"month":"2020-07-01","name":"Information","value":"1.023529412"},{"month":"2020-08-01","name":"Information","value":"0.944444444"},{"month":"2020-09-01","name":"Information","value":"1.099009901"},{"month":"2020-10-01","name":"Information","value":"1.024793388"},{"month":"2020-11-01","name":"Information","value":"1.155555556"},{"month":"2020-12-01","name":"Information","value":"1.414634146"},{"month":"2021-01-01","name":"Information","value":"1.75"},{"month":"2021-02-01","name":"Information","value":"1.144329897"},{"month":"2021-03-01","name":"Information","value":"1.088235294"},{"month":"2021-04-01","name":"Information","value":"1.125"},{"month":"2021-05-01","name":"Information","value":"1.371428571"},{"month":"2021-06-01","name":"Information","value":"1.372727273"},{"month":"2021-07-01","name":"Information","value":"1.70754717"},{"month":"2021-08-01","name":"Information","value":"1.56779661"},{"month":"2021-09-01","name":"Information","value":"1.495652174"},{"month":"2021-10-01","name":"Information","value":"1.504201681"},{"month":"2021-11-01","name":"Information","value":"1.692982456"},{"month":"2021-12-01","name":"Information","value":"2.09009009"}];
  var graph3_data_leisure = [{"month":"2020-01-01","name":"Leisure and Hospitality","value":"0.83245614"},{"month":"2020-02-01","name":"Leisure and Hospitality","value":"0.868940754"},{"month":"2020-03-01","name":"Leisure and Hospitality","value":"0.951255539"},{"month":"2020-04-01","name":"Leisure and Hospitality","value":"0.888888889"},{"month":"2020-05-01","name":"Leisure and Hospitality","value":"0.373376623"},{"month":"2020-06-01","name":"Leisure and Hospitality","value":"0.4345"},{"month":"2020-07-01","name":"Leisure and Hospitality","value":"0.605805959"},{"month":"2020-08-01","name":"Leisure and Hospitality","value":"0.769628099"},{"month":"2020-09-01","name":"Leisure and Hospitality","value":"0.744053283"},{"month":"2020-10-01","name":"Leisure and Hospitality","value":"0.734497817"},{"month":"2020-11-01","name":"Leisure and Hospitality","value":"0.783410138"},{"month":"2020-12-01","name":"Leisure and Hospitality","value":"0.928571429"},{"month":"2021-01-01","name":"Leisure and Hospitality","value":"0.782128514"},{"month":"2021-02-01","name":"Leisure and Hospitality","value":"0.861135371"},{"month":"2021-03-01","name":"Leisure and Hospitality","value":"0.969378828"},{"month":"2021-04-01","name":"Leisure and Hospitality","value":"0.980408163"},{"month":"2021-05-01","name":"Leisure and Hospitality","value":"1.086956522"},{"month":"2021-06-01","name":"Leisure and Hospitality","value":"1.2143446"},{"month":"2021-07-01","name":"Leisure and Hospitality","value":"1.29089444"},{"month":"2021-08-01","name":"Leisure and Hospitality","value":"1.392220421"},{"month":"2021-09-01","name":"Leisure and Hospitality","value":"1.29352397"},{"month":"2021-10-01","name":"Leisure and Hospitality","value":"1.384223919"},{"month":"2021-11-01","name":"Leisure and Hospitality","value":"1.370065789"},{"month":"2021-12-01","name":"Leisure and Hospitality","value":"1.669463087"}];
  var graph3_data_manufacturing = [{"month":"2020-01-01","name":"Manufacturing","value":"1.26625387"},{"month":"2020-02-01","name":"Manufacturing","value":"1.106442577"},{"month":"2020-03-01","name":"Manufacturing","value":"0.977917981"},{"month":"2020-04-01","name":"Manufacturing","value":"0.844444444"},{"month":"2020-05-01","name":"Manufacturing","value":"0.497645212"},{"month":"2020-06-01","name":"Manufacturing","value":"0.709543568"},{"month":"2020-07-01","name":"Manufacturing","value":"1.2"},{"month":"2020-08-01","name":"Manufacturing","value":"1.187341772"},{"month":"2020-09-01","name":"Manufacturing","value":"1.255936675"},{"month":"2020-10-01","name":"Manufacturing","value":"1.366925065"},{"month":"2020-11-01","name":"Manufacturing","value":"1.17603912"},{"month":"2020-12-01","name":"Manufacturing","value":"1.054176072"},{"month":"2021-01-01","name":"Manufacturing","value":"1.478753541"},{"month":"2021-02-01","name":"Manufacturing","value":"1.377088305"},{"month":"2021-03-01","name":"Manufacturing","value":"1.672605791"},{"month":"2021-04-01","name":"Manufacturing","value":"2.195431472"},{"month":"2021-05-01","name":"Manufacturing","value":"2.153284672"},{"month":"2021-06-01","name":"Manufacturing","value":"2.020361991"},{"month":"2021-07-01","name":"Manufacturing","value":"2.010660981"},{"month":"2021-08-01","name":"Manufacturing","value":"1.885529158"},{"month":"2021-09-01","name":"Manufacturing","value":"2.00212766"},{"month":"2021-10-01","name":"Manufacturing","value":"1.918918919"},{"month":"2021-11-01","name":"Manufacturing","value":"1.733333333"},{"month":"2021-12-01","name":"Manufacturing","value":"1.63238512"}];
  var graph3_data_mining = [{"month":"2020-01-01","name":"Mining and Logging","value":"1.125"},{"month":"2020-02-01","name":"Mining and Logging","value":"1.090909091"},{"month":"2020-03-01","name":"Mining and Logging","value":"0.722222222"},{"month":"2020-04-01","name":"Mining and Logging","value":"0.769230769"},{"month":"2020-05-01","name":"Mining and Logging","value":"0.625"},{"month":"2020-06-01","name":"Mining and Logging","value":"1.777777778"},{"month":"2020-07-01","name":"Mining and Logging","value":"0.526315789"},{"month":"2020-08-01","name":"Mining and Logging","value":"0.714285714"},{"month":"2020-09-01","name":"Mining and Logging","value":"0.666666667"},{"month":"2020-10-01","name":"Mining and Logging","value":"1.066666667"},{"month":"2020-11-01","name":"Mining and Logging","value":"0.75"},{"month":"2020-12-01","name":"Mining and Logging","value":"0.85"},{"month":"2021-01-01","name":"Mining and Logging","value":"1.428571429"},{"month":"2021-02-01","name":"Mining and Logging","value":"1.25"},{"month":"2021-03-01","name":"Mining and Logging","value":"1.041666667"},{"month":"2021-04-01","name":"Mining and Logging","value":"1.1"},{"month":"2021-05-01","name":"Mining and Logging","value":"1.227272727"},{"month":"2021-06-01","name":"Mining and Logging","value":"1.136363636"},{"month":"2021-07-01","name":"Mining and Logging","value":"1.7"},{"month":"2021-08-01","name":"Mining and Logging","value":"1.571428571"},{"month":"2021-09-01","name":"Mining and Logging","value":"1.8125"},{"month":"2021-10-01","name":"Mining and Logging","value":"1.380952381"},{"month":"2021-11-01","name":"Mining and Logging","value":"1.842105263"},{"month":"2021-12-01","name":"Mining and Logging","value":"1.7"}];
  var graph3_data_services = [{"month":"2020-01-01","name":"Other Services","value":"1.155172414"},{"month":"2020-02-01","name":"Other Services","value":"0.907079646"},{"month":"2020-03-01","name":"Other Services","value":"1.034246575"},{"month":"2020-04-01","name":"Other Services","value":"0.906040268"},{"month":"2020-05-01","name":"Other Services","value":"0.30318258"},{"month":"2020-06-01","name":"Other Services","value":"0.687664042"},{"month":"2020-07-01","name":"Other Services","value":"1.373737374"},{"month":"2020-08-01","name":"Other Services","value":"1.0456621"},{"month":"2020-09-01","name":"Other Services","value":"0.971544715"},{"month":"2020-10-01","name":"Other Services","value":"1.004166667"},{"month":"2020-11-01","name":"Other Services","value":"1.033175355"},{"month":"2020-12-01","name":"Other Services","value":"1.153409091"},{"month":"2021-01-01","name":"Other Services","value":"1.135514019"},{"month":"2021-02-01","name":"Other Services","value":"1.151639344"},{"month":"2021-03-01","name":"Other Services","value":"1.100456621"},{"month":"2021-04-01","name":"Other Services","value":"1.553648069"},{"month":"2021-05-01","name":"Other Services","value":"2.108597285"},{"month":"2021-06-01","name":"Other Services","value":"1.619834711"},{"month":"2021-07-01","name":"Other Services","value":"1.76171875"},{"month":"2021-08-01","name":"Other Services","value":"1.99543379"},{"month":"2021-09-01","name":"Other Services","value":"1.742307692"},{"month":"2021-10-01","name":"Other Services","value":"1.927350427"},{"month":"2021-11-01","name":"Other Services","value":"1.660305344"},{"month":"2021-12-01","name":"Other Services","value":"1.4140625"}];
  var graph3_data_prof_services = [{"month":"2020-01-01","name":"Professional and Business Services","value":"1.098106713"},{"month":"2020-02-01","name":"Professional and Business Services","value":"1.154537287"},{"month":"2020-03-01","name":"Professional and Business Services","value":"0.965638767"},{"month":"2020-04-01","name":"Professional and Business Services","value":"0.979118329"},{"month":"2020-05-01","name":"Professional and Business Services","value":"0.914744233"},{"month":"2020-06-01","name":"Professional and Business Services","value":"0.869118905"},{"month":"2020-07-01","name":"Professional and Business Services","value":"1.025022341"},{"month":"2020-08-01","name":"Professional and Business Services","value":"0.993960311"},{"month":"2020-09-01","name":"Professional and Business Services","value":"1.086236934"},{"month":"2020-10-01","name":"Professional and Business Services","value":"1.127845884"},{"month":"2020-11-01","name":"Professional and Business Services","value":"1.113934426"},{"month":"2020-12-01","name":"Professional and Business Services","value":"1.291772689"},{"month":"2021-01-01","name":"Professional and Business Services","value":"1.226351351"},{"month":"2021-02-01","name":"Professional and Business Services","value":"1.2200489"},{"month":"2021-03-01","name":"Professional and Business Services","value":"1.308072488"},{"month":"2021-04-01","name":"Professional and Business Services","value":"1.437229437"},{"month":"2021-05-01","name":"Professional and Business Services","value":"1.493955095"},{"month":"2021-06-01","name":"Professional and Business Services","value":"1.462171053"},{"month":"2021-07-01","name":"Professional and Business Services","value":"1.460377358"},{"month":"2021-08-01","name":"Professional and Business Services","value":"1.571428571"},{"month":"2021-09-01","name":"Professional and Business Services","value":"1.453968254"},{"month":"2021-10-01","name":"Professional and Business Services","value":"1.559541985"},{"month":"2021-11-01","name":"Professional and Business Services","value":"1.47027027"},{"month":"2021-12-01","name":"Professional and Business Services","value":"1.667491749"}];
  var graph3_data_trade = [{"month":"2020-01-01","name":"Trade, Transportation, and Utilities","value":"1.003257329"},{"month":"2020-02-01","name":"Trade, Transportation, and Utilities","value":"0.950558214"},{"month":"2020-03-01","name":"Trade, Transportation, and Utilities","value":"0.945762712"},{"month":"2020-04-01","name":"Trade, Transportation, and Utilities","value":"0.806890299"},{"month":"2020-05-01","name":"Trade, Transportation, and Utilities","value":"0.651769088"},{"month":"2020-06-01","name":"Trade, Transportation, and Utilities","value":"0.770965469"},{"month":"2020-07-01","name":"Trade, Transportation, and Utilities","value":"0.981161695"},{"month":"2020-08-01","name":"Trade, Transportation, and Utilities","value":"0.950120676"},{"month":"2020-09-01","name":"Trade, Transportation, and Utilities","value":"0.894819466"},{"month":"2020-10-01","name":"Trade, Transportation, and Utilities","value":"0.888971684"},{"month":"2020-11-01","name":"Trade, Transportation, and Utilities","value":"1.020729685"},{"month":"2020-12-01","name":"Trade, Transportation, and Utilities","value":"1.033653846"},{"month":"2021-01-01","name":"Trade, Transportation, and Utilities","value":"1.100398406"},{"month":"2021-02-01","name":"Trade, Transportation, and Utilities","value":"1.19658814"},{"month":"2021-03-01","name":"Trade, Transportation, and Utilities","value":"1.312598425"},{"month":"2021-04-01","name":"Trade, Transportation, and Utilities","value":"1.35446906"},{"month":"2021-05-01","name":"Trade, Transportation, and Utilities","value":"1.297692308"},{"month":"2021-06-01","name":"Trade, Transportation, and Utilities","value":"1.285714286"},{"month":"2021-07-01","name":"Trade, Transportation, and Utilities","value":"1.406226835"},{"month":"2021-08-01","name":"Trade, Transportation, and Utilities","value":"1.460202605"},{"month":"2021-09-01","name":"Trade, Transportation, and Utilities","value":"1.419213974"},{"month":"2021-10-01","name":"Trade, Transportation, and Utilities","value":"1.453471196"},{"month":"2021-11-01","name":"Trade, Transportation, and Utilities","value":"1.36059744"},{"month":"2021-12-01","name":"Trade, Transportation, and Utilities","value":"1.410312273"}];
  var graph3_width = d3.select(' #container-3 .graph').node().offsetWidth;
  var graph3_height = d3.select(' #container-3 .graph').node().offsetHeight;
  var graph3_verticalSize = graph3_height - margin * 4;
  var graph3_horizontalSize = graph3_width - (margin * 8);
  var graph3Svg = d3.select('#container-3 .graph').html('')
    .append('svg')
      .attrs({width: graph3_width, height: graph3_height});

  var _graph3_x = d3.scaleTime()
    .domain([graph3_date_start,graph3_date_end])
    .range([margin, graph3_horizontalSize]);

  var _graph3_y = d3.scaleLinear()
    .domain([0, graph3_value_max])
    .range([graph3_verticalSize, margin]);

  var _graph3_line_generator = d3.line()
    .x(d => _graph3_x(d3.timeParse("%Y-%m-%d")(d.month)))
    .y(d => _graph3_y(d.value));

  function graph3_clearItems() {
    var chart = graph3Svg.selectAll('.chart');
    chart.selectAll(".openings-hires")
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();
  }

  function graph3_path_generator(data,title,strokeColor){
    var chart = graph3Svg.selectAll('.chart');
    chart.append("path")
      .classed('openings-hires', true)
      .attr("d", _graph3_line_generator(data))
      .attr("fill", "none")
      .attr("stroke", strokeColor)
      .attr("stroke-width", 5)
      .attr("stroke-miterlimit","1")
      .append("title")
        .text(title);
  }

  var graph3Steps = [
    function() {
      graph3_clearItems();
    },
    function () {
      graph3_clearItems();
      graph3_path_generator(graph3_data_construction,"Construction","grey");
      graph3_path_generator(graph3_data_education,"Education and Health Services","grey");
      graph3_path_generator(graph3_data_financial,"Financial Activities","grey");
      graph3_path_generator(graph3_data_healthcare,"Health Care and Social Assistance","#008000");
      graph3_path_generator(graph3_data_information,"Information","grey");
      graph3_path_generator(graph3_data_leisure,"Leisure and Hospitality","grey");
      graph3_path_generator(graph3_data_manufacturing,"Manufacturing","grey");
      graph3_path_generator(graph3_data_mining,"Mining and Logging","grey");
      graph3_path_generator(graph3_data_services,"Other Services","grey");
      graph3_path_generator(graph3_data_prof_services,"Professional and Business Services","grey");
      graph3_path_generator(graph3_data_trade,"Trade, Transportation, and Utilities","grey");
    }
  ];

  var gs3 = d3.graphScroll()
    .container(d3.select('#container-3'))
    .graph(d3.selectAll('#container-3 .graph'))
    .eventId('uniqueId3')  // namespace for scroll and resize events
    .sections(d3.selectAll('#container-3 .sections > div'))
    .on('active', function(i){
      if(i <= graph3Steps.length-1) {
        graph3Steps[i]();
      }        
    })

  // Graph 4
  var graph4_width = d3.select(' #container-4 .graph').node().offsetWidth;
  var graph4_height = (d3.select(' #container-4 .graph').node().offsetHeight);
  var graph4_verticalSize = graph4_height - margin * 2;
  var graph4_horizontalSize = graph4_width - margin * 2;

  var graph4Svg = d3.select('#container-4 .graph').html('')
    .append('svg')
      .attrs({width: graph4_width, height: graph4_height});

  // constants
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
    chart.selectAll(".graph4_img").remove();
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
      graph4_circle(1,(graph4_width*0.5),(graph4_height*0.5),20,"darkred","2%","34%","10%","Nurses plan to resign by 2022",15,opacityHidden);
    } else {
      graph4_circle(1,(graph4_width*0.5),(graph4_height*0.1),50,"darkred","2%","34%","10%","Nurses plan to resign by 2022",35,opacityVisible);
    }
  }

  function circle2(isInitial) {
    if (isInitial){
      graph4_circle(2,(graph4_width*0.2),(graph4_height*0.5),20,"grey","1.5%","44%","9%","Burnout & High Stress",15,opacityHidden);
    } else {
      graph4_circle(2,(graph4_width*0.25),(graph4_height*0.35),40,"grey","1.5%","44%","9%","Burnout & High Stress",30,opacityVisible);
    }
  }

  function circle3(isInitial) {
    if (isInitial){
      graph4_circle(3,(graph4_width*0.8),(graph4_height*0.5),20,"grey","1.5%","27%","9%","Benefits & Pay",15,opacityHidden);
    } else {
      graph4_circle(3,(graph4_width*0.75),(graph4_height*0.35),40,"grey","1.5%","27%","9%","Benefits & Pay",30,opacityVisible);
    }
  }

  function circle4(isInitial) {
    if (isInitial){
      graph4_circle(4,(graph4_width*0.1),(graph4_height*0.8),20,"grey","1%","66%","7%","Not appreciated by community",15,opacityHidden);
    } else {
      graph4_circle(4,(graph4_width*0.25),(graph4_height*0.6),30,"grey","1%","66%","7%","Not appreciated by community",20,opacityVisible);
    }
  }

  function circle5(isInitial) {
    if (isInitial){
      graph4_circle(5,(graph4_width*0.1),(graph4_height*0.8),20,"grey","1%","64%","7%","Mental & Physical Abuse",15,opacityHidden);
    } else {
      graph4_circle(5,(graph4_width*0.25),(graph4_height*0.75),30,"grey","1%","64%","7%","Mental & Physical Abuse",20,opacityVisible);
    }
  }

  function circle6(isInitial) {
    if (isInitial){
      graph4_circle(6,(graph4_width*0.1),(graph4_height*0.8),20,"grey","1%","32%","7%","Workplace Discrimination/Racism",15,opacityHidden);
    } else {
      graph4_circle(6,(graph4_width*0.25),(graph4_height*0.9),30,"grey","1%","32%","7%","Workplace Discrimination/Racism",20,opacityVisible);
    }
  }

  function circle7(isInitial) {
    if (isInitial){
      graph4_circle(7,(graph4_width*0.9),(graph4_height*0.8),20,"grey","1%","58%","7%","Want to move for a higher pay",15,opacityHidden);
    } else {
      graph4_circle(7,(graph4_width*0.75),(graph4_height*0.6),30,"grey","1%","58%","7%","Want to move for a higher pay",20,opacityVisible);
    }
  }

  function circle8(isInitial) {
    if (isInitial){
      graph4_circle(8,(graph4_width*0.9),(graph4_height*0.8),20,"grey","1%","31%","7%","Want to move for an improved schedule",15,opacityHidden);
    } else {
      graph4_circle(8,(graph4_width*0.75),(graph4_height*0.75),30,"grey","1%","31%","7%","Want to move for an improved schedule",20,opacityVisible);
    }
  }

  function circle9(isInitial) {
    if (isInitial){
      graph4_circle(9,(graph4_width*0.9),(graph4_height*0.8),20,"grey","1%","31%","7%","Want to move for better career opportunities",15,opacityHidden);
    } else {
      graph4_circle(9,(graph4_width*0.75),(graph4_height*0.9),30,"grey","1%","31%","7%","Want to move for better career opportunities",20,opacityVisible);
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
        .attr("transform", "translate(" + (graph4_width*xTranslate) + "," + (graph4_height*yTranslate) + ")");
  }

  var graph4Steps = [
    function() {
      graph4_clearItems();
      var chart = graph4Svg.selectAll('.chart');
      chart.append("svg:image")
        .classed("graph4_img",true)
        .attr("width", graph4_horizontalSize)
        .attr("height", "100vh")
        .attr("xlink:href", "img/graphic4_earnings.png");
    },
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
          .attr("transform", "translate(" + (graph4_width*0.5) + "," + (graph4_height*0.1) + ")");
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
      circleTransition(5,30,20,0.25,0.75);
      circleTransition(6,30,20,0.25,0.9);
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
      circleTransition(8,30,20,0.75,0.75);
      circleTransition(9,30,20,0.75,0.9);
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
    var chart2 = graph2Svg.append('g')
      .classed('chart', true)
      .attr('transform', 'translate(' + margin*5 + ','+margin+')')
      .attr('pointer-events', 'all');

    // Axes
    chart2.append('g')
      .attr("transform", `translate(0,${graph2_height - margin*4})`)
      .style("font-size","15px")
      .call(d3.axisBottom(_graph2_x).tickFormat(d=>d3.utcFormat("%b %Y")(d)));
    chart2.append('g')
      .attr("transform", `translate(${margin},0)`)
      .style("font-size","15px")
      .call(d3.axisLeft(_graph2_y).tickFormat(d=>(d+"%")));
    chart2.append("text")
      .attr("class", "y-label")
      .style("font-size","20px")
      .attr("text-anchor", "middle")
      .attr("y", -3*margin)
      .attr("dx", -1*graph2_verticalSize/2)
      .attr("transform", "rotate(-90)")
      .text("Percentage Change from January 2020");

    var chart3 = graph3Svg.append('g')
      .classed('chart', true)
      .attr('transform', 'translate(' + margin*5 + ','+margin+')')
      .attr('pointer-events', 'all');
    chart3.append("g")
      .attr("transform", `translate(0,${graph2_height - margin*4})`)
      .style("font-size","15px")
      .call(d3.axisBottom(_graph3_x).tickFormat(d=>d3.utcFormat("%b %Y")(d)));
    chart3.append("g")
      .attr("transform", `translate(${margin},0)`)
      .style("font-size","15px")
      .call(d3.axisLeft(_graph3_y));

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