import * as d3 from 'd3'
let pymChild

const margin = { top: 30, left: 60, right: 20, bottom: 60 }
const height = 540 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#deathsbyrace')
  .attr('viewBox', [0, 0, width, height])
  .append('svg')
  // .style('background-color', 'lightgrey')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

/// /parseTime////////////////////////////////
const parseDate = d3.timeParse('%Y-%m-%d')
const numberFormat = d3.format(',d')
const commaFormat = d3.format(',')
const timeFormat = d3.timeFormat('%b %d')

/// Scales////////////////////////////////
const xScale = d3.scaleTime().range([0, width])
const yScale = d3.scaleLinear().range([height, 0])

// / /tooltip////////////////////////////////
const tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('visibility', 'hidden')

function mouseOver(d, i) {
  tooltip
    .attr('data-html', 'true')
    .style('visibility', 'visible')
    .html(
      `<div class='row'><b>Date: ${timeFormat(
        parseDate(d.date)
      )}</b></br>Cases per 100k: ${commaFormat(
        +d.pctCases
      )}</br> Deaths per 100k: ${d.pctDeaths}</div>`
    )
}

function mouseMove(d, widthEl) {
  const x = d3.event.pageX
  const y = d3.event.pageY
  const toolTipWidth = tooltip.node().getBoundingClientRect().width
  const toolTipMargin = 10
  const offset = d3
    .select('#deathsbyrace')
    .node()
    .getBoundingClientRect().x

  let parsedX = x + toolTipMargin
  if (parsedX > widthEl / 2 + toolTipMargin * 2 + offset)
    parsedX = parsedX - toolTipWidth - toolTipMargin

  tooltip.style('left', `${parsedX}px`).style('top', `${y + toolTipMargin}px`)
}

function mouseOut(d) {
  tooltip.style('visibility', 'hidden')
}

/// Read google spreadsheet/////

google.charts.load('current')
google.charts.setOnLoadCallback(init)

function init() {
  const url =
    'https://docs.google.com/spreadsheets/d/1-VPpzGkNtvzGPCw8MkZg_bxoBGbooKAg/edit#gid=1374426940'
  const query = new google.visualization.Query(url)
  query.setQuery('select A, B, C, D, E, F, G')
  query.send(processSheetsData)
}
function processSheetsData(response) {
  const array = []
  const data = response.getDataTable()
  const columns = data.getNumberOfColumns()
  const rows = data.getNumberOfRows()
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < columns; c++) {
      row.push(data.getFormattedValue(r, c))
    }
    array.push({
      date: row[0],
      race: row[1],
      cases: +row[2],
      deaths: +row[3],
      population: +row[4],
      pctCases: +row[5],
      pctDeaths: +row[6]
    })
  }
  renderData(array)
}

function renderData(data) {
  // create datetime///
  data.forEach(d => {
    d.datetime = parseDate(d.date)
  })

  data = data.filter(d => d.race !== 'Multiracial')

  /// map each column////
  const dates = data.map(d => d.datetime)
  const pctDeaths = data.map(d => +d.pctDeaths)
  // console.log(data)

  /// update Scales////
  xScale.domain(d3.extent(dates))
  yScale.domain([0, d3.max(pctDeaths) + 5])

  /// Make thin barcharts for daily cases///

  const nested = d3
    .nest()
    .key(function(d) {
      return d.race
    })
    .entries(data.filter(d => d.race !== 'Pacific Islander'))

  // console.log(nested)

  const line = d3
    .line()
    .x(d => xScale(d.datetime))
    .y(d => yScale(+d.pctDeaths))

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'raceLine')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', '#b185db')
    .attr('stroke-width', 4)
    .attr('fill', 'none')

  svg
    .selectAll('circle')
    .data(data.filter(d => d.race !== 'Pacific Islander'))
    .enter()
    .append('circle')
    .attr('class', 'dummyCircles')
    .attr('r', 8)
    .attr('fill', '#9e4b6c')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(+d.pctDeaths))
    .attr('opacity', 0)

  // draw axis

  const yOptions = d3
    .axisLeft(yScale)
    .tickPadding(15)
    .ticks(5)
  const yAxis = svg.append('g').attr('class', 'axis y-axis')

  const xOptions = d3.axisBottom(xScale)
  const xAxis = svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')

  /// /text labels////////////////////////////////
  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'raceLabel')
    .attr('font-size', '14')
    .attr('font-weight', 'bold')
    .attr('fill', '#5465ff')
    .text(d => d.key)

  svg
    .append('text')
    .attr('class', 'headline')
    .text('Total deaths by race per 100k in Kentucky')
    .attr('font-size', '18')
    .attr('font-weight', 'bold')
    // .attr('fill', 'orange')
    .attr('text-anchor', 'start')

  /// render function///
  function render() {
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    // Do you want it to be full height? Pick one of the two below
    const svgHeight = height + margin.top + margin.bottom
    // const svgHeight = window.innerHeight

    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)

    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    // Update our scale
    xScale.range([0, newWidth])
    yScale.range([newHeight, 0])

    line.x(d => xScale(d.datetime)).y(d => yScale(+d.pctDeaths))

    svg
      .selectAll('.raceLine')
      .data(nested)
      .attr('d', function(d) {
        return line(d.values)
      })

    svg
      .selectAll('.dummyCircles')
      .attr('cx', d => xScale(d.datetime))
      .attr('cy', d => yScale(+d.pctDeaths))
      .on('mouseover', d => mouseOver(d))
      .on('mousemove', d => mouseMove(d, svgWidth))
      .on('mouseout', d => mouseOut(d))

    // update axis//

    yAxis
      .call(
        yOptions
          .tickSizeInner(-newWidth)
          .tickPadding(15)
          .ticks(8)
      )
      .call(g => g.select('.domain').remove())
      .lower()

    xAxis
      .call(
        xOptions
          .ticks(newWidth / 100)
          .tickPadding(15)
          .tickFormat(d3.timeFormat('%b %d'))
      )
      .call(g => g.select('.domain').remove())

    // update avgerage label

    svg
      .selectAll('.raceLabel')
      .attr('y', function(d) {
        return yScale(+d.values[5].pctDeaths)
      })
      .attr('x', function(d) {
        return newWidth / 2
      })
      .attr('dx', 0)
      .attr('dy', function(d) {
        if (d.key === 'White') {
          return 60
        }
        if (d.key === 'Black') {
          return 30
        }
        if (d.key === 'American Indian') {
          return 30
        } else {
          return 0
        }
      })

    svg
      .selectAll('.headline')
      .attr('x', function(d) {
        if (newWidth > 400) {
          return margin.right
        } else {
          return -margin.right - 30
        }
      })
      .attr('y', margin.top - 30)
      .text(function(d) {
        if (newWidth < 400) {
          return 'Total deaths by race per 100k in KY'
        } else {
          return 'Total deaths by race per 100k in Kentucky'
        }
      })
      .attr('font-size', '16')

    //   // send the height to our embed
    if (pymChild) pymChild.sendHeight()
  }

  // // kick off the graphic and then listen for resize events
  render()
  window.addEventListener('resize', render)

  // // for the embed, don't change!
  if (pymChild) pymChild.sendHeight()
  pymChild = new pym.Child({ polling: 200, renderCallback: render })
}
