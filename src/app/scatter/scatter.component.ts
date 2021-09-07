import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

 
@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss']
})

export class ScatterComponent implements OnInit {


  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);


  constructor() { }


  ngOnInit(): void {
    this.createSvg();

    d3.csv("/assets/PitchData.csv").then(data => {
      let filtered = data.filter(x => x.pitcher_name == 'Biddle, Jesse');
      this.drawPlot(filtered);
    });
  }

 

  private createSvg(): void {
    this.svg = d3.select("figure#scatter")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

 

  private drawPlot(data: any[]): void {
    // Add X axis
    const x = d3.scaleLinear()
    .domain([-5, 5])
    .range([ 0, this.width ]);
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

 

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([-1, 6])
    .range([ this.height, 0]);
    this.svg.append("g")
    .call(d3.axisLeft(y));

 

    // Add dots
    const dots = this.svg.append('g');
    dots.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.plate_x))
    .attr("cy", d => y(d.plate_z))
    .attr("r", 7)
    .style("opacity", .5)
    // color pitches based on type
    .style("fill", function(d,i){
      if (d.type === "X")
          // into play
          return "yellow";
      else if(d.type === "B")
          // ball
          return "red";
      else
          // strike
          return 'green';
    })

  }

 

}

 