H = {

  baseElement: null,
  data: [],
  selectsList: [],

  create: function(el, list) {
    this.data = this.flattenList([], list, 0);
    this.baseElement = el;
    var s0 = this.createSelect(this.getChildren(0));
    this.selectsList.push(s0);
    el.append(s0);
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
    select.change(function(e){
      var idx = _this.selectsList.indexOf(select);
      for (var i = _this.selectsList.length-1; i > idx; i-- ) {
        _this.selectsList[i].remove();
      }
      var parentId = select.val();
      var childrenItems = _this.getChildren(parentId);
      if (childrenItems.length) {
        var childSelect = _this.createSelect(childrenItems);
        _this.selectsList.push(childSelect);
        _this.baseElement.append(childSelect);
      }

    });
    return select;
  },
};
