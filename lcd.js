#!/usr/bin/env node
/**
  * A nodejs lcd try
  *
  * @autor wactbprot <thsteinbock@web.de>
 */


lcd_setup(
    lcd_init
);



setTimeout(function(){
    lcd_toline(0,
               function(){lcd_string("node.js server up and running",
                                    function(){lcd_toline(1,
                                                          lcd_string("I'm the Doctor!")
                                                         )
                                              }
                                   )
                         }
              )
}, 5000)
