```
   __       __  _   
  / /______/ / (_)__
 / / __/ _  / / (_-<
/_/\__/\_,_/_/ /___/
          |___/     
```
## lcdjs

Provides some functions for a nodejs-raspi-lcd
arrangment. By now it works with a 20x4 LCD 
compatible with the Hitachi HD44780 LCD controller.
 
I widely followed:

http://www.raspberrypi-spy.co.uk/2012/08/20x4-lcd-module-control-using-python/

The code below ```lib/utils.js``` is a rewrite of the python code; THX to Matt Hawkins

For setting the raspi pins high and low I tested some gpio modules 
I found on http://npmjs.org. 

The one I use is rpio by  [jperkin](https://npmjs.org/~jperkin). THX to him too. 
Infrastructure for configuring other lcd-types will be provided (if
needed; open a issue).  