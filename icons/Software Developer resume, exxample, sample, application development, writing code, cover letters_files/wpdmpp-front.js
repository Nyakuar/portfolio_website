jQuery(function ($) {

    try {
        $('.ttip').tooltip();
    } catch (e){

    }

    $('body').on('click', '.wpdm__rld', function () {
        var pit = $(this).parent('li');
        $(this).html(wpdm_asset.spinner);
        $.post(wpdm_url.ajax, {action: 'wpdmpp_remove_domain', domain: $(this).data('domain'), license: $(this).data('license')}, function (res) {
            pit.hide();
        });
    });

    $('body').on('click', '.file-price', function () {
        var pid = $(this).data('pid'), ps = 0, files = [], uc = 0, al = '';
        var haslic = parseInt($('.license-'+pid).length);
        if(haslic > 0)
            al = $('.license-'+pid+':checked').val();

        $('.file-price-'+pid).each(function () {

            if($(this).is(':checked')){
                ps += al == ''?parseFloat($(this).val()):parseFloat($(this).data(al));
                files.push($(this).data('file'));
            }
            else uc++;
        });
        ps = ps.toFixed(2);
        var ppc = al == ''?parseFloat($('#price-'+pid).attr('content')):parseFloat($('.license-'+pid+ '[value='+al+']').data('price'));
        if(ps == 0 || uc == 0 || ps > parseFloat(ppc)) ps = ppc.toFixed(2);
        ps += wpdmpp_extra_gigs();
        /*$('.price-'+pid).html(wpdmpp_currency_sign+ps);*/
        $('.price-'+pid).html(wpdmpp_csign_before+ps+wpdmpp_csign_after);
        $('#files_'+pid).val(files);
        $('#total-price-' + pid).val(ps.toFixed(2));

        if(('.__wpdmpp_buy_now_zone_'+pid).length > 0) {
            WPDM.blockUI('.__wpdmpp_buy_now_zone_' + pid);
            $('.__wpdmpp_buy_now_zone_' + pid).load(wpdm_url.ajax, {
                pid: pid,
                action: 'wpdmpp_load_buynow_button'
            }, function (res) {
                WPDM.unblockUI('.__wpdmpp_buy_now_zone_' + pid);
            });
        }

    });


    $('body').on('click', '.wpdmpp-extra-gig', function () {
        var pid = $(this).data('product-id'), ps = 0, files = [], uc = 0, al = '';
        var haslic = parseInt($('.license-'+pid).length);
        if(haslic > 0)
            al = $('.license-'+pid+':checked').val();

        $('.file-price-'+pid).each(function () {

            if($(this).is(':checked')){
                ps += al == ''?parseFloat($(this).val()):parseFloat($(this).data(al));
                files.push($(this).data('file'));
            }
            else uc++;
        });

        ps = ps.toFixed(2);
        var ppc = al == ''?parseFloat($('#price-'+pid).attr('content')):parseFloat($('.license-'+pid+ '[value='+al+']').data('price'));
        if(ps == 0 || uc == 0 || ps > parseFloat(ppc)) ps = ppc.toFixed(2);
        ps = parseFloat(wpdmpp_extra_gigs())+parseFloat(ps);
        ps = ps.toFixed(2);

        /*$('.price-'+pid).html(wpdmpp_currency_sign+ps); */

        /* If 'Pay as you want' is active */
        if (isNaN(ps)){
            ps = parseFloat(wpdmpp_extra_gigs()) + parseFloat( $('.iwanttopay').val() );
        }

        $('.price-'+pid).html(wpdmpp_csign_before+ps+wpdmpp_csign_after);
        $('#files_'+pid).val(files);

        $('#total-price-' + pid).val(ps.toFixed(2));

        if(('.__wpdmpp_buy_now_zone_'+pid).length > 0) {
            WPDM.blockUI('.__wpdmpp_buy_now_zone_' + pid);
            $('.__wpdmpp_buy_now_zone_' + pid).load(wpdm_url.ajax, {
                pid: pid,
                action: 'wpdmpp_load_buynow_button'
            }, function (res) {
                WPDM.unblockUI('.__wpdmpp_buy_now_zone_' + pid);
            });
        }

    });


    $('body').on('click', '.price-variation', function () {

        var pid = $(this).data('product-id'), price = 0, license = $(this).val(), sfp =0;
        /*
         $('.price-variation-' + pid).each(function () {
         if ($(this).is(':checked'))
         price += parseFloat($(this).data('price'));
         });
         */
        price = parseFloat($(this).data('price'));

        $('#premium-files-' + pid+' .premium-file').each(function () {
            $(this).find('.badge').html($(this).find('.badge').data(license));

        });

        $('.file-price-' + pid).each(function () {
            if ($(this).is(':checked')) sfp += parseFloat($(this).data(license));
        });

        /*var pricehtml = "<i class='fa fa-shopping-cart'></i> Add to Cart <span class='label label-primary'>" + $('#total-price-' + pid).data('curr') + price + "<label>";*/
        if(sfp > 0 && sfp < price)
            price = sfp;
        price += wpdmpp_extra_gigs();
        /*$('.price-'+pid).html(wpdmpp_currency_sign+price.toFixed(2));*/
        $('.price-'+pid).html(wpdmpp_csign_before+price.toFixed(2)+wpdmpp_csign_after);
        $('#total-price-' + pid).val(price.toFixed(2));
        /*$('#cart_submit').html(pricehtml);*/

        if(('.__wpdmpp_buy_now_zone_'+pid).length > 0) {
            WPDM.blockUI('.__wpdmpp_buy_now_zone_' + pid);
            $('.__wpdmpp_buy_now_zone_' + pid).load(wpdm_url.ajax, {
                pid: pid,
                action: 'wpdmpp_load_buynow_button'
            }, function (res) {
                WPDM.unblockUI('.__wpdmpp_buy_now_zone_' + pid);
            });
        }

    });


    $('body').on('click', '#licreq', function () {
        if($(this).is(":checked")) {
            $('.file-price-field').hide();
            $('.file-price-table').show();
            $('#licopt').slideDown();
        }
        else {
            $('.file-price-field').show();
            $('.file-price-table').hide();
            $('#licopt').slideUp();
        }

    });
    $('.lic-enable').each(function () {
        if($(this).is(":checked") && !$(this).is(":disabled")) {
            $("#lic-price-" + $(this).data('lic')).removeAttr('disabled');
            $(".lic-file-price-" + $(this).data('lic')).removeAttr('disabled');

        }
        else {
            $("#lic-price-" + $(this).data('lic')).attr('disabled', 'disabled');
            if(!$(this).is(":checked"))
                $(".lic-file-price-" + $(this).data('lic')).attr('disabled', 'disabled');
        }
    });
    $('body').on('click', '.lic-enable', function () {
        if($(this).is(":checked") && !$(this).is(":disabled")) {
            $("#lic-price-" + $(this).data('lic')).removeAttr('disabled');
            $(".lic-file-price-" + $(this).data('lic')).removeAttr('disabled');
        }
        else {
            $("#lic-price-" + $(this).data('lic')).attr('disabled', 'disabled');
            if(!$(this).is(":checked"))
                $(".lic-file-price-" + $(this).data('lic')).attr('disabled', 'disabled');
        }
    });


    $('body').on('submit', '.wpdm_cart_form', function () {
        var btnaddtocart = $(this).find('.btn-addtocart');
        btnaddtocart.css('width', btnaddtocart.css('width'));
        btnaddtocart.attr('disabled', 'disabled');
        var form = $(this);
        var btnlbl = btnaddtocart.html();
        btnaddtocart.html(wpdm_asset.spinner);
        $(this).ajaxSubmit({
            success: function (res) {
                if (btnaddtocart.data('cart-redirect') == 'on') {
                    location.href = res;
                    return false;
                }
                form.find('.btn-viewcart').hide();
                btnaddtocart.addClass('btn-wc');
                /* btnaddtocart.html('<i class="fas fa-check-square"></i>').after('<div class="btn-group cobtn-group-" style="min-width:'+btnaddtocart.css('width')+'"><a title="Remove From Cart" style="width: 55px" class="btn btn-secondary" href="#Remove From Cart"><i class="fas fa-trash"></i></a><a style="width: calc(100% - 55px)" href="' + res + '" class="' + btnaddtocart.attr('class').replace('btn-addtocart', 'btn-checkout') + ' btn-viewcart" type="button">Checkout <i class="fas fa-check-double"></i></a></div>'); */
                btnaddtocart.html('<i class="fas fa-check-square"></i>').after('<a style="min-width:'+btnaddtocart.css('width')+'" href="' + res + '" class="' + btnaddtocart.attr('class').replace('btn-addtocart', 'btn-checkout') + ' btn-viewcart" type="button">Checkout <i class="fas fa-check-double"></i></a>');
                btnaddtocart.removeAttr('disabled').hide();
                $('.ttip').tooltip({html: true});
                window.postMessage("cart_updated", window.location.protocol + "//" + window.location.hostname);
            }
        });
        return false;
    });


    $('#checkoutbtn').click(function(){
        $(this).attr('disabled','disabled');
        $('#checkoutarea').slideDown();
    });


    /* Delete Order */
    $('.delete_order').on('click',function(){
        var nonce = $(this).attr('nonce');
        var order_id = $(this).attr('order_id');
        var url = ajax_url;
        var th = $(this);
        jQuery('#order_'+order_id).fadeTo('0.5');
        if(confirm("Are you sure you want to delete this order ?")){
            $(this).html(wpdm_asset.spinner).css('outline','none');
            jQuery.ajax({
                type : "post",
                dataType : "json",
                url : url,
                data : {action: "wpdmpp_delete_frontend_order", order_id : order_id, nonce: nonce},
                success: function(response) {
                    if(response.type == "success") {
                        $('#order_'+order_id).slideUp();
                    }
                    else {
                        alert("Something went wrong during deleting...")
                    }
                }
            });
        }
        return false;
    });


    /* Checkout */

    $('body').on('submit', '#payment_form', function(e){
        e.preventDefault();
        if(navigator.userAgent.indexOf("Safari") > -1 && ($('#f-name').val() == '' || $('#email_m').val() == '')){
            alert('Please Enter Your Name & Email');
            return false;
        }

        /*$(this).validate();
        if(!$(this).valid()) {
            WPDM.notify("Fill the form properly!", "error");
            return false;
        }*/

        $('#pay_btn').data('label', $('#pay_btn').html()).attr('disabled','disabled').html(wpdm_asset.spinner).css('outline','none');
        $('#wpdmpp-cart-form .btn').attr('disabled','disabled');
        $(this).ajaxSubmit({
            'url': '?task=paynow',
            'beforeSubmit':function(){
                /*jQuery('#payment_w8').fadeIn();*/
            },
            'success':function(res){
                $('#paymentform').html(res);
                if(res.match(/error/)){
                    $('#pay_btn').removeAttr('disabled').html($('#pay_btn').data('label'));
                }else{
                    $('#payment_w8').fadeOut();
                }
            }
        });
        return false;
    });

    $(".payment-gateway-list .payment-gateway-item.index-1").addClass('active');
    $(".payment-gateway-list .payment-gateway-item.index-1 input[type=radio]").attr('checked','checked');
    $(".payment-gateway-list .payment-gateway-item").on('click', function(){
        $('.payment-gateway-list .payment-gateway-item').removeClass('active');
        $(this).addClass('active');
    });

    $('body').on('change', '.calculate-tax', function () {
        /*
        var country = $('#country').val();
        var state = $('#region').val() != null ? $('#region').val() : $('#region-txt').val();

        $.get(ajax_url+'?action=gettax&country='+country+'&state=' + state, function (res) {
            var tax_info = JSON.parse(res);
            $('#wpdmpp_cart_tax').text(tax_info.tax);
            $('#wpdmpp_cart_grand_total').text(tax_info.total);
            $('.cart-total-final').removeClass('hide').removeClass('d-none');
            $('.cart-total-final .badge').text(' ' + tax_info.total);
        });
         */
        calculate_tax();
    });

    $('body').on('change','#select-payment-method #country', function () {
        populateStates($(this).val());
    });

    $('#save-cart').on('click', function(){
        $(this).attr('disabled','disabled').html(wpdm_asset.spinner);
        $.post(location.href, { action: 'wpdmpp_anync_exec', execute: 'saveCart' }, function(cart){
            $('#carturl').val(  cart.url );
            $('#cartid').val( cart.id );
            $('#save-cart').html('<i class="fas fa-check-square"></i> Saved');
            $('#wpdm-save-cart').removeClass('hide').removeClass('d-none');
        });
    });

    $('body').on('click', '#email-cart', function(){
        var send_to = $('#cmail').val();

        if(send_to.trim() == ''){
            $('#cmail').css({'border' : '1px solid #f00'});
            return;
        }

        $('#fae').removeClass('fa-envelope').addClass(wpdm_asset.spinner);
        $('#email-cart').attr('disabled','disabled').html('Sending...');
        $.post(location.href, {action: 'wpdmpp_anync_exec', execute: 'EmailCart', email: $('#cmail').val(), cartid: $('#cartid').val()}, function(res){
            $('#fae').removeClass(wpdm_asset.spinner).addClass('fa-envelope');
            $('#email-cart').html('Sent');
        });
    });

    /* Select payment method on checkout page */
    /* Execute on page load */
    var pbtn_label = wpdmpp_txt.checkout_button_label; /* Default Payment Button Label */

    if($('#payment_form input[name="payment_method"]:checked').val() != undefined){
        pbtn_label = $('#pay_btn').html();

        $('#payment_form').addClass('blockui');

        $.post(wpdm_ajax_url, {action: 'set_payment_method_for_order', method: $('#payment_form input[name="payment_method"]:checked').val()}, function (res) {
            if(res.button === 'custom'){
                $('#checkout-terms-agree').prop('checked', true).prop('disabled', true);
                $('#pay_btn').hide();
                $('#wpdmpp-custom-payment-button').html(res.html).show();
            } else {
                $('#checkout-terms-agree').prop('checked', true).removeAttr('disabled');
                $('#wpdmpp-custom-payment-button').html(res.html).hide();
                $('#pay_btn').show();
            }
            $('#billing_form').html(res.billing_form);
            $('#payment_form').removeClass('blockui');
        });
    }
    /* Execute on change */
    $('body').on('change', '#payment_form input[name="payment_method"]', function () {

        $('#payment_form').addClass('blockui');

        $.post(wpdm_ajax_url, {action: 'set_payment_method_for_order', method: $(this).val()}, function (res) {
            if(res.button === 'custom'){
                $('#checkout-terms-agree').prop('checked', true).prop('disabled', true);
                $('#pay_btn').hide();
                $('#wpdmpp-custom-payment-button').html(res.html).show();
            } else {
                $('#checkout-terms-agree').prop('checked', true).removeAttr('disabled');
                $('#wpdmpp-custom-payment-button').html(res.html).hide();
                $('#pay_btn').show();
            }
            $('#billing_form').html(res.billing_form);
            $('#payment_form').removeClass('blockui');
        });
        $('#pay_btn:disabled').removeAttr('disabled');
        $('#pay_btn').html(pbtn_label);
    });


    /* Premium Package Cart Widget */
    $('#wpdm-cart-panel-trigger').on('click', function () {
        $('#mini_cart_details').slideToggle();
    });
    /* Premium Package Cart Widget Endd */

    /* pupulate country / state*/

    if($('#country') != undefined && $('#state') != undefined)
        populateStates($('#country').val());

    /* pupulate country / state end*/



});

