(function ($) {

  function flattenList(list, parentId) {
    var resultList = [];
    if (list.length > 0) {
      list.forEach(function(item) {
        resultList.push({'id': item.id, 'title': item.name, 'parentId': parentId});
        if (item.subitems) {
          resultList = resultList.concat(flattenList(item.subitems, item.id));
        }
      }); 
    }
    return resultList;
  }

  var HierarchySelect = function(options) {
    var settings = $.extend({
      onChange      : function(){},
      selectWrapper : '<li>',
      wrapperClass  : 'hs-wrapper',
      hierarchy     : [],
      levels        : []
    }, options);

    var hierarchy = settings.hierarchy;

    this.levels = hierarchy.levels;
    this.data = flattenList(hierarchy.items, 0);
    this.onChange = settings.onChange;
    this.selectWrapper = settings.selectWrapper;
    this.wrapperClass  = settings.wrapperClass;

    this.data = [];
    this.selectsList = [];
    this.selectBlocksList = [];

    var _this = this;

    this.getChildren = function(parentId, category) {
      return _this.data.filter(function(element){
        return element.parentId == parentId;
      });
    };

    this.createSelect = function(el, list, levelNum) {
      var select = $('<select class=""/>');
      var levelId;
      if (Number.isFinite(levelNum)) {
        levelId = _this.levels[levelNum].id;
        select.attr('name', levelId);
        select.addClass('form-control');
      }
      select.append( $('<option></option>').val(-1).html('-') );
      $.each(list, function(idx, item) {
        select.append( $('<option></option>').val(item.id).html(item.title) );
      });
      select.change(function() {
        var idx = _this.selectsList.indexOf(select);
        for ( var i = _this.selectBlocksList.length-1; i > idx; i-- ) {
          _this.selectsList[i].remove();
          _this.selectsList.splice(i, 1);
          _this.selectBlocksList[i].remove();
          _this.selectBlocksList.splice(i, 1);
        }
        var parentId = select.val();
        var childrenItems = _this.getChildren(parentId, levelId);
        if (childrenItems.length) {
          var childSelectBlock = _this.createSelect(el, childrenItems, idx + 1);
          el.append(childSelectBlock);
        }
        var selectValues = [];
        for ( var i = 0, l = _this.selectsList.length; i < l; i++ ) {
          var v = $(_this.selectsList[i]).val();
          if (v === '-1') break;
          var s = (_this.selectsList[i])[0];
          var valueName = s.options[s.selectedIndex].innerHTML;
          selectValues.push({ 
            categoryId: _this.levels[i].id, 
            categoryName:_this.levels[i].name, 
            value: v,
            valueName: valueName
          });
        }
        _this.onChange(selectValues);
      });
      var selectBlock = $(_this.selectWrapper);
      selectBlock.addClass(_this.wrapperClass);
      selectBlock.append(select);
      _this.selectsList.push(select);
      _this.selectBlocksList.push(selectBlock);
      return selectBlock;
    };
  };

  $.fn.hierarchySelect = function(options) {

    var h = new HierarchySelect(options);

    var values = options.values || [0];
    var parentId = 0;
    for ( var i = 0, l = values.length; i < l; i++ ) {
      var selectBlock = h.createSelect(this, h.getChildren(parentId), i);
      parentId = values[i];
      selectBlock.find('select').val(values[i]);
      this.append(selectBlock);
    }
    return this;
  };
  
})(jQuery);
