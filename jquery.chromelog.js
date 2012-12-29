(function($) {
  "use strict";

  var rstack = /^    at (?:.* \()?(.*):(.*?):.*?\)?$/;

  var fix = function(x, length) {
    // Distinguish +0 and -0
    var normalized = ((1 / x) > 0 ? x : length + x);

    return normalized < 0 ? 0
         : normalized > length ? length
         : normalized;
  };

  var printf = function(str) {
    var args = arguments;
    var i = 1;
    return str.replace(/%/g, function() {
      return args[i++];
    });
  };

  var logReady = $.Callbacks("once memory");
  $(function() {
    setTimeout(logReady.fire, 0);
  });

  var defaults = {
    range: [0, -0],
    inline: true,
    group: false,
    source: true
  };

  var history = {};

  $.fn.log = $.extend(function(tag, options) {
    var $this = this;
    var length = $this.length;

    if(arguments.length === 1) {
      options = tag;
      tag = null;
    }

    options = $.extend({}, defaults, options);

    if(!options.inline && !options.group) {
      console.error("jquery.chromelog: Non-inline logging must use group");
      return;
    }

    var min = fix(options.range[0], length);
    var max = fix(options.range[1], length);
    if(min >= max) {
      min = max = 0;
    }

    var $this_partial = $this.slice(min, max);

    var headers = [ printf("jQuery[%]", length) ];

    if(tag != null) {
      headers[0] = printf("%: %", tag, headers[0]);
      history[tag] = $this;
    }

    if(options.source) source: {
      var stackData = new Error().stack.split("\n");
      if(!stackData[2]) break source;

      var match = stackData[2].match(rstack);
      if(!match) break source;

      var location = match.slice(1).join(":");
      headers.push(" ", location);
    }

    logReady.add(function() {
      if(options.group) {
        var func = (options.group === "collapsed" ? "groupCollapsed" : "group");
        console[func].apply(console, headers);
      }

      if(options.inline) {
        var toLog = $this_partial.toArray();

        if(min !== 0) {
          toLog.unshift( printf("(+%)", min) );
        }
        if(max !== length) {
          toLog.push( printf("(+%)", length - max) );
        }

        for(var i = 1; i < toLog.length; i += 2) {
          toLog.splice(i, 0, ",");
        }

        toLog.unshift("[");
        toLog.push("]");

        if(!options.group) {
          if(tag != null) {
            toLog.unshift( printf("%:", tag) );
          }
          if(location) {
            toLog.push( printf("   %", location) );
          }
        }

        console.dirxml.apply(console, toLog);
      } else {
        if(min !== 0) {
          console.log( printf("(% more)", min) );
        }

        $this_partial.each(function() {
          console.dirxml(this);
        });

        if(max !== length) {
          console.log( printf("(% more)", length - max) );
        }
      }

      if(options.group) {
        console.groupEnd();
      }
    });

    return this;
  }, {
    defaults: defaults,
    history: history
  });
})(jQuery);