/* Body OnLoad Ends */

function calculate_tax(){
    console.log('Calculating Tax...');
    var $ = jQuery;
    var country = $('#country').val();

    if(country === undefined) return;

    WPDM.blockUI('#selected-payment-gateway-action');

    var state = $('#region').val() != null ? $('#region').val() : $('#region-txt').val();

    $.get(ajax_url+'?action=gettax&country='+country+'&state=' + state, function (res) {
        var tax_info = JSON.parse(res);
        $('#wpdmpp_cart_tax').text(tax_info.tax);
        $('#wpdmpp_cart_grand_total').text(tax_info.total);
        $('.cart-total-final').removeClass('hide').removeClass('d-none');
        $('.cart-total-final .badge').text(' ' + tax_info.total);
        WPDM.unblockUI('#selected-payment-gateway-action');
    });
}

function  wpdmpp_remove_cart_item(id){
    if(!confirm('Are you sure?')) return false;
    jQuery('#save-cart').removeAttr('disabled');
    jQuery('#cart_item_'+id+' *').css('color','#ccc');
    jQuery.post('?wpdmpp_remove_cart_item='+id ,function(res){
        var obj = jQuery.parseJSON(res);
        jQuery('#cart_item_'+id).fadeOut().remove();
        jQuery('#wpdmpp_cart_grand_total').html(obj.cart_total);
        jQuery('#wpdmpp_cart_discount').html(obj.cart_discount);
        jQuery('#wpdmpp_cart_subtotal').html(obj.cart_subtotal); });
    return false;
}

