$(document).ready(function() {
var margins = parseInt($(".container div").css("margin-left")) + parseInt($(".container div").css(
"margin-right"));
     function valid_array(array) {
         for (var kDisorder = 0, i = 1, len = array.length - 1; i < len ;i++) {
             for (var j = i - 1; j >= 0 ;j--) {
                 if (array[j] > array[i]) {
                     kDisorder++;
                 }
                 
             }
             return !(kDisorder % 2);
         }
     }
     function identify_elems() {
         var blank_l = $(".blank")[0].getBoundingClientRect().left,
             blank_t = $(".blank")[0].getBoundingClientRect().top,
             object = {},
             blank_b = $(".blank")[0].getBoundingClientRect().bottom,
             blank_r = $(".blank")[0].getBoundingClientRect().right;
         
         var x1,x2,y1,y2;
         var elem = document.elementFromPoint(blank_l - margins - $(".blank").width()/2,blank_t);
         
         if (elem != null) {
            
             if ($(elem).is(".container div")) {
                
                 x1 = elem.getBoundingClientRect().left;
                 $(elem).addClass("draggable-horizontal");
             }         
         }
         
         elem = document.elementFromPoint(blank_r + margins + $(".blank").width()/2,blank_t);
         
         if (elem != null) {
            
             if ($(elem).is(".container div")) {
                x2 = elem.getBoundingClientRect().right;
                $(elem).addClass("draggable-horizontal");
             }
         }
         elem = document.elementFromPoint(blank_l,blank_t  - margins - $(".blank").height()/2);
         if (elem != null){
          
             if ($(elem).is(".container div")) {
                 
                 y1 = elem.getBoundingClientRect().top;
                 $(elem).addClass("draggable-vertical");
             }
         }
         
         elem = document.elementFromPoint(blank_l,blank_b +  margins + $(".blank").height()/2);
         
         
         if (elem != null) {
            
             if ($(elem).is(".container div")) {
                
                 y2 = elem.getBoundingClientRect().bottom;
                 $(elem).addClass('draggable-vertical');
             }
         }
         
         object.x1 = x1 || $(".blank")[0].getBoundingClientRect().left;
         object.x2 = x2 || $(".blank")[0].getBoundingClientRect().right;
         object.y1 = y1 || $(".blank")[0].getBoundingClientRect().top;
         object.y2 = y2 || $(".blank")[0].getBoundingClientRect().bottom;
         
         return object;
     }
         
      function update() {
          
          
         
         
          $(".double").removeClass("double");
          $(".blank").css("position","static");
          $(".blank").removeClass("blank");
          
          $(".draggable-vertical").draggable("destroy");
          $(".draggable-horizontal").draggable().draggable("destroy");
          $(".draggable-vertical").removeClass("draggable-vertical");
          $(".draggable-horizontal").removeClass("draggable-horizontal");
          $(".container div").css("left","0");
          $(".container div").css("top","0");
          
          /*$("<div><span></span></div>").appendTo($(".container"));
           */
          array.forEach(function(chislo,i){
             $(".numeric span").eq(i).text(chislo);
              
              if (chislo == 0) {
               $(".numeric div").eq(i).addClass("blank");
           }
               if (chislo >=10) {
               $(".numeric span").eq(i).addClass("double");
           }
              
          });
         
          coords = identify_elems();
         
          $('.draggable-vertical').draggable({
             'containment':'parent',
             'axis':'y',
             'start':function(event,ui) {
                
                  start_coord_y = event.clientY;
                  
                  pos.top = parseInt($(this).css("top"));
                  
                  pos.left = parseInt($(this).css("left"));
             },
             'drag':function(event,ui) {
                  cur_coord_y = event.clientY;
                  cur_coord_x = event.clientX;
                  
                     
                    if(!(cur_coord_y-$(".blank").width()/2 > coords.y1 && cur_coord_y+$(".blank").width()/2 < coords.y2)) {
                       
                        ui.position = pos;
                        
                        return;
                    }
                     
                    if(Math.abs(cur_coord_y-start_coord_y) > ($(".blank").width() +  margins) * 0.3) {
                        var i_blank = $(".container div").index($(".blank")),
                            i_elem = $(".container div").index($(this));
                        var temp = array[i_elem];
                        
                        array[i_elem] = array[i_blank];
                        array[i_blank] = temp;
                        
                        if (update()) {
                            alert("win");
                        }
                    }
                 }
             ,
             
         });
          $('.draggable-horizontal').draggable( {
            'containment':'parent',
             'axis':'x',
             'start':function(event,ui){
               start_coord_x = event.clientX; 
               pos.top = parseInt($(this).css("top"));
               pos.left = parseInt($(this).css("left"));
             },
             'drag':function(event,ui) {
               cur_coord_x = event.clientX;
               if(!(cur_coord_x-$(".blank").width()/2 > coords.x1 && cur_coord_x+$(".blank").width()/2 < coords.x2)) {
                   ui.position = pos;
                   return;
               }
                if(Math.abs(cur_coord_x-start_coord_x) > ($(".blank").width() +  margins) * 0.3) {
                    var i_blank = $(".container div").index($(".blank")),
                            i_elem = $(".container div").index($(this));
                        
                         
                        var temp = array[i_elem];
                        
                        array[i_elem] = array[i_blank];
                        array[i_blank] = temp;
                        
                        
                        if (update()) {
                            alert("win");
                        }
                }
             },
         });
           var order = true;
          for (var i = 0; i < array.length-1;i++) {
              if(array[i]!= i + 1) {
               order = false;
               break;
               }
          }
          if (order) return true;
          
          
      }   
         
         
         
         
         
         
         
       var array = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].sort(function() {return Math.random() - 0.5 }).concat(0);
      if(!valid_array(array)) {
           var t = array[0];
         array[0] = array[1];
         array[1] = t;
      }
       array.forEach(function(chislo,i) {
           $(".container span").eq(i).text(chislo);
           if (chislo == 0) {
               $(".container div").eq(i).addClass("blank");
           }
           if (chislo >=10) {
               $(".container span").eq(i).addClass("double");
           }
       });
         var coords = identify_elems();
         var start_coord_y,cur_coord_y,start_coord_x,cur_coord_x;
         var pos = {};
         $(".container").droppable({
            'accept':'.draggable-verical,.draggable-horizontal',
            
             
         });
         var new_to_blank;
         $('.draggable-vertical').draggable({
             'containment':'parent',
             'axis':'y',
             'start':function(event,ui) {
                  
                  start_coord_y = event.clientY;
                   pos.top = parseInt($(this).css("top"));
                  
                  pos.left = parseInt($(this).css("left"));
                 
             },
             'drag':function(event,ui) {
                 // event.stopPropagation();
                  cur_coord_y = event.clientY;
                 
                  
                     
                    if(!(cur_coord_y-$(".blank").width()/2 > coords.y1 && cur_coord_y+$(".blank").width()/2 < coords.y2)) {
                       
                        ui.position = pos;
                        
                        return;
                    }
                     
                    if(Math.abs(cur_coord_y-start_coord_y) > ($(".blank").width() +  margins) * 0.3) {
                       
                        var i_blank = $(".container div").index($(".blank")),
                            i_elem = $(".container div").index($(this));
                        
                         
                        var temp = array[i_elem];
                        
                        array[i_elem] = array[i_blank];
                        array[i_blank] = temp;
                        
                        
                        if (update()) {
                            alert("win");
                        }
                    }
                 }
             ,
             
         })
         
         $('.draggable-horizontal').draggable( {
            'containment':'parent',
             'axis':'x',
             'start':function(event,ui){
               start_coord_x = event.clientX; 
               pos.top = parseInt($(this).css("top"));
               pos.left = parseInt($(this).css("left"));
             },
             'drag':function(event,ui) {
               cur_coord_x = event.clientX;
               if(!(cur_coord_x-$(".blank").width()/2 > coords.x1 && cur_coord_x+$(".blank").width()/2 < coords.x2)) {
                   ui.position = pos;
                   return;
               }
                if(Math.abs(cur_coord_x-start_coord_x) > ($(".blank").width() +  margins) * 0.3) {
                    var i_blank = $(".container div").index($(".blank")),
                            i_elem = $(".container div").index($(this));
                        
                         
                        var temp = array[i_elem];
                        
                        array[i_elem] = array[i_blank];
                        array[i_blank] = temp;
                        
                        
                        if (update()) {
                            alert("win");
                        }
                }
             },
         })
        });