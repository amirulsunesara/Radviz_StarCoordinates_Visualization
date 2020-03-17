//Written by Amirul Sunesara B00813456
/*
References:
[1] B00813456/assignment2_amirulSunesara_B00813456/index [.js]. (n.d.). https://dal.brightspace.com.
-->
*/

let transition = false;
let passed = false;
var ddDataset = document.getElementById("dataset");
var dataset = ddDataset.options[ddDataset.selectedIndex].value;
var ddPlot = document.getElementById("selectPlot");
var selectedPlot = ddPlot.options[ddPlot.selectedIndex].value;
document.getElementById("categoricalColumn").style.display = "none";
document.getElementById("lblCategoricalColumn").style.display = "none";
document.getElementById("mode").disabled = true;
//hit the API end point "getDataset"
//load default data
$.get("/getDataset/" + dataset, function(data, status) {
  data = JSON.parse(data);
  if (selectedPlot == "radviz") plotRadviz(data, false);
  else plotstarCoordinates(data, false);
});

document.getElementById("dataset").onchange = function() {
  document.getElementById("mode").disabled = true;
  document.getElementById("mode").value = "class";
  passed = false;
  document.getElementById("plot").innerHTML = "";
  document.getElementById("attributes").innerHTML = "";
  document.getElementById("categoricalColumn").style.display = "none";
  document.getElementById("lblCategoricalColumn").style.display = "none";

  ddPlot = document.getElementById("selectPlot");
  selectedPlot = ddPlot.options[ddPlot.selectedIndex].value;
  ddDataset = document.getElementById("dataset");
  dataset = ddDataset.options[ddDataset.selectedIndex].value;

  //check if dropdown is selected then show
  if (dataset != "-1" && selectedPlot != "-1") {
    $.get("/getDataset/" + dataset, function(data, status) {
      data = JSON.parse(data);
      let isDyanmic = false;
      if (dataset == "dataset1_processed.csv") {
        isDyanmic = true;
        document.getElementById("categoricalColumn").style.display = "block";
        document.getElementById("lblCategoricalColumn").style.display = "block";
      }
      if (selectedPlot == "radviz") plotRadviz(data, isDyanmic);
      else plotstarCoordinates(data, isDyanmic);
    });
  }
};

document.getElementById("selectPlot").onchange = function() {
  document.getElementById("mode").disabled = true;
  document.getElementById("mode").value = "class";
  passed = false;
  document.getElementById("plot").innerHTML = "";
  document.getElementById("attributes").innerHTML = "";
  document.getElementById("categoricalColumn").style.display = "none";
  document.getElementById("lblCategoricalColumn").style.display = "none";
  ddPlot = document.getElementById("selectPlot");
  selectedPlot = ddPlot.options[ddPlot.selectedIndex].value;
  ddDataset = document.getElementById("dataset");
  dataset = ddDataset.options[ddDataset.selectedIndex].value;

  //check if dropdown is selected then show
  if (dataset != "-1" && selectedPlot != "-1") {
    $.get("/getDataset/" + dataset, function(data, status) {
      data = JSON.parse(data);
      let isDyanmic = false;
      if (dataset == "dataset1_processed.csv") {
        isDyanmic = true;
        document.getElementById("categoricalColumn").style.display = "block";
        document.getElementById("lblCategoricalColumn").style.display = "block";
      }
      if (selectedPlot == "radviz") plotRadviz(data, isDyanmic);
      else plotstarCoordinates(data, isDyanmic);
    });
  }
};

document.getElementById("categoricalColumn").onchange = function() {
  passed = false;
  document.getElementById("plot").innerHTML = "";
  document.getElementById("attributes").innerHTML = "";
  document.getElementById("categoricalColumn").style.display = "none";
  document.getElementById("lblCategoricalColumn").style.display = "none";
  ddPlot = document.getElementById("selectPlot");
  selectedPlot = ddPlot.options[ddPlot.selectedIndex].value;
  ddDataset = document.getElementById("dataset");
  dataset = ddDataset.options[ddDataset.selectedIndex].value;
  ddCategory = document.getElementById("categoricalColumn");
  categoricalColumnVal = ddCategory.options[ddCategory.selectedIndex].value;

  //check if dropdown is selected then show
  if (dataset != "-1" && selectedPlot != "-1" && categoricalColumnVal != "-1") {
    $.get("/getDataset/" + dataset, function(data, status) {
      data = JSON.parse(data);
      let isDyanmic = false;
      if (dataset == "dataset1_processed.csv") {
        isDyanmic = true;
        document.getElementById("categoricalColumn").style.display = "block";
        document.getElementById("lblCategoricalColumn").style.display = "block";
      }
      if (selectedPlot == "radviz") plotRadviz(data, isDyanmic);
      else plotstarCoordinates(data, isDyanmic);
    });
  }
};
