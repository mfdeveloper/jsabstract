// implement JSON.stringify serialization
window.JSON = window.JSON || {};
JSON.stringify = JSON.stringify || function (obj) {  
    var t = typeof (obj);  
    if (t != "object" || obj === null) {  
        // simple data type  
        if (t == "string") obj = '"'+obj+'"';  
        return String(obj);  
    }  
    else {  
        // recurse array or object  
        var n, v, json = [], arr = (obj && obj.constructor == Array);  
        for (n in obj) {  
            v = obj[n]; t = typeof(v);  
            if (t == "string") v = '"'+v+'"';  
            else if (t == "object" && v !== null) v = JSON.stringify(v);  
            json.push((arr ? "" : '"' + n + '":') + String(v));  
        }  
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");  
    }  
}; 

function $jsa(obj){
    var element  = null;

    (function(){
        if(typeof obj != 'undefined'){
            element = obj;
        }

    })();

    return new $jsa.object(element);
}

$jsa.object = function(obj){

    if(arguments.callee.caller != $jsa){
        throw new Error('Não é permitido instanciar o protótipo: "$jsa.object"');
    }

    this.getNames = function(){
        var str = '';

        if(obj instanceof Array){
            if(obj.length > 1 ){
                for(var x in obj){
                    if(obj[x] instanceof Function){
                        str += obj[x].getName()+',';
                    }else{
                        break;
                    }
                }
            }
            
        }else{
            new PrototypeError('JSAbstractError', 'O Elemento definido no parâmetro "obj" precisa ser um array ');
        }

        return str.replace(/,+$/, '');
    };
	
	this.toUpperFirst = function(str){
		var result = '';
		obj = str || obj;
		
		if(Object.prototype.toString.call(obj) === '[object String]'){
			var firstLetter = obj.charAt(0);
            result = obj.replace(obj.charAt(0),firstLetter.toUpperCase());
		}
		if(obj instanceof Array){
			var objs = [];
			result = obj;
			for(var x=0;x<result.length;x++){
				objs.push(this.toUpperFirst(result[x]));
			}
			delete x;
			result = objs;
		}
		
		return result;
	};
	
	this.merge = function(objMerge,mode){
		if(Object.prototype.toString.call(obj) == '[object Object]' 
		   && Object.prototype.toString.call(objMerge) == '[object Object]'){
			for(var x in objMerge){
				if(!(x in obj)){
					if(mode != 'notThrowExcept'){
						throw new Error('A propriedade: "'+x+'" não é permitida');
					}
				}
				obj[x] = objMerge[x];
			}
		}
		
		if(obj instanceof Array && objMerge instanceof Array){
			for(var x in objMerge){
				obj.push(objMerge[x]);
			}
		}else if(objMerge instanceof Array){
			for(var i=0;i<objMerge.length;i++){
				this.merge(objMerge[i],mode);
			}
		}
		return obj;
	};
	
	this.arrayToString = function(separator){
		var str = '';
		if(obj instanceof Array){
			for(var i in obj){
				if(Object.prototype.toString.call(obj[i]) == '[object String]'){
					str += "'"+obj[i]+"'"+separator; 
				}
				
				if(Object.prototype.toString.call(obj[i]) ==  '[object Object]'){
					str += JSON.stringify(obj[i])+separator;
				}
			}
			delete i;
			str = str.replace(/\,$/,'');
		}
		
		return str;
	};
};

/**
 * @class PrototypeAbstract
 * Classe que géra erros provocados por elementos abstratos
 * (interfaces e classes abstratas)
 * 
 * @throws {PrototypeAbstract} Se uma instância de um protótipo abstrato for criado
 * @author Michel Felipe
 * @version 1.0
 * @see <p><a ext:member="" ext:cls="PrototypeError" href="output/PrototypeError.html">PrototypeError</a> Classe de geração de exceções(erros)</p><br/>
 *      <p><a ext:member="" ext:cls="Msg_Translate" href="output/Msg_Translate.html">Msg_Translate</a> Classe de internacionalização das mensagens de erro</p><br/>
 *      <p><b>OBS:</b> Esta dependência ainda não é completa. Na próxima versão, essa dependência será total (em todas as mensagens de erro)
 */
