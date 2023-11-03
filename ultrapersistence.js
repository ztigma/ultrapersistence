const fs = require('fs');
const path = require('path');

Object.prototype.persist = async function(filepath)
{
    let body = 
`module.exports = 
${JSON.stringify(this, null, 2)}`
    ;
    return await filepath.SAVE(body);
}
Array.prototype.LIST_TO_STRING = function(plus, minus) {
	var r = "";
	if (typeof plus === 'undefined') {
		for (var i = 0; i < this.length; i++) {
			if (i < this.length) {
				r += this[i];
			}
		}
	}
	else if (typeof minus === 'undefined') {
		for (var i = 0; i < this.length; i++) {
			if (i < this.length) {
				r += this[i] + plus;
			}
		}
	}
	else {
		for (var i = 0; i < this.length; i++) {
			if (i < this.length + minus) {
				r += this[i] + plus;
			}
		}
	}
	return r;
}
String.prototype.EXIST_PERSISTENCE = function(callback) 
{
	fs.stat
    (
        this.toString()
        ,
        function(err, stat) 
        {
            if (err == null) 
            {
                callback(true, stat);
            }
            else if (err.code === 'ENOENT') 
            {
                // el archivo no existe
                callback(false);
            }
            else 
            {
                //ha sucedido un error
                callback(undefined);
            }
        }
    );
}
String.prototype.SAVE = async function(data) 
{
    var t = this;
    var dir = this.split("/");
    var dirpath = dir.LIST_TO_STRING("/", -1);

    return new Promise
    (
        function(callback)
        {
            t.EXIST_PERSISTENCE
            (
                function(b) 
                {
                    if (b)
                    {

                    }
                    else 
                    {
                        fs.mkdirSync(dirpath, { recursive: true });
                    }
                    fs.writeFile
                    (
                        path.join(__dirname, t.toString())
                        ,
                        data
                        ,
                        function(ex) 
                        {
                            if (ex == null) 
                            {
                                callback(data)
                                return;
                            }
                            console.error(ex.toString());
                        }
                        ,
                        callback
                    );
                }
            );
        }
    );
}
String.prototype.LOAD = function() 
{
	console.log("LOAD:");
	console.log(this.toString());
	let pa = path.join(__dirname, this.toString());
	
	return new Promise
	(
		function(method)
		{
			try 
			{
				fs.readFile
				(
					pa
					,
					function(ex, data) 
					{
						if (data != null) 
						{
							console.log('cool! LOADED');
							method(data.toString());
						}
						else 
						{
							console.error("error: " + 'no data');
							method(undefined);
						}
					}
				);
				console.log("END LOAD:");
			}
			catch (ex) 
			{
				console.error("error: " + ex.toString());
				method(undefined);
			}
		}
	);
}