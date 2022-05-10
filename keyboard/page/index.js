const KEYBOARD = {
  elements: {
    textArea: null,
    main: null,
    keysContainer: null,
    keys: [],
    shiftKeys: [],
  },

  eventHandlers: {
    oninput: null,
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    english: true,
  },

  init() {
    // creation
    this.elements.textArea = document.createElement('textarea');
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    const LINKBLOCK = document.createElement('a');
    const TEXTBLOCK = document.createElement('p');

    // language
    this.properties.english = (typeof localStorage.getItem('english') !== 'undefined' ? (localStorage.getItem('english') === 'true') : true);

    // setup
    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.textArea.classList.add('textarea');
    this.elements.textArea.setAttribute('readonly', true);
    this.elements.keysContainer.appendChild(this.createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    LINKBLOCK.href = 'https://github.com/Estisui/RSS-Virtual-Keyboard/pulls';
    LINKBLOCK.innerText = 'Link to pull request';
    TEXTBLOCK.innerText = 'Created on Windows - Alt+Shift for language change';
    // add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.textArea);
    document.body.appendChild(this.elements.main);
    document.body.appendChild(LINKBLOCK);
    document.body.appendChild(TEXTBLOCK);

    document.addEventListener('keydown', (event) => {
      this.keyPressed(event.code, event.repeat, event.altKey, event.shiftKey);
    });
    document.addEventListener('keyup', (event) => {
      this.keyUnpressed(event.code, event.altKey);
    });
    document.addEventListener('oninput', this.triggerEvent);
  },

  createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      ['Backquote', '`', 'ё'], ['Digit1', '1'], ['Digit2', '2'], ['Digit3', '3'], ['Digit4', '4'], ['Digit5', '5'], ['Digit6', '6'], ['Digit7', '7'], ['Digit8', '8'], ['Digit9', '9'], ['Digit0', '0'], ['Minus', '-'], ['Equal', '='], ['Backspace', 'backspace'],
      ['Tab', 'tab'], ['KeyQ', 'q', 'й'], ['KeyW', 'w', 'ц'], ['KeyE', 'e', 'у'], ['KeyR', 'r', 'к'], ['KeyT', 't', 'е'], ['KeyY', 'y', 'н'], ['KeyU', 'u', 'г'], ['KeyI', 'i', 'ш'], ['KeyO', 'o', 'щ'], ['KeyP', 'p', 'з'], ['BracketLeft', '[', 'х'], ['BracketRight', ']', 'ъ'], ['Backslash', '\\'],
      ['CapsLock', 'caps'], ['KeyA', 'a', 'ф'], ['KeyS', 's', 'ы'], ['KeyD', 'd', 'в'], ['KeyF', 'f', 'а'], ['KeyG', 'g', 'п'], ['KeyH', 'h', 'р'], ['KeyJ', 'j', 'о'], ['KeyK', 'k', 'л'], ['KeyL', 'l', 'д'], ['Semicolon', ';', 'ж'], ['Quote', '\'', 'э'], ['Enter', 'enter'],
      ['ShiftLeft', 'shift'], ['KeyZ', 'z', 'я'], ['KeyX', 'x', 'ч'], ['KeyC', 'c', 'с'], ['KeyV', 'v', 'м'], ['KeyB', 'b', 'и'], ['KeyN', 'n', 'т'], ['KeyM', 'm', 'ь'], ['Comma', ',', 'б'], ['Period', '.', 'ю'], ['Slash', '/', '.'], ['ArrowUp', 'up'], ['ShiftRight', 'shift2'],
      ['ControlLeft', 'ctrl'], ['MetaLeft', 'win'], ['AltLeft', 'alt'], ['Space', 'space'], ['AltRight', 'alt'], ['ArrowLeft', 'left'], ['ArrowDown', 'down'], ['ArrowRight', 'right'], ['ControlRight', 'ctrl'],
    ];

    // html icon
    const createIconHTML = (iconName) => `<i class='material-icons'>${iconName}</i>`;

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', '\\', 'enter', 'shift2'].indexOf(key) !== -1;

      // add attributes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      const [keyId, keyValue, keyValue2] = key;
      keyElement.id = (keyId);
      keyElement.engValue = keyValue;
      const keyRusValue = keyValue2 || keyValue;
      keyElement.rusValue = keyRusValue;

      switch (keyValue) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');
          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties
              .value.substring(0, this.properties.value.length - 1);
            this.triggerEvent('oninput');
          });
          break;
        case 'tab':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_tab');
          keyElement.addEventListener('click', () => {
            this.properties.value += '\t';
            this.triggerEvent('oninput');
          });
          break;
        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activadable');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');
          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });
          break;
        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');
          keyElement.addEventListener('click', () => {
            this.properties.value += '\n';
            this.triggerEvent('oninput');
          });
          break;
        case 'shift':
        case 'shift2':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_double_arrow_up');
          keyElement.addEventListener('mousedown', KEYBOARD.toggleShift);
          this.elements.shiftKeys.push(keyElement);
          break;
        case 'up':
          keyElement.innerHTML = createIconHTML('arrow_drop_up');
          keyElement.addEventListener('click', () => {
            this.properties.value += '↑';
            this.triggerEvent('oninput');
          });
          break;
        case 'ctrl':
          keyElement.innerHTML = createIconHTML('keyboard_control_key');
          break;
        case 'win':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_command_key');
          break;
        case 'alt':
          keyElement.innerHTML = createIconHTML('keyboard_alt');
          break;
        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');
          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this.triggerEvent('oninput');
          });
          break;
        case 'left':
          keyElement.innerHTML = createIconHTML('arrow_left');
          keyElement.addEventListener('click', () => {
            this.properties.value += '←';
            this.triggerEvent('oninput');
          });
          break;
        case 'down':
          keyElement.innerHTML = createIconHTML('arrow_drop_down');
          keyElement.addEventListener('click', () => {
            this.properties.value += '↓';
            this.triggerEvent('oninput');
          });
          break;
        case 'right':
          keyElement.innerHTML = createIconHTML('arrow_right');
          keyElement.addEventListener('click', () => {
            this.properties.value += '→';
            this.triggerEvent('oninput');
          });
          break;
        default:
          if (this.properties.english === true) {
            keyElement.textContent = keyValue.toLowerCase();
          } else {
            keyElement.textContent = keyRusValue.toLowerCase();
          }
          keyElement.addEventListener('click', () => {
            if (this.properties.capsLock === this.properties.shift
              && this.properties.english === true) {
              this.properties.value += keyValue.toLowerCase();
            } else if (this.properties.capsLock !== this.properties.shift
              && this.properties.english === true) {
              this.properties.value += keyValue.toUpperCase();
            } else if (this.properties.capsLock === this.properties.shift
              && this.properties.english === false) {
              this.properties.value += keyRusValue.toLowerCase();
            } else {
              this.properties.value += keyRusValue.toUpperCase();
            }
            this.triggerEvent('oninput');
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  triggerEvent() {
    this.elements.textArea.value = this.properties.value;
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    /* eslint-disable-next-line */
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.capsLock === this.properties.shift) {
          key.textContent = key.textContent.toLowerCase();
        } else {
          key.textContent = key.textContent.toUpperCase();
        }
      }
    }
  },

  toggleShift() {
    KEYBOARD.properties.shift = true;
    KEYBOARD.elements.shiftKeys.forEach((element) => {
      element.removeEventListener('mousedown', KEYBOARD.toggleShift);
    });
    /* eslint-disable-next-line */
    for (const key of KEYBOARD.elements.keys) {
      if (key.childElementCount === 0) {
        if (KEYBOARD.properties.capsLock === KEYBOARD.properties.shift) {
          key.textContent = key.textContent.toLowerCase();
        } else {
          key.textContent = key.textContent.toUpperCase();
        }
      }
    }
    KEYBOARD.elements.shiftKeys.forEach((element) => {
      element.addEventListener('mouseup', KEYBOARD.untoggleShift);
    });
  },

  untoggleShift() {
    KEYBOARD.properties.shift = false;
    KEYBOARD.elements.shiftKeys.forEach((element) => {
      element.removeEventListener('mouseup', KEYBOARD.untoggleShift);
    });
    /* eslint-disable-next-line */
    for (const key of KEYBOARD.elements.keys) {
      if (key.childElementCount === 0) {
        if (KEYBOARD.properties.capsLock === KEYBOARD.properties.shift) {
          key.textContent = key.textContent.toLowerCase();
        } else {
          key.textContent = key.textContent.toUpperCase();
        }
      }
    }
    KEYBOARD.elements.shiftKeys.forEach((element) => {
      element.addEventListener('mousedown', KEYBOARD.toggleShift);
    });
  },

  keyPressed(key, repeat, altKey, shiftKey) {
    if (document.getElementById(key)) {
      const currentKey = document.getElementById(key);
      currentKey.classList.add('active');
      if (shiftKey === true && altKey === true && repeat === false) {
        this.changeLanguage();
      } else if ((key === 'ShiftLeft' || key === 'ShiftRight') && altKey === false && repeat === false) {
        KEYBOARD.toggleShift();
      } else {
        const clickEvent = new Event('click');
        currentKey.dispatchEvent(clickEvent);
      }
    }
  },

  keyUnpressed(key, altKey) {
    if (document.getElementById(key)) {
      const currentKey = document.getElementById(key);
      currentKey.classList.remove('active');
      if (key === 'ShiftLeft' || key === 'ShiftRight' && altKey === false) {
        KEYBOARD.untoggleShift();
      }
    }
  },

  changeLanguage() {
    this.properties.english = !this.properties.english;
    localStorage.setItem('english', this.properties.english);
    /* eslint-disable-next-line */
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.capsLock === this.properties.shift
          && this.properties.english === true) {
          key.textContent = key.engValue.toLowerCase();
        } else if (this.properties.capsLock !== this.properties.shift
          && this.properties.english === true) {
          key.textContent = key.engValue.toUpperCase();
        } else if (this.properties.capsLock === this.properties.shift
          && this.properties.english === false) {
          key.textContent = key.rusValue.toLowerCase();
        } else {
          key.textContent = key.rusValue.toUpperCase();
        }
      }
    }
  },
};

KEYBOARD.init();
