var 
priceChart = dc.lineChart("#b3");

// Full dataset could give issues because of gzip
// var url = "Lekagul Sensor Data.csv.gz";
var url = "sss.csv";

d3.csv(url, function (err, data) {
if (err) throw err;
data.forEach(function (d) {
    d.Timestamp = new Date(d.data);
    d.price = +d.price
});
var ndx = crossfilter(data);
var all = ndx.groupAll();

var gradeDim = ndx.dimension(function (d) { return +d["grade"]; });
var ybDim = ndx.dimension(function (d) { return d["yr_built"]; });
var priceDim = ndx.dimension(function (d) { return +d["price"]; });
var dateDim = ndx.dimension(function (d) { return d.Timestamp; });

var gradeGroup = gradeDim.group();
var ybGroup = ybDim.group();
var priceSumGroup = gradeDim.group().reduceSum(function(d) {return d.price/ 1000000;});;
var dateGroup = dateDim.group();




priceChart
    .width(768)
    .height(480)
    
    
    .renderArea(true)
    .brushOn(false)
    .renderDataPoints(true)
    .clipPadding(10)
    .yAxisLabel("This is the Y Axis!")
    .dimension(gradeDim)
    .group(priceSumGroup);

    
    priceChart.render();

});