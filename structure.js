function translateTopLevel(flatSites) {
    let stackedSites = {}
    let secondArray = [...flatSites]
    for (let x of flatSites) {
        let insideCard = { 'name': x.name, 'type': x.type, 'url': x.url, 'image': x.image, 'section': x.section, 'children': {} }
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
            let insideCard = { 'name': x.name, 'type': x.type, 'url': x.url, 'image': x.image, 'section': x.section, 'children': {} }
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
                    let insideCard = { 'name': x.name, 'type': x.type, 'url': x.url, 'image': x.image, 'section': x.section, 'children': {} }
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


function makeSlug(inputStr) {
    return inputStr.replaceAll(' ', '_').toLowerCase()
}


function translateToFlatSites(stackedSites) {

    let flatSites = new Array()

    const iterate = (obj) => {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object') {
                if (key != 'children') {
                    flatSites.push({ 'name': makeSlug(key), 'url': obj[key].url, 'image': obj[key].image, 'title': key, 'zoom': '1', 'type': obj[key].type, 'section': obj[key].section })
                }
                iterate(obj[key])
            }
        })
    }

    iterate(stackedSites)

    return flatSites
}


const makeStructure = (obj, baseElement, listOfIconsLocal) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') {
            let card = createIconCard(listOfIconsLocal, obj[key].name, obj[key].type, obj[key].url, obj[key].image)
            let newBase = baseElement
            if (key != 'children') {
                baseElement.parentNode.appendChild(card)
                newBase = baseElement.parentNode.lastElementChild.querySelector('.card-footer>button')
            }
            makeStructure(obj[key], newBase, listOfIconsLocal)
        }
    })
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

                myStructure[mainElementName] = {
                    'name': mainElementName,
                    'type': myType,
                    'children': getStructure(x),
                    'url': myUrl,
                    'image': myImage,
                    'section': mySection
                }
            }

        })
    }
    return myStructure
}


function editText(x) {
    if (x.nodeName != "INPUT") {
        x.parentNode.innerHTML = `<input class="form-control" type="text" value="${x.firstElementChild.value.trim()}">`
    }
}


function changeCheck(x) {
    // console.log(x)
    let parentCard = x.parentNode.parentNode.parentNode.parentNode.parentNode
    if (x.checked === true && x.id.includes("web")) {
        parentCard.querySelector('.card-footer>button').disabled = true
        parentCard.querySelector('#web-url').disabled = false
    } else {
        parentCard.querySelector('.card-footer>button').disabled = false
        parentCard.querySelector('#web-url').disabled = true

    }

}

function removeCard(x) {
    let parentCard = x.parentNode.parentNode.parentNode.parentNode
    parentCard.classList.remove('easing')
    parentCard.classList.add('easing-out')
    setTimeout(() => {
        if (parentCard.parentNode.parentNode.querySelector('.card-footer').childElementCount == 2) {
            parentCard.parentNode.parentNode.querySelector('.btn-group').querySelectorAll('input').forEach(el => el.disabled = false)
        }
        parentCard.remove()
    }, 200)
}


