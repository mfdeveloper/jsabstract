/**
 * @class Autoload Classe que carrega automaticamente Classes/Protótipos, adicionando uma
 * tag <b>&lt;script&gt;</b> com o conteúdo do arquivo do protótipo
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
&lt;script type="text/javascript"&gt;

 //Defina todas ou parte das configurações para o autoload de todas as classes
 Autoload.setConfigs({
    basePath:'js/prototypes',
    extension:'jsclass',
    //e etc...
 })

//Ou crie um arquivo XML no caminho "pasta_da_aplicacao/configs/js_pathconfigs.xml"
//com as seguintes tags:

//OBS: As tags abaixo são opcionais. Defina todas ou parte delas
<b>&lt;autoload&gt;</b>
    <b>&lt;basePath&gt;</b> js/poo_js <b>&lt;/basePath&gt;</b>
    <b>&lt;extension&gt;</b> js <b>&lt;/extension&gt;</b>
    <b>&lt;extCompressFile&gt;</b> min <b>&lt;/extCompressFile&gt;</b>
    <b>&lt;allCompressedFile&gt;</b> false <b>&lt;/allCompressedFiles&gt;</b>
    <b>&lt;onBeforeLoad&gt;</b>
        <b>&lt;script</b> type="text/javascript"<b>&gt;</b>
        &lt;![CDATA[
        function(className,configs){
            //Código para o evento aqui!!;
        }
        ]]&gt;
        <b>&lt;/script&gt;</b>
    <b>&lt;/onBeforeLoad&gt;</b>
<b>&lt;/autoload&gt;</b>

//Ou apenas crie a instância como descrito abaixo.
//Caso o arquivo XML não seja encontrado, as configurações padrão
//serão carregadas


//Esta classe será carregada em: 'js/prototypes/Person.jsclass'
var objPerson = new Autoload('Person');

&lt;/script&gt;
 * </code></pre></p>
 * @cfg {string} convention (optional) Convenção de namespaces para a classe a ser carregada. Por padrão, a convenção é
 *                                     o nome o caminho e o nome da classe separados por "_" underline
 * @cfg {boolean} isCompressed (optional) Define se o arquivo é comprimido. Caso seja, utiliza a extensão definida em:
 *                                        {@link Autoload#configs#extension}
 * @cfg {function} onBeforeLoad (optional) Evento executado antes de executar o autoload da classe
 * @constructor
 * @param {string} className Nome da classe a ser carregada dinâmicamente
 * @param {object|undefined} confs (optional) Configurações específicas para uma determinada classe. Estão descritas na seção: <b>Config Options</b>
 * @return {object} Objeto da classe carregada
 * @see <br/><p><a ext:cls="LoadFile" ext:member="" href="output/LoadFile.html">LoadFile</a> Classe que carrega o arquivo XML, caso o método <a ext:cls="Autoload" ext:member="setConfigs" href="output/Autoload.html#Autoload-setConfigs">Autoload.setConfigs</a> não seja utilizado</p><br/>
 *      <p><a ext:cls="Include" ext:member="" href="output/Include.html">Include</a> Classe que requisita o arquivo via <b>AJAX</b>, e adiciona-o em uma tag <b>&lt;script&gt;</b></p><br/>
 *      <p><a ext:member="" ext:cls="PrototypeError" href="output/PrototypeError.html">PrototypeError</a> Classe de geração de exceções(erros)</p><br/>
 */
