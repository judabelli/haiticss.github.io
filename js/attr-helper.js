;(function ($, window, document, undefined) {

  "use strict";

  var
    arraySeparator = "||||",
    instructionSeparator = ";",
    attributePrefix = "attrHelper",

    _addAttr = function ($target, attrName, attrValue) {
      var newAttrValue = $target.attr(attrName) ? $target.attr(attrName).split(' ') : [],
        index = newAttrValue.indexOf(attrValue);
      if (index >= 0) return;
      newAttrValue.push(attrValue);
      $target.attr(attrName, newAttrValue.join(' '));
    },

    _removeAttr = function ($target, attrName, attrValue) {
      var newAttrValue = $target.attr(attrName) ? $target.attr(attrName).split(' ') : [],
        index = newAttrValue.indexOf(attrValue);
      if (index < 0) return;
      newAttrValue.splice(index, 1);
      $target.attr(attrName, (newAttrValue.join) ? newAttrValue.join(' ') : '');
    },

    _toggleAttr = function ($target, attrName, attrValue) {
      var newAttrValue = $target.attr(attrName) ? $target.attr(attrName).split(' ') : [],
        index = newAttrValue.indexOf(attrValue);
      index = (index < 0) ?  newAttrValue.push(attrValue) : newAttrValue.splice(index, 1);
      $target.attr(attrName, (newAttrValue.join) ? newAttrValue.join(' ') : '');
    },

    _setAttr = function ($target, attrName, attrValue) {
      $target.attr(attrName, attrValue);
    },

    _deleteAttr = function ($target, attrName, attrValue) {
      $target.removeAttr(attrName);
    },

    _processInstruction = function (instruction) {
      var instructionList = instruction.split(instructionSeparator);
      if (instructionList.length < 3)  return null;

      var target = _sanitizeString(instructionList[0]);
      if (!target) return null;

      var attrName = _sanitizeString(instructionList[1]) || "class";
      if (!attrName) return null;

      var action = _parseAction(_sanitizeString(instructionList[2]));
      if (!action) return null;

      var attrValue = _sanitizeString(instructionList[3]) || "";

      return function () {
        $(target).each(function(){
          action($(this), attrName, attrValue);
        });
      };

    },

    _sanitizeString = function (string) {
      if (!string) return null;
      return string.trim();
    },

    _parseAction = function (action) {
      if (action === "add") return _addAttr;
      if (action === "remove") return _removeAttr;
      if (action === "toggle") return _toggleAttr;
      if (action === "set") return _setAttr;
      if (action === "delete") return _deleteAttr;
      return null;
    },

    _getActions = function (instructions) {
      var actionsList = [];
      $.each(instructions, function (index, value) {
        var action = _processInstruction(value);
        if (action) actionsList.push(action);
      });
      return actionsList;
    },

    _getDataAttributes = function ($el) {
      var attrData = {},
          data = $el.data();
      if (data) {
        $.each(data, function (key, attr) {
          if (key.indexOf(attributePrefix) !== -1 && key.length > attributePrefix.length)
            attrData[key.substring(attributePrefix.length).toLowerCase()] = attr;
        });
      }
      return attrData;
    },

    initDataApi = function () {
      $(".js-attr-helper").each(function () {
        var $this = $(this),
          attrHelperAttributes = _getDataAttributes($this);
        $.each(attrHelperAttributes, function (event, actions) {
          event = event + '.attrHelper';
          var actionsList = _getActions(actions.split(arraySeparator));
          if (actionsList.length) {
            $this.on(event, function () {
              $.each(actionsList, function (index, action) {
                action();
              });
            });
          }
        });
      });
    };

  if (document.readyState != 'loading') {
    initDataApi();
  } else {
    document.addEventListener('DOMContentLoaded', initDataApi);
  }

})(jQuery, window, document);
