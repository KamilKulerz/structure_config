//!TODO not finished
function getStructure(mainElement) {
    let myStructure = {}
    let cond
    try {
        cond = mainElement.children[2].children.length
    } catch {
        cond = -1
    }
    if (cond <= 1) {

        // myStructure.push(mainElement.firstElementChild.firstElementChild.firstElementChild.firstElementChild.value)
        return myStructure
    } else {
        Array.from(mainElement.children[2].children).forEach(x => {
            if (x.nodeName != "BUTTON") {
                let mainElementName = x.firstElementChild.firstElementChild.firstElementChild.firstElementChild.value
                    // myStructure.push([mainElementName, getStructure(x)])
                myStructure[mainElementName] = {
                    'name': mainElementName,
                    'type': 'file',
                    'children': getStructure(x)
                }
            }

        })
    }
    return myStructure
}

document.querySelector('#my-form').addEventListener('submit', function(e) {
    e.preventDefault()
    console.log(getStructure(document.querySelector('.container').children[0]))
})

function editText(x) {
    if (x.nodeName != "INPUT") {
        x.parentNode.innerHTML = `<input class="form-control" type="text" value="${x.firstElementChild.value.trim()}">`
    }
}


function changeCheck(x) {
    console.log(x)
    if (x.checked == true && x.id.includes("web")) {
        x.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.card-footer>button').disabled = true
    } else {
        x.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.card-footer>button').disabled = false

    }

}

function removeCard(x) {
    x.parentNode.parentNode.parentNode.parentNode.classList.remove('easing')
    x.parentNode.parentNode.parentNode.parentNode.classList.add('easing-out')
    setTimeout(() => {
        x.parentNode.parentNode.parentNode.parentNode.remove()
    }, 200)
}


function createIconCard() {

    sinceEpoch = new Date().getTime()

    var newCard = document.createElement('div')
    newCard.className = "card border border-a m-3 shadow-strong-5 easing"

    var newHeader = document.createElement('div')
    newHeader.className = "card-header pb-1 pt-1"
    newHeader.innerHTML = `<div class="row">
                                    <div class="col-4">
                                        <input required class="form-control" type="text" placeholder="Type Name">
                                    </div>
                                    <div class="col-7">

                                    </div>
                                    <div class="col-1">
                                        <button class="btn btn-sm btn-danger" onclick="removeCard(this)">-</button>
                                    </div>
                                </div>`

    var newBody = document.createElement('div')
    newBody.className = "card-body pb-1 pt-1"
    newBody.innerHTML = `<div class="row">
                                <div class="col-4">
                                    <p class="m-2">Icon</p>
                                </div>
                                <div class="col-4">
                                        <div class="btn-group" role="group">
                                            <input class="btn-check" type="radio" id="web-${sinceEpoch}"
                                                name="type-${sinceEpoch}"
                                                onchange="changeCheck(this)">
                                            <label class="btn btn-secondary" for="web-${sinceEpoch}">web</label>
                                            <input class="btn-check" type="radio" id="file-${sinceEpoch}"
                                                name="type-${sinceEpoch}"
                                                onchange="changeCheck(this)">
                                            <label class="btn btn-secondary" for="file-${sinceEpoch}">file</label>
                                            <input class="btn-check" type="radio" id="fileList-${sinceEpoch}"
                                                name="type-${sinceEpoch}"
                                                onchange="changeCheck(this)">
                                            <label class="btn btn-secondary" for="fileList-${sinceEpoch}">fileList</label>
                                        </div>
                                </div>
                            </div>`

    var newFooter = document.createElement('div')
    newFooter.className = "card-footer pb-1 pt-1"
    newFooter.innerHTML = `<button class="btn btn-sm btn-info" onclick="addCard(this)">+</button>`


    newCard.appendChild(newHeader)
    newCard.appendChild(newBody)
    newCard.appendChild(newFooter)

    return newCard
}

function addCard(x) {
    console.log(x)
    x.parentNode.appendChild(createIconCard())
}

function addCardInline(x) {
    x.parentNode.parentNode.childNodes[2].appendChild(createIconCard())
        //x.parentNode.parentNode.childNodes[1].classList.toggle('animated')
        //x.parentNode.parentNode.childNodes[1].classList.toggle('fadeInLeft')
}