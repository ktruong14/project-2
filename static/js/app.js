const spotifyurl = "/api/v1.0/spotify"
const uniurl = "/api/v1.0/uni"

const spotifytbody = d3.select("#spotify-table").select("tbody");
const unitbody = d3.select("#uni-table").select("tbody");

function buildSpotifyTable() {

  d3.json(spotifyurl).then(function(response){

    // var countries = response.country;

    const data = response

    spotifytbody.html("")

    data.forEach((dataRow) => {
      
      var count = "Australia"
      
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
        // console.log(rank)
        // console.log(artist)
        // console.log(song_title)
         console.log(newData)
          }
        }
      );
    });
  };
  
function buildUniTable() {

  d3.json(uniurl).then(function(response){

    const data = response

    unitbody.html("")
  

    data.forEach((dataRow) => {

      var row = unitbody.append("tr");

      Object.values(dataRow).forEach((val) => {
        let cell = row.append("td");
          cell.text(val);
        }
      );
    });
  })
};

//     Plotly.newPlot("bubble", bubbleData, bubbleLayout);

//     var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
//     var barData = [
//       {
//         y: yticks,
//         x: sample_values.slice(0, 10).reverse(),
//         text: otu_labels.slice(0, 10).reverse(),
//         type: "bar",
//         orientation: "h",
//       }
//     ];

//     var barLayout = {
//       title: "Top 10 Bacteria Cultures Found",
//       margin: { t: 30, l: 150 }
//     };

//     Plotly.newPlot("bar", barData, barLayout);
//   });
// }

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
    });
  });
};

init()
buildSpotifyTable();
buildUniTable();

// function optionChanged(newCountry) {
//   // Fetch new data each time a new country is selected
//   buildCharts(newCountry);
// }

// // Initialize the dashboard
// init();
