const rand_array = []
for (let i = 0; i < 100; i++) {
    rand_array.push({
        x: Math.floor(Math.random() * 470 + 30),
        y: Math.floor(Math.random() * 500)
    })
}

const width = 500;
const height = 500;
const svg = d3.select(".chart1").append("svg").attr("width", width+30).attr("height", height + 30)


const x_scale = d3.scaleLinear().domain([0, 500]).range([0, width]);
const y_scale = d3.scaleLinear().domain([0, 500]).range([height, 0]);

svg.append("g").attr("transform", 'translate(30, ' + height + ')').call(d3.axisBottom(x_scale));
svg.append("g").attr("transform", 'translate(30' + ',0)').call(d3.axisLeft(y_scale));

svg.selectAll("circle")
    .data(rand_array)
    .join("circle")
    .attr("cx", d => x_scale(d.x))
    .attr("cy", d => y_scale(d.y))
    .attr("r", 3)
    .attr("fill", "lightblue");


d3.csv("titanic.csv").then(data => {
    const age_data = d3.rollup(data, v => v.length, d => {

        if (d.Age < 18) return "Under 18";
        if (d.Age < 30) return "18-29";
        if (d.Age < 40) return "30-39";
        if (d.Age < 50) return "40-49";
        if (d.Age < 60) return "50-59";
        if (d.Age < 70) return "60-69";
        return "Over 70";
    });
    const age_array = []
    for (const d of age_data) {
        age_array.push({
            label: d[0],
            value: d[1]
        })
    }
    const radius = 250
    const pie_svg = d3.select(".chart2")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .append("g")
        .attr("transform", 'translate(' + (250) + ', ' + (250) + ')');


    const pie = d3.pie().value(d => d.value);

    const color = d3.scaleOrdinal()
        .domain(age_array.map(d => d.label))
        .range(d3.schemeCategory10)

    pie_svg.selectAll("path")
        .data(pie(age_array))
        .join("path")
        .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
        .attr("fill", d => color(d.data.label));

    const label_arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8)
    pie_svg.selectAll("text")
        .data(pie(age_array))
        .join("text")
        .attr("transform", d => 'translate(' + label_arc.centroid(d) + ')')
        .attr("text-anchor", "middle")
        .attr('fill','white')
        .text(d => d.data.label + ': ' + d.data.value);
});
