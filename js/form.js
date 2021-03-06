'use strict';

(function () {

  var DEFAULT_MIN_PRICE = 1000;
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
  var MAX_PRICE = 1000000;

  var adForm = document.querySelector('.ad-form');
  var roomSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var titleInput = adForm.querySelector('#title');
  var priceInput = adForm.querySelector('#price');
  var typeInput = adForm.querySelector('#type');
  var timeInInput = adForm.querySelector('#timein');
  var timeOutInput = adForm.querySelector('#timeout');
  var resetBtn = document.querySelector('.ad-form__reset');

  priceInput.value = DEFAULT_MIN_PRICE;

  var fillCapacity = function (room) {
    var capacities = window.utils.mapRooms[room];
    var optionForCapacitySelect = '';
    capacities.forEach(function (capacity) {
      optionForCapacitySelect += '<option value="' + capacity.id + '">' + capacity.text + '</option>';
    });
    capacitySelect.innerHTML = optionForCapacitySelect;
  };

  var roomChangeHandler = function (evt) {
    fillCapacity(evt.target.value);
  };

  var fillRoomsAndCapacities = function () {
    var optionForRoomSelect = '';
    for (var room in window.utils.mapRooms) {
      if (window.utils.mapRooms.hasOwnProperty(room)) {
        optionForRoomSelect += '<option value="' + room + '">' + window.utils.getWordForm(room, ['комната', 'комнаты', 'комнат']) + '</option>';
      }
    }
    roomSelect.innerHTML = optionForRoomSelect;
  };

  fillRoomsAndCapacities();
  fillCapacity(document.querySelector('#room_number option').value);

  var capacityInvalidHandler = function () {
    if (capacitySelect.validity.valueMissing) {
      capacitySelect.setCustomValidity('Обязательное поле');
    } else {
      capacitySelect.setCustomValidity('');
    }
  };

  var titleChangeHandler = function () {
    var valueLength = titleInput.value.length;
    if (valueLength < MIN_TITLE_LENGTH) {
      titleInput.setCustomValidity('Минимальное количество символов - ' + MIN_TITLE_LENGTH);
    } else if (valueLength > MAX_TITLE_LENGTH) {
      titleInput.setCustomValidity('Максимальное количество символов - ' + MAX_TITLE_LENGTH);
    } else {
      titleInput.setCustomValidity('');
    }
  };

  var priceChangeHandler = function () {
    var value = priceInput.value;
    priceInput.min = getMinPrice(typeInput.value);
    if (value > MAX_PRICE) {
      priceInput.setCustomValidity('Максимальная цена за ночь - ' + MAX_PRICE);
    } else if (value < priceInput.min) {
      priceInput.setCustomValidity('Минимальная цена за ночь для типа "' + window.utils.translationToRu[typeInput.value] + '" - ' + priceInput.min);
    } else {
      priceInput.setCustomValidity('');
    }
  };

  var getMinPrice = function (value) {
    return window.utils.BUILDING_MAP[value];
  };

  var typeChangeHandler = function () {
    var minPrice = getMinPrice(typeInput.value);
    priceInput.value = '';
    priceInput.placeholder = minPrice.toString();
    priceInput.min = minPrice;
  };

  var timeInChangeHandler = function () {
    if (timeInInput.value !== timeOutInput.value) {
      timeOutInput.value = timeInInput.value;
    }
  };

  var timeOutChangeHandler = function () {
    if (timeOutInput.value !== timeInInput.value) {
      timeInInput.value = timeOutInput.value;
    }
  };

  var initialState = function () {
    setDefaultStateForm();
    window.main.setActive(false);
    window.main.setActivityStatus();
    window.main.setDefaultCoordsMainMapPin();
    window.scrollTo(0, 0);
  };

  var postData = function (data) {
    window.server.post(data, window.formTemplates.onSuccessPost, window.formTemplates.onErrorPost);
  };

  var adFormSubmit = function (evt) {
    evt.preventDefault();
    postData(new FormData(adForm));
    initialState();
  };

  var btnResetHandler = function (evt) {
    evt.preventDefault();
    initialState();
  };

  var setDefaultStateForm = function () {
    adForm.reset();
    fillRoomsAndCapacities();
    fillCapacity(document.querySelector('#room_number option').value);
    priceInput.value = DEFAULT_MIN_PRICE;
  };

  var addFormListeners = function () {
    adForm.addEventListener('submit', adFormSubmit);
    titleInput.addEventListener('change', titleChangeHandler);
    priceInput.addEventListener('change', priceChangeHandler);
    typeInput.addEventListener('change', typeChangeHandler);
    timeInInput.addEventListener('change', timeInChangeHandler);
    timeOutInput.addEventListener('change', timeOutChangeHandler);
    roomSelect.addEventListener('change', roomChangeHandler);
    capacitySelect.addEventListener('invalid', capacityInvalidHandler);
    resetBtn.addEventListener('click', btnResetHandler);
    window.loaderImg.addEventListenersFileChooser();
  };

  var removeFormListeners = function () {
    adForm.removeEventListener('submit', adFormSubmit);
    capacitySelect.removeEventListener('invalid', capacityInvalidHandler);
    roomSelect.removeEventListener('change', roomChangeHandler);
    titleInput.removeEventListener('change', titleChangeHandler);
    priceInput.removeEventListener('change', priceChangeHandler);
    typeInput.removeEventListener('change', typeChangeHandler);
    timeInInput.removeEventListener('change', timeInChangeHandler);
    timeOutInput.removeEventListener('change', timeOutChangeHandler);
    window.loaderImg.removeEventListenersFileChooser();
  };

  window.form = {
    addFormListeners: addFormListeners,
    removeFormListeners: removeFormListeners
  };
})();
