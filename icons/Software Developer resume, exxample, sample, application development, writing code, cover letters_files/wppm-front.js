jQuery(function ($) {

    $('.btn-cancel-sub').on('click', function () {
        if(!confirm('Are you sure?')) return false;
        var cbtn = $(this);
        $.get($(this).data('url'), function (res) {
            if(res.success !== undefined){
                location.href = cbtn.data('reload');
            } else
                alert(res);
        })
    });

});


