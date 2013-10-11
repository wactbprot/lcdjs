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
    64
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


var lcd_d4 = gpio.export(25,
                          {direction: 'out',
                           ready: function() {
                               console.log("go for 23");
                           }});

var lcd_d5 = gpio.export(24,
                          {direction: 'out',
                           ready: function() {
                               console.log("go for 24");
                           }});


var lcd_d6 = gpio.export(23,
                          {direction: 'out',
                           ready: function() {
                               console.log("go for 25");
                           }})

var lcd_d7 = gpio.export(18,
                          {direction: 'out',
                           ready: function() {
                               console.log("go for 18");
                           }});


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
        lcd_rs.set();
    }else{
        console.log("receive a cmd");
        lcd_rs.set(0);
    }
};

var fn25 = function(){
    console.log("25");
    // High bits
    lcd_d4.set(0);
    console.log("reset d23");
    lcd_d5.set(0);
    console.log("reset d24");
    lcd_d6.set(0);
    console.log("reset d25");
    lcd_d7.set(0);
    console.log("reset d18");
    if((bits & lcd.filter[0]) == lcd.filter[0]){
        lcd_d4.set();
        console.log("set d23");
    }
    if((bits & lcd.filter[1]) == lcd.filter[1]){
        lcd_d5.set();
        console.log("set d24");

    }
    if((bits & lcd.filter[2]) == lcd.filter[2]){
        lcd_d6.set();
        console.log("set d25");
    }
    if((bits & lcd.filter[3]) == lcd.filter[3]){
        lcd_d7.set();
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