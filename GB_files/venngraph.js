//venngrap
var sets = [
    {sets: [0], label: 'Energy', size: 2000, fill:" #5f3915"},
    {sets: [1], label: 'Environment', size: 2000, fill: "#ff7f0e"},
    {sets: [2], label: 'Health', size: 2000, fill: "#006836"},
    {sets: [0, 1], size: 200},
    {sets: [1, 2], size: 200},
    {sets: [0, 2], size: 200}
  ];
const chart = d3.select(document.getElementById('venngraph_d3'))
   .attr("width", 500)
    .attr("height", 350)
  .call(svg => {
      svg.datum(sets)
         .call(venn.VennDiagram())
      // Circle stylings
      const path=svg.selectAll(".venn-circle path")
         .style("fill", (d, i) => d['fill'])
         .style("fill-opacity", .25)
      // Label stylings
      const text=svg.selectAll(".venn-circle text")
         .style("fill", (d, i) => d['fill'])
         .style('font-size','12pt')
    path.on('mouseover',function(d){
            d3.select(this).style("fill-opacity", '0.5');
            text
              .style("font-weight",function(text){return text.label === d.label ? 'bold':'';})
  });
    path.on('mouseout',function(d){
      path.style("fill-opacity", '0.25');
      text.style("font-weight",'')
    })
  })