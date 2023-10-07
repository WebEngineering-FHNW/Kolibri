/**
 * Copyright © 2008 by Ross Harmes and Dustin Diaz, see INTERFACE-LICENSE.txt
 */

export { KolibriInterface }

// Constructor.
const KolibriInterface = class {
    constructor(name, methods) {
        if(arguments.length !== 2) {
            throw new Error("Interface constructor called with " + arguments.length
                + "arguments, but expected exactly 2.");
        }

        this.name = name;
        this.methods = [];
        for(let i = 0; i < methods.length; i++) {
            if(typeof methods[i] !== 'string') {
                throw new Error("Interface constructor expects method names to be "
                    + "passed in as a string.");
            }
            this.methods.push(methods[i]);
        }
    }

    static ensureImplements(object) {
        if(arguments.length < 2) {
            throw new Error("Function Interface.ensureImplements called with " +
                arguments.length  + "arguments, but expected at least 2.");
        }

        for(let i = 1; i < arguments.length; i++) {
            const interfaceInstance = arguments[i];
            if(interfaceInstance.constructor !== KolibriInterface) {
                throw new Error("Function Interface.ensureImplements expects arguments "
                    + "two and above to be instances of Interface.");
            }

            for(let j = 0; j < interfaceInstance.methods.length; j++) {
                const method = interfaceInstance.methods[j];
                if(!object[method] || typeof object[method] !== 'function') {
                    throw new Error("Function Interface.ensureImplements: object "
                        + "does not implement the " + interfaceInstance.name
                        + " interface. Method " + method + " was not found.");
                }
            }
        }
    }
};

