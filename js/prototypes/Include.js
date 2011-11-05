/**
 * @class Include
 * Singleton que inclui um arquivo requisitado via <b>AJAX</b>
 * em uma tag <b>&lt;script&gt;</b> na tag <b>&lt;head&gt;</b> de sua aplicação
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
 //Carrega o arquivo executando o método "request"
  var fileContent = Include.request('caminhoDoArquivo.extensao','getJson|getXML|getContent');
 * </code></pre></p>
 * @extends LoadFile
 */
  
var Include = {
	
	/**
	* @class Include.Script
	* Classe mãe que retorna um elemento script contendo os atributos
	* específicos de cada tipo de script
	* <p><b><u>Exemplo de utilização</u></b></p>
	* <p><pre><code>
	//Cria um objeto da classe do tipo do "Javascript"
	var objScript = new Include.Javascript({
							tag:'script',
							type:'text/javascript'
						});
	* </code></pre></p>
	* 
	* @param {Object} Atributos de um determinado tipo de script
	* 
	*/
	Script:function(attrs){
		var _attributes = {
			tag :null,
			id:null,
			type:'',
			content:null
		};
		
		var _element = null,_self=this,_args=arguments,_content=null;
		
		(function(){
			_attributes = $jsa(_attributes || {}).merge(_args[1]?[_args[0],_args[1]]:_args[0],'notThrowExcept');
			_content = _attributes.content;

			delete _attributes.content;
			
			//Cria o elemento de script e atribui suas propriedades
			if(_attributes.tag){
				_element = document.createElement(_attributes.tag);
				_self.currentScripts = document.getElementsByTagName(_attributes.tag);
				
				//delete _attributes.tag;
				
				for(var x in _attributes){
					if(_attributes[x]){
						if(x == 'tag'){
							continue;
						}
						_element.setAttribute(x,_attributes[x]);
					}
				}
				
				_self.tagScript = _element;
				delete x;
			}
		})();
		
		var _methodsExtend = {
			forClass:{
				comments:'',
				strAnnotations:'',
				getContent:function(){
					return _content;
				},
				getDocComment:function(){
					var content = this.getContent().replace(/\n/g,'');
					
					var hasComment = /^\/\*{2}.*\*\/\W*function\s+([\w\$]+)\(/.exec(content);
					if(hasComment && hasComment[0]){
						this.comments = hasComment[0].replace(/function\s+([\w\$]+)\(/,'');
					}
					return this.comments;
				},
				getAnnotations:function(){
					this.comments = this.getDocComment();
					if(this.comments.length > 0){
						var annotations = /\@.*\s/g.exec(this.comments);
						if(annotations && annotations[0]){
							this.strAnnotations = annotations.toString();
							annotations = annotations[0].split(/\s\*\s/);
						}
						return annotations;
					}
					return null;
				},
				isAnnotationPresent:function(annotation){
					if(this.strAnnotations.length == 0){
						this.getAnnotations();
					}
					
					if(this.strAnnotations.search('@'+annotation) != -1){
						return true;
					}
					return false;
				}
			},
			forObject:{
				release:function(){
					var parent = document.getElementsByTagName('head')[0];
					var scriptRemove = document.getElementById(_attributes.id);
					
					if(typeof scriptRemove == 'object'){
						parent.removeChild(scriptRemove);
					}
					
					if(typeof Include.getNameLoadedClass == 'function'){
						var classRemove = Include.getNameLoadedClass();
						var rsDel = delete window[classRemove];
						if(!rsDel){
							window[classRemove] = null;
						}
					}
					delete this;
				}
			}
		};
		
		this.setMethodsInherit = function(cfg){
			for(var x in _methodsExtend.forObject){
				cfg.objLoaded[x] = _methodsExtend.forObject[x];	
			}
			delete x;
			
			for(var i in _methodsExtend.forClass){
				cfg.classLoaded[i] = _methodsExtend.forClass[i];
			}
			delete i;
		};
		
	},
	Javascript :function(attrs){
		var _attributes = {
			tag :'script',
			id:null,
			type:'text/javascript',
			content:null
		};
		
		Include.Script.apply(this,[_attributes,attrs]);
	},
	Stylesheet:function(attrs){
		var _attributes = {
			tag :'link',
			id:null,
			href:'',
			type:'text/css',
			content:null
		};
		
		if(attrs.id){
			_attributes.href = attrs.id;
		}
		attrs.rel = 'stylesheet';
		
		Include.Script.apply(this,[_attributes,attrs]);
	}
};

(function(){

	var _typeFile = 'javascript';
    
    /**
     * Checa se o script carregado automaticamente existe na tag <b>&lt;head&gt;</b>
     * @method _scriptExists
     * @memberOf Include
     * @param {object|HTMLElement} tagScript Tag <b>&lt;script&gt;</b> com o conteúdo do arquivo requisitado
     * @param {object|HTMLCollection} Todas as Tags <b>&lt;script&gt;</b> encontradas na tag <b>&lt;head&gt;</b> da sua aplicação
     * @private
     */
    var _scriptExists = function(tagScript,scripts){
        var exists = false,content = '',contentTag = '';

        if(typeof scripts == 'object'){
			if(scripts.length > 0){
				for(var y in scripts){
					content = scripts[y].text || scripts[y].innerHTML;
					contentTag = tagScript.text || tagScript.innerHTML;
					
					if(content == contentTag){
						exists = true;
						break;
					}
				}
			}else{
				content = scripts.text || scripts.innerHTML;
				contentTag = tagScript.text || tagScript.innerHTML;
				
				if(content == contentTag){
					exists = true;
				}
			}
        }
        return exists;
    };
	
	/**
	* Define o tipo de script a ser incluido. Ex: "Script,Stylesheet..."
	* 
	* @param {String} type Tipo do script a ser incluído
	* @method
	* @return {Include} Pattern Fluent Interface: Retorna um objeto da própria classe
	* @see {@link Include#_typeFile} Armazena o tipo de script neste atributo privado
	*/
	this.setTypeFile = function(type){
		if(typeof type == 'string'){
			_typeFile = type;
		}
		
		return this;
	};

    /**
     * <p>Adiciona o arquivo na tag <b>&lt;head&gt;</b></p><br/>
     * <b>OBS:</b> Este método é executado internamente em {@link LoadFile#request}
     * @method insertHead
     * @public
     * @param {string|XMLDocument} response Resposta da requisição do arquivo, efetuada pelo método {@link LoadFile#request}
     * @param {string|undefined} prepend (optional) True, caso o arquivo seja adicionado antes de todas as tags <b>&lt;script&gt;</b> ou false, caso contrário
     */
    this.insertHead = function(response,prepend,file){
        var head = document.getElementsByTagName('head')[0];
		var currentScripts = {},tagScript = {};
		
		var typeFile = $jsa(_typeFile).toUpperFirst();
		if(!this[typeFile]){
			throw new Error('IncludeError: Arquivos do tipo "'+typeFile+'" não estão definidos para inclusão');
		}
		
		var obj = new this[typeFile]({
							id:file,
							content:response
						});
						
		tagScript = obj.tagScript;
		currentScripts = obj.currentScripts;
		
		if(_typeFile == 'javascript'){
			tagScript.text = response;
			
			if(!document.all){
				tagScript.innerHTML = response;
			}
		}

        if(typeof Autoload != 'undefined'){
			if(currentScripts.length > 0){
				for(var y in currentScripts){
					if(_typeFile == 'javascript'){
						if(typeof currentScripts[y].src != 'undefined'){
							if(currentScripts[y].src.search(/(Autoload\.js)|(Autoload.min.js)/) != -1
							   && !_scriptExists(tagScript,currentScripts[y])){
								head.insertBefore(tagScript, currentScripts[y]);
							}
						}
					}else if(_typeFile == 'stylesheet'){
						if(!_scriptExists(tagScript,currentScripts[y])){
							head.insertBefore(tagScript, currentScripts[y].nextSibling);
						}					
					}
				}
			}else{
				if(!_scriptExists(tagScript,currentScripts)){
					if(prepend){
						head.insertBefore(tagScript, (_typeFile == 'javascript')?document.getElementsByTagName('script')[0]:document.getElementsByTagName('style')[0]);
					}else{
						head.appendChild(tagScript);
					}
				}
			}
        }else{
            if(!_scriptExists(tagScript,currentScripts)){
                if(prepend){
                    head.insertBefore(tagScript, (_typeFile == 'javascript')?document.getElementsByTagName('script')[0]:document.getElementsByTagName('style')[0]);
                }else{
                    head.appendChild(tagScript);
                }
            }
        }
		
		return obj;
    };
}).apply(Include);

LoadFile.apply(Include);