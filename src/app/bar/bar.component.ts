import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})

export class BarComponent implements OnInit {

  private svg:any;
  private margin = 65;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() { }

 
  ngOnInit(): void {
    this.createSvg();
    d3.csv("/assets/PitchData.csv").then(data => {
      let filtered = data.filter(x => x.pitcher_name == 'Morton, Charlie');
      this.drawBars(filtered);
    });

  }

 

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }




private drawBars(data: any[]): void {
  // define count object that holds count for each pitch name
  var countObj:any = {};

  // count how much each pitch name occurs in list and store in countObj
  data.forEach(function(d) {
      var pitch_name = d.pitch_name;
      if(countObj[pitch_name] === undefined) {
          countObj[pitch_name] = 1;
      } else {
          countObj[pitch_name] = countObj[pitch_name] + 1;
      }
    // set count to percentage - dividing by number of Charlie Morton rows
    d.count = (countObj[pitch_name]/2364 * 100);
  });

 

  // Create the X-axis band scale
  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.pitch_name))
  .padding(0.2);

 

  // Draw the X-axis on the DOM
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

 

  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, 40])
  .range([this.height, 0]);

 

 

 

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

 

  // Create and fill the bars
  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d: { pitch_name: string; }) => x(d.pitch_name))
  .attr("y", (d: { count: d3.NumberValue; }) => y(d.count))
  .attr("width", x.bandwidth())
  .attr("height", (d: { count: d3.NumberValue; }) => this.height - y(d.count))
  .attr("fill", "#d04a35");
  }




}

 