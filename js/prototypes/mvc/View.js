function View(viewsPath,extView){
    var _controller = null;
    var _viewsPath = (typeof viewsPath == 'undefined')?null:viewsPath;
    var _extView = (typeof extView == 'undefined')?'js':extView;
    
    this.render = function(controllerName,viewName){
        var objActionView = null;
        var pathViews = '';

        if(_viewsPath !== null){
            _controller = (typeof controllerName == 'string')?controllerName:null;

            if(typeof _controller.cammelCaseToSeparator == 'function'){
                pathViews = _viewsPath+'/'+_controller.cammelCaseToSeparator();
            }else{
                pathViews = _viewsPath+'/'+$jsa(_controller).cammelCaseToSeparator();
            }
            viewName = $jsa(viewName).toUpperFirst();
            var viewClass = $jsa(_controller).toUpperFirst()+'_'+viewName;

            Autoload.setConfigs({
               basePath:pathViews
            });

            try{                
                objActionView = new Autoload('View_'+viewClass,{
                                            convention:'className',
                                            removeInPathClass:'View_'+$jsa(_controller).toUpperFirst()+'_'
                                        });
            }catch(e){
                if(e.message.search('404') != -1){
                    throw new Error('A view "'+_controller+'/'+viewName.toLowerCase()+'.'+_extView+'" não foi encontrada');
                }
                throw new Error(e.message+' na view: "'+_controller+'/'+viewName.toLowerCase()+'.'+_extView+'"');
            }
            
        }
        return objActionView;
    }

    this.renderLayout = function(filePath){
        if(typeof filePath != 'string'){
            throw new Error('O caminho para o arquivo de Layout:"'+filePath+'" não é válido');
        }
        var fileName = new String(/[a-zA-z]{1,}\.js/.exec(filePath));

        if(fileName === null){
            throw new Error('O nome do arquivo de Layout não foi encontrado em: "'+filePath+'"');
        }
        filePath = filePath.replace(new RegExp('\/'+fileName), '');
        fileName = $jsa(fileName).toUpperFirst().replace(/\.js$/, '');
        
        var objlay = new Autoload('Layout_'+fileName, {
                        basePath:filePath,
                        convention:'classNameLower',
                        removeInPathClass:'Layout_'
                    });
                    
         return objlay;
    }
}