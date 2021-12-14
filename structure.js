
const makeStructure = (obj, baseElement, listOfIconsLocal) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') {
            let card = createIconCard(listOfIconsLocal, false, obj[key].title, obj[key].type, obj[key].url, obj[key].image)
            let newBase = baseElement
            if (key != 'children') {
                baseElement.parentNode.appendChild(card)
                newBase = baseElement.parentNode.lastElementChild.querySelector('.card-footer>button')
            }
            makeStructure(obj[key], newBase, listOfIconsLocal)
        }
    })
}

function createInputBtn(isTileValue, isCheckedValue, sinceEpoch, typeName){

    let btnInput = document.createElement('input')
    btnInput.classList.add('btn-check', 'radio-type')
    btnInput.disabled = isTileValue
    btnInput.checked = isCheckedValue
    btnInput.setAttribute('type', 'radio')
    btnInput.setAttribute('id', `${typeName}-${sinceEpoch}`)
    btnInput.setAttribute('name', `type-${sinceEpoch}`)
    let btnLabel = document.createElement('label')
    btnLabel.classList.add('btn', 'btn-sm', 'btn-secondary')
    btnLabel.setAttribute('for', `${typeName}-${sinceEpoch}`)
    btnLabel.innerText = typeName

    return {
        'button': btnInput,
        'label': btnLabel
    }
}




function editText(x) {
    if (x.nodeName != "INPUT") {
        let editInput = document.createElement('input')
        editInput.classList.add('form-control')
        editInput.setAttribute('type', 'text')
        editInput.setAttribute('value', x.firstElementChild.value.trim())
        x.parentNode.appendChild(editInput)
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

function addCard(x, listOfIcons) {
    x.parentNode.appendChild(createIconCard(listOfIcons, true))
    if (x.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName != "BODY") {
        x.parentNode.parentElement.firstElementChild.querySelector('.btn-group').querySelectorAll('input').forEach(el => el.disabled = true)
    }
}

function createIconCard(iconList, easing = false, cardName = "", cardType = "file", urlValue = "", iconName = "") {

    let sinceEpoch = parseInt(new Date().getTime() * Math.random())
    let isChecked = {
        "web": false,
        "file": false,
        "fileList": false
    }
    let isTile = false
    let isUrlDisabled = true

    switch (cardType) {
        case "web":
            isChecked.web = true
            isUrlDisabled = false
            break;
        case "tile":
            isTile = true
            break;
        case "file":
            isChecked.file = true
            break;
        case "fileList":
            isChecked.fileList = true
            break;
    }


    var newCard = document.createElement('div')
    newCard.classList.add("card", "border", "border-a", "m-3", "shadow-strong-5")
    if (easing) {
        newCard.classList.add("easing")
    }

    var newBody = document.createElement('div')
    newBody.classList.add("card-body", "pb-1", "pt-1")

    let bodyRow = document.createElement('div')
    bodyRow.classList.add("row")


    let bodyCol1 = document.createElement('div')
    let bodyCol2 = document.createElement('div')
    let bodyCol3 = document.createElement('div')
    let bodyCol4 = document.createElement('div')
    let bodyCol5 = document.createElement('div')


    bodyCol1.classList.add("col-2")

    let input1 = document.createElement('input')
    input1.setAttribute('id', 'card-name')
    input1.setAttribute('required', true)
    input1.setAttribute('type', 'text')
    input1.setAttribute('placeholder', 'Type Name')
    input1.setAttribute('value', cardName)
    input1.classList.add('form-control')

    bodyCol1.appendChild(input1)



    bodyCol2.classList.add("col-2")
    bodyCol2.setAttribute('id', 'col-select')

    bodyCol3.classList.add("col-3")


    let btnGroup = document.createElement('div')
    btnGroup.classList.add('btn-group')
    btnGroup.setAttribute('role', 'group')


    btn1 = createInputBtn(isTile, isChecked.web, sinceEpoch, 'web')
    btn2 = createInputBtn(isTile, isChecked.file, sinceEpoch, 'file')
    btn3 = createInputBtn(isTile, isChecked.fileList, sinceEpoch, 'fileList')

    btnGroup.appendChild(btn1.button)
    btnGroup.appendChild(btn1.label)
    btnGroup.appendChild(btn2.button)
    btnGroup.appendChild(btn2.label)
    btnGroup.appendChild(btn3.button)
    btnGroup.appendChild(btn3.label)


    bodyCol3.appendChild(btnGroup)

    bodyCol4.classList.add("col-4")

    let input2 = document.createElement('input')
    input2.setAttribute('id', 'web-url')
    input2.disabled = isUrlDisabled
    input2.setAttribute('type', 'text')
    input2.setAttribute('placeholder', 'Type URL')
    input2.setAttribute('value', urlValue)
    input2.classList.add('form-control')

    bodyCol4.appendChild(input2)






    bodyCol5.classList.add("col-1")

    let button1 = document.createElement('button')
    button1.setAttribute('id', 'remove-button')
    button1.setAttribute('type', 'button')
    button1.classList.add('btn', 'btn-sm', 'btn-danger')
    button1.innerText = "-"

    bodyCol5.appendChild(button1)




    bodyRow.appendChild(bodyCol1)
    bodyRow.appendChild(bodyCol2)
    bodyRow.appendChild(bodyCol3)
    bodyRow.appendChild(bodyCol4)
    bodyRow.appendChild(bodyCol5)

    newBody.appendChild(bodyRow)


    var newSelect = document.createElement('select')
    newSelect.setAttribute('type', 'text')
    newSelect.classList.add("form-select", "text-light", "bg-dark")
    newSelect.setAttribute('id', "icon-name")
    newSelect.setAttribute('value', iconName)
    iconList.forEach(x => {
        let newOption = document.createElement('option')
        newOption.setAttribute('value', x)
        newOption.innerText = x
        if (x == iconName) {
            newOption.setAttribute('selected', true)
        }
        newSelect.appendChild(newOption)
    })
    newBody.querySelector('#col-select').appendChild(newSelect)

    var newFooter = document.createElement('div')
    newFooter.classList.add("card-footer", "pb-1", "pt-1")

    var newFooterButton = document.createElement('button')
    newFooterButton.classList.add("btn", "btn-sm", "btn-info", "add-button")
    newFooterButton.setAttribute('type', 'button')
    newFooterButton.innerText = "+"

    newFooter.appendChild(newFooterButton)
    newFooter.querySelector('button').addEventListener('click', (e) => {
        addCard(e.target, iconList);
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




document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#my-form').addEventListener('submit', function(e) {
        e.preventDefault()
        console.log('form submit')
            // e.submit()
        let stackedStructureResult = getStructure(document.querySelector('.container').children[0])
            // console.log(stackedStructureResult)
        let flatStructureResult = translateToFlatSites(stackedStructureResult)
            // console.log(flatStructureResult)
        ipcRenderer.send('fromConfigList', flatStructureResult)

    })

    document.querySelectorAll('.add-button').forEach(x => {
        x.addEventListener('click', (e) => {
            addCard(e.target, listOfFileIcons)
        })
    })


    makeStructure(translateFromFlatSites(flatListOfCards), document.querySelector('.container').lastElementChild.querySelector('.card-footer>button'), listOfIcons)
})