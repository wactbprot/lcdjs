/**
  * A nodejs lcd try
  *
  * @autor wactbprot <thsteinbock@web.de>
 */

var rpio = require('rpio'),
    lcd = {
        /**
         * Maximum characters per line
           */
        width : 20,
        chr : true,
        cmd : false,
        /**
         * delay in ms
         */
        delay : 50,
        /**
         * The rpio package uses the
         * pin numbers [1:26] (e.g.
         * the 3.3V pin is 1 the 5V pin
         * is 2
         */
        e  : 24,
        rs : 26,
        d4 : 22,
        d5 : 18,
        d6 : 16,
        d7 : 12,
        bitFilter :[16, 32, 64, 128,
                 1, 2, 4, 8 ],
        line : [
            128, // 0x80; LCD RAM address for the 1st line
            192, // 0xC0; LCD RAM address for the 2nd line
            148, // 0x94; LCD RAM address for the 3rd line
            212  // 0xD4; LCD RAM address for the 4th line
        ],
        init : [
            51,    // lcd.init[0] = 0x33;
            50,    // lcd.init[1] = 0x32;
            40,    // lcd.init[2] = 0x28;
            12,    // lcd.init[3] = 0x0C;
            6,     // lcd.init[4] = 0x06;
            1      // lcd.init[5] = 0x01;
        ]
    };

var lcd_setup = function(cbfn){
    rpio.setOutput(lcd.e );
    rpio.setOutput(lcd.rs);
    rpio.setOutput(lcd.d4);
    rpio.setOutput(lcd.d5);
    rpio.setOutput(lcd.d6);
    rpio.setOutput(lcd.d7);

    if(typeof cbfn == 'function'){
        cbfn();
    }
};

var lcd_init = function(cbfn){
    lcd_byte(
        lcd.init[0],lcd.cmd,
        function(){
            lcd_byte(
                lcd.init[1],lcd.cmd,
                function(){
                    lcd_byte(
                        lcd.init[2],lcd.cmd,
                        function(){
                            lcd_byte(
                                lcd.init[3],lcd.cmd,
                                function(){
                                    lcd_byte(
                                        lcd.init[4],lcd.cmd,
                                        function(){
                                            lcd_byte(
                                                lcd.init[5],lcd.cmd, cbfn)
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

        if(mode){
            rpio.write(lcd.rs, rpio.HIGH);

        }else{
            rpio.write(lcd.rs, rpio.LOW);
        }
    };

    var fn2 = function(){
        // High bits
        rpio.write(lcd.d4, rpio.LOW);
        rpio.write(lcd.d5, rpio.LOW);
        rpio.write(lcd.d6, rpio.LOW);
        rpio.write(lcd.d7, rpio.LOW);

        if((bits & lcd.bitFilter[0]) == lcd.bitFilter[0]){
            rpio.write(lcd.d4, rpio.HIGH);
        }
        if((bits & lcd.bitFilter[1]) == lcd.bitFilter[1]){
            rpio.write(lcd.d5, rpio.HIGH);
        }
        if((bits & lcd.bitFilter[2]) == lcd.bitFilter[2]){
            rpio.write(lcd.d6, rpio.HIGH);
        }
        if((bits & lcd.bitFilter[3]) == lcd.bitFilter[3]){
            rpio.write(lcd.d7, rpio.HIGH);
        }
    };

    var fn5 = function(){
        // Low bits
        rpio.write(lcd.d4, rpio.LOW);
        rpio.write(lcd.d5, rpio.LOW);
        rpio.write(lcd.d6, rpio.LOW);
        rpio.write(lcd.d7, rpio.LOW);

        if((bits & lcd.bitFilter[4]) == lcd.bitFilter[4]){
            rpio.write(lcd.d4, rpio.HIGH);
        }
        if((bits & lcd.bitFilter[5]) == lcd.bitFilter[5]){
            rpio.write(lcd.d5, rpio.HIGH);
        }
        if((bits & lcd.bitFilter[6]) == lcd.bitFilter[6]){
            rpio.write(lcd.d6, rpio.HIGH);
        }
        if((bits & lcd.bitFilter[7]) == lcd.bitFilter[7]){
            rpio.write(lcd.d7, rpio.HIGH);
        }
    };


    var fn36 = function(){
        rpio.write(lcd.e, rpio.HIGH);
    }

    var fn47 = function(){

        rpio.write(lcd.e, rpio.LOW);
    }

    var fnArr = [fn1,fn2,fn36,fn47,fn5,fn36,fn47];

    if(typeof cbfn == 'function'){
        fnArr.push(cbfn);
    }

    var mN    = fnArr.length,
    i  = 0;
    var f = setInterval(function() {
                if (++i >= mN) {
                    clearInterval(f);
                }else{
                    fnArr[i]();
                }
            }, lcd.delay);

   // setTimeout(function(){
   //     fn1();
   //     setTimeout(function(){
   //         fn2();
   //         setTimeout(function(){
   //             fn36();
   //             setTimeout(function(){
   //                 fn47();
   //                 setTimeout(function(){
   //                     fn5();
   //                     setTimeout(function(){
   //                         fn36();
   //                         setTimeout(function(){
   //                             fn47();
   //                             setTimeout(function(){
   //                                 if(typeof cbfn == 'function'){
   //                                     cbfn();
   //                                 }
   //                             });
   //                         },lcd.delay);
   //                     },lcd.delay);
   //                 },lcd.delay);
   //             },lcd.delay);
   //         },lcd.delay);
   //     },lcd.delay);
   // }, lcd.delay);

};//lcd_byte

lcd_setup();


var lcd_toline = function(l, cbfn){

    lcd_byte(lcd.line[l], lcd.cmd);
    if(typeof cbfn == 'function'){
        cbfn();
    }

}


var lcd_sting = function(msg) {


    var T = 300,
        i      = 0,
        m     = msg.split(""),
        mN    = m.length;
        var f = setInterval(function() {
                    lcd_byte(m[i].charCodeAt(0), lcd.chr);
                    if (++i >= mN) {
                        clearInterval(f);
                    }
                }, T);

}


setTimeout(lcd_init, 1000)

setTimeout(function(){
    lcd_toline(1,
               function(){lcd_sting("I'm the Doctor!")})
}, 5000)
