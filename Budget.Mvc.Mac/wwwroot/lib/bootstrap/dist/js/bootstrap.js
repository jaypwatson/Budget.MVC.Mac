/*!
  * Bootstrap v5.1.0 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core')) :
  typeof define === 'function' && define.amd ? define(['@popperjs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory(global.Popper));
}(this, (function (Popper) { 'use strict';

  /**
   * Interoperates with a module namespace object.
   * This function checks if the provided object is an ES module and returns it as a namespace object.
   * If the object is not an ES module, it creates a new object that contains all properties of the original object,
   * except for the 'default' property, which is added as a frozen property.
   *
   * @param {Object} e - The module object to be interoperated.
   * @returns {Object} A namespace object that contains all properties of the original object,
   *                  along with a 'default' property pointing to the original object.
   *
   * @throws {TypeError} Throws a TypeError if the provided argument is not an object.
   *
   * @example
   * const myModule = { foo: 'bar', default: 'baz' };
   * const namespace = _interopNamespace(myModule);
   * console.log(namespace.foo); // 'bar'
   * console.log(namespace.default); // { foo: 'bar', default: 'baz' }
   */
  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  /**
   * Determines the type of the given object.
   *
   * This function checks if the input is null or undefined and returns a string representation of it.
   * For other types, it uses the `Object.prototype.toString` method to identify the type and returns it in lowercase.
   *
   * @param {*} obj - The object whose type is to be determined. Can be any value, including null or undefined.
   * @returns {string} The lowercase string representation of the object's type.
   *
   * @example
   * toType(null); // "null"
   * toType(undefined); // "undefined"
   * toType(123); // "number"
   * toType("hello"); // "string"
   * toType([]); // "array"
   * toType({}); // "object"
   *
   * @throws {TypeError} Throws a TypeError if the input is not a valid object type.
   */
  const toType = obj => {
    if (obj === null || obj === undefined) {
      return `${obj}`;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  };


  /**
   * Generates a unique identifier (UID) by appending a random number to a given prefix.
   * The function ensures that the generated UID does not already exist in the document.
   *
   * @param {string} prefix - The initial string to which a random number will be appended.
   * @returns {string} A unique identifier that does not conflict with existing IDs in the document.
   *
   * @throws {Error} Throws an error if the prefix is not a string.
   *
   * @example
   * const uniqueId = getUID('user-');
   * console.log(uniqueId); // Outputs a unique ID like 'user-123456'
   */
  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));

    return prefix;
  };

  /**
   * Retrieves a valid CSS selector from a given HTML element.
   * The function first checks for a `data-bs-target` attribute on the element.
   * If that attribute is not present or is set to '#', it then checks the `href` attribute.
   * Valid selectors are expected to be either IDs (starting with '#') or classes (starting with '.').
   * If a full URL is provided in the `href`, it will extract the anchor part as a selector.
   *
   * @param {HTMLElement} element - The HTML element from which to retrieve the selector.
   * @returns {string|null} - Returns a valid CSS selector as a string, or null if no valid selector is found.
   *
   * @example
   * const button = document.querySelector('button');
   * const selector = getSelector(button);
   * console.log(selector); // Outputs the selector if valid, otherwise null.
   *
   * @throws {TypeError} - Throws an error if the provided element is not an instance of HTMLElement.
   */
  const getSelector = element => {
    let selector = element.getAttribute('data-bs-target');

    if (!selector || selector === '#') {
      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
      // `document.querySelector` will rightfully complain it is invalid.
      // See https://github.com/twbs/bootstrap/issues/32273

      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
        return null;
      } // Just in case some CMS puts out a full URL with the anchor appended


      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
        hrefAttr = `#${hrefAttr.split('#')[1]}`;
      }

      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
    }

    return selector;
  };

  /**
   * Retrieves a CSS selector for a given DOM element and checks if it is valid.
   *
   * This function attempts to generate a CSS selector from the provided element
   * using the `getSelector` function. If a valid selector is generated, it checks
   * if the selector matches any element in the document. If a match is found,
   * the selector is returned; otherwise, null is returned.
   *
   * @param {Element} element - The DOM element for which to retrieve the selector.
   * @returns {string|null} The CSS selector if valid and matches an element in the document; otherwise, null.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const selector = getSelectorFromElement(element);
   * console.log(selector); // Outputs the selector or null if not valid.
   *
   * @throws {TypeError} Throws an error if the provided argument is not a valid DOM element.
   */
  const getSelectorFromElement = element => {
    const selector = getSelector(element);

    if (selector) {
      return document.querySelector(selector) ? selector : null;
    }

    return null;
  };

  /**
   * Retrieves a DOM element based on a provided selector derived from the input element.
   *
   * This function first obtains a selector string using the `getSelector` function.
   * If a valid selector is found, it uses `document.querySelector` to return the corresponding
   * DOM element. If no valid selector is found, it returns null.
   *
   * @param {Element} element - The DOM element from which to derive the selector.
   * @returns {Element|null} The first matching DOM element or null if no match is found.
   *
   * @example
   * const myElement = getElementFromSelector(someElement);
   * if (myElement) {
   *   console.log('Element found:', myElement);
   * } else {
   *   console.log('No matching element found.');
   * }
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
   */
  const getElementFromSelector = element => {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
  };

  /**
   * Calculates the total transition duration of a given DOM element.
   *
   * This function retrieves the computed styles for `transition-duration`
   * and `transition-delay` of the specified element, parses them, and
   * returns the sum of these values in milliseconds. If the element is
   * not provided or if both transition duration and delay are not set,
   * it returns 0.
   *
   * @param {Element} element - The DOM element for which to calculate
   * the transition duration. If no element is provided, the function
   * returns 0.
   *
   * @returns {number} The total transition duration in milliseconds.
   * Returns 0 if the element is null or if no transition duration or
   * delay is defined.
   *
   * @example
   * const duration = getTransitionDurationFromElement(document.querySelector('.my-element'));
   * console.log(duration); // Outputs the transition duration in milliseconds.
   */
  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
    } // Get transition-duration of the element


    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    } // If multiple durations are defined, take the first


    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };

  /**
   * Dispatches a transition end event on the specified DOM element.
   *
   * This function is useful for simulating the end of a CSS transition,
   * allowing for event listeners that are waiting for the transition end
   * to be triggered programmatically.
   *
   * @param {HTMLElement} element - The DOM element on which to dispatch the event.
   * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
   *
   * @example
   * const myElement = document.getElementById('myElement');
   * triggerTransitionEnd(myElement);
   */
  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };

  /**
   * Determines whether the provided object is a DOM element.
   *
   * This function checks if the input is an object and whether it has a
   * `nodeType` property, which is characteristic of DOM elements. If the
   * object is a jQuery object, it will check the first element in the
   * jQuery collection.
   *
   * @param {any} obj - The object to be checked.
   * @returns {boolean} Returns true if the object is a DOM element,
   *                    otherwise false.
   *
   * @example
   * const div = document.createElement('div');
   * console.log(isElement(div)); // true
   *
   * const notAnElement = {};
   * console.log(isElement(notAnElement)); // false
   *
   * const $jQueryObject = $('div');
   * console.log(isElement($jQueryObject)); // true
   *
   * @throws {TypeError} Throws a TypeError if the input is not an object.
   */
  const isElement = obj => {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
    }

    return typeof obj.nodeType !== 'undefined';
  };

  /**
   * Retrieves a DOM element or a jQuery object based on the provided input.
   *
   * This function checks if the input is a jQuery object or a DOM element.
   * If it is a jQuery object, it returns the first element in the jQuery collection.
   * If the input is a non-empty string, it attempts to find and return the corresponding
   * DOM element using `document.querySelector()`. If the input does not match any of these
   * criteria, it returns null.
   *
   * @param {Object|string} obj - The input to retrieve the element from. This can be a jQuery object,
   *                               a DOM element, or a string representing a CSS selector.
   * @returns {Element|null} - The corresponding DOM element if found, or null if not.
   *
   * @example
   * // Using a jQuery object
   * const element = getElement($('#myElement'));
   *
   * // Using a CSS selector string
   * const element = getElement('.my-class');
   *
   * // Passing an invalid input
   * const element = getElement(null); // returns null
   */
  const getElement = obj => {
    if (isElement(obj)) {
      // it's a jQuery object or a node element
      return obj.jquery ? obj[0] : obj;
    }

    if (typeof obj === 'string' && obj.length > 0) {
      return document.querySelector(obj);
    }

    return null;
  };

  /**
   * Validates the types of configuration properties for a given component.
   *
   * This function checks if the types of the provided configuration match the expected types defined in the configTypes object.
   * If a type mismatch is found, a TypeError is thrown with a descriptive message.
   *
   * @param {string} componentName - The name of the component for which the configuration is being validated.
   * @param {Object} config - The configuration object containing properties to be validated.
   * @param {Object} configTypes - An object defining the expected types for each property in the config.
   *
   * @throws {TypeError} Throws an error if any property in the config does not match its expected type.
   *
   * @example
   * const config = {
   *   title: 'My Component',
   *   isVisible: true,
   * };
   * const configTypes = {
   *   title: 'string',
   *   isVisible: 'boolean',
   * };
   *
   * typeCheckConfig('MyComponent', config, configTypes); // No error thrown
   *
   * const invalidConfig = {
   *   title: 123,
   *   isVisible: true,
   * };
   *
   * typeCheckConfig('MyComponent', invalidConfig, configTypes); // Throws TypeError
   */
  const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach(property => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    });
  };

  /**
   * Checks if a given DOM element is visible on the page.
   *
   * An element is considered visible if it is a valid DOM element,
   * has a non-zero size (i.e., it has client rectangles), and its
   * computed style for the 'visibility' property is set to 'visible'.
   *
   * @param {Element} element - The DOM element to check for visibility.
   * @returns {boolean} Returns true if the element is visible, otherwise false.
   *
   * @throws {TypeError} Throws an error if the provided argument is not a valid DOM element.
   *
   * @example
   * const myElement = document.getElementById('myElement');
   * const isMyElementVisible = isVisible(myElement);
   * console.log(isMyElementVisible); // true or false based on the visibility of the element
   */
  const isVisible = element => {
    if (!isElement(element) || element.getClientRects().length === 0) {
      return false;
    }

    return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
  };

  /**
   * Determines whether a given HTML element is disabled.
   *
   * This function checks if the provided element is valid and whether it has
   * the 'disabled' attribute or class. It returns true if the element is
   * either not an element node, has the 'disabled' class, or has the
   * 'disabled' attribute set to true.
   *
   * @param {HTMLElement} element - The HTML element to check for the disabled state.
   * @returns {boolean} Returns true if the element is disabled, otherwise false.
   *
   * @example
   * const button = document.querySelector('button');
   * const isButtonDisabled = isDisabled(button);
   * console.log(isButtonDisabled); // Outputs: true or false based on the button's state
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
   */
  const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }

    if (element.classList.contains('disabled')) {
      return true;
    }

    if (typeof element.disabled !== 'undefined') {
      return element.disabled;
    }

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  };

  /**
   * Recursively searches for the nearest ShadowRoot of a given element.
   *
   * This function checks if the provided element or any of its ancestors
   * contain a ShadowRoot. If the element is part of a shadow DOM, it will
   * return the ShadowRoot; otherwise, it will return null.
   *
   * @param {Element} element - The element from which to start the search for a ShadowRoot.
   * @returns {ShadowRoot|null} The nearest ShadowRoot if found, otherwise null.
   *
   * @throws {TypeError} Throws a TypeError if the provided element is not a valid Element.
   *
   * @example
   * const shadowHost = document.querySelector('#shadow-host');
   * const shadowRoot = findShadowRoot(shadowHost);
   * console.log(shadowRoot); // Logs the ShadowRoot or null if not found.
   */
  const findShadowRoot = element => {
    if (!document.documentElement.attachShadow) {
      return null;
    } // Can find the shadow root otherwise it'll return the document


    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }

    if (element instanceof ShadowRoot) {
      return element;
    } // when we don't find a shadow root


    if (!element.parentNode) {
      return null;
    }

    return findShadowRoot(element.parentNode);
  };

  /**
   * A no-operation function that does nothing when called.
   *
   * This function can be used as a placeholder or default callback
   * in situations where a function is required but no action is needed.
   *
   * @function noop
   * @returns {void} This function does not return any value.
   *
   * @example
   * // Using noop as a default callback
   * const callback = someCondition ? someFunction : noop;
   * callback();
   */
  const noop = () => {};
  /**
   * Trick to restart an element's animation
   *
   * @param {HTMLElement} element
   * @return void
   *
   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
   */


  const reflow = element => {
    // eslint-disable-next-line no-unused-expressions
    element.offsetHeight;
  };

  /**
   * Retrieves the jQuery object from the global window scope.
   *
   * This function checks if jQuery is available in the global scope and
   * whether the document body has a specific attribute that indicates
   * jQuery should not be used. If jQuery is present and the attribute
   * is not set, it returns the jQuery object; otherwise, it returns null.
   *
   * @returns {jQuery|null} The jQuery object if available, otherwise null.
   *
   * @example
   * const $ = getjQuery();
   * if ($) {
   *   // jQuery is available, proceed with jQuery operations
   * } else {
   *   // jQuery is not available or usage is disabled
   * }
   */
  const getjQuery = () => {
    const {
      jQuery
    } = window;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  const DOMContentLoadedCallbacks = [];

  /**
   * Registers a callback function to be executed when the DOM content has fully loaded.
   * If the DOM is already loaded, the callback is executed immediately.
   *
   * @param {Function} callback - The function to be called when the DOM content is loaded.
   *
   * @example
   * onDOMContentLoaded(() => {
   *   console.log('DOM fully loaded and parsed');
   * });
   *
   * @throws {TypeError} Throws an error if the provided callback is not a function.
   */
  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      // add listener on the first call when the document is in loading state
      if (!DOMContentLoadedCallbacks.length) {
        document.addEventListener('DOMContentLoaded', () => {
          DOMContentLoadedCallbacks.forEach(callback => callback());
        });
      }

      DOMContentLoadedCallbacks.push(callback);
    } else {
      callback();
    }
  };

  /**
   * Checks if the current document direction is set to right-to-left (RTL).
   *
   * This function inspects the `dir` attribute of the document's root element
   * to determine if it is set to 'rtl'. It is commonly used in applications
   * that need to support multiple languages, particularly those that are read
   * from right to left, such as Arabic or Hebrew.
   *
   * @returns {boolean} Returns true if the document direction is RTL, false otherwise.
   *
   * @example
   * if (isRTL()) {
   *   console.log('The document is in right-to-left mode.');
   * } else {
   *   console.log('The document is in left-to-right mode.');
   * }
   */
  const isRTL = () => document.documentElement.dir === 'rtl';

  /**
   * Defines a jQuery plugin by attaching it to the jQuery prototype.
   * This function ensures that the plugin can be used as a jQuery method
   * and provides a noConflict method to restore the original jQuery method
   * if needed.
   *
   * @param {Object} plugin - The plugin object containing the necessary
   *                          properties and methods for the jQuery plugin.
   * @param {string} plugin.NAME - The name of the plugin, which will be
   *                               used as the jQuery method name.
   * @param {Function} plugin.jQueryInterface - The function that will be
   *                                            called when the jQuery method
   *                                            is invoked.
   *
   * @throws {TypeError} Throws an error if the plugin object does not
   *                     contain the required properties.
   *
   * @example
   * const myPlugin = {
   *   NAME: 'myPlugin',
   *   jQueryInterface: function() {
   *     // Plugin functionality here
   *   }
   * };
   *
   * defineJQueryPlugin(myPlugin);
   *
   * // Usage in jQuery:
   * $('#element').myPlugin();
   *
   * // To restore the original jQuery method:
   * const originalMyPlugin = $.fn.myPlugin.noConflict();
   */
  const defineJQueryPlugin = plugin => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */

      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;

        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };

  /**
   * Executes a provided callback function if it is of type function.
   *
   * This function checks the type of the provided callback argument and
   * invokes it if it is a valid function. If the callback is not a function,
   * no action is taken.
   *
   * @param {Function} callback - The function to be executed.
   * @throws {TypeError} Throws an error if the callback is not a function.
   *
   * @example
   * // Example of a valid callback
   * execute(() => {
   *   console.log('Callback executed!');
   * });
   *
   * // Example of an invalid callback (no output)
   * execute('not a function');
   */
  const execute = callback => {
    if (typeof callback === 'function') {
      callback();
    }
  };

  /**
   * Executes a callback function after a CSS transition has completed on a specified element.
   * If the transition is not to be waited for, the callback is executed immediately.
   *
   * @param {Function} callback - The function to execute after the transition.
   * @param {Element} transitionElement - The DOM element on which the transition is applied.
   * @param {boolean} [waitForTransition=true] - A flag indicating whether to wait for the transition to complete before executing the callback.
   *
   * @throws {TypeError} Throws an error if `callback` is not a function or `transitionElement` is not a valid DOM element.
   *
   * @example
   * // Example usage:
   * const element = document.querySelector('.my-element');
   * executeAfterTransition(() => {
   *   console.log('Transition completed!');
   * }, element);
   *
   * @example
   * // Example without waiting for transition:
   * executeAfterTransition(() => {
   *   console.log('Executed immediately!');
   * }, element, false);
   */
  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    if (!waitForTransition) {
      execute(callback);
      return;
    }

    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    let called = false;

    /**
     * Handles the transition end event for a specified element.
     *
     * This function is triggered when a transition ends on the target element.
     * It checks if the event's target matches the specified transition element.
     * If it does, it marks the transition as called, removes the event listener,
     * and executes the provided callback function.
     *
     * @param {Object} event - The event object containing information about the transition end event.
     * @param {HTMLElement} event.target - The element that triggered the transition end event.
     *
     * @throws {Error} Throws an error if the target does not match the transition element.
     *
     * @example
     * const transitionElement = document.querySelector('.my-element');
     * const callback = () => console.log('Transition ended!');
     * transitionElement.addEventListener('transitionend', handler);
     */
    const handler = ({
      target
    }) => {
      if (target !== transitionElement) {
        return;
      }

      called = true;
      transitionElement.removeEventListener(TRANSITION_END, handler);
      execute(callback);
    };

    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(transitionElement);
      }
    }, emulatedDuration);
  };


  /**
   * Retrieves the previous or next element from a list based on the current active element.
   *
   * This function allows for cycling through the list if specified, and handles cases where the active element is not found.
   *
   * @param {Array} list - The list of elements to traverse.
   * @param {Element} activeElement - The currently active element in the list.
   * @param {boolean} shouldGetNext - A flag indicating whether to retrieve the next element (true) or the previous element (false).
   * @param {boolean} isCycleAllowed - A flag indicating whether cycling through the list is allowed when reaching the boundaries.
   * @returns {Element|undefined} The next or previous element in the list, or undefined if the list is empty.
   *
   * @example
   * const elements = ['a', 'b', 'c'];
   * const active = 'b';
   * const nextElement = getNextActiveElement(elements, active, true, true);
   * console.log(nextElement); // Outputs: 'c'
   *
   * @throws {Error} Throws an error if the list is not an array.
   */
  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
    let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed

    if (index === -1) {
      return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
    }

    const listLength = list.length;
    index += shouldGetNext ? 1 : -1;

    if (isCycleAllowed) {
      index = (index + listLength) % listLength;
    }

    return list[Math.max(0, Math.min(index, listLength - 1))];
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {}; // Events storage

  let uidEvent = 1;
  const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };
  const customEventsRegex = /^(mouseenter|mouseleave)/i;
  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

  /**
   * Generates a unique identifier for an event associated with a given element.
   *
   * This function checks if a user-defined unique identifier (uid) is provided.
   * If so, it constructs a new unique identifier by appending a counter to the uid.
   * If no uid is provided, it retrieves the existing uidEvent from the element or
   * generates a new one using an internal counter.
   *
   * @param {HTMLElement} element - The DOM element for which the unique identifier is being generated.
   * @param {string} [uid] - An optional user-defined unique identifier.
   * @returns {string} The generated unique identifier for the event.
   *
   * @throws {TypeError} Throws an error if the element is not a valid DOM element.
   *
   * @example
   * const button = document.querySelector('button');
   * const uniqueId = getUidEvent(button, 'myButton');
   * console.log(uniqueId); // Outputs: 'myButton::1' (or similar)
   */
  function getUidEvent(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }

  /**
   * Retrieves the event registry for a specified element.
   * If the element does not have a unique identifier, one is generated and assigned.
   * The event registry is stored in a global object, allowing for event management
   * across multiple elements.
   *
   * @param {HTMLElement} element - The DOM element for which to retrieve the event registry.
   * @returns {Object} The event registry associated with the specified element.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
   *
   * @example
   * const button = document.getElementById('myButton');
   * const registry = getEvent(button);
   * console.log(registry); // Outputs the event registry for the button element.
   */
  function getEvent(element) {
    const uid = getUidEvent(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }

  /**
   * Creates a bootstrap event handler that delegates the event to a specified element.
   *
   * This function returns a new event handler that, when invoked, sets the `delegateTarget`
   * property of the event to the specified element. If the handler is marked as one-off,
   * it will automatically remove itself after being called once.
   *
   * @param {HTMLElement} element - The element to which the event is delegated.
   * @param {Function} fn - The original event handler function to be called.
   * @returns {Function} A new event handler function that can be used with event listeners.
   *
   * @example
   * const button = document.querySelector('button');
   * const handleClick = (event) => {
   *   console.log('Button clicked!', event.delegateTarget);
   * };
   * const delegatedHandler = bootstrapHandler(button, handleClick);
   * button.addEventListener('click', delegatedHandler);
   *
   * @throws {TypeError} Throws an error if the provided element is not an HTMLElement.
   */
  function bootstrapHandler(element, fn) {
    return function handler(event) {
      event.delegateTarget = element;

      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
      }

      return fn.apply(element, [event]);
    };
  }

  /**
   * Creates a delegation handler for a specified element and selector.
   * This function returns a handler that listens for events on the specified element,
   * delegating the event handling to the specified function when the event target matches
   * the selector.
   *
   * @param {Element} element - The DOM element to which the event listener will be attached.
   * @param {string} selector - A selector string to filter the descendants of the element.
   * @param {Function} fn - The function to execute when the event is triggered on a matching target.
   *
   * @returns {Function} A handler function that can be used as an event listener.
   *
   * @example
   * const buttonHandler = bootstrapDelegationHandler(parentElement, '.child-button', function(event) {
   *   console.log('Button clicked:', event.delegateTarget);
   * });
   * parentElement.addEventListener('click', buttonHandler);
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
   */
  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);

      for (let {
        target
      } = event; target && target !== this; target = target.parentNode) {
        for (let i = domElements.length; i--;) {
          if (domElements[i] === target) {
            event.delegateTarget = target;

            if (handler.oneOff) {
              // eslint-disable-next-line unicorn/consistent-destructuring
              EventHandler.off(element, event.type, selector, fn);
            }

            return fn.apply(target, [event]);
          }
        }
      } // To please ESLint


      return null;
    };
  }

  /**
   * Searches for a specific event handler within a collection of events.
   *
   * This function iterates through the provided events and checks for a match
   * based on the original handler and an optional delegation selector. If a match
   * is found, the corresponding event object is returned; otherwise, null is returned.
   *
   * @param {Object} events - An object containing event data where each key is a unique identifier for an event.
   * @param {Function} handler - The event handler function to search for.
   * @param {string|null} [delegationSelector=null] - An optional selector string used for event delegation.
   *
   * @returns {Object|null} The event object if a match is found, or null if no match exists.
   *
   * @example
   * const events = {
   *   '1': { originalHandler: myHandler, delegationSelector: '.my-selector' },
   *   '2': { originalHandler: anotherHandler, delegationSelector: null }
   * };
   * const foundEvent = findHandler(events, myHandler, '.my-selector');
   * console.log(foundEvent); // Outputs the event object if found, or null if not.
   */
  function findHandler(events, handler, delegationSelector = null) {
    const uidEventList = Object.keys(events);

    for (let i = 0, len = uidEventList.length; i < len; i++) {
      const event = events[uidEventList[i]];

      if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
        return event;
      }
    }

    return null;
  }

  /**
   * Normalizes the parameters for event handling.
   *
   * This function processes the provided event type and handler, determining
   * if the handler is a delegation string or a direct function. It also checks
   * if the event type is a native event, adjusting the type accordingly.
   *
   * @param {string} originalTypeEvent - The original event type to be normalized.
   * @param {Function|string} handler - The event handler function or a delegation string.
   * @param {Function} delegationFn - The function to be used if the handler is a delegation string.
   *
   * @returns {[boolean, Function, string]} An array containing:
   *   - A boolean indicating if the handler is a delegation string.
   *   - The resolved event handler function.
   *   - The normalized event type.
   *
   * @throws {TypeError} Throws an error if the provided parameters are of incorrect types.
   *
   * @example
   * const [isDelegation, handlerFn, eventType] = normalizeParams('click', myHandler, myDelegationFn);
   */
  function normalizeParams(originalTypeEvent, handler, delegationFn) {
    const delegation = typeof handler === 'string';
    const originalHandler = delegation ? delegationFn : handler;
    let typeEvent = getTypeEvent(originalTypeEvent);
    const isNative = nativeEvents.has(typeEvent);

    if (!isNative) {
      typeEvent = originalTypeEvent;
    }

    return [delegation, originalHandler, typeEvent];
  }

  /**
   * Attaches an event handler to a specified element, with support for delegation and one-off execution.
   *
   * This function normalizes the event parameters and ensures that the handler is properly wrapped
   * for custom events like mouseenter and mouseleave to prevent unwanted event triggering.
   *
   * @param {HTMLElement} element - The DOM element to which the event handler will be attached.
   * @param {string} originalTypeEvent - The type of the event (e.g., 'click', 'mouseenter').
   * @param {Function} [handler] - The function to be executed when the event is triggered.
   * @param {Function} [delegationFn] - An optional delegation function for event delegation.
   * @param {boolean} [oneOff=false] - If true, the handler will be executed at most once after being added.
   *
   * @returns {void} This function does not return a value.
   *
   * @throws {TypeError} Throws an error if `originalTypeEvent` is not a string or if `element` is not provided.
   *
   * @example
   * // Example of adding a click event handler
   * addHandler(document.getElementById('myButton'), 'click', function(event) {
   *   console.log('Button clicked!');
   * });
   *
   * @example
   * // Example of adding a one-off mouseenter event handler
   * addHandler(document.getElementById('myDiv'), 'mouseenter', function(event) {
   *   console.log('Mouse entered!');
   * }, null, true);
   */
  function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }

    if (!handler) {
      handler = delegationFn;
      delegationFn = null;
    } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does


    if (customEventsRegex.test(originalTypeEvent)) {
      /**
       * Wraps a function to prevent it from being called when the event's related target
       * is either the delegate target or a descendant of the delegate target.
       *
       * This is useful for event handling where you want to ensure that the function
       * is only executed when the event originates from outside a specific element.
       *
       * @param {Function} fn - The function to be wrapped.
       * @returns {Function} A new function that wraps the original function with additional
       *                    logic to check the event's related target.
       *
       * @example
       * const handleClick = wrapFn(function(event) {
       *   console.log('Clicked outside of the target element!');
       * });
       *
       * element.addEventListener('click', handleClick);
       *
       * @throws {TypeError} Throws an error if the provided argument is not a function.
       */
      const wrapFn = fn => {
        return function (event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn.call(this, event);
          }
        };
      };

      if (delegationFn) {
        delegationFn = wrapFn(delegationFn);
      } else {
        handler = wrapFn(handler);
      }
    }

    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
    const events = getEvent(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

    if (previousFn) {
      previousFn.oneOff = previousFn.oneOff && oneOff;
      return;
    }

    const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
    fn.delegationSelector = delegation ? handler : null;
    fn.originalHandler = originalHandler;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, delegation);
  }

  /**
   * Removes an event handler from a specified element.
   *
   * This function searches for the specified event handler within the provided events object
   * and removes it from the element's event listeners. If the handler is not found, the function
   * exits without making any changes.
   *
   * @param {HTMLElement} element - The DOM element from which the event handler should be removed.
   * @param {Object} events - An object containing event handlers indexed by event type.
   * @param {string} typeEvent - The type of event (e.g., 'click', 'mouseover') for which the handler is registered.
   * @param {Function} handler - The specific event handler function to be removed.
   * @param {string} [delegationSelector] - An optional selector string for event delegation. If provided, the handler will be removed only if it matches this selector.
   *
   * @returns {void} This function does not return a value.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
   *
   * @example
   * // Example usage:
   * const button = document.querySelector('button');
   * const handleClick = () => console.log('Button clicked!');
   * const events = {
   *   click: {
   *     'uniqueHandlerId': handleClick
   *   }
   * };
   *
   * // To remove the click handler
   * removeHandler(button, events, 'click', handleClick);
   */
  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);

    if (!fn) {
      return;
    }

    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  }

  /**
   * Removes event handlers associated with a specific namespace from a given element.
   *
   * This function iterates through the event handlers registered for a specified event type
   * and removes those that match the provided namespace.
   *
   * @param {HTMLElement} element - The DOM element from which to remove the event handlers.
   * @param {Object} events - An object containing event handlers for various event types.
   * @param {string} typeEvent - The type of event (e.g., 'click', 'mouseover') for which handlers should be removed.
   * @param {string} namespace - The namespace to match against the handler keys for removal.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
   *
   * @example
   * // Assuming 'button' is a valid DOM element and 'events' is an object containing event handlers
   * removeNamespacedHandlers(button, events, 'click', 'myNamespace');
   */
  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach(handlerKey => {
      if (handlerKey.includes(namespace)) {
        const event = storeElementEvent[handlerKey];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
      }
    });
  }

  /**
   * Retrieves the native event type from a namespaced event string.
   *
   * This function processes an event string that may include a namespace (e.g., 'click.bs.button')
   * and returns the corresponding native event type (e.g., 'click'). If the event type is not found
   * in the custom events mapping, it returns the original event type.
   *
   * @param {string} event - The namespaced event string to be processed.
   * @returns {string} The native event type corresponding to the provided namespaced event.
   *
   * @example
   * // Returns 'click'
   * getTypeEvent('click.bs.button');
   *
   * @example
   * // Returns 'focus'
   * getTypeEvent('focus.input');
   *
   * @throws {TypeError} Throws an error if the event parameter is not a string.
   */
  function getTypeEvent(event) {
    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
  }

  const EventHandler = {
    on(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, false);
    },

    one(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, true);
    },

    off(element, originalTypeEvent, handler, delegationFn) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }

      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getEvent(element);
      const isNamespace = originalTypeEvent.startsWith('.');

      if (typeof originalHandler !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!events || !events[typeEvent]) {
          return;
        }

        removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
        return;
      }

      if (isNamespace) {
        Object.keys(events).forEach(elementEvent => {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        });
      }

      const storeElementEvent = events[typeEvent] || {};
      Object.keys(storeElementEvent).forEach(keyHandlers => {
        const handlerKey = keyHandlers.replace(stripUidRegex, '');

        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          const event = storeElementEvent[keyHandlers];
          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
        }
      });
    },

    trigger(element, event, args) {
      if (typeof event !== 'string' || !element) {
        return null;
      }

      const $ = getjQuery();
      const typeEvent = getTypeEvent(event);
      const inNamespace = event !== typeEvent;
      const isNative = nativeEvents.has(typeEvent);
      let jQueryEvent;
      let bubbles = true;
      let nativeDispatch = true;
      let defaultPrevented = false;
      let evt = null;

      if (inNamespace && $) {
        jQueryEvent = $.Event(event, args);
        $(element).trigger(jQueryEvent);
        bubbles = !jQueryEvent.isPropagationStopped();
        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
        defaultPrevented = jQueryEvent.isDefaultPrevented();
      }

      if (isNative) {
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(typeEvent, bubbles, true);
      } else {
        evt = new CustomEvent(event, {
          bubbles,
          cancelable: true
        });
      } // merge custom information in our event


      if (typeof args !== 'undefined') {
        Object.keys(args).forEach(key => {
          Object.defineProperty(evt, key, {
            get() {
              return args[key];
            }

          });
        });
      }

      if (defaultPrevented) {
        evt.preventDefault();
      }

      if (nativeDispatch) {
        element.dispatchEvent(evt);
      }

      if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
        jQueryEvent.preventDefault();
      }

      return evt;
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const elementMap = new Map();
  var Data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, new Map());
      }

      const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
      // can be removed later when multiple key/instances are fine to be used

      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
        return;
      }

      instanceMap.set(key, instance);
    },

    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
      }

      return null;
    },

    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
      }

      const instanceMap = elementMap.get(element);
      instanceMap.delete(key); // free up element references if there are no instances left for an element

      if (instanceMap.size === 0) {
        elementMap.delete(element);
      }
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const VERSION = '5.1.0';

  class BaseComponent {
    constructor(element) {
      element = getElement(element);

      if (!element) {
        return;
      }

      this._element = element;
      Data.set(this._element, this.constructor.DATA_KEY, this);
    }

    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY);
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
      Object.getOwnPropertyNames(this).forEach(propertyName => {
        this[propertyName] = null;
      });
    }

    _queueCallback(callback, element, isAnimated = true) {
      executeAfterTransition(callback, element, isAnimated);
    }
    /** Static */


    static getInstance(element) {
      return Data.get(getElement(element), this.DATA_KEY);
    }

    static getOrCreateInstance(element, config = {}) {
      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
    }

    static get VERSION() {
      return VERSION;
    }

    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
    }

    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }

    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }

  }


  /**
   * Enables a dismiss trigger for a specified component.
   *
   * This function attaches a click event listener to the document that listens for
   * elements with a specific data attribute indicating they should dismiss the component.
   * When clicked, it checks if the element is disabled or if it is an anchor/area tag,
   * preventing the default action if necessary. It then retrieves the target element and
   * calls the specified method on the component instance to dismiss it.
   *
   * @param {Object} component - The component for which the dismiss trigger is being enabled.
   * @param {string} [method='hide'] - The method to call on the component instance when dismissing.
   *                                    Defaults to 'hide'.
   * @throws {Error} Throws an error if the component does not have the specified method.
   *
   * @example
   * // Example usage:
   * enableDismissTrigger(AlertComponent, 'close');
   */
  const enableDismissTrigger = (component, method = 'hide') => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;
    EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }

      if (isDisabled(this)) {
        return;
      }

      const target = getElementFromSelector(this) || this.closest(`.${name}`);
      const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

      instance[method]();
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$d = 'alert';
  const DATA_KEY$c = 'bs.alert';
  const EVENT_KEY$c = `.${DATA_KEY$c}`;
  const EVENT_CLOSE = `close${EVENT_KEY$c}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$c}`;
  const CLASS_NAME_FADE$5 = 'fade';
  const CLASS_NAME_SHOW$8 = 'show';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$d;
    } // Public


    close() {
      const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

      if (closeEvent.defaultPrevented) {
        return;
      }

      this._element.classList.remove(CLASS_NAME_SHOW$8);

      const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);

      this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
    } // Private


    _destroyElement() {
      this._element.remove();

      EventHandler.trigger(this._element, EVENT_CLOSED);
      this.dispose();
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Alert.getOrCreateInstance(this);

        if (typeof config !== 'string') {
          return;
        }

        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  enableDismissTrigger(Alert, 'close');
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Alert to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Alert);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$c = 'button';
  const DATA_KEY$b = 'bs.button';
  const EVENT_KEY$b = `.${DATA_KEY$b}`;
  const DATA_API_KEY$7 = '.data-api';
  const CLASS_NAME_ACTIVE$3 = 'active';
  const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$b}${DATA_API_KEY$7}`;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$c;
    } // Public


    toggle() {
      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Button.getOrCreateInstance(this);

        if (config === 'toggle') {
          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
    const data = Button.getOrCreateInstance(button);
    data.toggle();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Button to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Button);

  /**
   * Normalizes the input value to its appropriate JavaScript type.
   *
   * This function takes a string representation of a value and converts it
   * to a boolean, number, null, or returns the original string based on its
   * content. The following conversions are performed:
   *
   * - 'true' -> true
   * - 'false' -> false
   * - Numeric strings (e.g., '123') -> Number (e.g., 123)
   * - Empty string or 'null' -> null
   * - Any other string remains unchanged.
   *
   * @param {string} val - The input value to normalize.
   * @returns {boolean|number|null|string} The normalized value, which can be
   *          a boolean, number, null, or the original string.
   *
   * @example
   * normalizeData('true'); // returns true
   * normalizeData('false'); // returns false
   * normalizeData('42'); // returns 42
   * normalizeData(''); // returns null
   * normalizeData('null'); // returns null
   * normalizeData('hello'); // returns 'hello'
   */
  function normalizeData(val) {
    if (val === 'true') {
      return true;
    }

    if (val === 'false') {
      return false;
    }

    if (val === Number(val).toString()) {
      return Number(val);
    }

    if (val === '' || val === 'null') {
      return null;
    }

    return val;
  }

  /**
   * Normalizes a given data key by converting uppercase letters to lowercase
   * and prefixing them with a hyphen. This is useful for transforming keys
   * into a format that is more suitable for certain data handling scenarios,
   * such as when working with CSS class names or data attributes.
   *
   * @param {string} key - The data key to be normalized.
   * @returns {string} The normalized data key with hyphens before lowercase letters.
   *
   * @example
   * // returns 'data-key'
   * normalizeDataKey('dataKey');
   *
   * @example
   * // returns 'user-name'
   * normalizeDataKey('userName');
   *
   * @throws {TypeError} Throws an error if the provided key is not a string.
   */
  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
  }

  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },

    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },

    getDataAttributes(element) {
      if (!element) {
        return {};
      }

      const attributes = {};
      Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
        let pureKey = key.replace(/^bs/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      });
      return attributes;
    },

    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    },

    offset(element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
      };
    },

    position(element) {
      return {
        top: element.offsetTop,
        left: element.offsetLeft
      };
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const NODE_TEXT = 3;
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },

    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },

    children(element, selector) {
      return [].concat(...element.children).filter(child => child.matches(selector));
    },

    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode;

      while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
        if (ancestor.matches(selector)) {
          parents.push(ancestor);
        }

        ancestor = ancestor.parentNode;
      }

      return parents;
    },

    /**
     * Cleans up and disposes of the instance by removing associated data and event handlers.
     * This method sets all properties of the instance to null, effectively releasing references
     * to any resources held by the instance.
     *
     * @returns {void} This method does not return a value.
     *
     * @throws {Error} Throws an error if the element is not properly initialized or if there are issues
     *                 with removing event handlers.
     *
     * @example
     * const instance = new SomeClass();
     * // Perform operations with the instance
     * instance.dispose(); // Clean up resources and event handlers
     */
    prev(element, selector) {
      let previous = element.previousElementSibling;

      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }

        /**
         * Queues a callback function to be executed after a transition effect.
         *
         * This method ensures that the provided callback is executed after the specified
         * element has completed its transition, allowing for smoother animations and
         * interactions.
         *
         * @param {Function} callback - The function to be executed after the transition.
         * @param {Element} element - The DOM element that is undergoing the transition.
         * @param {boolean} [isAnimated=true] - A flag indicating whether the transition is animated.
         *                                        Defaults to true.
         *
         * @throws {Error} Throws an error if the callback is not a function or if the element is not valid.
         *
         * @example
         * // Example usage of _queueCallback
         * _queueCallback(() => {
         *   console.log('Transition completed!');
         * }, document.getElementById('myElement'));
         */
        previous = previous.previousElementSibling;
      }

    },

    /**
     * Retrieves an instance of the data associated with a specified element.
     *
     * This static method accesses the data stored for a given DOM element using a unique key.
     * It is useful for managing and retrieving instance-specific data in a structured way.
     *
     * @static
     * @param {HTMLElement} element - The DOM element from which to retrieve the associated data.
     * @returns {Object|null} The data associated with the element, or null if no data is found.
     *
     * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
     *
     * @example
     * const instance = MyClass.getInstance(document.getElementById('myElement'));
     * if (instance) {
     *   console.log('Data retrieved:', instance);
     * } else {
     *   console.log('No data found for the specified element.');
     * }
     */
    next(element, selector) {
      let next = element.nextElementSibling;

      while (next) {
        /**
         * Retrieves an existing instance of the class associated with the provided element,
         * or creates a new instance if none exists.
         *
         * This method checks if an instance already exists for the given element. If it does,
         * that instance is returned. If not, a new instance is created using the provided
         * configuration object.
         *
         * @static
         * @param {HTMLElement} element - The DOM element for which to retrieve or create an instance.
         * @param {Object} [config={}] - An optional configuration object to initialize the new instance.
         * @returns {Object} The existing or newly created instance of the class.
         * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
         *
         * @example
         * const instance = MyClass.getOrCreateInstance(document.getElementById('myElement'), { key: 'value' });
         */
        if (next.matches(selector)) {
          return [next];
        }

        next = next.nextElementSibling;
      }

      return [];
    },

    focusableChildren(element) {
      const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(', ');
      return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$b = 'carousel';
  const DATA_KEY$a = 'bs.carousel';
  const EVENT_KEY$a = `.${DATA_KEY$a}`;
  const DATA_API_KEY$6 = '.data-api';
  const ARROW_LEFT_KEY = 'ArrowLeft';
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  const SWIPE_THRESHOLD = 40;
  const Default$a = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  const DefaultType$a = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  const ORDER_NEXT = 'next';
  const ORDER_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const KEY_TO_DIRECTION = {
    [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
    [ARROW_RIGHT_KEY]: DIRECTION_LEFT
  };
  const EVENT_SLIDE = `slide${EVENT_KEY$a}`;
  const EVENT_SLID = `slid${EVENT_KEY$a}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$a}`;
  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$a}`;
  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$a}`;
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$a}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$a}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$a}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$a}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$a}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$a}`;
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$a}${DATA_API_KEY$6}`;
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_END = 'carousel-item-end';
  const CLASS_NAME_START = 'carousel-item-start';
  /**
   * Closes the element by triggering a close event and removing the show class.
   * If the close event is prevented, the function will exit early without making any changes.
   * After removing the show class, it checks if the element has a fade class to determine
   * if the closing animation should be applied.
   *
   * @returns {void} This function does not return a value.
   *
   * @throws {Error} Throws an error if there is an issue with the event handling or element destruction.
   *
   * @example
   * // Example usage of the close method
   * const myElement = new MyElement();
   * myElement.close();
   */
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const SELECTOR_ACTIVE$1 = '.active';
  const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_INDICATOR = '[data-bs-target]';
  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
  const POINTER_TYPE_TOUCH = 'touch';
  const POINTER_TYPE_PEN = 'pen';
  /**
   /**
    * Removes the associated element from the DOM and triggers the closed event.
    * This method is responsible for cleaning up the element and disposing of any resources
    * associated with it.
    *
    * @throws {Error} Throws an error if the element cannot be removed.
    *
    * @example
    * const instance = new SomeClass();
    * instance._destroyElement();
    * // The element is removed and the closed event is triggered.
    */
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element);
      /**
       * jQuery interface for the Alert component.
       *
       * This method allows you to invoke methods on the Alert instance using jQuery.
       * It checks if the provided configuration is a valid method name and executes it.
       *
       * @param {string|Object} config - The method name to invoke on the Alert instance or an options object.
       * @throws {TypeError} Throws an error if the method name is invalid or not found.
       *
       * @example
       * // To show an alert
       * $('.alert').jQueryInterface('show');
       *
       * @example
       * // To hide an alert
       * $('.alert').jQueryInterface('hide');
       */
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent);

      this._addEventListeners();
    } // Getters


    static get Default() {
      return Default$a;
    }

    static get NAME() {
      return NAME$b;
    } // Public


    next() {
      this._slide(ORDER_NEXT);
    }

    nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && isVisible(this._element)) {
        this.next();
      }
    }

    prev() {
      this._slide(ORDER_PREV);
    }

    pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
        triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    }

    cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      /**
       * Toggles the active state of an element by adding or removing a specific class.
       * This method also synchronizes the `aria-pressed` attribute to reflect the current state.
       *
       * When the class is added, `aria-pressed` is set to "true", indicating that the element is active.
       * When the class is removed, `aria-pressed` is set to "false", indicating that the element is inactive.
       *
       * @throws {TypeError} Throws an error if the element is not defined or does not support classList.
       *
       * @example
       * const myElement = document.querySelector('.my-element');
       * const myToggle = new MyToggleClass(myElement);
       * myToggle.toggle(); // Toggles the class and updates aria-pressed attribute
       */
      if (this._config && this._config.interval && !this._isPaused) {
        this._updateInterval();

        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    }
/**
 * A static method that provides a jQuery interface for the Button component.
 * This method allows for the manipulation of Button instances through jQuery.
 *
 * @param {string} config - The configuration option to apply to the Button instance.
 *                          If 'toggle' is passed, the Button's toggle method will be invoked.
 *
 * @returns {jQuery} The jQuery object for chaining.
 *
 * @example
 * // To toggle a button using jQuery
 * $('.btn').jQueryInterface('toggle');
 *
 * @throws {TypeError} Throws an error if the config parameter is not a string.
 */

    to(index) {
      this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

      this._slide(order, this._items[index]);
    } // Private


    _getConfig(config) {
      config = { ...Default$a,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$b, config, DefaultType$a);
      return config;
    }

    _handleSwipe() {
      const absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      const direction = absDeltax / this.touchDeltaX;
      this.touchDeltaX = 0;

      if (!direction) {
        return;
      }

      this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
    }

    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
      }

      if (this._config.pause === 'hover') {
        EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
        EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
      }

      if (this._config.touch && this._touchSupported) {
        this._addTouchEventListeners();
      }
    }

    _addTouchEventListeners() {
      /**
       * Handles the start of a touch or pointer event.
       * This function captures the initial X coordinate of the touch or pointer event,
       * depending on the type of event being processed.
       *
       * @param {PointerEvent|TouchEvent} event - The event object representing the touch or pointer event.
       * @throws {TypeError} Throws an error if the event is not a valid PointerEvent or TouchEvent.
       *
       * @example
       * // Example usage with a pointer event
       * element.addEventListener('pointerdown', start);
       *
       * // Example usage with a touch event
       * element.addEventListener('touchstart', start);
       */
      const start = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchStartX = event.clientX;
        } else if (!this._pointerEvent) {
          this.touchStartX = event.touches[0].clientX;
        }
      };

      /**
       * Handles the movement of touch events, calculating the horizontal distance
       * moved by a single touch. This function ensures that swiping is detected
       * only when there is a single touch, ignoring pinch gestures.
       *
       * @param {TouchEvent} event - The touch event object containing information
       * about the touch points.
       *
       * @returns {void} This function does not return a value.
       *
       * @throws {Error} Throws an error if the event does not contain touch points.
       *
       * @example
       * // Example usage in a touch event listener
       * element.addEventListener('touchmove', move);
       */
      const move = event => {
        // ensure swiping with one touch and not pinching
        this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
      };

      /**
       * Handles the end of a pointer event, processing touch gestures and managing carousel behavior.
       *
       * This function is triggered when a pointer event ends. It calculates the delta of the touch movement
       * if the pointer type is either a pen or touch. It also manages the pausing and resuming of the carousel
       * based on user interactions, specifically for touch-enabled devices.
       *
       * @param {PointerEvent} event - The pointer event that triggered this handler.
       * @throws {Error} Throws an error if the event is not a valid PointerEvent.
       *
       * @example
       * // Example usage:
       * const pointerEndHandler = end.bind(carouselInstance);
       * element.addEventListener('pointerup', pointerEndHandler);
       */
      const end = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchDeltaX = event.clientX - this.touchStartX;
        }

        this._handleSwipe();

        if (this._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          this.pause();

          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
          }

          this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
        }
      };

      SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
        EventHandler.on(itemImg, EVENT_DRAG_START, e => e.preventDefault());
      });

      if (this._pointerEvent) {
        EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event));
        EventHandler.on(this._element, EVENT_POINTERUP, event => end(event));

        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event));
        EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event));
        EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event));
      }
    }

    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      const direction = KEY_TO_DIRECTION[event.key];

      if (direction) {
        event.preventDefault();

        this._slide(direction);
      }
    }

    _getItemIndex(element) {
      this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
      return this._items.indexOf(element);
    }

    _getItemByOrder(order, activeElement) {
      const isNext = order === ORDER_NEXT;
      return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap);
    }

    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget);

      const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));

      return EventHandler.trigger(this._element, EVENT_SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
    }

    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
        activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
        activeIndicator.removeAttribute('aria-current');
        const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);

        for (let i = 0; i < indicators.length; i++) {
          if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
            indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
            indicators[i].setAttribute('aria-current', 'true');
            break;
          }
        }
      }
    }

    _updateInterval() {
      const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      if (!element) {
        return;
      }

      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);

      if (elementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
        this._config.interval = elementInterval;
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval;
      }
    }

    _slide(directionOrOrder, element) {
      const order = this._directionToOrder(directionOrOrder);

      const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeElementIndex = this._getItemIndex(activeElement);

      const nextElement = element || this._getItemByOrder(order, activeElement);

      const nextElementIndex = this._getItemIndex(nextElement);

      const isCycling = Boolean(this._interval);
      const isNext = order === ORDER_NEXT;
      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

      const eventDirectionName = this._orderToDirection(order);

      if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
        this._isSliding = false;
        return;
      }

      if (this._isSliding) {
        return;
      }

      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.defaultPrevented) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      this._activeElement = nextElement;

      /**
       /**
        * Advances to the next slide in the presentation or carousel.
        *
        * This method triggers the transition to the subsequent slide by invoking
        * the internal slide handling mechanism with a predefined order constant.
        *
        * @throws {Error} Throws an error if the slide transition fails due to
        *                 an invalid state or if there are no more slides to
        *                 advance to.
        *
        * @example
        * // Assuming 'slider' is an instance of a carousel or slideshow
        * slider.next(); // Moves to the next slide
        */
       * Triggers a 'slid' event on the associated element.
       *
       * This function is responsible for emitting a custom event when a sliding transition occurs.
       * It provides information about the transition, including the related target element,
       /**
        * Triggers the next action in a carousel when the page and the carousel element are visible.
        * This method checks if the document is not hidden and if the carousel element is visible
        * before proceeding to call the next method.
        *
        * @throws {Error} Throws an error if the carousel element is not defined or cannot be accessed.
        *
        * @example
        * // Assuming `carousel` is an instance of a carousel class
        * carousel.nextWhenVisible();
        */
       * the direction of the slide, and the indices of the active and next elements.
       *
       * @event {CustomEvent} slid - The event that is triggered when the slide transition occurs.
       * @param {Element} nextElement - The element that is being transitioned to.
       * @param {string} eventDirectionName - The direction of the slide (e.g., 'left', 'right').
       * @param {number} activeElementIndex - The index of the currently active element before the transition.
       * @param {number} nextElementIndex - The index of the next element after the transition.
       *
       /**
        * Moves to the previous slide in the slideshow.
        *
        * This method triggers the transition to the previous slide by invoking
        * the internal sliding mechanism with a predefined order constant.
        *
        * @throws {Error} Throws an error if the slideshow is not initialized
        * or if there are no previous slides to navigate to.
        *
        * @example
        * // Assuming `slideshow` is an instance of the slideshow class
        * slideshow.prev();
        */
       * @throws {Error} Throws an error if the event cannot be triggered due to an invalid element.
       *
       * @example
       * // Example usage of triggerSlidEvent
       /**
        * Pauses the current operation or cycle of the component.
        *
        * This method checks if an event is provided. If not, it sets the internal
        * `_isPaused` flag to true. If a specific selector is found within the
        * component's element, it triggers a transition end and resumes the cycle.
        * It also clears any existing intervals to stop ongoing processes.
        *
        * @param {Event} [event] - The event that triggered the pause. If no event
        * is provided, the component will simply pause.
        *
        * @throws {Error} Throws an error if there is an issue with the selector
        * or if the transition cannot be triggered.
        *
        * @example
        * // To pause without an event
        * component.pause();
        *
        * // To pause with an event
        * component.pause(event);
        */
       * triggerSlidEvent(nextElement, 'left', 0, 1);
       */
      const triggerSlidEvent = () => {
        EventHandler.trigger(this._element, EVENT_SLID, {
          relatedTarget: nextElement,
          direction: eventDirectionName,
          from: activeElementIndex,
          to: nextElementIndex
        });
      };

      if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
        nextElement.classList.add(orderClassName);
        reflow(nextElement);
        /**
         * Manages the execution cycle based on the provided event and configuration.
         *
         * This method pauses or resumes the cycle depending on the event state.
         * If the event is not provided, it will unpause the cycle. If an interval is already set,
         * it will clear that interval before setting a new one based on the configuration.
         *
         * @param {Event} [event] - The event that triggers the cycle. If not provided, the cycle will be unpaused.
         *
         * @throws {Error} Throws an error if the configuration is invalid or if there is an issue with setting the interval.
         *
         * @example
         * // To start the cycle without an event
         * instance.cycle();
         *
         * // To pause the cycle with an event
         * instance.cycle(someEvent);
         */
        activeElement.classList.add(directionalClassName);
        nextElement.classList.add(directionalClassName);

        /**
         * Callback function that completes the sliding transition of an element.
         * This function updates the class list of the next and active elements to reflect
         * the current state of the sliding animation.
         *
         * It removes the directional and order class names from the next element,
         * adds the active class to it, and removes the active class from the currently
         * active element. It also sets a flag indicating that the sliding is no longer
         * in progress and triggers a sliding event after a short delay.
         *
         * @throws {Error} Throws an error if the next or active elements are not defined.
         *
         * @example
         * // Assuming nextElement and activeElement are defined and refer to valid DOM elements
         /**
          * Moves to the specified item in the collection of items.
          *
          * This method updates the active element based on the provided index.
          * If the index is out of bounds, the method will return without making any changes.
          * If a sliding transition is currently in progress, it will wait until the transition is complete
          * before executing the move. If the active item is already the target item, it will pause and cycle
          * through the items.
          *
          * @param {number} index - The index of the item to move to. Must be a valid index within the range of items.
          * @returns {void} - This method does not return a value.
          *
          * @example
          * // Move to the item at index 2
          * instance.to(2);
          *
          * @throws {Error} - Throws an error if the index is not a number.
          */
         * completeCallBack();
         */
        const completeCallBack = () => {
          nextElement.classList.remove(directionalClassName, orderClassName);
          nextElement.classList.add(CLASS_NAME_ACTIVE$2);
          activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
          this._isSliding = false;
          setTimeout(triggerSlidEvent, 0);
        };

        this._queueCallback(completeCallBack, activeElement, true);
      } else {
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        this._isSliding = false;
        triggerSlidEvent();
      }

      if (isCycling) {
        this.cycle();
      }
    }

    _directionToOrder(direction) {
      if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
        return direction;
      /**
       * Merges the default configuration with the provided configuration and
       * data attributes from the element.
       *
       * This method retrieves the default configuration and combines it with
       * any data attributes found on the element, as well as any additional
       * configuration passed as an argument. It performs type checking on the
       * final configuration object to ensure it adheres to the expected types.
       *
       * @param {Object} config - The configuration object to merge with defaults.
       *                          If not provided, only defaults and data attributes
       *                          will be used.
       * @returns {Object} The final merged configuration object.
       *
       * @throws {TypeError} Throws an error if the provided configuration does not
       *                     match the expected types defined in DefaultType$a.
       *
       * @example
       * const finalConfig = this._getConfig({ customSetting: true });
       * // finalConfig will include properties from Default$a, data attributes,
       * // and { customSetting: true }
       */
      }

      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }

      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }

    /**
     * Handles the swipe gesture based on the touch delta.
     * This method determines the direction of the swipe and triggers
     * the appropriate sliding action if the swipe exceeds a defined threshold.
     *
     * @throws {Error} Throws an error if the swipe direction cannot be determined.
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * // Assuming touchDeltaX is set to a value greater than SWIPE_THRESHOLD
     * this._handleSwipe(); // This will slide in the appropriate direction.
     */
    _orderToDirection(order) {
      if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
        return order;
      }

      if (isRTL()) {
        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }

      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
    } // Static


    static carouselInterface(element, config) {
      const data = Carousel.getOrCreateInstance(element, config);
      let {
        _config
      /**
       * Initializes event listeners based on the configuration settings.
       * This method sets up keyboard event handling, hover pause functionality,
       * and touch event listeners if supported.
       *
       * @private
       * @returns {void} This method does not return a value.
       *
       * @throws {Error} Throws an error if the event handler setup fails.
       *
       * @example
       * // Example usage:
       * // Assuming this method is called within a class that has a valid configuration
       * this._addEventListeners();
       */
      } = data;

      if (typeof config === 'object') {
        _config = { ..._config,
          ...config
        };
      }

      const action = typeof config === 'string' ? config : _config.slide;

      if (typeof config === 'number') {
        data.to(config);
      } else if (typeof action === 'string') {
        if (typeof data[action] === 'undefined') {
          throw new TypeError(`No method named "${action}"`);
        /**
         * Initializes touch event listeners for swipe functionality on the element.
         * This method handles touch start, move, and end events to enable swipe detection
         * and manage carousel behavior based on user interactions.
         *
         * @private
         * @returns {void}
         *
         * @throws {Error} Throws an error if the event listener setup fails.
         *
         * @example
         * // Example usage within a class context
         * this._addTouchEventListeners();
         *
         * @description
         * The method sets up event listeners for touch and pointer events. It differentiates
         * between pointer events (for devices supporting pointer API) and touch events.
         *
         * On touch start, it records the initial touch position. During touch move, it calculates
         * the distance moved to determine swipe direction. On touch end, it calculates the final
         * swipe distance and triggers the appropriate carousel actions, including pausing and resuming
         * the carousel based on user interaction.
         *
         * If the configuration specifies 'hover' pause behavior, it manages the timing of the pause
         * and resume actions to ensure a smooth user experience.
         */
        }

        data[action]();
      } else if (_config.interval && _config.ride) {
        data.pause();
        data.cycle();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Carousel.carouselInterface(this, config);
      });
    }

    static dataApiClickHandler(event) {
      const target = getElementFromSelector(this);

      if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
        return;
      }

      const config = { ...Manipulator.getDataAttributes(target),
        ...Manipulator.getDataAttributes(this)
      };
      const slideIndex = this.getAttribute('data-bs-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel.carouselInterface(target, config);

      if (slideIndex) {
        Carousel.getInstance(target).to(slideIndex);
      }

      event.preventDefault();
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

    for (let i = 0, len = carousels.length; i < len; i++) {
      Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]));
    }
  /**
   * Handles the keydown event for keyboard navigation.
   * This method checks if the event target is an input or textarea element.
   * If it is, the method returns early to allow normal input behavior.
   * If the key pressed corresponds to a defined direction, it prevents the default action
   * and triggers a slide in the specified direction.
   *
   * @param {KeyboardEvent} event - The keydown event object containing information about the key pressed.
   * @returns {void}
   *
   * @example
   * // Example usage:
   * document.addEventListener('keydown', this._keydown.bind(this));
   *
   * @throws {TypeError} Throws an error if the event parameter is not a KeyboardEvent.
   */
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Carousel to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Carousel);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   /**
    * Retrieves the index of a specified element within its parent's list of items.
    *
    * This method searches for the element in the list of items obtained from its parent node.
    * If the element or its parent node is not provided, an empty array is used, and the method
    * will return -1, indicating that the element is not found.
    *
    * @param {Element} element - The DOM element whose index is to be found.
    * @returns {number} The index of the element within its parent's list of items, or -1 if not found.
    *
    * @example
    * const index = instance._getItemIndex(someElement);
    * console.log(index); // Outputs the index of someElement or -1 if not found.
    */
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   /**
    * Retrieves the next or previous active element based on the specified order.
    *
    * This method determines whether to fetch the next or previous active element
    * from a collection of items. It utilizes the provided order parameter to
    * decide the direction of the search and considers the wrapping configuration
    * to loop back to the start or end of the collection if necessary.
    *
    * @param {string} order - The order in which to retrieve the item.
    *                         Should be either 'ORDER_NEXT' for the next item
    *                         or 'ORDER_PREVIOUS' for the previous item.
    * @param {HTMLElement} activeElement - The currently active element from which
    *                                      the next or previous element will be determined.
    * @returns {HTMLElement|null} The next or previous active element based on the
    *                            specified order, or null if no such element exists.
    *
    * @throws {Error} Throws an error if the order parameter is not valid.
    *
    * @example
    * const nextElement = this._getItemByOrder('ORDER_NEXT', currentActiveElement);
    * const previousElement = this._getItemByOrder('ORDER_PREVIOUS', currentActiveElement);
    */
   * ------------------------------------------------------------------------
   */

  const NAME$a = 'collapse';
  const DATA_KEY$9 = 'bs.collapse';
  /**
   * Triggers a slide event on the specified element.
   *
   * This method calculates the index of the target item and the currently active item,
   * then triggers an event with the relevant details including the direction of the slide,
   * the related target, and the indices of the items involved in the slide.
   *
   * @param {Element} relatedTarget - The element that is related to the slide event.
   * @param {string} eventDirectionName - The direction of the slide event (e.g., "next" or "prev").
   * @returns {boolean} Returns true if the event was successfully triggered, otherwise false.
   *
   * @throws {Error} Throws an error if the relatedTarget is not a valid element.
   *
   * @example
   * const result = this._triggerSlideEvent(slideElement, 'next');
   * if (result) {
   *   console.log('Slide event triggered successfully.');
   * } else {
   *   console.log('Failed to trigger slide event.');
   * }
   */
  const EVENT_KEY$9 = `.${DATA_KEY$9}`;
  const DATA_API_KEY$5 = '.data-api';
  const Default$9 = {
    toggle: true,
    parent: null
  };
  const DefaultType$9 = {
    toggle: 'boolean',
    parent: '(null|element)'
  };
  const EVENT_SHOW$5 = `show${EVENT_KEY$9}`;
  const EVENT_SHOWN$5 = `shown${EVENT_KEY$9}`;
  const EVENT_HIDE$5 = `hide${EVENT_KEY$9}`;
  /**
   * Sets the active indicator element based on the provided element.
   *
   * This method updates the visual state of the indicators by removing the active class
   * from the currently active indicator and applying it to the new active indicator that
   * corresponds to the provided element. It also updates the `aria-current` attribute
   * for accessibility purposes.
   *
   * @param {Element} element - The element for which the active indicator should be set.
   *
   * @throws {Error} Throws an error if the provided element is not valid or if there are
   *                 issues accessing the indicators element.
   *
   * @example
   * // Assuming `element` is a valid DOM element representing a slide
   * this._setActiveIndicatorElement(element);
   */
  const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$9}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$9}${DATA_API_KEY$5}`;
  const CLASS_NAME_SHOW$7 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
  const WIDTH = 'width';
  const HEIGHT = 'height';
  const SELECTOR_ACTIVES = '.show, .collapsing';
  const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  /**
   * Updates the interval configuration based on the active element's data attribute.
   * If the active element is not found, the method returns without making any changes.
   * If the active element has a 'data-bs-interval' attribute, it updates the current interval
   * to this value. If the attribute is not present, it resets the interval to the default value.
   *
   * @throws {Error} Throws an error if the element cannot be parsed correctly.
   *
   * @example
   * // Assuming this method is called within a class context where _activeElement
   * // and _config are defined.
   * this._updateInterval();
   */
  class Collapse extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._isTransitioning = false;
      this._config = this._getConfig(config);
      this._triggerArray = [];
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i];
        const selector = getSelectorFromElement(elem);
        const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);

        if (selector !== null && filterElement.length) {
          this._selector = selector;

          this._triggerArray.push(elem);
        /**
         * Slides to the next or previous item in a carousel based on the specified direction or order.
         * If an element is provided, it will slide to that element; otherwise, it will determine the next element
         * based on the current active item and the specified direction.
         *
         * @param {string} directionOrOrder - The direction to slide ('next' or 'prev') or an order constant.
         * @param {Element} [element] - The specific element to slide to. If not provided, the next item will be determined.
         * @throws {Error} Throws an error if the sliding action cannot be completed due to invalid states.
         *
         * @returns {void} This function does not return a value.
         *
         * @example
         * // Slide to the next item in the carousel
         * carouselInstance._slide('next');
         *
         * @example
         * // Slide to a specific element
         * carouselInstance._slide('next', document.querySelector('.specific-item'));
         *
         * @event slid - Triggered when the slide transition has completed.
         * @param {Object} event - The event object.
         * @param {Element} event.relatedTarget - The element that is now active.
         * @param {string} event.direction - The direction of the slide ('left' or 'right').
         * @param {number} event.from - The index of the previous active item.
         * @param {number} event.to - The index of the newly active item.
         */
        }
      }

      this._initializeChildren();

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    static get Default() {
      return Default$9;
    }

    static get NAME() {
      return NAME$a;
    } // Public


    toggle() {
      if (this._isShown()) {
        this.hide();
      } else {
        this.show();
      }
    }

    show() {
      if (this._isTransitioning || this._isShown()) {
        return;
      }

      let actives = [];
      let activesData;

      if (this._config.parent) {
        const children = SelectorEngine.find(`.${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`, this._config.parent);
        actives = SelectorEngine.find(SELECTOR_ACTIVES, this._config.parent).filter(elem => !children.includes(elem)); // remove children if greater depth
      }

      const container = SelectorEngine.findOne(this._selector);

      if (actives.length) {
        const tempActiveData = actives.find(elem => container !== elem);
        activesData = tempActiveData ? Collapse.getInstance(tempActiveData) : null;

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);

      if (startEvent.defaultPrevented) {
        return;
      }

      actives.forEach(elemActive => {
        if (container !== elemActive) {
          Collapse.getOrCreateInstance(elemActive, {
            toggle: false
          }).hide();
        }

        if (!activesData) {
          Data.set(elemActive, DATA_KEY$9, null);
        }
      });

      const dimension = this._getDimension();

      this._element.classList.remove(CLASS_NAME_COLLAPSE);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.style[dimension] = 0;

      this._addAriaAndCollapsedClass(this._triggerArray, true);

      /**
       * Converts a given direction to an order based on the current text directionality.
       *
       * This function checks if the provided direction is either `DIRECTION_RIGHT` or `DIRECTION_LEFT`.
       * If it is not, the function returns the original direction. If the text direction is right-to-left (RTL),
       * it will return `ORDER_PREV` for `DIRECTION_LEFT` and `ORDER_NEXT` for `DIRECTION_RIGHT`.
       * Conversely, if the text direction is left-to-right (LTR), it will return `ORDER_NEXT` for `DIRECTION_LEFT`
       * and `ORDER_PREV` for `DIRECTION_RIGHT`.
       *
       * @param {string} direction - The direction to convert, expected to be either `DIRECTION_RIGHT` or `DIRECTION_LEFT`.
       * @returns {string} The corresponding order based on the text directionality.
       *
       * @throws {Error} Throws an error if the direction is not recognized.
       *
       * @example
       * const order = _directionToOrder(DIRECTION_LEFT);
       * // Returns ORDER_NEXT if the text direction is LTR, otherwise returns ORDER_PREV.
       */
      this._isTransitioning = true;

      /**
       * Completes the transition of an element by updating its classes and styles.
       * This method is typically called at the end of a collapsing or expanding animation.
       *
       * @this {Object} The context in which the method is called, expected to have
       *                properties `_isTransitioning`, `_element`, and a dimension
       *                variable defined.
       *
       * @throws {TypeError} Throws an error if `_element` is not defined or does not
       *                     have the expected properties.
       /**
        * Converts an order value to a corresponding direction based on the current text directionality.
        *
        * This function checks if the provided order is either `ORDER_NEXT` or `ORDER_PREV`.
        * If it is neither, the function returns the order unchanged. If the text direction is
        * right-to-left (RTL), it maps `ORDER_PREV` to `DIRECTION_LEFT` and `ORDER_NEXT` to
        * `DIRECTION_RIGHT`. Conversely, if the text direction is left-to-right (LTR),
        * it maps `ORDER_PREV` to `DIRECTION_RIGHT` and `ORDER_NEXT` to `DIRECTION_LEFT`.
        *
        * @param {string} order - The order to convert, which can be `ORDER_NEXT`, `ORDER_PREV`,
        *                         or any other string.
        * @returns {string} The corresponding direction as a string, which will be one of
        *                   `DIRECTION_LEFT`, `DIRECTION_RIGHT`, or the original order if
        *                   it is not recognized.
        *
        * @example
        * const direction = _orderToDirection(ORDER_NEXT);
        * // Returns DIRECTION_LEFT or DIRECTION_RIGHT based on text direction.
        *
        * @throws {Error} Throws an error if the order is not a valid string type.
        */
       *
       * @example
       * const myTransition = {
       *   _isTransitioning: true,
       *   _element: document.getElementById('myElement'),
       *   complete: complete
       * };
       * myTransition.complete();
       *
       * @fires EVENT_SHOWN$5 - Triggers an event indicating that the element has
       *                        finished showing.
       */
      const complete = () => {
        /**
         * Initializes or retrieves a Carousel instance for the specified element and configures it based on the provided options.
         *
         * This method can be used to control the behavior of the carousel, such as sliding to a specific item, pausing, or cycling through items.
         *
         * @param {Element} element - The DOM element that represents the carousel.
         * @param {Object|string|number} config - Configuration options for the carousel or an action to perform.
         *   - If an object is provided, it will be merged with the existing configuration.
         *   - If a string is provided, it should correspond to a method name of the carousel instance (e.g., 'next', 'prev').
         *   - If a number is provided, it indicates the index of the item to slide to.
         *
         * @throws {TypeError} Throws an error if the provided action does not correspond to a valid method of the carousel instance.
         *
         * @example
         * // Initialize a carousel with default settings
         * carouselInterface(document.querySelector('#myCarousel'));
         *
         * @example
         * // Slide to the second item in the carousel
         * carouselInterface(document.querySelector('#myCarousel'), 1);
         *
         * @example
         * // Pause and then cycle through items
         * carouselInterface(document.querySelector('#myCarousel'), { interval: true, ride: true });
         */
        this._isTransitioning = false;

        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

        this._element.style[dimension] = '';
        EventHandler.trigger(this._element, EVENT_SHOWN$5);
      };

      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;

      this._queueCallback(complete, this._element, true);

      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }

    hide() {
      if (this._isTransitioning || !this._isShown()) {
        return;
      }

      const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);

      if (startEvent.defaultPrevented) {
        return;
      }
