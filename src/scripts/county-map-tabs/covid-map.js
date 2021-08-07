import * as d3 from 'd3'
const pymChild = new pym.Child()

/// /MAP STARTS HERE////////////////////////////////
mapboxgl.accessToken =
  'pk.eyJ1Ijoic3VoYWlsLWJoYXQiLCJhIjoiY2tpbWxzbnZ1MGRqejJ4bncwNHl4anUzaiJ9.NsWEhUt8IvcwkFyDOh9h7g'
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/suhail-bhat/ckjtiews90dfi19tchb7rj1hx',
  center: [0, -2],
  minZoom: 2.5,
  zoom: 4,
  trackResize: true,
  dragRotate: false,
  touchZoomRotate: true,
  scrollZoom: false
})

map.boxZoom.enable()
// map.dragPan.disable()
const zoomThreshold = 4

const bbox = [
  [-21, -13.16062104865046],
  [20.715666482029366, 12.7636595]
]
map.fitBounds(bbox)

map.addControl(
  new mapboxgl.NavigationControl({ showCompass: false }),
  'top-right'
)
map.addControl(new mapboxgl.FullscreenControl(), 'top-right')

map.on('load', function() {
  d3.csv(
    'https://raw.githubusercontent.com/louisvillepublicmedia/COVID-Data/main/latest-cdc-covid-data-by-county.csv'
  ).then(data => {
    map.addSource('counties', {
      type: 'vector',
      url: 'mapbox://suhail-bhat.azv5ve1t',
      promoteId: 'GEOID'
    })
    data.forEach(row => {
      const format = d3.format('.2s')
      const format1 = d3.format(',')
      map.setFeatureState(
        {
          source: 'counties',
          sourceLayer: 'uscountiesfilterwithid',
          id: row.county_fips
        },
        {
          casesper100k: format(row['Cases per 100k - last 7 days'] / 7),
          fullCountyName: row.County,
          avgdailycases: format(row['Cases - last 7 days'] / 7),
          avgdailydeaths: row['Deaths - last 7 days'],
          deathsper100k: row['Deaths per 100k - last 7 days'],
          pctchangeincasesfrompreviousweek: format(
            row['Cases - % change'] * 100
          ),
          pctchangeindeathsfrompreviousweek: format(
            row['Deaths - % change'] * 100
          ),
          cumulativecases: format1(row['Cumulative cases']),
          cumulativedeaths: format1(row['Cumulative deaths']),
          daysofdownwardtrajectory:
            row['Number of days of downward case trajectory'],
          sustainedhostpots: row['Area of Concern Category'],
          rapidriser: row['Rapid Riser Category'],
          positivityrate:
            row[
              'Viral (RT-PCR) lab test positivity rate - last 7 days (may be an underestimate due to delayed reporting)'
            ] * 100,
          covidhospitalized: row['Confirmed COVID-19 admissions - last 7 days'],
          testsper100k:
            row[
              'RT-PCR tests per 100k - last 7 days (may be an underestimate due to delayed reporting)'
            ],
          hotspots: row['Area of Concern Category']
        }
      )
    })
    map.addLayer({
      id: 'Hot spots',
      type: 'fill',
      source: 'counties',
      'source-layer': 'uscountiesfilterwithid',
      layout: { visibility: 'none' },
      paint: {
        'fill-color': [
          'case',
          ['!=', ['feature-state', 'casesper100k'], null],
          [
            'interpolate',
            ['linear'],
            ['to-number', ['feature-state', 'casesper100k']],
            0,
            '#D3D3D3',
            1,
            '#f2df91',
            10,
            '#f9c467',
            20,
            '#ffa93e',
            30,
            '#ff8b25',
            40,
            '#fd6a0b',
            50,
            '#f04f08',
            60,
            '#d8382e',
            70,
            '#c62832',
            80,
            '#af1c43',
            100,
            '#8a1739',
            200,
            '#701547',
            250,
            '#4c0d3e'
          ],
          '#000000'
        ]
      }
    })

    map.addLayer({
      id: 'Positivity',
      type: 'fill',
      source: 'counties',
      'source-layer': 'uscountiesfilterwithid',
      layout: { visibility: 'none' },
      paint: {
        'fill-color': [
          'case',
          ['!=', ['feature-state', 'positivityrate'], null],
          [
            'interpolate',
            ['linear'],
            ['to-number', ['feature-state', 'positivityrate']],
            0,
            '#D3D3D3',
            5,
            '#ffd500',
            10,
            '#FFBA08',
            15,
            '#FAA307',
            20,
            '#F48C06',
            25,
            '#E85D04',
            30,
            '#DC2F02',
            35,
            '#D00000',
            40,
            '#9D0208',
            45,
            '#6A040F'
          ],
          '#000000'
        ]
      }
    })
    map.addLayer({
      id: 'Testing',
      type: 'fill',
      source: 'counties',
      'source-layer': 'uscountiesfilterwithid',
      layout: { visibility: 'none' },
      paint: {
        'fill-color': [
          'case',
          ['!=', ['feature-state', 'testsper100k'], null],
          [
            'interpolate',
            ['linear'],
            ['to-number', ['feature-state', 'testsper100k']],
            0,
            '#D3D3D3',
            1000,
            '#ffd500',
            2000,
            '#FFBA08',
            3000,
            '#FAA307',
            4000,
            '#F48C06',
            5000,
            '#E85D04',
            6000,
            '#DC2F02',
            7000,
            '#D00000',
            8000,
            '#9D0208',
            9000,
            '#6A040F'
          ],
          '#000000'
        ]
      }
    })

    map.addLayer({
      id: 'Spread',
      type: 'fill',
      source: 'counties',
      'source-layer': 'uscountiesfilterwithid',
      layout: { visibility: 'visible' },
      paint: {
        'fill-color': [
          'match',
          ['feature-state', 'hotspots'],
          'Low Burden',
          '#ffffcc',
          'Moderate Burden',
          '#fed976',
          'Emerging Hotspot',
          '#feb24c',
          'Moderate Burden Resolving',
          '#fd8d3c',
          'High Burden Resolving',
          '#fc4e2a',
          'Hotspot',
          '#e31a1c',
          'Sustained Hotspot',
          '#bd0026',
          '#000000'
        ],
        'fill-opacity': 0.9
      }
    })
    map.addLayer({
      id: 'counties-label',
      type: 'symbol',
      source: 'counties',
      'source-layer': 'uscountiesfilterwithid',
      minzoom: 6,
      layout: {
        'text-field': ['get', 'NAME'],
        'text-offset': [0, 0.6],
        'text-anchor': 'top',
        'text-size': 10
      },
      paint: {
        'text-color': '#FFFFFF'
      }
    })
    map.addLayer({
      id: 'counties-line',
      type: 'line',
      source: 'counties',
      'source-layer': 'uscountiesfilterwithid',
      minzoom: 5,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffffff',
        'line-width': 0.1
      }
    })
    map.addSource('states', {
      type: 'vector',
      url: 'mapbox://suhail-bhat.akp21a47',
      promoteId: 'STATEFP'
    })
    map.addLayer({
      id: 'state-line',
      type: 'line',
      source: 'states',
      'source-layer': 'albersusa',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffffff',
        'line-width': 0.5
      }
    })
    map.addSource('state-labels', {
      type: 'vector',
      url: 'mapbox://suhail-bhat.0kryl6co',
      promoteId: 'STUSPS'
    })
    map.addLayer({
      id: 'states-label',
      type: 'symbol',
      source: 'state-labels',
      'source-layer': 'us-states-labels-6ljsgs',
      layout: {
        'text-field': ['get', 'STUSPS'],
        'text-offset': [0, -1],
        'text-anchor': 'top',
        'text-size': 12
      },
      paint: {
        'text-color': '#FFFFFF'
      }
    })
    /// ///mouseover effects here //////////////////////////////////
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false
    })

    map.on('mousemove', 'Hot spots', function(e) {
      map.getCanvas().style.cursor = 'pointer'
      const counties = map.queryRenderedFeatures(e.point, {
        layers: ['Hot spots']
      })

      const props = counties[0].properties
      const state = counties[0].state
      // console.log(state)

      let content = '<b>' + state.fullCountyName + '</b>' + '<br>'
      content += '––––––––––––––––––––––––––––' + '<br>'
      content +=
        'Hot spot: ' + state.rapidriser + ' ' + state.sustainedhostpots + '<br>'
      content +=
        'Days of downward trajectory: ' +
        state.daysofdownwardtrajectory +
        '<br>'
      content += '––––––––––––––––––––––––––––' + '<br>'
      content += 'Avg. daily cases per 100k: ' + state.casesper100k + '<br>'
      content +=
        'Weekly change in cases: ' +
        state.pctchangeincasesfrompreviousweek +
        '%' +
        '<br>'
      content += '––––––––––––––––––––––––––––' + '<br>'
      content += 'Cumulative cases: ' + state.cumulativecases + '<br>'
      content += 'Cumulative deaths: ' + state.cumulativedeaths + '<br>'

      popup
        .setLngLat(e.lngLat)
        .setHTML(content)
        .addTo(map)
    })

    map.on('mouseleave', 'Hot spots', function() {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    map.on('mousemove', 'Positivity', function(e) {
      map.getCanvas().style.cursor = 'pointer'
      const counties = map.queryRenderedFeatures(e.point, {
        layers: ['Positivity']
      })

      const props = counties[0].properties
      const state = counties[0].state

      let content = '<b>' + state.fullCountyName + '</b>' + '<br>'
      content += '––––––––––––––––––––––––––––' + '<br>'
      content +=
        'Positivity rate in past week: ' + state.positivityrate + '%' + '<br>'
      content += 'Cumulative cases: ' + state.cumulativecases + '<br>'
      content += 'Cumulative deaths: ' + state.cumulativedeaths + '<br>'

      popup
        .setLngLat(e.lngLat)
        .setHTML(content)
        .addTo(map)
    })

    map.on('mouseleave', 'Positivity', function() {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    map.on('mousemove', 'Spread', function(e) {
      map.getCanvas().style.cursor = 'pointer'
      const counties = map.queryRenderedFeatures(e.point, {
        layers: ['Spread']
      })
      const props = counties[0].properties
      const state = counties[0].state
      let content = '<b>' + state.fullCountyName + '</b>' + '<br>'
      content += '––––––––––––––––––––––––––––' + '<br>'
      content +=
        'Hot spot: ' + state.rapidriser + ' ' + state.sustainedhostpots + '<br>'
      content +=
        'Days of downward trajectory: ' +
        state.daysofdownwardtrajectory +
        '<br>'
      content += '––––––––––––––––––––––––––––' + '<br>'
      content += 'Avg. daily cases per 100k: ' + state.casesper100k + '<br>'
      popup
        .setLngLat(e.lngLat)
        .setHTML(content)
        // .setMaxWidth('240px')
        .addTo(map)
    })

    map.on('mouseleave', 'Spread', function() {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    map.on('mousemove', 'Testing', function(e) {
      map.getCanvas().style.cursor = 'pointer'
      const counties = map.queryRenderedFeatures(e.point, {
        layers: ['Testing']
      })

      const props = counties[0].properties
      const state = counties[0].state

      let content = '<b>' + state.fullCountyName + '</b>' + '<br>'
      content += '––––––––––––––––––––––––––––' + '<br>'
      content +=
        'Viral tests per 100k in past week: ' + state.testsper100k + '<br>'
      content +=
        'Positivity rate in past week: ' + state.positivityrate + '%' + '<br>'

      popup
        .setLngLat(e.lngLat)
        .setHTML(content)
        .addTo(map)
    })

    map.on('mouseleave', 'Testing', function() {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    const toggleableLayerIds = [
      'Spread',
      'Hot spots',
      'Positivity',
      'Testing'    ]
    // set up the corresponding toggle button for each layer
    for (let i = 0; i < toggleableLayerIds.length; i++) {
      const id = toggleableLayerIds[i]

      const link = document.createElement('a')
      link.href = '#'
      link.className = 'active'
      link.textContent = id

      link.onclick = function(e) {
        const clickedLayer = this.textContent
        e.preventDefault()
        e.stopPropagation()

        for (let j = 0; j < toggleableLayerIds.length; j++) {
          if (clickedLayer === toggleableLayerIds[j]) {
            layers.children[j].className = 'active'
            map.setLayoutProperty(
              toggleableLayerIds[j],
              'visibility',
              'visible'
            )
            document.getElementById(toggleableLayerIds[j]).style.display =
              'inline-block'
          } else {
            layers.children[j].className = ''
            map.setLayoutProperty(toggleableLayerIds[j], 'visibility', 'none')
            document.getElementById(toggleableLayerIds[j]).style.display =
              'none'
          }
        }
      }
      const layers = document.getElementById('layers-toggled')
      layers.appendChild(link)
    }
  })
  pymChild.sendHeight()
})
