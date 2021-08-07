import * as d3 from 'd3'

const el = d3.select('#embed-table')

d3.csv(
  'https://raw.githubusercontent.com/louisvillepublicmedia/COVID-Data/main/latest-cdc-covid-data-by-county.csv'
).then(ready)

function ready(data) {
  const format = d3.format('.2s')
  const filteredData = data.filter(d => d['State Abbreviation'] === 'KY')

  const fixedData = filteredData.map(function(d) {
    return {
      County: d.County.replace(/County, KY/g, ''),
      bedsOccupied: +format(d['% inpatient beds occupied'] * 100),
      icusOccupied: +format(d['% staffed adult ICU beds occupied'] * 100),
      bedsCovidOccupied: +format(
        d['% inpatient beds occupied by COVID-19 patient'] * 100
      ),
      icusCovidOccupied: +format(
        +d['% staffed adult ICU beds occupied by COVID-19 patient'] * 100
      )
    }
  })

  fixedData.sort((a, b) => d3.descending(+a.icusOccupied, +b.icusOccupied))

  const columns = [
    {
      head: 'County',
      cl: 'title',
      html: function(d) {
        return d.County
      }
    },
    {
      head: 'ICUs Occupied',
      cl: 'num',
      html: function(d) {
        return +d.icusOccupied
      }
    },
    {
      head: 'Beds Occupied',
      cl: 'num',
      html: function(d) {
        return +d.bedsOccupied
      }
    },
    {
      head: 'ICUs Used by Covid patients',
      cl: 'num',
      html: function(d) {
        return +d.icusCovidOccupied
      }
    },
    {
      head: 'Beds Used by Covid patients',
      cl: 'num',
      html: function(d) {
        return +d.bedsCovidOccupied
      }
    }
  ]

  const table = el.append('table').attr('class', 'table table-sortable')

  const thead = table.append('thead').append('tr')

  const headers = thead
    .selectAll('th')
    .data(columns)
    .join('th')
    .attr('class', d => d.cl)
    .text(d => d.head)

  const rows = table
    .append('tbody')
    .selectAll('tr')
    .data(fixedData.filter(d => d.bedsOccupied !== 0))
    .enter()
    .append('tr')

  rows
    .selectAll('td')
    .data(function(row, i) {
      // evaluate column objects against the current row
      return columns.map(function(c) {
        const cell = {}
        d3.keys(c).forEach(function(k) {
          cell[k] = typeof c[k] === 'function' ? c[k](row, i) : c[k]
        })
        return cell
      })
    })
    .join('td')
    .html(function(d) {
      if (d.head === 'County') {
        return d.html
      } else {
        return d.html + '%'
      }
    })
    .attr('class', d => d.cl)
    .attr('font-size', 14)

  $('table').tablesorter()

}