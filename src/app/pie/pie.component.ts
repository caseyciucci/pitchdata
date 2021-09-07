import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})

export class PieComponent implements OnInit {


  private svg;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;


  constructor() { }


  ngOnInit(): void {
    this.createSvg();

    d3.csv("/assets/PitchData.csv").then(data => {
      // get data for Max Fried only where full count
      let filtered = data.filter(x => x.pitcher_name == 'Fried, Max' && x.balls == '3' && x.strikes == '2');


      // set up obj to hold count of each pitch type
      var countObj:any = {};
      filtered.forEach(function(d) {
        var pitch_type = d.pitch_type;
        if(countObj[pitch_type] === undefined) {
            countObj[pitch_type] = 1;
        } else {
            countObj[pitch_type] = countObj[pitch_type] + 1;
        }
      });
      // set up array to pass to pie chart with pitch type & count of each pitch
      var newArr: any[] = [];
      for(var property in countObj) {
        newArr.push({type: property, count: countObj[property]});
      }

 
      this.createColors(newArr);
      this.drawChart(newArr);
    });
  }

 

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );

  }

 

 

  private createColors(data: any[]): void {
    this.colors = d3.scaleOrdinal()
    .domain(data.map(d => d.count.toString()))
    .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
  }

 

  private drawChart(data: any[]): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.count));


    // Build the pie chart
    this.svg
    .selectAll('pieces')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius)
    )
    .attr('fill', (d, i) => (this.colors(i)))
    .attr("stroke", "#121926")
    .style("stroke-width", "1px");

 

    // Add labels
    const labelLocation = d3.arc()
    .innerRadius(100)
    .outerRadius(this.radius);

 

    this.svg
    .selectAll('pieces')
    .data(pie(data))
    .enter()
    .append('text')
    .text(d => d.data.type)
    .attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 15);
}

 

}

 