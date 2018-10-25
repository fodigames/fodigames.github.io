
const socket =  io({path: '/socket'});
socket.on('stats', function (data) {
    $('#games').html(data.games);
    $('#users').html(data.users);
    $('#online').html(data.online);
});
socket.on('new.winner', function (data) {
    data = JSON.parse(data);
    var lastWinners = $('#lastWinners');
    var lastWinners_el = $('<div class="win"> <div class="win_image" style="background: url(' + data.image + ') no-repeat center center;background-size:cover"></div> <div class="nick">' + data.username + '</div> <div class="ago">' + data.time + '</div> </div>');
    setTimeout(function () {
        lastWinners.prepend(lastWinners_el);
        lastWinners.find("a:nth-of-type(25)").remove();
        lastWinners_el.fadeIn(1000);
    }, 10000);
});
items = [];
function audio(audio, vol) {
    var newgames = new Audio();
    newgames.src = audio;
    newgames.volume = vol;
    newgames.play();
}
Array.prototype.shuffle = function () {
    var o = this;
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
Array.prototype.mul = function (k) {
    var res = []
    for (var i = 0; i < k; ++i)res = res.concat(this.slice(0))
    return res
};
Math.rand = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
function fillCarusel() {
    if (items.length == 0) return;
    $('.rotate').removeAttr('style');
    var itemsTape = [];

    itemsTape = items.shuffle();
    itemsTape.splice(80, itemsTape.length - 80);

    if (itemsTape.length < 80) {
        var differ = 80 - itemsTape.length;
        for (var i = 0; i < differ; i++) {
            itemsTape.push(itemsTape[Math.rand(0,items.length-1)]);
        }
    }
    htmlCar = '';

    itemsTape.forEach(function (item) {
        longName =  ((item[2].replace(/:|i/g,'')).length > 20) ? ' long-name' : '';
        htmlCar += '<div class="case"><div class="photo"><img src="' + item[0] + '"></div> <div class="name' + longName + '">' + item[2] + '</div> <div class="price"> <h4>' + item[1] + '</h4> <small>руб</small> </div> </div>'
    });

    htmlInfo = '';
    uniqItems = [];

    items.forEach(function (item) {
        if (!uniqItems.includes(item)) {
            htmlInfo += '<div class="item favor"><div class="photo"><img src="' + item[0] + '"></div> <div class="name">' + item[2] + '</div> <div class="price"> <h4>' + item[1] + '</h4> <small>руб</small> </div> </div>';
            uniqItems[uniqItems.length] = item;
        }
    });

    $('.rotate').html(htmlCar);
    $('#info-cases .items .scroll').html(htmlInfo);
}

function _getTransformOffset(e) {
    var t = e.css("transform").split(",");
    return 6 === t.length ? parseInt(t[4]) : 16 === t.length ? parseInt(t[12]) : 0
}

var notify = function (text, type) {
    noty({
        text: text,
        type: type,
        theme: 'metroui',
        layout: 'topRight',
        timeout: 4000,
        progressBar: true,
        animation: {
            open: 'animated fadeInDown',
            close: 'animated fadeOutUp'
        }
    });
};
$(document).ready(function () {

    if (window.yaCounter42806649) // убедимся, что Adblock не отрезал
    {// отложим вызов на 100мс, чтобы не мешал остальным
        setTimeout(function () {
            yaCounter42806649.reachGoal('goal_name');
        }, 100);
    }
    fillCarusel();
    $('.box-modal .payment .box > div').click(function () {
        if (!$(this).hasClass('disabled') && $(this).find('.disabled').length == 0) {
            if ($(this).data('curr') == 'megafon_rub' || $(this).find('a').data('curr') == 'tele2_rub') {
                $('#totf').hide();
                $('#inter').show();
            } else if ($(this).data('curr') == 'skinpay') {
                $('#totf').hide();
                $('#skinpay').show();
            } else {
                $('#skinpay').hide();
                $('#inter').hide();
                $('#totf').show();
            }
            $('.box-modal .payment .box > div').removeClass('active');
            $(this).addClass('active');
            $('#curr').val($(this).data('curr'));
            $('.offer_heading span i').html($(this).data('com'));
        }

    });
    $('.menu > .icon').click(function (e) {
        $(this).toggleClass('active');
        $('.menu > .drop').toggle(0);
        e.stopPropagation();
    });

    $('.menu').click(function (e) {
        e.stopPropagation();
    });

    $('html').click(function () {
        var link = $('.menu > .icon');
        if (link.hasClass('active')) {
            link.click();
        }
    });
    $('.faq .sub > .title').on('click', function () {
        $(this).removeAttr('href');
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp();
        }
        else {
            element.addClass('open');
            element.children('ul').slideDown();
            element.siblings('li').children('ul').slideUp();
            element.siblings('li').removeClass('open');
            element.siblings('li').find('li').removeClass('open');
            element.siblings('li').find('ul').slideUp();
        }
    });
    $('table#responsive').ngResponsiveTables({
        smallPaddingCharNo: 13,
        mediumPaddingCharNo: 18,
        largePaddingCharNo: 30
    });
    $(document).on('keyup', '#Unit_Cnt', function (e) {
        console.log('df');
        $('#sum').val(parseInt($(this).val()) / 5);
    });
    var openingCase = false;
    $('#show_more').click(function (e) {
        e.preventDefault;
        $('.items_container').css('max-height', $('.items_container')[0].scrollHeight + 'px');
        $(this).slideUp(500);
        that = this;
        setTimeout(function () {
            $(that).html('Испытать удачу!');
            $(that).attr('href', '/');
            $(that).slideDown(1000);
        }, 2000)
    })
    $('.expend_btn').click(function (e) {
        e.preventDefault();
        if ($(this).parent().hasClass('opened')) {
            $(this).text('Больше').parent().removeClass('opened');
        } else {
            $(this).text('Меньше').parent().addClass('opened');
        }
    });
    if ($('.case_description_text > .f_left').length > 0 && $('.case_description_text > .f_left')[0].scrollHeight < 210) {
        $('.case_description_text > .f_left').addClass('opened').find('.expend_btn').hide();
    }
    $('.open_modal').click(function (e) {
        e.preventDefault();
        modal($(this).data('modal'));
    });
    function modal(target, text) {

        text = (text) ? text : 0;

        $('.modal').fadeOut(200);
        if (text) {
            $(target).find('.text').html(text);
        }
        if (target == '#pay') {
            $(target).css({
                'margin-left': $(target).outerWidth() / 2 * -1,
                'margin-top': $(target).outerHeight() / 2 * -1 + 287,
            });
        } else {
            $(target).css({
                'margin-left': $(target).outerWidth() / 2 * -1,
                'margin-top': $(target).outerHeight() / 2 * -1,
            });
        }
        $('#overlay').fadeIn(200);
        $(target).fadeIn(400);
    }

    $('.modal .close').click(function (e) {
        e.preventDefault();
        $('.modal').fadeOut(200);
        $('#overlay').fadeOut(400);
        if (typeof player !== 'undefined' && $('#video_cont').is(":visible")) {
            player.stopVideo();
        }
    });

    $('body').on('click', ".go-next", function (e) {
        $('#won').arcticmodal('close');
        $('.box-modal#won .buttons .sell a').removeAttr("bsh").hide();
    });
    $('body').on('click', '.sell_game', function (e) {
        var that = $(this);
        $.post('/play', {'type': 'sell', 'bsh': that.data('bsh')}, function (data) {
            if (data.status != 'success') {
                notify(data.msg, data.status);
            } else {
                $('#balance b').html(data.money);
                that.parent().parent().parent().parent().html('<span class="descr">Игра продана за ' + data.price + ' руб.</span>');
                notify(data.msg, data.status);
            }
        });
    });
    $('body').on('click', '.box-modal#won .buttons .sell a', function (e) {
        var that = $(this);
        $.post('/play', {'type': 'sell', 'bsh': that.data('bsh')}, function (data) {
            if (data.status != 'success') {
                return notify(data.msg, data.status);
            }
            $('#balance b').html(data.money);
            that.removeAttr("data-bsh").hide();
            $('.box-modal#won .buttons ul li a:not(.go-next)').hide();
        });
    });
    $('body').on('click', '.get_game', function (e) {
        var that = $(this);
        $.post('/play', {'type': 'send', 'bsh': that.data('bsh')}, function (data) {
            if (data.status != 'success') return notify(data.msg, data.status);
            that.parent().parent().parent().parent().html('<span class="descr">Ваш ключ ' + data.key + '</span>');
        });
    });
    $('body').on('click', '.case_page .case_box .top .buttons .play a:not(.disabled),.main_roulette .buttons .play a:not(.disabled)', function (e) {
        var that = $(this);
        var text = that.text();
        that.addClass('disabled');
        audio('/audio/button_click_on.mp3', 0.2);
        $.post('/play', {'gameId': that.data('case')}, function (data) {
            if (data.status == 'success') {
                var item = data.data;
                $('.box-modal#won .buttons ul li a').show();
                $('.box-modal#won .buttons .sell a').show();
                $('#balance b').html(data.money);
                $(".box-modal#won .case .name").html(item.name);
                $('.box-modal#won .case .photo img').attr('src', item.image);
                $(".box-modal#won .case .price h4").text(item.pricesell);
                $(".box-modal#won .buttons .sell a").html('Продать за ' + item.pricesell + ' ₽');
                $(".box-modal#won .buttons .sell a").attr('data-bsh', data.bsh).show();
                $(".box-modal#won .buttons .sell a").attr('data-bsh', data.bsh).show();
                $('#roulette').fadeOut(500, function () {
                    fillCarusel();
                    $('#roulette').fadeIn(500, function () {

                        that.text('Открываем...');
                        $('.case:nth-child(77) img').attr('src', item.image);
                        $('.case:nth-child(77) .name').html(item.name);
                        $(".game .bilet .play").fadeOut(500);
                        var _item = $('.rotate > div:nth-child(1)');
                        var _item_width = _item.outerWidth();
                        var _item_wrapper = _item.outerWidth(true);
                        var _marginLeft = _item_wrapper * 69.22;
                        _marginLeft -= _item_wrapper * 1.5;  // изначальная позиция
                        _marginLeft = Math.rand(_marginLeft, _marginLeft + (_item_width - 8));
                        var timeout = 16000;
                        $('.rotate').css({
                            transform: 'translate3d(-' + _marginLeft + 'px, 0px, 0px)',
                            transition: timeout + 'ms cubic-bezier(0.32, 0.64, 0.45, 1)'
                        });
                        audio('/audio/open.wav', 0.3);
                        setTimeout(function () {
                            openingCase = false;
                            audio('/audio/close.wav', 0.3);

                            $('#won').arcticmodal();
                            that.text(text);
                            that.removeClass('disabled');
                            $('#new_wins i').text(parseInt($('#new_wins i').text()) + 1);
                        }, timeout);

                    });
                });
            } else {
                notify(data.msg, data.status);
                that.removeClass('disabled');
            }
        });
    });
    $('.question').click(function () {
        if ($(this).parent().hasClass('opened')) {
            $(this).parent().removeClass('opened');
            $(this).parent().find('.answer').slideUp();
        } else {
            $('.opened').find('.answer').slideUp();
            $('.opened').removeClass('opened');
            $(this).parent().addClass('opened');
            $(this).parent().find('.answer').slideDown();
        }
    })
});