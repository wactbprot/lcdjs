/**
 * A js lcd try
 *
 * @autor wactbprot <thsteinbock@web.de>
 */


var gpio = require('gpio'),
// Define GPIO to LCD mapping
// here we use raspberry pi numering
// not BCM
lcd_setup = function(cbfn){
    lcd_rs = gpio.export(11, 
		                     {direction: 'out',
		                      ready: function() {
		                          console.log("go for 11");
			                        lcd_e  = gpio.export(10, {direction: 'out',
						                                            ready: function() {
							                                              console.log("go for 10");
							                                              lcd_d4 = gpio.export(4,  {direction: 'out',
										                                                                  ready: function() {
										                                                                      console.log("go for 6");
										                                                                      lcd_d5 = gpio.export(5,  {direction: 'out',
														                                                                                        ready: function() {
														                                                                                            console.log("go for 5");
														                                                                                            lcd_d6 = gpio.export(6,  {direction: 'out',
																	                                                                                                                ready: function() {
																		                                                                                                                  console.log("go for 4");
														
																		                                                                                                                  lcd_d7 = gpio.export(1,  {direction: 'out',
																					                                                                                                                                      ready: function() {
																						                                                                                                                                        console.log("go for 1");
   																						                                                                                                                                      if(typeof cbfn == 'function'){
   																						                                                                                                                                          cbfn();
   																						                                                                                                                                      }else{
   																						                                                                                                                                          console.log("ok");
   																						                                                                                                                                          return true;
   																						                                                                                                                                      };
																						
																					                                                                                                                                      }});
																		                                                                                                                  
																	                                                                                                                }});
														                                                                                            
														                                                                                        }});
										                                                                      
										                                                                  }});
							                                              
						                                            }});
			                        
		                      }
		     });
};

// Define some device constants
var LCD_WIDTH = 20,   // Maximum characters per line
LCD_CHR = true,
LCD_CMD = false,
// Timing constants
E_PULSE = 1, // ms
E_DELAY = 1; // ms

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
  
  var lcd_init = function(cbfn){
     lcd_byte(init[0],LCD_CMD,
   	   function(){
   	       lcd_byte(init[1],LCD_CMD,
   			function(){
   			    lcd_byte(init[2],LCD_CMD,
   				     function(){
   					 lcd_byte(init[3],LCD_CMD,  
   						  function(){
   						      lcd_byte(init[4],LCD_CMD,
   							       function(){
   								   lcd_byte(init[5],LCD_CMD, cbfn)}
   							      )}
   						 )}
   				    )}
   		       )}
   	  );  
   
   
   };
//   
   var lcd_byte = function(bits, mode, cbfn){
       //   Send byte to data pins
       //   bits = data
       //   mode = True  for character
       //          False for command
   
       var fn1 = function(){
           //console.log("1");
   	// RS
   	if(mode){
               lcd_rs.set();
   	}else{
               lcd_rs.reset();
   	}   
       }
   
       var fn25 = function(){
           //console.log("25");
           // High bits
           lcd_d4.reset();
           lcd_d5.reset();
           lcd_d6.reset();
           lcd_d7.reset();
   
           if( bits&filter[0]==filter[0]){
               lcd_d4.set();
           }
   
           if( bits&filter[1]==filter[1]){
               lcd_d5.set();
           }
   
           if( bits&filter[2]==filter[2]){
               lcd_d6.set();
           }
   
           if( bits&filter[3]==filter[3]){
               lcd_d7.set();
           }
       }
   
       //Toggle 'Enable' pin
   
       //time.sleep(E_DELAY)
       var fn36 = function(){
          // console.log("36");
           lcd_e.set();
       }
       //time.sleep(E_PULSE)
       var fn47 = function(){
          // console.log("47");
          lcd_e.reset();
       }
       // time.sleep(E_DELAY)
//       
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
   				   cbfn();
   			       }else{
   				   console.log("ok");
   				   return true;
   			       };
   			   },E_DELAY);
                          },E_DELAY);
                      },E_DELAY);
                  },E_DELAY);
              },E_DELAY);
          },E_DELAY);
       }, E_DELAY);
   }
      
   
  lcd_setup();
