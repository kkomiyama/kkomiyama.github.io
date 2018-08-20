google.charts.load('current', {
    'packages':['geochart'],
    // Note: you will need to get a mapsApiKey for your project.
    // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
    'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
  });
  google.charts.setOnLoadCallback(drawRegionsMap);

  function drawRegionsMap() {
    var data = google.visualization.arrayToDataTable([
      ['Country', 'Popularity'],
      ['United States', 10],
      ['Canada', 5],
      ['Brazil', 1],
      ['Guam', 3], //guam
      ['Puerto Rico', 2], //Puerto Rico    
// // Europe
      ['Austria', 3],
      ['Slovakia', 1],
      ['GB', 5],
      ['France', 2],
      ['Germany', 5],
      ['CH', 1],
      ['CZ', 1],
      ['SE', 1], //sweden
      ['Spain', 2], //spain
      ['Estonia', 2], //estonia
      ['BE', 2],
      ['TR', 4], //Turkey
      ['IE', 1], //Ireland
// // Asia
      ['HK', 3],
      ['VN', 2],
      ['AU', 2],
      ['CN', 5],
      ['BN', 1],
      ['ID', 5],
      ['KR', 7],
      ['Myanmar', 2],
      ['Mongolia', 2],
      ['Macau', 2],
      ['MY', 6],
      ['Singapore', 4],
      ['Thailand', 5],
      ['TW', 3],
      ['LA', 2],
      ['IN', 1],
      ['KH', 1],
      ['PH', 2],
      ['FJ', 3],
// // africa
      ['SD', 1],
      ['KE', 3],
      ['TZ', 1], //tanzania
      ['ZM', 1], //Zambia
      ['ET', 3], //Ethiopia
      ['MU', 2], //mauritius
      ['CI', 1], //ivory corst
      ['GM', 1], //gambia
      ['GH', 1], //ghana
      ['CM', 1],
      ['South Africa', 3], //South Africa
      ['DJ', 1], //Djibouti
      ['GN', 1], //ginia
      ['SN', 1], //Senegal
      ['CG', 1], //republic of congo
      ['BW', 1], //Botswana
      ['MA', 1], //Morocco
      ['MA', 1], //Morocco          
// // Middle east
      ['IL', 1],
      ['AE', 1],
      ['SA', 1], //Saudi Arabia
      // Japan
      ['Japan', 0]    
    ]);

    var options = {};

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(data, options);
  }