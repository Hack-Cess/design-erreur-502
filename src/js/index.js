let contextmenuActivated = false

function createContext(x,y,context) {
    let contextmenu = document.getElementById('contextmenu')
    if(contextmenu) {
        contextmenu.innerHTML=""
    } else {
        contextmenu = document.createElement('div')
    }
    contextmenu.style=`top: ${y}px; left: ${x}px;`
    contextmenu.id = "contextmenu"
    context.forEach((element,i) => {
        let realElement = null
        switch(element.type) {
            case 'SEPARATOR':
                realElement = document.createElement('div')
                realElement.classList=['separator']
                break;
            case 'BUTTON':
                realElement = document.createElement('button')
                realElement.addEventListener('click', element.function)
                realElement.id = `context_${i}`
                if(element.icon) {
                    realElement.innerHTML=element.icon
                }
                if(element.content) {
                    realElementText = document.createElement('span')
                    realElementText.innerText = element.content
                    realElement.appendChild(realElementText)
                }
                realElementBackground = document.createElement('div')
                realElementBackground.classList=['bg']
                realElement.appendChild(realElementBackground)
        }
        contextmenu.appendChild(realElement)
    })
    document.body.appendChild(contextmenu)
    if(window.innerWidth-(contextmenu.clientWidth+x)<=0) contextmenu.style=`top: ${y}px; right: ${window.innerWidth-x}px;`
    if(window.innerHeight-(contextmenu.clientHeight+y)<=0) contextmenu.style=`bottom: ${window.innerHeight-y}px; left: ${x}px;`
    if(window.innerWidth-(contextmenu.clientWidth+x)<=0&&window.innerHeight-(contextmenu.clientHeight+y)<=0) contextmenu.style=`bottom: ${window.innerHeight-y}px; right: ${window.innerWidth-x}px;`
    setTimeout(() => {
        if(contextmenuActivated) {
            contextmenu = document.getElementById('contextmenu')
            if(contextmenu) {
                contextmenu.setAttribute('visible','')
            }
        }
    },20)
}

function hideContext() {
    let element = document.getElementById('contextmenu')
    if(element) {
        contextmenuActivated = false
        element.removeAttribute('visible')
    }
}

window.addEventListener('contextmenu', event => {
    event.preventDefault()
    let element = event.target
    let found = false
    while(!found) {
        if(element) {
            if(element.getAttribute('context')!=null) {
                switch(element.getAttribute('context')) {
                    case 'link':
                        found = true
                        link = element.getAttribute('href')
                        contextmenuActivated = true
                        let context = [
                            {
                                "type": "BUTTON",
                                "function": function(e) {
                                    window.open(link, '_blank', 'popup=0');
                                    hideContext()
                                },
                                "content": "Ouvrir le lien dans un nouvel onglet"
                            },
                            {
                                "type": "BUTTON",
                                "function": function(e) {
                                    navigator.clipboard.writeText(link)
                                    hideContext()
                                },
                                "content": "Copier l'adresse du lien"
                            }
                        ]
                        createContext(event.x, event.y, context)
                        break;
                    case 'void':
                    default:
                        found=true
                        hideContext()
                        break;
                }
            } else {
                if(element.tagName.toLowerCase()==undefined||
                element.tagName.toLowerCase()==null||
                element.tagName.toLowerCase()=="html") {
                    found=true
                    hideContext()
                } else {
                    if(element.id == 'contextmenu') found = true
                    element = element.parentElement
                }
            }
        } else {
            found = true
            hideContext()
        }
    }
})
window.addEventListener('click', event => {
    let element = event.target
    let found = false
    let founddelete = true
    while(!found) {
        if(element) {
            if(element.getAttribute('context')!=null) {
                switch(element.getAttribute('context')) {
                    case 'link':
                        found = true
                        let href = element.getAttribute('href')
                        if(href!=null&&element.getAttribute('selected')==null) {
                            window.open(href, element.getAttribute('target')==null?'_self':element.getAttribute('target'), 'popup=0');
                        }
                        break;
                    case 'void':
                    default:
                        found=true
                        break;
                }
            } else {
                if(element.tagName.toLowerCase()==undefined||
                element.tagName.toLowerCase()==null||
                element.tagName.toLowerCase()=="html") {
                    found=true
                } else {
                    if(element.id == 'contextmenu') {
                        found = true;
                        founddelete = false
                    }
                    element = element.parentElement
                }
            }
        } else {
            found = true
        }
    }
    if(founddelete) hideContext()
})

window.addEventListener('resize', event => {
    hideContext()
})