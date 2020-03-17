//Written by Amirul Sunesara B00813456
/*
References:
[1] B00813456/assignment2_amirulSunesara_B00813456/StarCoordinates [.js]. (n.d.). https://dal.brightspace.com.
-->
*/

function plotstarCoordinates(data, isDynamic) {
  let starCoordinatesCollection = document.querySelector("#plotDiagram");
  let colNames;
  let categoricalColumnVal;
  let numericColumns;
  categoricalColumn = document.getElementById("categoricalColumn");
  ddDataset = document.getElementById("dataset");
  datasetName = ddDataset.options[ddDataset.selectedIndex].value;

  if (isDynamic)
    categoricalColumnVal =
      categoricalColumn.options[categoricalColumn.selectedIndex].value;
  else if (datasetName == "iris.csv") categoricalColumnVal = "Class";
  else categoricalColumnVal = "quality";
  if (isDynamic) {
    colNames = [
      "age",
      "fnlwgt",
      "education-num",
      "capital-loss",
      "hours-per-week",
      categoricalColumnVal
    ];
  } else colNames = d3.keys(data[0]);
  let classNames = [];
  let attributedColor = [];
  //function to color of corresponding data element
  let fetchColor = function(currObj) {
    return currObj[colNames[colNames.length - 1]];
  };

  if (isDynamic)
    numericColumns = [
      "age",
      "fnlwgt",
      "education-num",
      "capital-loss",
      "hours-per-week"
    ];
  else numericColumns = Object.keys(data[0]).slice(0, colNames.length - 1);
  //function to calculate position of anchor points
  let getAnchorPos = function(len) {
    arrNodePos = [];
    for (i = 0; i < len; i++) {
      arrNodePos.push((2 * i * Math.PI) / len);
    }
    return arrNodePos;
  };
  let anchorPoints = getAnchorPos(numericColumns.length).slice();
  //setting colors for data elements
  let nodecolor = d3.scaleOrdinal(d3.schemeCategory10);
  let clusterColor = d3.scaleOrdinal(d3.schemeAccent);

  let allNumericColumns = numericColumns;
  let currentNumericColumns = numericColumns;
  let dimCounts = currentNumericColumns.length;

  data = setNormalizedValuesInData();
  data = setDataElementCoordinates();

  //set color for legend data
  for (i = 0; i < data.length; i++) {
    if (attributedColor.filter(a => a == data[i].color).length <= 0) {
      attributedColor.push(data[i].color);
      if (isDynamic) {
        categoricalColumn = document.getElementById("categoricalColumn");
        categoricalColumnVal =
          categoricalColumn.options[categoricalColumn.selectedIndex].value;
        classNames.push(data[i][categoricalColumnVal]);
      } else {
        if (data[i]["quality"] == undefined) classNames.push(data[i].Class);
        else classNames.push(data[i].quality);
      }
    }
  }
  //function to set anchor position
  let AnchorPos;
  function setAnchorPosition() {
    AnchorPos = [];
    for (i = 0; i < currentNumericColumns.length; i++) {
      let pos = {};
      pos["angle"] = anchorPoints[i];
      pos["x"] = Math.cos(anchorPoints[i]) * 155 + 155;
      pos["y"] = Math.sin(anchorPoints[i]) * 155 + 155;
      pos["title"] = currentNumericColumns[i];
      pos["id"] = "id" + i;
      AnchorPos.push(pos);
    }
    return AnchorPos;
  }
  AnchorPos = setAnchorPosition();

  const starCoordinates = d3.select(starCoordinatesCollection);
  let svg = starCoordinates
    .select("#plot")
    .attr("width", 750)
    .attr("height", 400);
  svg
    .append("rect")
    .attr("width", 750)
    .attr("height", 400)
    .attr("fill", "transparent");

  let midpoint = svg
    .append("g")
    .attr("class", "center")
    .attr("transform", `translate(${250},${50})`);

  //Referenced from https://www.dashingd3js.com/svg-basic-shapes-and-d3js
  function addLines() {
    midpoint.selectAll(".connectorLine").remove();
    midpoint
      .selectAll(".AnchorPoint")
      .data(AnchorPos)
      .enter()
      .append("line")
      .style("stroke", "black")
      .attr("class", "connectorLine")
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("id", d => d.id)
      .attr("x2", 155)
      .attr("y2", 155);
  }

  function addAnchors() {
    //this condition check whether checkboxes are already added.
    if (passed == false) {
      allNumericColumns.forEach(x => {
        d3.select("#attributes")
          .append("input")
          .attr("type", "checkbox")
          .attr("class", "attributeData")
          .attr("checked", true)
          .attr("value", x);

        d3.select("#attributes")
          .append("text")
          .text(" " + x);
        d3.select("#attributes").append("br");
      });
    }

    //remove all anchor points just incase if re-rendering
    midpoint.selectAll("circle.AnchorPoint").remove();
    addLines();
    midpoint
      .selectAll("circle.AnchorPoint")
      .data(AnchorPos)
      .enter()
      .append("circle")
      .attr("class", "AnchorPoint")
      .attr("stroke-width", 1)
      .attr("fill", d3.rgb(78, 56, 12))
      .attr("stroke", d3.rgb(78, 56, 12))
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 7.5)
      .call(
        d3
          .drag()
          .on("drag", dragging)
          .on("end", dragend)
      );
  }

  //when anchor ended draging
  //referenced from https://observablehq.com/@d3/circle-dragging-i
  function dragend(d) {
    d3.select(this).attr("stroke-width", 0);
    transition = true;
    setDataElementCoordinates();
    addDataElements();
  }
  //when dragging anchor
  //referenced from https://observablehq.com/@d3/circle-dragging-i
  function dragging(d, i) {
    let tx = d3.event.x - 155;
    let ty = d3.event.y - 155;
    let newAngle = Math.atan2(ty, tx);
    newAngle = newAngle < 0 ? 2 * Math.PI + newAngle : newAngle;
    d.theta = newAngle;
    d.x = 155 + Math.cos(newAngle) * 155;
    d.y = 155 + Math.sin(newAngle) * 155;
    d3.select(this)
      .attr("cx", d.x)
      .attr("cy", d.y);
    d3.select("#" + d.id)
      .attr("x1", d.x)
      .attr("y1", d.y);
    addAnchors();
    addLabelsToAnchors();
    anchorPoints[i] = newAngle;
  }
  function addLabelsToAnchors() {
    //remove existing anchor just in case if re-rendering
    midpoint.selectAll("text.AnchorLabel").remove();
    midpoint
      .selectAll("text.AnchorLabel")
      .data(AnchorPos)
      .enter()
      .append("text")
      .attr("class", "AnchorLabel")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("dy", 20)
      .text(d => d.title)
      .attr("font-size", "12pt");
  }
  //Referenced from
  //E. Kandogan, “Star Coordinates: A Multi-dimensional Visualization ...” [Online]. Available: http://people.cs.vt.edu/~north/infoviz/starcoords.pdf.
  //plot data elements within starCoordinates
  function addDataElements() {
    if (transition != true) {
      //remove existing dataelements when re-rendered
      midpoint.selectAll(".dataelement").remove();
      midpoint
        .selectAll(".dataelement")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dataelement")
        .attr("r", 5)
        .attr("name", d => d.color)
        .attr("fill", function(d) {
          ddMode = document.getElementById("mode");
          mode = ddMode.options[ddMode.selectedIndex].value;
          if (mode == "class") return d.color;
          else return d.cluster_color;
        })
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("cx", d => d.x * 155 + 155)
        .attr("cy", d => d.y * 155 + 155)

        .on("mouseenter", function(obj) {
          let mousePointer = d3.mouse(this);

          svg
            .select("g.tip")
            .selectAll("text")
            .text(function(key, i) {
              if (!isNaN(obj[key])) {
                obj[key] = parseFloat(obj[key]).toFixed(2);
              }
              return key + " = " + obj[key];
            });
          //fix the tip to mouse cursor position
          svg
            .select("g.tip")
            .attr(
              "transform",
              `translate(${270 + mousePointer[0]},${mousePointer[1] - 30})`
            );
          //show tip
          svg.select("g.tip").attr("display", "block");

          d3.select(this)
            .raise()
            .transition()
            .attr("r", 10)
            .attr("stroke-width", 2);

          colorVal = d3.select(this).attr("name");
          classindex = attributedColor.indexOf(colorVal);
          document.getElementById("corrMatrix").innerHTML = "";
          document.getElementById("corrMatrix").innerHTML =
            "<div id='matrix'></div>";

          $.get(
            "/getCorrelationMatrix/" +
              datasetName +
              "/" +
              categoricalColumnVal +
              "/" +
              classNames[classindex],
            function(trace, status) {
              data123 = [trace];
              layout = {
                title: "Correlation Matrix",
                width: 400,
                height: 400
              };
              Plotly.plot("matrix", {
                data: data123,
                layout: layout
              });
            }
          );
        })
        .on("mouseout", function(d) {
          //hide tip
          svg.select("g.tip").attr("display", "none");
          //set tip to orignal state
          d3.select(this)
            .transition()
            .attr("r", 5)
            .attr("stroke-width", 0.5);
        });
    } else {
      //animate elements when the anchor drag ended
      transition = false;
      midpoint
        .selectAll(".dataelement")
        .data(data)
        .transition()
        .duration(1000)
        .attr("r", 5)
        .attr("stroke-width", 0.5)
        .attr("fill", function(d) {
          ddMode = document.getElementById("mode");
          mode = ddMode.options[ddMode.selectedIndex].value;
          if (mode == "class") return d.color;
          else return d.cluster_color;
        })
        .attr("stroke", "black")
        .attr("cx", d => d.x * 155 + 155)
        .attr("cy", d => d.y * 155 + 155);
    }
  }
  //add legend for classes in last column
  //Referenced from https://www.d3-graph-gallery.com/graph/custom_legend.html
  function addLegend() {
    let x = 513;
    let y = 40;
    let legendcircle = midpoint
      .selectAll("circle.circlelegend")
      .data(attributedColor)
      .enter()
      .append("circle")
      .attr("class", "circlelegend")
      .attr("r", 5)
      .attr("cx", x)
      .attr("cy", (d, i) => i * y)
      .attr("fill", d => d);
    let legendtexts = midpoint
      .selectAll("text.textlegend")
      .data(classNames)
      .enter()
      .append("text")
      .attr("class", "textlegend")
      .attr("x", x + 10)
      .attr("y", (d, i) => i * y + 5)
      .text(d => d)
      .attr("font-size", "14pt");
  }
  //show the normalized values and class when hovering over data elements
  //Referenced from http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
  // and https://www.d3-graph-gallery.com/graph/scatter_tooltip.html
  function addTip() {
    let hoverPanel = svg
      .append("g")
      .attr("class", "tip")
      .attr("transform", `translate(${250},${50})`)
      .attr("display", "none");

    let hoverTip = hoverPanel
      .selectAll("text")
      .data(colNames)
      .enter()
      .append("g")
      .attr("y", function(a, b) {
        return 25 * b;
      })
      .attr("x", 0);
    hoverTip
      .append("rect")
      .attr("fill", d3.rgb(240, 185, 185))
      .attr("height", 30)
      .attr("width", 160)
      .attr("y", function(a, b) {
        return 25 * b;
      })
      .attr("x", 0);

    hoverTip
      .append("text")
      .attr("width", 160)
      .attr("height", 30)
      .attr("y", function(a, b) {
        return 25 * (b + 0.5);
      })
      .attr("x", 5);
  }
  //add opacity bar to change opacity of data elements
  //Referenced from https://bl.ocks.org/EfratVil/2bcc4bf35e28ae789de238926ee1ef05
  function addOpacityBar() {
    d3.select("#rangeOpacity").on("input", function() {
      svg
        .selectAll(".dataelement,circle.circlelegend")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", d3.select("#rangeOpacity").property("value") / 100);
    });
  }
  //setting the event handler of changing value in dropdown of dataset
  function addDropdownChangeEventHandler() {
    d3.selectAll(".attributeData").on("change", function() {
      var items = document.querySelectorAll("input[type=checkbox]:checked");
      var selectedItems = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].checked == true) selectedItems.push(items[i].value);
      }
      currentNumericColumns = selectedItems;
      anchorPoints = getAnchorPos(numericColumns.length).slice();
      rerenderstarCoordinates();
    });
  }

  function render() {
    //plot lines connecting center and nodes
    addLines();
    //plot anchors
    addAnchors();
    //add labels on top of anchors
    addLabelsToAnchors();
    //when hovering dataelements show the normalized values and class
    addTip();
    //plot data elements within starCoordinates
    addDataElements();
    //add legend for classes in last column
    addLegend();
    //add opacity bar to change opacity of data elements
    addOpacityBar();
    //setting the event handler of changing value in dropdown of dataset
    addDropdownChangeEventHandler();
    passed = true;
  }

  render();

  function rerenderstarCoordinates() {
    // reintialized all data and re-render
    AnchorPos = setAnchorPosition();
    setDataElementCoordinates();
    render();
  }

  //set x and y values for data elements
  function setDataElementCoordinates() {
    for (i = 0; i < data.length; i++) {
      let x = 0;
      let y = 0;
      for (j = 0; j < currentNumericColumns.length; j++) {
        x = x + data[i][currentNumericColumns[j]] * Math.cos(anchorPoints[j]);
        y = y + data[i][currentNumericColumns[j]] * Math.sin(anchorPoints[j]);
      }
      data[i]["x"] = x;
      data[i]["y"] = y;
    }
    return data;
  }
  //referenced from
  // L.Nováková and O.Štepanková, "RadViz and Identification of Clusters in Multidimensional Data," 2009 13th International Conference Information Visualisation, Barcelona, 2009, pp. 104 - 109. doi: 10.1109 / IV.2009.103

  function getNormalizeValue(number, highval, lowval) {
    return (number - lowval) / (highval - lowval);
  }
  function setNormalizedValuesInData() {
    let maxValues = {};
    let minValues = {};

    //initializing dictionary to store max and min values for every attribute column
    for (j = 0; j < currentNumericColumns.length; j++) {
      maxValues[currentNumericColumns[j]] = 0;
      minValues[currentNumericColumns[j]] = 999999999;
    }

    //iterate over all rows and set the max and min values
    for (i = 0; i < data.length; i++) {
      for (j = 0; j < currentNumericColumns.length; j++) {
        data[i][currentNumericColumns[j]] = parseFloat(
          data[i][currentNumericColumns[j]]
        );
        if (
          data[i][currentNumericColumns[j]] >
          maxValues[currentNumericColumns[j]]
        )
          maxValues[currentNumericColumns[j]] =
            data[i][currentNumericColumns[j]];
        if (
          data[i][currentNumericColumns[j]] <
          minValues[currentNumericColumns[j]]
        )
          minValues[currentNumericColumns[j]] =
            data[i][currentNumericColumns[j]];
      }
    }
    //this loop sets normalized values and set the sum the normalized values
    for (i = 0; i < data.length; i++) {
      let sum = 0;
      for (j = 0; j < currentNumericColumns.length; j++) {
        data[i][currentNumericColumns[j]] = getNormalizeValue(
          data[i][currentNumericColumns[j]],
          maxValues[currentNumericColumns[j]],
          minValues[currentNumericColumns[j]]
        );
        sum += data[i][currentNumericColumns[j]];
      }
      data[i]["sum"] = sum;
      //set color in data elements
      data[i]["color"] = nodecolor(fetchColor(data[i]));
    }

    return data;
  }

  document
    .getElementById("btnClusterize")
    .addEventListener("click", function() {
      ddDataset = document.getElementById("dataset");
      document.getElementById("mode").disabled = false;
      dataset = ddDataset.options[ddDataset.selectedIndex].value;
      kValue = document.getElementById("kValue");
      kValue = kValue.options[kValue.selectedIndex].value;
      $.get("/clusterize/" + dataset + "/" + kValue, function(data4, status) {
        for (i = 0; i < data.length; i++) {
          data[i]["cluster_color"] = clusterColor(data4[i]);
        }
        alert(
          "Successfully clusterized using K-means. You can now switch color mode from class based to cluster colors"
        );
        addDataElements();
      });
    });
  document.getElementById("mode").addEventListener("change", function(e) {
    ddMode = document.getElementById("mode");
    mode = ddMode.options[ddMode.selectedIndex].value;
    if (mode != "-1") addDataElements();
  });
}
