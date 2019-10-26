var global = typeof window === 'object' && window.window === window
  ? window : typeof self === 'object' && self.self === self
  ? self
  : this

var Hook = {
    hooks: new Map(),

    register: (object, name, callback, blocking = false) => {
        (function(pointer) {
            object[name] = function() {
                const value = pointer.apply(this, arguments);
                const args = [value, arguments];
                Hook.hooks.set(name, callback.apply(this, args))
                if (!blocking) return value;
            };
        }(object[name]));
        global.Hook = Hook;
       return global.Hook;
    },

    remove: (name) => {
        const hook = Hook.hooks.get(name);
        if (hook !== undefined) {
            hook.delete();
            Hook.hooks.delete(name) ;
        }
    }
}; global.Hook = Hook;
