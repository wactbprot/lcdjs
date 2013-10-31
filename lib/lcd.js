/**
 * Configuration object which will be exported
 */
var rpio   = require('rpio');

var config = {
  /**
   * Maximum characters per line
   */
  width : 20,
  chr : true,
  cmd : false,
  /**
   * delay in ms
   */
  delay : 10,
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
exports.config  = config;
/**
 *
 * The set up initiates the raspi pins to be outputs.
 * ```rpio.setOutput()``` works synchronous.
 *
 * @param function call back function
 * @author @wactbprot
 */

var setup = function(cbfn){
  rpio.setOutput(config.e );
  rpio.setOutput(config.rs);
  rpio.setOutput(config.d4);
  rpio.setOutput(config.d5);
  rpio.setOutput(config.d6);
  rpio.setOutput(config.d7);

  if(typeof cbfn == 'function'){
    cbfn();
  } else{
    return true;
  };
};
exports.setup  = setup;

/**
 *
 * Initializes the lcd.
 *
 * @param function call back function
 * @author @wactbprot
 */
var ini = function(cbfn){

  setbyte(
    config.init[0],config.cmd,
    function(){
      setbyte(
        config.init[1],config.cmd,
        function(){
          setbyte(
            config.init[2],config.cmd,
            function(){
              setbyte(
                config.init[3],config.cmd,
                function(){
                  setbyte(
                    config.init[4],config.cmd,
                    function(){
                      setbyte(
                        config.init[5],config.cmd,
                        cbfn
                      )
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
exports.ini    = ini;

/**
 *
 * The function who makes the work.
 *
 * @param bits a integer representation of the bit
 * pattern resp. the bit representation of a character
 * @param mode a boolean value saying if a command or data are applied
 * @param function call back function
 * @author @wactbprot
 */
var setbyte = function(bits, mode, cbfn){

  var fn1 = function(){

    if(mode){
      rpio.write(config.rs, rpio.HIGH);

    }else{
      rpio.write(config.rs, rpio.LOW);
    }
  }

  var fn2 = function(){
    // High bits
    rpio.write(config.d4, rpio.LOW);
    rpio.write(config.d5, rpio.LOW);
    rpio.write(config.d6, rpio.LOW);
    rpio.write(config.d7, rpio.LOW);

    if((bits & config.bitFilter[0]) == config.bitFilter[0]){
      rpio.write(config.d4, rpio.HIGH);
    }
    if((bits & config.bitFilter[1]) == config.bitFilter[1]){
      rpio.write(config.d5, rpio.HIGH);
    }
    if((bits & config.bitFilter[2]) == config.bitFilter[2]){
      rpio.write(config.d6, rpio.HIGH);
    }
    if((bits & config.bitFilter[3]) == config.bitFilter[3]){
      rpio.write(config.d7, rpio.HIGH);
    }
  };

  var fn5 = function(){
    // Low bits
    rpio.write(config.d4, rpio.LOW);
    rpio.write(config.d5, rpio.LOW);
    rpio.write(config.d6, rpio.LOW);
    rpio.write(config.d7, rpio.LOW);

    if((bits & config.bitFilter[4]) == config.bitFilter[4]){
      rpio.write(config.d4, rpio.HIGH);
    }
    if((bits & config.bitFilter[5]) == config.bitFilter[5]){
      rpio.write(config.d5, rpio.HIGH);
    }
    if((bits & config.bitFilter[6]) == config.bitFilter[6]){
      rpio.write(config.d6, rpio.HIGH);
    }
    if((bits & config.bitFilter[7]) == config.bitFilter[7]){
      rpio.write(config.d7, rpio.HIGH);
    }
  };


  var fn36 = function(){
    rpio.write(config.e, rpio.HIGH);
  }

  var fn47 = function(){
    rpio.write(config.e, rpio.LOW);
  }

  var fnArr = [fn1,
               fn2,
               fn36,
               fn47,
               fn5,
               fn36,
               fn47];

  if(typeof cbfn == 'function'){
    fnArr.push(cbfn);
  }else{
    fnArr.push(
      function(){
        setTimeout(
          function(){return true;}
        ,config.delay)
      }
    )
  }

  var mN = fnArr.length,
      i  = 0;

  var f = setInterval(function() {

            if (i == mN) {
              clearInterval(f);
            }else{
              fnArr[i]();
            }
            i = i + 1;
          }, config.delay);

};
exports.setbyte  = setbyte ;

/**
 *
 * Switches the lcd line for the next data.
 *
 * @param integer line number beginning with 0
 * @param function call back function
 * @author @wactbprot
 */

var switchline = function(l, cbfn){

  setbyte(config.line[l], config.cmd);
  if(typeof cbfn == 'function'){
    cbfn();
  }

}
exports.switchline  = switchline;


/**
 *
 * Writes a message to the current line
 *
 * @param stringmessage to write
 * @param function call back function
 * @author @wactbprot
 */

var write = function(msg, cbfn) {

  var T = 80,
      i      = 0,
      m     = msg.split(""),
      mN    = m.length;
  var f = setInterval(

    function() {

      if (i == mN || i == config.width ) {
        clearInterval(f);
        if(typeof cbfn == 'function'){
          cbfn();
        }
      }else{

        setbyte(m[i].charCodeAt(0), config.chr);
      }

      i = i+1;
    }, T);

};
exports.write = write;