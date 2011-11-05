/**
 * @class Abstract
 * Protótipo que define que uma classe é abstrata. Caso o desenvolvedor queira criar uma classe
 * abstrata, basta herdar desta classe. Esta herança é feita através do método
 * {@link PrototypeAbstract#inherit}
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
 //Classe Abstrata. Por convenção, aconselhamos a utilização do sufixo "_Abstract"
 function MyClass_Abstract(){
    Abstract.inherit(this,arguments);
 }

//Géra uma Exceção, pois não é permitido criar uma instância de um protótipo/classe abstrato
var objAbst = new MyClass_Abstract();
 * </code></pre></p>
 * @extends PrototypeAbstract
 * @singleton
 */
function Abstract(){
    PrototypeAbstract.inherit(this,arguments);
}
/*
 * Método construtor
 * Passa todas as propridades da classe mãe "PrototypeAbstract"
 * para a classe "Abstract"
 *
 */
(function(){
    for(var x in PrototypeAbstract){
        Abstract[x] = PrototypeAbstract[x];
    }
})();


function extendAbstract(){
    Function.prototype.inheritAbstract.apply(this,arguments);
}

/**
 * <p>Método específico para herdar de classes Abstratas</p> <br/>
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
 //Classe Abstrata. Por convenção, aconselhamos a utilização do sufixo "_Abstract"
 function MyClass_Abstract(){
    Abstract.inherit(this,arguments);

    //Método a implementar nas classes que herdarem de "MyClass_Abstract"
    //Todos os métodos deste tipo DEVEM conter o prefixo "abstract"
    this.abstractMethodToImplement(param1){}
 }

 function MyClass(){
    //observe que, na classe que herdadará da classe Abstrata,
   // é retirado o prefixo "abstract" e a convenção cammelCase continua.
  // Além disso a quantidade de parâmetros deve ser a mesma!
    this.methodToImplement(param1){
       alert('implementando método de uma classe abstrata');
    }
 }

 //"MyClass" herda de "MyClass_Abstract"
 MyClass.extendAbstract(MyClass_Abstract);
 * </code></pre></p>
 * @memberOf Function.prototype
 * @method extendAbstract
 * @public
 * @static
 * @see <a ext:cls="Function" ext:member="inheritAbstract" href="output/Function.html#Function-inheritAbstract">Function.inheritAbstract</a> Método estático que fornece seu conteúdo para este método <br/>
 */
Function.prototype.extendAbstract = extendAbstract;
delete extendAbstract;