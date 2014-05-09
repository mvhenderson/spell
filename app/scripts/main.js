'use strict';

(function ($) {
    var cache = {};

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function refresh(words) {
        // reset form groups
        $('.form-group').removeClass('has-success has-error has-feedback');

        var tmp = words.slice(); //clone
        var len = $('input').length;
        for (var i = 1; (i<=len)&&(tmp.length>0); i++) {
            var index = rand(0,tmp.length-1);
            var word = tmp.splice(index,1)[0];
            $('#i'+i).val('').data('word', word);
            var audio = document.getElementById('a'+i);
            audio.pause();
            var file = word.replace(/['"\s]/g,'_');
            audio.src = 'audio/'+file+'.wav'; //m4a';
        }

        $('#i1').select().focus();
    }

    function play(i) {
        document.getElementById('a'+i).play();
    }

    $('a[id^="p"]').click(function () {
        var i = this.id.match(/\d+$/);
        play(i);
    });
    $('input[id^="i"]').focus(function () {
        var i = this.id.match(/\d+$/);
        play(i);
    });

    function load(url) {
        if (cache[url]) {
            refresh(cache[url]);
        }
        else {
            $('div#words:hidden').fadeIn(500);
            $.getJSON('words/'+url+'.json', function (data) {
                cache[url] = data;
                refresh(data);
            });
        }
    }

    $('.form-control').keydown(function(e){
        if (e.which === 9) return;
        if (e.which === 13) {
            var inputs = $('.form-control');
            var curr = inputs.index(this);
            var next = inputs[curr+1];
            if (next) {
                next.focus();
                next.select();
            }
            return;
        }
        $(this).parents('.form-group').removeClass('has-success has-error has-feedback');
    });

    $('a[data-words]').click(function () {
        var self = $(this);

        load(self.data('words'));

        // nav activation
        if (!self.parent().hasClass('active')) {
            $('.nav li.active').removeClass('active');
            self.parent().addClass('active');
        }
    });

    $('#btnGrade').click(function () {
        $('input[id^="i"]').each(function () {
            var self = $(this);
            var group = self.parents('.form-group');
            if (self.val().toLowerCase() === self.data('word').toLowerCase()) {
                group.addClass('has-success has-feedback');
            }
            else {
                group.addClass('has-error has-feedback');
            }
        });
    });

})(jQuery);
