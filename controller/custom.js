$(function () {
    $('#busca').on('input', limpaCampos);
    $("#busca").autocomplete({
        minLength: 2,
        source: function (request, response) {
            $.ajax({
                url: "/model/consulta.php",
                dataType: "json",
                data: {
                    acao: 'autocomplete',
                    parametro: $('#busca').val()
                }
            }).done(function (data) {
                response(data);
            });
        },
        focus: function (event, ui) {
            $("#busca").val(ui.item.codigo_item);
            return false;
        },
        select: function (event, ui) {
            $("#codigoItem").val(ui.item.codigo_item);
            $("#descricao").val(ui.item.descricao_item);
            var aliqIPI = ui.item.aliq_ipi;
            var aliqIPIPercentual = aliqIPI * 100 + '%';
            $("#aliqIPI").val(aliqIPIPercentual);

            var ncm = ui.item.ncm;
            $("#ncm").val(ncm);

            buscarMVA(ncm, $('#estados').val()); //Deixar Parana por padrao
            return false;
        }
    })
            .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
                .append(item.codigo_item + " — " + item.descricao_item)
                .appendTo(ul);
    };
});

var buscarMVA = function (ncm, estado) {
    $('#mva').val("BUSCANDO MVA...");
    $.ajax({
        url: "/model/consulta.php",
        dataType: "json",
        data: {
            acao: 'consultaPorNCM',
            ncm: ncm + '',
            estado: estado
        },
        success: function (data) {
            console.log("RETORNO CONSULTA POR NCM: " + data);
            if (data[0]) {
                var mva = data[0].valor;
                var mvaPercentual = (mva * 100).toFixed(2) + '%';
                $('#mva').val(mvaPercentual);

                icmsEstadual = data[0].aliq_interna;
            } else {
                $('#mva').val("VAZIO! NCM: " + ncm + " ESTADO: " + estado);
            }
        },
        error: function (data) {
            $('#mva').val("FUDEU!");
        }
    });
};

var limpaCampos = function () {
    var busca = $('#busca').val();
    if (busca == "") {
        $('#codigoItem').val('');
        $('#busca').val('');
        $('#descricao').val('');
        $('#aliqIPI').val('');
    }
};

$(document).ready(function () {

    $("input[type=radio][name=perfilCliente]").click(function () {
        var consuFinal = $("input[type=radio][name=perfilCliente]:checked").val();
        if (consuFinal == "consFinal") {
            alert("ATENÇÃO: Não se aplica recolhimento de ICMS ST para consumidor final ");
            $("#segundaParte").css("display", "none");
        } else if (consuFinal == "revenda") {
            $("#segundaParte").css("display", "block");
        }
    });
});

var icmsEstadual = 0.0;
$("#calcular").click(function () {
    if ($("#vm").val() != '') {
        console.log("icmsEstadual: " + icmsEstadual);
        //var icmsEstadual = 0.57; //icms estadual que ta no sql tabela estado
        var mva = parseFloat(($('#mva').val()).replace('%', '')) / 100;
        var valorMercadoria = parseFloat($("#vm").val());
        var aliqIPI = parseFloat(($('#aliqIPI').val()).replace('%', '')) / 100;
        console.log('aliqIPI: ' + aliqIPI);

        var valorProduto = (valorMercadoria * aliqIPI) + valorMercadoria;
        var bcST = (valorProduto * mva) + valorProduto;
        var icmsP = valorMercadoria * icmsEstadual;
        var icmsSt = bcST * icmsEstadual;
        var stAPagar = icmsSt - icmsP;
        var total = valorProduto + stAPagar;

        $('#valST').val(stAPagar.toFixed(2));
        $('#valTotal').val(total.toFixed(2));
    } else {
        alert("Informe o Valor do Produto!");
    }

});

$('#estados').change(function () {
    buscarMVA($("#ncm").val(), $(this).val());
});

