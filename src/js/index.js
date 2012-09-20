
(function ($) {
    $('#nav_list a').click(function (e) {
        e.preventDefault();
        var t = $(this).attr('href').substr(1);
        if (t.match(/\.index$/)) {      // load sidebar index and its first content item
            $.getJSON(t + '.json').success(function (rs) {
                $('#index_bar').css('display', 'block');
                $('#content').removeClass('span12').addClass('span10');
                var ul = $('#index_bar ul').empty();
                $.each(rs, function (i, e) {
                    var a = $('<a/>').attr('href', '#' + e.target).text(e.name);
                    ul.append($('<li></li>').html(a));
                });
                ul.children()[0].click();
            });
        } else {                        // load content directly
            $.ajax({url: t + '.html'}).done(function (rs) {
                $('#content').removeClass('span10').addClass('span12');
                $('#content').html(rs);
                $('#index_bar').css('display', 'none');
            });
        }
        $('#nav_list a').parent().removeClass('active');
        $(this).parent().addClass('active');
    });

    $('#index_bar li a').on('click', function (e) {
        e.preventDefault();
        var t = $(this).attr('href').substr(1);
        $.ajax({url: t + '.html'}).done(function (rs) {
            $('#content').html(rs);
        });
        $('#index_bar li a').parent().removeClass('active');
        $(this).parent().addClass('active');
    });

    $(function () {
        $('#nav_list a').first().click();
    });
})(jQuery);
