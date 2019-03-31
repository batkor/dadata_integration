import Drupal from 'drupalCore';
import drupalSettings from 'drupalSettingsCore';
import Dadata from 'dadata-suggestions';


Drupal.behaviors.DadataInit = {
  settings: [],
  attach: function (context, settings, elements) {
    context = context || document;
    settings = settings || drupalSettings;
    this.settings = elements || settings.dadata.builder.elements;
    // Create dadate object.
    let dadata = new Dadata(settings.dadata.api_key);
    for (let key of Object.keys(this.settings)) {
      if (!this.settings[key].is_found) {
        return;
      }
      let elems = context.querySelectorAll(this.settings[key].selector);

      if (elems.length) {
        // For each finding elems add event.
        elems.forEach((elem) => {
          // Add class for init only once.
          elem.classList.add('dadata_init');
          // Add event change value.
          elem.oninput = Drupal.debounce(() => {
            let params = Object.assign({
              query: elem.value
            }, this.settings[key]);
            dadata[this.settings[key].api](params)
                .then(response => response.json())
                .then((data) => {
                  // Init popup UI.
                  this.popup.init(elem, data.suggestions);
                })
                .catch(function (error) {
                  console.error(error);
                });
          }, 300)
        })
      }
    }

  },
  /**
   * Add event and UI|UX for popup wrapper and items.
   */
  popup: {
    /**
     * Class for wrapper element.
     */
    wrapperClass: 'dd_wrapper',
    /**
     * Init popup for element and add items.
     *
     * @param {Node} elem
     * @param {array} values
     */
    init: function (elem, values) {
      let elem_parent = elem.parentNode;
      // Set position relative for parent element.
      elem_parent.style.position = 'relative';
      // Find wrapper.
      let wrapper = elem_parent.querySelector(`.${this.wrapperClass}`);
      if (!wrapper) {
        // Add wrapper for popup if not found.
        wrapper = document.createElement('div');
        wrapper.classList.add(this.wrapperClass);
        wrapper.style.width = `${elem.offsetWidth}px`;
        elem_parent.insertBefore(wrapper, elem.nextSibling);
      }
      wrapper.style.display = 'inherit';
      // Add event for close popup.
      this.onClickClose(wrapper);
      // Clear old values.
      this.clearItems(wrapper);
      // Add new item values in popup.
      values.forEach((item) => {
        let item_value = this.itemBuild(item.value);

        // Event click in item.
        function itemClick(event) {
          elem.value = event.target.innerText;
          event.target.parentNode.style.display = 'none';
        }

        item_value.addEventListener('click', itemClick);
        wrapper.appendChild(item_value);
      })
    },
    /**
     * Return item in popup.
     *
     * @param {string} value
     * @returns {HTMLSpanElement}
     */
    itemBuild: function (value) {
      let item = document.createElement('span');
      item.classList.add('item');
      item.innerText = value;
      return item;
    },
    /**
     * Remove all children in popup wrapper.
     *
     * @param elem
     */
    clearItems: function (elem) {
      while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
      }
    },
    /**
     * Event for close popup.
     *
     * @param elem
     */
    onClickClose: function (elem) {
      function outsideClickListener(event) {
        if (!elem.contains(event.target)) {
          elem.style.display = 'none';
          document.removeEventListener('click', outsideClickListener);
        }
      }

      document.addEventListener('click', outsideClickListener);
    }
  }
};