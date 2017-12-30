(function ($, window, Drupal, drupalSettings) {
  Drupal.behaviors.dadataIntegration = {
    attach: function (context, drupalSettings) {
      //get setting dadata_integration modules
      var setting_dadata = drupalSettings.dadata_integration;
      //set api key
      var api_key = setting_dadata.api_key;
      //created array popup windows
      setting_dadata['set_address_popup'] = 'set_address_popup' in setting_dadata ? setting_dadata['set_address_popup'] : [];
      var set_address_popup = setting_dadata['set_address_popup'];

      $('[class*="input_popup_address"]').once('input_popup_address_elems').each(function (ind, elem) {
        var input_address = $(elem).find('input[type="text"]');
        var text_link = (input_address.val() === '') ? 'Add address' : 'Edit address';
        $(elem).after('<span class="set_address">[ <span class="link">' + Drupal.t(text_link) + '</span> ]</span>');
        $(elem).parent().once('set_address_popup').on('click', '.set_address', function (e) {
          var items_address = [
            $("<div>", {
              class: 'content',
              append: [
                createdElem('region_area', 'form-item', 'Регион / район:', ''),
                createdElem('city_settlement', 'form-item', 'Город / населенный пункт:', ''),
                $('<div>', {
                  class: 'streeet_house',
                  append: [
                    createdElem('street', 'form-item inline', 'Улица', ''),
                    createdElem('house', 'form-item inline', 'Дом', ''),
                  ]
                })
              ]
            })
          ];
          if (!(ind in set_address_popup)) {
            set_address_popup[ind] = Drupal.dialog(items_address, {
              title: text_link,
              dialogClass: 'set_address_modal_' + ind,
              width: 500,
              autoResize: true,
              buttons: [
                {
                  text: 'Close',
                  icons: {
                    primary: 'ui-icon-close'
                  },
                  click: function () {
                    $(this).dialog('close');
                  }
                },
                {
                  text: text_link,
                  icons: {
                    primary: 'ui-icon-check'
                  },
                  click: function () {
                    var elem_set_new_val = $('.input_popup_address_' + ind + ' input[type="text"]');
                    elem_set_new_val.val(getNewAddress('.set_address_modal_' + ind));
                    $(this).dialog('close');
                    $(elem).parent().find('.set_address .link').text(Drupal.t('Edit address'))
                  }
                }
              ]
            });
          }
          set_address_popup[ind].showModal();
          initDatataWidget('.set_address_modal_' + ind);
        });
      })

      function createdElem(id, class_name, label, value) {
        return $("<div>", {
          class: class_name,
          append: [
            $("<label>", {
              text: label,
              for: id
            }),
            $("<input>", {
              id: id,
              name: id,
              type: 'text',
              class: 'form-text',
              value: value
            })
          ]
        })
      }

      function initDatataWidget(elem) {
        var
            token = api_key,
            type = "ADDRESS",
            region = $(elem).find("#region_area"),
            city = $(elem).find("#city_settlement"),
            street = $(elem).find("#street"),
            house = $(elem).find("#house");
        region.suggestions({
          token: token,
          type: type,
          hint: false,
          bounds: "region-area"
        });
        city.suggestions({
          token: token,
          type: type,
          hint: false,
          bounds: "city-settlement",
          constraints: region
        });
        street.suggestions({
          token: token,
          type: type,
          hint: false,
          bounds: "street",
          constraints: city
        });
        house.suggestions({
          token: token,
          type: type,
          hint: false,
          bounds: "house",
          constraints: street
        });
      }

      function getNewAddress(elem) {
        var output = '',
            region = $(elem).find("#region_area"),
            city = $(elem).find("#city_settlement"),
            street = $(elem).find("#street"),
            house = $(elem).find("#house");
        output = region.val();
        output += (city.val() === '') ? '' : ', ' + city.val();
        output += (street.val() === '') ? '' : ', ' + street.val();
        output += (house.val() === '') ? '' : ', ' + house.val();
        return output;
      }

    }
  };
})(jQuery, window, Drupal, drupalSettings);
