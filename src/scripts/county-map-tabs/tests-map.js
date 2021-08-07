import * as d3 from 'd3'

const margin = { top: 0, left: 10, right: 10, bottom: 0 }
const height = 50 - margin.top - margin.bottom
const width = 340 - margin.left - margin.right

const svg = d3
  .select('#Testing')
  .attr('viewBox', [0, 0, width, height])
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

function legend() {
  const legend = [
    -1000,
    0,
    1000,
    2000,
    3000,
    4000,
    5000,
    6000,
    7000,
    8000,
    9000
  ]
  const colors = [
    '#D3D3D3',
    '#ffffcc',
    '#ffeda0',
    '#fed976',
    '#feb24c',
    '#fd8d3c',
    '#fc4e2a',
    '#e31a1c',
    '#bd0026',
    '#800026'
  ]

  const x = d3
    .scaleBand()
    .domain(legend)
    .range([0, width])

  const format = d3.format('.2s')
  const format1 = d3.format(',')

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
        return '#D3D3D3'
      }
      if (+d < 1000) {
        return '#ffd500'
      }
      if (+d < 2000) {
        return '#FFBA08'
      }
      if (+d < 3000) {
        return '#FAA307'
      }
      if (+d < 4000) {
        return '#F48C06'
      }
      if (+d < 5000) {
        return '#E85D04'
      }
      if (+d < 6000) {
        return '#DC2F02'
      }
      if (+d < 7000) {
        return '#D00000'
      }
      if (+d < 8000) {
        return '#9D0208'
      }
      if (+d > 9000) {
        return '#6A040F'
      } else {
        return '#6A040F'
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
      if (+d < 1000) {
        return
      }
      if (+d < 2000) {
        return
      }
      if (+d < 3000) {
        return '2k'
      }
      if (+d < 4000) {
        return
      }
      if (+d < 5000) {
        return '4k'
      }
      if (+d < 6000) {
        return
      }
      if (+d < 7000) {
        return '6k'
      }
      if (+d < 8000) {
        return
      }
      if (+d < 9000) {
        return '8k+'
      }
    })
    .style('font-size', 12)
    .attr('text-anchor', 'middle')
    .attr('opacity', 0.6)
    .attr('y', height / 1.05)
    .attr('x', function(d) {
      if (d < 0) {
        return x(d) + 10
      } else {
        return x(d)
      }
    })

  svg
    .append('text')
    // .attr('text-anchor', 'middle')
    .attr('class', 'map-legend-headline')
    .text('Viral lab tests per 100,000 people in last 7 days')
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
