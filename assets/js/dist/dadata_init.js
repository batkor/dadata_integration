(function (Drupal, drupalSettings) {
  'use strict';

  Drupal = Drupal && Drupal.hasOwnProperty('default') ? Drupal['default'] : Drupal;
  drupalSettings = drupalSettings && drupalSettings.hasOwnProperty('default') ? drupalSettings['default'] : drupalSettings;

  /**
   * Dadata API class
   */
  class Dadata {
    /**
     * API constructor
     * @param {string} apiKey Ключ dadata.ru
     */
    constructor(apiKey) {
      this.apiKey = apiKey;
    }

    /**
     * Возращает путь для запроса в DadataApi в зависимости от параметра.
     *
     * @param api
     * @returns {string}
     * @private
     */
    _path(api) {
      return `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/${api}`;
    }

    /**
     * Возвращает заголовок для запроса.
     *
     * @returns {{Authorization: string, Accept: string, "Content-Type": string}}
     * @private
     */
    _headers() {
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${this.apiKey}`
      };
    }

    /**
     * Клиент
     *
     * @private
     * @param {string} api Название метода
     * @param {params} params Параметры
     * @returns {promise}
     */
    _client(api, params) {
      let request = Object.assign({
        count: 10
      }, params);
      let options = {
        method: 'POST',
        headers: this._headers(),
        body: JSON.stringify(request)
      };
      return fetch(this._path(api), options);
    }

    /**
     * Подсказки по ФИО
     *
     * @see {@link https://confluence.hflabs.ru/pages/viewpage.action?pageId=502038691|Документация}
     *
     * @param {object} params Параметры
     * @param {string} params.query Запрос
     * @param {number} [params.count=10] Кол-во возвращаемых результатов
     * @param {string[]} [params.parts=null] Подсказки по части ФИО (NAME,
     *     SURNAME, PATRONYMIC)
     * @param {string} [params.gender=UNKNOWN] Пол
     * @return {promise<object[]>}
     */
    fio(params) {
      return this._client('fio', params)
    }

    /**
     * Подсказки по адресу
     *
     * @see {@link https://confluence.hflabs.ru/pages/viewpage.action?pageId=502038680|Документация}
     * @param {object} params Параметры
     * @param {string} params.query Запрос
     * @param {number} [params.count=10] Кол-во возвращаемых результатов
     * @param {object} [params.locations=] Ограничение поиска адреса
     * @param {number} params.location.region_fias_id Ограничение по ФИАС коду
     *     региона
     * @param {number} params.location.area_fias_id Ограничение по ФИАС коду
     *     области
     * @param {number} params.location.city_fias_id Ограничение по ФИАС коду
     *     города
     * @param {number} params.location.settlement_fias_id Ограничение по ФИАС
     *     коду населенного пункта
     * @param {number} params.location.street_fias_id Ограничение по ФИАС коду
     *     улицы
     * @return {promise<object[]>}
     */
    address(params) {
      return this._client('address', params)
    }

    /**
     * Подсказки по организациям
     *
     * @see {@link https://confluence.hflabs.ru/pages/viewpage.action?pageId=502038697|Документация}
     *
     * @param {object} params Параметры
     * @param {string} params.query Запрос
     * @param {number} [params.count=10] Кол-во возвращаемых результатов
     * @param {string[]} [params.status=null] Фильтр по статусу организации
     *     (ACTIVE - активные, LIQUIDATING - ликвидируемые, LIQUIDATED -
     *     ликвидированные)
     * @param {string} [params.type=null] Фильтр по юридическим лицам (LEGAL) или
     *     индивидуальным предпринимателям (INDIVIDUAL)
     * @param {object[]} params.locations Фильтр по региону
     * @param {number} params.locations.kladr_id Двухзначный код региона по КЛАДР
     * @return {promise<object[]>}
     */
    party(params) {
      return this._client('party', params)
    }

    /**
     * Подсказки по банкам
     *
     * @see {@link https://confluence.hflabs.ru/pages/viewpage.action?pageId=502038711|Документация}
     *
     * @param {object} params Параметры
     * @param {string} params.query Запрос
     * @param {number} [params.count=10] Кол-во возвращаемых результатов
     * @param {string[]} [params.status=null] Фильтр по статусу (ACTIVE -
     *     активные, LIQUIDATING - ликвидируемые, LIQUIDATED - ликвидированные)
     * @param {string} [params.type=null] Фильтр по типу банковской организации
     *     BANK - банк, NKO - небанковская кредитная организация, BANK_BRANCH -
     *     филиал банка, NKO_BRANCH - филиал небанковской кредитной организации,
     *     RKC - РКЦ / ГРКЦ, OTHER - другое
     * @return {promise<object[]>}
     */
    bank(params) {
      return this._client('bank', params)
    }

    /**
     * Подсказки по email
     *
     * @see {@link https://confluence.hflabs.ru/pages/viewpage.action?pageId=502038705|Документация}
     *
     * @param {object} params Параметры
     * @param {string} params.query Запрос
     * @param {number} [params.count=10] Кол-во возвращаемых результатов
     * @return {promise<object[]>}
     */
    email(params) {
      return this._client('email', params)
    }
  }

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
            }, 300);
          });
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
        });
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

}(Drupal, drupalSettings));
