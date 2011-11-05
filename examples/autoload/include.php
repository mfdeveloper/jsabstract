<?php
/**
* @author F�bio Miranda Costa<br />
* Usado para compactar arquivos JS e CSS, acrescenta-os ao cache do browser
* e faz algumas melhorias adicionais. <script src="incs/file_inc.php?file=funcs.js" type="text/javascript"><!--mce:0--></script>
*/

$ext = pathinfo($_GET["file"],PATHINFO_EXTENSION);

switch($ext){
	case 'js':
		$ext = 'javascript';
	break;
	case 'css':
		$ext = 'css';
	break;
}
ob_start ("ob_gzhandler");
header( "Content-type: text/".$ext."; charset: <span class=\"attribute-value\">utf-8</span>");//n�o se esque�a de mudar para o charset que voc� usa
header( "Content-Encoding: gzip,deflate");
header( "Expires: ".gmdate("D, d M Y H:i:s", time() + (24 * 60 * 60)) . " GMT");//adiciona 1 dia ao tempo de expira��o
header( "ETag: ");//a id�ia � apagar o conte�do da Etag, ver post http://www.meiocodigo.com/2007/12/21/melhorando-o-tempo-de-carregamento-de-um-site/
header( "Cache-Control: must-revalidate, proxy-revalidate" );

readfile($_GET["file"]);

ob_flush();

?>