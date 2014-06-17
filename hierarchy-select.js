H = {

  baseElement: null,
  data: [],
  selectsList: [],
  onChange: function(){},
  create: function(el, options) {
   var list = options.hierarchy;
   var values = options.values;
   if (options.onChange) {
     this.onChange = options.onChange;
   }
    this.data = this.flattenList([], list, 0);
    this.baseElement = el;
    if (!values || !values.length) {
      values = [0];
    }
    var parentId = 0;
    for (var i = 0, l = values.length; i < l; i ++) {
      var select = this.createSelect(this.getChildren(parentId));
      parentId = values[i];
      select.val(values[i]);
      this.selectsList.push(select);
      el.append(select);
    }
    return this;
  }, 

  getChildren: function(parentId) {
    return this.data.filter(function(element){
      return element.parentId  == parentId;
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

  createSelect: function(list) {
    var _this = this;
    var select = $('<select />');
      select.append( $('<option></option>').val(-1).html('-') );
    $.each(list, function(idx, item) {
      select.append( $('<option></option>').val(item.id).html(item.title) );
    });
    select.change(function(){
      var idx = _this.selectsList.indexOf(select);
      for (var i = _this.selectsList.length-1; i > idx; i-- ) {
        _this.selectsList[i].remove();
        _this.selectsList.splice(i, 1);
      }
      var parentId = select.val();
      var childrenItems = _this.getChildren(parentId);
      if (childrenItems.length) {
        var childSelect = _this.createSelect(childrenItems);
        _this.selectsList.push(childSelect);
        _this.baseElement.append(childSelect);
      }
      var selectValues = [];
      for (var i = 0, l = _this.selectsList.length; i < l; i ++) {
        var v = $(_this.selectsList[i]).val();
        selectValues.push(v);
      }
      _this.onChange(selectValues);
    });
    return select;
  },
};