function PrototypeAbstract(){
    var msgError = 'Não é possível criar instâncias de elementos do tipo "'+arguments.callee.caller.caller.getName()+'"';
    new PrototypeError('PrototypeAbstract', msgError);
}

/**
 * <p>Método que define quando um protótipo é abstrato.
 * Essa herança só ocorre, quando nenhum argumento é passado
 * para o construtor do protótipo, ou quando o argumento não é
 * a função "_inheritAbstract" informando que a instância so pode
 * ser criada nesse contexto.</p>
 *
 * <p>Independente da herança, toda vez que um protótipo abstrato
 * é passado para este método, o atributo "typeClass" é criado
 * tendo em seu valor, a definição se este é "Abstract" ou uma
 * "Interface"</p>
 *
 * @method inherit
 * @lends PrototypeAbstract
 * @static
 */
PrototypeAbstract.inherit = function(newAbstractEntity,args){
   var type = /(Interface)|(Abstract)/.exec(arguments.callee.caller);
   
   if(typeof args[0] == 'undefined' || args[0].getName() != '_inheritAbstract'){
        this.apply(newAbstractEntity,args);
    }
    /*
     * Não exibe erro caso o construtor de "newAbstractEntity"
     * tenha sido alterado para um objeto qualquer
     */
    try{
       newAbstractEntity.constructor.constructor = this;
    }catch(e){}

   if(type !== null && typeof type[0] != 'undefined'){
       
       arguments.callee.caller.typeClass = type[0];
       arguments.callee.caller.prototype.typeClass = type[0];
   }
};

/**
 * @class PrototypeError
 * <p>Define a forma como um erro de protótipo é gerado em browsers diferentes</p>
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
function MyClass(){
     Abstract.inherit(this,arguments);
 }
 if(MyClass.typeClass != 'Interface'){
      //O erro do tipo 'InterfaceError' será gerado, pois 'MyClass' é uma classe abstrata
      new PrototypeError('InterfaceError','O protótipo: "MyClass" não é uma interface');
}
 * </code></pre></p>
 *
 * @constructor
 * @see console.error Utiliza o objeto Console do Firebug, acesse: <a href="http://getfirebug.com/logging"> http://getfirebug.com/logging </a>
 * @throws {Error} Se o erro for padrão ou um tipo de erro específico definido no parâmetro "errorName"
 * @author Michel Felipe
 * @version 1.0
 */
function PrototypeError(errorName,msgError){

    msgError = errorName+': '+msgError;
	
    if(typeof console != 'undefined'){
        console.error(msgError);
    }
    throw new Error(msgError);
}

/**
 * @class Function
 * Métodos adicionais de orientação a objetos para qualquer função/protótipo javascript
 */

/**
* <b>&lt;static&gt;:</b> <p> Propriedade criada somente para elementos Abstratos.
* Ela indentifica que tipo de classe é o protótipo (Interface ou Classe Abstrata).
* Todos os protótipos abstratos herdam essa propriedade</p><br/>
*
* <p><b><u>Exemplo de utilização</u></b></p>
* <p><pre><code>
* //Classe Abstrata. Por convenção, aconselhamos a utilização do sufixo "_Abstract"
* function MyClass_Abstract(){
     Abstract.inherit(this,arguments);
* }
*
* //Exibe: "Abstract" indentificando o protótipo como uma classe Abstrata
* alert(MyClass_Abstract.typeClass);
* </code></pre></p>
*
* @property typeClass
* @type {string}
* @member Function.prototype
* @static
* @public
*/
Function.prototype.typeClass = null;

 /**
 * <p>Retorna os parâmetros definidos em uma função/protótipo</p><br/>
 * <p><b>Exemplo:</b></p>
 * <p><pre><code>
function MyClass(param1,param2){
}
//arrParams[0] (retorna "param1") e arrParams[1] (retorna "param2")
var arrParams = MyClass.getParametersName()
 * </code></pre></p>
 * @memberOf Function.prototype
 * @public
 * @return {Array} Array contendo os parâmetros definidos na função.
 */
Function.prototype.getParametersName = function(){
    var regexParams = /\(\d*\w*[(,*\s*)\d*\w*]*\)/;

    var arrParams = regexParams.exec(this.toString());
    arrParams = arrParams[0].replace(')', '').replace('(', '').split(',');

    return arrParams;
};

