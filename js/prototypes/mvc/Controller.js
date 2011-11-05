function Controller(params){
    var _self = this;
    var _autoRender = true;
    var _autoRenderLayout = true;
    var _actionResult = null;
    var _request = {};

    this.view = {};

    this.enableRender = function(isRender){
        if(typeof isRender == 'boolean'){
            _autoRender = isRender;
        }
    };

    this.enableLayout = function(isRender){
        if(typeof isRender == 'boolean'){
            _autoRenderLayout = isRender;
        }
    };

    this.getResult = function(){
        return _actionResult;
    };

    this.getUrl = function(){
        var url = null;
        if(_request.hasOwnProperty('controller')){
           url = _request.module+'/'+_request.controller+'/'+_request.action
           return url.toLowerCase();
        }
        return null;
    };

    this.getRequest = function(){
       return _request;
    };
    
    params.action = (typeof params.action == 'undefined')?params.action = 'index':params.action;
    var actionParams = (typeof params.params != 'undefined')?params.params:null;
    var viewName = params.action;
    params.action += 'Action';

    var actionExists = params.action in _self;
    if(!actionExists){
        throw new Error('A ação: "'+params.action+'" não existe no controller');
    }

    //Armazena o modulo/controller/action no atributo "_params"
    var controllerName = arguments.callee.caller.getName().split('Controller')[0];
    controllerName = controllerName.replace(new RegExp(Configs.MODULE_CURRENT+'_','i'),'');

    _request = {
        module:Configs.MODULE_CURRENT,
        controller:controllerName,
        action:viewName
    };

    //Executa a ação
    _actionResult = this[params.action](actionParams);

    //Renderiza o Layout
    if(_autoRenderLayout){
        Configs.VIEWS_PATH = Configs.MODULES_JS_PATH+'/'+Configs.MODULE_CURRENT+'/views';
        var objView = new View(Configs.VIEWS_PATH);
        if(Configs.LAYOUT.OBJ === null){
            Configs.LAYOUT.OBJ = objView.renderLayout(Configs.LAYOUT.FILEPATH);
        }
        Configs.LAYOUT.OBJ.setViewParams(this.view);
        Configs.LAYOUT.OBJ.show();
    }
    
    //Renderiza a view da action
    if(_autoRender){

        var objCurrentView = objView.render(controllerName, viewName);

        /*
         * Adiciona o nome do controller, modulo, e view
         * na view corrente
         */
        this.view.controllerName = controllerName
        this.view.viewName = viewName;
        this.view.moduleName = Configs.MODULE_CURRENT;

        objCurrentView.setViewParams(this.view);
        Configs.VIEW_CURRENT.obj = objCurrentView;

         /*
          * Captura o resultado da view, possibilitando resgatar esse valor
          * com o método this.getResult()
          * Isso é ideal quando necessita-se renderizar view de outros controllers
          */
         if(params.params.returnView){
           _actionResult = objCurrentView.show();
         }else{
             objCurrentView.show();
         }
        
    }else{
        var view = Configs.VIEW_CURRENT.obj;

        if(typeof view == 'object'){
            view.setViewParams(this.view);
        }
    }
}

Controller.run = function(configs){
    var objController = null;
    var cfg = {
        module:Configs.MODULE_CURRENT,
        controller:'index',
        action:'index',
        params:{}
    }
    
    $jsa(cfg).merge(configs);

    var objFront = new FrontController(cfg.module, cfg.controller);
    var classController = objFront.getClassController();
    var fullPathController = Configs.MODULES_JS_PATH+'/'+cfg.module+'/controllers'+classController.replace('_','/')+'.js';
    
    Configs.MODULE_CURRENT = cfg.module;

    
       objController = new Autoload(classController,{
                            basePath:Configs.MODULES_JS_PATH+'/'+cfg.module+'/controllers',
                            convention:'className',
                            removeInPathClass:cfg.module+'_',
                            arguments:{
                                action:cfg.action,
                                params:cfg.params
                            }
                        });
    
    return objController;
};