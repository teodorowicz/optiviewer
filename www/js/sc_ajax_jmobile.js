var daneSrodka;

var geoloc;

function getGeoLoc() {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(function (position) {
    console.log("Latitude: " + position.coords.latitude +" Longitude: " + position.coords.longitude); 
    geoloc="Latit:" + position.coords.latitude +"Longi:" + position.coords.longitude;
})
}else {
    geoloc=null;
}
}

function getApiUrl () {
    if (localStorage.getItem("optiest-mwapi")===null){
         //$('#pobierz').attr("disabled", true);
}
else 
$('#inputURL').attr('value',localStorage.getItem("optiest-mwapi"))
return localStorage.getItem("optiest-mwapi");
}

function setApiUrl() {
    localStorage.setItem("optiest-mwapi",document.getElementById('inputURL').value);
    window.history.back();
    return true;
}

        $(function() {
            //console.log('started...');
            
            urlApi=getApiUrl();

$('#skanuj').click(
    function() {
        if (typeof cordova!=='undefined') {
                window.cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (result.cancelled===false&&result.text!==''){
                            $("#Kod")
                                .val(result.text)
                                .trigger('click');
                            window.navigator.vibrate(100);
                        }
                    }, 
                    function (error) {
                        alert("Scanning failed: " + error);
                        return false;
                    },
                    {
                        preferFrontCamera : false, // iOS and Android 
                        showFlipCameraButton : false, // iOS and Android 
                        showTorchButton : true, // iOS and Android 
                        torchOn: true, // Android, launch with the torch switched on (if available) 
                        prompt : "Umieść kod znajdujący się na etykiecie w okienku", 
                        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500 
                        formats : "DATA_MATRIX,CODE_128", //"QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED 
                        orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device 
                        disableAnimations : true, // iOS 
                        disableSuccessBeep: false // iOS 
                    }
                )
        }
    }
);

            $("#pobierz").click(function() {
                var kodEan = $.trim($("#Kod").val());

                //alert('klikniete');
                //console.log(kodEan);
                getGeoLoc();
                if (typeof device==='undefined') {device={uuid:null,model:null,version:null}}
                if(kodEan.length == 10)
                { 
                    $.ajax({
                      type: "GET",
                      url: urlApi,
                      data: ({  srd_ean: kodEan,
                                dev_uuid: device.uuid,
                                dev_modl: device.model,
                                dev_vers: device.version,
                                geo: geoloc 
                            }),
                      cache: false,
                      dataType: "json",
                      beforeSend : function() {$.mobile.loading('show');},
                      complete   : function() {$.mobile.loading('hide');},
                      success: onSuccess
                    }).done(function() {
                        //alert('ajax done');
                    })
                }
            });
 
            $("#result").ajaxError(function(event, request, settings, exception) {
              $("#result").html("Error Calling: " + settings.url + "<br />HTTP Code: " + request.status);
            });
 
             function onSuccess(data)
            {   
                if (typeof(data)==='undefined'||data===null||!data.hasOwnProperty('srd_ean')) return false;
                
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
                        $('<div>')// dodaj ikonę
                        .attr('data-role','header')
                        .html('<h2>'+data.srd_ean+ ' - '+data.srd_nazwa+'</h2>')
                        .addClass('ui-btn-icon-right ui-icon-back')
                        .click(function(){window.history.back() })
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
                                    .append($('<div>').addClass('rTableCell').html(data.nr_inw))
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Nr obcy')
                                    )
                                    .append($('<div>').addClass('rTableCell').html(data.nr_inw))
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
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Nr faktury')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.SRD_NR_DOKUMENTU)
                                    )
                                )
                            )
                        )
                    )
                    .append(
                        $('<div>')
                        .attr('data-role','content')
                        .append(
                            $('<div>')
                            .attr('data-role','collapsible')
                            .attr('data-collapsed-icon',"carat-d")
                            .attr('data-expanded-icon',"carat-u")
                            .html('<h4>Miejsce użytkowania</h4>')
                            .append(
                                $('<div>')
                                .addClass('rTable')
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Kod lokalizacji')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.kod_lok)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Nazwa lokalizacji')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.nazwa_lok)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Kod jednostki')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.kod_jor)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Nazwa jednostki')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell srd_nazwaClass')
                                        .html(data.nazwa_jor)
                                    )
                                )
                                .append(
                                    $('<div>')
                                    .addClass('rTableRow')
                                    .append(
                                        $('<div>')
                                        .addClass('rTableHead')
                                        .html('Osoba odpowiedzialna')
                                    )
                                    .append(
                                        $('<div>')
                                        .addClass('rTableCell')
                                        .html(data.osod)
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








