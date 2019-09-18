var stickyBar1 = 30, stickyBar2 = 30; // 50
var stickyHeight;

// var xDown = null;
// var yDown = null;

var production = false;

$(document).ajaxStart( function() {
  $('#sd-publish-loader-icon').show();
}).ajaxStop( function() {
  $('#sd-publish-loader-icon').hide();
});

$(document).ready(function(){
    
    // set default click event
    var sd_click_event = 'click';
    
    // set click event for simdif editor mode on mobile device
    if( $('#sd-wrapper.sd-publish-site').length < 1 && publishIsMobile() )
        sd_click_event = 'vclick';
    
    $(document).on(sd_click_event, '.sd-mobnav-btn', menuActive);
    
    // for published site only
    if( $('#sd-wrapper.sd-publish-site').length > 0 )
        $(document).on('change', '.sd-publish-site .sd-top-panel-lang .lang-select select', publishSwitchSite);
    
    
    $(window).on('scroll', function() {
        fixBar();
    });
    
    $(window).on('resize', function() {
        rearrangeSiteTitle();
    });
    
    rearrangeSiteTitle();
    
    if( $('#sd-wrapper.sd-publish-site').length > 0 )
    {
        // add tracking code (simple stats) for publish site
        $('body').append('<img src="sd_tracking.php" style="width: 0px; height: 0px;">');
        
        // fixed scroll menu down bug on mobile
        setTimeout( function() {
            if( $('.sd-main-nav .sd-tab').height() > $('#sd-column-nav').height() )
                $('#sd-column-nav').height($('.sd-main-nav .sd-tab').height());
            
            if( $('#sd-column-nav .sd-main-nav .sd-tab').height() > $('#sd-column-page').height() )
                $('#sd-column-page .sd-column-page-content').css('min-height' , $('#sd-column-nav .sd-main-nav .sd-tab').height());
        }, 100);

        if ( publishIsMobile() ) {
            $(document).on('touchstart', '.sd-tab-item', function () {
                $(this).addClass("button-active-big");
            });

            $(document).on('touchend', '.sd-tab-item', function () {
                $(this).removeClass("button-active-big");
            });

            $(document).on('touchstart', '.sd-block-readmore-div, .sd-contact-btn, .sd-block-cfa, .sd-ct-submit', function () {
                $(this).addClass("button-active4");
            });

            $(document).on('touchend', '.sd-block-readmore-div, .sd-contact-btn, .sd-block-cfa, .sd-ct-submit', function () {
                $(this).removeClass("button-active4");
            });

            $(document).on('touchstart', '.sd-mobnav-btn', function () {
                $(this).addClass("sd-mobnav-btn-active");
            });

            $(document).on('touchend', '.sd-mobnav-btn', function () {
                $(this).addClass("sd-mobnav-btn-active");
            });
        }
    }

    switchBigImg();
    $( window ).resize(switchBigImg);
});

function publishGetOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1)
    os = 'mac';
  else if (iosPlatforms.indexOf(platform) !== -1)
    os = 'ios';
  else if (windowsPlatforms.indexOf(platform) !== -1)
    os = 'windows';
  else if (/Android/.test(userAgent))
    os = 'android';
  else if (!os && /Linux/.test(platform))
    os = 'linux';
  
  return os;
}

function publishIsMobile()
{
    return publishGetOS() == 'android' || publishGetOS() == 'ios';
}