/**
 * <p>Inicia métodos específicos para objetos de protótipos/classes criados pelo desenvolvedor</p><br/>
 *
 * <p><b>Exemplo de utilização:</b></p>
 * <p><pre><code>
function MyClass(){
   //Ao executar, new MyClass() o objeto resultante terá os métodos {@link Function#clone} e {@link Function#equal}
   arguments.callee.initMethods();
}
var objCloneable = new MyClass();

//Clona o objeto de MyClass para outro objeto
var objClone = objCloneable.clone();
 * </code></pre></p>
 * @method
 * @memberOf Function.prototype
 * @public
 */
Function.prototype.initMethods = function(){
    /**
     * <p>Clona um objeto, copiando suas propriedades e seu construtor para o objeto clonado </p> <br/>
     * <b>OBS:</b> Para que este método funcione, não modifique a propriedade <i>"constructor"</i> dos objetos a serem clonados
     * @method
     * @memberOf Function.prototype.prototype
     * @public
     * @return object Objeto clonado
     */
    this.prototype.clone = function(){
        var clonedObj = {};

        for(var x in this){
            clonedObj[x] = this[x];
        }
        clonedObj.constructor = this.constructor;
        delete x;
        return clonedObj;
    };

    /**
     * Checa se um objeto é igual a outro, verificando suas propriedades e seus construtores
     * @method
     * @memberOf Function.prototype.prototype
     * @public 
     * @return boolean True, caso um objeto seja exatamente igual ao outro ou false caso contrário
     */
    this.prototype.equal = function(obj){
        var isEqual = false;
        if(this.constructor == obj.constructor){
            isEqual = true;
            for(var x in this){
                if(!obj.hasOwnProperty(x) && obj[x] != this[x]){
                    isEqual = false;
                    break;
                }
            }
        }
        return isEqual;
    };
};

/**
 * <p>Crossbrowser que retorna o nome de uma determinada função/protótipo</p><br/>
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
function MyClass(){}

//Exibe o nome do protótipo
alert(MyClass.getName());
 * </code></pre></p>
 * @memberOf Function.prototype
 * @method getName
 * @public
 * @return {String} Nome da função/protótipo
 */
