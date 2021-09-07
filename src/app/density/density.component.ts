import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-density',
  templateUrl: './density.component.html',
  styleUrls: ['./density.component.scss']
})

export class DensityComponent implements OnInit {

  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() { }


  ngOnInit(): void {
    this.createSvg();
    d3.csv("/assets/PitchData.csv").then(data => {
      let filtered = data.filter(x => x.pitcher_name == 'Anderson, Ian');
      this.drawDensity(filtered);
    });

  }

 

  private createSvg(): void {
    this.svg = d3.select("figure#density")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

 

  private drawDensity(data: any[]) {
  // add the x Axis
  var x = d3.scaleLinear()
      .domain([65,110])
      .range([0, this.width]);
      this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x));

 

  // add the y Axis
  var y = d3.scaleLinear()
            .range([this.height, 0])
            .domain([0, 0.2]);

  this.svg.append("g")
      .call(d3.axisLeft(y));

 

  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(60))

  var density1 =  kde( data
      .filter( function(d){return d.pitch_type === "CU"} )
      .map(function(d){  return d.release_speed; }) )

  var density2 =  kde( data
      .filter( function(d){return d.pitch_type === "FF"} )
      .map(function(d){  return d.release_speed; }) )

  var density3 =  kde( data
    .filter( function(d){return d.pitch_type === "CH"} )
    .map(function(d){  return d.release_speed; }) )

 

  // Plot the area
  this.svg.append("path")
      .attr("class", "mypath")
      .datum(density1)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".6")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );

 

  // Plot the area
  this.svg.append("path")
      .attr("class", "mypath")
      .datum(density2)
      .attr("fill", "#404080")
      .attr("opacity", ".6")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );

 

      this.svg.append("path")
      .attr("class", "mypath")
      .datum(density3)
      .attr("fill", "#ffff66")
      .attr("opacity", ".6")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );




// Legend
this.svg.append("circle").attr("cx",300).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
this.svg.append("circle").attr("cx",300).attr("cy",60).attr("r", 6).style("fill", "#ffff66")
this.svg.append("circle").attr("cx",300).attr("cy",90).attr("r", 6).style("fill", "#404080")
this.svg.append("text").attr("x", 320).attr("y", 30).text("Curveball").style("font-size", "15px").attr("alignment-baseline","middle")
this.svg.append("text").attr("x", 320).attr("y", 60).text("Changeup").style("font-size", "15px").attr("alignment-baseline","middle")
this.svg.append("text").attr("x", 320).attr("y", 90).text("Four-Seam Fastball").style("font-size", "15px").attr("alignment-baseline","middle")

 

// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - <any>v); })];
    });
  };
}

function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

 

}

}

 