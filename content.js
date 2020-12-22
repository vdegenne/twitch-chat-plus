const LEFT_CLICK = 'LEFT_CLICK'
const RIGHT_CLICK = 'RIGHT_CLICK'
const STREAM_NAME_SELECTOR = '[data-a-target="user-channel-header-item"] p'

let symbols = JSON.parse(localStorage.getItem('symbols')) || []
let me = false

const fancies = {
  a: ['𝕒'],
  b: ['𝕓'],
  c: ['𝕔'],
  d: ['𝕕'],
  e: ['𝕖'],
  f: ['𝕗'],
  g: ['𝕘'],
  h: ['𝕙'],
  i: ['𝕚'],
  j: ['𝕛'],
  k: ['𝕜'],
  l: ['𝕝'],
  m: ['𝕞'],
  n: ['𝕟'],
  o: ['𝕠'],
  p: ['𝕡'],
  q: ['𝕢'],
  r: ['𝕣'],
  s: ['𝕤'],
  t: ['𝕥'],
  u: ['𝕦'],
  v: ['𝕧'],
  w: ['𝕨'],
  x: ['𝕩'],
  y: ['𝕪'],
  z: ['𝕫'],
  A: ['𝔸'],
  B: ['𝔹'],
  C: ['ℂ'],
  D: ['𝔻'],
  E: ['𝔼'],
  F: ['𝔽'],
  G: ['𝔾'],
  H: ['ℍ'],
  I: ['𝕀'],
  J: ['𝕁'],
  K: ['𝕂'],
  L: ['𝕃'],
  M: ['𝕄'],
  N: ['ℕ'],
  O: ['𝕆'],
  P: ['ℙ'],
  Q: ['ℚ'],
  R: ['ℝ'],
  S: ['𝕊'],
  T: ['𝕋'],
  U: ['𝕌'],
  V: ['𝕍'],
  W: ['𝕎'],
  X: ['𝕏'],
  Y: ['𝕐'],
  Z: ['ℤ']
}
const fancyString = string => {
  // const uppermap =

  let converted = ''

  for (const letter of string) {
    if (letter in fancies) {
      converted += fancies[letter][0]
      continue
    }
    converted += letter
    // // lowercase
    // code = string[index].charCodeAt(0) - 97
    // if (code >= 0 && code <= lowermap.length) {
    //   converted += lowermap.slice(code * 2, code * 2 + 2)
    //   continue
    // }
    // // uppercase
    // code = string[index].charCodeAt(0) - 65
    // if (code >= 0 && code <= uppermap.length) {
    //   converted += uppermap.slice(code * 2, code * 2 + 2).replace(' ', '')
    //   continue
    // }
    // converted += string[index]
  }
  return converted
}
const waitElement = async (selector, timeout = 10) => {
  let el = undefined,
    round = 0
  if (timeout < 0) {
    timeout = 999
  }
  while (!el && round++ < timeout) {
    el = document.body.querySelector(selector)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  return el
}

const Observer = {
  CHILD_LIST: 'CHILD_LIST',
  CHARACTER_DATA: 'CHARACTER_DATA',
  observe: function(element, type = this.CHARACTER_DATA, response, subtree = this.CHARACTER_DATA) {
    if (typeof type === 'function') {
      const _response = response
      response = type
      type = this.CHARACTER_DATA
      if (_response) subtree = _response
      if (subtree === undefined) {
        subtree = type === this.CHARACTER_DATA ? true : false
      }
    }

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver
    if (!MutationObserver) {
      throw new Error('update your browser to use this code')
    }

    if (!element || element.nodeType !== 1) {
      throw new Error('element is no valid')
    }

    const observer = new MutationObserver(response)
    observer.observe(element, {
      childList: type === this.CHILD_LIST,
      characterData: type === this.CHARACTER_DATA,

      subtree
    })

    return observer
  }
}

const pasteFct = async e => {
  const path = e.path

  if (path[0].classList.contains('chat-author__display-name')) {
    document.querySelector('[data-test-selector="close-viewer-card"]').click()
    inputText(`@${path[0].innerText} `)
    setTimeout(() => document.querySelector('[data-a-target="chat-input"]').blur(), 100)
    return
  }

  /* get the chat-line */
  let chatline
  for (const el of path) {
    if (el.classList && el.classList.contains('chat-line__message')) {
      chatline = el
    }
  }

  if (!chatline) {
    return
  }
  //console.log('chatline', chatline);

  const messageNodes = Array.prototype.slice.call(chatline.childNodes, 3)
  // console.log(messageNodes);

  let message = ' '
  for (let node of messageNodes) {
    if (node.classList.contains('chat-line__message--emote-button')) {
      node = node.firstElementChild
    }

    if (node.classList.contains('mention-fragment')) {
      message += ` ${node.innerText} `
    } else if (node.hasAttribute('data-a-target') && node.getAttribute('data-a-target') === 'emote-name') {
      message += ` ${node.firstElementChild.alt} `
    } else if (node.classList.contains('text-fragment')) {
      if (node.childNodes[0].localName !== 'span') {
        message += ` ${node.innerText} `
      } else if (node.childNodes[0].localName === 'span') {
        for (const subnode of node.childNodes[0].childNodes) {
          message += ` ${subnode.nodeType === 3 ? subnode.textContent : subnode.childNodes[1].alt} `
        }
      }
    }
  }

  Chat.send(message)

  setTimeout(Chat.scrollToBottom, 100)
}

/**
 * Chat helper Class
 */
class Chat {
  static get inputSelector() {
    return 'textarea[data-a-target=chat-input]'
  }
  static get sendButtonSelector() {
    return '[data-a-target=chat-send-button]'
  }
  static get inputElement() {
    return document.querySelector(Chat.inputSelector)
  }

  static get sendButton() {
    return document.querySelector(Chat.sendButtonSelector)
  }

  static async bindEvents() {
    Promise.all([waitElement(Chat.inputSelector, -1), waitElement(Chat.sendButtonSelector, -1)]).then(elements => {
      elements[0].addEventListener('keydown', e => {
        if (e.keyCode === 13) {
          // enter
          e.preventDefault()
          e.stopPropagation()
          Chat.send(Chat.text)
        }
      })
      elements[1].addEventListener('click', e => {
        Chat.send(Chat.text)
      })
    })
  }

  static async addSymbolsInput() {
    const element = await waitElement('[data-test-selector="chat-input-buttons-container"]')
    if (element) {
    }

    document.querySelector('[data-test-selector="chat-input-buttons-container"]').style.alignItems = 'center'

    /* input */
    let input = $(`<input type="text" placeholder="symbols..." style="height:27px;padding:0 4px;max-width:140px;" value="${symbols.join(',')}">`)
    input.value = JSON.parse(localStorage.getItem('symbols'))
    input.on('keyup', e => {
      symbols = e.target.value.split(',')
      localStorage.setItem('symbols', JSON.stringify(symbols))
    })
    input.insertAfter(element.firstElementChild)

    /* me */
    let meCheckbox = $(
      `<label style="cursor:pointer;display:flex;align-items:center;margin-left:5px;"><input type=checkbox style="cursor:pointer"><span>/me</span></label>`
    )
    meCheckbox.on('change', e => {
      me = e.target.checked
    })
    meCheckbox.insertAfter(element.firstElementChild.nextElementSibling)
  }

  static notifyInputElement() {
    const changevent = document.createEvent('Events')
    changevent.initEvent('change', true, true)
    Chat.inputElement.dispatchEvent(changevent)
  }

  static get text() {
    return Chat.inputElement.value
  }

  static set text(text) {
    Chat.inputElement.value = text
    // Chat.inputElement.innerText = text ?
    Chat.notifyInputElement()
  }

  static async send(text = undefined) {
    const button = Chat.sendButton
    const clickSendButton = () => button.click()

    if (text !== undefined) {
      let parts = text.split('++')
      for (let part of parts) {
        let text = ''
        part = part.trim()
        // empty line or only symbol, continue
        if (!part.length || (part.length === 1 && symbols.includes(part[0]))) {
          continue
        }

        // replace fancy
        part = part.replace(/\[([^\]])+\]/g, match => fancyString(match.substring(1, match.length - 1))).trim()

        // ensure /me is not ignored
        if (part.startsWith('/me')) {
          text += '/me '
          part = part.replace('/me', '').trim()
        } else if (me) {
          text += '/me '
        }

        // starting with ! or starting with symbol, pass
        if (part[0] !== '!' && !symbols.some(s => part.startsWith(s))) {
          text += symbols[Math.floor(Math.random() * symbols.length)] + ' ' + part
        } else {
          text += part
        }

        Chat.text = text
        clickSendButton()
        while (document.body.querySelector('[data-test-selector="chat-input-tray"]')) {
          await new Promise(resolve => setTimeout(resolve, 120))
          clickSendButton()
        }
        if (parts.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 600))
        }
      }
    } else {
      clickSendButton()
    }
  }

  static async clear() {
    document.querySelector('[aria-label="Chat settings"]').click()
    let clearButton
    do {
      clearButton = document.querySelector('.clearChat')
      await new Promise(resolve => setTimeout(resolve, 50))
    } while (!clearButton)
    clearButton.click()
    document.querySelector('[aria-label="Chat settings"]').click()
  }

  static scrollToBottom() {
    try {
      document.querySelector('[data-a-target="chat-list-footer"] > div').click()
    } catch (e) {
      // console.log(e)
      /**/
    }
  }
}