Function.prototype.getName  = function(){

    var name = '';
    if(typeof this.name == 'undefined'){
        var regexFnName = /\W*function\s+([\w\$]+)\(/;
        name = regexFnName.exec(this);
        
        if(name instanceof Array){
             name = (typeof name[1]!= 'undefined')? name[1]:'anonymous';
        }
		this.name = name;
        return name;
    }else{
        name = (this.name.length == 0)?'anonymous':this.name;
        return name;
    }
};

/**
 * <p>Checa se uma Função está vazia</p><br/>
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
function MyFunction(){}

//Exibe true, pois "MyFunction" está vazia
alert(MyFunction.isEmpty());
 * </code></pre></p>
 * @memberOf Function.prototype
 * @method isEmpty
 * @public
 * @return {boolean} Retorna true, caso a função esteja vazia ou false caso contrário
 */
Function.prototype.isEmpty = function(){
    
    //Expressão regular para funções vazias (crossbrowser)
    var regexEmptyMethod = /function\s?\(\d*\w*[(,*\s*)\d*\w*]*\)\s?\{(\s?)}/i;

    return regexEmptyMethod.test(this.toString());
};

/**
 * Herança geral de elementos abstratos (interfaces e/ou classes abstratas)
 * quando implementados em uma determinada classe/protótipo.<br/>
 * Este método é utilizado como herança pra os métodos {@link Function#implement} e {@link Function#extendAbstract}
 * @memberOf Function.prototype
 * @method inheritAbstract
 * @public
 */
Function.prototype.inheritAbstract = _inheritAbstract;

/*
 * A documentação deste método está no método Function.prototype.inheritAbstract
 */
function _inheritAbstract(abstractElement){
    
    // Referência a Classes/Protótipos criados (Objetos da classe Function)
    var fn = this;
    //Array de propriedades herdadas e não implementadas na classe "filha"
    var notImplemented = [];
    //Armazena as mensagens de erro
    var msgError = '';
    //Associação: Objeto contendo internacionalização das mensagens de erro
    var objTranslate = new Msg_Translate();

    var fnCaller = arguments.callee.caller.getName();

    /*
     * Recursividade, caso vários elementos abstratos (interfaces e/ou classes abstratas)
     * sejam passadas ao parâmetro "abstractElement"
     */
    if(abstractElement instanceof Array){
        
        for(var x in abstractElement){

            /*
             * Caso tenha + de um elemento e estes tenham o tipo 'Interface',
             * verifica conflitos de métodos entre as Interfaces (nomes iguais).
             */
            if(x >= 1){
                var currentObj = new abstractElement[x](arguments.callee);
                var previousObj = new abstractElement[x-1](arguments.callee);
                
                if(abstractElement[x].typeClass == 'Interface'){
                    for(var prop in currentObj){
                        if(previousObj.hasOwnProperty(prop)){
                            msgError = objTranslate.getMsgs().conflictProperties(prop,$jsa(abstractElement).getNames());
                            new PrototypeError(abstractElement[x].typeClass+'Error', msgError);
                            return false;
                        }
                    }
                    delete prop;
                }
            }

            this.inheritAbstract(abstractElement[x],abstractElement.length);
        }
        delete x;

    }else{
         

        /*
         * Cria um objeto de um elemento abstrato. O parâmetro "arguments.calle" passado no construtor
         * 'garante' que um objeto privado seja criado apenas no contexto do método "inheritAbstract"
         */
        var objAbstract = new abstractElement(arguments.callee);

        abstractElement.typeClass = (abstractElement.typeClass == null)?'Class':abstractElement.typeClass;
        var typeError = abstractElement.typeClass+'Error';
        var abstractLength = (arguments.length > 1 && typeof arguments[1] == 'number')?arguments[1]:null;

        if(fnCaller == 'extendAbstract'){
            if(abstractElement.typeClass != 'Abstract'){
                msgError = 'Só é permitido herdar de classes abstratas com o método: "'+fnCaller+'". Você informou '+
                            'o protótipo: "'+abstractElement.getName()+'" do tipo: "'+abstractElement.typeClass+'"';
                new PrototypeError(abstractElement.typeClass+'Error',msgError);
            }
        }

        if(fnCaller == 'implement'){
            if(abstractElement[x].typeClass != 'Interface'){
                msgError = 'Só é permitido implementar interfaces com o método: "'+fnCaller+'". Você informou '+
                            'o protótipo: "'+abstractElement[x].getName()+'" do tipo: "'+abstractElement[x].typeClass+'"';
                new PrototypeError('InterfaceError',msgError);
            }
        }

        /*
         * Bloqueia herança multipla de protótipos Abstratos
         * verificando a quantidade de elementos Abstratos definidos
         * em "abstractElement"
         */
        if(null !== abstractLength){
            if(abstractLength > 1 && abstractElement.typeClass == 'Abstract'){
                msgError = 'Não é permitido herança múltipla de classes Abstratas';
                new PrototypeError(typeError, msgError);
                return false;
            }
        }
        /*
         * Cria a cadeia de protótipos abstratos(interfaces e classes abstratas
         * em tempo de execução, apenas para Classe q implementam este tipo de
         * protótipo
         */
        
        if(abstractElement.typeClass != 'Class'){
            
            if(!fn.hasOwnProperty('Chain')){

                /**
                 * @class Function.prototype.Chain
                 * Chain Armazena/Retorna a cadeia de protótipos abstratos de uma classe.
                 * Esta classe é um singleton criado em tempo de execução, somente se
                 * não for uma propriedade existente.
                 *
                 * @singleton
                 * @author Michel Felipe <a href="mailto:michelphp@gmail.com">michelphp</a>
                 * @version 1.0
                 */
                fn.Chain = (function(){
                    /**
                     * Armazena a cadeia de protótipos.As cadeias disponíveis são:
                     * <p>
                     * "interfaces" = Armazena interfaces implementadas <br/>
                     * "abstracts" = Armazena classes abstratas herdadas
                     * </p>
                     *
                     * @property
                     * @type {object}
                     * @private
                     */
                    var _chain = {
                        interfaces:[],
                        abstracts:[]
                    };

                    return {
                        /**
                         * <p> Retorna os protótipos abstratos definidos em uma cadeia </p><br/>
                         *
                         * <p><b><u>Exemplo de utilização</u></b></p>
                         * <p><pre><code>
                         * function MyClass_Abstract(){
                         *    Abstract.inherit(this,arguments);
                         * }
                         * function MyClass(){
                         *
                         * }
                         *
                         * MyClass.extendAbstract(MyClass_Abstract);
                         * var abstractChain = MyClass.Chain.get();
                         *
                         * //Exibe: "MyClass_Abstract" que é a classe abstrata implementada por "MyClass"
                         * alert(abstractChain[0]);
                         * </code></pre></p>
                         * @method
                         * @public
                         * @param {string} type Tipo de cadeia abstrata. Defina "interfaces" ou "abstracts"
                         * @return {array} Retorna um array contendo os elementos abstratos da cadeia informada no parâmetro "type"
                         */
                        get : function(type){
                            if(typeof type == 'string'){
                                return _chain[type];
                            }
                            return null;
                        },
                        /**
                         * <p> Adiciona um protótipo abstrato na cadeia definida no parâmetro "type"</p><br/>
                         * <p>
                         * <b>OBS:</b>Apesar de ser público, caso tente executar este método de fora do método "implement" ou do método "extendAbstract"
                         * uma exceção é gerada
                         * </p>
                         * @method
                         * @public
                         * @param {string} type Tipo de cadeia abstrata. Defina "interfaces" ou "abstracts"
                         * @param {string} value Elemento abstrato do tipo definido no parâmetro "type"
                         * @return Chain Retorna um objeto da própria classe(Padrão Fluent Interface)
                         */
                        set : function(type,value){

                            if(arguments.callee.caller == null || arguments.callee.caller.getName() != '_inheritAbstract'){
                                new PrototypeError('ChainError', 'O método: "set" é privado no contexto do método: "inheritAbstract');
                            }
                            if(typeof type == 'string'){
                                if(!_chain.hasOwnProperty(type)){
                                    new PrototypeError('ChainError', 'O tipo: "'+type+'" nao foi encontrado na cadeia de protótipos');
                                }
                                _chain[type].push(value);
                            }
                            return this;
                        }
                    }
                })();
            }

            fn.Chain.set(abstractElement.typeClass.toLowerCase()+'s', abstractElement.getName());
        }

        for(var property in objAbstract){
            var originProperty = property;

            if(abstractElement.typeClass == 'Interface' || /^abstract/.test(property)){
                if(property == 'typeClass'){
                    continue;
                }

                if(objAbstract[property] instanceof Function){

                    if(objAbstract.hasOwnProperty(property) && !objAbstract[property].isEmpty()){
                        msgError = 'Os método "'+property+'" da entidade '+abstractElement.getName()+' não está vazio';
                        new PrototypeError(typeError, msgError);
                    }

                    /*
                     * Passa todas as propriedades com prefixo "abstract" para o protótipo
                     * no padrão "nomeDoMetodo" em cammel case
                     */
                    if(abstractElement.typeClass == 'Abstract'){
                        property = property.replace('abstract', '');
                        property = property.replace(property[0], property[0].toLowerCase());
                    }
                    fn.prototype[property] = objAbstract[originProperty];
                }else{
                    if(abstractElement.typeClass == 'Interface'){
                        msgError = 'Interfaces não podem conter atributos';
                        new PrototypeError(typeError, msgError);
                    }
                }

                var objFn = new fn();
                
                if(objFn[property].isEmpty()){
                    notImplemented.push(property);
                }
                
                if(objAbstract[originProperty].length != objFn[property].length){
                    msgError = 'O método "'+property+'" deve possuir a mesma quantidade de parâmetros '+
                               'que foi definido na entidade: '+abstractElement.getName();

                    new PrototypeError(typeError, msgError);
                }else{
                    var arrParamsInt = objAbstract[originProperty].getParametersName();
                    var arrParamsFn = objFn[property].getParametersName();

                    for(var y in arrParamsInt){
                        if(arrParamsInt[y] != arrParamsFn[y]){
                            msgError = 'O parâmetro "'+arrParamsInt[y]+'" da Interface '+abstractElement.getName()+
                                ' é diferente do que foi definido na classe '+fn.getName();

                            new PrototypeError(typeError, msgError);
                        }
                    }
                }
            }
        }

        if(notImplemented.length > 0){
            msgError = 'Os métodos "'+notImplemented+'" de "'+abstractElement.getName()+'"  não foram implementados em: '+fn.getName();
            new PrototypeError(typeError, msgError);
        }
        
    }
}