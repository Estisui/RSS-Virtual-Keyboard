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
  },

  init() {
    // creation
    this.elements.textArea = document.createElement('textarea');
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // setup
    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.textArea.classList.add('textarea');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.textArea);
    document.body.appendChild(this.elements.main);

    document.addEventListener('oninput', this.triggerEvent());
  },

  createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter',
      'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'up', 'shift2',
      'ctrl', 'win', 'alt', 'space', 'alt', 'left', 'down', 'right', 'ctrl',
    ];

    // html icon
    const createIconHTML = (iconName) => `<i class='material-icons'>${iconName}</i>`;

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', '\\', 'enter', 'shift2'].indexOf(key) !== -1;

      // add attributes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
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
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            if (this.properties.capsLock === this.properties.shift) {
              this.properties.value += key.toLowerCase();
            } else {
              this.properties.value += key.toUpperCase();
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

  triggerEvent(handlerName) {
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
    KEYBOARD.properties.shift = !KEYBOARD.properties.shift;
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
    KEYBOARD.properties.shift = !KEYBOARD.properties.shift;
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
};

KEYBOARD.init();