function Autoload(className,confs){
    /**
     * Caminho completo do arquivo da classe
     * @property
     * @type {null|string}
     * @private
     */
    var _pathFormat = null;
    /**
     * <p>Formato da extensão do arquivo</p><br/>
     * <p><b>Ex:</b> '.min.js' ou apenas '.js'</p>
     * @property
     * @type {string|null}
     * @private
     */
    var _extFormat = null;
    /**
     * Objeto da classe carregada dinâmicamente
     * @property
     * @type {object|undefined}
     * @private
     */
    var _chargedObj;
    /**
     * Armazena o formato do nome da classe (se possui ou não namespaces, de acordo com a
     * convenção definida em "confs.convention" no construtor da classe
     * @property
     * @type {string|undefined}
     * @private
     */
    var _classPath;
    /**
     * Referência da própria classe Autoload
     * @property
     * @type {function}
     * @private
     */
    var _refClass = arguments.callee;
    /**
     * Configurações para o autoload de uma classe específica
     * @property
     * @type {object}
     * @private
     */
    var _specificConfs = {
        convention:'underscore',
		msgNotFound:null,
		cssPath:null,
        isCompressed:false,
		serverCompressType:false,
		fileGzipInclude:false,
		arguments:null,
		removeInPathClass:null,
		basePath:null,
		returnPrototype:false,
        onBeforeLoad:function(className,confs){}
    };
    /**
     * @event onBeforeLoad
     * Evento que é executado antes de carregar a Classe
     * @param {string} className (optional) Nome da classe a ser carregada
     * @param {object} confs (optional) Configurações da classe passadas por referência, definidas em {@link Autoload#configs}
     */
    var _onBeforeLoad = function(className,confs){};

    /**
     * Cria o caminho da classe para autoload
     * @method
     * @return void
     * @private
     */
    var _mountClassPath = function(){
		if(_specificConfs.cssPath || _refClass.configs.cssPath){
			_specificConfs.extension = _refClass.configs.extension;
			_refClass.configs.extension = 'css';
		}
	
        switch (_specificConfs.convention) {
            case 'underscore':
                _classPath = className.replace(/(_)|(\.)/g, '/');
                _extFormat = '.'+_refClass.configs.extension;
                break;
			case 'classExtension':
				_classPath = className;
                _extFormat = '.class.'+_refClass.configs.extension;
                break;
			case 'classNameLower':
                _classPath = className.toLowerCase();
                _extFormat = '.'+_refClass.configs.extension;
				break;
			case 'className':
            default:
                _classPath = className;
                _extFormat = '.'+_refClass.configs.extension;
                break;
        }
		if(_specificConfs.basePath != null){
			_refClass.configs.basePath = _specificConfs.basePath;
		}
        _pathFormat = _refClass.configs.basePath+'/'+_classPath;

        var allCompFilesIsBool = _refClass.configs.allCompressedFiles instanceof Boolean;
        if(!allCompFilesIsBool){
            _refClass.configs.allCompressedFile = new Boolean(_refClass.configs.allCompressedFiles);
        }
		
		//Adiciona uma extensão ao arquivo, caso não exista uma em seu nome
		if(!/\.[a-zA-z]{1,}$/.test(_pathFormat)){
			if(_specificConfs.isCompressed || _refClass.configs.allCompressedFiles === true){
				
				_pathFormat += '.'+_refClass.configs.extCompressFile+_extFormat
				
			}else{
				_pathFormat += _extFormat;
			}
		}
    };

    /**
     * Verifica se o evento "onBeforeLoad" está definido em um array de objetos
     * @method
     * @private
     * @param {array} Array de objetos que contenham eventos (nesse caso, apenas o "onBeforeLoad" está sendo verificado.<br/>
     */
    var _checkEvents = function(objsWithEvent){
        if(objsWithEvent instanceof Array){
            for(var i in objsWithEvent){
                if(objsWithEvent[i].onBeforeLoad){
                    if(!objsWithEvent[i].onBeforeLoad.isEmpty()){
                        if(_onBeforeLoad.length != objsWithEvent[i].onBeforeLoad.length){
                            new PrototypeError(_refClass.getName()+'Error', 'A quantidade de parâmetros definidos em: "onBeforeLoad" está incorreta');
                        }
                        _onBeforeLoad = objsWithEvent[i].onBeforeLoad;
                        _onBeforeLoad(className,_refClass.configs);
                    }
                }
            }
        }
    };
	
	/**
	 * Cria um objeto da classe carregada
	 * @method
	 * @private
	 * @cfg {String} className Nome da classe do objeto a ser criado
	 * @cfg {Function} success Callback executada após a criação do objeto
	 * @cfg {Boolean} isAsync Verdadeiro, caso a requisição seja asincrona. Caso contrário, seu valor deverá ser false
	 */
	var _createObject = function(cfg){
		
		var objectReturn = window[cfg.className];
		
		if(typeof window[cfg.className] == 'undefined'){
			if(cfg.className.search('.') != -1){
				cfg.className = 'window.'+cfg.className;
				var fullNamespace = (new Function('return '+cfg.className))();
				
				if(typeof fullNamespace == 'undefined'){
					throw new Error('O protótipo: "'+cfg.className+'" não foi encontrado');
				}
				
				objectReturn = fullNamespace;
				
			}else{
				throw new Error('O protótipo: "'+cfg.className+'" não foi encontrado');
			}
			
		}else if(window[cfg.className] === null){
			objectReturn = window[cfg.className] = undefined;
		}
		
		if(objectReturn){
			if(_specificConfs.returnPrototype || _refClass.configs.returnPrototype){
				_chargedObj = objectReturn;
			}else{
				
				/*
				 * Verifica se argumentos para o construtor da classe carregada, foram definidos 
				 * na propriedade "confs.arguments"
				 */
				if(typeof _specificConfs.arguments == 'object'){
				
					/*
					* Caso um array de argumentos seja definido , todos os elementos 
					* são convertidos para o formato string.
					*/
					if(Object.prototype.toString.call(_specificConfs.arguments) == '[object Array]'){
						_chargedObj = (new Function('return new '+objectReturn+'('+$jsa(_specificConfs.arguments).arrayToString(',')+');'))();
					}else{
						_chargedObj = new objectReturn(_specificConfs.arguments);
					}
				}else{
					_chargedObj = new objectReturn();
				}
			}
		}
		
		if(cfg.objLoadFile){
			if(typeof cfg.objLoadFile.setMethodsInherit == 'function'){
				cfg.objLoadFile.setMethodsInherit({
					objLoaded:_chargedObj,
					classLoaded:window[cfg.className]
				});
			}
		}
		
		if(cfg.success){
			cfg.success(_chargedObj,cfg.className);
		}
		
		if(!cfg.isAsync){
			return _chargedObj;
		}
	};

    /**
     * Método construtor da classe.<br/>
     * Executa o método privado {@link Autoload#_mountClassPath}, carrega as configurações
     * de autoload e requisita o arquivo da classe, retornando seu objeto
     * @return {object} Objeto da classe carregada
     * @private
     */
    return (function(){
        if(typeof confs != 'undefined'){
			_refClass.methodForConfigs = true;
            for(var i in confs){
                if(i in _specificConfs || i in _refClass.configs){
                    if(i == 'onBeforeLoad' && !i instanceof Function){
                        new PrototypeError(_refClass.getName()+'Error', 'A propriedade: "'+i+'" precisa ser uma função de evento');
                    }
					if(i == 'arguments' && typeof confs[i] != 'object'){
						new PrototypeError(_refClass.getName()+'Error','Os Argumentos para a classe a ser carregada precisam ser passados como um objeto');
					}
                    _specificConfs[i] = confs[i];
                }else{
                    new PrototypeError(_refClass.getName()+'Error', 'A propriedade: "'+i+'" não é válida');
                    break;
                }
            }
            delete i;
        }

        if(!_refClass.methodForConfigs){
            _refClass.createConfigs(_refClass.configs);
        }

        //Verifica se o evento "onBeforeLoad" foi definido para o autoload de uma classe específica, ou para todas as classes
        _checkEvents([_specificConfs,_refClass.configs]);

        //Monta o caminho para o autoload
        _mountClassPath();
		
		//Verifica se há textos para remover do caminho do arquivo
		if(_specificConfs.removeInPathClass !== null){
			 if(_specificConfs.removeInPathClass instanceof Array){
				for(var z=0;z<_specificConfs.removeInPathClass.length;z++){
					_pathFormat = _pathFormat.replace(new RegExp(_specificConfs.removeInPathClass[z],'i'),'');
				}
				delete z;
			 }else{
				_pathFormat = _pathFormat.replace(new RegExp(_specificConfs.removeInPathClass,'i'),'');
			 }
		}
		
        //Requisita o arquivo via ajax, e caso seja encontrado, retorna sua instância
		var isAsync = _specificConfs.async || _refClass.configs.async || false;
		if(_specificConfs.cssPath || _refClass.configs.cssPath){
			
			Include.setParams({
				async:isAsync,
				typeFile:'stylesheet',
				fileGzipInclude:_specificConfs.fileGzipInclude || _refClass.configs.fileGzipInclude || false,
				serverCompressType:_specificConfs.serverCompressType || _refClass.configs.serverCompressType || false,
				className:className,
				success:function(){
					_pathFormat = _pathFormat.replace(new RegExp('\.'+_refClass.configs.extension),'.'+_specificConfs.extension);
					
					Include.setParams({
						async:isAsync,
						typeFile:'javascript',
						serverCompressType:_specificConfs.serverCompressType || _refClass.configs.serverCompressType || false,
						fileGzipInclude:_specificConfs.fileGzipInclude || _refClass.configs.fileGzipInclude || false,
						className:className,
						success:_specificConfs.success || _refClass.configs.success || false,
						msgNotFound:_specificConfs.msgNotFound || _refClass.configs.msgNotFound || null
					}).request(_pathFormat,_createObject);
				
					var callback = _specificConfs.afterLoadCss || _refClass.configs.afterLoadCss || false;
					if(typeof callback == 'function'){
						callback();
					}
					
				},
				msgNotFound:_specificConfs.msgNotFound || _refClass.configs.msgNotFound || null
			}).request(_pathFormat);
		}else{
			Include.setParams({
				async:isAsync,
				className:className,
				serverCompressType:_specificConfs.serverCompressType || _refClass.configs.serverCompressType || false,
				fileGzipInclude:_specificConfs.fileGzipInclude || _refClass.configs.fileGzipInclude || false,
				success:_specificConfs.success || _refClass.configs.success || false,
				msgNotFound:_specificConfs.msgNotFound || _refClass.configs.msgNotFound || null
			}).request(_pathFormat,isAsync?_createObject:null);
		}
		
		if(!isAsync){
			_chargedObj = _createObject({
				className:className,
				async:isAsync
			});
			
			if(_chargedObj){
				return new function(){
					return _chargedObj;
				}
			}
			
		}

    })();
}

