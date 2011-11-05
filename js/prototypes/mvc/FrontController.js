function FrontController(module,controller){
    
    var _classController = '';

    module = $jsa(module).toUpperFirst();

    if(typeof controller == 'undefined'){
        controller = 'Index';
    }else{     
        controller = $jsa(controller).toUpperFirst();
    }
    if(controller.search('_') != -1){
        controller = typeof controller.separatorToCammelCase == 'function'?controller.separatorToCammelCase():$jsa(controller).controller.separatorToCammelCase();
    }
    _classController = module+'_'+controller;

    if(!/Controller$/.test(controller)){
        _classController +='Controller';
    }
   
    this.getClassController = function(){
        if(_classController.search('_') != -1){
            return _classController;
        }
        return null;
    }
}