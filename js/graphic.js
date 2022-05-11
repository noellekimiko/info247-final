var oldWidth = 0
function render(){
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth

  var margin = 15;
  var radius = 5;
  var scaleX = null;
  var scaleY = null;

  // Define the tooltip
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("text-align", "center")
    .style("width", "60px")
    .style("padding", "2px")
    .style("font-size", "14px")
    .style("background", "white")
    .style("border", "1px solid black")
    .style("border-radius", "1px")
    .style("pointer-events", "none")
    .style("display", "none")
    .style("visibility", "hidden");
  
  //code for line animation borrowed from Pablo Gutierrez (https://observablehq.com/@blosky/animated-line-chart)
  function transition(path, strokeColor) {
      path.transition()
          .duration(4000)
          .attr("stroke",strokeColor)
          .attrTween("stroke-dasharray", tweenDash);
  }

  function tweenDash() {
      const l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l);
      return function(t) { return i(t) };
  }

  var graph1_width = d3.select(' #container-1 .graph').node().offsetWidth;
  var graph1_height = d3.select(' #container-1 .graph').node().offsetHeight;
  var graph1_verticalSize = graph1_height - margin * 2;
  var graph1_horizontalSize = graph1_width - (margin * 3);
  var graph1Svg = d3.select('#container-1 .graph').html('')
    .append('svg')
      .attrs({width: graph1_horizontalSize, height: graph1_verticalSize});
  var graph1Canvas = d3.select('#container-1 .graph')
    .append('canvas')
      .attrs({width: graph1_horizontalSize, height: graph1_verticalSize});


  var gs1 = d3.graphScroll()
      .container(d3.select('#container-1'))
      .graph(d3.selectAll('#container-1 .graph'))
      .eventId('uniqueId1')  // namespace for scroll and resize events
      .sections(d3.selectAll('#container-1 .sections > div'))
      .on('active', function(i){
        if(i <= graph1Steps.length-1) {
          graph1Steps[i]();
        }        
      });

  var graph1Steps = [
    function() {
      const formatNumber = d3.format(',.0f');
      const format = d => `${formatNumber(d)} Schools`;
      let color = d3.scaleOrdinal()
            .range(["salmon"]);

      const sankey = d3.sankey()
        .nodeWidth(30)
        .nodePadding(20)
        .size([graph1_horizontalSize, graph1_verticalSize/2]);

      const path = sankey.link();

      const freqCounter = 1;

      d3.json('json/nursing.json', (nursing) => {
        sankey
          .nodes(nursing.nodes)
          .links(nursing.links)
          .layout(32);

        const link = graph1Svg.append('g').selectAll('.link')
          .data(nursing.links)
          .enter().append('path')
            .attr('class', 'link')
            .attr('d', path)
            .style('stroke-width', d => Math.max(1, d.dy))
            .sort((a, b) => b.dy - a.dy);

        link.append('title')
          .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

        const node = graph1Svg.append('g').selectAll('.node')
          .data(nursing.nodes)
          .enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .call(d3.drag()
              .subject(d => d)
              .on('start', function () { this.parentNode.appendChild(this); })
              .on('drag', dragmove));

        node.append('rect')
          .attr('height', d => d.dy)
          .attr('width', sankey.nodeWidth())
          .style('fill', (d) => {
            d.color = color(d.name.replace(/ .*/, ''));
            return d.color;
          })
          .style('stroke', 'none')
          .append('title')
            .text(d => `${d.name}\n${format(d.value)}`);

        node.append('text')
          .attr('x', -6)
          .attr('y', d => d.dy / 2)
          .attr('dy', '.35em')
          .attr('text-anchor', 'end')
          .attr('transform', null)
          .text(d => d.name)
          .filter(d => d.x < graph1_horizontalSize / 2)
            .attr('x', 6 + sankey.nodeWidth())
            .attr('text-anchor', 'start');

        function dragmove(d) {
          d3.select(this).attr('transform', `translate(${d.x},${d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))})`);
          sankey.relayout();
          link.attr('d', path);
        }

        const linkExtent = d3.extent(nursing.links, d => d.value);
        const frequencyScale = d3.scaleLinear().domain(linkExtent).range([.10, 1]);
        const particleSize = d3.scaleLinear().domain(linkExtent).range([1, 5]);


        nursing.links.forEach((link) => {
          link.freq = frequencyScale(link.value);
          link.particleSize = 2;
          link.particleColor = d3.scaleLinear().domain([0, 1])
          .range([link.source.color, link.target.color]);
        });

        const t = d3.timer(tick, 1000);
        let particles = [];

        function tick(elapsed, time) {
          particles = particles.filter(d => d.current < d.path.getTotalLength());

          d3.selectAll('path.link')
          .each(
            function (d) {
              // if (d.freq < 1) {
              for (let x = 0; x < 2; x += 1) {
                const offset = (Math.random() - 0.5) * (d.dy - 4);
                if (Math.random() < d.freq) {
                  const length = this.getTotalLength();
                  particles.push({ link: d, time: elapsed, offset, path: this, length, animateTime: length, speed: 0.5 + (Math.random()) });
                }
              }
              // }
              /*    
                  else {
                    for (var x = 0; x<d.freq; x++) {
                      var offset = (Math.random() - .5) * d.dy;
                      particles.push({link: d, time: elapsed, offset: offset, path: this})
                    }
                  } 
              */
            });

          particleEdgeCanvasPath(elapsed);
        }

        function particleEdgeCanvasPath(elapsed) {
          const context = graph1Canvas.node().getContext('2d');

          context.clearRect(0, 0, 1000, 1000);

          context.fillStyle = 'LightGray';
          context.lineWidth = '1px';
          for (const x in particles) {
            if ({}.hasOwnProperty.call(particles, x)) {
              const currentTime = elapsed - particles[x].time;
              // var currentPercent = currentTime / 1000 * particles[x].path.getTotalLength();
              particles[x].current = currentTime * 0.10 * particles[x].speed;
              const currentPos = particles[x].path.getPointAtLength(particles[x].current);
              context.beginPath();
              context.fillStyle = particles[x].link.particleColor(0);
              context.arc(currentPos.x, currentPos.y + particles[x].offset, particles[x].link.particleSize, 0, 2 * Math.PI);
              context.fill();
            }
          }
        }
      });
    },
    function () {
    }
  ];

  // Reusable employment trends
  var global_change_min = -18;
  var global_change_max = 4;
  var global_date_start = new Date(2020, 0, 1);
  var global_date_end = new Date(2022, 0, 1);
  var data_totalPrivate_jan_to_apr_2020 = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.217250124},{"date":"2020-03-01","change":-0.899152647},{"date":"2020-04-01","change":-16.03089436}];
  var data_totalPrivate = [{"date":"2020-01-01","change":0},{"date":"2020-02-01","change":0.217250124},{"date":"2020-03-01","change":-0.899152647},{"date":"2020-04-01","change":-16.03089436},{"date":"2020-05-01","change":-13.61485651},{"date":"2020-06-01","change":-10.12803068},{"date":"2020-07-01","change":-9.128370856},{"date":"2020-08-01","change":-8.190561603},{"date":"2020-09-01","change":-7.449127907},{"date":"2020-10-01","change":-6.831395349},{"date":"2020-11-01","change":-6.517503711},{"date":"2020-12-01","change":-6.601001979},{"date":"2021-01-01","change":-6.273967095},{"date":"2021-02-01","change":-5.738186541},{"date":"2021-03-01","change":-5.235650668},{"date":"2021-04-01","change":-5.07174666},{"date":"2021-05-01","change":-4.777183325},{"date":"2021-06-01","change":-4.384432212},{"date":"2021-07-01","change":-3.891173924},{"date":"2021-08-01","change":-3.506927264},{"date":"2021-09-01","change":-3.19071623},{"date":"2021-10-01","change":-2.654162543},{"date":"2021-11-01","change":-2.169408709},{"date":"2021-12-01","change":-1.780523256},{"date":"2022-01-01","change":-1.437252598}];
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
        .attr("stroke-width",5)
        .attr("stroke-miterlimit","1")
        .call(transition, strokeColor)
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
        .style('opacity', '0')
      .on('mouseover', function (d, i) {
          var change = (d.change).toFixed(2).toString() + '%';
          var date = d3.timeFormat("%b %Y")(d3.timeParse("%Y-%m-%d")(d.date));
          var tooltipText = date + " " + change;

          var rect = this.getBoundingClientRect();
          tooltip.transition()    
            .duration(200)  
            .style("opacity", .9)
            .style("display","block")
            .style("visibility","visible");  
          tooltip.html(tooltipText) 
            .style("left", (rect.left + 5 + window.scrollX) + "px")
            .style("top", (rect.top + window.scrollY)+ "px"); 
        })
      .on('mouseout', function (d, i) {
          tooltip.transition()    
            .duration(500)    
            .style("opacity", 0)
            .style("display","none")
            .style("visibility","hidden"); 
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

  function graph_totalPrivate_jan_to_apr_2020(svg,x,y,line_generator,includePoints,includeTransition) {
    _emp_generator(svg,x,y,line_generator,data_totalPrivate_jan_to_apr_2020,"totalPrivate_jan_to_apr_2020","Total Private","grey",includePoints,includeTransition);
  }
  
  function graph_totalPrivate(svg,x,y,line_generator,includePoints,includeTransition) {
    _emp_generator(svg,x,y,line_generator,data_totalPrivate,"totalPrivate","Total","grey",includePoints,includeTransition);
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
    graph_totalPrivate(svg,x,y,line_generator,includePoints,includeTransition);
    graph_healthcareAndSocialAssistance(svg,x,y,line_generator,includePoints,includeTransition);
    graph_ambulatory(svg,x,y,line_generator,includePoints,includeTransition);
    graph_hospital(svg,x,y,line_generator,includePoints,includeTransition);
    graph_nursing(svg,x,y,line_generator,includePoints,includeTransition);
  }
  function graph_totalAndSector(svg,x,y,line_generator,includePoints,includeTransition) {
    graph_totalPrivate(svg,x,y,line_generator,includePoints,includeTransition);
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
      graph_totalPrivate_jan_to_apr_2020(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, true);
    },

    function () {
      graph2_clearItems();
      graph_totalPrivate_jan_to_apr_2020(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, false);
      graph_healthcareAndSocialAssistance_jan_to_apr_2020(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, true);
    },

    function () {
      graph2_clearItems();
      // These are to make the animation appear for only the part after the drop
      graph_totalPrivate_jan_to_apr_2020(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, false);
      graph_healthcareAndSocialAssistance_jan_to_apr_2020(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, false);
      // Animated lines
      graph_totalPrivate(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, true);
      graph_healthcareAndSocialAssistance(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, true);
    },

    function () {
      graph2_clearItems();
      graph_ambulatory(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, false);
    },

    function () {
      graph2_clearItems();
      graph_ambulatory(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, false);
      graph_hospital(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, true);
    },

    function () {
      graph2_clearItems();
      graph_ambulatory(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, false);
      graph_hospital(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, false);
      graph_nursing(graph2Svg,_graph2_x, _graph2_y, _graph2_line_generator, true, true);
    },
  ]

  // Graph 3
  var graph3_value_max = 3.5;
  var graph3_date_start = new Date(2020, 0, 1);
  var graph3_date_end = new Date(2021, 11, 1);
  var graph3_data_total = [{"month":"2020-01-01","value":1.128899982},{"month":"2020-02-01","value":1.104278075},{"month":"2020-03-01","value":1.079214064},{"month":"2020-04-01","value":1.06911958},{"month":"2020-05-01","value":0.612040558},{"month":"2020-06-01","value":0.749511582},{"month":"2020-07-01","value":0.988046448},{"month":"2020-08-01","value":1.033935817},{"month":"2020-09-01","value":1.036021505},{"month":"2020-10-01","value":1.066377816},{"month":"2020-11-01","value":1.103896104},{"month":"2020-12-01","value":1.172420263},{"month":"2021-01-01","value":1.215932521},{"month":"2021-02-01","value":1.250921214},{"month":"2021-03-01","value":1.313786008},{"month":"2021-04-01","value":1.441533657},{"month":"2021-05-01","value":1.516387727},{"month":"2021-06-01","value":1.489524443},{"month":"2021-07-01","value":1.597396257},{"month":"2021-08-01","value":1.628975853},{"month":"2021-09-01","value":1.573216317},{"month":"2021-10-01","value":1.664154653},{"month":"2021-11-01","value":1.575733545},{"month":"2021-12-01","value":1.706202573}];
  var graph3_data_healthcare = [{"month":"2020-01-01","value":1.760115607},{"month":"2020-02-01","value":1.664233577},{"month":"2020-03-01","value":1.904761905},{"month":"2020-04-01","value":1.864035088},{"month":"2020-05-01","value":0.832869081},{"month":"2020-06-01","value":1.226161369},{"month":"2020-07-01","value":1.478723404},{"month":"2020-08-01","value":1.760517799},{"month":"2020-09-01","value":1.726851852},{"month":"2020-10-01","value":1.89280245},{"month":"2020-11-01","value":1.945773525},{"month":"2020-12-01","value":1.860719875},{"month":"2021-01-01","value":2.201096892},{"month":"2021-02-01","value":2.311248074},{"month":"2021-03-01","value":2.072617247},{"month":"2021-04-01","value":2.080597015},{"month":"2021-05-01","value":2.293154762},{"month":"2021-06-01","value":2.3125},{"month":"2021-07-01","value":2.585585586},{"month":"2021-08-01","value":2.412371134},{"month":"2021-09-01","value":2.456521739},{"month":"2021-10-01","value":2.690677966},{"month":"2021-11-01","value":2.53298153},{"month":"2021-12-01","value":2.647849462}];
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
    chart.selectAll(".dataPoint").remove();
  }

  function graph3_generator(data,id,title,strokeColor) {
    var chart = graph3Svg.selectAll('.chart');
    graph3_path_generator(chart,data,title,strokeColor);
    graph3_points_generator(chart,id,data);
  }

  function graph3_path_generator(chart,data,title,strokeColor){
    chart.append("path")
      .classed('openings-hires', true)
      .attr("d", _graph3_line_generator(data))
      .attr("fill", "none")
      .attr("stroke-width", 5)
      .attr("stroke-miterlimit","1")
      .call(transition, strokeColor)
      .append("title")
        .text(title);
  }

  function graph3_points_generator(chart,forPathId,data) {
    chart.selectAll('circle'+'.'+forPathId+'_point')
      .data(data)
      .enter()
      .append('circle')
        .attr('class', ' dataPoint ' + forPathId + '_point')
        .attr('cx', function(d) {return _graph3_x(d3.timeParse("%Y-%m-%d")(d.month))})
        .attr('cy', function(d) {return _graph3_y(d.value)})
        .attr('r',  radius)
        .style('opacity', '0')
      .on('mouseover', function (d, i) {
          var value = (d.value).toFixed(2).toString();
          var date = d3.timeFormat("%b %Y")(d3.timeParse("%Y-%m-%d")(d.month));
          var tooltipText = date + " " + value;

          var rect = this.getBoundingClientRect();
          tooltip.transition()    
            .duration(200)  
            .style("opacity", .9)
            .style("display","block")
            .style("visibility","visible")
;  
          tooltip.html(tooltipText) 
            .style("left", (rect.left + 5 + window.scrollX) + "px")
            .style("top", (rect.top + window.scrollY)+ "px"); 
        })
      .on('mouseout', function (d, i) {
          tooltip.transition()    
            .duration(500)    
            .style("opacity", 0)
            .style("display","none")
            .style("visibility","hidden"); 
        });
  }

  var graph3Steps = [
    function () {
      graph3_clearItems();
      graph3_generator(graph3_data_total,"total","Total Private","grey");
      graph3_generator(graph3_data_healthcare,"health","Health Care and Social Assistance","#008000");
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
  var graph4_verticalSize_graph = graph4_height - margin * 4;
  var graph4_horizontalSize_graph = graph4_width - (margin * 8);
  var graph4_verticalSize = graph4_height - margin * 2;
  var graph4_horizontalSize = graph4_width - margin * 2;
  var graph4_earnings_total = [{"month":"2020-01-01","value":975.15},{"month":"2020-02-01","value":982.46},{"month":"2020-03-01","value":981.74},{"month":"2020-04-01","value":1026.34},{"month":"2020-05-01","value":1030.94},{"month":"2020-06-01","value":1015.86},{"month":"2020-07-01","value":1017.59},{"month":"2020-08-01","value":1022.96},{"month":"2020-09-01","value":1026.95},{"month":"2020-10-01","value":1030.60},{"month":"2020-11-01","value":1031.82},{"month":"2020-12-01","value":1038.22},{"month":"2021-01-01","value":1047.55},{"month":"2021-02-01","value":1039.38},{"month":"2021-03-01","value":1049.09},{"month":"2021-04-01","value":1053.98},{"month":"2021-05-01","value":1059.56},{"month":"2021-06-01","value":1062.10},{"month":"2021-07-01","value":1067.32},{"month":"2021-08-01","value":1067.37},{"month":"2021-09-01","value":1076.02},{"month":"2021-10-01","value":1082.63},{"month":"2021-11-01","value":1086.80},{"month":"2021-12-01","value":1092.02},{"month":"2022-01-01","value":1091.98}];
  var graph4_earnings_nursing =[{"month":"2020-01-01","value":642.95},{"month":"2020-02-01","value":649.57},{"month":"2020-03-01","value":653.59},{"month":"2020-04-01","value":683.32},{"month":"2020-05-01","value":693.25},{"month":"2020-06-01","value":684.45},{"month":"2020-07-01","value":683.76},{"month":"2020-08-01","value":688.16},{"month":"2020-09-01","value":693.58},{"month":"2020-10-01","value":693.59},{"month":"2020-11-01","value":698.71},{"month":"2020-12-01","value":703.48},{"month":"2021-01-01","value":707.61},{"month":"2021-02-01","value":709.32},{"month":"2021-03-01","value":704.86},{"month":"2021-04-01","value":711.70},{"month":"2021-05-01","value":717.17},{"month":"2021-06-01","value":726.13},{"month":"2021-07-01","value":730.85},{"month":"2021-08-01","value":732.24},{"month":"2021-09-01","value":743.38},{"month":"2021-10-01","value":748.34},{"month":"2021-11-01","value":754.12},{"month":"2021-12-01","value":762.62},{"month":"2022-01-01","value":767.50}];
  var graph4_earnings_value_max = 1100;
  var graph4_date_start = new Date(2020, 0, 1);
  var graph4_date_end = new Date(2022, 0, 1);

  var graph4Svg = d3.select('#container-4 .graph').html('')
    .append('svg')
      .attrs({width: graph4_width, height: graph4_height});

  function graph4_x_axis(chart){
    chart.append("g")
      .classed("graph4-axis",true)
      .attr("transform", `translate(0,${graph2_height - margin*4})`)
      .style("font-size","15px")
      .call(d3.axisBottom(_graph4_x).tickFormat(d=>d3.utcFormat("%b %Y")(d)));
  }
  function graph4_y_axis(chart){
    chart.append("g")
      .classed("graph4-axis",true)
      .attr("transform", `translate(${margin},0)`)
      .style("font-size","15px")
      .call(d3.axisLeft(_graph4_y));
    chart.append("text")
      .attr("class", "y-label")
      .style("font-size","20px")
      .attr("text-anchor", "middle")
      .attr("y", -3*margin)
      .attr("dx", -1*graph2_verticalSize/2)
      .attr("transform", "rotate(-90)")
      .text("Weekly Earnings (dollars, seasonally adjusted)");
  }

  var _graph4_x = d3.scaleTime()
    .domain([graph4_date_start,graph4_date_end])
    .range([margin, graph4_horizontalSize_graph]);

  var _graph4_y = d3.scaleLinear()
    .domain([0, graph4_earnings_value_max])
    .range([graph4_verticalSize_graph, margin]);

  var _graph4_line_generator = d3.line()
      .x(d => _graph4_x(d3.timeParse("%Y-%m-%d")(d.month)))
      .y(d => _graph4_y(d.value));

  function graph4_generator(data,id,title,strokeColor) {
    var chart = graph4Svg.selectAll('.chart-graph');
    graph4_path_generator(chart,data,title,strokeColor);
    graph4_points_generator(chart,id,data);
  }

  function graph4_path_generator(chart,data,title,strokeColor){
    chart.append("path")
      .classed('earnings', true)
      .attr("d", _graph4_line_generator(data))
      .attr("fill", "none")
      .attr("stroke-width", 5)
      .attr("stroke-miterlimit","1")
      .call(transition, strokeColor)
      .append("title")
        .text(title);
  }

  function graph4_points_generator(chart,forPathId,data) {
    chart.selectAll('circle'+'.'+forPathId+'_point')
      .data(data)
      .enter()
      .append('circle')
        .attr('class', ' dataPoint ' + forPathId + '_point')
        .attr('cx', function(d) {return _graph4_x(d3.timeParse("%Y-%m-%d")(d.month))})
        .attr('cy', function(d) {return _graph4_y(d.value)})
        .attr('r',  radius)
        .style('opacity', '0')
      .on('mouseover', function (d, i) {
          var value = '$'+(d.value).toFixed(2).toString();
          var date = d3.timeFormat("%b %Y")(d3.timeParse("%Y-%m-%d")(d.month));
          var tooltipText = date + " " + value;

          var rect = this.getBoundingClientRect();
          tooltip.transition()    
            .duration(200)  
            .style("opacity", .9)
            .style("display","block")
            .style("visibility","visible");  
          tooltip.html(tooltipText) 
            .style("left", (rect.left + 5 + window.scrollX) + "px")
            .style("top", (rect.top + window.scrollY)+ "px"); 
        })
      .on('mouseout', function (d, i) {
          tooltip.transition()    
            .duration(500)    
            .style("opacity", 0)
            .style("display","none")
            .style("visibility","hidden"); 
        });
  }

  function graph4_clearItems_graph() {
    var chart = graph4Svg.selectAll('.chart-graph');
    chart.selectAll(".graph4-axis").remove();
    chart.selectAll(".y-label").remove();
    chart.selectAll(".earnings").remove();
    chart.selectAll(".dataPoint").remove();
  }

  // constants
  const duration = 600;
  const opacityHidden = 0;
  const opacityHalf = 0.5;
  const opacityVisible = 1;
  
  // helpers
  function rectConst(group,idNum,rectWidth,rectHeight,fill,fillOpacity) {
    group.append("rect")
      .classed("graph4_rect",true)
      .attr("id", "rect"+idNum)
      .attr("x", 0)
      .attr("y", 0)
      .attr('width', rectWidth)
      .attr('height',rectHeight)
      .attr("fill", fill)
      .attr("fill-opacity", fillOpacity)
      .attr('stroke', 'black')
      .attr('stroke-width', 5);
  }
  function labelConst(group,idNum,x,y,label,opacity) {
    group.append("text")
      .classed("graph4_label",true)
      .attr("id", "label"+idNum)
      .attr("x", x)
      .attr("y", y)
      .attr("font-size", 22)
      .attr("font-family", "Arial")
      .style("text-anchor", "start")
      .attr("font-weight",800)
      .attr("fill","black")
      .text(label)
      .attr("opacity", opacity);
  }
  function textConst(group,idNum,x,y,fillColor,text,opacity) {
    group.append("text")
      .classed("graph4_text",true)
      .attr("id", "text"+idNum)
      .attr("x", x)
      .attr("y", y)
      .attr("fill", fillColor)
      .attr("font-size", 18)
      .attr("font-family", "Arial")
      .style("text-anchor", "start")
      .text(text)
      .attr("opacity", opacity)
      .attr("font-weight",800);
  }
  function graph4_clearItems_rect() {
    var chart = graph4Svg.selectAll('.chart-rect');
    chart.selectAll(".graph4_group").remove();
    chart.selectAll(".graph4_rect").remove();
    chart.selectAll(".graph4_label").remove();
    chart.selectAll(".graph4_text").remove();
  }
  function graph4_rect(idNum,xPer,yPer,rectWidth,rectHeight,fill,fillOpacity,labelX,labelY,label,textX,textY,text,labelTextOpacity) {
    var chart = graph4Svg.selectAll('.chart-rect');
    var group = chart.append("g")
      .attr("id", "graph4_group_"+idNum)
      .classed("graph4_group", true)
      .attr("transform", "translate(" + graph4_horizontalSize*xPer + "," + graph4_verticalSize*yPer + ")");

    rectConst(group,idNum,rectWidth,rectHeight,fill,fillOpacity);
    labelConst(group,idNum,labelX,labelY,label,labelTextOpacity);
    textConst(group,idNum,textX,textY,fill,text,labelTextOpacity);
  }

  function rectGroupTranslate(idNum,xTranslate,yTranslate,delayMult) {
    d3.select("#graph4_group_"+idNum).transition()
        .delay(duration*delayMult)
        .attr("transform", "translate(" + (graph4_horizontalSize*xTranslate) + "," + (graph4_verticalSize*yTranslate) + ")");
  }

  function rectGroupTransition(idNum,widthPer,xTranslate,yTranslate,delayMultStart) {
    d3.select("#rect"+idNum).transition() 
      .delay(duration*delayMultStart)
      .duration(duration)
      .attr("opacity", opacityVisible)
      .attr("fill-opacity", opacityHalf)
      .attr('width', graph4_horizontalSize*widthPer);
    d3.select("#graph4_group_"+idNum).transition()
        .delay(duration*(delayMultStart+1))
        .attr("transform", "translate(" + (graph4_horizontalSize*xTranslate) + "," + (graph4_verticalSize*yTranslate) + ")");
    d3.select("#label"+idNum).transition() 
      .delay(duration*(delayMultStart+1.5))
      .duration(duration)
      .attr("opacity", opacityVisible);
    d3.select("#text"+idNum).transition()
      .delay(duration*(delayMultStart+1.5))
      .duration(duration)         
      .attr("opacity", opacityVisible);
  }

  function rect0(isInitial) {
    var chart = graph4Svg.selectAll('.chart-rect');

    if (isInitial){
      var group = chart.append("g")
        .attr("id", "graph4_group_"+0)
        .classed("graph4_group", true)
        .attr("transform", "translate(" + graph4_horizontalSize*0 + "," + graph4_verticalSize*0.5 + ")");
      rectConst(group,0,graph4_horizontalSize,40,"none");
    } else {
      var group = chart.append("g")
        .attr("id", "graph4_group_"+0)
        .classed("graph4_group", true)
        .attr("transform", "translate(" + graph4_horizontalSize*0 + "," + graph4_verticalSize*0.4 + ")");
      rectConst(group,0,graph4_horizontalSize,40,"none");

    }
  }

  function rect1(isInitial) {
    if (isInitial){
      graph4_rect(1,0,0.5,0,40,"salmon",opacityHalf,"10px","30px","34%","0","-20px","NURSES PLAN TO RESIGN BY 2022",opacityHidden);
    } else {
      graph4_rect(1,0,0.4,graph4_horizontalSize*0.34,40,"salmon",opacityHalf,"10px","30px","34%","0","-20px","NURSES PLAN TO RESIGN BY 2022",opacityVisible);
    }
  }

  function rect2(isInitial) {
    if (isInitial){
      graph4_rect(2,0,0.4,0,40,"salmon",opacityHalf,"10px","30px","44%","0","-20px","Burnout & High Stress",opacityHidden);
    } else {
      graph4_rect(2,0,0.6,graph4_horizontalSize*0.34*0.44,40,"salmon",opacityHalf,"10px","30px","44%","0","-20px","Burnout & High Stress",opacityVisible);
    }
  }

  function rect3(isInitial) {
    if (isInitial){
      graph4_rect(3,0,0.4,0,40,"salmon",opacityHalf,"10px","30px","27%","0","-20px","Pay & Benefits",opacityHidden);
    } else {
      graph4_rect(3,0.5,0.6,graph4_horizontalSize*0.34*0.27,40,"salmon",opacityHalf,"10px","30px","27%","0","-20px","Pay & Benefits",opacityVisible);
    }
  }

  var graph4Steps = [
    function() {
      graph4_clearItems_graph();
      graph4_clearItems_rect();
      var chart = graph4Svg.selectAll('.chart-graph');
      graph4_x_axis(chart);
      graph4_y_axis(chart);
      graph4_generator(graph4_earnings_total,"total","Total Private","grey");
      graph4_generator(graph4_earnings_nursing,"nursing","Nursing and Residential Care","salmon");
    },
    function() {
      graph4_clearItems_graph();
      graph4_clearItems_rect();
      rect0(true);
      rect1(true);
      rectGroupTransition(1,0.34,0,0.5,0.25);
    },

    function() {
      graph4_clearItems_rect();
      rect0(false);
      rect1(false);
      rectGroupTranslate(0,0,0.4,0.5);
      rectGroupTranslate(1,0,0.4,0.5);
      rect2(true);
      rectGroupTransition(2,0.34*0.44,0,0.6,1);
      rect3(true);
      rectGroupTransition(3,0.34*0.27,0.5,0.6,3);
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

  // Graph 6
  var graph6_width = d3.select('#container-6 .graph').node().offsetWidth;
  var graph6_height = (d3.select('#container-6 .graph').node().offsetHeight);
  var graph6_verticalSize = graph6_height - margin * 2;
  var graph6_horizontalSize = graph6_width - margin * 2;

  function graph6_textbox(idNum,titleText,detailText,display,visibility,opacity) {
    var graph = d3.selectAll('#container-6 .graph');
    var entry = graph.append("div")
      .attr("id", "graph6-textbox-"+idNum)
      .attr("class", "graph6-textbox")
      .style("display", display)
      .style("visibility", visibility)
      .style("opacity", opacity);

    entry.append("p")
      .classed("graph4_text_title",true)
      .text(titleText);

    entry.append("p")
      .classed("graph4_text_detail",true)
      .text(detailText);
  }

  function graph6_textbox_transition(idNum,delayMult) {
    d3.select("#graph6-textbox-"+idNum).transition()
      .delay(duration*delayMult)
      .duration(duration)
      .style("display", "block")
      .style("visibility", "visible")
      .style("opacity", opacityVisible);
  }

  function bidenAgenda1(isInitial) {
    if (isInitial) {
      graph6_textbox(1,'Establish a Minimum Nursing Home Staffing Requirement','"...ensures that all nursing home residents are provided safe, quality care, and that workers have the support they need to provide high-quality care."',"none","hidden",opacityHidden);
    } else {
      graph6_textbox(1,'Establish a Minimum Nursing Home Staffing Requirement','"...ensures that all nursing home residents are provided safe, quality care, and that workers have the support they need to provide high-quality care."',"block","visible",opacityVisible);
    }
  }
  function bidenAgenda2(isInitial) {
    if (isInitial) {
      graph6_textbox(2,'Ensure Nurse Aide Training is Affordable','"...strengthen and diversify the nursing home workforce."',"none","hidden",opacityHidden);
    } else {
      graph6_textbox(2,'Ensure Nurse Aide Training is Affordable','"...strengthen and diversify the nursing home workforce."',"block","visible",opacityVisible);
    }
  }
  function bidenAgenda3(isInitial) {
    if (isInitial) {
      graph6_textbox(3,'Support State Efforts to Improve Staffing and Workforce Sustainability','"...assist and encourage States requesting to tie Medicaid payments to clinical staff wages and benefits"',"none","hidden",opacityHidden);
    } else {
      graph6_textbox(3,'Support State Efforts to Improve Staffing and Workforce Sustainability','"...assist and encourage States requesting to tie Medicaid payments to clinical staff wages and benefits"',"block","visible",opacityVisible);
    }
  }
  function bidenAgenda4(isInitial) {
    if (isInitial) {
      graph6_textbox(4,'Launch National Nursing Career Pathways Campaign','"...recruit, train, retain, and transition workers into long-term care careers, with pathways into health-care careers"',"none","hidden",opacityHidden);
    } else {
      graph6_textbox(4,'Launch National Nursing Career Pathways Campaign','"...recruit, train, retain, and transition workers into long-term care careers, with pathways into health-care careers"',"block","visible",opacityVisible);
    }
  }

  function graph6_clearItems() {
    var graph = d3.selectAll('#container-6 .graph');
    graph.selectAll(".graph6-textbox").remove();
  }

  var graph6Steps = [
    function() {
      graph6_clearItems();
      bidenAgenda1(true);
      graph6_textbox_transition(1,2);
      bidenAgenda2(true);
      graph6_textbox_transition(2,3);
      bidenAgenda3(true);
      graph6_textbox_transition(3,4);
      bidenAgenda4(true);
      graph6_textbox_transition(4,5);
    },
    function() {
      graph6_clearItems();
      bidenAgenda1(false);
      bidenAgenda2(false);
      bidenAgenda3(false);
      bidenAgenda4(false);
    },
    function() {
      graph6_clearItems();
      bidenAgenda1(false);
      bidenAgenda2(false);
      bidenAgenda3(false);
      bidenAgenda4(false);
    }
  ];

  var gs6 = d3.graphScroll()
    .container(d3.select('#container-6'))
    .graph(d3.selectAll('#container-6 .graph'))
    .eventId('uniqueId6')  // namespace for scroll and resize events
    .sections(d3.selectAll('#container-6 .sections > div'))
    .on('active', function(i){
      if(i <= graph6Steps.length-1) {
        graph6Steps[i]();
      }        
    });
  
  function setupCharts() { 
    var chart1 = graph1Svg.append('g')
      .classed('chart', true)
      .attr('transform', 'translate(' + margin + ','+margin+')')
      .attr('pointer-events', 'all');
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
    chart3.append("text")
      .attr("class", "y-label")
      .style("font-size","20px")
      .attr("text-anchor", "middle")
      .attr("y", -3*margin)
      .attr("dx", -1*graph2_verticalSize/2)
      .attr("transform", "rotate(-90)")
      .text("Ratio of Openings to Hires");

    var chart4_graph = graph4Svg.append('g')
      .classed('chart-graph', true)
      .attr('transform', 'translate(' + margin*5 + ','+margin+')')
      .attr('pointer-events', 'all');
    var chart4_rect = graph4Svg.append('g')
      .classed('chart-rect', true)
      .attr('transform', 'translate(' + margin + ',0)')
      .attr('pointer-events', 'all');
  }

  setupCharts();
}
render()
d3.select(window).on('resize', render)