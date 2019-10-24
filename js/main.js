
import Matrix from './Matrix.js';
let matrix = Matrix();
let viewData; //save data globally



function transform(data){
    let rows = [],
        n= data.nodes.length;

    rows = data.nodes.map((node,i)=>(
        {
            ...node,
            index : i,
            numMarriages : 0,
            numBusinessTies : 0,
            numAllRelations : 0,
            cols: d3.range(n).map(j=>({r:i, c:j, marriage: 0, business:0}))
        }
    ))
	data.links.forEach(function(link) {
        // count links for reordering later
		rows[link.source].numAllRelations += 1;
		rows[link.target].numAllRelations += 1;

		if (link.type==='marriage'){
			rows[link.source].cols[link.target].marriage = 1;

			rows[link.source].numMarriages += 1;
			rows[link.target].numMarriages += 1;
		}
		if (link.type==='business'){
			rows[link.source].cols[link.target].business = 1;

			rows[link.source].numBusinessTies += 1;
			rows[link.target].numBusinessTies += 1;
		}
    });
    return rows;
}



// Use queue.js to read the two datasets asynchronous
d3.json('data/florentine-family.json').then(data=>{

    viewData = transform(data);

	d3.select('#chart-area')
		.datum(viewData)
        .call(matrix);



        document.querySelector("#select-order-type").addEventListener("change", function(){
            // Update sorting
            let orderingType = this.value;
            // Sort viewData
            d3.select('#chart-area')
                .call(matrix);
            
            viewData.sort( function(a, b){
                if(orderingType == "index")
                    return a[orderingType] - b[orderingType];
                else
                    return b[orderingType] - a[orderingType];
            });
        
        });


});


