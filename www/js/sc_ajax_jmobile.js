var daneSrodka;

        $(function() {
            //console.log('start...');
            $("#callAjax").click(function() {
                var kodEan = $.trim($("#Kod").val());
                //console.log(kodEan);
                
                if(kodEan.length == 10)
                {
                    $.ajax({
                      type: "GET",
                      url: "http://intranet2.su.krakow.pl/~mwilga/opti.php",
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
                                $('<table>')
                                .addClass('')
                                .append(
                                    $('<tr>')
                                    .append(
                                        $('<td>')
                                        .html('Typ obiektu')
                                    )
                                    .append(
                                        $('<td>')
                                        .html(data.typ_obiektu)
                                    )
                                )
                                .append(
                                     $('<tr>')
                                    .append(
                                        $('<td>')
                                        .html('Numer inwentarzowy')
                                    )
                                    .append(
                                        $('<td>')
                                        .html(data.nr_inw)
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








