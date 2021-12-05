function translateTopLevel(flatSites) {
    let stackedSites = {}
    let secondArray = [...flatSites]
    for (let x of flatSites) {
        let insideCard = { 'name': x.name, 'title': x.title, 'type': x.type, 'url': x.url, 'image': x.image, 'section': x.section, 'children': {} }
        if (x.section == "top") {
            stackedSites[x.name] = insideCard
            secondArray = secondArray.filter(e => e !== x)
        }
    }
    return { stackedSites, secondArray }
}



function translateFromFlatSites(flatSites) {
    //! TODO you can do better...
    let { stackedSites, secondArray } = translateTopLevel(flatSites)

    flatSites = [...secondArray]

    for (let x of flatSites) {
        if (Object.keys(stackedSites).includes(x.section)) {
            let insideCard = { 'name': x.name, 'title': x.title, 'type': x.type, 'url': x.url, 'image': x.image, 'section': x.section, 'children': {} }
            stackedSites[x.section]['children'][x.name] = insideCard
            secondArray = secondArray.filter(e => e !== x)
        }
    }

    const iterate = (obj, x) => {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object') {
                iterate(obj[key], x)
            } else {
                if (key == 'name' && obj[key] == x.section) {
                    let insideCard = { 'name': x.name, 'title': x.title, 'type': x.type, 'url': x.url, 'image': x.image, 'section': x.section, 'children': {} }
                    obj.children[x.name] = insideCard
                    secondArray = secondArray.filter(e => e !== x)
                }
            }
        })
    }

    let currentLength = flatSites.length
    let previousLength = flatSites.length
    while (flatSites.length != 0) {
        flatSites = [...secondArray]
        for (let x of flatSites) {
            iterate(stackedSites, x)
        }
        previousLength = currentLength
        currentLength = flatSites.length
        if (previousLength == currentLength) {
            throw new Error(`Could not resolve all sites, check the file for this part: ${JSON.stringify(flatSites)}`)
        }
    }

    return stackedSites
}




function translateToFlatSites(stackedSites) {

    let flatSites = new Array()

    const iterate = (obj) => {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object') {
                if (key != 'children') {
                    flatSites.push({ 'name': makeSlug(key), 'url': obj[key].url, 'image': obj[key].image, 'title': obj[key].title, 'zoom': '1', 'type': obj[key].type, 'section': obj[key].section })
                }
                iterate(obj[key])
            }
        })
    }

    iterate(stackedSites)

    return flatSites
}


function makeSlug(inputStr) {
    return inputStr.replaceAll(' ', '_').toLowerCase()
}

function getStructure(mainElement) {
    let myStructure = {}
    let cond
    try {
        cond = mainElement.children[1].children.length
    } catch {
        cond = -1
    }
    if (cond <= 1) {
        return myStructure
    } else {
        Array.from(mainElement.children[1].children).forEach(x => {
            if (x.nodeName != "BUTTON") {
                let mainElementName = x.firstElementChild.firstElementChild.firstElementChild.firstElementChild.value
                let myType = (x.querySelector('.btn-group>input:disabled') === null) ? x.querySelector('.btn-group>input:checked').id.split('-')[0] : 'tile'
                let myUrl = x.querySelector('#web-url').value
                let myImage = x.querySelector('option:checked').value
                let mySection = (x.parentNode.parentNode.querySelector('#main-structure') === null) ? x.parentNode.parentNode.querySelector('#card-name').value : 'top'

                myStructure[makeSlug(mainElementName)] = {
                    'name': makeSlug(mainElementName),
                    'title': mainElementName,
                    'type': myType,
                    'children': getStructure(x),
                    'url': myUrl,
                    'image': myImage,
                    'section': makeSlug(mySection)
                }
            }

        })
    }
    return myStructure
}