function fixBar()
{
    var logo_height = 100 + ($('#sd-editor-top-panel').height() || 0); //$('#sd-site-logo').height() || 150;
    
    $(this).scrollTop() > logo_height + stickyBar1 ? $('#sd-strip-bar').css('top', -70) : $('#sd-strip-bar').removeAttr('style');

    if (($(this).scrollTop() > logo_height + stickyBar2)) {  
        
        if (!$('#sd-strip-bar').hasClass('sticky'))
            $('#sd-strip-bar').addClass('sticky2');

        setTimeout( function() {
            $('#sd-strip-bar').addClass('sticky');
            $('#sd-strip-bar').removeClass('sticky2');
        }, 5 );

        $('#sd-strip-bar-wrap-container').addClass('sd-strip-container');

        $('#sd-site-logo').appendTo($('#sd-strip-bar-wrap-container'));

        // should be match with media css for each size of screen width
        stickyHeight = ($(window).width() > 767 ? 60 : ($(window).width() > 519 ? 43 : 30));
        
        $('#sd-site-logo').css({'height' : stickyHeight , 'width' : stickyHeight});
        $('.sd-site-contact').addClass('sd-site-contact-show');
        $('#sd-site-title').addClass('text-overflow');
        
        $('.sd-mobnav-btn').addClass('sd-mobnav-btn-fix');
        $('.sd-nav-menu').addClass('sd-nav-menu-hidden');
        
        $('#sd-editor-top-panel-site-name').hide();
        // $('#sd-edit-page-controler').removeClass('sd-edit-page-controler-fix');

        var contact_btn = $('.sd-contact-btn').width();
        var contact_btn_width = 0;
        var logo_left = $('#sd-site-logo').offset().left - $('#sd-header').offset().left;
        var title_start = 0;
        var title_start_left = 0;

        if ($(window).width() < 520 ) {
            contact_btn_width = '60px';
            title_start = (logo_left + $('#sd-site-logo').width()) + (logo_left + 12);
        } else if ($(window).width() < 769 ) {
            contact_btn_width = contact_btn + 50;
            title_start = (logo_left + $('#sd-site-logo').width()) + (logo_left - 5);
        } else {
            contact_btn_width = contact_btn + 70;
            title_start = (logo_left + $('#sd-site-logo').width()) + (logo_left - 10);
        }

        if (title_start < 0)
            title_start_left = '3%';
        else
            title_start_left = title_start;

        $('#sd-site-title').css({'right': contact_btn_width, 'left': title_start_left});

    } else {
        $('#sd-strip-bar').removeClass('sticky');
        $('#sd-strip-bar-wrap-container').removeClass('sd-strip-container');
        $('#sd-site-logo').removeAttr('style');
        $('#sd-site-logo').appendTo($('#sd-strip-bar'));
        $('.sd-site-contact').removeClass('sd-site-contact-show');
        $('#sd-site-title').removeClass('text-overflow');
        
        $('.sd-mobnav-btn').removeClass('sd-mobnav-btn-fix');
        $('.sd-nav-menu').removeClass('sd-nav-menu-hidden');
        
        $('#sd-editor-top-panel-site-name').show();
        
        $('#sd-site-title').css({'right': 0, 'left': 0});

        setTimeout( function() {
            rearrangeSiteTitle();
        }, 200 );
    }
}

function showMenu()
{
    $('#sd-column-nav').animate({
        left: '10.5%'
    });
    $('#sd-column-page').animate({
        left: '90%'
    });

    $('#sd-footer-content').animate({
        left: '90.5%'
    });

    $('#sd-main-wrap').addClass('sd-menu-show');
}

function hideMenu()
{
    $('#sd-column-nav').animate({
        left: '-79.5%'
    });
    $('#sd-column-page').animate({
        left: '0%'
    });

    $('#sd-footer-content').animate({
        left: '0.5%'
    });

    $('#sd-main-wrap').removeClass('sd-menu-show');
}

function menuActive()
{
    if ($('#sd-main-wrap').hasClass('sd-menu-show')) {
        hideMenu();
    } else {
        showMenu();
    }

    return;
}

