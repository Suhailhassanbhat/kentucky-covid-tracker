// import * as d3 from 'd3'

// mapboxgl.accessToken =
//   'pk.eyJ1Ijoic3VoYWlsLWJoYXQiLCJhIjoiY2tpbWxzbnZ1MGRqejJ4bncwNHl4anUzaiJ9.NsWEhUt8IvcwkFyDOh9h7g'
// const map = new mapboxgl.Map({
//   container: 'map',
//   style: 'mapbox://styles/suhail-bhat/ckjtiews90dfi19tchb7rj1hx',
//   center: [0, -2],
//   minZoom: 2,
//   zoom: 4,
//   trackResize: true,
//   dragRotate: false,
//   touchZoomRotate: true,
//   scrollZoom: false
// })

// map.boxZoom.enable()
// // map.dragPan.disable()

// map.addControl(
//   new mapboxgl.NavigationControl({ showCompass: false }),
//   'top-right'
// )
// map.addControl(new mapboxgl.FullscreenControl(), 'top-right')

// map.on('load', function() {
//   d3.csv(
//     'https://raw.githubusercontent.com/louisvillepublicmedia/COVID-Data/main/latest-cdc-covid-data-by-county.csv'
//   ).then(data => {
//     map.addSource('counties', {
//       type: 'vector',
//       url: 'mapbox://suhail-bhat.azv5ve1t',
//       promoteId: 'GEOID'
//     })
//     data.forEach(row => {
//       const format = d3.format('.2s')
//       const format1 = d3.format(',')
//       map.setFeatureState(
//         {
//           source: 'counties',
//           sourceLayer: 'uscountiesfilterwithid',
//           id: row.county_fips
//         },
//         {
//           casesper100k: format(row['Cases per 100k - last 7 days'] / 7),
//           fullCountyName: row.County,
//           avgdailycases: format(row['Cases - last 7 days'] / 7),
//           avgdailydeaths: row['Deaths - last 7 days'],
//           deathsper100k: row['Deaths per 100k - last 7 days'],
//           pctchangeincasesfrompreviousweek: format(
//             row['Cases - % change'] * 100
//           ),
//           pctchangeindeathsfrompreviousweek: format(
//             row['Deaths - % change'] * 100
//           ),
//           cumulativecases: format1(row['Cumulative cases']),
//           cumulativedeaths: format1(row['Cumulative deaths']),
//           daysofdownwardtrajectory:
//             row['Number of days of downward case trajectory'],
//           sustainedhostpots: row['Area of Concern Category'],
//           rapidriser: row['Rapid Riser Category'],
//           positivityrate:
//             row[
//               'Viral (RT-PCR) lab test positivity rate - last 7 days (may be an underestimate due to delayed reporting)'
//             ] * 100,
//           covidhospitalized: row['Confirmed COVID-19 admissions - last 7 days'],
//           testsper100k:
//             row[
//               'RT-PCR tests per 100k - last 7 days (may be an underestimate due to delayed reporting)'
//             ],
//           hotspots: row['Area of Concern Category']
//         }
//       )
//     })
//     map.addLayer({
//       id: 'Hot spots',
//       type: 'fill',
//       source: 'counties',
//       'source-layer': 'uscountiesfilterwithid',
//       layout: { visibility: 'visible' },
//       paint: {
//         'fill-color': [
//           'match',
//           ['feature-state', 'hotspots'],
//           'LowBurden',
//           '#ffffcc',
//           'ModerateBurden',
//           '#fed976',
//           'EmergingHotspot',
//           '#feb24c',
//           'ModerateBurdenResolving',
//           '#fd8d3c',
//           'HighBurdenResolving',
//           '#fc4e2a',
//           'Hotspot',
//           '#e31a1c',
//           'SustainedHotspot',
//           '#bd0026',
//           '#000000'
//         ],
//         'fill-opacity': 0.9
//       }
//     })
//     map.addLayer({
//       id: 'counties-label',
//       type: 'symbol',
//       source: 'counties',
//       'source-layer': 'uscountiesfilterwithid',
//       minzoom: 6,
//       layout: {
//         'text-field': ['get', 'NAME'],
//         'text-offset': [0, 0.6],
//         'text-anchor': 'top',
//         'text-size': 10
//       },
//       paint: {
//         'text-color': '#FFFFFF'
//       }
//     })
//     map.addLayer({
//       id: 'counties-line',
//       type: 'line',
//       source: 'counties',
//       'source-layer': 'uscountiesfilterwithid',
//       minzoom: 6,
//       layout: {
//         'line-join': 'round',
//         'line-cap': 'round'
//       },
//       paint: {
//         'line-color': '#ffffff',
//         'line-width': 0.01
//       }
//     })
//     map.addSource('states', {
//       type: 'vector',
//       url: 'mapbox://suhail-bhat.akp21a47',
//       promoteId: 'STATEFP'
//     })
//     map.addLayer({
//       id: 'state-line',
//       type: 'line',
//       source: 'states',
//       'source-layer': 'albersusa',
//       layout: {
//         'line-join': 'round',
//         'line-cap': 'round'
//       },
//       paint: {
//         'line-color': '#ffffff',
//         'line-width': 0.5
//       }
//     })

