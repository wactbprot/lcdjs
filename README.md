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

## provides

* ```lcd.setup(callback)``` sets the rasp pins as they should be
* ```lcd.ini(callback)```  initializes the lcd 
* ```lcd.write(string, callback)``` writes a string to the current line
* ```lcd.switchline(lineNumber, callback)``` switches the current line

## usage example

this makes your lcd device writable over http

```
#!/usr/bin/env node

var port   = 80,
    lcd    = require("lcdjs"),
    drest  = require("drest"),
    router = drest.createRouter(80,"0.0.0.0"),
    api    = {
        line: {
            write : function (handler) {
                var lineNumber = parseInt(handler.path.pop(),10) -1,
                    txt = unescape(handler.query.txt);
    console.log(lineNumber)
    console.log(txt)

	lcd.switchline(lineNumber,
        function(){
            setTimeout(function(){ 
			    lcd.write(txt);
                    },100)                       
                })
					
				
					handler.respond("<h1>wrote" +txt+"</h1>");
}
	}
		}    
	
	
		lcd.setup(lcd.ini);

router.addRoute(
    {
        method:"get",
        path:"line/{number}",
        action:api.line.write
    }
);

```

