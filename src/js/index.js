
(function ($) {
    var current_lang = function () {
        if (R.path().length > 0) {
            return R.path()[0];
        }
        return $('#lang_switch').text() == 'English' ? 'cn' : 'en';
    };

    $('#nav_list a').click(function (e) {
        e.preventDefault();
        var t = $(this).attr('href').substr(1);
        R.path([current_lang(), t]);
        $('#nav_list a').parent().removeClass('active');
        $(this).parent().addClass('active');
    });

    $('#index_bar ul').on('click', 'a', function (e) {
        e.preventDefault();
        var t = $(this).attr('href').substr(1);
        var p = R.path();
        if (p.length > 2) {
            p[2] = t;
        } else {
            p.push(t);
        }
        R.path(p);
        $('#index_bar li a').parent().removeClass('active');
        $(this).parent().addClass('active');
    });

    $('#lang_switch').click(function (e) {
        e.preventDefault();
        var cur = R.path();
        cur[0] = cur[0] == 'en' ? 'cn' : 'en';
        R.path(cur);
    });

    var handler = {
        enter: function() {
            var target = R.path()[0];
            $.getJSON('lang.json').success(function (lang) {
                $.each(lang[target], function (i, e) {
                    $('#' + i).text(e);
                });
            });
            $('#lang_switch').text(target == 'cn' ? 'English' : '中文');
        },

        change: function(path, oldpath, level) {
            if (path[1].match(/\.index$/)) {
                var ul = $('#index_bar ul');
                if (oldpath[0] == path[0] && oldpath.length >= 2 && oldpath[1] == path[1]) {
                    if (path.length < 3) {
                        ul.children().first().children().click();
                    } else {
                        $.ajax({url: path[0] + '/' + path[2] + '.html'}).done(function (rs) {
                            $('#content').html(rs);
                        }).error(function () {
                            R.path('error');
                        });
                    }
                } else {
                    $.getJSON(path[0] + '/' + path[1] + '.json').success(function (rs) {
                        $('#index_bar').css('display', 'block');
                        $('#content').removeClass('span12').addClass('span10');
                        ul.empty();
                        $.each(rs, function (i, e) {
                            var a = $('<a/>').attr('href', '#' + e.target).text(e.name);
                            ul.append($('<li></li>').html(a));
                        });
                        if (path.length > 2) {
                            $.ajax({url: path[0] + '/' + path[2] + '.html'}).done(function (rs) {
                                $('#content').html(rs);
                            }).error(function () {
                                R.path('error');
                            });
                        } else {
                            ul.children().first().children().click();
                        }
                    });
                }
            } else {
                $.ajax({url: path[0] + '/' + path[1] + '.html'}).done(function (rs) {
                    $('#content').removeClass('span10').addClass('span12');
                    $('#content').html(rs);
                    $('#index_bar').css('display', 'none');
                });
            }
        },

        leave: function() {

        }
    };

    var default_handler = {
        enter: function() {
            R.path('');
        }
    };

    R.path('en', handler);
    R.path('cn', handler);
    R.path('notfound', default_handler);
    R.path('default', {
        enter: function () {
            $('#nav_list a').first().click();
        }
    });
    R.path('error', {
        enter: function () {
            $('#content').html('<h2>Oops, Error Occurred</h2>');   
        }
    });

})(jQuery);
