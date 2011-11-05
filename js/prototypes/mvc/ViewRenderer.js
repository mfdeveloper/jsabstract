function ViewRenderer(){
    var _ownObj = this;
    var _element = null;

    this.view = null;
    
    this.setViewParams = function(objView){
        if(this.view === null){
            this.view = {};
        }
        for(var x in objView){
            this.view[x] = objView[x];
        }
        return this;
    }
    
    this.elementExists = function(id){
        if(typeof Ext.getCmp(id) != 'undefined'){
            return true;
        }
        return false;
    }
}