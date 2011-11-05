/** 
 * @class LoadFile
 * Carrega arquivos via <b>AJAX</b> e retorna o seu conteúdo
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
 //Carrega o arquivo executando o método "request"
 new LoadFile().request('caminhoDoArquivo.extensao','getJson|getXML|getContent')
 * </code></pre></p>
 */
function LoadFile(){

    /**
     * Caminho do(s) arquivo(s) requisitado(s)
     * @property
     * @type {string|null}
     * @private
     */
    var _requestedFile = {};
    /**
     * Referência a própria classe (LoadFile)
     * @property
     * @type {string}
     * @private
     */
    var _prototypeName = arguments.callee.getName?arguments.callee.getName():'';
	
	var _ajaxParams = {},_self = this;

    /** Retorna o objeto ajax, compativel com todos navegadores em tempo de execução
     *
     * @method
     * @returns {XMLHttpRequest|ActiveXObject} Retorna um novo objeto ajax
     * @augments XMLHttpRequest
     * @inner
     * @private
     */
    var _httpRequest = function(){
		var objAjax = new function(){
			try {
				return new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e) {
				try {
					return new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (ee) {
					try {
						return new XMLHttpRequest();
					}
					catch (E) {
						alert("Seu browser e muito antigo e nao Suporta Ajax");
						return null;
					}
				}
			}
		};
			return objAjax;
    };
	
	/**
	* Callback executada após o termino da requisição ajax do arquivo
	* Verifica se houve algum erro e executa as callbacks "cfg.callback"
	* e "cfg.success"
	* @param {Object} cfg Configurações da callback
	* @private
	*/
	var _onComplete = function(cfg){
		var xhr = cfg.xhr || _httpRequest();
		var objLoadFile = null;
		
		if(cfg.isRequested){
			if(typeof cfg.callback == 'function'){
				cfg.callback({
					className:_ajaxParams.className,
					success:cfg.success || function(){},
					objLoadFile:_self
				});
			}else{
				if(typeof cfg.success == 'function'){
					cfg.success(xhr.responseText);
				}
			}
		}else{
		
			if(xhr.readyState == 4){
			
				if (xhr.status == 200) {

					switch (cfg.prepend) {
						
						//Apenas retorna o conteúdo do arquivo
						case 'getJson':
						case 'getContent':
							return xhr.responseText;
							break;
						//Se o arquivo for do tipo XML
						case 'getXML':
							return xhr.responseXML;
							break;
							
						//Por padrão, adiciona um tag com o conteúdo do arquivo
						default:
							if(typeof _self.insertHead == 'undefined'){
								throw new Error('FileContentError: O parâmetro: "'+cfg.methodRequest.getParametersName()[1]+'" não foi definido.'+
												'Defina o método público: insertHead()'+' nas classes filhas de: "'+_prototypeName+'" ou passe '+
												'os valores: "getJson" ou "getContent" para este parâmetro');
							}
							
							objLoadFile = _self.insertHead(xhr.responseText,cfg.prepend,cfg.file);
							break;
					}
					
				//Caso p arquivo não seja encontrado, uma mensagem de erro customizada por ser exibida
				}else if(xhr.status == 404){
					if(_ajaxParams.msgNotFound){
						var msgNotFound;
						switch(typeof _ajaxParams.msgNotFound){
							case 'function':
								msgNotFound = _ajaxParams.msgNotFound(_ajaxParams.className,cfg.file);
								msgNotFound = 'Error404: '+(typeof msgNotFound == 'string')?msgNotFound : 'File '+cfg.file+' is not found';
							break;
							default:
								msgNotFound = 'Error404: '+(_ajaxParams.msgNotFound || 'File '+cfg.file+' is not found');
							break;
						}
					}else{
						msgNotFound = 'Error404: File '+cfg.file+' is not found';
					}
				
					throw new Error(msgNotFound);
				}
				
				if(typeof cfg.callback == 'function'){
					cfg.callback({
						className:_ajaxParams.className,
						success:cfg.success || function(){},
						xhr:xhr,
						objLoadFile:objLoadFile || _self
					});
				}else{
					if(typeof cfg.success == 'function'){
						cfg.success(xhr.responseText);
					}
				}
			}
		}
	
	};
	
	this.getNameLoadedClass = function(){
		if(_ajaxParams.className){
			return _ajaxParams.className;
		}
		return null;
	};
	
	/**
	* Define parâmetros ajax para a requisição do arquivo
	* @param {Object} params Objeto de parâmetros para a requisição ajax
	* @return {LoadFile} Pattern Fluent Interface: Retorna um objeto da própria classe
	* @method
	* @see {@link LoadFile#_ajaxParams} Atributo privado que armazena os parâmetros para a requisição
	*/
	this.setParams = function(params){
		if(params){
			for(var x in params){
				_ajaxParams[x] = params[x];
			}
			delete x;
		}
		
		return this;
	};

    /**
     * Efetua a requisição do arquivo via AJAX
     * @method request
     * @memberOf LoadFile
     * @param {string} file Caminho do arquivo a ser requisitado
     * @param {string|function|undefined} prepend (optional) <p>Define o tipo de retorno ou um callback a ser executada após o carregamento do arquivo. Abaixo segue a lista de configurações permitidas:</p><br/>
     *
     * <p><b><u>Configurações Permitidas</u></b></p>
     * <p><pre>
     *  <code>'getJson'</code> = Retorna o conteúdo do arquivo em formato texto. <b>OBS:</b> Necessário efetuar conversão(utilizando JSON.parse() por exemplo);
     *  <code>'getContent'</code> =  Retorna o conteúdo do arquivo em formato texto. Apenas uma convenção para melhor semântica da requisição;
     *  <code>'getXML'</code> =  Retorna o conteúdo do arquivo em formato texto XML;
	 *	<code>function(){}</code> =  Callback executada antes do "success" quando a requisição ajax for concluida;
     *  <b> true</b> =  Caso o método {@link #insertHead} exista em alguma classe filha de {@link LoadFile}.O arquivo requisitado será adicionado no inicio da tag </b>&lt;head&gt;</b>
     * </pre></p>
     *
     * @return {string|XMLDocument} String ou XML do arquivo requisitado
     */
     this.request = function (file,prepend) {
		if(_ajaxParams.typeFile){
			if(typeof this.setTypeFile == 'function'){
				this.setTypeFile(_ajaxParams.typeFile);
			}
		}
		
		/*
		* Adiciona compactação gzip caso o desenvolver tenha habilitado essa opção
		* Este tipo de compatação não é permitida pelo IE 
		*/
		if(_ajaxParams.serverCompressType == 'gzip'
		   && navigator.appName.search('Internet Explorer') == -1){
			file = _ajaxParams.fileGzipInclude? _ajaxParams.fileGzipInclude+'?file='+file:'include.php?file='+file;
		}
	 
         var isFileRequested = file in _requestedFile;
		 var callback = null;
		 
		 if(typeof prepend == 'function'){
			callback = prepend;
			prepend = false;
		}
		prepend = !prepend?false:prepend;
		 
        if(!isFileRequested){
            _requestedFile[file] = true;
			
			_ajaxParams.async = _ajaxParams.async || false;

            var objAjax = _httpRequest();
			var ajaxCompleteParams = {
				"xhr":objAjax,
				"file":file,
				"methodRequest":arguments.callee,
				"prepend":prepend,
				"callback":callback,
				"success":_ajaxParams.success || false
			};
            if (objAjax.readyState != 0) {objAjax.abort();}
			
            objAjax.open("get", file , _ajaxParams.async);
            objAjax.send(null);

            if(!_ajaxParams.async){
				return _onComplete(ajaxCompleteParams);
			}else{
				objAjax.onreadystatechange = function(){
					return _onComplete(ajaxCompleteParams);
				}
			}
        }else{
			_onComplete({
				"isRequested":true,
				"file":file,
				"callback":callback,
				"success":_ajaxParams.success || false
			});
		}
        return this;
    }; 
}