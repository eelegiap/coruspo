class TextPanel {

    constructor(poemData, authorData) {
        this.data = poemData
        this.authorData = authorData
        this.initVis()
    }

    initVis() {
        let vis = this;

        var d = choose(this.data)
        this.updateVis(d)

    }
    wrangleData(id) {
        let vis = this;
        var thisPoem = this.data.find(d => d.UniqueIndex == id)
        // console.log('thisPoem', thisPoem)
        this.updateVis(thisPoem)
        d3.selectAll('.poemResult').classed('border', false)
        d3.select('#id' + id).classed('border', true)
    }

    /*
    * The drawing function - should use the D3 update sequence (enter, update, exit)
    * */

    updateVis(thisPoem) {
        let vis = this;

        var authorInfo = this.authorData[this.authorData.map(d => d.Author).indexOf(thisPoem.Author)]
        // console.log('thisPoem in UpdateVis', thisPoem)
        d3.select('#poemTxt').html('')
        d3.select('#poemMeta').html('')
        d3.select('#poemMeta').html(function () {
            var color = 'black'
            if (thisPoem['Before or after'] == 'Before') {
                color = '#118ab2'
            } else {
                color = '#ef476f'
            }
            var dateObj = {
                'No War Poetry': 'Apr 21, 2022',
                'ROAR V2': 'Jun 24, 2022',
                'ROAR V3': 'Aug 24, 2022',
            }
            var date = thisPoem['Date posted'] != 'None' ? `${parseDate(new Date(thisPoem['Date posted']))}` : ''
            if (date == '') {
                date = `${dateObj[thisPoem.Source]}`
            }
            var citationinfo = `"CoRusPo," ${thisPoem.Source}, ${date}, https://eelegiap.github.io/thesis-code/search/?q=${thisPoem.UniqueIndex}<br><br>`
            // no citation info
            citationinfo = ''
            // Author first name last name, “Page Title,” Website Name, Month Day, Year, URL.
            return citationinfo + `<span style='color:${color}'>${date}:</span>
                    <b><span id='thisauthor'>${thisPoem.Author}</span></b>, <i>${thisPoem.Source}</i>
                    <br>Author birthplace: ${authorInfo.City}, ${authorInfo.Country}
                    <br>Poem ID: ${thisPoem.UniqueIndex}<hr>`
        })

        var input = d3.select('#form1').property('value')
        var forHTML = thisPoem.Text.replaceAll('\n', '<br>')

        // console.log('input in updatevis',input)

        var lineHTMLs = []
        thisPoem.nlpInfo.forEach(function (line, i) {
            var lineHTML = line.lineTxt
            line.lemmas.forEach(function (lem, j) {
                if (lem == input) {
                    var span = thisPoem.nlpInfo[i].spans[j]
                    var token = thisPoem.nlpInfo[i].texts[j]
                    lineHTML = [lineHTML.slice(0, span.start), `<mark>${token}</mark>`, lineHTML.slice(span.end)].join('');
                }
            })
            if (thisPoem.Source.includes('ROAR')) {
                if (!(/^[\*]+$/.test(lineHTML.replaceAll(' ', '')))) {
                    // check if bold
                    var regexBold = /\*\*([^*]+)\*\*/i
                    var matchesBold = lineHTML.match(regexBold)
                    if (matchesBold != null && matchesBold.length > 0) {
                        lineHTML = `<b>${matchesBold.pop()}</b>`
                    } else {
                        // check if italic
                        var regexItalic = /\*([^*]+)\*/i;
                        var matchesItalic = lineHTML.match(regexItalic)
                        if (matchesItalic != null && matchesItalic.length > 0) {
                            lineHTML = `<i>${matchesItalic.pop()}</i>`
                        }
                    }
                }
            }
            lineHTMLs.push(lineHTML)
        })
        forHTML = lineHTMLs.join('<br>')

        d3.select('#poemTxt').html(forHTML)

        $("#poemContainer").animate({ scrollTop: 0 }, "fast");
        $("body").animate({ scrollTop: 0 }, "fast");
    }

}