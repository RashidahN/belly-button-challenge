//read JSON
// async function loadData() {
//     const dataUrl = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
//     fetch(dataUrl)
//     // .then(res => res.json())
//     .then(res =>
//         // console.log(res))
//         return res.json()
//     .catch(err => { throw err });
// }

async function load() {
    let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
    let obj = await (await fetch(url)).json();
    // console.log(obj);
    return obj
}

(async() => {
    const data = await load();

    //populate dropdown with 'ids' from 'names' object
    const select = document.getElementById("selDataset");
    const options = data.names
    console.log(options)
    for(var i = 0; i < options.length; i++) {
        const opt = options[i];
        const el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }

})();

// d3.select(".well").style("color", "green")

//select an 'id' in the dropdown
function optionChanged(value) {
    
    if (value) {
        window.alert(value)
        
        //create a visual diagram based on selected 'id'
        
        //get the top 10 'otu_ids' for the 'id'
        
    }
}