/**
 * <p>Crossbrowser que retorna o valor de uma tag XML. Este método é utilizado <br/>
 * para buscar os valores definidos no arquivo <code>'configs/js_pathconfigs.xml'.</code></p><br/>
 * <p>Além disso, possui também um crowssbrowser para a função eval,<br/> caso o desenvolvedor defina código
 * javascript no valor das tags XML</p>
 * @memberOf Autoload
 * @method
 * @static
 * @param {Node} nodeElement Tag XML a qual deseja-se buscar o valor
 * @return {string} Valor da tag XML definida no parâmetro "nodeElement". Este retorno é sempre uma string
 */
Autoload.xmlNodeValue = function(nodeElement){
    var attrs = ['textContent','text','nodeValue'];
    var value = '';

    for(var x in attrs){
        if(nodeElement.nodeType == 1){
            if(attrs[x] in nodeElement && (nodeElement[attrs[x]] != 'undefined' && nodeElement[attrs[x]] !== null)){
                value = nodeElement[attrs[x]];

                //Crossbrowser para a função eval()
                if(/function/.test(value)){
                    value = value.replace('function', 'fn = function');
                    try{
                        window.execScript(value);
                    }catch(e){
                        eval('('+value+')');

                    }finally{
                        value = fn;
                        delete fn;
                    }
                }
            }
        }
    }
    delete x;
    return value;
};

