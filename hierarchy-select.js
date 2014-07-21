(function ($) {

  $.fn.hierarchySelect = function(options) {

    var _h = {

      data: [],
      selectsList: [],
      selectBlocksList: [],
      levels: [],
      onChange: function(){},

      getChildren: function(parentId, category) {
        return this.data.filter(function(element){
          return element.parentId == parentId;
        });
      },

      flattenList: function(total, list, parentId) {
        var _this = this;
        if (list.length > 0) {
          list.forEach(function(item){
            total.push({'id': item.id, 'title': item.name, 'parentId': parentId});
            if (item.subitems){
              total =  _this.flattenList(total, item.subitems, item.id);
            }
          }); 
        }
        return total;
      },

      createSelect: function(el, list, levelNum) {
        var _this = this;
        var select = $('<select class=""/>');
        var levelId;
        if (levelNum !== undefined) {
          levelId = _this.levels[levelNum].id;
          select.attr('name', levelId);
          select.addClass('form-control');
        }
        select.append( $('<option></option>').val(-1).html('-') );
        $.each(list, function(idx, item) {
          select.append( $('<option></option>').val(item.id).html(item.title) );
        });
        select.change(function(){
          var idx = _h.selectsList.indexOf(select);
          for (var i = _this.selectBlocksList.length-1; i > idx; i-- ) {
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
          for (var i = 0, l = _this.selectsList.length; i < l; i ++) {
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
        var selectBlock = $(this.selectWrapper);
        selectBlock.addClass(this.wrapperClass);
        selectBlock.append(select);
        this.selectsList.push(select);
        this.selectBlocksList.push(selectBlock);
        return selectBlock;
      }
    };

    _h.selectsList = [];
    _h.selectBlocksList = [];
    var settings = $.extend({
      'onChange' : function(){},
      'values': [0],
      'selectWrapper': '<li>',
      'wrapperClass' : 'hs-wrapper'
    }, options);

      var hierarchy = settings.hierarchy[0];
      var list = hierarchy.items;
      var values = settings.values;
      
      _h.data = _h.flattenList([], list, 0);
      _h.onChange = settings.onChange;
      _h.levels = hierarchy.levels;
      _h.selectWrapper = settings.selectWrapper;
      _h.wrapperClass = settings.wrapperClass;

      var parentId = 0;
      for (var i = 0, l = values.length; i < l; i ++) {
        var selectBlock = _h.createSelect(this, _h.getChildren(parentId), i);
        parentId = values[i];
        selectBlock.find('select').val(values[i]);
        this.append(selectBlock);
      }
      return this;
    };
})(jQuery);
