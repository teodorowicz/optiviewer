var daneSrodka;
var geoloc;

function getGeoLoc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
        //console.log("Latitude: " + position.coords.latitude +" Longitude: " + position.coords.longitude); 
        geoloc="Latit" + position.coords.latitude +"Longi" + position.coords.longitude;
    })
    }else {
        geoloc=null;
    }
}

function getApiUrl () {

    $('#inputURL').attr('value',localStorage.getItem("optiviewer-optiest-mwapi"));
    $('#inputSK').attr('value',localStorage.getItem ("optiviewer-optiest-sk"));

    if (    localStorage.getItem  ("optiviewer-optiest-mwapi")===null
            ||localStorage.getItem("optiviewer-optiest-sk")===null){
        window.location.href='#popupGetURL';
    }
    else {}
    
    return {    
        ApiUrl: localStorage.getItem("optiviewer-optiest-mwapi"),
        ApiSK:  localStorage.getItem("optiviewer-optiest-sk")
    }
}

function setApiUrl() {
    localStorage.setItem("optiviewer-optiest-mwapi",document.getElementById('inputURL').value);
    localStorage.setItem("optiviewer-optiest-sk",document.getElementById('inputSK').value);
    window.history.back();
    return true;
}

$(function() {
            //console.log('started...');
//Inicjalizacja

$.mobile.document.on( "click", "#open-popupArrow", function( evt ) {
    $( "#popupArrow" ).popup( "open", { x: evt.pageX, y: evt.pageY } );
    evt.preventDefault();
});

getApiUrl ();       

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

                urlApi=getApiUrl().ApiUrl;
                getGeoLoc();
                if (typeof device==='undefined') {device={uuid:null,model:null,version:null}}
                if(kodEan.length == 10)
                { 
                    $.ajax({
                      type: "GET",
                      url: getApiUrl().ApiUrl,
                      data: ({  srd_ean: kodEan,
                                dev_uuid: device.uuid,
                                dev_modl: device.model,
                                dev_vers: device.version,
                                geo: geoloc,
                                sk: getApiUrl().ApiSK
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

                daneSrodka=data; //drop after debug

                //let elem = document.createElement('div');
                $('<div>')
                    .attr('id','ean'+data.srd_ean)
                    .attr('data-role','controlgroup')
                    .attr('data-type','horizontal')
                    .append(
                        $("<a>")
                            .attr('href','#page'+data.srd_ean)
                            .html(data.srd_ean+' - '+data.srd_nazwa)
                            .addClass('ui-shadow ui-btn ui-corner-all ui-btn-inline ui-btn-icon-left ui-icon-eye odczyty') 
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
                
                  wartosciContent=
                        $('<div>')
                            .addClass('rTableRow')
                            .append($('<div>').addClass('rTableHead').html('Wartość brutto'))
                            .append($('<div>').addClass('rTableCell').html(data.SRD_WARTOSC_AKT_SG))
                    
                if(data.zrodla_fin!==null){data.zrodla_fin.forEach(function(item){
                    wartosciContent
                        .append($('<div>').addClass('rTableRow')
                            .append($('<div>').addClass('rTableHead').html(item.nazwa_zf)) 
                            .append($('<div>').addClass('rTableCell').html(item.wartosc_zf))     
                        )
                })}
                dokumentyContent=
                    $('<div>')
                            .attr('data-role','collapsible')
                            .attr('data-collapsed-icon',"carat-d")
                            .attr('data-expanded-icon',"carat-u")
                            .html('<h4>Dokumenty '+((data.dokumenty===null)?0:data.dokumenty.length)+' szt.</h4>')
                if(data.dokumenty!==null){data.dokumenty.forEach(function(item){
                    dokumentyContent
                        .append(
                            $('<div>')
                            .attr('data-role','collapsible')
                            .attr('data-collapsed-icon',"carat-d")
                            .attr('data-expanded-icon',"carat-u")
                            .html('<h5>'+item.typ_dok+' '+item.nr_dok+'</h5>')
                            .append(
                                $('<div>')
                                .addClass('rTable')
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Typ dokumentu'))
                                    .append($('<div>').addClass('rTableCell').html(item.typ_dok))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Numer dokumentu'))
                                    .append($('<div>').addClass('rTableCell').html(item.nr_dok))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Status dokumentu'))
                                    .append($('<div>').addClass('rTableCell').html(item.status_dok))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Data operacji'))
                                    .append($('<div>').addClass('rTableCell').html(item.data_operacji))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Zlecił'))
                                    .append($('<div>').addClass('rTableCell').html(item.pracownik_zlec))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Data zatwierdzenia'))
                                    .append($('<div>').addClass('rTableCell').html(item.DOK_DATA_ZATW))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Zatwierdził'))
                                    .append($('<div>').addClass('rTableCell').html(item.DOK_PRAC_ZATW))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Data utworzenia'))
                                    .append($('<div>').addClass('rTableCell').html(item.DATA_UTWORZENIA))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Użytkownik utw.'))
                                    .append($('<div>').addClass('rTableCell').html(item.UZYTKOWNIK_UTW))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Uwagi'))
                                    .append($('<div>').addClass('rTableCell').html(item.DOK_UWAGI))
                                )
                            )
                        )
                })}
                odczytyContent=
                    $('<div>')
                            .attr('data-role','collapsible')
                            .attr('data-collapsed-icon',"carat-d")
                            .attr('data-expanded-icon',"carat-u")
                            .html('<h4>Odczyty '+((data.inwentaryzacje===null)?0:data.inwentaryzacje.length)+' szt.</h4>')
                if(data.inwentaryzacje!==null){data.inwentaryzacje.forEach(function(item){
                    odczytyContent
                        .append(
                            $('<div>')
                            .attr('data-role','collapsible')
                            .attr('data-collapsed-icon',"carat-d")
                            .attr('data-expanded-icon',"carat-u")
                            .html('<h5> Data '+item.ISC_DATE+'</h5>')
                            .append(
                                $('<div>')
                                .addClass('rTable')
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Inwentaryzacja'))
                                    .append($('<div>').addClass('rTableCell').html(item.INW_NAZWA))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Data utworzenia'))
                                    .append($('<div>').addClass('rTableCell').html(item.DATA_UTWORZENIA))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Data zakończenia'))
                                    .append($('<div>').addClass('rTableCell').html(item.INW_DATA_ZAKONCZENIA))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Status inwentaryzacji'))
                                    .append($('<div>').addClass('rTableCell').html(item.status_inw))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Data odczytu'))
                                    .append($('<div>').addClass('rTableCell').html(item.ISC_DATE))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Użytkownik'))
                                    .append($('<div>').addClass('rTableCell').html(item.UZYTKOWNIK_UTW))
                                )
                                .append($('<div>').addClass('rTableRow')
                                    .append($('<div>').addClass('rTableHead').html('Lokalizacja'))
                                    .append($('<div>').addClass('rTableCell').html(item.isc_lok_kod+' '+item.isc_lok_nazwa))
                                )
                            )
                        )
                })}
                
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
                            .html('<h4>Dane podstawowe '+data.nr_inw+'</h4>')
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
                                    .append($('<div>').addClass('rTableCell').html(data.nr_inw_obcy))
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
                                        .html(data.nazwa_dostawcy)
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
                        .append(
                            $('<div>')
                            .attr('data-role','collapsible')
                            .attr('data-collapsed-icon',"carat-d")
                            .attr('data-expanded-icon',"carat-u")
                            .html('<h4>Wartości '+((data.SRD_WARTOSC_AKT_SG===null)?0:data.SRD_WARTOSC_AKT_SG)+'</h4>')
                            .append(
                                $('<div>')
                                .addClass('rTable')
                                    .append(wartosciContent)
                            )
                        )
                        .append(dokumentyContent)
                        .append(odczytyContent)
                    //.html('Kod kreskowy:'+ data.srd_ean)
                    )
                    .appendTo('body');
            }
 
        });