function populateCountryState() {

    var $ = jQuery;

    var dataurl = wpdmpp_base_url + 'assets/js/data/';

    var countries = [], states = [], countryOptions ="",  stateOptions ="", countrySelect = $('#country'), stateSelect = $('#region'), cc;

    if(countrySelect.length === 0) return;

    $.getJSON(dataurl+'countries.json', function(data){
        $.each(data, function(i, country){
            if(i === 0) cc = country.code;
            countries[""+country.code] = country.filename;
            countryOptions += "<option value='"+country.code+"'>"+country.name+"</option>";
        });
        countrySelect.html(countryOptions);
        loadStates(cc);
    });
    countrySelect.change(function() {
        var countryCode = $(this).val();
        loadStates(countryCode);

    });

    function loadStates(countryCode){
        var filename = countries[countryCode];
        if(filename != undefined) {
            $('#region-txt').attr('disabled','disabled').hide();
            $('#region').removeAttr('disabled').show();
            $.getJSON(dataurl + 'countries/' + filename + '.json', function (data) {
                stateOptions = "";
                $.each(data, function (i, state) {
                    states["" + state.code] = state;
                    var scode = state.code.replace(countryCode + "-", "");
                    stateOptions += "<option value='" + scode + "'>" + state.name + "</option>";
                });
                stateSelect.html(stateOptions);
            });
        } else {
            $('#region').attr('disabled','disabled').hide();
            $('#region-txt').removeAttr('disabled').show();
        }

        calculate_tax();
    }

}