/**
 * Initializes the carousel interface for each element in the jQuery collection.
 *
 * This static method applies the carousel interface to the current set of elements,
 * allowing for configuration options to be passed in. Each element will have the carousel
 * functionality applied to it based on the provided configuration.
 *
 * @static
 * @param {Object} config - Configuration options for the carousel.
 * @returns {jQuery} The jQuery collection for chaining.
 *
 * @example
 * // Initialize the carousel with custom options
 * $('.carousel').jQueryInterface({ interval: 5000 });
 *
 * @throws {TypeError} Throws an error if the configuration is not an object.
 */

      const dimension = this._getDimension();

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);

      /**
       * Handles click events for data API interactions on carousel elements.
       *
       * This method retrieves the target element based on the event context and checks if it is a carousel.
       * If the target is valid and is a carousel, it gathers configuration data from the target and the current element.
       * If a specific slide index is provided via the 'data-bs-slide-to' attribute, it disables the automatic interval for the carousel.
       * The carousel interface is then initialized with the gathered configuration, and if a slide index is present, it navigates to that slide.
       *
       * @static
       * @param {Event} event - The click event triggered by the user.
       * @returns {void}
       *
       * @example
       * // Example usage in an event listener
       * element.addEventListener('click', dataApiClickHandler);
       *
       * @throws {TypeError} Throws an error if the target element is not found or does not have the expected class.
       */
      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

      const triggerArrayLength = this._triggerArray.length;

      for (let i = 0; i < triggerArrayLength; i++) {
        const trigger = this._triggerArray[i];
        const elem = getElementFromSelector(trigger);

        if (elem && !this._isShown(elem)) {
          this._addAriaAndCollapsedClass([trigger], false);
        }
      }

      this._isTransitioning = true;

      /**
       * Completes the collapse transition of an element.
       *
       * This method is responsible for finalizing the collapse effect by
       * removing the collapsing class and adding the collapsed class to
       * the element. It also triggers an event indicating that the
       * collapse transition has finished.
       *
       * @throws {Error} Throws an error if the element is not defined or
       *                 if there is an issue with event handling.
       *
       * @example
       * // Assuming `myElement` is a valid DOM element
       * const myCollapse = new Collapse(myElement);
       * myCollapse.complete();
       */
      const complete = () => {
        this._isTransitioning = false;

        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE);

        EventHandler.trigger(this._element, EVENT_HIDDEN$5);
      };

      this._element.style[dimension] = '';

      this._queueCallback(complete, this._element, true);
    }

    _isShown(element = this._element) {
      return element.classList.contains(CLASS_NAME_SHOW$7);
    } // Private


    _getConfig(config) {
      config = { ...Default$9,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      };
      config.toggle = Boolean(config.toggle); // Coerce string values

      config.parent = getElement(config.parent);
      typeCheckConfig(NAME$a, config, DefaultType$9);
      return config;
    }

    _getDimension() {
      return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
    }

    _initializeChildren() {
      if (!this._config.parent) {
        return;
      }

      const children = SelectorEngine.find(`.${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`, this._config.parent);
      SelectorEngine.find(SELECTOR_DATA_TOGGLE$4, this._config.parent).filter(elem => !children.includes(elem)).forEach(element => {
        const selected = getElementFromSelector(element);

        if (selected) {
          this._addAriaAndCollapsedClass([element], this._isShown(selected));
        }
      });
    }

    _addAriaAndCollapsedClass(triggerArray, isOpen) {
      if (!triggerArray.length) {
        return;
      }

      triggerArray.forEach(elem => {
        if (isOpen) {
          elem.classList.remove(CLASS_NAME_COLLAPSED);
        } else {
          elem.classList.add(CLASS_NAME_COLLAPSED);
        }

        elem.setAttribute('aria-expanded', isOpen);
      });
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const _config = {};

        if (typeof config === 'string' && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        const data = Collapse.getOrCreateInstance(this, _config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
      event.preventDefault();
    }

    /**
     * Toggles the visibility of an element.
     *
     * This method checks the current visibility state of the element.
     * If the element is currently shown, it will be hidden;
     * if it is hidden, it will be shown.
     *
     * @throws {Error} Throws an error if the visibility state cannot be determined.
     *
     * @example
     * const element = new Element();
     * element.toggle(); // Toggles the visibility of the element
     */
    const selector = getSelectorFromElement(this);
    const selectorElements = SelectorEngine.find(selector);
    selectorElements.forEach(element => {
      Collapse.getOrCreateInstance(element, {
        toggle: false
      }).toggle();
    });
  });
  /**
   * Displays the collapsible element, transitioning it from a hidden state to a visible state.
   * This method handles the visibility of the current element and any active sibling elements,
   * ensuring that only one collapsible element is shown at a time within the same parent.
   *
   * @throws {Error} Throws an error if the element is already transitioning or shown.
   *
   * @fires EVENT_SHOW$5 - Triggered before the element is shown.
   * @fires EVENT_SHOWN$5 - Triggered after the element has been shown.
   *
   * @example
   * const collapsible = new Collapse(element);
   * collapsible.show();
   */
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Collapse to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Collapse);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$9 = 'dropdown';
  const DATA_KEY$8 = 'bs.dropdown';
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$4 = '.data-api';
  const ESCAPE_KEY$2 = 'Escape';
  const SPACE_KEY = 'Space';
  const TAB_KEY$1 = 'Tab';
  const ARROW_UP_KEY = 'ArrowUp';
  const ARROW_DOWN_KEY = 'ArrowDown';
  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
  const EVENT_HIDE$4 = `hide${EVENT_KEY$8}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$8}`;
  const EVENT_SHOW$4 = `show${EVENT_KEY$8}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$8}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$8}${DATA_API_KEY$4}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8}${DATA_API_KEY$4}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8}${DATA_API_KEY$4}`;
  const CLASS_NAME_SHOW$6 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPEND = 'dropend';
  const CLASS_NAME_DROPSTART = 'dropstart';
  const CLASS_NAME_NAVBAR = 'navbar';
  const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
  const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
  const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
  const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
  const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
  const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
  const Default$8 = {
    offset: [0, 2],
    boundary: 'clippingParents',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null,
    autoClose: true
  };
  const DefaultType$8 = {
    offset: '(array|string|function)',
    boundary: '(string|element)',
    reference: '(string|element|object)',
    display: 'string',
    popperConfig: '(null|object|function)',
    autoClose: '(boolean|string)'
  };
  /**
   * ------------------------------------------------------------------------
   /**
    * Hides the element by collapsing it, triggering necessary events and updating ARIA attributes.
    *
    * This method checks if the element is currently transitioning or if it is already hidden.
    * If not, it triggers the `EVENT_HIDE` event and proceeds to collapse the element.
    *
    * @throws {Error} Throws an error if the element is not found or if there is an issue with the transition.
    *
    * @example
    * const myElement = document.getElementById('myElement');
    * myElement.hide();
    */
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();
    } // Getters


    static get Default() {
      return Default$8;
    }

    static get DefaultType() {
      return DefaultType$8;
    }

    static get NAME() {
      return NAME$9;
    } // Public


    toggle() {
      return this._isShown() ? this.hide() : this.show();
    }

    show() {
      if (isDisabled(this._element) || this._isShown(this._menu)) {
        return;
      }

      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);

      if (showEvent.defaultPrevented) {
        return;
      }

      const parent = Dropdown.getParentFromElement(this._element); // Totally disable Popper for Dropdowns in Navbar

      if (this._inNavbar) {
        /**
         * Checks if the specified element is currently shown.
         *
         * This method determines whether the provided element has the
         * class indicating it is visible. If no element is provided,
         * it defaults to checking the instance's `_element`.
         *
         * @param {Element} [element=this._element] - The DOM element to check.
         * If not provided, the method will use the instance's `_element`.
         *
         * @returns {boolean} Returns `true` if the element is shown,
         * otherwise returns `false`.
         *
         * @example
         * const isVisible = instance._isShown();
         * console.log(isVisible); // true or false based on visibility
         */
        Manipulator.setDataAttribute(this._menu, 'popper', 'none');
      } else {
        this._createPopper(parent);
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      /**
       * Merges the default configuration with the provided configuration and
       * data attributes from the element. This function ensures that the
       * configuration is properly set up for further processing.
       *
       * @param {Object} config - The configuration object to be merged.
       * @param {boolean|string} [config.toggle] - A toggle option that can be
       * coerced from string values to boolean.
       * @param {Element|string} [config.parent] - The parent element or selector
       * string for the component.
       *
       * @returns {Object} The final configuration object after merging.
       *
       * @throws {TypeError} Throws an error if the provided configuration does
       * not match the expected types defined in DefaultType$9.
       *
       * @example
       * const finalConfig = _getConfig({ toggle: 'true', parent: '#myParent' });
       * // finalConfig will have toggle as true and parent as the corresponding
       * // DOM element.
       */
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
        [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      /**
       * Retrieves the dimension of the element based on its current class.
       *
       * This method checks if the element has a specific class that indicates
       * whether it is oriented horizontally or vertically. Depending on the
       * presence of this class, it returns either the width or height of the
       * element.
       *
       * @returns {number} The dimension of the element, either width or height.
       *
       * @throws {Error} Throws an error if the element is not defined or does not
       *                 have a valid class list.
       *
       * @example
       * const dimension = instance._getDimension();
       * console.log(dimension); // Outputs the width or height based on the class.
       */
      this._menu.classList.add(CLASS_NAME_SHOW$6);

      this._element.classList.add(CLASS_NAME_SHOW$6);

      /**
       * Initializes the child elements of the component based on the provided configuration.
       * This method checks if a parent element is defined in the configuration and, if so,
       * it finds all collapsible child elements within that parent. It also updates the ARIA
       * attributes and collapsed classes for elements that are not part of the found children.
       *
       * @private
       * @returns {void} This method does not return a value.
       *
       * @throws {Error} Throws an error if the configuration is invalid or if there are issues
       *                 accessing the parent element.
       *
       * @example
       * // Example usage within a class context:
       * this._initializeChildren();
       */
      EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
    }

    hide() {
      if (isDisabled(this._element) || !this._isShown(this._menu)) {
        return;
      }

      const relatedTarget = {
        relatedTarget: this._element
      };

      this._completeHide(relatedTarget);
    }

    /**
     * Updates the ARIA attributes and collapsed class for a given array of elements based on their open state.
     *
     * This method modifies the class list of each element in the provided array to reflect whether it is open or collapsed.
     * It also sets the 'aria-expanded' attribute to indicate the current state of the elements.
     *
     * @param {HTMLElement[]} triggerArray - An array of HTML elements to be updated.
     * @param {boolean} isOpen - A boolean indicating whether the elements should be marked as open (true) or collapsed (false).
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * const elements = document.querySelectorAll('.trigger');
     * _addAriaAndCollapsedClass(elements, true); // Marks elements as open
     * _addAriaAndCollapsedClass(elements, false); // Marks elements as collapsed
     *
     * @throws {TypeError} Throws an error if triggerArray is not an array of HTMLElements.
     */
    dispose() {
      if (this._popper) {
        this._popper.destroy();
      }

      super.dispose();
    }

    update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper) {
        this._popper.update();
      }
    } // Private


    /**
     * Static method that acts as an interface for jQuery to manage the collapse component.
     * This method allows for the execution of specific methods on the collapse instance
     * based on the provided configuration string.
     *
     * @static
     * @param {string|Object} config - The configuration for the collapse instance.
     *                                  It can be a string representing a method name
     *                                  (e.g., 'show' or 'hide') or an object with options.
     * @returns {jQuery} The jQuery object for chaining.
     *
     * @throws {TypeError} Throws an error if the provided config string does not correspond
     *                     to a valid method of the collapse instance.
     *
     * @example
     * // To show the collapse component
     * $('.collapse').jQueryInterface('show');
     *
     * // To hide the collapse component
     * $('.collapse').jQueryInterface('hide');
     *
     * // To initialize with custom options
     * $('.collapse').jQueryInterface({ toggle: true });
     */
    _completeHide(relatedTarget) {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);

      if (hideEvent.defaultPrevented) {
        return;
      } // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', noop));
      }

      if (this._popper) {
        this._popper.destroy();
      }

      this._menu.classList.remove(CLASS_NAME_SHOW$6);

      this._element.classList.remove(CLASS_NAME_SHOW$6);

      this._element.setAttribute('aria-expanded', 'false');

      Manipulator.removeDataAttribute(this._menu, 'popper');
      EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
    }

    _getConfig(config) {
      config = { ...this.constructor.Default,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      };
      typeCheckConfig(NAME$9, config, this.constructor.DefaultType);

      if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
        // Popper virtual elements require a getBoundingClientRect method
        throw new TypeError(`${NAME$9.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
      }

      return config;
    }

    _createPopper(parent) {
      if (typeof Popper__namespace === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
      }

      let referenceElement = this._element;

      if (this._config.reference === 'parent') {
        referenceElement = parent;
      } else if (isElement(this._config.reference)) {
        referenceElement = getElement(this._config.reference);
      } else if (typeof this._config.reference === 'object') {
        referenceElement = this._config.reference;
      }

      const popperConfig = this._getPopperConfig();

      const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
      this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);

      if (isDisplayStatic) {
        Manipulator.setDataAttribute(this._menu, 'popper', 'static');
      }
    }

    _isShown(element = this._element) {
      return element.classList.contains(CLASS_NAME_SHOW$6);
    }

    _getMenuElement() {
      return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
    }

    _getPlacement() {
      const parentDropdown = this._element.parentNode;

      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
        return PLACEMENT_RIGHT;
      }

      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
        return PLACEMENT_LEFT;
      } // We need to trim the value because custom properties can also include spaces


      const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      }

      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    }

    _detectNavbar() {
      return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _getPopperConfig() {
      const defaultBsPopperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }]
      }; // Disable Popper if we have a static display

      if (this._config.display === 'static') {
        defaultBsPopperConfig.modifiers = [{
          name: 'applyStyles',
          enabled: false
        }];
      }

      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    /**
     * Toggles the visibility of an element.
     * If the element is currently shown, it will be hidden;
     * if it is hidden, it will be shown.
     *
     * @returns {boolean} Returns true if the element is now shown,
     *                   otherwise false.
     *
     * @throws {Error} Throws an error if the visibility state cannot be determined.
     *
     * @example
     * const isVisible = toggle();
     * console.log(isVisible); // Outputs: true or false based on the new visibility state.
     */
    }

    _selectMenuItem({
      key,
      /**
       * Displays the dropdown menu associated with the element.
       *
       * This method checks if the dropdown is disabled or already shown. If not, it triggers a show event,
       * updates the necessary attributes and classes, and handles touch-enabled devices by adding mouseover
       * listeners to prevent issues with event delegation on iOS.
       *
       * @throws {Error} Throws an error if the element is not properly initialized.
       *
       * @returns {void} This method does not return a value.
       *
       * @example
       * const dropdown = new Dropdown(element);
       * dropdown.show();
       */
      target
    }) {
      const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);

      if (!items.length) {
        return;
      } // if target isn't included in items (e.g. when expanding the dropdown)
      // allow cycling to get the last item in case key equals ARROW_UP_KEY


      getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Dropdown.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      });
    }

    static clearMenus(event) {
      if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1)) {
        return;
      }

      const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);

      for (let i = 0, len = toggles.length; i < len; i++) {
        const context = Dropdown.getInstance(toggles[i]);

        if (!context || context._config.autoClose === false) {
          /**
           * Hides the associated menu element if it is currently shown and not disabled.
           *
           * This method checks if the element is disabled or if the menu is not shown.
           * If either condition is true, the method exits early without performing any action.
           * If the menu is shown, it triggers the hiding process by calling the
           * `_completeHide` method with a related target object.
           *
           * @throws {Error} Throws an error if there is an issue during the hide process.
           *
           * @example
           * // Example usage of hide method
           * const menu = new Menu();
           * menu.hide();
           */
          continue;
        }

        if (!context._isShown()) {
          continue;
        }

        const relatedTarget = {
          relatedTarget: context._element
        };

        if (event) {
          /**
           * Cleans up and releases resources associated with the instance.
           * This method ensures that any popper instance is properly destroyed
           * before calling the superclass's dispose method.
           *
           * @throws {Error} Throws an error if the disposal process fails.
           *
           * @example
           * const instance = new MyClass();
           * instance.dispose();
           */
          const composedPath = event.composedPath();
          const isMenuTarget = composedPath.includes(context._menu);

          if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
            continue;
          } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


          /**
           * Updates the state of the component, specifically checking for changes in the navigation bar
           * and updating the popper instance if it exists.
           *
           * This method performs the following actions:
           * - Detects if the component is currently in a navigation bar.
           * - If a popper instance is present, it calls the update method on that instance to refresh its position.
           *
           * @throws {Error} Throws an error if the popper instance is not initialized correctly.
           *
           * @example
           * const component = new SomeComponent();
           * component.update();
           */
          if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
            continue;
          }

          if (event.type === 'click') {
            relatedTarget.clickEvent = event;
          }
        }

        /**
         * Hides the associated menu and performs necessary cleanup actions.
         * This method triggers a hide event and removes any associated event listeners.
         * It also updates the ARIA attributes and class names to reflect the hidden state.
         *
         * @param {Element} relatedTarget - The element that triggered the hide action.
         * @throws {Error} Throws an error if the hide event is prevented.
         *
         * @example
         * const menu = new Menu();
         * menu._completeHide(document.getElementById('triggerElement'));
         */
        context._completeHide(relatedTarget);
      }
    }

    static getParentFromElement(element) {
      return getElementFromSelector(element) || element.parentNode;
    }

    static dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
        return;
      }

      const isActive = this.classList.contains(CLASS_NAME_SHOW$6);

      if (!isActive && event.key === ESCAPE_KEY$2) {
        return;
      }

      event.preventDefault();
      /**
       * Merges the provided configuration object with default settings and data attributes from the element.
       * Validates the configuration to ensure it meets the expected types and structure.
       *
       * @param {Object} config - The configuration object to be merged with defaults.
       * @returns {Object} The merged configuration object.
       * @throws {TypeError} Throws an error if the "reference" option is an object that does not have a
       *                     `getBoundingClientRect` method, which is required for Popper virtual elements.
       *
       * @example
       * const config = _getConfig({
       *   reference: someElement
       * });
       *
       * @example
       * // Throws TypeError if reference is an object without getBoundingClientRect method
       * const config = _getConfig({
       *   reference: {}
       * });
       */
      event.stopPropagation();

      if (isDisabled(this)) {
        return;
      }

      const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
      const instance = Dropdown.getOrCreateInstance(getToggleButton);

      if (event.key === ESCAPE_KEY$2) {
        instance.hide();
        return;
      }

      if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
        /**
         * Creates a Popper instance for the dropdown menu.
         *
         * This method initializes the Popper.js library to manage the positioning of the dropdown menu
         * relative to its reference element. It checks for the existence of the Popper library and throws
         * an error if it is not available. The reference element can be specified as 'parent', an HTML
         * element, or an object.
         *
         * @param {Element} parent - The parent element to which the dropdown is attached.
         * @throws {TypeError} Throws an error if Popper.js is not defined.
         *
         * @returns {void} This method does not return a value.
         *
         * @example
         * // Assuming 'dropdown' is an instance of a dropdown component
         * dropdown._createPopper(document.getElementById('parent-element'));
         *
         * @see {@link https://popper.js.org} for more information on Popper.js.
         */
        if (!isActive) {
          instance.show();
        }

        instance._selectMenuItem(event);

        return;
      }

      if (!isActive || event.key === SPACE_KEY) {
        Dropdown.clearMenus();
      }
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
  /**
   * Determines whether the specified element is currently shown.
   *
   * This method checks if the provided element has the class name
   * that indicates it is visible. If no element is provided, it defaults
   * to checking the instance's internal element.
   *
   * @param {Element} [element=this._element] - The DOM element to check.
   * If not provided, the method will check the instance's internal element.
   * @returns {boolean} Returns true if the element is shown (i.e., has the
   * class indicating visibility), otherwise false.
   *
   * @example
   * const isVisible = instance._isShown(someElement);
   * console.log(isVisible); // true or false based on the element's visibility
   */
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    event.preventDefault();
    Dropdown.getOrCreateInstance(this).toggle();
  /**
   * Retrieves the next menu element in the DOM relative to the current element.
   *
   * This method utilizes the SelectorEngine to find the next element that matches
   * the specified menu selector. It is primarily used for navigation within a menu
   * structure, ensuring that the correct element is accessed based on the current context.
   *
   * @returns {Element|null} The next menu element if found, otherwise null.
   *
   * @throws {Error} Throws an error if the selector is invalid or if there is an issue
   *                 with the SelectorEngine.
   *
   * @example
   * const menuElement = instance._getMenuElement();
   * if (menuElement) {
   *   console.log('Found menu element:', menuElement);
   * } else {
   *   console.log('No menu element found.');
   * }
   */
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   /**
    * Determines the placement of a dropdown menu based on its parent element's class and computed styles.
    *
    * This method checks the parent dropdown's class list to ascertain its position. It evaluates specific classes
    * that indicate the dropdown's alignment (e.g., dropend, dropstart, dropup) and retrieves the computed style
    * for a custom property that may influence the placement.
    *
    * @returns {string} The placement of the dropdown, which can be one of the following:
    * - 'right' if the parent has the dropend class.
    * - 'left' if the parent has the dropstart class.
    * - 'topend' or 'top' if the parent has the dropup class, depending on the computed style.
    * - 'bottomend' or 'bottom' otherwise, also depending on the computed style.
    *
    * @throws {Error} Throws an error if the parent element is not found or does not have a valid class list.
    *
    * @example
    * const placement = this._getPlacement();
    * console.log(placement); // Outputs the determined placement of the dropdown.
    */
   * ------------------------------------------------------------------------
   * add .Dropdown to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Dropdown);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';

  class ScrollBarHelper {
    constructor() {
      this._element = document.body;
    }

    getWidth() {
      /**
       * Checks if the current element is within a navbar.
       *
       * This method traverses up the DOM tree from the current element to determine
       * if it is contained within an element that has the class name associated with a navbar.
       *
       * @returns {boolean} Returns true if the element is within a navbar, otherwise false.
       *
       * @example
       * const isInNavbar = instance._detectNavbar();
       * console.log(isInNavbar); // true or false based on the element's position in the DOM.
       */
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    }
/**
 * Retrieves the offset configuration for the element.
 *
 * This method checks the type of the offset configuration and returns it accordingly.
 * If the offset is a string, it splits the string by commas and converts each value to an integer.
 * If the offset is a function, it returns a new function that takes `popperData` as an argument
 * and calls the original offset function with `popperData` and the element.
 * If the offset is neither a string nor a function, it returns the offset directly.
 *
 * @returns {(number[]|function): (number[]|function)} - The parsed offset as an array of numbers,
 * or a function that can be called with popperData to compute the offset.
 *
 * @throws {TypeError} - Throws an error if the offset is of an unsupported type.
 *
 * @example
 * // Example usage when offset is a string
 * const offset = this._getOffset(); // returns [10, 20] if offset was '10,20'
 *
 * // Example usage when offset is a function
 * const offsetFunc = this._getOffset();
 * const computedOffset = offsetFunc(popperData); // computes the offset based on popperData
 */

    hide() {
      const width = this.getWidth();

      this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


      this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


      this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

      this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
    }

    _disableOverFlow() {
      /**
       * Retrieves the configuration object for Popper.js.
       * This method constructs a default configuration based on the current instance's settings,
       * including placement and modifiers for handling overflow and offsets.
       *
       * If the display configuration is set to 'static', the 'applyStyles' modifier is disabled
       * to prevent Popper from applying styles dynamically.
       *
       * Additionally, if a custom Popper configuration is provided as a function or an object,
       * it will be merged with the default configuration.
       *
       * @returns {Object} The complete Popper configuration object.
       *
       * @throws {TypeError} Throws an error if the provided popperConfig is not a function or an object.
       *
       * @example
       * const popperConfig = instance._getPopperConfig();
       * console.log(popperConfig);
       */
      this._saveInitialAttribute(this._element, 'overflow');

      this._element.style.overflow = 'hidden';
    }

    _setElementAttributes(selector, styleProp, callback) {
      const scrollbarWidth = this.getWidth();

      /**
       * A callback function that manipulates the style property of a given DOM element.
       *
       * This function checks if the provided element is different from the current element
       * and whether the window's inner width is greater than the element's client width plus
       * the scrollbar width. If both conditions are met, it returns early without making any changes.
       *
       * If the conditions are not met, it saves the initial attribute of the element and then
       * calculates the current value of the specified style property. The calculated value is then
       * passed through a callback function, and the result is applied back to the element's style.
       *
       * @param {HTMLElement} element - The DOM element whose style property is to be manipulated.
       * @param {string} styleProp - The style property to be modified (e.g., 'width', 'height').
       * @param {function} callback - A function that takes a number and returns a modified value.
       *
       * @throws {TypeError} Throws an error if the provided element is not an instance of HTMLElement.
       *
       * @example
       * // Example usage:
       * manipulationCallBack(document.getElementById('myElement'), 'width', value => value * 2);
       /**
        * Selects the next menu item based on the provided key and target element.
        *
        * This method filters the visible items in the menu and determines the next active element
        * to focus on based on the key pressed (either ARROW_DOWN_KEY or ARROW_UP_KEY).
        * If the target is not included in the visible items, it allows cycling through the items.
        *
        * @param {Object} options - The options for selecting the menu item.
        * @param {string} options.key - The key that was pressed (e.g., ARROW_DOWN_KEY or ARROW_UP_KEY).
        * @param {HTMLElement} options.target - The current target element that is focused.
        *
        * @returns {void} This method does not return a value.
        *
        * @throws {Error} Throws an error if the key is not recognized.
        *
        * @example
        * // Example usage of _selectMenuItem
        * _selectMenuItem({ key: ARROW_DOWN_KEY, target: currentFocusedElement });
        */
       */
      const manipulationCallBack = element => {
        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
          return;
        }

        this._saveInitialAttribute(element, styleProp);

        const calculatedValue = window.getComputedStyle(element)[styleProp];
        element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
      };

      this._applyManipulationCallback(selector, manipulationCallBack);
    }

    reset() {
      /**
       * A static method that acts as an interface for the Dropdown component.
       * It allows the invocation of methods on the Dropdown instance based on the provided configuration.
       *
       * @static
       * @param {string|Object} config - The configuration for the Dropdown instance.
       *                                  If a string is provided, it is treated as a method name to be invoked.
       * @returns {jQuery} Returns the jQuery object for chaining.
       *
       * @throws {TypeError} Throws an error if the provided config is a string and does not correspond to a valid method.
       *
       * @example
       * // Initialize a Dropdown instance with default settings
       * $('.dropdown').Dropdown('init');
       *
       * // Invoke a specific method on the Dropdown instance
       * $('.dropdown').Dropdown('toggle');
       *
       * // Throws TypeError if the method does not exist
       * $('.dropdown').Dropdown('nonExistentMethod'); // TypeError: No method named "nonExistentMethod"
       */
      this._resetElementAttributes(this._element, 'overflow');

      this._resetElementAttributes(this._element, 'paddingRight');

      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
    }

    _saveInitialAttribute(element, styleProp) {
      const actualValue = element.style[styleProp];

      if (actualValue) {
        Manipulator.setDataAttribute(element, styleProp, actualValue);
      }
    }
/**
 * Closes all open dropdown menus in response to a user event.
 * This method checks the type of event and the context of the dropdown
 * to determine whether to close the menu or not.
 *
 * @static
 * @param {Event} event - The event that triggered the menu closure.
 *                        This can be a mouse click or keyboard event.
 *                        If the event is a right-click or a keyup event
 *                        with the TAB key, the function will return early
 *                        without closing any menus.
 * @returns {void}
 *
 * @throws {TypeError} Throws an error if the event is not of type Event.
 *
 * @example
 * // Example usage:
 * document.addEventListener('click', clearMenus);
 * document.addEventListener('keyup', clearMenus);
 */

    _resetElementAttributes(selector, styleProp) {
      /**
       * A callback function that manipulates the style of a given HTML element based on its data attributes.
       *
       * This function retrieves the value of a specified data attribute from the element. If the value is undefined,
       * it removes the corresponding CSS property from the element's style. If the value is defined, it removes the
       * data attribute and sets the CSS property to the retrieved value.
       *
       * @param {HTMLElement} element - The HTML element whose style is to be manipulated.
       * @throws {TypeError} Throws an error if the provided element is not an instance of HTMLElement.
       *
       * @example
       * const myElement = document.getElementById('myElement');
       * manipulationCallBack(myElement);
       */
      const manipulationCallBack = element => {
        const value = Manipulator.getDataAttribute(element, styleProp);

        if (typeof value === 'undefined') {
          element.style.removeProperty(styleProp);
        } else {
          Manipulator.removeDataAttribute(element, styleProp);
          element.style[styleProp] = value;
        }
      };

      this._applyManipulationCallback(selector, manipulationCallBack);
    }

    _applyManipulationCallback(selector, callBack) {
      if (isElement(selector)) {
        callBack(selector);
      } else {
        SelectorEngine.find(selector, this._element).forEach(callBack);
      }
    }

    isOverflowing() {
      return this.getWidth() > 0;
    }

  }

  /**
   * Retrieves the parent element of a given DOM element.
   * If the element is a valid selector, it attempts to get the corresponding
   * element from the selector. If no element is found, it falls back to
   * returning the parent node of the provided element.
   *
   * @static
   * @param {Element} element - The DOM element from which to retrieve the parent.
   * @returns {Element} The parent element or the element itself if no parent exists.
   *
   * @example
   * const parent = MyClass.getParentFromElement(someElement);
   * console.log(parent); // Logs the parent element or the element itself.
   *
   * @throws {TypeError} Throws an error if the provided argument is not a valid DOM element.
   */
  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   /**
    * Handles keydown events for dropdown menus, managing the visibility and selection of menu items based on user input.
    *
    * This method checks the type of element that triggered the event and determines whether the key pressed corresponds to dropdown commands.
    * It prevents default actions and stops event propagation when necessary.
    *
    * @param {KeyboardEvent} event - The keyboard event triggered by the user.
    *
    * @returns {void} This function does not return a value.
    *
    * @throws {Error} Throws an error if the dropdown instance cannot be created.
    *
    * @example
    * // Example usage within an event listener
    * document.addEventListener('keydown', (event) => {
    *   MyDropdown.dataApiKeydownHandler(event);
    * });
    *
    * @description
    * The method performs the following checks:
    * - If the target is not an input or textarea, it verifies if the key is part of a predefined set of keys for dropdown commands.
    * - If the target is an input or textarea, it checks for specific keys (SPACE, ESCAPE, ARROW_UP, ARROW_DOWN) to determine dropdown behavior.
    * - It manages the visibility of the dropdown and selects menu items accordingly.
    */
   * --------------------------------------------------------------------------
   */
  const Default$7 = {
    className: 'modal-backdrop',
    isVisible: true,
    // if false, we use the backdrop helper without adding any element to the dom
    isAnimated: false,
    rootElement: 'body',
    // give the choice to place backdrop under different elements
    clickCallback: null
  };
  const DefaultType$7 = {
    className: 'string',
    isVisible: 'boolean',
    isAnimated: 'boolean',
    rootElement: '(element|string)',
    clickCallback: '(function|null)'
  };
  const NAME$8 = 'backdrop';
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$5 = 'show';
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$8}`;

  class Backdrop {
    constructor(config) {
      this._config = this._getConfig(config);
      this._isAppended = false;
      this._element = null;
    }

    show(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }

      this._append();

      if (this._config.isAnimated) {
        reflow(this._getElement());
      }

      this._getElement().classList.add(CLASS_NAME_SHOW$5);

      this._emulateAnimation(() => {
        execute(callback);
      });
    }

    hide(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }

      this._getElement().classList.remove(CLASS_NAME_SHOW$5);

      this._emulateAnimation(() => {
        this.dispose();
        execute(callback);
      });
    } // Private


    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement('div');
        backdrop.className = this._config.className;

        if (this._config.isAnimated) {
          backdrop.classList.add(CLASS_NAME_FADE$4);
        }

        this._element = backdrop;
      }

      return this._element;
    }

    _getConfig(config) {
      config = { ...Default$7,
        ...(typeof config === 'object' ? config : {})
      }; // use getElement() with the default "body" to get a fresh Element on each instantiation

      config.rootElement = getElement(config.rootElement);
      typeCheckConfig(NAME$8, config, DefaultType$7);
      return config;
    /**
     * Calculates the difference between the window's inner width and the document's client width.
     * This function is useful for determining the width of the viewport that is not covered by the document.
     *
     * @returns {number} The absolute difference in pixels between the window's inner width and the document's client width.
     *
     * @example
     * const widthDifference = getWidth();
     * console.log(`The width difference is: ${widthDifference}px`);
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes} for more information on innerWidth usage.
     */
    }

    _append() {
      if (this._isAppended) {
        return;
      }
/**
 * Hides the element by adjusting its overflow and padding/margin properties.
 * This method calculates the width of the scrollbar and applies necessary
 * adjustments to maintain the layout of sticky elements.
 *
 * It performs the following operations:
 * - Disables overflow on the element to prevent scrolling.
 * - Adjusts the `paddingRight` of the main element and fixed content
 *   to account for the scrollbar width.
 * - Adjusts the `marginRight` of sticky content to ensure it remains
 *   fully visible.
 *
 * @throws {Error} Throws an error if the element is not properly initialized
 *                 or if any of the attribute adjustments fail.
 *
 * @example
 * const myElement = new MyElement();
 * myElement.hide();
 */

      this._config.rootElement.append(this._getElement());

      EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
      });
      this._isAppended = true;
    }

    dispose() {
      if (!this._isAppended) {
        return;
      }

      /**
       * Disables the overflow of the associated element by setting its overflow style to 'hidden'.
       * This method also saves the initial overflow attribute of the element for potential restoration.
       *
       * @private
       * @method _disableOverFlow
       * @returns {void}
       *
       * @throws {Error} Throws an error if the element is not defined or if the style cannot be modified.
       *
       * @example
       * // Assuming 'this' refers to an instance of a class that contains the _element property
       * this._disableOverFlow();
       */
      EventHandler.off(this._element, EVENT_MOUSEDOWN);

      this._element.remove();

      this._isAppended = false;
    }
