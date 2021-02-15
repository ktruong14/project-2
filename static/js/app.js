const spotifyurl = "/api/v1.0/spotify"
const uniurl = "/api/v1.0/uni"
const ramenurl = "/api/v1.0/ramen"

const spotifytbody = d3.select("#spotify-table").select("tbody");
const unitbody = d3.select("#uni-table").select("tbody");


//Spotify table function//
function buildSpotifyTable(count) {

  d3.json(spotifyurl).then(function(response){

    const data = response

    spotifytbody.html("")

    data.forEach((dataRow) => {
      
      
      var row = spotifytbody.append("tr");

      if (dataRow.country == count){
        var rank = dataRow.rank
        var artist = dataRow.artist
        var song_title = dataRow.song_title
        var streams = dataRow.streams

        var newData = [];

        newData.push({
          "Rank": rank,
          "Artist": artist,
          "Song_Title" : song_title,
          "Streams": streams
        })


        Object.values(newData[0]).forEach((val) => {
          var cell = row.append("td");
          cell.text(val);
            })
          }
        });
      });
    };
  

//University table function//
function buildUniTable(count) {

  d3.json(uniurl).then(function(response){

    const data = response

    unitbody.html("")
  

    data.forEach((dataRow) => {
      var row = unitbody.append("tr");

      if (dataRow.country == count){
        var rank = dataRow.national_rank
        var university = dataRow.institution

        var newData = [];

        newData.push({
          "Rank": rank,
          "University": university
        })
        
        Object.values(newData[0]).forEach((val) => {
          var cell = row.append("td");
          cell.text(val);
            })
          }
        });
      });
    };

//Bar chart for ramen
function buildRamenChart(count) {
  d3.json(ramenurl).then(function(response){

    const data = response
    var resultArray = data.filter(countObj => countObj.country == count)

    brand = []
    variety = []
    brand_variety = []
    stars = []

    var str1 = ": "

    for (i = 0; i < resultArray.length; ++i) {
      
      brand.push(resultArray[i].brand)
      variety.push(resultArray[i].variety)
      brand_variety.push(resultArray[i].brand.concat(str1, resultArray[i].variety))
      stars.push(resultArray[i].stars)
    }

    var yticks = brand_variety.slice(0, 10).map(brand_variety => `${brand_variety}`).sort();
    var barData = [
      {
        y: yticks,
        x: stars.slice(0, 10).sort(),
        text: brand_variety.slice(0, 10).sort(),
        textposition: 'auto',
        hoverinfo: 'none',
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      title: "Top 10 Rated Ramen",
      // hovermode : false,
      yaxis: {autorange: true,
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false},
      xaxis: {title: "Star Rating"},
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

  });
};

function buildmap(count) {
  const width = 900;
  const height = 400;
  
  const svg = d3.select('svg').attr('width', width).attr('height', height);
  
  const projection = d3.geoMercator().scale(100)
      .translate([width / 2, height / 1.4]);
  const path = d3.geoPath(projection);
  
  const g = svg.append('g');
  
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(data => {
  
          const countries = topojson.feature(data, data.objects.countries);
          
          g.selectAll('path')
          .data(countries.features)
          .enter().append('path')
          .attr('id', function(d) {return d.properties.name.replace(" ", "").replace(" ", "").replace(" ", "")})
          .attr('d', path);

          // if (count == "USA") {
          // d3.select("#UnitedStatesofAmerica").attr("fill", "#FF0000") 
        // } 
        // else {
          d3.select("#" + count).attr("fill", "#FF0000")
        // }
        console.log("#" + count)
      });
    };
  
//Get unqiue list of countries    
function getUnique(arr, comp) {

  // store the comparison  values in array
  const unique =  arr.map(e => e[comp])

  // store the indexes of the unique objects
  .map((e, i, final) => final.indexOf(e) === i && i)

  // eliminate the false indexes & return unique objects
  .filter((e) => arr[e]).map(e => arr[e]);

return unique;
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of unique countries to populate the select options
  d3.json(spotifyurl).then(function(response){
    var unqiuecountries = this.getUnique(response, "country");

    country = []

      for (i = 0; i < unqiuecountries.length; ++i) {
        country.push(unqiuecountries[i].country)
      }
    
    country.forEach((country) => {
      selector
        .append("option")
        .text(country)
        .property("value", country);
  
  //Initial graph
  var firstCountry = "USA";
  buildSpotifyTable(firstCountry);
  buildUniTable(firstCountry);
  buildRamenChart(firstCountry);
  buildmap(firstCountry)
    });
  });
};


function optionChanged(newCountry) {
  // Fetch new data each time a new country is selected
  buildSpotifyTable(newCountry);
  buildUniTable(newCountry);
  buildRamenChart(newCountry);
  buildmap(newCountry);
}

// Initialize the dashboard
init();

