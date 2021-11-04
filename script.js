// sequence taken from http://huntergregal.com/
var input = `
ls:....(Muestra lo que hay dentro de la carpeta)
Configure kernel options.........................(  OK  )
Setting clock: 1629907614438.....................(  OK  )
Testing presence of GPU..........................( FAIL )
SYSTEM BOOT COMPLETE.............................(  OK  )
`.trim();

var term = $('body').terminal(function() {
    return this.animation(async () => {
        var lines = input.split('\n');
        this.set_prompt('');
        for (let line of lines) {
            var parts = line.split(/(\.+)/);
            await this.typing('echo', 50, parts[1], { prompt: parts[0] });
            //await this.set_prompt(parts[0]).typing('enter', 50, parts[1]);
            this.update(-1, line);
            await this.delay(1000);
        }
        this.set_prompt('> ');
    });
}, {
    greetings: 'press enter to start the animation',
    keydown: () => animation ? false : undefined
});

$.terminal.new_formatter([/(\(\s+)OK(\s+\))/g, '$1[[;green;]OK]$2']);
$.terminal.new_formatter([/(\(\s+)FAIL(\s+\))/g, '$1[[;red;]FAIL]$2']);

var animation;
// INTERNALS TODO
(function() {
    function is_promise(object) {
        return object && typeof object === 'object' && typeof object.then === 'function';
    }

    function unpromise(value, fn) {
        if (is_promise(value)) {
            return value.then(fn);
        }
        return fn(value);
    }
    $.fn.animation = function(fn) {
        if (typeof fn === 'function') {
            animation = true;
            return unpromise(fn(), function() {
                animation = false;
            });
        }
    };
    $.fn.delay = function delay(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };
})();