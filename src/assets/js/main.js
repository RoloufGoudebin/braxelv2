$(window).on('load scroll', function(){

    var slideInLeft = $('.slideInLeft');
  
    slideInLeft.each(function () {
  
      var active = 'play-left';
      var elemOffset = $(this).offset().top;
      var scrollPos = $(window).scrollTop();
      var wh = $(window).height();
  
      if(scrollPos > elemOffset - wh + (wh / 4)){
        $(this).addClass(active);
      }
    });

    var slideInRight = $('.slideInRight');

    slideInRight.each(function () {
  
        var active = 'play-right';
        var elemOffset = $(this).offset().top;
        var scrollPos = $(window).scrollTop();
        var wh = $(window).height();
    
        if(scrollPos > elemOffset - wh + (wh / 4)){
          $(this).addClass(active);
        }
      });
  });


  