/**
 * &lt;<b>static</b>&gt;: Define se o método {@link Autoload#setConfigs} é usado para as configurações do autoload ou
						  se a configuração é específica
 * @memberOf Autoload
 * @property
 * @type {boolean}
 * @static
 */
Autoload.methodForConfigs = false;

/**
 * &lt;<b>static</b>&gt;: Configurações padrão para o Autoload de todas as classes.<br/>
 * Caso o arquivo "js_pathconfigs.xml" não seja criado ou o método {@link Autoload#setConfigs}
 * não seja usado, os atributos desta propriedade serão utilizadas.
 * @memberOf Autoload
 * @property
 * @type {object}
 * @static
 */
Autoload.configs = {
    basePath:'js/poo_js',
    extension:'js',
    extCompressFile:'min',
	cssPath:null,
	msgNotFound:null,
    allCompressedFiles:false,
	serverCompressType:false,
	returnPrototype:false,
	fileGzipInclude:false,
	async:false,
	success:false,
    onBeforeLoad:function(className,confs){}
};

/**
 * Cria as configurações, caso o desenvolvedor opte por utilizar o arquivo
 * <code>"configs/js_pathconfigs.xml"</code> para definir as configurações de todos os
 * autoloads
 * @memberOf Autoload
 * @method
 * @static
 * @param {object} defaultConfs Objeto passado por referência que contém as configurações padrão
 *                              Por padrão, este parâmetro equivale a propriedade {@link Autoload#configs}
 *
 * @return {Autoload} Retorna um objeto da própria classe <b>(Padrão Fluent Interface)</b>
 */