/**
 * Sets the specified style property for elements matching the given selector,
 * applying a transformation to the current value of that property using a callback function.
 *
 * @param {string} selector - A CSS selector string to match elements.
 * @param {string} styleProp - The CSS style property to modify (e.g., 'width', 'height').
 * @param {function} callback - A function that takes the current value of the style property
 *                              and returns a new value to be set.
 * @throws {Error} Throws an error if the selector does not match any elements.
 *
 * @example
 * // Example usage:
 * _setElementAttributes('.my-element', 'width', currentValue => currentValue + 20);
 *
 * This would increase the width of all elements with the class 'my-element' by 20 pixels.
 */

    _emulateAnimation(callback) {
      executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/focustrap.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  const Default$6 = {
    trapElement: null,
    // The element to trap focus inside of
    autofocus: true
  /**
   * Resets specific CSS attributes of the element and its related components.
   *
   * This method is responsible for restoring the default values of certain CSS properties
   * that may have been altered during the lifecycle of the component. It specifically targets
   * the 'overflow' and 'paddingRight' attributes of the main element, as well as the
   * 'paddingRight' of fixed content and 'marginRight' of sticky content.
   *
   * @throws {Error} Throws an error if the element or selectors are not defined.
   *
   * @example
   * const myComponent = new MyComponent();
   * myComponent.reset();
   * // This will reset the CSS attributes to their default values.
   */
  };
  const DefaultType$6 = {
    trapElement: 'element',
    autofocus: 'boolean'
  };
  const NAME$7 = 'focustrap';
  const DATA_KEY$7 = 'bs.focustrap';
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$7}`;
  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7}`;
  /**
   * Saves the initial value of a specified style property from an HTML element
   * into a data attribute for later retrieval.
   *
   * This function retrieves the current value of the specified style property
   * from the given element and, if it exists, stores it in a data attribute
   * using the Manipulator utility.
   *
   * @param {HTMLElement} element - The HTML element from which to retrieve the style property.
   * @param {string} styleProp - The name of the style property to be saved.
   *
   * @returns {void} This function does not return a value.
   *
   * @throws {TypeError} Throws an error if the provided element is not an instance of HTMLElement.
   *
   * @example
   * const myElement = document.getElementById('myElement');
   * _saveInitialAttribute(myElement, 'color');
   */
  const TAB_KEY = 'Tab';
  const TAB_NAV_FORWARD = 'forward';
  const TAB_NAV_BACKWARD = 'backward';

  class FocusTrap {
    constructor(config) {
      this._config = this._getConfig(config);
      this._isActive = false;
      /**
       * Resets the specified style property of elements selected by the given selector.
       * If the style property has a corresponding data attribute, it applies that value to the element's style.
       * If the data attribute is not defined, it removes the style property from the element.
       *
       * @param {string} selector - The CSS selector used to select the elements whose style properties will be reset.
       * @param {string} styleProp - The name of the style property to reset (e.g., 'color', 'background-color').
       *
       * @throws {Error} Throws an error if the selector is invalid or if there are issues applying the manipulation callback.
       *
       * @example
       * // Reset the background color of all elements with the class 'my-element'
       * _resetElementAttributes('.my-element', 'background-color');
       */
      this._lastTabNavDirection = null;
    }

    activate() {
      const {
        trapElement,
        autofocus
      } = this._config;

      if (this._isActive) {
        return;
      }

      if (autofocus) {
        trapElement.focus();
      /**
       * Applies a callback function to a specified element or elements selected by a given selector.
       * If the selector corresponds to a single element, the callback is invoked directly on that element.
       * If the selector corresponds to multiple elements, the callback is invoked on each of those elements.
       *
       * @param {string|Element} selector - The selector string or an element to which the callback will be applied.
       * @param {Function} callBack - The function to be executed for each selected element.
       *
       * @throws {TypeError} Throws an error if the selector is not a valid string or element.
       *
       * @example
       * // Example usage with a single element
       * _applyManipulationCallback(document.getElementById('myElement'), (el) => {
       *   el.style.color = 'red';
       * });
       *
       * // Example usage with a selector string
       * _applyManipulationCallback('.myClass', (el) => {
       *   el.style.backgroundColor = 'blue';
       * });
       */
      }

      EventHandler.off(document, EVENT_KEY$7); // guard against infinite focus loop

      EventHandler.on(document, EVENT_FOCUSIN$1, event => this._handleFocusin(event));
      EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
      this._isActive = true;
    }
/**
 * Determines if the current width is greater than zero.
 *
 * This method checks if the width of the element or object is
 * considered overflowing based on a simple condition. It returns
 * a boolean value indicating whether the width is greater than zero.
 *
 * @returns {boolean} True if the width is greater than zero,
 *                    otherwise false.
 *
 * @example
 * const element = new SomeElement();
 * if (element.isOverflowing()) {
 *   console.log('The element is overflowing.');
 * } else {
 *   console.log('The element is not overflowing.');
 * }
 */

    deactivate() {
      if (!this._isActive) {
        return;
      }

      this._isActive = false;
      EventHandler.off(document, EVENT_KEY$7);
    } // Private


    _handleFocusin(event) {
      const {
        target
      } = event;
      const {
        trapElement
      } = this._config;

      if (target === document || target === trapElement || trapElement.contains(target)) {
        return;
      }

      const elements = SelectorEngine.focusableChildren(trapElement);

      if (elements.length === 0) {
        trapElement.focus();
      } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
        elements[elements.length - 1].focus();
      } else {
        elements[0].focus();
      }
    }

    _handleKeydown(event) {
      if (event.key !== TAB_KEY) {
        return;
      }

      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
    /**
     * Displays an element based on the current configuration.
     *
     * This method checks if the element is visible according to the configuration.
     * If it is not visible, it executes the provided callback immediately. If it is
     * visible, it appends the element to the DOM and applies animation if configured.
     *
     * @param {Function} callback - A function to be executed after the show operation.
     *
     * @returns {void}
     *
     * @throws {Error} Throws an error if the callback is not a function.
     *
     * @example
     * // Example usage of the show method
     * instance.show(() => {
     *   console.log('Element is now visible.');
     * });
     */
    }

    _getConfig(config) {
      config = { ...Default$6,
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$7, config, DefaultType$6);
      return config;
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   /**
    * Hides the element associated with the instance.
    *
    * This method removes the visible class from the element and
    * triggers an animation to hide it. Once the animation is complete,
    * it disposes of the element and executes the provided callback function.
    *
    * @param {Function} callback - The function to execute after the element is hidden.
    *
    * @throws {Error} Throws an error if the element is not currently visible.
    *
    * @example
    * // Example usage of the hide method
    * instance.hide(() => {
    *   console.log('Element is now hidden.');
    * });
    */
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$6 = 'modal';
  const DATA_KEY$6 = 'bs.modal';
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = '.data-api';
  const ESCAPE_KEY$1 = 'Escape';
  const Default$5 = {
    backdrop: true,
    keyboard: true,
    focus: true
  };
  /**
   * Retrieves the backdrop element for the component. If the element does not exist, it creates a new one.
   *
   * This method checks if the `_element` property is already set. If it is not, it creates a new `div` element,
   * assigns it a class name based on the configuration, and adds an animation class if specified in the configuration.
   *
   * @returns {HTMLElement} The backdrop element associated with the component.
   *
   * @throws {Error} Throws an error if the configuration is invalid or if the element cannot be created.
   *
   * @example
   * const backdrop = instance._getElement();
   * console.log(backdrop); // Logs the backdrop element to the console.
   */
  const DefaultType$5 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean'
  };
  const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$6}`;
  const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
  /**
   * Retrieves and merges the configuration object with default values.
   * This function ensures that the provided configuration is valid and
   * returns a complete configuration object ready for use.
   *
   * @param {Object} config - The user-defined configuration object.
   *                          If not provided or not an object, defaults will be used.
   * @returns {Object} The merged configuration object containing default values
   *                  and any user-defined properties.
   *
   * @throws {TypeError} Throws an error if the provided config is not an object
   *                     when expected.
   *
   * @example
   * const userConfig = { rootElement: '#myElement' };
   * const finalConfig = _getConfig(userConfig);
   * // finalConfig will contain properties from Default$7 and userConfig.
   */
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_SHOW$4 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  /**
   * ------------------------------------------------------------------------
   /**
    * Appends the element to the root element if it has not been appended already.
    * This method also sets up an event listener for mouse down events on the element,
    * which triggers a specified callback function.
    *
    * @throws {Error} Throws an error if the root element is not defined in the configuration.
    *
    * @returns {void} This method does not return a value.
    *
    * @example
    * // Assuming the instance has been properly initialized and configured
    * instance._append();
    */
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Modal extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();
      this._isShown = false;
      this._ignoreBackdropClick = false;
      /**
       * Disposes of the current instance by removing the associated element
       * from the DOM and cleaning up event listeners.
       *
       * This method checks if the element has been appended to the DOM before
       * attempting to remove it. If the element is not appended, the method
       * exits early without performing any actions.
       *
       * @throws {Error} Throws an error if there is an issue during the removal
       *                 process (e.g., if the element is not found).
       *
       * @example
       * const instance = new SomeClass();
       * instance.dispose(); // Safely disposes of the instance if it was appended.
       */
      this._isTransitioning = false;
      this._scrollBar = new ScrollBarHelper();
    } // Getters


    static get Default() {
      return Default$5;
    }

    static get NAME() {
      return NAME$6;
    } // Public
/**
 * Emulates an animation by executing a callback function after a transition.
 *
 * This method ensures that the provided callback is executed only after the
 * transition of the associated element has completed, taking into account whether
 * the animation is enabled in the configuration.
 *
 * @param {Function} callback - The function to be executed after the transition.
 * @throws {Error} Throws an error if the callback is not a function.
 *
 * @example
 * // Example usage of _emulateAnimation
 * this._emulateAnimation(() => {
 *   console.log('Animation completed!');
 * });
 */


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget
      });

      if (showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;

      if (this._isAnimated()) {
        this._isTransitioning = true;
      }

      this._scrollBar.hide();

      document.body.classList.add(CLASS_NAME_OPEN);

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
        EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
          /**
           * Activates the focus trap, preventing focus from leaving the specified element.
           * If autofocus is enabled, it will focus on the trap element immediately upon activation.
           *
           * @throws {Error} Throws an error if the activation fails due to an internal issue.
           *
           * @example
           * const focusTrap = new FocusTrap(config);
           * focusTrap.activate();
           */
          if (event.target === this._element) {
            this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(() => this._showElement(relatedTarget));
    }

    hide() {
      if (!this._isShown || this._isTransitioning) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

      if (hideEvent.defaultPrevented) {
        return;
      }

      this._isShown = false;
/**
 * Deactivates the current instance, setting its active state to false.
 * If the instance is already inactive, the method will return early without making any changes.
 *
 * This method also removes any event listeners associated with the instance to prevent further interactions.
 *
 * @throws {Error} Throws an error if the event handler fails to unregister.
 *
 * @example
 * const instance = new MyClass();
 * instance.deactivate(); // Deactivates the instance
 */

      const isAnimated = this._isAnimated();

      if (isAnimated) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();
/**
 * Handles the focus-in event for the trap element.
 * This method determines the appropriate focus target based on the event's target
 * and the current tab navigation direction.
 *
 * @param {FocusEvent} event - The focus event triggered by user interaction.
 * @throws {Error} Throws an error if the event is not a valid FocusEvent.
 *
 * @returns {void} This method does not return a value.
 *
 * @example
 * // Example usage within a class context
 * this._handleFocusin(event);
 *
 * @description
 * The method checks if the event's target is either the document, the trap element,
 * or a child of the trap element. If so, it returns early. If there are no focusable
 * children within the trap element, it sets focus to the trap element itself.
 * Depending on the last tab navigation direction, it either focuses the last or
 * first focusable child element.
 */

      this._focustrap.deactivate();

      this._element.classList.remove(CLASS_NAME_SHOW$4);

      EventHandler.off(this._element, EVENT_CLICK_DISMISS);
      EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

      this._queueCallback(() => this._hideModal(), this._element, isAnimated);
    }

    dispose() {
      [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));

      this._backdrop.dispose();

      this._focustrap.deactivate();

      super.dispose();
    }

    handleUpdate() {
      this._adjustDialog();
    /**
     * Handles the keydown event for tab navigation.
     *
     * This method checks if the pressed key is the Tab key. If it is, it determines
     * the navigation direction based on whether the Shift key is also pressed.
     *
     * @param {KeyboardEvent} event - The keyboard event triggered by the keydown action.
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * // Example usage:
     * document.addEventListener('keydown', this._handleKeydown.bind(this));
     *
     * @throws {TypeError} Throws an error if the event parameter is not a KeyboardEvent.
     */
    } // Private


    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        // 'static' option will be translated to true, and booleans will keep their value
        isAnimated: this._isAnimated()
      /**
       * Merges the provided configuration object with default settings.
       * This function ensures that the resulting configuration adheres to the expected types.
       *
       * @param {Object} config - The configuration object to merge with defaults.
       *                           If the provided value is not an object, it will be ignored.
       * @returns {Object} The merged configuration object containing default values
       *                  and any specified overrides from the input config.
       *
       * @throws {TypeError} Throws an error if the provided config does not match
       *                     the expected type structure defined in DefaultType$6.
       *
       * @example
       * const userConfig = { option1: true, option2: 'custom' };
       * const finalConfig = _getConfig(userConfig);
       * // finalConfig will contain default values for any missing options,
       * // merged with userConfig values.
       */
      });
    }

    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }

    _getConfig(config) {
      config = { ...Default$5,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$6, config, DefaultType$5);
      return config;
    }

    _showElement(relatedTarget) {
      const isAnimated = this._isAnimated();

      const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.append(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.scrollTop = 0;

      if (modalBody) {
        modalBody.scrollTop = 0;
      }

      if (isAnimated) {
        reflow(this._element);
      }

      this._element.classList.add(CLASS_NAME_SHOW$4);

      /**
       * Handles the completion of a transition effect.
       *
       * This function checks if the focus configuration is enabled and activates
       * the focus trap if necessary. It also updates the transition state and
       * triggers an event to notify that the transition has completed.
       *
       * @returns {void} This function does not return a value.
       *
       * @throws {Error} Throws an error if there is an issue with the transition process.
       *
       * @example
       * // Example of how to use transitionComplete in a transition context
       * transitionComplete();
       */
      const transitionComplete = () => {
        if (this._config.focus) {
          this._focustrap.activate();
        }

        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget
        });
      };

      this._queueCallback(transitionComplete, this._dialog, isAnimated);
    }

    _setEscapeEvent() {
      if (this._isShown) {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
          if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
            event.preventDefault();
            this.hide();
          } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
            /**
             * Toggles the visibility of an element.
             * If the element is currently shown, it will be hidden;
             * if it is hidden, it will be shown.
             *
             * @param {Element} relatedTarget - The element that is related to the toggle action.
             * This can be used to determine the context of the toggle.
             *
             * @returns {boolean} Returns true if the element is now shown, false otherwise.
             *
             * @throws {Error} Throws an error if the toggle action fails due to invalid state.
             *
             * @example
             * const element = document.getElementById('myElement');
             * const isVisible = toggle(element);
             * console.log(isVisible); // true if shown, false if hidden
             */
            this._triggerBackdropTransition();
          }
        });
      } else {
        /**
         * Displays the dialog element, triggering the appropriate events and managing the visibility state.
         *
         * @param {Element} relatedTarget - The element that triggered the show action.
         * @throws {Error} Throws an error if the dialog is already shown or transitioning.
         *
         * @example
         * const dialog = new Dialog();
         * dialog.show(document.getElementById('triggerElement'));
         *
         * @fires EVENT_SHOW - Triggered when the dialog is about to be shown.
         * @fires EVENT_MOUSEDOWN_DISMISS - Triggered when a mousedown event occurs on the dialog.
         *
         * @returns {void}
         */
        EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
      }
    }

    _setResizeEvent() {
      if (this._isShown) {
        EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
      } else {
        EventHandler.off(window, EVENT_RESIZE);
      }
    }

    _hideModal() {
      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._element.removeAttribute('role');

      this._isTransitioning = false;

      this._backdrop.hide(() => {
        document.body.classList.remove(CLASS_NAME_OPEN);

        this._resetAdjustments();

        this._scrollBar.reset();

        EventHandler.trigger(this._element, EVENT_HIDDEN$3);
      });
    }

    _showBackdrop(callback) {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS, event => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false;
          return;
        }
/**
 * Hides the modal element if it is currently shown and not transitioning.
 * This method triggers a hide event and performs necessary cleanup actions.
 *
 * @throws {Error} Throws an error if the modal is in an invalid state.
 *
 * @example
 * const modal = new Modal(element);
 * modal.hide();
 */

        if (event.target !== event.currentTarget) {
          return;
        }

        if (this._config.backdrop === true) {
          this.hide();
        } else if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
        }
      });

      this._backdrop.show(callback);
    }

    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_FADE$3);
    }

    _triggerBackdropTransition() {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);

      if (hideEvent.defaultPrevented) {
        return;
      }

      const {
        classList,
        scrollHeight,
        style
      } = this._element;
      const isModalOverflowing = scrollHeight > document.documentElement.clientHeight; // return if the following background transition hasn't yet completed

      /**
       * Cleans up and disposes of the component's resources.
       * This method removes event listeners from the specified HTML elements,
       * disposes of the backdrop, deactivates the focus trap, and calls the
       * superclass's dispose method to ensure proper cleanup.
       *
       * @throws {Error} Throws an error if the disposal process fails.
       *
       * @example
       * const component = new MyComponent();
       * component.dispose();
       */
      if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) {
        return;
      }

      if (!isModalOverflowing) {
        style.overflowY = 'hidden';
      }

      classList.add(CLASS_NAME_STATIC);

      /**
       * Handles the update process by adjusting the dialog.
       * This method is typically called when an update is required
       * to ensure that the dialog reflects the latest state or data.
       *
       * @throws {Error} Throws an error if the dialog adjustment fails.
       *
       * @example
       * // Example usage of handleUpdate
       * const instance = new SomeClass();
       * try {
       *   instance.handleUpdate();
       * } catch (error) {
       *   console.error('Failed to update dialog:', error);
       * }
       */
      this._queueCallback(() => {
        classList.remove(CLASS_NAME_STATIC);

        if (!isModalOverflowing) {
          this._queueCallback(() => {
            /**
             * Initializes a new Backdrop instance with the specified configuration.
             *
             * This method creates a backdrop that can be used to enhance the user interface
             * by providing a visual overlay. The backdrop's visibility and animation settings
             * are determined based on the current configuration.
             *
             * @returns {Backdrop} A new instance of the Backdrop class.
             *
             * @throws {Error} Throws an error if the backdrop configuration is invalid.
             *
             * @example
             * const backdrop = this._initializeBackDrop();
             * console.log(backdrop.isVisible); // true or false based on configuration
             */
            style.overflowY = '';
          }, this._dialog);
        }
      }, this._dialog);

      this._element.focus();
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    /**
     * Initializes a focus trap for the specified element.
     * A focus trap restricts the keyboard navigation to a specific part of the UI,
     * ensuring that users can only navigate within the designated area.
     *
     * @returns {FocusTrap} An instance of the FocusTrap class that manages focus
     * within the specified element.
     *
     * @throws {Error} Throws an error if the focus trap cannot be initialized
     * due to invalid parameters or state.
     *
     * @example
     * const focusTrap = this._initializeFocusTrap();
     * focusTrap.activate(); // Activates the focus trap, restricting focus to the element.
     */
    // ----------------------------------------------------------------------


    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      /**
       * Merges the default configuration with the provided configuration and
       * data attributes from the element.
       *
       * This method takes a configuration object, merges it with default values,
       * and returns the final configuration object. If the provided configuration
       * is not an object, it will be ignored.
       *
       * @param {Object} config - The configuration object to merge with defaults.
       * @returns {Object} The final merged configuration object.
       *
       * @throws {TypeError} Throws an error if the provided config is not of type
       * object when expected.
       *
       * @example
       * const finalConfig = _getConfig({ customSetting: true });
       * // finalConfig will contain default settings along with customSetting.
       */
      const scrollbarWidth = this._scrollBar.getWidth();

      const isBodyOverflowing = scrollbarWidth > 0;

      if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
        this._element.style.paddingLeft = `${scrollbarWidth}px`;
      }

      if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
        /**
         * Displays the modal element and sets appropriate ARIA attributes.
         *
         * This method ensures that the modal is correctly positioned in the DOM,
         * sets its visibility, and handles focus management. It also triggers
         * the 'shown' event once the transition is complete.
         *
         * @param {Element} relatedTarget - The element that triggered the modal display.
         *
         * @throws {Error} Throws an error if the modal element is not properly initialized.
         *
         * @example
         * // To show a modal when a button is clicked
         * button.addEventListener('click', () => {
         *   modalInstance._showElement(button);
         * });
         */
        this._element.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    } // Static


    static jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        const data = Modal.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](relatedTarget);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    EventHandler.one(target, EVENT_SHOW$3, showEvent => {
      if (showEvent.defaultPrevented) {
        // only register focus restorer if modal will actually get shown
        /**
         * Sets up the event listener for handling the escape key press.
         * This method is responsible for determining the action to take when the escape key is pressed,
         * based on the current configuration and visibility state of the component.
         *
         * If the component is currently shown, it listens for the keydown event on the associated element.
         * - If keyboard interaction is enabled and the escape key is pressed, it prevents the default action
         *   and calls the `hide` method to close the component.
         * - If keyboard interaction is disabled and the escape key is pressed, it triggers a backdrop transition.
         *
         * If the component is not shown, it removes the event listener to prevent unnecessary processing.
         *
         * @throws {Error} Throws an error if there is an issue with event handling.
         *
         * @returns {void} This method does not return a value.
         *
         * @example
         * const myComponent = new MyComponent();
         * myComponent._setEscapeEvent();
         */
        return;
      }

      EventHandler.one(target, EVENT_HIDDEN$3, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
    });
    const data = Modal.getOrCreateInstance(target);
    data.toggle(this);
  });
  enableDismissTrigger(Modal);
  /**
   * ------------------------------------------------------------------------
   /**
    * Sets up or removes the resize event listener for the window.
    * When the dialog is shown, it listens for window resize events
    * and adjusts the dialog accordingly. If the dialog is not shown,
    * it removes the resize event listener.
    *
    * @private
    * @returns {void}
    *
    * @throws {Error} Throws an error if there is an issue with event handling.
    *
    * @example
    * // To set the resize event when the dialog is shown
    * this._isShown = true;
    * this._setResizeEvent();
    *
    * // To remove the resize event when the dialog is hidden
    * this._isShown = false;
    * this._setResizeEvent();
    */
   * jQuery
   * ------------------------------------------------------------------------
   * add .Modal to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Modal);

  /**
   /**
    * Hides the modal by setting its display style to 'none' and updating
    * accessibility attributes. It also handles the transition state and
    * triggers the hidden event after the backdrop is hidden.
    *
    * This method performs the following actions:
    * - Sets the modal's display style to 'none'.
    * - Sets the 'aria-hidden' attribute to true.
    * - Removes 'aria-modal' and 'role' attributes.
    * - Resets the transition state.
    * - Hides the backdrop and triggers a callback to clean up the body class
    *   and reset adjustments related to scrolling.
    *
    * @throws {Error} Throws an error if the backdrop fails to hide.
    *
    * @example
    * // Example usage of _hideModal
    * modalInstance._hideModal();
    */
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): offcanvas.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$5 = 'offcanvas';
  const DATA_KEY$5 = 'bs.offcanvas';
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const DATA_API_KEY$2 = '.data-api';
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const ESCAPE_KEY = 'Escape';
  const Default$4 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  };
  /**
   * Displays the backdrop for the component and sets up an event listener
   * to handle clicks on the backdrop.
   *
   * This method listens for click events on the backdrop element. If the
   * backdrop is clicked and the configuration allows it, it will either
   * hide the component or trigger a backdrop transition based on the
   * configuration settings.
   *
   * @param {Function} callback - A callback function to be executed after
   * the backdrop is shown. This can be used for additional actions that
   * need to occur once the backdrop is visible.
   *
   * @throws {Error} Throws an error if the backdrop cannot be shown due to
   * invalid configuration.
   *
   * @example
   * // Example usage of _showBackdrop
   * instance._showBackdrop(() => {
   *   console.log('Backdrop is now visible');
   * });
   */
  const DefaultType$4 = {
    backdrop: 'boolean',
    keyboard: 'boolean',
    scroll: 'boolean'
  };
  const CLASS_NAME_SHOW$3 = 'show';
  const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
  const OPEN_SELECTOR = '.offcanvas.show';
  const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
  const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
  const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
  const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
  const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  /**
   * Checks if the associated element is currently animated.
   *
   * This method determines if the element has the class that indicates
   * it is in a fading animation state. It is typically used to manage
   * animation states and transitions within the component.
   *
   * @returns {boolean} Returns true if the element is animated, false otherwise.
   *
   * @example
   * const isAnimating = instance._isAnimated();
   * if (isAnimating) {
   *   console.log('The element is currently animated.');
   * } else {
   *   console.log('The element is not animated.');
   * }
   */
  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      /**
       * Triggers the backdrop transition for a modal element.
       * This method handles the visibility and overflow properties of the modal's backdrop
       * based on the current state of the modal and its content.
       *
       * It checks if the modal is overflowing and adjusts the overflow style accordingly.
       * If the backdrop transition is prevented, the method will exit early.
       *
       * @throws {Error} Throws an error if the element is not defined or not a modal.
       *
       * @returns {void} This method does not return a value.
       *
       * @example
       * const modal = new Modal(element);
       * modal._triggerBackdropTransition();
       */
      this._isShown = false;
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();

      this._addEventListeners();
    } // Getters


    static get NAME() {
      return NAME$5;
    }

    static get Default() {
      return Default$4;
    } // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
        relatedTarget
      });

      if (showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;
      this._element.style.visibility = 'visible';

      this._backdrop.show();

      if (!this._config.scroll) {
        /**
         * Adjusts the dialog's padding based on the overflow state of the modal and the body.
         * This method ensures that the modal is displayed correctly without any visual overflow issues.
         * It calculates whether the modal is overflowing and adjusts the left or right padding accordingly
         * based on the scrollbar width and the directionality of the layout (RTL or LTR).
         *
         * @private
         * @method _adjustDialog
         * @returns {void}
         *
         * @throws {TypeError} Throws an error if the element is not defined or if the scrollbar width cannot be determined.
         *
         * @example
         * // Example usage within a modal component
         * this._adjustDialog();
         */
        new ScrollBarHelper().hide();
      }

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.classList.add(CLASS_NAME_SHOW$3);

      /**
       * Callback function that completes an action based on the current configuration.
       * If scrolling is not enabled in the configuration, it activates the focus trap.
       * It also triggers an event indicating that the action has been completed.
       *
       /**
        * Resets the padding adjustments of the associated element.
        *
        * This method clears the left and right padding styles of the element,
        * effectively reverting any padding adjustments that may have been applied
        * previously. It is typically used to ensure that the element returns to
        * its default styling state.
        *
        * @throws {TypeError} Throws an error if the element is not defined or
        *         does not have a style property.
        *
        * @example
        * // Assuming 'instance' is an object with a valid '_element' property
        * instance._resetAdjustments();
        */
       * @function completeCallBack
       * @returns {void}
       *
       * @throws {Error} Throws an error if the event handler fails to trigger.
       *
       * @example
       /**
        * jQuery interface for the Modal component.
        *
        * This method allows for the initialization and manipulation of the Modal instance
        * using jQuery. It supports both configuration options and method calls.
        *
        * @param {Object|string} config - Configuration options for the Modal instance or
        *                                 a method name to invoke on the instance.
        * @param {Element} [relatedTarget] - An optional parameter that can be passed to
        *                                     the method being called, representing the
        *                                     element that triggered the modal.
        *
        * @throws {TypeError} Throws an error if the provided config is a string and
        *                     does not correspond to a valid method on the Modal instance.
        *
        * @returns {jQuery} The jQuery object for chaining.
        *
        * @example
        * // Initialize a modal with specific options
        * $('#myModal').jQueryInterface({ backdrop: 'static' });
        *
        * // Call a method on the modal instance
        * $('#myModal').jQueryInterface('show', relatedElement);
        */
       * // Assuming the context is properly set and this._config is defined
       * completeCallBack();
       */
      const completeCallBack = () => {
        if (!this._config.scroll) {
          this._focustrap.activate();
        }

        EventHandler.trigger(this._element, EVENT_SHOWN$2, {
          relatedTarget
        });
      };

      this._queueCallback(completeCallBack, this._element, true);
    }

    hide() {
      if (!this._isShown) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);

      if (hideEvent.defaultPrevented) {
        return;
      }

      this._focustrap.deactivate();

      this._element.blur();

      this._isShown = false;

      this._element.classList.remove(CLASS_NAME_SHOW$3);

      this._backdrop.hide();

      /**
       * Callback function that completes the hiding process of an element.
       * This function performs the following actions:
       * - Sets the 'aria-hidden' attribute to true, indicating that the element is not visible to accessibility tools.
       * - Removes the 'aria-modal' attribute, indicating that the element is no longer a modal.
       * - Removes the 'role' attribute, which may have been set for accessibility purposes.
       * - Sets the visibility style of the element to 'hidden'.
       * - If scrolling is not enabled in the configuration, it resets the scrollbar using the ScrollBarHelper.
       * - Triggers an event indicating that the element has been hidden.
       *
       * @throws {Error} Throws an error if there is an issue with resetting the scrollbar or triggering the event.
       *
       * @example
       * // Example usage of completeCallback
       * completeCallback();
       */
      const completeCallback = () => {
        this._element.setAttribute('aria-hidden', true);

        this._element.removeAttribute('aria-modal');

        this._element.removeAttribute('role');

        this._element.style.visibility = 'hidden';

        if (!this._config.scroll) {
          new ScrollBarHelper().reset();
        }

        EventHandler.trigger(this._element, EVENT_HIDDEN$2);
      };

      this._queueCallback(completeCallback, this._element, true);
    }

    dispose() {
      this._backdrop.dispose();

      this._focustrap.deactivate();

      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default$4,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$5, config, DefaultType$4);
      return config;
    }

    _initializeBackDrop() {
      return new Backdrop({
        className: CLASS_NAME_BACKDROP,
        isVisible: this._config.backdrop,
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: () => this.hide()
      });
    }

    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }

    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (this._config.keyboard && event.key === ESCAPE_KEY) {
          this.hide();
        }
      });
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Offcanvas.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
        /**
         * Toggles the visibility of an element.
         * If the element is currently shown, it will be hidden;
         * if it is hidden, it will be shown.
         *
         * @param {Element} relatedTarget - The element that is related to the toggle action.
         * This parameter can be used to determine the context of the toggle.
         *
         * @returns {boolean} Returns true if the element is shown, false if it is hidden.
         *
         * @throws {Error} Throws an error if the toggle action fails due to invalid state.
         *
         * @example
         * const element = document.getElementById('myElement');
         * const isVisible = toggle(element);
         * console.log(isVisible); // true if shown, false if hidden
         */
        }

        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        /**
         * Displays the modal element, making it visible to the user.
         *
         * This method triggers a 'show' event before making the modal visible.
         * If the event is prevented, the modal will not be shown. The method also
         * manages the visibility of the backdrop and handles focus trapping if
         * scrolling is not allowed.
         *
         * @param {Element} relatedTarget - The element that triggered the modal display.
         *
         * @returns {void}
         *
         * @throws {Error} Throws an error if the modal is already shown.
         *
         * @example
         * const modal = new Modal(element);
         * modal.show(triggeringElement);
         */
        }

        data[config](this);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    EventHandler.one(target, EVENT_HIDDEN$2, () => {
      // focus on trigger when it is closed
      if (isVisible(this)) {
        this.focus();
      }
    }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

    const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

    if (allReadyOpen && allReadyOpen !== target) {
      Offcanvas.getInstance(allReadyOpen).hide();
    }

    const data = Offcanvas.getOrCreateInstance(target);
    data.toggle(this);
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => SelectorEngine.find(OPEN_SELECTOR).forEach(el => Offcanvas.getOrCreateInstance(el).show()));
  enableDismissTrigger(Offcanvas);
  /**
   * Hides the element if it is currently shown.
   *
   * This method triggers a hide event and checks if the event is prevented.
   * If not prevented, it proceeds to deactivate focus trap, remove the show class,
   * and hide the backdrop. It also resets the visibility and aria attributes of the element.
   *
   * @throws {Error} Throws an error if the element is not found or if there is an issue
   *                 during the hiding process.
   *
   * @example
   * const modal = new Modal(element);
   * modal.hide();
   */
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  defineJQueryPlugin(Offcanvas);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const uriAttrs = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/i;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

  /**
   * Checks if a given attribute is allowed based on a list of permitted attributes.
   * This function evaluates both direct matches and regular expression matches against
   * the provided list of allowed attributes. Additionally, it validates URI attributes
   * against specified patterns.
   *
   * @param {Attr} attr - The attribute to be checked. This should be an instance of the Attr interface.
   * @param {(string|RegExp)[]} allowedAttributeList - An array of allowed attribute names or regular expressions.
   *
   /**
    * Cleans up and disposes of resources used by the instance.
    * This method is responsible for releasing any allocated resources,
    * deactivating focus traps, and calling the superclass's dispose method.
    *
    * It ensures that all associated components are properly disposed of
    * to prevent memory leaks and other resource-related issues.
    *
    * @throws {Error} Throws an error if the disposal process fails.
    *
    * @example
    * const instance = new MyClass();
    * // ... use the instance ...
    * instance.dispose(); // Properly disposes of the instance resources.
    */
   * @returns {boolean} Returns true if the attribute is allowed, false otherwise.
   *
   * @throws {TypeError} Throws an error if the provided `attr` is not an instance of Attr.
   *
   * @example
   * const attr = document.createAttribute('href');
   * attr.nodeValue = 'https://example.com';
   * const allowedList = ['href', 'src', /^data-/];
   * const isAllowed = allowedAttribute(attr, allowedList);
   /**
    * Merges the provided configuration object with default settings and
    * data attributes from the element.
    *
    * This function takes a configuration object, merges it with default
    * values and any data attributes found on the element, and performs
    * type checking on the resulting configuration.
    *
    * @param {Object} config - The configuration object to merge with defaults.
    *                          If not an object, it will be ignored.
    * @returns {Object} The final configuration object after merging.
    *
    * @throws {TypeError} Throws an error if the configuration does not
    *                     conform to the expected types defined in
    *                     DefaultType$4.
    *
    * @example
    * const finalConfig = this._getConfig({ customSetting: true });
    * // finalConfig will contain merged settings from Default$4,
    * // data attributes, and { customSetting: true }.
    */
   * console.log(isAllowed); // true or false based on validation
   */
  const allowedAttribute = (attr, allowedAttributeList) => {
    const attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.includes(attrName)) {
      if (uriAttrs.has(attrName)) {
        return Boolean(SAFE_URL_PATTERN.test(attr.nodeValue) || DATA_URL_PATTERN.test(attr.nodeValue));
      }
/**
 * Initializes a new Backdrop instance with specified configuration.
 *
 * This method creates a backdrop element that can be used to enhance
 * the user interface by providing a visual overlay. The backdrop can
 * be configured to be visible or hidden, animated, and can respond
 * to click events.
 *
 * @returns {Backdrop} A new instance of the Backdrop class.
 *
 * @throws {Error} Throws an error if the backdrop cannot be initialized
 * due to invalid configuration or missing parameters.
 *
 * @example
 * const backdrop = this._initializeBackDrop();
 * backdrop.show(); // Displays the backdrop
 */

      return true;
    }

    const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp); // Check if a regular expression validates the attribute.

    for (let i = 0, len = regExp.length; i < len; i++) {
      if (regExp[i].test(attrName)) {
        return true;
      }
    /**
     * Initializes a focus trap for the specified element.
     * A focus trap restricts keyboard navigation to a specific part of the UI,
     * ensuring that users cannot tab out of the designated area.
     *
     * @returns {FocusTrap} An instance of the FocusTrap class that manages
     *                      the focus within the specified element.
     *
     * @throws {Error} Throws an error if the focus trap cannot be created
     *                 due to invalid parameters or state.
     *
     * @example
     * const focusTrap = this._initializeFocusTrap();
     * focusTrap.activate(); // Activates the focus trap
     */
    }

    return false;
  };

  const DefaultAllowlist = {
    /**
     * Attaches event listeners to the element for handling specific events.
     * This method listens for keyboard events, specifically the 'keydown' event,
     * and triggers the appropriate action based on the event's key.
     *
     * @private
     * @returns {void}
     *
     * @throws {Error} Throws an error if the event listener cannot be attached.
     *
     * @example
     * // Example usage within a class that has an element and config defined
     * this._addEventListeners();
     *
     * @description
     * If the keyboard interaction is enabled in the configuration and the
     * ESCAPE key is pressed, the associated hide method is called to dismiss
     * the element.
     */
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    /**
     * Static method that provides an interface for interacting with the Offcanvas component.
     * It allows for configuration and method invocation on the Offcanvas instance.
     *
     * @static
     * @param {Object|string} config - The configuration object or method name to invoke on the Offcanvas instance.
     * If a string is provided, it should correspond to a method defined on the Offcanvas instance.
     *
     * @throws {TypeError} Throws a TypeError if the provided config is a string that does not correspond
     * to a valid method, or if the method is private (starts with '_') or the constructor.
     *
     * @returns {jQuery} Returns the jQuery object for chaining.
     *
     * @example
     * // Initialize Offcanvas with default configuration
     * $('.offcanvas').jQueryInterface({});
     *
     * // Invoke a specific method on the Offcanvas instance
     * $('.offcanvas').jQueryInterface('show');
     */
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  /**
   * Sanitizes HTML by removing disallowed elements and attributes.
   *
   * This function takes an unsafe HTML string and cleans it according to a specified allowlist.
   * If a custom sanitization function is provided, it will be used instead of the default behavior.
   *
   * @param {string} unsafeHtml - The HTML string to be sanitized.
   * @param {Object} allowList - An object defining allowed elements and attributes.
   * @param {Function} [sanitizeFn] - An optional custom sanitization function.
   * @returns {string} The sanitized HTML string.
   *
   * @throws {TypeError} Throws an error if `unsafeHtml` is not a string or if `allowList` is not an object.
   *
   * @example
   * const unsafe = '<div><script>alert("xss")</script><p>Hello World</p></div>';
   * const allowList = {
   *   div: ['class'],
   *   p: [],
   *   '*': ['style']
   * };
   * const sanitized = sanitizeHtml(unsafe, allowList);
   * console.log(sanitized); // Outputs: <div><p>Hello World</p></div>
   */
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const allowlistKeys = Object.keys(allowList);
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

    for (let i = 0, len = elements.length; i < len; i++) {
      const el = elements[i];
      const elName = el.nodeName.toLowerCase();

      if (!allowlistKeys.includes(elName)) {
        el.remove();
        continue;
      }

      const attributeList = [].concat(...el.attributes);
      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elName] || []);
      attributeList.forEach(attr => {
        if (!allowedAttribute(attr, allowedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$4 = 'tooltip';
  const DATA_KEY$4 = 'bs.tooltip';
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const CLASS_PREFIX$1 = 'bs-tooltip';
  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
  const DefaultType$3 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(array|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacements: 'array',
    boundary: '(string|element)',
    customClass: '(string|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    allowList: 'object',
    popperConfig: '(null|object|function)'
  };
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: isRTL() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL() ? 'right' : 'left'
  };
  const Default$3 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: [0, 0],
    container: false,
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    boundary: 'clippingParents',
    customClass: '',
    sanitize: true,
    sanitizeFn: null,
    allowList: DefaultAllowlist,
    popperConfig: null
  };
  const Event$2 = {
    HIDE: `hide${EVENT_KEY$4}`,
    HIDDEN: `hidden${EVENT_KEY$4}`,
    SHOW: `show${EVENT_KEY$4}`,
    SHOWN: `shown${EVENT_KEY$4}`,
    INSERTED: `inserted${EVENT_KEY$4}`,
    CLICK: `click${EVENT_KEY$4}`,
    FOCUSIN: `focusin${EVENT_KEY$4}`,
    FOCUSOUT: `focusout${EVENT_KEY$4}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
  };
  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW$2 = 'show';
  const HOVER_STATE_SHOW = 'show';
  const HOVER_STATE_OUT = 'out';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
  const EVENT_MODAL_HIDE = 'hide.bs.modal';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (typeof Popper__namespace === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
      }

      super(element); // private

      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this._config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    static get Default() {
      return Default$3;
    }

    static get NAME() {
      return NAME$4;
    }

    static get Event() {
      return Event$2;
    }

    static get DefaultType() {
      return DefaultType$3;
    } // Public


    enable() {
      this._isEnabled = true;
    }

    disable() {
      this._isEnabled = false;
    }

    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }

    toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        const context = this._initializeOnDelegatedTarget(event);

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$2)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    }

    dispose() {
      clearTimeout(this._timeout);
      EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

      if (this.tip) {
        this.tip.remove();
      }

      if (this._popper) {
        this._popper.destroy();
      }

      super.dispose();
    }

    show() {
      if (this._element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
      }

      if (!(this.isWithContent() && this._isEnabled)) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }

      const tip = this.getTipElement();
      const tipId = getUID(this.constructor.NAME);
      tip.setAttribute('id', tipId);

      this._element.setAttribute('aria-describedby', tipId);

      if (this._config.animation) {
        tip.classList.add(CLASS_NAME_FADE$2);
      }

      const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

      const attachment = this._getAttachment(placement);

      this._addAttachmentClass(attachment);

      const {
        container
      } = this._config;
      Data.set(tip, this.constructor.DATA_KEY, this);

      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.append(tip);
        /**
         * Enables the current instance by setting the internal state to enabled.
         *
         * This method modifies the `_isEnabled` property to `true`, indicating that
         * the instance is now active and can perform its intended functions.
         *
         * @throws {Error} Throws an error if the instance is already enabled.
         *
         * @example
         * const instance = new SomeClass();
         * instance.enable(); // Sets _isEnabled to true
         */
        EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
      }

      if (this._popper) {
        /**
         * Disables the current instance by setting the internal enabled state to false.
         *
         * This method is typically used to deactivate functionality associated with the instance,
         * preventing any further actions or responses until re-enabled.
         *
         * @throws {Error} Throws an error if the instance is already disabled.
         *
         * @example
         * const instance = new MyClass();
         * instance.disable();
         * console.log(instance.isEnabled); // false
         */
        this._popper.update();
      } else {
        this._popper = Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
      }
