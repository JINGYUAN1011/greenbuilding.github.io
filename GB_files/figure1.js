d3.json("https://raw.githubusercontent.com/JINGYUAN1011/data/master/GB_KeyWordsss.json", function (error, graphData) {
  if (error) throw error;

allNodesNames=graphData.nodes.map(function(d){return d.name})
allNodesfre=graphData.nodes.map(function(d){return d.frequency})


var idToNode = {};
graphData.nodes.forEach(function(n) {idToNode[n.id] = n;});

var idToTargetNodes = {};
graphData.nodes.forEach(function (n) {
idToTargetNodes[n.id] = [];
    graphData.links.forEach(function (l) {if (l.source === n.id) {idToTargetNodes[n.id].push(l.target);}
    });
});

//color=d3.scaleOrdinal(graphData.nodes.map(d => d.group).sort(d3.ascending), ["#c1c4c2", "#775945", "#e4b384", "#4e9161"])
color = d3.scaleOrdinal(["#c1c4c2", "#775945", "#e4b384", "#4e9161"])

var margin={top: 10, bottom: 10, left: 20, right: 20}
var  height=1000 - margin.top - margin.bottom
var width=1100 - margin.left - margin.right

 xScale=d3.scalePoint() .domain(allNodesNames).range([0,height])


  const radius = 5
  const barwidth=5
 
  //const container = d3.select(DOM.svg(width+margin.left+margin.right, height+margin.top+margin.bottom));
  const container_arc = d3.select(document.getElementById('123'))
                        .attr("width", width+margin.left+margin.right)
                        .attr("height", height+margin.top+margin.bottom);
  
  const arcGroup = container_arc
       .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")")  ;
  
  // create the nodes
  const nodes = arcGroup.selectAll("nodes")
    .data(graphData.nodes)
    .enter().append("circle")
      .attr("cx", width-1000+400)
      .attr("cy", d => xScale(d.name))
      .attr("r", radius)
      .attr("fill",  d => d3.lab(color(d.group)).darker(-0.5))
      .attr("id", d => d.id)
  
  // create the node labels
  const labels=arcGroup.selectAll("nodeLabels")
    .data(graphData.nodes)
    .enter().append("text")
      .attr("x", width-1000+380)
      .attr("y", d => xScale(d.name))
      .attr("fill", "black")
      .style("text-anchor", "end")
      .text(d => d.name)  
      .style("font-size", "11px")
  
    const barlabels=arcGroup.selectAll("barLabels")
    .data(graphData.nodes)
    .enter().append("text")
      .attr("x", d=>width-1000+400-d.frequency*0.5-200-10)
      .attr("y",  d => xScale(d.name)+2.5)
      .attr("fill", "black")
      .style("text-anchor", "end")
      .text(d => d.frequency)  
      .style("font-size", "12px")
    
  
  const rects=arcGroup.selectAll("rect")
    .data(graphData.nodes)
     .enter().append("rect")
    .attr("width",d=>d.frequency*0.5)
    .attr("height", barwidth)
    .attr("x",d=>width-1000+400-d.frequency*0.5-200)
    .attr("y", d => xScale(d.name)-2.5)//the y-coordinate for the bars
    .attr("fill",  d => d3.lab(color(d.group)))
    
   
 
  // This code builds up the SVG path element; see nodesAndArcs for details
  function buildArc(d) {
      let start = xScale(idToNode[d.source].name);
      let end = xScale(idToNode[d.target].name);
      const r = Math.abs(end - start) / 2;
      const arcPath = ['M', width-1000+400, start, 'A',  r, r, 0,0,start < end ? 1:0, width-1000+400, end].join(' ');
      return arcPath;   
  }
     
  // create the arcs
  const arcs = arcGroup.selectAll("arcs")
    .data(graphData.links)
    .enter().append("path")
    .attr("d", d => buildArc(d))
     .style("fill", "none")
     .attr("stroke", "lightgrey")
     .attr('stroke-opacity',0.9)
  .attr('stroke-width',0.5)



  // When the user mouses over a node,
  // add interactive highlighting to see connections between nodes  
   labels.on('mouseover', function(d) {
     
     //  highlight only the selected node
     //d3.select(this).style("fill", "darkgreen");
     d3.select(this).style("font-weight", 'bold');
       
     // next, style the arcs      
     arcs
       // the arc color and thickness stays as the default unless connected to the selected node d
       // notice how embedding the reference to arcs within nodes.on() allows the code to connect d to arcd
       // this code iterates through all the arcs so we can compare each to the selected node d
       .style('stroke', function (arcd) { 
          return  arcd.source === d.id || arcd.target === d.id ? '#626363' : '#ededed';})
       .style('stroke-width', function (arcd) {
          return arcd.source === d.id || arcd.target === d.id ? 1.3 : 0.5;})  
       .style('stroke-opacity',function(arcd){return arcd.source === d.id || arcd.target === d.id ? 0.7 : 0.3;})
     rects
     .style('fill', function (rec) { 
          return  rec.id === d.id ? '#626363' : '#ededed';})
     nodes
     .style('fill', function (l) { 
          return  l.id === d.id ? '#626363' : '#ededed';})
     .style("r", function (l) { 
          return  l.id === d.id ? '8' : 'radius';})
     barlabels
     .style('font-weight', function (bl) { 
          return  bl.id === d.id ? 'bold' : '';})
     
    });
  
   // remove highlighting when user mouse moves out of node by restoring default colors and thickness
   labels.on('mouseout', function (d) {   
     nodes.style("fill", d => d3.lab(color(d.group)));
     arcs.style('stroke', 'lightgrey');
     arcs.style('stroke-width', 0.5);
     arcs.style('stroke-opacity', 0.9);
     rects.style("fill", d => d3.lab(color(d.group)));
     labels.style('font-weight','');
     labels.style('fill','black');
     barlabels.style('fill','black');
     barlabels.style('font-weight','');
     nodes.style('r',radius)
    })
   });