function populateStates(countryCode){
    var $ = jQuery;

    var dataurl = wpdmpp_base_url + 'assets/js/data/';
    var countries = [], states = [], countryOptions ="",  stateOptions ="", countrySelect = $('#country'), stateSelect = $('#region'), filename = '';

    if(countrySelect.length === 0) return;

    $.getJSON(dataurl+'countries.json', function(data){
        $.each(data, function(i, country){
            if(countryCode == country.code) {
                filename = country.filename;
            }

        });

        if(filename != undefined && filename != '') {
            $('#region-txt').attr('disabled','disabled').hide();
            $('#region').removeAttr('disabled').show();
            $.getJSON(dataurl + 'countries/' + filename + '.json', function (data) {
                stateOptions = "";
                $.each(data, function (i, state) {
                    states["" + state.code] = state;
                    var scode = state.code.replace(countryCode + "-", "");
                    stateOptions += "<option value='" + scode + "'>" + state.name + "</option>";
                });
                stateSelect.html(stateOptions);
            });
        } else {
            $('#region').attr('disabled','disabled').hide();
            $('#region-txt').removeAttr('disabled').show();
        }

        calculate_tax();

    });

}

function wpdmpp_extra_gigs() {
    var exgigs = [], sum = 0, added = [];
    jQuery('.wpdmpp-extra-gig').each(function () {
        if(jQuery(this).is(':checked') && added.indexOf(parseInt(jQuery(this).val())) < 0){
            added.push(parseInt(jQuery(this).val()));
            sum += parseFloat(jQuery(this).data('price'));
        }
    });

    return sum;
}

