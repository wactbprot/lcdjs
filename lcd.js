/**
 * A js lcd try
 *
 * @autor wactbprot <thsteinbock@web.de>
 */


// Define some device constants

var lcd_width = 20,   // Maximum characters per line
lcd_chr = true,
    lcd_cmd = false,
// Timing constants
E_PULSE = 50, // ms
E_DELAY = 50; // ms

var lcd_line = new Buffer(4);
lcd_line[0] = 0x80; // LCD RAM address for the 1st line
lcd_line[1] = 0xC0; // LCD RAM address for the 2nd line
lcd_line[2] = 0x94; // LCD RAM address for the 3rd line
lcd_line[3] = 0xD4; // LCD RAM address for the 4th line

var filter = new Buffer(4);
filter[0] = 0x10;
filter[1] = 0x20;
filter[2] = 0x30;
filter[3] = 0x40;

var init = new Buffer(6);
init[0] = 0x33;
init[1] = 0x32;
init[2] = 0x28;
init[3] = 0x0C;
init[4] = 0x06;
init[5] = 0x01;

var gpio = require('gpio');
// Define GPIO to LCD mapping
// here we use raspberry pi numering
// not BCM
var lcd_e  = gpio.export(8,
                         {direction: 'out',
                          ready: function() {
                              console.log("go for 10");
                          }});
var lcd_rs = gpio.export(7,
                         {direction: 'out',
                          ready: function() {
                              console.log("go for 7");
                          }});


var lcd_d23 = gpio.export(23,
                          {direction: 'out',
                           ready: function() {
                               console.log("go for 23");
                           }});

var lcd_d24 = gpio.export(24,
                          {direction: 'out',
                           ready: function() {
                               console.log("go for 24");
                           }});


var lcd_d25 = gpio.export(25,
                          {direction: 'out',
                           ready: function() {
                               console.log("go for 25");
                           }})

var lcd_d18 = gpio.export(18,
                          {direction: 'out',
                           ready: function() {
                               console.log("go for 18");
                           }});


var lcd_init = function(cbfn){
    lcd_byte(init[0],lcd_cmd,
             function(){
                 lcd_byte(init[1],lcd_cmd,
                          function(){
                              lcd_byte(init[2],lcd_cmd,
                                       function(){
                                           lcd_byte(init[3],lcd_cmd,
                                                    function(){
                                                        lcd_byte(init[4],lcd_cmd,
                                                                 function(){
                                                                     lcd_byte(init[5],lcd_cmd, cbfn)
                                                                 }
                                                                )
                                                    }
                                                   )
                                       }
                                      )
                          }
                         )
             }
            )
};


var lcd_byte = function(bits, mode, cbfn){

    var fn1 = function(){
        console.log("1");
        if(mode){
            lcd_rs.set();
        }else{
            lcd_rs.set(0);
        }
    };

    var fn25 = function(){
        console.log("25");
        // High bits
        lcd_d23.set(0);
        console.log("reset d23");
        lcd_d24.set(0);
        console.log("reset d24");
        lcd_d25.set(0);
        console.log("reset d25");
        lcd_d18.set(0);
        console.log("reset d18");
        if((bits & filter[0]) === filter[0]){
            lcd_d23.set();
            console.log("set d23");
        }
        if((bits & filter[1]) === filter[1]){
            lcd_d24.set();
            console.log("set d24");

        }
        if((bits & filter[2]) === filter[2]){
            lcd_d25.set();
            console.log("set d25");
        }
        if((bits & filter[3]) === filter[3]){
            lcd_d18.set();
            console.log("set d18");
        }
    }


    var fn36 = function(){
        console.log("36");
        lcd_e.set();
    }

    var fn47 = function(){
        console.log("47");
        lcd_e.set(0);
    }

   setTimeout(function(){
                 fn1();

                setTimeout(function(){
                            fn25();

                           setTimeout(function(){
                                      fn36();

                                   setTimeout(function(){
                                                 fn47();

                                               setTimeout(function(){
                                                           fn25();

                                                          setTimeout(function(){
                                                                      fn36();

                                                                      to7 =   setTimeout(function(){
                                                                                  fn47();

                                                                                  if(typeof cbfn == 'function'){
                                                                                      console.log("got a cb");
                                                                                      cbfn();
                                                                                  }else{
                                                                                      console.log("ok");
                                                                                  }
                                                                              },E_DELAY);
                                                                  },E_DELAY);
                                                       },E_DELAY);
                                             },E_DELAY);
                                  },E_DELAY);
                        },E_DELAY);
             }, E_DELAY);

};//lcd_byte


setTimeout(lcd_init, 500);