/**
 * Toggles the enabled state of the instance.
 *
 * This method inverts the current value of the `_isEnabled` property.
 * If `_isEnabled` is true, it will be set to false, and vice versa.
 *
 * @throws {TypeError} Throws an error if `_isEnabled` is not a boolean.
 *
 * @example
 * const instance = new MyClass();
 * instance.toggleEnabled(); // If _isEnabled was false, it becomes true.
 * instance.toggleEnabled(); // Now it becomes false again.
 */

      tip.classList.add(CLASS_NAME_SHOW$2);

      const customClass = this._resolvePossibleFunction(this._config.customClass);
/**
 * Toggles the visibility of a tooltip or popover based on the provided event.
 * This method checks if the component is enabled before proceeding with the toggle action.
 *
 * If an event is provided, it initializes the context based on the delegated target of the event,
 * and toggles the active trigger state. Depending on whether there is an active trigger,
 * it either enters or leaves the tooltip/popover.
 *
 * If no event is provided, it checks if the tooltip/popover is currently shown.
 * If it is shown, it will call the leave method; otherwise, it will call the enter method.
 *
 * @param {Event} event - The event that triggered the toggle action.
 *                        If not provided, the method will check the current state of the tooltip/popover.
 *
 * @returns {void} - This method does not return a value.
 *
 * @throws {Error} - Throws an error if the component is not enabled when trying to toggle.
 *
 * @example
 * // Example usage of toggle method
 * element.addEventListener('click', (event) => {
 *   tooltipInstance.toggle(event);
 * });
 */

      if (customClass) {
        tip.classList.add(...customClass.split(' '));
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => {
          EventHandler.on(element, 'mouseover', noop);
        });
      }

      /**
       * Completes the hover state transition for the associated element.
       * This method is responsible for resetting the hover state and triggering
       * the 'shown' event when the hover state is completed.
       *
       * It checks the previous hover state and, if it was in the 'out' state,
       * it calls the `_leave` method to handle the transition appropriately.
       *
       * @throws {Error} Throws an error if the element is not defined or if
       *                 there is an issue with event handling.
       *
       /**
        * Cleans up and disposes of the instance, removing event listeners and destroying associated resources.
        *
        * This method is responsible for clearing any active timeouts, removing event listeners related to modal hide events,
        * and cleaning up any associated tooltip or popper instances. It also calls the superclass's dispose method to ensure
        * proper cleanup in the inheritance chain.
        *
        * @throws {Error} Throws an error if the disposal process encounters an issue during cleanup.
        *
        * @example
        * const instance = new SomeClass();
        * instance.dispose(); // Cleans up the instance and releases resources.
        */
       * @example
       * // Example usage of complete method
       * const instance = new HoverComponent();
       * instance.complete();
       */
      const complete = () => {
        const prevHoverState = this._hoverState;
        this._hoverState = null;
        EventHandler.trigger(this._element, this.constructor.Event.SHOWN);

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this);
        }
      };

      /**
       * Displays the tooltip element associated with the current instance.
       *
       * This method checks if the tooltip can be shown based on its visibility,
       * content, and whether it is enabled. It triggers a SHOW event and manages
       * the tooltip's placement and appearance.
       *
       * @throws {Error} Throws an error if the tooltip is attempted to be shown
       *                 when it is already visible.
       *
       * @returns {void} This method does not return a value.
       *
       * @example
       * const tooltip = new Tooltip(element, config);
       * tooltip.show();
       *
       * @fires Tooltip#show
       * @fires Tooltip#shown
       */
      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

      this._queueCallback(complete, this.tip, isAnimated);
    }

    hide() {
      if (!this._popper) {
        return;
      }

      const tip = this.getTipElement();

      /**
       * Completes the tooltip lifecycle by performing necessary cleanup actions.
       * This method checks if there is an active trigger and removes the tooltip if not.
       * It also triggers the HIDDEN event and destroys the Popper instance if it exists.
       *
       * @returns {void} This method does not return a value.
       *
       * @throws {Error} Throws an error if there is an issue during the destruction of the Popper instance.
       *
       * @example
       * // Example usage of the complete method
       * const tooltipInstance = new Tooltip(element);
       * tooltipInstance.complete();
       */
      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
        }

        if (this._hoverState !== HOVER_STATE_SHOW) {
          tip.remove();
        }

        this._cleanTipClass();

        this._element.removeAttribute('aria-describedby');

        EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);

        if (this._popper) {
          this._popper.destroy();

          this._popper = null;
        }
      };

      const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      tip.classList.remove(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
      }

      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

      this._queueCallback(complete, this.tip, isAnimated);

      this._hoverState = '';
    }

    update() {
      if (this._popper !== null) {
        this._popper.update();
      }
    } // Protected


    isWithContent() {
      return Boolean(this.getTitle());
    }

    /**
     * Hides the tooltip element associated with the current instance.
     * This method will remove the tooltip from the DOM and clean up any
     * associated event listeners and attributes.
     *
     * @throws {Error} Throws an error if the tooltip element is not initialized.
     *
     * @example
     * const tooltip = new Tooltip(element);
     * tooltip.hide();
     *
     * @returns {void}
     */
    getTipElement() {
      if (this.tip) {
        return this.tip;
      }

      const element = document.createElement('div');
      element.innerHTML = this._config.template;
      const tip = element.children[0];
      this.setContent(tip);
      tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
      this.tip = tip;
      return this.tip;
    }

    setContent(tip) {
      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
    }

    _sanitizeAndSetContent(template, content, selector) {
      const templateElement = SelectorEngine.findOne(selector, template);

      if (!content && templateElement) {
        templateElement.remove();
        return;
      } // we use append for html objects to maintain js events


      this.setElementContent(templateElement, content);
    }

    setElementContent(element, content) {
      if (element === null) {
        return;
      }

      if (isElement(content)) {
        content = getElement(content); // content is a DOM node or a jQuery

        if (this._config.html) {
          if (content.parentNode !== element) {
            element.innerHTML = '';
            element.append(content);
          }
        } else {
          element.textContent = content.textContent;
        }

        return;
      }

      if (this._config.html) {
        if (this._config.sanitize) {
          /**
           * Updates the popper instance if it exists.
           *
           * This method checks if the `_popper` property is not null. If it is valid,
           * it calls the `update` method on the `_popper` instance to refresh its position
           * and dimensions based on the current state of its reference element.
           *
           * @throws {Error} Throws an error if `_popper` is not properly initialized.
           *
           * @example
           * const instance = new PopperInstance();
           * instance.update(); // Updates the popper if it exists.
           */
          content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
        }

        element.innerHTML = content;
      } else {
        element.textContent = content;
      }
    /**
     * Checks if the current instance has content based on the title.
     *
     * This method evaluates whether the title of the instance is defined and not empty.
     * It returns a boolean value indicating the presence of content.
     *
     * @returns {boolean} True if the title is defined and has content; otherwise, false.
     *
     * @example
     * const instance = new SomeClass();
     * instance.setTitle('Hello World');
     * console.log(instance.isWithContent()); // true
     *
     * @example
     * const instance = new SomeClass();
     * instance.setTitle('');
     * console.log(instance.isWithContent()); // false
     */
    }

    getTitle() {
      const title = this._element.getAttribute('data-bs-original-title') || this._config.title;
/**
 * Retrieves the tooltip element. If the tooltip element already exists,
 * it returns the existing element. If not, it creates a new tooltip element,
 * sets its content based on the provided template configuration, and returns it.
 *
 * @returns {HTMLElement} The tooltip element.
 *
 * @throws {Error} Throws an error if the template configuration is invalid or
 *                 if there is an issue creating the tooltip element.
 *
 * @example
 * const tooltip = instance.getTipElement();
 * console.log(tooltip); // Logs the tooltip element to the console.
 */

      return this._resolvePossibleFunction(title);
    }

    updateAttachment(attachment) {
      if (attachment === 'right') {
        return 'end';
      }

      if (attachment === 'left') {
        return 'start';
      }

      return attachment;
    /**
     * Sets the content of a tooltip by sanitizing the provided tip and
     * combining it with the current title.
     *
     * This method utilizes a private method to ensure that the content
     * is properly sanitized before being set.
     *
     * @param {string} tip - The content to be set in the tooltip.
     *                       This should be a string that may contain
     *                       user-generated content.
     *
     * @throws {Error} Throws an error if the provided tip is not a string
     *                 or if sanitization fails.
     *
     * @example
     * const tooltip = new Tooltip();
     * tooltip.setContent("This is a tooltip message.");
     */
    } // Private


    _initializeOnDelegatedTarget(event, context) {
      /**
       * Sanitizes and sets the content of a specified element within a template.
       * If the content is empty and the element exists, it removes the element from the DOM.
       * Otherwise, it updates the element's content while preserving any JavaScript events.
       *
       * @param {HTMLElement} template - The template element containing the target element.
       * @param {string|null} content - The content to set in the target element. If null or empty, the element will be removed.
       * @param {string} selector - A selector string used to find the target element within the template.
       *
       * @returns {void}
       *
       * @throws {Error} Throws an error if the template is not a valid HTMLElement.
       *
       * @example
       * // Example usage:
       * const template = document.getElementById('myTemplate');
       * const content = '<p>New Content</p>';
       * const selector = '.content';
       * _sanitizeAndSetContent(template, content, selector);
       */
      return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      /**
       * Sets the content of a specified DOM element.
       *
       * This function updates the content of the provided element based on the type of content passed.
       * It can handle both DOM nodes and string content, with options for HTML sanitization and text-only updates.
       *
       * @param {Element} element - The DOM element whose content is to be set. If null, the function does nothing.
       * @param {string|Element} content - The content to set. This can be a string or a DOM element.
       *
       * @throws {TypeError} Throws an error if the provided content is not a valid string or DOM element.
       *
       * @example
       * // Setting text content
       * const myElement = document.getElementById('myElement');
       * setElementContent(myElement, 'Hello, World!');
       *
       * @example
       * // Setting HTML content with sanitization
       * const myElement = document.getElementById('myElement');
       * setElementContent(myElement, '<div>Safe HTML Content</div>');
       *
       * @example
       * // Setting a DOM node as content
       * const myElement = document.getElementById('myElement');
       * const newNode = document.createElement('span');
       * newNode.textContent = 'This is a new node';
       * setElementContent(myElement, newNode);
       */
      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _resolvePossibleFunction(content) {
      return typeof content === 'function' ? content.call(this._element) : content;
    }

    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: 'flip',
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }, {
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'arrow',
          /**
           * Retrieves the title from the element's data attribute or configuration.
           *
           * This method checks for the presence of a 'data-bs-original-title' attribute on the
           * associated element. If this attribute is not set, it falls back to the title defined
           * in the configuration. The title is then processed to resolve any potential function
           * references.
           *
           * @returns {string|Function} The resolved title, which can be either a string or a
           * function, depending on the configuration or element attribute.
           *
           * @throws {TypeError} Throws an error if the title cannot be resolved to a valid
           * string or function.
           *
           * @example
           * const title = instance.getTitle();
           * console.log(title); // Outputs the resolved title.
           */
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: 'onChange',
          enabled: true,
          /**
           * Updates the attachment position based on the provided input.
           *
           * This function takes an attachment string and returns a corresponding position string.
           * If the input is 'right', it returns 'end'. If the input is 'left', it returns 'start'.
           * For any other input, it returns the input as is.
           *
           * @param {string} attachment - The attachment position to be updated.
           *                              Expected values are 'right' or 'left'.
           * @returns {string} The updated attachment position, which can be 'end', 'start',
           *                  or the original attachment value if it does not match 'right' or 'left'.
           *
           * @example
           * // Returns 'end'
           * updateAttachment('right');
           *
           * @example
           * // Returns 'start'
           * updateAttachment('left');
           *
           * @example
           * // Returns 'custom'
           * updateAttachment('custom');
           */
          phase: 'afterWrite',
          fn: data => this._handlePopperPlacementChange(data)
        }],
        onFirstUpdate: data => {
          if (data.options.placement !== data.placement) {
            this._handlePopperPlacementChange(data);
          }
        }
      };
      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }
