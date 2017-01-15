$(function () {

    // Atribui evento e função para limpeza dos campos
    $('#busca').on('input', limpaCampos);

    // Dispara o Autocomplete a partir do segundo caracter
    $("#busca").autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "consulta.php",
                dataType: "json",
                data: {
                    acao: 'autocomplete',
                    parametro: $('#busca').val()
                }
//                ,
//                success: function (data) {
//                    response(data);
//                }
            }).done(function (data) {
                response(data);
            });
        },
        focus: function (event, ui) {
            $("#busca").val(ui.item.codigo_item);
            //carregarDados();
            return false;
        },
        select: function (event, ui) {
            $("#codigoItem").val(ui.item.codigo_item);
            $("#descricao").val(ui.item.descricao_item);
            $("#aliqIPI").val(ui.item.aliq_ipi);

            var ncm = ui.item.ncm;
            $("#ncm").val(ncm);

            /**
             *  ATENÇÃO
             *  O Evento que dispara a busca do MVA é este,
             *  isto é, "select" no resultado do campo busca.
             *
             */

            buscarMVA(ncm);
            return false;
        }
    })
            .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
                .append(item.codigo_item + " — " + item.descricao_item)
                .appendTo(ul);
    };

    var buscarMVA = function (ncm) {
        $('#mva').val("BUSCANDO MVA...");

        $.ajax({
            url: "consulta.php",
            dataType: "json",
            data: {
                acao: 'consultaPorNCM',
                parametro: ncm
            }
            ,
            success: function (data) {
                $('#mva').val("MVA ENCONTRADO!");
                if (data[0]) {
                    var mva = data[0].rs;
                    console.log('MVA: ' + mva);
                    $('#mva').val(mva);
                }
            },
            error: function (data) {
                $('#mva').val("FUDEU!");
            }
        });


//        if (ncm) {
//            $.ajax({
//                url: "consulta.php",
//                dataType: "json",
//                data: {
//                    acao: 'consulta',
//                    parametro: ncm
//                }
//                ,
//                success: function (data) {
//                    alert('SUCCESS MVA');
//                }
//            }).done(function (data) {
//                console.log();
//                if (data) {
//                    if (data[0].rs) {
//                        var mva = data[0].rs;
//                        console.log('MVA: ' + mva);
//                        $('#mva').val(mva);
//                    } else {
//                        console.log('MVA: NAO FOI RETORNADO');
//                    }
//                } else {
//                    console.log('MVA: CONSULTA FALHOU');
//                }
//
//            });
//        }
    };

    // Função para carregar os dados da consulta nos respectivos campos
    function carregarDados() {
        var busca = $('#busca').val();

        if (busca != "" && busca.length >= 2) {
            $.ajax({
                async: false,
                url: "consulta.php",
                dataType: "json",
                data: {
                    acao: 'consulta',
                    parametro: $('#busca').val()
                }
//                ,
//                success: function (data) {
//                    $('#codigoItem').val(data[0].codigo_item);
//                    $('#descricao').val(data[0].descricao_item);
//                    $('#aliqIPI').val(data[0].aliq_ipi);
//                    $('#ncm').val(data[0].ncm);
//                }
            }).done(function (data) {
                if (data) {
                    if (data[0]) {
                        $('#codigoItem').val(data[0].codigo_item);
                        $('#descricao').val(data[0].descricao_item);
                        $('#aliqIPI').val(data[0].aliq_ipi);

                        var ncm = data[0].ncm;

                        //carregarMVA(ncm);
                        if (ncm) {
                            $('#ncm').val(ncm);
                            $('#mva').val(ncm);
                            alert(mvaValue);

//                            $.ajax({
//                                url: "consulta.php",
//                                dataType: "json",
//                                data: {
//                                    acao: 'consulta',
//                                    parametro: ncm
//                                }
//                                ,
//                                success: function (data) {
//                                    alert('SUCCESS MVA');
//                                }
//                            }).done(function (data) {
//                                console.log();
//                                if (data) {
//                                    if (data[0].rs) {
//                                        var mva = data[0].rs;
//                                        console.log('MVA: ' + mva);
//                                        $('#mva').val(mva);
//                                    } else {
//                                        console.log('MVA: NAO FOI RETORNADO');
//                                    }
//                                } else {
//                                    console.log('MVA: CONSULTA FALHOU');
//                                }
//
//                            });
                        }
                    }
                }
            });
        }
    }

    //Função para carregar os dados da consulta no campo MVA
    function carregarMVA(ncm) { //Nome duplicado!!! Tremendo erro!!
//        var busca = $('#ncm').val();

        console.log('NCM em carregarMVA(): ' + ncm);

        if (ncm) {
            $.ajax({
                url: "consulta.php",
                dataType: "json",
                data: {
                    acao: 'consulta',
                    parametro: ncm
                }
                ,
                success: function (data) {
                    alert('SUCCESS MVA');
                }
            }).done(function (data) {
                if (data) {
                    if (data[0].rs) {
                        console.log('MVA: ' + data[0].rs);
                        $('#mva').val(data[0].rs);
                    } else {
                        console.log('MVA: NAO FOI RETORNADO');
                    }
                } else {
                    console.log('MVA: CONSULTA FALHOU');
                }

            });
        }
    }


    // Função para limpar os campos caso a busca esteja vazia

    function limpaCampos() {
        var busca = $('#busca').val();
        if (busca == "") {
//            $('#codigoItem').value('');//erro
            $('#codigoItem').val('');
            $('#busca').val('');
            $('#descricao').val('');
            $('#aliqIPI').val('');

        }
    }
});