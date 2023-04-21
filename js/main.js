function showSection(id) {
    const sections = document.getElementsByClassName('section');
    for (let i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

// Load data from data.json
async function loadData() {
    const response = await fetch('data.json');
    const data = await response.json();

    // Manipulate the data to display in the corresponding sections
}

// Call loadData when the page is loaded
window.addEventListener('DOMContentLoaded', loadData);


d3.select('#poemContainer').style('max-height', $(window).height() * .6 + 'px')
d3.select('#resultsContainer').style('max-height', $(window).height() * .55 + 'px')

let parseDate = d3.timeFormat("%b %d, %Y");

let promises = [
    d3.json("data/data.json"),
    d3.json("data/Thesis_Authors16.json")
];

Promise.all(promises)
    .then(function (data) { initMainPage(data) })
    .catch(function (err) { console.log(err) });

var authorSet = new Set()
function initAuthorList(poemData) {
    poemData.forEach(function (d) {
        authorSet.add(d.Author)
    })
    var poetNames = Array.from(authorSet)
    const sortedPoets = poetNames.sort(function (a, b) {
        var aLast; var bLast
        if (a.split(' ').length == 2) {
            aLast = a.split(' ')[1]
        } else { aLast = a }
        if (b.split(' ').length == 2) {
            bLast = b.split(' ')[1]
        } else { bLast = b }
        return aLast.localeCompare(bLast)
    });

    const poetList = d3.select('#poetList')
        .append('ul');

    var pNames = poetList.selectAll('li')
        .data(sortedPoets)
        .enter()
        .append('li')
        .attr('class', 'poetName')
        .text(d => d)
        .on('click', function (event, d) {
            showSection('search')

            updateResults(d)
            $("body").animate({ scrollTop: 0 }, "fast");
        }).on('mouseover',function(event, d) {
            d3.select(this).style('font-weight','bold')
        })
        .on('mouseout',function(event, d) {
            d3.select(this).style('font-weight','')
        })
}

let input = ''
// initMainPage
function initMainPage(data) {
    // initialize
    let poemData = data[0];
    let authorData = data[1];
    // filter to after only
    poemData = poemData.filter(d => d['Before or after'] == 'After')
    initAuthorList(poemData)
    myText = new TextPanel(poemData, authorData);
    mySearchResults = new SearchResults(poemData, input, authorData)
    // const q = window.location.href.split('=')[1]
    // myText.wrangleData(+q)
    updateResults('')
    // // // poem nlp // //  // 
    // const lemmatizedPoems = preprocessPoems(data);
    // calculateTfIdf(lemmatizedPoems);

    // const targetPoemIndex = 0; // Index of the poem you want to find similar poems for
    // const similarPoems = findSimilarPoems(targetPoemIndex, lemmatizedPoems);

    // console.log("Similar poems to:", poems[0].title);
    // similarPoems.forEach(poem => {
    //     console.log(poems[poem.index].title, '- Similarity:', poem.similarity.toFixed(2));
    // });
}

function updateResults(givenAuthor) {
    mySearchResults.wrangleData(givenAuthor);
}

d3.select('#search').on('click', function () {
    updateResults('')
})

d3.selectAll('#dropdown').on('change', function () {
    // var val = d3.select('#dropdown').property("value")
    updateResults('')
})

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}
