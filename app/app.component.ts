import { Component } from '@angular/core';
import * as d3 from 'd3';

//declare var d3: any;
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  gaugemap = {};
  constructor() {}
  ngOnInit() {
    this.draw();
  }

  draw() {
    var chart = function (container, configuration, data) {
      var config = {
        width: 300,
        height: 300,
        margin: 50,
        lineOpacity: '1',
        lineOpacityHover: '0.85',
        otherLinesOpacityHover: '0.1',
        lineStroke: '2.5px',
        lineStrokeHover: '3px',
        xAxisTicks: 7,
        yAxisTicks: 7,
        xlabelPadding: 10,
        ylabelPadding: 15,
        tickSizeInner: 0,
        tickSizeOuter: 0,
        color: ['#E22C43', '#0073D0'],
      };

      function configure(configuration) {
        var prop = undefined;
        for (prop in configuration) {
          config[prop] = configuration[prop];
        }
      }

      configure(configuration);

      /* Format Data */
      data.forEach(function (d) {
        d.values.forEach(function (d) {
          if (!isNaN(d.price)) {
            d.price = +d.price;
          }
        });
      });

      /* Scale */
      var xScale = d3
        .scaleLinear()
        .domain(d3.extent(data[0].values, (d) => d.date))
        .range([0, config.width - config.margin]);
      console.log(d3.extent(data[0].values, (d) => new Date()));
      var yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data[0].values, (d) => d.price)])
        .range([config.height - config.margin, 0]);

      /* Add SVG */
      var svg = d3
        .select(container)
        .append('svg')
        .attr('width', config.width + config.margin + 'px')
        .attr('height', config.height + config.margin + 'px')
        .append('g')
        .attr('transform', `translate(${config.margin}, ${config.margin})`);

      svg
        .append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('x', -20)
        .attr('y', -30)
        .attr('fill', '#F6F9FE');

      /* Add line into SVG */
      var line = d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.price))
        .curve(d3.curveBasis);
      let lines = svg.append('g').attr('class', 'lines');

      lines
        .selectAll('.line-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'line-group')
        .append('path')
        //.attr("class", "line")
        .attr('class', function (d, i) {
          return 'line line' + i;
        })
        .attr('d', function (d) {
          return line(d.values.filter((x) => !isNaN(x.price)));
        })
        .style('stroke', (d, i) => config.color[i % config.color.length])
        .style('opacity', config.lineOpacity);

      /* Add Axis into SVG */
      var xAxis = d3
        .axisBottom(xScale)
        .ticks(config.xAxisTicks)
        .tickSizeOuter(config.tickSizeOuter)
        .tickSizeInner(config.tickSizeInner);
      var yAxis = d3.axisLeft(yScale).ticks(config.yAxisTicks);

      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${config.height - config.margin})`)
        .style('dominant-baseline', 'central')
        .call(xAxis)
        .call((g) => g.select('.domain').remove())
        .select('path')
        .attr('marker-end', '>');

      svg
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .call((g) => g.select('.domain').remove())
        .append('text')
        .attr('x', -(config.height / 2) + 50)
        .attr('y', -30)
        .attr('transform', 'rotate(-90)')
        .attr('fill', '#000')
        .text(config.yAxixText)
        .select('path')
        .attr('marker-end', '>');

      // add the Y gridlines
      svg
        .append('g')
        .attr('class', 'grid')
        .call(make_y_gridlines().tickSize(-config.width).tickFormat(''));

      // gridlines in x axis function
      function make_x_gridlines() {
        return d3.axisBottom(xScale).ticks(5);
      }

      // gridlines in y axis function
      function make_y_gridlines() {
        return d3.axisLeft(yScale).ticks(5);
      }

      // for (var i=0; i< data.length; i++) {
      //     let totalLength = svg.select('.line' + i).node().getTotalLength();
      //       svg.select('.line' + i)
      //     .attr("stroke-dasharray", totalLength + " " + totalLength)
      //     .attr("stroke-dashoffset", totalLength)
      //     .transition() // Call Transition Method
      //     .duration(4000) // Set Duration timing (ms)
      //     .attr("stroke-dashoffset", 0);
      // }
    };

    var data = [
      {
        name: 'All Agents',
        values: [
          { date: 0, price: 100 },
          { date: 5, price: 340 },
          { date: 10, price: 145 },
          { date: 15, price: 241 },
          { date: 20, price: 101 },
          { date: 25, price: 90 },
          { date: 'Today', price: 10 },
        ],
      },
      {
        name: 'You',
        values: [
          { date: 0, price: 300 },
          { date: 5, price: 120 },
          { date: 10, price: 33 },
          { date: 15, price: 21 },
          { date: 20, price: 51 },
          { date: 25, price: 190 },
          { date: 'Today', price: 120 },
        ],
      },
    ];

    var lineChart = chart(
      '#chart',
      {
        width: 500,
        xAxisTicks: 7,
        yAxisTicks: 7,
        yAxixText: 'GB',
        color: ['#E22C43', '#0073D0'],
        timeFormat: '%b',
      },
      data
    );
  }
}