// form validation =============================
function sdFormValidate(current_form)
{
    var msg = '', fields = '', item = '';

    if( sdCtSubmitClick(current_form) )
    {
        if( $(current_form).find('.sd-ct-item').length > 0 )
            item = '.sd-ct-item';
        else
            item = '.sd-user-comment-form-item';
        
        $(current_form).find('input, textarea').each( function(i, d)
        {
            if( $(this).closest(item).attr('sd-data-mandatory') == 1 )
            {
                if( $.trim($(this).val()) == '' )
                {
                    //alert( $(this).closest(item).attr('sd-data-alert') );
                    msg = $(this).closest(item).attr('sd-data-alert');
                    
                    if( fields != '' )
                        fields += ', ';
                    fields += $.trim($(this).closest(item).find('.sd-input-text-title').text().replace(':', ''));
                    
                    if( i == 0 )
                        $(this).focus();
                }
            }
        });
        
        if( fields != '' )
        {
            msg = msg.replace('{{xxx}}', fields);
            errorMessageDisplay(current_form, msg);
            
            return false;
        }
        
        msg = '';
        $(current_form).find('input, textarea').each( function()
        {
            if( $(this).closest(item).attr('sd-data-mandatory') == 1 )
            {
                if( $(this).closest(item).attr('sd-data-type') == 'email' &&! validator.isEmail($.trim($(this).val())) )
                {
                    msg = $(this).closest(item).attr('sd-data-alert-invalid');
                    errorMessageDisplay(current_form, msg);
                    
                    $(this).focus();
                    return false;
                }
                
            }
        });
        
        if( msg != '' )
            return false;
        
        var block_id    = $(current_form).find('.sd-recaptcha').attr('id').replace('recaptcha-', '');
        var recaptcha   = grecaptcha.getResponse(recaptcha_id[block_id]);
        
        if( !recaptcha )
        {
            errorMessageDisplay(current_form, recaptcha_error);
            return false;
        }
        
        return formSubmit(current_form);
    }
    
    return false;
}

function errorMessageDisplay(current_form, msg)
{
    $(current_form).find('.sd-form-error').html(msg);
    
    $('.sd-form-error-div').css({'height': '55px'});
    $(current_form).find('.sd-form-error').slideDown('slow');
    setTimeout( function() { $(current_form).find('.sd-form-error').slideUp('slow'); }, 5000);
}

function formSubmit(current_form)
{
    var block_id = $(current_form).find('.sd-recaptcha').attr('id').replace('recaptcha-', '');
    var form_data = '';
    
    // contact form
    if( $(current_form).find('.sd-ct-item').length > 0 )
    {
        form_data  = 'data='+JSON.stringify(sdGetFormData(current_form));
        form_data += '&type='+$(current_form).find('[name=type]').val();
        form_data += '&g-recaptcha-response='+$(current_form).find('.g-recaptcha-response').val();
    }
    // comment form
    else
    {
        form_data  = $(current_form).serialize().replace(/%0D/g, '<br>').replace(/%0A/g, '');
        form_data += '&block_id='+block_id;
    }
    
    $.ajax({
        url: '/sd_form_submit.php',
        data: form_data,
        type: 'POST',
        success: function(d) {
            if( d && typeof(d) === 'string' )
                var dat = JSON.parse(d);
            else
                var dat = eval(d);
            
            if( dat.result == 'ok' )
            {
                alert('Message has been sent.');
            }
            else
            {
                alert('Something problem.');
            }
        },
        complete: function() {
            resetReCaptcha(block_id);
            
            $(current_form).find('input.sd-input-text, textarea.sd-input-textarea').each( function(i, d) {
                $(this).val('');
            });
        },
    });
    
    return false;
}

function jsonEscape(str)  {
    return str.replace(/\n/g, "<br>").replace(/\r/g, '').replace(/\t/g, "    ");
}