function getkey(file, order_id, btn_id){
    var oldico = jQuery(btn_id).html();
    jQuery(btn_id).html(wpdm_asset.spinner);
    jQuery.post(wpdm_home_url,{execute:'getlicensekey',fileid:file,orderid:order_id},function(_res){
        var res;
        res = "<input class='form-control input-lg' style='cursor:copy;font-weight: bold;margin: 0;font-family: monospace;text-align: center;font-size: 14pt;letter-spacing: 1px' onfocus='this.select()' type=text readonly=readonly value='"+_res.key+"' />";

        jQuery(btn_id).html(oldico);

        if(_res.domains.length > 0) {
            res += "<div class='panel panel-default card card-default' id='lpp' style='margin-top: 15px;margin-bottom: 0;overflow: hidden'><div class='panel-heading card-header text-left' style='text-transform: unset;background: #f5f5f5 !important;' >Linked Sites</div><div style='max-height: 300px;overflow: auto;'><ul class='list-group text-left' style='margin-top: -1px;margin-bottom: 0'>";
            jQuery.each(_res.domains, function (i, domain) {
                res += "<li class='list-group-item lci'><a href='#' data-domain='"+domain+"' data-license='"+_res.key+"' data-oid='"+order_id+"' data-pid='"+file+"' class='wpdm__rld btn btn-xs btn-danger pull-right float-right'>Remove</a>" + domain + "</li>";
            });
            res += "</ul></div></div><style>#lpp .lci{ border-radius: 0 !important;;border: 0 !important;border-top: 1px solid #dddddd !important;; }</style>";
        }

        wpdm_bootModal("License Key", res, 400);

    });
    return false;
}

var wpdmpp = {
    reset_pay_btn : function(){
        jQuery('#pay_btn').removeAttr('disabled').html('<i class="fas fa-check-square"></i> &nbsp; '+wpdmpp_txt.pay_now);
    }
}

