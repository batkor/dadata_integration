(function ($, window, Drupal, drupalSettings) {
  Drupal.behaviors.dadataIntegration = {
    attach: function (context, drupalSettings) {
      var api_key = drupalSettings.dadata_integration.api_key;
      $('.input_popup_address').once('input_popup_address_elems').each(function (ind, elem) {
        var input_address = $(elem).find('input[type="text"]');
        var text_link = (input_address.val() === '') ? 'Add address' : 'New address';
        $(elem).after('<span class="set_address">[ <span class="link">' + Drupal.t(text_link) + '</span> ]</span>');
        $(elem).parent().once('set_address_popup').on('click', '.set_address', function (e) {
          var items_address = [
            $("<div>", {
              class: 'content',
              append: [
                createdElem('region', 'form-item', 'Регион', ''),
                createdElem('area', 'form-item', 'Район', ''),
                createdElem('city', 'form-item', 'Город', ''),
                createdElem('settlement', 'form-item', 'Населенный пункт', ''),
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
          var set_address_popup = Drupal.dialog(items_address, {
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
                  $(elem).find('input[type="text"]').val(getNewAddress('.set_address_modal_' + ind));
                  $(this).dialog('close');
                  $(elem).parent().find('.set_address .link').text(Drupal.t('New address'))
                }
              }
            ]
          });
          set_address_popup.showModal();
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
            region = $(elem).find("#region"),
            area = $(elem).find("#area"),
            city = $(elem).find("#city"),
            settlement = $(elem).find("#settlement"),
            street = $(elem).find("#street"),
            house = $(elem).find("#house");
        region.suggestions({
          token: token,
          type: type,
          hint: false,
          bounds: "region"
        });
        area.suggestions({
          token: token,
          type: type,
          hint: false,
          bounds: "area",
          constraints: region
        });
        city.suggestions({
          token: token,
          type: type,
          hint: false,
          bounds: "city",
          constraints: area
        });
        settlement.suggestions({
          token: token,
          type: type,
          hint: false,
          bounds: "settlement",
          constraints: city
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
            region = $(elem).find("#region"),
            area = $(elem).find("#area"),
            city = $(elem).find("#city"),
            settlement = $(elem).find("#settlement"),
            street = $(elem).find("#street"),
            house = $(elem).find("#house");
        output = region.val();
        output += (area.val() === '') ? '' : ', ' + area.val();
        output += (city.val() === '') ? '' : ', ' + city.val();
        output += (settlement.val() === '') ? '' : ', ' + settlement.val();
        output += (street.val() === '') ? '' : ', ' + street.val();
        output += (house.val() === '') ? '' : ', ' + house.val();
        return output;
      }

    }
  };
})(jQuery, window, Drupal, drupalSettings);
