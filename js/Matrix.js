



export default function Matrix(){
	// init size
	let margin ={ top: 100, right: 20, bottom: 20, left: 100 };
	let size = 600;

    let pos = d3.scaleBand();

    function handleMouseoverCell(d,i){
        let row = d3.select(this.parentNode).datum().index; // parent: row
        let col = i;
        let g = d3.select(this.parentNode.parentNode);// get group
    
        g.selectAll(".matrix-cell")
            .filter(d=>d.r!==row&&d.c!==col)
            .transition()
            .duration(200)
            .attr("fill-opacity", 0);
        g.selectAll(".matrix-cell-marriage")
            .filter(d=>d.r!==row&&d.c!==col)
            .transition()
            .duration(200)
            .attr("fill-opacity", 0.2)
        g.selectAll(".matrix-cell-business")
            .filter(d=>d.r!==row&&d.c!==col)
            .transition()
            .duration(200)
            .attr("fill-opacity", 0.2)
    
    };

    function handleMouseoutCell(){
        let g = d3.select(this.parentNode.parentNode);// get group
        g.selectAll(".matrix-cell-business")
            .transition()
            .duration(200)
            .attr("fill-opacity", 1)
        g.selectAll(".matrix-cell-marriage")
            .transition()
            .duration(200)
            .attr("fill-opacity",1)
       };

    

    function chart(selection){
        selection.each(function(data){
                // Update Scales
            pos.domain(d3.range(data.length))
            .rangeRound([0, size - margin.left - margin.right])
            .paddingInner(0.25);

            let svg = d3.select(this).selectAll('svg')
            .data([data]);
            
            // to add svg only once
            let svgEnter = svg.enter().append('svg');
            svgEnter.append('g');
            
            svg = svg.merge(svgEnter); // merge with the update selection
            
            // update canvas size
            svg.attr("width", size).attr("height", size);
            
            let g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        
                // Draw matrix rows (and y-axis labels)
let dataJoin = g.selectAll(".matrix-row")
.data(data, d=> d.Family);

let rowsGroups = dataJoin.enter()
.append("g")
.attr("class", "matrix-row");

rowsGroups.merge(dataJoin)  // merge ENTER + UPDATE groups
.style('opacity', 0.5)
.transition()
.duration(1000)
.style('opacity', 1)
.attr("transform", (d,i)=>"translate(0," + pos(i) + ")");

// Draw marriage triangles within each group
rowsGroups.selectAll(".matrix-cell")
.data(d=> d.cols)
.enter().append("rect")
.attr('x', (d,i)=>pos(i))
.attr('width', pos.bandwidth())
.attr('height', pos.bandwidth())
.attr("fill","white")
// .attr("fill", d=>d.marriage == 0 ? "#ddd" : "#8686bf")


rowsGroups.append("text")
    .attr("class", "matrix-row-label")
    .attr("y", pos.bandwidth() / 2)
    .attr("dx", -10)
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .text(d=>d.Family);


g.selectAll(".matrix-column-label")
    .data(data).enter().append("text")
    .attr("class", "matrix-column-label")
    .attr("alignment-baseline", "middle")
    .attr("transform", function(d, i){
        return "translate(" +( pos(i)+ pos.bandwidth()/2)+ ",-8) rotate(270)"
    })
    .text(d=> d.Family);
        
        
    rowsGroups.selectAll(".matrix-cell-marriage")
    .data(d=> d.cols)
    .enter().append("path") // only use enter since the matrix size does not change.
    .attr("class", "matrix-cell-marriage")
    .attr('d', (d, i)=>'M ' + pos(i) +' '+ 0 + ' l ' + pos.bandwidth() + ' 0 l 0 ' + pos.bandwidth() + ' z')
    .attr("fill", d=>d.marriage == 0 ? "#ddd" : "#8686bf")
    .attr("class", "matrix-cell matrix-cell-marriage")
    .on("mouseover", handleMouseoverCell)
    .on("mouseout", handleMouseoutCell);
        


    rowsGroups.selectAll(".matrix-cell-business")
    .data(d=> d.cols)
    .enter().append("path")
    .attr("class", "matrix-cell matrix-cell-business")
    .attr('d', (d,i)=>'M ' + pos(i) +' '+ 0 + ' l 0 ' + pos.bandwidth() + ' l ' + pos.bandwidth() + ' 0 z')
    .attr("fill", d=>d.business == 0 ? "#ddd" : "#fbad52")
    .attr("class", "matrix-cell matrix-cell-business")
    .on("mouseover", handleMouseoverCell)
    .on("mouseout", handleMouseoutCell);

            });    
    }
    return chart;
}

