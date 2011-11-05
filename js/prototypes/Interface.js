/**
 * @class Interface
 * <p>Protótipo que define que uma classe é uma interface. Uma Interface é nada mais do que
 * uma classe que herda da protótipo "Interface" :) <br/>
 * Caso o desenvolvedor queira criar uma
 * interface, basta herdar desta classe. Esta herança é feita através do método
 * {@link PrototypeAbstract#inherit}</p><br/>
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
 //Interface. Por convenção, aconselhamos a utilização do sufixo "_Interface"
 function MyClass_Interface(){
    Interface.inherit(this,arguments);
 }

//Géra uma Exceção, pois não é permitido criar uma instância
//de um protótipo/classe do tipo interface
var objInt = new MyClass_Interface();
 * </code></pre></p>
 * @extends PrototypeAbstract
 * @singleton
 */
function Interface(){
    PrototypeAbstract.inherit(this,arguments);
}

/*
 * Método construtor
 * Passa todas as propridades da classe mãe "PrototypeAbstract"
 * para a classe "Interface"
 *
 */
(function(){
    for(var x in PrototypeAbstract){
        Interface[x] = PrototypeAbstract[x];
    }
})();

function implement(){
    Function.prototype.inheritAbstract.apply(this, arguments);
}

/**
 * <p>Método específico para implementar Interfaces</p> <br/>
 *
 * <p><b><u>Exemplo de utilização</u></b></p>
 * <p><pre><code>
 //Interface. Por convenção, aconselhamos a utilização do sufixo "_Interface"
 function Prototype_Interface(){
    Interface.inherit(this,arguments);

    //Método a implementar nas classes que implementaram a interface "Prototype_Interface"
    this.methodToImplement(param1){}
 }

 function MyClass(){
    //È necessário implementar o método "methodToImplement" sendo que, os parâmetros
    // devem conter a mesma quantidade e o mesmo nome.Caso contrário, uma exceção é gerada!!
    this.methodToImplement(param1){
       alert('implementando método de uma classe abstrata');
    }
 }

 //"MyClass" implementa a interface: "Prototype_Interface"
 MyClass.implement(Prototype_Interface);
 * </code></pre></p>
 * @memberOf Function.prototype
 * @method implement
 * @public
 * @static
 * @see <a ext:cls="Function" ext:member="inheritAbstract" href="output/Function.html#Function-inheritAbstract">Function.inheritAbstract</a> Método estático que fornece seu conteúdo para este método <br/>
 */
Function.prototype.implement = implement;
delete implement;