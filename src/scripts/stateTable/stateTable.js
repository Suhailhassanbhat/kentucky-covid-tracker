import * as d3 from 'd3'

const el = d3.select('#state-table')

d3.csv(
  'https://raw.githubusercontent.com/louisvillepublicmedia/COVID-Data/main/cdcCovidDataByState.csv'
).then(ready)

function ready(data) {
  const format = d3.format('.2s')
  const commaFormat = d3.format(',')
  const filteredData = data.filter(d => d['State Abbreviation'] === 'KY')

  // console.log(filteredData)

  const fixedData = filteredData.map(function(d) {
    return {
      cases: commaFormat(d['Cumulative cases']),
      deaths: commaFormat(d['Cumulative deaths']),
      positivityRate: +format(
        d[
          'Viral (RT-PCR) lab test positivity rate - last 7 days (may be an underestimate due to delayed reporting)'
        ] * 100
      ),
      dosesAdministered: commaFormat(d['Doses administered']),
      dosesAdministeredPer100k: commaFormat(
        d['Doses administered per 100k population']
      ),
      dosesDistributed: commaFormat(d['Doses distributed']),
      dosesDistributedPer100k: commaFormat(
        d['Doses distributed per 100k population']
      ),
      percentfirstDose: +format(
        d['People initiating vaccination as % of total population'] * 100
      ),
      percenttwoDoses: +format(
        d['People with full course administered as % of total population'] * 100
      )
    }
  })

  // fixedData.sort((a, b) => d3.descending(+a.icusOccupied, +b.icusOccupied))

  const columns = [
    {
      head: 'Cases',
      cl: 'data-key',
      html: function(d) {
        return d.cases
      }
    },
    {
      head: 'Deaths',
      cl: 'data-key',
      html: function(d) {
        return d.deaths
      }
    },
    {
      head: 'Positivity (last 7 days)',
      cl: 'data-key',
      html: function(d) {
        return +d.positivityRate
      }
    }
  ]

  const table = el.append('table').attr('class', 'table')

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
      if (d.head === 'Positivity (last 7 days)') {
        return d.html + '%'
      } else {
        return d.html
      }
    })
    .attr('class', d => d.cl)
    .attr('font-size', 14)
}