/**
 * Initializes an instance on the delegated target based on the provided event and context.
 *
 * This method checks if a context is provided. If it is, the method returns the context.
 * If no context is provided, it attempts to create or retrieve an instance using the
 * delegated target from the event and the delegate configuration.
 *
 * @param {Event} event - The event object that contains information about the event that triggered this method.
 * @param {Object} [context] - An optional context object that may contain existing instance information.
 * @returns {Object} The context if provided, or a newly created instance based on the delegated target.
 *
 * @throws {Error} Throws an error if the delegated target is invalid or if instance creation fails.
 *
 * @example
 * const instance = this._initializeOnDelegatedTarget(event, existingContext);
 * // If existingContext is null, a new instance will be created based on event.delegateTarget.
 */

    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
    }
/**
 * Retrieves the offset configuration for the element.
 * The offset can be specified as a string, a function, or a direct value.
 *
 * If the offset is a string, it is expected to be a comma-separated list of numbers,
 * which will be parsed and returned as an array of integers.
 *
 * If the offset is a function, it will be called with the popper data and the element
 * as arguments, allowing for dynamic calculation of the offset.
 *
 * If the offset is neither a string nor a function, it is returned directly.
 *
 * @returns {Array<number>|function} The parsed offset as an array of numbers,
 *                                    a function that computes the offset, or
 *                                    the raw offset value.
 *
 * @throws {TypeError} Throws an error if the offset is of an unsupported type.
 *
 * @example
 * // Example of using a string offset
 * const offsetArray = instance._getOffset(); // returns [10, 20]
 *
 * // Example of using a function as an offset
 * const dynamicOffset = instance._getOffset(); // returns a function
 * const computedOffset = dynamicOffset(popperData); // computes offset based on popperData
 */

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    }

    _setListeners() {
      const triggers = this._config.trigger.split(' ');

      triggers.forEach(trigger => {
        if (trigger === 'click') {
          EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
          EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
          EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
        /**
         * Resolves the provided content to a function result or returns the content itself.
         *
         * This method checks if the given content is a function. If it is, the function is called
         * with the current context of the element. If the content is not a function, it is returned as is.
         *
         * @param {function|*} content - The content to be resolved. It can be a function or any other type.
         * @returns {*} The result of the function call if content is a function, otherwise the original content.
         *
         * @throws {TypeError} Throws a TypeError if the context of the function call is invalid.
         *
         * @example
         * // Example usage:
         * const result = this._resolvePossibleFunction(() => { return 'Hello World'; });
         * console.log(result); // Outputs: 'Hello World'
         *
         * const directValue = this._resolvePossibleFunction('Direct Value');
         * console.log(directValue); // Outputs: 'Direct Value'
         */
        }
      });

      this._hideModalHandler = () => {
        /**
         * Generates the configuration object for the Popper.js instance based on the specified attachment.
         *
         * This method creates a default configuration for Popper.js, including placement, modifiers for flipping,
         * offsetting, preventing overflow, and handling arrow positioning. It also allows for custom configurations
         * to be merged in from the instance's configuration object.
         *
         * @param {string} attachment - The desired placement of the popper (e.g., 'top', 'bottom', 'left', 'right').
         *
         * @returns {Object} The complete Popper.js configuration object, which includes default settings and any
         *                  custom settings provided by the user.
         *
         * @throws {TypeError} Throws an error if the attachment parameter is not a string.
         *
         * @example
         * const config = this._getPopperConfig('top');
         * console.log(config); // Outputs the Popper.js configuration for the 'top' placement.
         */
        if (this._element) {
          this.hide();
        }
      };

      EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

      if (this._config.selector) {
        this._config = { ...this._config,
          trigger: 'manual',
          selector: ''
        };
      } else {
        this._fixTitle();
      }
    }

    _fixTitle() {
      const title = this._element.getAttribute('title');

      const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

      if (title || originalTitleType !== 'string') {
        this._element.setAttribute('data-bs-original-title', title || '');

        if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
          this._element.setAttribute('aria-label', title);
        }

        this._element.setAttribute('title', '');
      }
    }

    _enter(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
      }

      /**
       * Adds a CSS class to the tip element based on the provided attachment.
       *
       * This method updates the class list of the tip element by adding a new class
       * that corresponds to the updated attachment. The class name is generated
       * using a basic class prefix and the result of the `updateAttachment` method.
       *
       * @param {Object} attachment - The attachment object that will be used to determine the class to add.
       * @throws {TypeError} Throws an error if the attachment is not valid.
       *
       * @example
       * const attachment = { type: 'image', id: '123' };
       * instance._addAttachmentClass(attachment);
       * // The tip element will have a class like 'prefix-image-123' added to it.
       */
      if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$2) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
      }
