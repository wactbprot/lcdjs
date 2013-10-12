 /**
 * A js lcd try
 *
 * @autor wactbprot <thsteinbock@web.de>
 */


// Define some device constants

var lcd = {
    width : 20   // Maximum characters per line
};


lcd.chr = true;
lcd.cmd = false;
// Timing constants
lcd.delay = 50; // ms

lcd.line =[
    128,
    192,
    148,
    212
];
// lcd.line = new Buffer(4);
// lcd.line[0] = 0x80; // LCD RAM address for the 1st line
// lcd.line[1] = 0xC0; // LCD RAM address for the 2nd line
// lcd.line[2] = 0x94; // LCD RAM address for the 3rd line
// lcd.line[3] = 0xD4; // LCD RAM address for the 4th line

lcd.filter = [
    16,
    32,
    48,
    64,
    1,
    2,
    4,
    8
];
// lcd.filter = new Buffer(4);
// lcd.filter[0] = 0x10;
// lcd.filter[1] = 0x20;
// lcd.filter[2] = 0x30;
// lcd.filter[3] = 0x40;
lcd.init = [
    51,
    50,
    40,
    12,
    6,
    1
];
// lcd.init = new Buffer(6);
// lcd.init[0] = 0x33;
// lcd.init[1] = 0x32;
// lcd.init[2] = 0x28;
// lcd.init[3] = 0x0C;
// lcd.init[4] = 0x06;
// lcd.init[5] = 0x01;
//
var rpio = require('rpio');

// Define GPIO to LCD mapping
// here we use raspberry pi numering
// not BCM
var lcd_e  = 8,
    lcd_rs = 7,
    lcd_d4 = 25,
    lcd_d5 = 24,
    lcd_d6 = 23,
    lcd_d7 = 18;




var lcd_setup = function(cbfn){
    rpio.setOutput(lcd_e );
    rpio.setOutput(lcd_rs);
    rpio.setOutput(lcd_d4);
    rpio.setOutput(lcd_d5);
    rpio.setOutput(lcd_d6);
    rpio.setOutput(lcd_d7);

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
            rpio.write(lcd_rs, rpio.HIGH);

        }else{
            console.log("receive a cmd");
            rpio.write(lcd_rs, rpio.LOW);
        }
    };

    var fn2 = function(){
        // High bits
        rpio.write(lcd_d4, rpio.LOW);
        rpio.write(lcd_d5, rpio.LOW);
        rpio.write(lcd_d6, rpio.LOW);
        rpio.write(lcd_d7, rpio.LOW);
        if((bits & lcd.filter[0]) == lcd.filter[0]){
            rpio.write(lcd_d4, rpio.HIGH);

        }
        if((bits & lcd.filter[1]) == lcd.filter[1]){
            rpio.write(lcd_d5, rpio.HIGH);
        }
        if((bits & lcd.filter[2]) == lcd.filter[2]){
            rpio.write(lcd_d6, rpio.HIGH);
        }
        if((bits & lcd.filter[3]) == lcd.filter[3]){
            rpio.write(lcd_d7, rpio.HIGH);
        }
    };

    var fn5 = function(){
        // High bits
        rpio.write(lcd_d4, rpio.LOW);
        rpio.write(lcd_d5, rpio.LOW);
        rpio.write(lcd_d6, rpio.LOW);
        rpio.write(lcd_d7, rpio.LOW);
        if((bits & lcd.filter[4]) == lcd.filter[4]){
            rpio.write(lcd_d4, rpio.HIGH);

        }
        if((bits & lcd.filter[5]) == lcd.filter[5]){
            rpio.write(lcd_d5, rpio.HIGH);
        }
        if((bits & lcd.filter[6]) == lcd.filter[6]){
            rpio.write(lcd_d6, rpio.HIGH);
        }
        if((bits & lcd.filter[7]) == lcd.filter[7]){
            rpio.write(lcd_d7, rpio.HIGH);
        }
    };


    var fn36 = function(){
        rpio.write(lcd_e, rpio.HIGH);
    }

    var fn47 = function(){

        rpio.write(lcd_e, rpio.LOW);
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

                            setTimeout(function(){
                                fn47();

                                if(typeof cbfn == 'function'){
                                    console.log("got a cb");
                                    cbfn();
                                }else{
                                    console.log("ok");
                                }
                            },lcd.delay);
                        },lcd.delay);
                    },lcd.delay);
                },lcd.delay);
            },lcd.delay);
        },lcd.delay);
    }, lcd.delay);

};//lcd_byte


setTimeout(lcd_init, 500);

setTimeout(function(){

    lcd_byte("a".charCodeAt(0), lcd.chr);
},10000)