//     map.addSource('state-labels', {
//       type: 'vector',
//       url: 'mapbox://suhail-bhat.0kryl6co',
//       promoteId: 'STUSPS'
//     })
//     map.addLayer({
//       id: 'states-label',
//       type: 'symbol',
//       source: 'state-labels',
//       'source-layer': 'us-states-labels-6ljsgs',
//       layout: {
//         'text-field': ['get', 'STUSPS'],
//         'text-offset': [0, -1],
//         'text-anchor': 'top',
//         'text-size': 12
//       },
//       paint: {
//         'text-color': '#FFFFFF'
//       }
//     })
//     /// ///mouseover effects here //////////////////////////////////
//     const popup = new mapboxgl.Popup({
//       closeButton: true,
//       closeOnClick: false
//     })

//     map.on('mousemove', 'Hot spots', function(e) {
//       map.getCanvas().style.cursor = 'pointer'
//       const counties = map.queryRenderedFeatures(e.point, {
//         layers: ['Hot spots']
//       })

//       const props = counties[0].properties
//       const state = counties[0].state
//       let content = '<b>' + state.fullCountyName + '</b>' + '<br>'
//       content += '–––––––––––––––––––––––––––––––––––––' + '<br>'
//       content +=
//         'Hot spot: ' + state.rapidriser + ' ' + state.sustainedhostpots + '<br>'
//       content +=
//         'Days of downward trajectory: ' +
//         state.daysofdownwardtrajectory +
//         '<br>'
//       content += '–––––––––––––––––––––––––––––––––––––' + '<br>'
//       content += 'Avg. daily cases per 100k: ' + state.casesper100k + '<br>'
//       content += 'Avg. daily cases: ' + state.avgdailycases + '<br>'
//       content +=
//         'Change in cases from previous week: ' +
//         state.pctchangeincasesfrompreviousweek +
//         '%' +
//         '<br>'
//       content += '–––––––––––––––––––––––––––––––––––––' + '<br>'
//       content += 'Deaths in past week: ' + state.avgdailydeaths + '<br>'
//       content +=
//         'Change in deaths from previous week: ' +
//         state.pctchangeindeathsfrompreviousweek +
//         '%' +
//         '<br>'
//       content += '–––––––––––––––––––––––––––––––––––––' + '<br>'
//       content +=
//         'Positivity rate in past week: ' + state.positivityrate + '%' + '<br>'
//       content += '–––––––––––––––––––––––––––––––––––––' + '<br>'
//       content += 'Cumulative cases: ' + state.cumulativecases + '<br>'
//       content += 'Cumulative deaths: ' + state.cumulativedeaths + '<br>'
//       content += '–––––––––––––––––––––––––––––––––––––' + '<br>'
//       content +=
//         'Confirmed COVID-19 admissions in past week: ' +
//         state.covidhospitalized +
//         '<br>'

//       popup
//         .setLngLat(e.lngLat)
//         .setHTML(content)
//         // .setMaxWidth('350px')
//         .addTo(map)
//     })

//     map.on('mouseleave', 'Hot spots', function() {
//       map.getCanvas().style.cursor = ''
//       popup.remove()
//     })
//     // const bbox = [
//     //   [-24.027421939301178, -13.16062104865046],
//     //   [20.715666482029366, 12.7636595]
//     // ]

//     const bbox = [
//       [-21, -13.16062104865046],
//       [20.715666482029366, 12.7636595]
//     ]
//     map.fitBounds(bbox)
//   })
// })

