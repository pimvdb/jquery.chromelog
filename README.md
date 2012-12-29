jquery.chromelog
---

`jquery.chromelog` brings back the old style logging of jQuery objects in
Chrome.

Usage
---
Instead of `console.log($foo)`, use `$foo.log()`.

By default, `.log` will mimic the old style logging as much as possible. There
is also other functionality available for convenience:

`.log([tag], [options])`

 - `tag`: A string that will appear in the log, so that you can easily identify
   multiple logs. Additionally, when using `tag`, the last set logged with a
   certain tag is stored at `$.fn.log.history[tag]`.

 - `options`: An object with the following properties (default options can be
   set in `$.fn.log.defaults`):

   - `inline`: Whether or not to log the jQuery object on one line:
     - `true`: The object will be logged as an array on one line (like Chrome
       did previously).
     - `false`: Each element will be logged on its own line (requires `group`
       not to be `false`).

   - `group`: A boolean indicating a console group:
     - `true`: an expanded group in the console will be made that you can
       collapse.
     - `"collapsed"`: Like `true`, but the group will be collapsed initially.
     - `false`: No group.

   - `source`: Whether the source location of the `.log` call will be logged.

   - `range`: An array of two indices to slice the logged array. Negative values
     count from the end, with `-0` meaning the length. So e.g. `[0, -0]` will
     log the whole jQuery object, and `[1, -2]` will log the whole object except
     the first and last two elements.