function createIconCard(iconList, cardName = "", cardType = "file", urlValue = "", iconName = "") {

    let sinceEpoch = parseInt(new Date().getTime() * Math.random())
    let isChecked = {
        "web": "",
        "file": "",
        "fileList": ""
    }
    let isTile = ""
    let isUrlDisabled = "disabled"

    switch (cardType) {
        case "web":
            isChecked.web = "checked"
            isUrlDisabled = ""
            break;
        case "tile":
            isTile = "disabled"
            break;
        case "file":
            isChecked.file = "checked"
            break;
        case "fileList":
            isChecked.fileList = "checked"
            break;
    }


    var newCard = document.createElement('div')
    newCard.className = "card border border-a m-3 shadow-strong-5 easing"

    var newBody = document.createElement('div')
    newBody.className = "card-body pb-1 pt-1"
    newBody.innerHTML = `<div class="row">
                                <div class="col-2">
                                    <input id="card-name" required class="form-control" type="text" placeholder="Type Name" value="${cardName}">
                                </div>

                                <div id="col-select" class="col-2">
                                </div>

                                <div class="col-3">
                                    <div class="btn-group" role="group">
                                        <input ${isTile} ${isChecked.web} class="btn-check radio-type" type="radio" id="web-${sinceEpoch}" name="type-${sinceEpoch}">
                                        <label class="btn btn-secondary" for="web-${sinceEpoch}">web</label>

                                        <input ${isTile} ${isChecked.file} class="btn-check radio-type" type="radio" id="file-${sinceEpoch}" name="type-${sinceEpoch}">
                                        <label class="btn btn-secondary" for="file-${sinceEpoch}">file</label>
                                        
                                        <input ${isTile} ${isChecked.fileList} class="btn-check radio-type" type="radio" id="fileList-${sinceEpoch}" name="type-${sinceEpoch}">
                                        <label class="btn btn-secondary" for="fileList-${sinceEpoch}">fileList</label>
                                    </div>
                                </div>

                                <div class="col-4">
                                    <input ${isUrlDisabled} id="web-url" class="form-control" type="text" placeholder="Type URL" value="${urlValue}">
                                </div>

                                <div class="col-1">
                                    <button id="remove-button" type="button" class="btn btn-sm btn-danger">-</button>
                                </div>
                            </div>`

    var newSelect = document.createElement('select')
    newSelect.type = "text"
    newSelect.className = "form-select text-light bg-dark"
    newSelect.id = "icon-name"
    newSelect.value = iconName
    iconList.forEach(x => {
        let newOption = document.createElement('option')
        newOption.value = x
        newOption.innerText = x
        if (x == iconName) {
            newOption.selected = true
        }
        newSelect.appendChild(newOption)
    })
    newBody.querySelector('#col-select').appendChild(newSelect)

    var newFooter = document.createElement('div')
    newFooter.className = "card-footer pb-1 pt-1"

    var newFooterButton = document.createElement('button')
    newFooterButton.className = "btn btn-sm btn-info add-button"
    newFooterButton.type = "button"
    newFooterButton.innerText = "+"

    newFooter.appendChild(newFooterButton)
    newFooter.querySelector('button').addEventListener('click', (e) => {
        addCard(e.target);
    })
    newBody.querySelector('#remove-button').addEventListener('click', (e) => {
        removeCard(e.target);
    })
    newBody.querySelectorAll('.radio-type').forEach(x => {
        x.addEventListener('click', (e) => {
            changeCheck(e.target);
        })
    })


    newCard.appendChild(newBody)
    newCard.appendChild(newFooter)

    return newCard
}

function addCard(x) {
    x.parentNode.appendChild(createIconCard(listOfIcons))
    if (x.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName != "BODY") {
        x.parentNode.parentElement.firstElementChild.querySelector('.btn-group').querySelectorAll('input').forEach(el => el.disabled = true)
    }
}

document.querySelector('#my-form').addEventListener('submit', function(e) {
    e.preventDefault()
    console.log('form submit')
        // e.submit()
    let stackedStructureResult = getStructure(document.querySelector('.container').children[0])
    console.log(stackedStructureResult)
    let flatStructureResult = translateToFlatSites(stackedStructureResult)
    console.log(flatStructureResult)

})

document.querySelectorAll('.add-button').forEach(x => {
    x.addEventListener('click', (e) => {
        addCard(e.target)
    })
})

var listOfIcons = [
    'icon1.png',
    'icon2.png',
    'icon3.png'
]

var flatListOfCards = [{
        "name": "card55",
        "url": "",
        "image": "icon1.png",
        "title": "card55",
        "zoom": "1",
        "type": "tile",
        "section": "top"
    },
    {
        "name": "card11",
        "url": "",
        "image": "icon3.png",
        "title": "card11",
        "zoom": "1",
        "type": "tile",
        "section": "top"
    },
    {
        "name": "card57",
        "url": "https://google.com",
        "image": "icon2.png",
        "title": "card57",
        "zoom": "1",
        "type": "web",
        "section": "top"
    },

    {
        "name": "card99",
        "url": "https://google.com",
        "image": "icon1.png",
        "title": "card99",
        "zoom": "1",
        "type": "web",
        "section": "card55"
    },

    {
        "name": "card102",
        "url": "",
        "image": "icon3.png",
        "title": "card102",
        "zoom": "1",
        "type": "file",
        "section": "card11"
    },
    {
        "name": "card3",
        "url": "",
        "image": "icon2.png",
        "title": "card3",
        "zoom": "1",
        "type": "tile",
        "section": "card11"
    },


    {
        "name": "card13",
        "url": "https://google.com",
        "image": "icon1.png",
        "title": "card13",
        "zoom": "1",
        "type": "web",
        "section": "card57"
    },
    {
        "name": "card501",
        "url": "",
        "image": "icon3.png",
        "title": "card501",
        "zoom": "1",
        "type": "file",
        "section": "card3"
    },
    {
        "name": "card2",
        "url": "",
        "image": "icon2.png",
        "title": "card2",
        "zoom": "1",
        "type": "tile",
        "section": "card3"
    },

    {
        "name": "card1",
        "url": "https://google.com",
        "image": "icon1.png",
        "title": "card1",
        "zoom": "1",
        "type": "web",
        "section": "card2"
    }
]


makeStructure(translateFromFlatSites(flatListOfCards), document.querySelector('.container').lastElementChild.querySelector('.card-footer>button'), listOfIcons)