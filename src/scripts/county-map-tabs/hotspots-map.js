import * as d3 from 'd3'

const margin = { top: 0, left: 10, right: 10, bottom: 0 }
const height = 50 - margin.top - margin.bottom
const width = 360 - margin.left - margin.right

const svg = d3
  .select('#hotspots')
  .attr('viewBox', [0, 0, width, height])
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

function legend() {
  const legend = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110]

  const x = d3
    .scaleBand()
    .domain(legend)
    .range([0, width])

  svg
    .append('g')
    .selectAll('rect')
    .data(legend)
    .enter()
    .append('rect')
    .attr('class', 'map-legend')
    .attr('height', 8)
    .attr('width', x.bandwidth())
    .attr('fill', function(d) {
      if (d < 0) {
        return '#e6e6e6'
      }
      if (+d < 10) {
        return '#f2df91'
      }
      if (+d < 20) {
        return '#f9c467'
      }
      if (+d < 30) {
        return '#ffa93e'
      }
      if (+d < 40) {
        return '#ff8b25'
      }
      if (+d < 50) {
        return '#fd6a0b'
      }
      if (+d < 60) {
        return '#f04f08'
      }
      if (+d < 70) {
        return '#d8382e'
      }
      if (+d < 80) {
        return '#c62832'
      }
      if (+d < 90) {
        return '#af1c43'
      }
      if (+d < 100) {
        return '#8a1739'
      }
      if (+d < 110) {
        return '#701547'
      } else {
        return '#4c0d3e'
      }
    })
    .attr('x', function(d) {
      return x(d)
    })
    .attr('y', height / 2.2)

  svg
    .append('g')
    .selectAll('text')
    .data(legend)
    .enter()
    .append('text')
    .attr('class', 'map-label')
    .text(function(d) {
      if (d < 0) {
        return 'no data'
      }
      if (+d < 10) {
        return
      }
      if (+d < 20) {
        return
      }
      if (+d < 30) {
        return 20
      }
      if (+d < 40) {
        return
      }
      if (+d < 50) {
        return 40
      }
      if (+d < 60) {
        return
      }
      if (+d < 70) {
        return 60
      }
      if (+d < 80) {
        return
      }
      if (+d < 90) {
        return 80
      }
      if (+d < 100) {
        return 100
      }
      if (+d < 110) {
        return 200
      }
      if (+d < 120) {
        return 250
      }
    })
    .style('font-size', 12)
    .attr('text-anchor', 'middle')
    .attr('opacity', 0.6)
    .attr('x', function(d) {
      if (d < 0) {
        return x(d) + 10
      } else {
        return x(d)
      }
    })
    .attr('y', height / 1.05)

  svg
    .append('text')
    // .attr('text-anchor', 'middle')
    .attr('class', 'map-legend-headline')
    .text('Avg. daily cases per 100k people in last 7 days')
    // .attr('dx', 10)
    .attr('dy', -10)
    .attr('text-anchor', 'middle')
    .attr('font-size', 16)
    .attr('opacity', 0.6)
    .attr('x', width / 2)
    .attr('y', height / 2)

  svg
    .append('g')
    .selectAll('rect')
    .data(legend)
    .enter()
    .append('rect')
    .attr('class', 'tick')
    .attr('x', function(d) {
      return x(d)
    })
    .attr('height', 14)
    .attr('width', 1)
    .attr('fill', 'black')
    .attr('y', height / 2.2)
    .attr('opacity', 0.5)
}
legend()
