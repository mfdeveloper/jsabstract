/**
 * @class navigator
 * Métodos adicionais para a classe "navigator"
 * @namespace window
 */

/**
 * <p>Crossbrowser que retorna a linguagem definida no sistema operacional do usuário</p>
 * @method getLanguage
 * @memberOf window.navigator
 * @see <p><a href="https://developer.mozilla.org/en/navigator.language"> window.navigator.language</a> Propriedade utilizada por outros navegadores</p><br/>
 *      <p><a href="http://www.w3schools.com/jsref/prop_nav_userlanguage.asp"> window.navigator.userLanguage</a> Propriedade utilizada pelo Internet Explorer</p>
 */
window.navigator.getLanguage = function(){
    var language = window.navigator.userLanguage || window.navigator.language;
    return language.toLowerCase();
};

/**
 * @class Msg_Translate
 * <p>Internacionalização das mensagens de erros</p><br/>
 * <p><b>OBS:</b> Na atual versão, esta classe possui mensagens apenas em Português-Brasil</p>
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
//Crie uma instância normalmente
var objTrans = new Msg_Translate();

//Ou defina no construtor o idioma no qual você irá utilizar as mensagens
var objTrans = new Msg_Translate('en-US');
 * </code></pre></p>
 *
 * @constructor
 * @param {string} lang (optional) Linguagem das mensagens de erros.
 * @see <a ext:cls="window.navigator" ext:member="getLanguage" href="outpu/window.navigator.html#window.navigator-getLanguage">window.navigator.getLanguage</a> Função que retorna a linguagem do sistema operacional
 * @version 1.0
 */
function Msg_Translate(lang){
    /**
     * Armazena a linguagem das mensagens de erro
     * @property
     * @type {string}
     * @private
     */
    var _language = (typeof lang != 'undefined')?lang:window.navigator.getLanguage();

    /**
     * Mensagens de erro internacionalizadas
     * @property
     * @type {object} 
     * @private
     */
    var _msgs = {
        'pt-br':{
            notCreateInstance:function(elementName){
                return 'Não é possível criar instâncias de '+elementName+'s, pois o'+
                       ' protótipo é Abstrato ou é uma Interface'
            },
            conflictProperties:function(prop,entities){
               return 'Conflito da propriedade: '+prop+' nas entidades: '+entities;
            },
            notMultipleInherit:function(){
                return 'Não é permitido herança múltipla de classes Abstratas';
            },
            notEmptyAbstractMethod:function(prop,elementName){
               return 'Os método "'+prop+'" da entidade '+elementName+' não está vazio';
            },
            notAttrsInterfaces: function(){
                return 'Interfaces não podem conter atributos';
            },
            notEqualTotalParams:function(prop,elementName){
               return  'O método "'+prop+'" deve possuir a mesma quantidade de parâmetros '+
                       'que foi definido na entidade: '+elementName;
            },
            notEqualParams:function(paramName,elementName,prototypeName){
                return 'O parâmetro "'+paramName+'" da entidade: '+elementName+
                       ' é diferente do que foi definido na classe '+prototypeName;
            },
            notImplementedMethods:function(methods,elementName,prototypeName){
                return 'Os métodos "'+methods+'" de "'+elementName+
                       '"  não foram implementados em: '+prototypeName;
            }
        }
    };

    /**
     * Busca as mensagens internacionalizadas de acordo com a linguagem,
     * definida no construtor ou no retorno de {@link window.navigator#getLanguage}
     *
     * <p><b><u>Exemplo de utilização</u></b></p>
     * <p><pre><code>
     * //Crie a instância da classe
     * var objTrans = new Msg_Translate();
     *
     * //Escolha um dos métodos definidos na propriedade privada "_msgs" da classe "Msg_Translate"
     * //Neste exemplo, o método "conflictProperties" recebe como argumentos uma propriedade
     * //e um array de entidades, exibindo uma mensagem de erro quando dois protótipos abstratos
     * //possuem a mesma propriedade
     * var msgErr = objTrans.getMsgs.conflictProperties(property,entities);
     * </code></pre></p>
     * @method
     * @memberOf Msg_Translate
     * @public
     * @return {object|null} Objeto contendo as mensagens de erro na linguagem definida no construtor, ou no sistema operacional.
     *                       Caso seja definido um idioma que não tenha mensagens configuradas, este método retornará "null"
     */
    this.getMsgs = function(){
        if(typeof _msgs[_language] != 'undefined'){
              return _msgs[_language];
        }
        return null;
    };
    /**
     * Define as mensagens de erro para um idioma definido no parâmetro "lang"
     *
     * <p><b><u>Exemplo de utilização</u></b></p>
     * <p><pre><code>
     * //Crie a instância da classe
     * var objTrans = new Msg_Translate();
     *
     * //Neste exemplo, esta sendo criado uma mensagem de erro para conflitos de propriedades
     * //para Idioma "en-US"
     * objTrans.setMsgs('en-US',{
            conflictProperties:function(prop,entities){
                return 'Conflict for property:'+prop+' in entities:'+entities;
            }
         }
     * });
     *
     * //Ou, não defina um idioma, e a mensagem será definida para o
     * // idioma padrão do sistema operacional
     * objTrans.setMsgs({
           conflictProperties:function(prop,entities){
               return 'Ops!, conflito da propriedade property:'+prop+' nas entidades:'+entities+'. Corrija isso desenvolvedor!!';
           }
     * })
     * </code></pre></p>
     * @method
     * @memberOf Msg_Translate
     * @public
     * @param {string|object} lang Novo idioma com novas mensagens de erro, ou objeto contendo as mensagens de erro para a linguagem definida
     *                             no construtor, ou retornada por {@link window.navigator#getLanguage}
     * @param {object|undefined} objMsgs (optional) Objeto contendo as mensagens de erro para a linguagem definida
     *                                              no construtor, ou retornada por {@link window.navigator#getLanguage}
     * @return {Msg_Translate} Retorna um objeto da própia classe(Padrão Fluent Interface)
     */
    this.setMsgs = function(lang,objMsgs){
        if(typeof lang == 'object' && typeof objMsgs == 'undefined'){
            objMsgs = lang;
            lang = _language;
        }

        if(typeof _msgs[lang] == 'undefined'){
            _msgs[lang] = objMsgs;
        }else{
            for(var x in objMsgs){
                _msgs[lang][x] = objMsgs[x];
            }
        }
        return this;
    }
    
}