(function() {
    'use strict';

        var categtable = $( '#categtable' ).dataTable({
        'sDom': 'rt<"table-footer"<"pull-left"i>p>',
        'oLanguage': {
            'sInfoFiltered': '<span class="label label-info"><i class="fa fa-filter"></i> filtering from _MAX_ records</span>',
        },
        'ajax': "/api/categories",
        "columns": [
            { "data": "name"},
            { "data":"link"}
        ],
        'fnInitComplete': function(settings) {
            var aoData = settings.aoData;

            // adding uniquen id to TR to crud
            $.each( aoData, function(i, val){
                console.log(val)
                var $ntr = $( val.nTr );
                $ntr.attr( 'data-id', val._aData.uuid );

                //$ntr.find( 'td' ).wrap('<a class="a-detalUser" href="user/' + val._aData.uuid + '"></a>');
            });

            var $nTable = $(settings.nTable);
            $nTable.closest( '.dataTables_wrapper' ).find( '.dataTable' ).wrap('<div class="table-responsive"></div>');
        },
        'drawCallback': function( settings ) {
            var $nTable = $(settings.nTable);
            $nTable.closest( '.dataTables_wrapper' ).find( '.dataTables_paginate' ).children( '.pagination' )
                .addClass( 'pagination-circle' );
        }
    });
        $(document).ready(function() {
            $('.tree').treegrid();
        })


        // add rule
        .on( 'click', '#add-mainCateg, #hideAddmainCateg', function(e){
            e.preventDefault();
            $( '#addMainCategFormContainer' ).toggleClass( 'hide' );
            $( '#formAddMainCateg' )[0].reset();
        })
        .on( 'submit', '#formAddMainCateg', function(e){
                e.preventDefault();

                var $this = $( this ),
                    datas = $this.serializeArray(); // or use $this.serialize()

                // do server action to save change here ( ajax )
                // ...
                $.ajax({
                    type: "POST",
                    url: "/categ",
                    data: {
                        "email": datas[0].value
                    },
                    error: function error(err) {
                        //TODO: error handle
                        console.log('err', err)
                    },
                    success: function success(data) {
                        console.log('success', data);

                        //var addData = datatables1.fnAddDataAndDisplay({
                        //        "email": datas[0].value
                        //    }),
                        //    newRow = addData.nTr,
                        //    newID = data; // just sample id (on real case: get it from server callback)

                        // adding data-id to new row
                        // then make it selected and enable to delete or edit
                        //    datatables1.$( 'tr.active' ).removeClass( 'active' );
                        //    $( newRow ).attr( 'data-id', newID )
                        //        .addClass( 'active' );
                        //    $( newRow).click(function(){
                        //        console.log(newID)
                        //    })
                         //$(newRow).find('td').wrap('<a class="a-detalUser" href="user/' + newID + '"></a>');
                         // activate actions edit & delete
                            //$( '.datatables1-actions' ).removeClass( 'disabled' );
                        // reset form
                        $( '#formAddMainCateg' )[0].reset();

                        // just simple rule after ajax is done (demo)
                        $.each( datas, function( i, data ){
                            console.log( data.name + ' = ' + data.value );
                        });
                    }
                });

                // add new row to datatables using datatables plugin fnAddDataAndDisplay([ 1,2,3,... ]) ( see scripts/demo/datatables-plugins.js )
                // or you can just use fnAddData([ 1,2,3,... ]) - without any datatables plugin

            })

})();
