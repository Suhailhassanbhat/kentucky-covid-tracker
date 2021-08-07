import * as d3 from 'd3'
let pymChild
const margin = { top: 10, left: 60, right: 20, bottom: 60 }
const height = 540 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#dailyCases')
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
const zScale = d3.scaleLinear().range([height, 0])

/// /tooltip////////////////////////////////
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
      )}</b></br> Daily cases: ${commaFormat(
        +d.new_cases
      )} </br> 7-day average: ${numberFormat(+d.avg_cases)}</div>`
    )
}

function mouseMove(d, widthEl) {
  const x = d3.event.pageX
  const y = d3.event.pageY
  const toolTipWidth = tooltip.node().getBoundingClientRect().width
  const toolTipMargin = 10
  const offset = d3
    .select('#dailyCases')
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

d3.csv('https://raw.githubusercontent.com/Suhailhassanbhat/Covid_Data_Scraper/main/data/daily_report.csv').then(ready)

function ready(data) {

  data.forEach(d => {
    d.datetime = parseDate(d.date)
  })

  /// map each column////
  const dates = data.map(d => d.datetime)
  const dailyCases = data.map(d => +d.new_cases)
  const avgDailyCases = data.map(d => (+d.avg_cases))

  /// update Scales////
  xScale.domain(d3.extent(dates))
  yScale.domain([0, d3.max(dailyCases) + 1000])

  /// Make thin barcharts for daily cases///

  svg
    .append('g')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'daily-cases-bars')
    .attr('x', d => xScale(d.datetime))
    .attr('y', d => yScale(+d.new_cases))
    .attr('width', width / dates.length - 0.2)
    .attr('height', d => height - yScale(+d.new_cases))
    .attr('fill', 'orange')

  svg
    .append('g')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'dummy-bars')
    .attr('fill', 'indianred')
    .attr('opacity', 0)

  /// draw avg line////////////////////////////////
  svg
    .append('path')
    .attr('class', 'weeklyAvgLine')
    .datum(data)
    .attr(
      'd',
      d3
        .line()
        .x(d => xScale(d.datetime))
        .y(d => yScale(+d.avg_cases))
    )
    .attr('stroke', 'indianred')
    .attr('stroke-width', 4)
    .attr('fill', 'none')

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
    .append('text')
    .attr('class', 'avgLabel')
    .text('7-day average')
    .attr('font-size', '14')
    .attr('font-weight', 'bold')
    .attr('fill', 'indianred')

  svg
    .append('text')
    .attr('class', 'label')
    .text('Daily cases')
    .attr('font-size', '14')
    .attr('font-weight', 'bold')
    .attr('fill', 'orange')
    .attr('text-anchor', 'end')

  svg
    .append('text')
    .attr('class', 'headline')
    .text('Positive cases per day in Kentucky')
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

    // update bars

    svg
      .selectAll('.daily-cases-bars')
      .attr('x', d => xScale(d.datetime))
      .attr('y', d => yScale(+d.new_cases))
      .attr('width', newWidth / dates.length - 0.2)
      .attr('height', d => newHeight - yScale(+d.new_cases))
    svg
      .selectAll('.dummy-bars')
      .attr('x', d => xScale(d.datetime))
      .attr('y', margin.top + 30)
      .attr('width', newWidth / dates.length)
      .attr('height', newHeight - margin.top - 30)
      .on('mousemove', d => mouseMove(d, svgWidth))
      .on('mouseover', function(d) {
        mouseOver(d)
        d3.select(this).style('opacity', 0.8)
      })
      .on('mouseout', function(d) {
        mouseOut(d)
        d3.select(this).style('opacity', 0)
      })

    // update lines
    svg.selectAll('.weeklyAvgLine').attr(
      'd',
      d3
        .line()
        .x(d => xScale(d.datetime))
        .y(d => yScale(+d.avg_cases))
    )

    // update axis//

    yAxis
      .call(
        yOptions
          .tickSizeInner(-newWidth)
          .tickPadding(15)
          .ticks(5)
      )
      .call(g => g.select('.domain').remove())
      .lower()

    xAxis
      .call(
        xOptions
          .ticks(newWidth / 50)
          .tickPadding(15)
          .tickFormat(d3.timeFormat('%b %y'))
      )
      .call(g => g.select('.domain').remove())

    // update avgerage label

    svg
      .selectAll('.avgLabel')
      .attr('x', newWidth / 15)
      .attr('y', newHeight - 30)

    svg
      .selectAll('.label')
      .attr('x', xScale(parseDate('2021-01-05')))
      .attr('y', newHeight / 3)

    svg
      .selectAll('.headline')
      .attr('x', function(d) {
        if (newWidth > 400) {
          return margin.right
        } else {
          return -margin.right - 30
        }
      })
      .attr('y', margin.top + 15)
      .text(function(d) {
        if (newWidth < 400) {
          return 'Positive cases per day in Kentucky'
        } else {
          return 'Positive cases per day in Kentucky'
        }
      })

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
