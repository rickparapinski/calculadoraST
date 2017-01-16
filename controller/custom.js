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

            buscarMVA(ncm);
            return false;
        }
    })
            .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
                .append(item.codigo_item + " — " + item.descricao_item)
                .appendTo(ul);
    };
});

var buscarMVA = function (ncm) {
    $('#mva').val("BUSCANDO MVA...");
    $.ajax({
        url: "/model/consulta.php",
        dataType: "json",
        data: {
            acao: 'consultaPorNCM',
            parametro: ncm
        },
        success: function (data) {
            $('#mva').val("MVA ENCONTRADO!");
            if (data[0]) {
                var mva = data[0].rs;
                var mvaPercentual = (mva * 100).toFixed(2) + '%';
                $('#mva').val(mvaPercentual);
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
