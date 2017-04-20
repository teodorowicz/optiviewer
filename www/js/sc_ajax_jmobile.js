var daneSrodka;


/*
$('#skanuj').click(
    function(){
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
            },
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
            preferFrontCamera : true, // iOS and Android 
            showFlipCameraButton : true, // iOS and Android 
            showTorchButton : true, // iOS and Android 
            torchOn: true, // Android, launch with the torch switched on (if available) 
            prompt : "Place a barcode inside the scan area", // Android 
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500 
            formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED 
            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device 
            disableAnimations : true, // iOS 
            disableSuccessBeep: false // iOS 
            }
        );
    }
);
*/

function getApiUrl () {
    if (localStorage.getItem("optiest-mwapi")===null){

/*
$('div')       
    .attr('id','popupGetURL')
    .attr('data-role','popup')
    .attr('data-theme','a')
    .addClass('ui-corner-all')
    .append(
        $('form')
        .append(
            $('div')
            .css('padding','10px 20px')
            .append(
                $('h3')
                    .html('Podaj adres API:')
            )
            .append(
               $('label')
                .attr('for','inputurlapi')
                .addClass('ui-hidden-accessible')
                .html('URL:') 
            )
            .append(
                $('input')
                    .attr('type','text')
                    .attr('id','inputurlapi')
                    .attr('data-theme','a')
                    .attr('value','http://')
            )
            .append(
                $('button')
                    .attr('type','submit')
                    .addClass('ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check')
                    .html('zapisz')
            )
        )
    )
    .appendTo($('#result'));
    */
    //document.location.href='#popupGetURL';

}
else 
$('#inputURL').attr('value',localStorage.getItem("optiest-mwapi"))
return localStorage.getItem("optiest-mwapi");
}

function setApiUrl() {
    
    localStorage.setItem("optiest-mwapi",document.getElementById('inputURL').value);
    return true;
}

        $(function() {
            //console.log('started...');


            //$('#formGetURL').submit(function(){return false} );

            urlApi=getApiUrl();



$('#skanuj').click(
    function() {
        alert('klikniete: '+typeof cordova);

if (typeof cordova!=='undefined') {
        cordova.plugins.barcodeScanner.scan(
        function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
        )
}



    }
    
   )



            $("#callAjax").click(function() {
                var kodEan = $.trim($("#Kod").val());

                alert('klikniete');
                //console.log(kodEan);
                if(kodEan.length == 10)
                {
                    $.ajax({
                      type: "GET",
                      url: urlApi,
                      data: ({srd_ean: kodEan}),
                      cache: false,
                      dataType: "json",
                      success: onSuccess
                    })
                }
            });
 
            $("#result").ajaxError(function(event, request, settings, exception) {
              $("#result").html("Error Calling: " + settings.url + "<br />HTTP Code: " + request.status);
            });
 
            function onSuccess(data)
            {   
                if (typeof(data)==='undefined'||data===null||!data.hasOwnProperty('srd_ean')) return false;
                
                daneSrodka=data;
                
                //let elem = document.createElement('div');
                $('<div>')
                    .attr('id','ean'+data.srd_ean)
                    .attr('data-role','controlgroup')
                    .attr('data-type','horizontal')
                    .append(
                        $("<a>")
                            .attr('href','#page'+data.srd_ean)
                            .html(data.srd_ean+' - '+data.srd_nazwa)
                            .addClass('ui-shadow ui-btn ui-corner-all ui-btn-inline ui-btn-icon-left ui-icon-eye') 
                        )
                    .append(
                        $("<a>")
                            .attr('href','#')
                            .html("The die is cast.")
                            .addClass('"ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-delete ui-btn-icon-notext ui-btn-b')
                            .click( function () {
                                    $(this).parent().remove()
                                    $('#page'+data.srd_ean).remove()
                                }
                            )
                        )
                    .appendTo($("#result"));

                $('<div>')
                    .attr('id','page'+data.srd_ean)
                    .attr('data-role','page')
                    .append(
                        $('<div>')
                        .attr('data-role','header')
                        .html('<h2>'+data.srd_ean+ ' - '+data.srd_nazwa+'</h2>')
                    )
                    .append(
                        $('<div>')
                        .attr('data-role','content')
                        .append(
                            $('<div>')
                            .attr('data-role','collapsible')
                            .attr('data-collapsed-icon',"carat-d")
                            .attr('data-expanded-icon',"carat-u")
                            .html('<h4>Dane podstawowe</h4>')
                            .append(
                                $('<div>')
                                .addClass('rTable')
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Typ obiektu')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.typ_obiektu)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Numer inwentarzowy')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.nr_inw)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Nr obcy')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.nr_inw_obcy)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Nazwa')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell srd_nazwaClass')
                                        .html(data.srd_nazwa)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Status')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.status)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Kod KŚT')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.kod_kst)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Nazwa KŚT')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.nazwa_kst)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Numer Fabryczny')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.SRD_NR_FABRYCZNY)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Data zakupu')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.SRD_DATA_ZAKUPU)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Dostawca')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.nazwa_dostwacy)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('NIP Dostawcy')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.nip_dostawcy)
                                    )
                                )
                            )
                        )
                    )
                    //.html('Kod kreskowy:'+ data.srd_ean)
                    .appendTo('body');
                    //href="javascript:history.back()"
            }
 
        });