function sdGetFormData(current_form)
{
    var item;
    
    if( $(current_form).find('.sd-ct-item').length > 0 )
        item = '.sd-ct-item';
    else
        item = '.sd-user-comment-form-item';
    
    var data = [], c = 0;
    $(current_form).find('input, textarea').each( function(i, d)
    {
        if( $.inArray($(this).attr('type'), ['submit','hidden']) > -1 )
            return;
        
        var name    = $.trim($(this).closest(item).find('.sd-input-text-title').text().replace(':', ''));
        var value   = encodeURIComponent(jsonEscape($(this).val()));
        
        if( name != '' )
        {
            if( $(this).attr('type') == 'radio' )
            {
                if( $(this).prop('checked') )
                {
                    data[c] = {
                        'title' : name,
                        'value' : value,
                        'type'  : $(this).attr('type'),
                        'name'  : $(this).attr('name'),
                    };
                    c++;
                }
            }
            else if( $(this).attr('type') == 'checkbox' )
            {
                data[c] = {
                    'title' : name,
                    'value' : '',
                    'type'  : $(this).attr('type'),
                    'name': $(this).attr('name'),
                };
                
                if( $(this).prop('checked') )
                {
                    data[c].value = value;
                }
                c++;
            }
            else
            {
                data[c] = {
                    'title' : name,
                    'value' : value,
                    'type'  : ($(this).attr('type') != undefined ? $(this).attr('type') : 'textarea'),
                    'name'  : $(this).attr('name'),
                };
                c++;
            }
        }
    });
    
    return data;
}

/**
 * Console log
 *
 * @param {String} message
 * @param {Object} data (optional)
 * @param {Boolean} critical (optional)
 */
function log(message, data, critical)
{
    if (critical === true || !production) {
        if (data) {
            console.log(message, data);
        } else {
            console.log(message);
        }
    }

    return message;
}


/**
  * Set site title position if logo is shown
  */
function rearrangeSiteTitle()
{
    if( !$('#sd-site-logo').hasClass('sd-site-logo-none') )
    {
        if( $('#sd-site-logo').offset() != undefined )
        {
            var logo_left = $('#sd-site-logo').offset().left - $('#sd-header').offset().left;

            var title_start = (logo_left + $('#sd-site-logo').width()) + (logo_left - 10);
            $('#sd-site-title').css({'padding-left': title_start+'px'});
        }
    }
}

function reCaptchaShow(_this)
{
    if( _this.manual )
        _this = _this.data;
    else
        _this = this;
    
    if( $(_this).closest('.sd-user-comment-form').length > 0 )
        var block_id = $(_this).closest('.sd-user-comment-form').find('[id^=recaptcha-]').attr('id').replace('recaptcha-', '');
    else
        var block_id = $(_this).closest('.sd-block-contact').find('[id^=recaptcha-]').attr('id').replace('recaptcha-', '');
    
    if( $('#recaptcha-'+block_id).html() == '' )
        reCaptchaLoad(block_id);
    
    //$('#recaptcha-'+block_id).closest('form').find('.sd-ct-submit').removeClass('sd-ct-submit-disabled');
}


function sdCtSubmitClick(current_form)
{
    if( $(current_form).find('.sd-ct-submit').hasClass('sd-ct-submit-disabled') )
    {
        var _this = {};
        
        _this.manual = true;
        _this.data = $(current_form).find('.sd-ct-submit')[0];
        reCaptchaShow(_this);
        
        return false;
    }
    else
        return true;
}

function verifyCallback(block_id)
{
    if( $.trim(block_id) != '' && recaptcha_id[block_id] != undefined )
    {
        var send_button = $('#recaptcha-'+block_id).closest('form').find('.sd-ct-submit');
        
        if( grecaptcha.getResponse(recaptcha_id[block_id]) )
            send_button.removeClass('sd-ct-submit-disabled');
        else
            send_button.addClass('sd-ct-submit-disabled');
    }
}

function resetReCaptcha(block_id)
{
    if( $.trim(block_id) != '' && recaptcha_id[block_id] != undefined )
    {
        grecaptcha.reset(recaptcha_id[block_id]);
        verifyCallback(block_id);
    }
}

function publishSwitchSite()
{
    var url = $(this).val();
    
    if( url != '' )
        window.location.href = url;
}