Autoload.createConfigs = function(defaultConfs){
    try{
        var _fileConfigs = new LoadFile().request('configs/js_pathconfigs.xml', 'getXML');
        var _xmlConfigs = _fileConfigs.getElementsByTagName('autoload')[0].childNodes;

        if(_xmlConfigs.length > 0){
            for(var x=0;x<_xmlConfigs.length;x++){
                if(_xmlConfigs.item(x).nodeType == 1){
                    
                    if(_xmlConfigs.item(x).nodeName in defaultConfs){
                        defaultConfs[_xmlConfigs.item(x).nodeName] = Autoload.xmlNodeValue(_xmlConfigs.item(x));
                    }else{
                        new PrototypeError(this.getName()+'Error', 'A propriedade: "'+_xmlConfigs.item(x).nodeName+'" definida no arquivo:'+
                                                                   '"configs/js_pathconfigs.xml" não é permitida');
                    }
                }
            }
            delete x;
        }
       
    }catch(err){}
    
    return this;
};

/**
 * <p> Define as configurações de autoload para todos os protótipos que serão
 * carregados automaticamente.<br/> Você pode definir todas as configurações
 * ou parte delas</p><br/>
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
&lt;script type="text/javascript"&gt;

 //Defina todas ou parte das configurações para o autoload de todas as classes
 Autoload.setConfigs({
    basePath:'js/prototypes',
    extension:'jsclass',
 })

//Esta classe será carregada em: 'js/prototypes/Person.jsclass'
var objPerson = new Autoload('Person');

&lt;/script&gt;
 * </code></pre></p>
 * @memberOf Autoload
 * @method
 * @static
 * @param {object} confs <p>Objeto literal contendo as configurações para todos os autoloads.<br/>
 *                              Você pode definir todas as configurações, ou apenas algumas delas</p><br/>
 *
 * <p><b><u>Configurações Permitidas</u></b></p>
 * <p><pre>
 * {string} <b>basePath</b> = Caminho base onde se encontra as classes javascript. O caminho padrão é: <code>'js/poo_js'</code>,
 * {string} <b>extension</b> =  Extensão dos arquivos javascript. A padrão é: <code>'js'</code>,
 * {string} <b>extCompressFile</b> = Extensão para arquivos comprimidos. Esta extensão, antecede a definida em <i>extension</i>. A padrão é: <code>'min'</code>,
 * {boolean} <b>allCompressedFiles</b> = Defina True caso todos os arquivos sejam compactados, e assim, utilizar a extensão definida em <i>extCompressedFile</i>. O valor padrão é: <code>false</code>
 * </pre></p>
 *
 * @return {Autoload} Retorna um objeto da própria classe (Padrão Fluent Interface)
 */
Autoload.setConfigs = function(confs){

    if(typeof confs == 'object'){
		var notStr = {
			allCompressedFiles:true,
			serverCompressType:true,
			onBeforeLoad:true,
			async:true,
			success:true
		};
		
        for(var x in confs){
            if(!Autoload.configs.hasOwnProperty(x)){
                new PrototypeError(this.getName()+'Error', 'A propriedade: "'+x+'" não é permitida');
                break;
            }
            if(typeof confs[x] != 'string' && !(x in notStr)){
                new PrototypeError(this.getName()+'Error','A propriedade: "'+x+'" deve ser uma string');
                break;
            }
             Autoload.configs[x] = confs[x];
        }
        delete x;
        Autoload.methodForConfigs = true;
    }
    return this;
};