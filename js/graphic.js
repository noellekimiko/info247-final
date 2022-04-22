var oldWidth = 0
function render(){
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth

  var width = d3.select(' #container-1 .graph').node().offsetWidth;
  var height = width/2;
  var r = 40;

  if (innerWidth <= 925){
    width = innerWidth
    height = innerHeight*.7
  }
  var svg = d3.select('#container-1 .graph').html('')
    .append('svg')
      .attrs({width: width, height: height});

  var colors = ['orange', 'purple', 'steelblue', 'pink', 'black'];
  var gs = d3.graphScroll()
      .container(d3.select('#container-1'))
      .graph(d3.selectAll('#container-1 .graph'))
      .eventId('uniqueId1')  // namespace for scroll and resize events
      .sections(d3.selectAll('#container-1 .sections > div'))
      // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
      .on('active', function(i){
        if(i <= steps.length-1) {
          console.log("i: "+i+", steps.length:"+steps.length);
          steps[i]();
        }
        
        
        // circle.transition().duration(1000)
        //     .attrs(pos)
        //   .transition()
        //     .style('fill', colors[i])
        
      })

  var margin = 15;
  var verticalSize = height - margin * 2;
  var horizontalSize = width - margin * 2;
  var scaleX = null;
  var scaleY = null;
  var global_change_min = -18;
  var global_change_max = 4;
  var global_date_start = new Date(2020, 0, 1);
  var global_date_end = new Date(2022, 0, 1);
  var data_totalNonFarm = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.247160286},{"date":"2020-03-01","change":-0.737536811},{"date":"2020-04-01","change":-14.20842974},{"date":"2020-05-01","change":-12.47173433},{"date":"2020-06-01","change":-9.510412284},{"date":"2020-07-01","change":-8.598022718},{"date":"2020-08-01","change":-7.503549642},{"date":"2020-09-01","change":-6.899453092},{"date":"2020-10-01","change":-6.474153345},{"date":"2020-11-01","change":-6.255258729},{"date":"2020-12-01","change":-6.330852966},{"date":"2021-01-01","change":-5.989035549},{"date":"2021-02-01","change":-5.522323307},{"date":"2021-03-01","change":-5.059555111},{"date":"2021-04-01","change":-4.886674379},{"date":"2021-05-01","change":-4.592842869},{"date":"2021-06-01","change":-4.226703828},{"date":"2021-07-01","change":-3.773795751},{"date":"2021-08-01","change":-3.433950358},{"date":"2021-09-01","change":-3.155237695},{"date":"2021-10-01","change":-2.710217711},{"date":"2021-11-01","change":-2.284917964},{"date":"2021-12-01","change":-1.949673959},{"date":"2022-01-01","change":-1.642695625}];
  var data_healthcareAndSocialAssistance = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.29},{"date":"2020-03-01","change":-0.35},{"date":"2020-04-01","change":-10.87},{"date":"2020-05-01","change":-9.06},{"date":"2020-06-01","change":-6.77},{"date":"2020-07-01","change":-5.87},{"date":"2020-08-01","change":-5.2},{"date":"2020-09-01","change":-4.69},{"date":"2020-10-01","change":-4.27},{"date":"2020-11-01","change":-3.99},{"date":"2020-12-01","change":-3.68},{"date":"2021-01-01","change":-3.98},{"date":"2021-02-01","change":-3.71},{"date":"2021-03-01","change":-3.41},{"date":"2021-04-01","change":-3.28},{"date":"2021-05-01","change":-3.21},{"date":"2021-06-01","change":-3.22},{"date":"2021-07-01","change":-3.05},{"date":"2021-08-01","change":-2.98},{"date":"2021-09-01","change":-2.98},{"date":"2021-10-01","change":-2.8},{"date":"2021-11-01","change":-2.62},{"date":"2021-12-01","change":-2.47},{"date":"2022-01-01","change":-2.39}];
  var data_ambulatory = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.31},{"date":"2020-03-01","change":-0.81},{"date":"2020-04-01","change":-16.83},{"date":"2020-05-01","change":-11.77},{"date":"2020-06-01","change":-6.95},{"date":"2020-07-01","change":-5.23},{"date":"2020-08-01","change":-4.05},{"date":"2020-09-01","change":-3.15},{"date":"2020-10-01","change":-2.43},{"date":"2020-11-01","change":-1.97},{"date":"2020-12-01","change":-1.54},{"date":"2021-01-01","change":-1.62},{"date":"2021-02-01","change":-1.13},{"date":"2021-03-01","change":-0.74},{"date":"2021-04-01","change":-0.29},{"date":"2021-05-01","change":-0.1},{"date":"2021-06-01","change":0.02},{"date":"2021-07-01","change":0.41},{"date":"2021-08-01","change":0.56},{"date":"2021-09-01","change":0.99},{"date":"2021-10-01","change":1.42},{"date":"2021-11-01","change":1.69},{"date":"2021-12-01","change":1.84},{"date":"2022-01-01","change":2.03}];
  var data_hospital = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.12},{"date":"2020-03-01","change":0.13},{"date":"2020-04-01","change":-2.37},{"date":"2020-05-01","change":-3.04},{"date":"2020-06-01","change":-2.88},{"date":"2020-07-01","change":-2.6},{"date":"2020-08-01","change":-2.43},{"date":"2020-09-01","change":-2.42},{"date":"2020-10-01","change":-2.18},{"date":"2020-11-01","change":-2.08},{"date":"2020-12-01","change":-1.36},{"date":"2021-01-01","change":-2.04},{"date":"2021-02-01","change":-2.07},{"date":"2021-03-01","change":-1.87},{"date":"2021-04-01","change":-1.97},{"date":"2021-05-01","change":-1.95},{"date":"2021-06-01","change":-1.98},{"date":"2021-07-01","change":-1.98},{"date":"2021-08-01","change":-1.9},{"date":"2021-09-01","change":-2.06},{"date":"2021-10-01","change":-2.04},{"date":"2021-11-01","change":-1.98},{"date":"2021-12-01","change":-1.94},{"date":"2022-01-01","change":-1.88}];
  var data_nursing = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":-0.04},{"date":"2020-03-01","change":-0.22},{"date":"2020-04-01","change":-4},{"date":"2020-05-01","change":-5.29},{"date":"2020-06-01","change":-5.85},{"date":"2020-07-01","change":-6.48},{"date":"2020-08-01","change":-6.85},{"date":"2020-09-01","change":-7.02},{"date":"2020-10-01","change":-7.25},{"date":"2020-11-01","change":-7.57},{"date":"2020-12-01","change":-7.96},{"date":"2021-01-01","change":-8.59},{"date":"2021-02-01","change":-8.86},{"date":"2021-03-01","change":-9.02},{"date":"2021-04-01","change":-9.58},{"date":"2021-05-01","change":-9.89},{"date":"2021-06-01","change":-10.27},{"date":"2021-07-01","change":-10.6},{"date":"2021-08-01","change":-10.76},{"date":"2021-09-01","change":-12.02},{"date":"2021-10-01","change":-12.12},{"date":"2021-11-01","change":-12.17},{"date":"2021-12-01","change":-12.15},{"date":"2022-01-01","change":-12.15}];
  var _x = d3.scaleTime()
    .domain([global_date_start,global_date_end])
    .range([margin, horizontalSize]);

  var _y = d3.scaleLinear()
    .domain([global_change_min,global_change_max])
    .range([verticalSize, margin]);

  var _line_generator = d3.line()
    .x(d => _x(d3.timeParse("%Y-%m-%d")(d.date)))
    .y(d => _y(d.change));

  function setupCharts() {    
    var chart = svg.append('g')
      .classed('chart', true)
      .attr('transform', 'translate(' + margin + ',0)');

    // Axes
    chart.append('g')
      .attr("transform", `translate(0,${height - margin*2})`)
      .call(d3.axisBottom(_x));
    chart.append('g')
      .attr("transform", `translate(${margin},0)`)
      .call(d3.axisLeft(_y));
  }

  function _path_generator(data,idName,strokeColor) {
    var chart = svg.selectAll('.chart');
    chart.append('path')
        .attr("id", idName)
        .classed('timeseries', true)
        .attr("d",_line_generator(data))
        .attr("fill","none")
        .attr("stroke",strokeColor)
        .attr("stroke-width","1.5")
        .attr("stroke-miterlimit","1");
  }
  
  function path_totalNonFarm() {
    _path_generator(data_totalNonFarm,"totalNonFarm","grey");
  }

  function path_healthcareAndSocialAssistance() {
    _path_generator(data_healthcareAndSocialAssistance,"healthcareAndSocialAssistance","green");
  }

  function path_ambulatory() {
    _path_generator(data_ambulatory,"ambulatory","steelblue");
  }

  function path_hospital() {
    _path_generator(data_hospital,"hospital","orange");
  }

  function path_nursing() {
    _path_generator(data_nursing,"nursing","salmon");
  }

  var steps = [
    function step0() {
      var chart = svg.selectAll('.chart');
      
      // Clean out other items
      chart.select('#totalNonFarm').remove();
      chart.select('#healthcareAndSocialAssistance').remove();

      path_totalNonFarm();
    },

    function step1() {
      var chart = svg.selectAll('.chart');

      // Clean out other items
      chart.selectAll('.timeseries').remove();
      
      path_totalNonFarm();
      path_healthcareAndSocialAssistance();
    },

    function step2() {
      var chart = svg.selectAll('.chart');
      // Clean out other items
      chart.selectAll('.timeseries').remove();
      
      path_ambulatory();
    },

    function step3() {
      var chart = svg.selectAll('.chart');
      // Clean out other items
      chart.selectAll('.timeseries').remove();
      
      path_ambulatory();
      path_hospital();
    },

    function step4() {
      var chart = svg.selectAll('.chart');
      // Clean out other items
      chart.selectAll('.timeseries').remove();
      
      path_ambulatory();
      path_hospital();
      path_nursing();
    },
  ]

  var svg2 = d3.select('#container-2 .graph').html('')
    .append('svg')
      .attrs({width: width, height: height})

  var path = svg2.append('path')

  var gs2 = d3.graphScroll()
      .container(d3.select('#container-2'))
      .graph(d3.selectAll('#container-2 .graph'))
      .eventId('uniqueId2')  // namespace for scroll and resize events
      .sections(d3.selectAll('#container-2 .sections > div'))
      .on('active', function(i){
        var h = height
        var w = width
        var dArray = [
          [[w/4, h/4], [w*3/4, h/4],  [w*3/4, h*3/4], [w/4, h*3/4]],
          [[0, 0],     [w*3/4, h/4],  [w*3/4, h*3/4], [w/4, h*3/4]],
          [[w/2, h/2], [w, h/4],      [w, h],         [w/4, h]],
          [[w/2, h/2], [w, h/4],      [w, h],         [w/4, h]],
          [[w/2, h/2], [w, h/2],      [0, 0],         [w/4, h/2]],
          [[w/2, h/2], [0, h/4],      [0, h/2],         [w/4, 0]],
        ].map(function(d){ return 'M' + d.join(' L ') })


        path.transition().duration(1000)
            .attr('d', dArray[i])
            .style('fill', colors[i])
      })

  d3.select('.footer')
      .styles({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'})
  setupCharts();
}
render()
d3.select(window).on('resize', render)