function switchBigImg() {
    var w = $(window).width();
    
    if( w < 667 ) {
        // text - big image - left
        $.each($('.sd-block-image.sd-img-align-left.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var text_title   = curr_block.find('.sd-block-title-div');
            
            if (!curr_block.parents().parents().hasClass('sd-block-readmore'))
                $(v).insertAfter(text_title);
        });
        
        // text - big image - right
        $.each($('.sd-block-image.sd-img-align-right.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var text_desc   = curr_block.find('.sd-block-text-desc');

            if (!curr_block.parents().parents().hasClass('sd-block-readmore'))
                $(v).insertAfter(text_desc);
        });

        // Readmore
        // text - big image - left
        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-left.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var page_title  = curr_block.parents().closest(".sd-page-title-div");

            if (curr_block.parents().parents().hasClass('sd-block-readmore')) {
                $(v).insertBefore(page_title);
            }
        });

        // text - big image - right
        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-right.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var page_title  = curr_block.parents().closest(".sd-page-title-div");

            if (curr_block.parents().parents().hasClass('sd-block-readmore')) {
                $(v).insertBefore(page_title);
            }
        });
    } else {
        // text - big image - left
        $.each($('.sd-block-image.sd-img-align-left.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var text_title   = curr_block.find('.sd-block-title-div');

            $(v).insertBefore(text_title);
        });

        // text - big image - right
        $.each($('.sd-block-image.sd-img-align-right.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var text_title  = curr_block.find('.sd-block-title-div');

            $(v).insertBefore(text_title);
        });

        // Readmore
        // text - big image - left
        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-left.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var page_title  = curr_block.parents().closest(".sd-page-title-div");

            if (curr_block.parents().parents().hasClass('sd-block-readmore')) {
                $(v).insertBefore(page_title);
            }
        });

        // text - big image - right
        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-right.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var page_title  = curr_block.parents().closest(".sd-page-title-div");

            if (curr_block.parents().parents().hasClass('sd-block-readmore')) {
                $(v).insertBefore(page_title);
            }
        });
    }

    // text - small image

    $.each($('.sd-block-image.sd-img-align-left.sd-img-small'), function(i,v) {
        var curr_block  = $(v).closest('.sd-block');
        var page_title  = curr_block.parents().closest(".sd-page-title-div");

        if (curr_block.parents().parents().hasClass('sd-block-readmore')) {
            $(v).insertBefore(page_title);
        }
    });

    $.each($('.sd-block-image.sd-img-align-right.sd-img-small'), function(i,v) {
        var curr_block  = $(v).closest('.sd-block');
        var page_title  = curr_block.parents().closest(".sd-page-title-div");

        if (curr_block.parents().parents().hasClass('sd-block-readmore')) {
            $(v).insertBefore(page_title);
        }
    });

    if( w < 1024 ) {
        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-left.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var blog_date    = curr_block.find('.sd-block-blog-date-div');
            blog_date.css({'width': '46.3%', 'float': 'right'});
        });

        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-right.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var blog_date    = curr_block.find('.sd-block-blog-date-div');

            blog_date.css({'width': '46.3%'});
        });

        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-left.sd-img-small'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var blog_date    = curr_block.find('.sd-block-blog-date-div');
            blog_date.css({'width': '63%', 'float': 'right'});
        });

        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-right.sd-img-small'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var blog_date    = curr_block.find('.sd-block-blog-date-div');

            blog_date.css({'width': '63%'});
        });
    } else {
        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-left.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var blog_date    = curr_block.find('.sd-block-blog-date-div');
            blog_date.css({'width': '47%', 'float': 'right'});
        });

        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-right.sd-img-big'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var blog_date    = curr_block.find('.sd-block-blog-date-div');

            blog_date.css({'width': '47%'});
        });

        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-left.sd-img-small'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var blog_date    = curr_block.find('.sd-block-blog-date-div');
            blog_date.css({'width': '64%', 'float': 'right'});
        });

        $.each($('.sd-block-readmore .sd-block-image.sd-img-align-right.sd-img-small'), function(i,v) {
            var curr_block  = $(v).closest('.sd-block');
            var blog_date    = curr_block.find('.sd-block-blog-date-div');

            blog_date.css({'width': '64%'});
        });
    }
}