<?php 
// Dados da conexão com o banco de dados
define('SERVER', '79.170.44.156');
define('DBNAME', 'cl36-rickpara');
define('USER', 'cl36-rickpara');
define('PASSWORD', 'dUgkf-/d4');

// Recebe os parâmetros enviados via GET
$acao = (isset($_GET['acao'])) ? $_GET['acao'] : '';
$parametro = (isset($_GET['parametro'])) ? $_GET['parametro'] : '';

// Configura uma conexão com o banco de dados
$opcoes = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES UTF8');
$conexao = new PDO("mysql:host=".SERVER."; dbname=".DBNAME, USER, PASSWORD, $opcoes);

// Verifica se foi solicitado uma consulta para o autocomplete
if($acao == 'autocomplete'):
	$where = (!empty($parametro)) ? 'WHERE codigo_item LIKE ?' : '';
	$sql = "SELECT codigo_item, descricao_item, aliq_ipi, ncm FROM base_prod " . $where;



$stm = $conexao->prepare($sql);
$stm->bindValue(1, $parametro.'%');
$stm->execute();
$dados = $stm->fetchAll(PDO::FETCH_OBJ);

$json = json_encode($dados);
echo $json;
endif;

// Verifica se foi solicitado uma consulta para preencher os campos do formulário
	if($acao == 'consulta'):
		$sql = "SELECT codigo_item, descricao_item, aliq_ipi, ncm FROM base_prod ";
	$sql .= "WHERE codigo_item LIKE ? LIMIT 1";

	$stm = $conexao->prepare($sql);
	$stm->bindValue(1, $parametro.'%');
	$stm->execute();
	$dados = $stm->fetchAll(PDO::FETCH_OBJ);

	$json = json_encode($dados);
	echo $json;
	endif;

// Verifica se foi solicitado uma consulta para preencher o mva
	if($acao == 'consulta'):
	$sqlz = "SELECT ncm, rs, sc, sc_simples, rj, mg, mt, ap FROM nmcMVA " . $where;	
	$sqlz .= "WHERE ncm LIKE ? LIMIT 1";

	$stm = $conexao->prepare($sqlz);
	$stm->bindValue(1, $parametro.'%');
	$stm->execute();
	$dados = $stm->fetchAll(PDO::FETCH_OBJ);

	$json = json_encode($dados);
	echo $json;
	endif;

		