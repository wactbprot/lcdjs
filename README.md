```
   __       __  _   
  / /______/ / (_)__
 / / __/ _  / / (_-<
/_/\__/\_,_/_/ /___/
          |___/     
```

Provides 4 functions for a nodejs-raspi-lcd
arrangment. By now it works with a 20x4 Hitachi compatible LCD.
 
I widely followed the blog post [20x4 lcd module control using python](http://www.raspberrypi-spy.co.uk/2012/08/20x4-lcd-module-control-using-python/)

The code below ```lib/lcd.js``` is a nodejs  rewrite. THX to Matt Hawkins

The raspi pins are controlled by [rpio](https://npmjs.org/package/rpio)
written by  [jperkin](https://npmjs.org/~jperkin). THX to him too. 

Infrastructure for configuring other lcd-types will be provided if needed.
Don't hesitate, open a
[issue on github](https://github.com/wactbprot/lcdjs/issues)

## The 4 functions are

* ```lcd.setup```
* ```lcd.ini```
* ```lcd.write```
* ```lcd.switchline```

## usage

```var lcd = require("lcdjs")```

```lcd.setup(lcd.ini)```

```lcd.write("bad wolf")```
