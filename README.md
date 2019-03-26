# Integration Dadata service
***

Этот модуль предназначен для итеграции [Dadata](https://dadata.ru) с [CMS Drupal 8](https://www.drupal.org/home)

##### Настройка
1. Перейдите на страницу настроек `/admin/config/user-interface/dadata`;
2. Сформируйте необходимую конфигурацию настроек. [Пример](#Пример настроек конфигурации);
3. Ознакомьтесь с документацией [DadataAPI](https://confluence.hflabs.ru/pages/viewpage.action?pageId=204669094);
4. [Краткое описание](#Описание конфигурации) формирования конфигурации. При необходимости вы найдете описания в соответствующих методах;
5. Описание работы модуля.


##### Как это работает?
1. После сохранения настроек конфигурации, к странице будет подключен малький js файл, с поиском требуемых элементов(селекторов);
2. Если будет найден элемент, то будет подключен основной js файл, который сделает всю "магию". Так же будет подключен маленький файл с стилями.
3. При необходимости вы можете заменить подключаемые js и css файлы, для переопределения создан специальный хук `hook_dadata_attach_alter`. Смотрите файл `/modules/dadata_integration/dadata_integration.api.php`

##### Описание конфигурации
- `api_key`: Ваш уникальный id из сервиса Dadata;
- `elements`: Список элементов для ккоторыйх требуется подключить сервис;
  - `api`: Укажите какой сервис вам необходим:
    - `fio`: Поле с поддержкой ФИО, [подробнее тут](https://confluence.hflabs.ru/pages/viewpage.action?pageId=204669115);
    - `email`: Поле с поддержкой Email, [подробнее тут](https://confluence.hflabs.ru/pages/viewpage.action?pageId=234782803);
    - `address`: Поле с поддержкой адресов, [подробнее тут](https://confluence.hflabs.ru/pages/viewpage.action?pageId=204669107);
    - `party`: Поле с поддержкой организаций и ИП, [подробнее тут](https://confluence.hflabs.ru/pages/viewpage.action?pageId=204669122);
    - `bank`: Поле с поддержкой банков, [подробнее тут](https://confluence.hflabs.ru/pages/viewpage.action?pageId=262996078);
  - `selector`: Селектор элемента к которому требуется подключить ту или иную поддержку. Например если указать `.my_input_fio_element_class`, то этот елемент будет поддерживать подсказки.

##### Пример настроек конфигурации
```
api_key: "Тут ваш API key"
elements:
  -
    api: fio
    selector: .dd-fio
    count: 10
  -
    api: email
    selector: .dd-email
    count: 10
  -
    api: address
    selector: .dd-address
    count: 10
    locations:
      region: Иркутская
  -
    api: party
    selector: .dd-party
    count: 10
    status: ACTIVE
    type: LEGAL
  -
    api: bank
    selector: .dd-bank
    count: 10
    status: ACTIVE
    type: BANK
```