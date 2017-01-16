<?php
// Dados da conexão com o banco de dados
define('SERVER', '79.170.44.156');
define('DBNAME', 'cl36-rickpara');
define('USER', 'cl36-rickpara');
define('PASSWORD', 'dUgkf-/d4');

// Recebe os parâmetros enviados via GET
$acao = (isset($_GET['acao'])) ? $_GET['acao'] : '';
$parametro = (isset($_GET['parametro'])) ? $_GET['parametro'] : '';

$ncm = (isset($_GET['ncm'])) ? $_GET['ncm'] : '';
$estado = (isset($_GET['estado'])) ? $_GET['estado'] : '';

// Configura uma conexão com o banco de dados
$opcoes = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES UTF8');
$conexao = new PDO("mysql:host=" . SERVER . "; dbname=" . DBNAME, USER, PASSWORD, $opcoes);

// Verifica se foi solicitado uma consulta para o autocomplete
if ($acao == 'autocomplete'):
    $where = (!empty($parametro)) ? 'WHERE codigo_item LIKE ?' : '';
    $sql = "SELECT * FROM base_prod " . $where;

    $stm = $conexao->prepare($sql);
    $stm->bindValue(1, $parametro . '%');
    $stm->execute();
    $dados = $stm->fetchAll(PDO::FETCH_OBJ);

    $json = json_encode($dados);
    echo $json;
endif;

// Verifica se foi solicitado uma consulta para preencher os campos do formulário
if ($acao == 'consulta'):
    $sql = "SELECT * FROM base_prod ";
    $sql .= "WHERE codigo_item LIKE ? LIMIT 1";

    $stm = $conexao->prepare($sql);
    $stm->bindValue(1, $parametro . '%');
    $stm->execute();
    $dados = $stm->fetchAll(PDO::FETCH_OBJ);

    $json = json_encode($dados);
    echo $json;
endif;

if ($acao == 'consultaPorNCM'):
    $sqlz = "SELECT T1.ncm, T1.valor, T1.estado, T2.sigla, T2.nome, T2.aliq_interna FROM mva T1 INNER JOIN estados T2 ON T2.id = T1.estado WHERE T1.ncm = ? AND T1.estado = ?";
    $stm = $conexao->prepare($sqlz);
    $stm->bindValue(1, $ncm . '%');
    $stm->bindValue(2, $estado . '%');
    $stm->execute();
    $dados = $stm->fetchAll(PDO::FETCH_OBJ);

    $json = json_encode($dados);
    echo $json;
    //echo $sqlz;
	endif;	
        
      //select * from base_prod where `codigo_item` = 'A135-127'
      //NCM: 85081900 
      //SELECT FROM mva T1 INNER JOIN base_prod T2 ON T1.ncm = T2.mcm INNER JOIN T1 ON estados T3.id = T1.estado WHERE T1.ncm = '85081900'