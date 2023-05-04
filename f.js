var gradeChart = dc.pieChart("#b1"),
ybChart = dc.rowChart("#b2"),
priceChart = dc.lineChart("#b3"),
scatChart = dc.scatterPlot("#b4"),
visCount = dc.dataCount(".dc-data-count")

// Full dataset could give issues because of gzip
// var url = "Lekagul Sensor Data.csv.gz";
var url = "ss.csv";

d3.csv(url, function (err, data) {
if (err) throw err;
data.forEach(function (d) {
    d.Timestamp = +d.date;
    d.price = +d.price
});
var ndx = crossfilter(data);
var all = ndx.groupAll();

var gradeDim = ndx.dimension(function (d) { return +d["grade"]; });
var ybDim = ndx.dimension(function (d) { return d["yr_built"]; });
var priceDim = ndx.dimension(function (d) { return +d["price"]; });
var dateDim = ndx.dimension(function (d) { return d.Timestamp; });



var sqDim = ndx.dimension(function(d) {return [Math.log(+d.sqft_living), Math.log(+d.sqft_lot)]})
var sqGroup = sqDim.group();

var gradeGroup = gradeDim.group();
var ybGroup = ybDim.group();

var priceGroup = priceDim.group();
var dateGroup = dateDim.group();
var priceSumGroup = dateDim.group().reduceSum(function(d) {return d.price/ 1000000;});

gradeChart
.height(380).width(800)
    .innerRadius(50)
    .dimension(gradeDim)
    .group(gradeGroup);
    

ybChart
.width(800)
.height(380)
    .dimension(ybDim)
    .group(ybGroup)
    .elasticX(true)
    .data(function (group) { return group.top(10); });


priceChart
.width(800)
.height(380)
    .x(d3.scale.linear().domain([1,12.5]))
    .renderArea(true)
    .brushOn(true)
    .renderDataPoints(true)
    .clipPadding(10)
    .yAxisLabel("Million")
    .xAxisLabel("Month")
    .dimension(dateDim)
    .group(priceSumGroup);

visCount
    .dimension(ndx)
    .group(all);

scatChart
    .width(800)
    .height(380)
    
    .x(d3.scale.linear().domain([6,9]))
    .brushOn(true)
    .symbolSize(8)
    .clipPadding(10)
    .yAxisLabel("log of sqft_lot")
    .xAxisLabel("log of sqft_living")
    .dimension(sqDim)
    .group(sqGroup);


dc.renderAll();

});