/**
 * Retrieves an attachment based on the specified placement.
 *
 * This function looks up the attachment in the AttachmentMap using the provided
 * placement, which is converted to uppercase to ensure case-insensitivity.
 *
 * @param {string} placement - The placement identifier for the attachment.
 * @returns {AttachmentType|undefined} The attachment associated with the given placement,
 * or undefined if no attachment is found.
 *
 * @throws {Error} Throws an error if the placement is not a valid string.
 *
 * @example
 * const attachment = _getAttachment('header');
 * // If 'header' exists in AttachmentMap, it returns the corresponding attachment.
 */

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;

      /**
       * Sets up event listeners based on the configuration triggers.
       * This method initializes event handlers for various user interactions
       * such as clicks, mouse enter, mouse leave, focus in, and focus out.
       * It also handles the modal hide event.
       *
       * @throws {Error} Throws an error if the element is not defined.
       *
       * @example
       * // Assuming `instance` is an instance of the class that contains this method
       * instance._setListeners();
       */
      if (!context._config.delay || !context._config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
        }
      }, context._config.delay.show);
    }

    _leave(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_OUT;

      if (!context._config.delay || !context._config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(() => {
        /**
         * Updates the title and aria-label attributes of the element.
         *
         * This method retrieves the current title attribute of the element and checks
         * if the 'data-bs-original-title' attribute is not a string. If either condition
         * is met, it sets the 'data-bs-original-title' to the current title or an empty
         * string if no title exists. Additionally, if a title is present and both
         * 'aria-label' and text content are absent, it sets the 'aria-label' to the title.
         * Finally, it clears the title attribute.
         *
         * @throws {TypeError} Throws an error if the element is not defined or does not have
         *                     the expected attributes.
         *
         * @returns {void} This method does not return a value.
         *
         * @example
         * // Assuming `element` is a valid DOM element with a title attribute
         * const instance = new SomeClass(element);
         * instance._fixTitle();
         */
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context._config.delay.hide);
    }

    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    }

    /**
     * Handles the entry event for a tooltip or popover, managing its visibility based on user interactions.
     *
     * This method initializes the context for the delegated target and determines whether to show the tooltip
     * based on the type of event received. It also manages hover states and delays for showing the tooltip.
     *
     * @param {Event} event - The event that triggered the tooltip entry, such as 'focusin' or 'mouseenter'.
     * @param {Object} context - The context object containing configuration and state for the tooltip.
     * @param {Object} context._config - Configuration options for the tooltip, including delay settings.
     * @param {number} context._config.delay.show - The delay in milliseconds before showing the tooltip.
     * @param {Object} context._hoverState - The current hover state of the tooltip.
     * @param {Function} context.show - Method to display the tooltip.
     * @param {Function} context.getTipElement - Method to retrieve the tooltip element.
     * @throws {Error} Throws an error if the context is not properly initialized or if an invalid event is provided.
     *
     * @example
     * // Example usage of _enter method
     * const tooltipContext = {
     *   _config: { delay: { show: 300 } },
     *   _hoverState: HOVER_STATE_OUT,
     *   show: () => console.log('Tooltip shown'),
     *   getTipElement: () => document.querySelector('.tooltip')
     * };
     *
     * const event = new Event('mouseenter');
     * _enter(event, tooltipContext);
     */
    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      Object.keys(dataAttributes).forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
          delete dataAttributes[dataAttr];
        }
      });
      config = { ...this.constructor.Default,
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };
      config.container = config.container === false ? document.body : getElement(config.container);

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }
/**
 * Handles the mouse leave event for a given context, managing the visibility of an element based on user interactions.
 *
 * This method initializes the context based on the delegated target of the event and determines whether to hide the element
 * based on the hover state and configured delays.
 *
 * @param {Event} event - The event object representing the mouse leave event.
 * @param {Object} context - The context object containing configuration and state information for the element.
 * @throws {Error} Throws an error if the context is not properly initialized.
 *
 * @example
 * // Example usage of _leave method
 * const event = new MouseEvent('mouseleave');
 * const context = {
 *   _element: document.getElementById('myElement'),
 *   _config: { delay: { hide: 300 } },
 *   _activeTrigger: {},
 *   _hoverState: HOVER_STATE_IN,
 *   hide: function() { console.log('Element hidden'); },
 *   _isWithActiveTrigger: function() { return false; },
 *   _timeout: null,
 * };
 * _leave(event, context);
 */

      typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
      }

      return config;
    }

    _getDelegateConfig() {
      const config = {};

      for (const key in this._config) {
        if (this.constructor.Default[key] !== this._config[key]) {
          config[key] = this._config[key];
        }
      } // In the future can be replaced with:
      // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
      // `Object.fromEntries(keysWithDifferentValues)`


      return config;
    }

    _cleanTipClass() {
      /**
       * Checks if there is any active trigger present.
       *
       * This method iterates through the `_activeTrigger` object and returns `true`
       * if at least one trigger is active (truthy). If no triggers are active, it
       * returns `false`.
       *
       * @returns {boolean} Returns `true` if there is at least one active trigger,
       *                    otherwise returns `false`.
       *
       * @example
       * const instance = new SomeClass();
       * const hasActiveTrigger = instance._isWithActiveTrigger();
       * console.log(hasActiveTrigger); // Outputs: true or false based on active triggers
       */
      const tip = this.getTipElement();
      const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g');
      const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
      }
    }

    _getBasicClassPrefix() {
      /**
       * Retrieves and processes the configuration object for the component.
       * This method merges default settings with data attributes from the element,
       * and any additional configuration provided by the user.
       *
       * @param {Object} config - The user-defined configuration object.
       * @returns {Object} The processed configuration object, which includes:
       * - Merged default settings
       * - Data attributes from the element
       * - User-defined settings
       *
       * @throws {TypeError} Throws an error if the provided config is not an object.
       *
       * @example
       * const config = this._getConfig({ delay: 300, container: '#myContainer' });
       * console.log(config);
       */
      return CLASS_PREFIX$1;
    }

    _handlePopperPlacementChange(popperData) {
      const {
        state
      } = popperData;

      if (!state) {
        return;
      }

      this.tip = state.elements.popper;

      this._cleanTipClass();

      this._addAttachmentClass(this._getAttachment(state.placement));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tooltip.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   /**
    * Retrieves the configuration settings that differ from the default values.
    * This method compares the current configuration with the default settings
    * defined in the constructor and returns an object containing only the
    * properties that have different values.
    *
    * @returns {Object} An object containing the configuration settings that
    * differ from the default values. If no differences are found, an empty
    * object is returned.
    *
    * @example
    * const config = instance._getDelegateConfig();
    * console.log(config); // Outputs the differing configuration settings.
    *
    * @throws {Error} Throws an error if there is an issue accessing the
    * configuration properties.
    */
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tooltip to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   /**
    * Cleans up the CSS classes associated with the tip element.
    * This method removes any classes that match the basic class prefix
    * from the tip element's class list.
    *
    * It retrieves the tip element, constructs a regular expression to
    * identify classes that start with the basic class prefix, and
    * removes those classes if they exist.
    *
    * @throws {TypeError} Throws an error if the tip element is not found
    * or if the class attribute is not a string.
    *
    * @example
    * // Assuming this method is called within a context where `this`
    * // refers to an object with a valid `getTipElement` method and
    * // `_getBasicClassPrefix` method.
    * this._cleanTipClass();
    */
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$3 = 'popover';
  const DATA_KEY$3 = 'bs.popover';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const CLASS_PREFIX = 'bs-popover';
  const Default$2 = { ...Tooltip.Default,
    /**
     * Retrieves the basic class prefix used in the application.
     *
     * This method is typically used to obtain a standardized prefix that can be
     * applied to class names throughout the codebase, ensuring consistency and
     * adherence to naming conventions.
     *
     * @returns {string} The basic class prefix.
     *
     * @example
     * const prefix = _getBasicClassPrefix();
     * console.log(prefix); // Outputs the basic class prefix.
     */
    placement: 'right',
    offset: [0, 8],
    trigger: 'click',
    content: '',
    /**
     * Handles the change in placement of the popper element.
     * This method updates the tip element based on the new placement state provided by the popper data.
     *
     * @param {Object} popperData - The data object containing information about the popper's state.
     * @param {Object} popperData.state - The current state of the popper, which includes elements and placement information.
     * @throws {Error} Throws an error if the state is not defined or invalid.
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * // Example usage:
     * const popperData = {
     *   state: {
     *     elements: {
     *       popper: document.querySelector('.tooltip')
     *     },
     *     placement: 'top'
     *   }
     * };
     * instance._handlePopperPlacementChange(popperData);
     */
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
  };
  const DefaultType$2 = { ...Tooltip.DefaultType,
    content: '(string|element|function)'
  };
  const Event$1 = {
    HIDE: `hide${EVENT_KEY$3}`,
    HIDDEN: `hidden${EVENT_KEY$3}`,
    SHOW: `show${EVENT_KEY$3}`,
    SHOWN: `shown${EVENT_KEY$3}`,
    INSERTED: `inserted${EVENT_KEY$3}`,
    CLICK: `click${EVENT_KEY$3}`,
    FOCUSIN: `focusin${EVENT_KEY$3}`,
    FOCUSOUT: `focusout${EVENT_KEY$3}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
  };
  /**
   * Initializes or invokes a method on the Tooltip instance for each element in the jQuery collection.
   *
   * This method serves as a jQuery interface for the Tooltip component. It allows for both
   * initialization with a configuration object and invocation of specific methods on the Tooltip instance.
   *
   * @param {Object|string} config - The configuration object for initializing the Tooltip or
   *                                 the name of the method to invoke on the Tooltip instance.
   *
   * @throws {TypeError} Throws an error if a method name is provided that does not exist on
   *                    the Tooltip instance.
   *
   * @returns {jQuery} The jQuery collection for chaining.
   *
   * @example
   * // Initialize Tooltip with a configuration object
   * $('.tooltip-element').jQueryInterface({ animation: true });
   *
   * // Invoke a method on the Tooltip instance
   * $('.tooltip-element').jQueryInterface('show');
   */
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Popover extends Tooltip {
    // Getters
    static get Default() {
      return Default$2;
    }

    static get NAME() {
      return NAME$3;
    }

    static get Event() {
      return Event$1;
    }

    static get DefaultType() {
      return DefaultType$2;
    } // Overrides


    isWithContent() {
      return this.getTitle() || this._getContent();
    }

    setContent(tip) {
      this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);

      this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
    } // Private


    _getContent() {
      return this._resolvePossibleFunction(this._config.content);
    }

    _getBasicClassPrefix() {
      return CLASS_PREFIX;
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Popover.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Popover to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Popover);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$2 = 'scrollspy';
  const DATA_KEY$2 = 'bs.scrollspy';
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const DATA_API_KEY$1 = '.data-api';
  const Default$1 = {
    offset: 10,
    /**
     * Checks if the current instance has content.
     *
     * This method determines if there is a title or any content available
     * in the instance. It returns a boolean value indicating the presence
     * of content.
     *
     * @returns {boolean} True if there is a title or content, false otherwise.
     *
     * @example
     * const instance = new MyClass();
     * if (instance.isWithContent()) {
     *   console.log('Content is available.');
     * } else {
     *   console.log('No content found.');
     * }
     */
    method: 'auto',
    target: ''
  };
  const DefaultType$1 = {
    /**
     * Sets the content for a specific element by sanitizing the provided tip.
     * This method updates both the title and the main content of the element.
     *
     * @param {string} tip - The content to be set, which will be sanitized before being applied.
     *
     * @throws {Error} Throws an error if the provided tip is invalid or cannot be sanitized.
     *
     * @example
     * const contentManager = new ContentManager();
     * contentManager.setContent("This is a new title and content.");
     */
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
  /**
   * Retrieves the content by resolving it through a possible function.
   *
   * This method checks the configuration for the content property and
   * attempts to resolve it as a function if applicable. The resolved
   * value is then returned.
   *
   * @returns {any} The resolved content, which can be of any type depending
   *                on the implementation of the resolving function.
   *
   * @throws {Error} Throws an error if the content cannot be resolved
   *                 or if the configuration is invalid.
   *
   * @example
   * const content = instance._getContent();
   * console.log(content); // Outputs the resolved content.
   */
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
  /**
   * Retrieves the prefix used for basic class names.
   *
   * This method returns a constant value that represents the
   * prefix for class names in the application. It is typically
   * used to ensure consistency in class naming conventions
   * throughout the codebase.
   *
   * @returns {string} The class prefix.
   *
   * @example
   * const prefix = _getBasicClassPrefix();
   * console.log(prefix); // Outputs the class prefix
   */
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`;
  const SELECTOR_DROPDOWN$1 = '.dropdown';
  /**
   * Initializes or invokes methods on the Popover instances for each element in the jQuery collection.
   *
   * This method serves as a jQuery interface for the Popover component, allowing users to either
   * create a new instance with configuration options or call an existing method on the instance.
   *
   * @param {Object|string} config - The configuration object for initializing the Popover instance
   *                                 or a string representing the method name to invoke on the instance.
   *
   * @throws {TypeError} Throws an error if a string is provided as the config and the method does not exist.
   *
   * @returns {jQuery} Returns the jQuery collection for chaining.
   *
   * @example
   * // To initialize a Popover with specific options
   * $('.popover-element').jQueryInterface({ trigger: 'click' });
   *
   * // To invoke a method on an existing Popover instance
   * $('.popover-element').jQueryInterface('show');
   */
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
      this._config = this._getConfig(config);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
      this.refresh();

      this._process();
    } // Getters


    static get Default() {
      return Default$1;
    }

    static get NAME() {
      return NAME$2;
    } // Public


    refresh() {
      const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
      const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      const targets = SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target);
      targets.map(element => {
        const targetSelector = getSelectorFromElement(element);
        const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;

        if (target) {
          const targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
        this._offsets.push(item[0]);

        this._targets.push(item[1]);
      });
    }

    dispose() {
      EventHandler.off(this._scrollElement, EVENT_KEY$2);
      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default$1,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };
      config.target = getElement(config.target) || document.documentElement;
      typeCheckConfig(NAME$2, config, DefaultType$1);
      return config;
    }

    _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    }

    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    }

    _process() {
      const scrollTop = this._getScrollTop() + this._config.offset;

      const scrollHeight = this._getScrollHeight();

      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      /**
       * Refreshes the internal state of the component by recalculating offsets and targets
       * based on the current scroll position and configuration.
       *
       * This method determines the appropriate method for calculating offsets (either
       * based on the scroll position or a fixed offset) and updates the internal arrays
       * for offsets and targets. It also retrieves the height of the scrollable area.
       *
       * @throws {Error} Throws an error if the target selector is invalid or if there
       *                 are issues retrieving the bounding rectangle of the target elements.
       *
       * @example
       * // Example usage:
       * const instance = new SomeComponent();
       * instance.refresh();
       *
       * @returns {void}
       */
      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      for (let i = this._offsets.length; i--;) {
        const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      /**
       * Cleans up and releases resources used by the instance.
       * This method removes event listeners and performs any necessary
       * cleanup before the instance is destroyed.
       *
       * @throws {Error} Throws an error if the cleanup process fails.
       *
       * @example
       * const instance = new MyClass();
       * // ... use the instance ...
       * instance.dispose(); // cleans up resources
       */
      }
    }

    _activate(target) {
      this._activeTarget = target;

      /**
       * Merges the default configuration with user-provided configuration and data attributes.
       *
       * This method takes a configuration object, merges it with default settings and data attributes
       * from the element, and ensures that the target element is valid. It performs type checking on the
       * configuration to ensure all required properties are correctly set.
       *
       * @param {Object} config - The user-provided configuration object.
       * @param {string} [config.target] - The target element for the configuration. If not provided,
       *                                    defaults to the document's root element.
       * @returns {Object} The merged configuration object, including defaults and validated properties.
       *
       * @throws {TypeError} Throws an error if the provided configuration does not match the expected types.
       *
       * @example
       * const config = _getConfig({ target: '#myElement' });
       * console.log(config); // Outputs the merged configuration object.
       */
      this._clear();

      const queries = SELECTOR_LINK_ITEMS.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);
      const link = SelectorEngine.findOne(queries.join(','), this._config.target);
      link.classList.add(CLASS_NAME_ACTIVE$1);

      if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
      } else {
        SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
          /**
           * Retrieves the current vertical scroll position of the specified scroll element.
           * If the scroll element is the window, it returns the page's vertical offset.
           *
           * @returns {number} The current vertical scroll position in pixels.
           *
           * @throws {TypeError} Throws an error if the scroll element is not defined.
           *
           * @example
           * const scrollPosition = this._getScrollTop();
           * console.log(scrollPosition); // Outputs the vertical scroll position
           */
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item

          /**
           * Retrieves the total scrollable height of the scroll element.
           * If the scroll element does not have a defined scroll height,
           * it falls back to the maximum scroll height of the document body
           * or document element.
           *
           * @returns {number} The scroll height of the element or the maximum
           *                  scroll height of the document.
           *
           * @throws {TypeError} If the scroll element is not defined or
           *                     does not have a scrollHeight property.
           *
           * @example
           * const height = instance._getScrollHeight();
           * console.log(height); // Outputs the scroll height value.
           */
          SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
            SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
          });
        });
      /**
       * Retrieves the height of the scroll element or the window.
       *
       * This method checks if the scroll element is the window. If it is,
       * it returns the inner height of the window. Otherwise, it returns
       * the height of the scroll element using its bounding client rectangle.
       *
       * @returns {number} The height of the scroll element or window in pixels.
       *
       * @throws {TypeError} Throws an error if the scroll element is not defined.
       *
       * @example
       * const height = instance._getOffsetHeight();
       * console.log(height); // Outputs the height in pixels.
       */
      }

      EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
        relatedTarget: target
      /**
       * Handles the scrolling behavior and activates the appropriate target based on the current scroll position.
       * This method checks the current scroll position against the configured offsets and determines which target
       * should be active. It also refreshes the component if the scroll height changes.
       *
       * @throws {Error} Throws an error if the configuration is invalid or if there is an issue with scrolling.
       *
       * @example
       * // Assuming this method is called on a scroll event
       * instance._process();
       */
      });
    }

    _clear() {
      SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = ScrollSpy.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   /**
    * Activates a target element by updating the active state of the corresponding links and their parents.
    *
    * This method clears any previous active states, identifies the link associated with the given target,
    * and adds the active class to it. If the link is part of a dropdown, it also activates the dropdown toggle.
    * Additionally, it sets the active state for parent elements in navigation lists and groups.
    *
    * @param {string} target - The target identifier (e.g., an ID or href) that corresponds to the link to be activated.
    *
    * @throws {Error} Throws an error if the target is not found within the specified configuration target.
    *
    * @example
    * // Activating a target with ID 'section1'
    * instance._activate('#section1');
    *
    * @example
    * // Activating a link with href attribute
    * instance._activate('http://example.com');
    *
    * @fires EVENT_ACTIVATE - Triggers an event indicating that an activation has occurred, passing the related target.
    */
   * ------------------------------------------------------------------------
   * add .ScrollSpy to jQuery only if jQuery is present
   */

  defineJQueryPlugin(ScrollSpy);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$1 = 'tab';
  const DATA_KEY$1 = 'bs.tab';
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  /**
   * Removes the active class from all link items within the specified target.
   * This method searches for elements matching the defined selector and filters
   * those that currently have the active class applied. It then removes the active
   * class from each of these elements.
   *
   * @method _clear
   * @private
   * @throws {Error} Throws an error if the target is not found or if there are issues
   *                 with class manipulation.
   *
   * @example
   * // Assuming this._config.target is set to a valid DOM element
   * instance._clear();
   */
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  /**
   * Static method that acts as an interface for the ScrollSpy component.
   * It allows for the execution of specific methods on the ScrollSpy instance
   * based on the provided configuration.
   *
   * @param {Object|string} config - The configuration object or method name to invoke.
   *                                  If a string is provided, it should correspond to a method
   *                                  defined in the ScrollSpy instance.
   * @returns {jQuery} The jQuery object for chaining.
   *
   * @throws {TypeError} Throws an error if the provided config is a string that does not
   *                     match any method name in the ScrollSpy instance.
   *
   * @example
   * // Initialize ScrollSpy with default configuration
   * $('.selector').ScrollSpy();
   *
   * // Invoke a specific method on the ScrollSpy instance
   * $('.selector').ScrollSpy('methodName');
   */
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = ':scope > li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$1;
    } // Public


    show() {
      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
        return;
      }

      let previous;
      const target = getElementFromSelector(this._element);

      const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

      if (listElement) {
        const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
        previous = SelectorEngine.find(itemSelector, listElement);
        previous = previous[previous.length - 1];
      }

      const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
        relatedTarget: this._element
      }) : null;
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
        relatedTarget: previous
      });

      if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
        return;
      }

      this._activate(this._element, listElement);

      /**
       * Triggers events related to the visibility of an element.
       *
       * This function is responsible for notifying when an element is hidden
       * and when it becomes visible. It utilizes an event handler to trigger
       * the appropriate events with the related target information.
       *
       * @function complete
       * @returns {void} This function does not return a value.
       *
       * @throws {Error} Throws an error if the event triggering fails.
       *
       * @example
       * // Assuming 'previous' is a reference to a previously visible element
       * complete();
       */
      const complete = () => {
        EventHandler.trigger(previous, EVENT_HIDDEN$1, {
          relatedTarget: this._element
        });
        EventHandler.trigger(this._element, EVENT_SHOWN$1, {
          relatedTarget: previous
        });
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    } // Private


    _activate(element, container, callback) {
      /**
       * Displays the current element by activating it and deactivating any previously active elements.
       * This method checks if the element is already active and, if so, does nothing.
       * If the element is not active, it triggers the appropriate events for hiding the previous element
       * and showing the current one.
       *
       * @throws {Error} Throws an error if the element is not found in the DOM.
       *
       * @example
       * const myElement = document.querySelector('.my-element');
       * myElement.show();
       */
      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
      const active = activeElements[0];
      const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

      /**
       * Executes the transition completion process.
       *
       * This function is responsible for handling the completion of a transition,
       * invoking the specified callback function once the transition is complete.
       *
       * @function complete
       * @returns {void}
       *
       * @example
       * // Example usage of the complete function
       * complete();
       *
       * @throws {Error} Throws an error if the transition fails to complete.
       */
      const complete = () => this._transitionComplete(element, active, callback);

      if (active && isTransitioning) {
        active.classList.remove(CLASS_NAME_SHOW$1);

        this._queueCallback(complete, element, true);
      } else {
        complete();
      }
    }

    _transitionComplete(element, active, callback) {
      if (active) {
        active.classList.remove(CLASS_NAME_ACTIVE);
        const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);

        if (dropdownChild) {
          dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      element.classList.add(CLASS_NAME_ACTIVE);

      /**
       * Activates a specified element within a given container, handling any necessary transitions.
       *
       * This method checks if the container is a list (UL or OL) and finds active elements accordingly.
       * If an active element is found and is currently transitioning, it will remove the show class and queue
       * the callback to be executed once the transition is complete. If no active element is found or if
       * there is no transition, the callback is executed immediately.
       *
       * @param {HTMLElement} element - The element to be activated.
       * @param {HTMLElement} container - The container within which to activate the element.
       * @param {Function} [callback] - An optional callback function to be executed after activation.
       *
       * @returns {void}
       *
       * @throws {TypeError} Throws an error if the provided element or container is not a valid HTMLElement.
       *
       * @example
       * // Example usage of _activate method
       * const myElement = document.getElementById('myElement');
       * const myContainer = document.getElementById('myContainer');
       * this._activate(myElement, myContainer, () => {
       *   console.log('Activation complete!');
       * });
       */
      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      reflow(element);

      if (element.classList.contains(CLASS_NAME_FADE$1)) {
        element.classList.add(CLASS_NAME_SHOW$1);
      }

      let parent = element.parentNode;

      if (parent && parent.nodeName === 'LI') {
        parent = parent.parentNode;
      }

      /**
       * Handles the completion of a transition for a given element.
       * This function updates the active state of elements, manages ARIA attributes,
       * and triggers a callback if provided.
       *
       * @param {HTMLElement} element - The element that is transitioning to the active state.
       * @param {HTMLElement} active - The currently active element that is being deactivated.
       * @param {Function} [callback] - An optional callback function to be executed after the transition completes.
       *
       * @throws {TypeError} Throws an error if the provided element or active is not an instance of HTMLElement.
       *
       * @example
       * // Example usage of _transitionComplete
       * const tabElement = document.querySelector('.tab');
       * const activeTab = document.querySelector('.tab.active');
       * _transitionComplete(tabElement, activeTab, () => {
       *   console.log('Transition complete!');
       * });
       */
      if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
        const dropdownElement = element.closest(SELECTOR_DROPDOWN);

        if (dropdownElement) {
          SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tab.getOrCreateInstance(this);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    const data = Tab.getOrCreateInstance(this);
    /**
     * jQuery interface for the Tab component.
     * This method allows for the initialization of the Tab instance or the invocation of a specific method on it.
     *
     * @param {string|Object} config - The configuration object or method name to invoke on the Tab instance.
     * If a string is provided, it should correspond to a method defined on the Tab instance.
     *
     * @throws {TypeError} Throws an error if the provided method name does not exist on the Tab instance.
     *
     * @returns {jQuery} The jQuery object for chaining.
     *
     * @example
     * // Initialize the Tab component
     * $('.tab-selector').jQueryInterface();
     *
     * // Invoke a specific method on the Tab instance
     * $('.tab-selector').jQueryInterface('show');
     */
    data.show();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tab to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Tab);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'toast';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY}`;
  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility

  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  const Default = {
    animation: true,
    autohide: true,
    delay: 5000
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._timeout = null;
      this._hasMouseInteraction = false;
      this._hasKeyboardInteraction = false;

      this._setListeners();
    } // Getters


    static get DefaultType() {
      return DefaultType;
    }

    static get Default() {
      return Default;
    }

    static get NAME() {
      return NAME;
    } // Public


    show() {
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

      if (showEvent.defaultPrevented) {
        return;
      }

      this._clearTimeout();

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }

      /**
       * Completes the current operation by removing the showing class from the element,
       * triggering the shown event, and potentially scheduling a hide operation.
       *
       * This function is typically used in the context of UI components to manage
       * visibility states. It ensures that the element is no longer displayed as 'showing'
       * and notifies other parts of the application that the element has been shown.
       *
       * @throws {Error} Throws an error if the element is not properly initialized or if
       *                 there are issues with event handling.
       *
       * @example
       * // Example usage of complete function
       * const myComponent = new MyComponent();
       * myComponent.complete();
       */
      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);

        /**
         * Displays the element by triggering the show event and applying necessary classes.
         *
         * This method first triggers a show event using the EventHandler. If the event is
         * prevented, the method will exit early. It handles animation by adding a fade class
         * if configured. The method also manages the visibility of the element by removing
         * the hide class and adding show and showing classes to facilitate the display.
         *
         * Once the display transition is complete, it triggers a shown event and may schedule
         * a hide operation based on the configuration.
         *
         * @throws {Error} Throws an error if the element is not properly initialized or if
         *                 there are issues with event handling.
         *
         * @example
         * const myElement = new MyComponent(element);
         * myElement.show();
         */
        EventHandler.trigger(this._element, EVENT_SHOWN);

        this._maybeScheduleHide();
      };

      this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated


      reflow(this._element);

      this._element.classList.add(CLASS_NAME_SHOW);

      this._element.classList.add(CLASS_NAME_SHOWING);

      this._queueCallback(complete, this._element, this._config.animation);
    }

    hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      /**
       * Completes the hiding process of the associated element by managing its CSS classes.
       * This method is responsible for removing the visibility classes from the element and
       * triggering an event to indicate that the element is now hidden.
       *
       /**
        * Hides the element by removing the visible classes and triggering the appropriate events.
        *
        * This method checks if the element is currently visible. If it is not, the method exits early.
        * It triggers a hide event and checks if the default action has been prevented. If so, it exits.
        * The method then proceeds to add a 'showing' class to indicate that the hiding process is in progress.
        * Once the hiding animation is complete, it adds a 'hide' class (deprecated) and removes the 'showing'
        * and 'show' classes. Finally, it triggers a hidden event to notify that the element is no longer visible.
        *
        * @throws {Error} Throws an error if the element is not defined or if there is an issue with the event handling.
        *
        * @example
        * const myElement = document.getElementById('myElement');
        * const myInstance = new MyClass(myElement);
        * myInstance.hide();
        */
       * @deprecated This method is deprecated and may be removed in future versions.
       * Use an alternative method for hiding elements.
       *
       * @throws {Error} Throws an error if the element is not defined or if there is an issue
       *                 with the event triggering.
       *
       * @example
       * // Assuming 'element' is a valid DOM element
       * const instance = new SomeClass(element);
       * instance.complete();
       */
      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE); // @deprecated


        this._element.classList.remove(CLASS_NAME_SHOWING);

        this._element.classList.remove(CLASS_NAME_SHOW);

        EventHandler.trigger(this._element, EVENT_HIDDEN);
      };

      this._element.classList.add(CLASS_NAME_SHOWING);

      this._queueCallback(complete, this._element, this._config.animation);
    }

    /**
     * Cleans up and disposes of the instance, removing any associated resources.
     * This method clears any active timeouts and removes the 'show' class from the element
     * if it is currently present, ensuring that the element is properly hidden.
     * It also calls the parent class's dispose method to perform any additional cleanup.
     *
     * @throws {Error} Throws an error if the disposal process fails.
     *
     * @example
     * const instance = new MyClass();
     * instance.dispose();
     * // The instance is now disposed of, and resources are released.
     */
    dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }

      super.dispose();
    } // Private


    /**
     * Merges the default configuration with user-defined configuration and
     * data attributes from the element.
     *
     * This method retrieves the configuration settings for the component,
     * ensuring that all necessary properties are defined. It combines the
     * default settings with any data attributes present on the element and
     * any additional configuration provided by the user.
     *
     * @param {Object} config - The user-defined configuration object.
     *                          If not provided or if it is not an object,
     *                          defaults will be used.
     * @returns {Object} The merged configuration object that includes
     *                  defaults, data attributes, and user-defined settings.
     *
     * @throws {TypeError} Throws an error if the provided configuration
     *                     does not match the expected types defined in
     *                     the DefaultType.
     *
     * @example
     * const config = this._getConfig({ customSetting: true });
     * console.log(config); // Outputs the merged configuration object.
     */
    _getConfig(config) {
      config = { ...Default,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };
      typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    }

    /**
     * Schedules the hiding of an element based on the current configuration and user interactions.
     *
     * This method checks if the autohide feature is enabled and whether there has been any mouse or keyboard interaction.
     * If autohide is enabled and there has been no interaction, it sets a timeout to hide the element after a specified delay.
     *
     * @throws {Error} Throws an error if the configuration is invalid or if the delay is not a number.
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * // Assuming autohide is enabled and there is no user interaction,
     * // this will schedule the hide operation after the configured delay.
     * instance._maybeScheduleHide();
     */
    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return;
      }

      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
      }

      this._timeout = setTimeout(() => {
        this.hide();
      }, this._config.delay);
    }

    /**
     * Handles interaction events such as mouse and keyboard focus.
     * Updates internal state based on the type of interaction and whether
     * the user is currently interacting with the element.
     *
     * @param {Event} event - The event object representing the interaction.
     * @param {boolean} isInteracting - A flag indicating whether the user is interacting with the element.
     *
     * @returns {void}
     *
     * @throws {TypeError} Throws an error if the event is not of a recognized type.
     *
     * @example
     * // Example usage of _onInteraction
     * element._onInteraction(event, true);
     *
     * @description
     * The method processes different types of events:
     * - For 'mouseover' and 'mouseout', it updates the mouse interaction state.
     * - For 'focusin' and 'focusout', it updates the keyboard interaction state.
     *
     * If the user is interacting, it clears any scheduled hide actions.
     * If the user is not interacting, it checks if the next element is related to the current element,
     * and if not, it may schedule a hide action.
     */
    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          this._hasMouseInteraction = isInteracting;
          break;

        case 'focusin':
        case 'focusout':
          this._hasKeyboardInteraction = isInteracting;
          break;
      }

      if (isInteracting) {
        this._clearTimeout();

        return;
      }

      const nextElement = event.relatedTarget;

      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
      }

      this._maybeScheduleHide();
    }

    /**
     * Sets up event listeners for the specified element to handle user interactions.
     * The listeners respond to mouse and focus events, invoking a handler method
     * to process the interactions.
     *
     * This method registers the following event listeners:
     * - Mouse over event
     * - Mouse out event
     * - Focus in event
     * - Focus out event
     *
     * Each event triggers the `_onInteraction` method with a boolean indicating
     * whether the interaction is starting (true) or ending (false).
     *
     * @throws {Error} Throws an error if the element is not defined or if there is an issue
     *                 with event registration.
     *
     * @example
     * // Assuming `element` is a valid DOM element
     * const instance = new SomeClass(element);
     * instance._setListeners(); // Sets up the event listeners for the instance's element
     */
    _setListeners() {
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
    }

    /**
     * Clears the timeout that was previously set using `setTimeout`.
     * This method resets the internal timeout reference to `null`.
     *
     * @throws {Error} Throws an error if there is no active timeout to clear.
     *
     * @example
     * const instance = new SomeClass();
     * instance._clearTimeout(); // Clears the timeout if it exists.
     */
    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    } // Static


    /**
     * jQuery interface for the Toast component.
     * This method allows for the initialization of the Toast instance or the invocation of its methods.
     *
     * @static
     * @param {Object|string} config - Configuration options for the Toast instance or a method name to invoke.
     * @returns {jQuery} The jQuery object for chaining.
     * @throws {TypeError} Throws an error if a method name is provided that does not exist on the Toast instance.
     *
     * @example
     * // Initialize a Toast with default options
     * $('.toast').jQueryInterface();
     *
     * // Invoke a specific method on the Toast instance
     * $('.toast').jQueryInterface('show');
     */
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Toast.getOrCreateInstance(this, config);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config](this);
        }
      });
    }

  }

  enableDismissTrigger(Toast);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Toast to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Toast);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): index.umd.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  var index_umd = {
    Alert,
    Button,
    Carousel,
    Collapse,
    Dropdown,
    Modal,
    Offcanvas,
    Popover,
    ScrollSpy,
    Tab,
    Toast,
    Tooltip
  };

  return index_umd;

})));
//# sourceMappingURL=bootstrap.js.map