/* bind events */
window.addEventListener('click', pasteFct)
// window.addEventListener('contextmenu', (e) => pasteFct(e, RIGHT_CLICK));
window.addEventListener('keydown', e => {
  if (e.key === 'F5') {
    e.preventDefault()
    Chat.clear()
  }
})

const chatlineStyle = document.createElement('style')
chatlineStyle.innerText = '[class^=chat-line__message] { cursor: pointer } [class^=chat-line__message]:hover { opacity: .7 }'
document.body.appendChild(chatlineStyle)

let firstTimeExec = true
const init = async () => {
  let scriptloaded = false
  await Chat.bindEvents()
  await Chat.addSymbolsInput()

  waitElement('[data-test-selector="pinned-cheers-container"]').then(el => {
    if (el) el.parentElement.remove()
    if (!scriptloaded) {
      scriptloaded = true
      toastit('TwitchChatPlus initialised')
    }
  })
  waitElement('.channel-leaderboard').then(el => {
    if (el) el.parentElement.remove()
    if (!scriptloaded) {
      scriptloaded = true
      toastit('TwitchChatPlus initialised')
    }
  })

  if (firstTimeExec) {
    $('<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">').appendTo('head')
    const snackbar = document.createElement('mwc-snackbar')
    snackbar.id = 'snackbar'
    // snackbar.leading = true
    document.body.appendChild(snackbar)

    // community points
    setInterval(() => {
      const button = document.querySelector('[data-test-selector="community-points-summary"] .tw-button.tw-button--success')
      if (button) {
        button.click()
      }
    }, 2000)

    firstTimeExec = false
  }
}

init()
waitElement(STREAM_NAME_SELECTOR).then(el => {
  Observer.observe(el, _ => {
    setTimeout(init, 1000)
  })
})

const toastit = message => {
  snackbar.labelText = message
  snackbar.open()
}
