(function() {
    'use strict';
    $(document).ready(function() {
        $('.sel').niceSelect();
        $('#sm_slider').smSlider();
        $(".accordion").accordion({
            firstChildExpand: true,
            multiExpand: false,
            slideSpeed: 500,
            dropDownIcon: "&#xf107"
        });
        $('.paginat').pagination({
            items: 93,
            cssStyle: 'light-theme',
            edges: 2,
            displayedPages: 3
        });
        $(".scroll").mCustomScrollbar({
            theme: 'rounded-dark'
        });
        $('.sp-wrap').smoothproducts();

        $('.goodsBlock').click(function(){
            //console.log($(this).attr('data-id'));
            $.ajax({
                type: "GET",
                url: "api/product/" + $(this).attr('data-id'),
                success: function (resp) {
                    console.log($("p").children(".priceCard"));
                    $('#goodNameCard').html(resp.data.name);
                    $(".priceCard").children("span").html(resp.data.price + ' грн');
                    $('.bs-example-modal-lg').modal('show');
                },
                error: function () {
                    console.log('error');
                }
            })
        })
        $('#toLogin').click(function(){
            $('.register-modal').modal('hide');
            $('.login-modal').modal('show');
        });
        $('#toRegis').click(function(){
            $('.login-modal').modal('hide');
            $('.register-modal').modal('show');
        });
        $(window).scroll(function () {
            var scrollh = $(this).scrollTop();
            if (scrollh > 60) {
                $(".navv").addClass('compact');
            } else {
                $(".navv").removeClass('compact');
            }
        });
    });
    var slider = $('#slider'),
        tooltip = $('.tooltip');

    tooltip.hide();

    slider.slider({
        range: "min",
        min: 1,
        value: 35,

        start: function(event,ui) {
            tooltip.fadeIn('fast');
        },

        slide: function(event, ui) {

            var value = slider.slider('value'),
                volume = $('.volume');

            tooltip.css('left', value).text(ui.value);

            //if(value <= 5) {
            //    $('.volume').removeClass('bi_volume-low-a').removeClass('bi_volume-high-a').removeClass('bi_volume-medium-a').addClass('bi_volume-mute-a');
            //}
            //else if (value <= 35 && value > 6) {
            //    $('.volume').removeClass('bi_volume-mute-a').removeClass('bi_volume-high-a').removeClass('bi_volume-medium-a').addClass('bi_volume-low-a');
            //}
            //else if (value <= 75 && value > 36) {
            //    $('.volume').removeClass('bi_volume-mute-a').removeClass('bi_volume-high-a').removeClass('bi_volume-low-a').addClass('bi_volume-medium-a');
            //}
            //else{
            //    $('.volume').removeClass('bi_volume-mute-a').removeClass('bi_volume-medium-a').removeClass('bi_volume-low-a').addClass('bi_volume-high-a');
            //};
            if(value <= 5) {
                $('.volume').removeClass('s-7').addClass('s-6');
            }else{
                $('.volume').removeClass('s-6').addClass('s-7');
            };
        },

        stop: function(event,ui) {
            tooltip.fadeOut('fast');
        },
    });

})();