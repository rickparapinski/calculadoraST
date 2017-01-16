/* 
 * João Trindade ® Copyright © 2017.
 * All rights reserved.
 * http://www.htrindade.com.br
 * joao@htrindade.com.br
 */

$(document).ready(function () {
    var scriptMva = '';
    
    var i = 0;
    for (i = 0; i < 10; i++) {
        scriptMva += '<br>' + i;
    }
    $("#scriptMva").html(scriptMva) ;
});
