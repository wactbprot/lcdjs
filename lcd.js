/**
  * A js lcd try
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
        d7 : 12
    };
/**
 * lcd.line[0] = 0x80; // LCD RAM address for the 1st line
 * lcd.line[1] = 0xC0; // LCD RAM address for the 2nd line
 * lcd.line[2] = 0x94; // LCD RAM address for the 3rd line
 * lcd.line[3] = 0xD4; // LCD RAM address for the 4th line
 *
 */
lcd.line =[
    128,
    192,
    148,
    212
];

/**
 *  lcd.filter[0] = 0x10;
 *  lcd.filter[1] = 0x20;
 *  lcd.filter[2] = 0x30;
 *  lcd.filter[3] = 0x40;
 *
 */
lcd.filter = [
    16,
    32,
    64,
    128,
    1,
    2,
    4,
    8
];
/**
 *  lcd.init[0] = 0x33;
 *  lcd.init[1] = 0x32;
 *  lcd.init[2] = 0x28;
 *  lcd.init[3] = 0x0C;
 *  lcd.init[4] = 0x06;
 *  lcd.init[5] = 0x01;
 */
lcd.init = [
    51,
    50,
    40,
    12,
    6,
    1
];

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
            console.log("receive a char");
            rpio.write(lcd.rs, rpio.HIGH);

        }else{
            console.log("receive a cmd");
            rpio.write(lcd.rs, rpio.LOW);
        }
    };

    var fn2 = function(){
        // High bits
        rpio.write(lcd.d4, rpio.LOW);
        rpio.write(lcd.d5, rpio.LOW);
        rpio.write(lcd.d6, rpio.LOW);
        rpio.write(lcd.d7, rpio.LOW);

        if((bits & lcd.filter[0]) == lcd.filter[0]){
            rpio.write(lcd.d4, rpio.HIGH);
        }
        if((bits & lcd.filter[1]) == lcd.filter[1]){
            rpio.write(lcd.d5, rpio.HIGH);
        }
        if((bits & lcd.filter[2]) == lcd.filter[2]){
            rpio.write(lcd.d6, rpio.HIGH);
        }
        if((bits & lcd.filter[3]) == lcd.filter[3]){
            rpio.write(lcd.d7, rpio.HIGH);
        }
    };

    var fn5 = function(){
        // Low bits
        rpio.write(lcd.d4, rpio.LOW);
        rpio.write(lcd.d5, rpio.LOW);
        rpio.write(lcd.d6, rpio.LOW);
        rpio.write(lcd.d7, rpio.LOW);

        if((bits & lcd.filter[4]) == lcd.filter[4]){
            rpio.write(lcd.d4, rpio.HIGH);
        }
        if((bits & lcd.filter[5]) == lcd.filter[5]){
            rpio.write(lcd.d5, rpio.HIGH);
        }
        if((bits & lcd.filter[6]) == lcd.filter[6]){
            rpio.write(lcd.d6, rpio.HIGH);
        }
        if((bits & lcd.filter[7]) == lcd.filter[7]){
            rpio.write(lcd.d7, rpio.HIGH);
        }
    };


    var fn36 = function(){
        rpio.write(lcd.e, rpio.HIGH);
    }

    var fn47 = function(){

        rpio.write(lcd.e, rpio.LOW);
    }


    setTimeout(function(){
        fn1();

        setTimeout(function(){
            fn2();

            setTimeout(function(){
                fn36();

                setTimeout(function(){
                    fn47();

                    setTimeout(function(){
                        fn5();

                        setTimeout(function(){
                            fn36();

                            setTimeout(function(){
                                fn47();
                                setTimeout(function(){
                                    if(typeof cbfn == 'function'){
                                        cbfn();
                                    }
                                });
                            },lcd.delay);
                        },lcd.delay);
                    },lcd.delay);
                },lcd.delay);
            },lcd.delay);
        },lcd.delay);
    }, lcd.delay);

};//lcd_byte

lcd_setup();




var lcd_sting = function(text) {


    var period = 500,
        i      = 0,
        ta     = text.split(""),
        Nta    = ta.length;

    var interval = setInterval(function() {
                       lcd_byte(ta[i].charCodeAt(0), lcd.chr);
                       if (++i >= Nta) {
                           clearInterval(interval);
                       }
                   }, period);
}

setTimeout(lcd_init, 1000)

setTimeout(function(){
                     lcd_sting("Hallo Werner")
                 }, 5000)
