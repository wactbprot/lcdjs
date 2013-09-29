/**
 * A js lcd try
 *
 * @autor wactbprot <thsteinbock@web.de>
 */


var gpio = require("pi-gpio");

// Define GPIO to LCD mapping
var
LCD_RS = 7,
LCD_E  = 8,
LCD_D4 = 25,
LCD_D5 = 24,
LCD_D6 = 23,
LCD_D7 = 18,
LED_ON = 15,
// Define some device constants
LCD_WIDTH = 20,   // Maximum characters per line
LCD_CHR = true,
LCD_CMD = false,

// Timing constants
E_PULSE = 0.00005,
E_DELAY = 0.00005,
LCD_LINE = new Buffer(4);

LCD_LINE[0] = 0x80; // LCD RAM address for the 1st line
LCD_LINE[1] = 0xC0; // LCD RAM address for the 2nd line
LCD_LINE[2] = 0x94; // LCD RAM address for the 3rd line
LCD_LINE[3] = 0xD4; // LCD RAM address for the 4th line
