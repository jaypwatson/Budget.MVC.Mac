/*!
  * Bootstrap v5.1.0 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory());
}(this, (function () { 'use strict';

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
   * For other types, it utilizes the `Object.prototype.toString` method to identify the type of the object.
   *
   * @param {*} obj - The object whose type is to be determined. Can be any value, including null or undefined.
   * @returns {string} A string representing the type of the object (e.g., "string", "number", "array", etc.).
   *
   * @example
   * toType(null); // returns "null"
   * toType(undefined); // returns "undefined"
   * toType([]); // returns "array"
   * toType({}); // returns "object"
   * toType(42); // returns "number"
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
   * The function first checks for a `data-bs-target` attribute. If it is not present or is set to `#`,
   * it then checks the `href` attribute for a valid selector.
   * Valid selectors are expected to start with `#` (for IDs) or `.` (for classes).
   * If the `href` contains an anchor but does not start with `#`, it will be adjusted accordingly.
   *
   * @param {HTMLElement} element - The HTML element from which to retrieve the selector.
   * @returns {string|null} - Returns a valid selector string if found, otherwise returns null.
   *
   * @example
   * const element = document.querySelector('.my-element');
   * const selector = getSelector(element);
   * console.log(selector); // Outputs the selector or null if not valid.
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
   * Retrieves a CSS selector string for a given DOM element.
   *
   * This function attempts to generate a selector for the provided element
   * using the `getSelector` utility function. If a valid selector is generated,
   * it checks if the selector matches any element in the document. If a match
   * is found, the selector is returned; otherwise, null is returned.
   *
   * @param {Element} element - The DOM element for which to retrieve the selector.
   * @returns {string|null} The CSS selector string if a valid selector is found and matches an element, otherwise null.
   *
   * @throws {TypeError} Throws an error if the provided argument is not a valid DOM element.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const selector = getSelectorFromElement(element);
   * console.log(selector); // Outputs the selector string or null if not found.
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
   * This function first obtains a selector string from the input element using the
   * `getSelector` function. If a valid selector is found, it uses `document.querySelector`
   * to return the corresponding DOM element. If no valid selector is found, it returns null.
   *
   * @param {Element} element - The DOM element from which to derive the selector.
   * @returns {Element|null} The first matching DOM element or null if no valid selector is found.
   *
   * @example
   * const myElement = getElementFromSelector(document.getElementById('myId'));
   * // myElement will be the DOM element with id 'myId' or null if not found.
   */
  const getElementFromSelector = element => {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
  };

  /**
   * Calculates the total transition duration of a given DOM element.
   *
   * This function retrieves the computed styles of the specified element to determine
   * the transition duration and transition delay. If the element is not provided or
   * if both the transition duration and delay are not defined, it returns 0.
   *
   * @param {Element} element - The DOM element for which to calculate the transition duration.
   *                            If no element is provided, the function returns 0.
   * @returns {number} The total transition duration in milliseconds. This is the sum of the
   *                   transition duration and transition delay. If no valid duration or delay
   *                   is found, it returns 0.
   *
   * @example
   * const duration = getTransitionDurationFromElement(document.querySelector('.my-element'));
   * console.log(duration); // Outputs the transition duration in milliseconds.
   *
   * @throws {TypeError} Throws an error if the provided argument is not a valid DOM element.
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
   * Dispatches a transition end event on the specified element.
   *
   * This function is useful for simulating the end of a CSS transition,
   * allowing for any associated event listeners to be triggered.
   *
   * @param {Element} element - The DOM element on which to dispatch the event.
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
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
   * valid `nodeType` property, which is characteristic of DOM elements.
   * If the input is a jQuery object, it will extract the underlying DOM
   * element for the check.
   *
   * @param {any} obj - The object to be checked.
   * @returns {boolean} Returns true if the object is a DOM element,
   *                    otherwise returns false.
   *
   * @example
   * const div = document.createElement('div');
   * console.log(isElement(div)); // true
   *
   * const notAnElement = {};
   * console.log(isElement(notAnElement)); // false
   *
   * const $element = jQuery('<div></div>');
   * console.log(isElement($element)); // true
   */
  const isElement$1 = obj => {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
    }

    return typeof obj.nodeType !== 'undefined';
  };

  /**
   * Retrieves a DOM element or a jQuery object from the provided input.
   * The function checks if the input is a jQuery object or a DOM node,
   * and returns the corresponding element. If the input is a string, it
   * attempts to find the first matching element in the document using
   * `document.querySelector`. If the input does not match any expected
   * types, it returns null.
   *
   * @param {Object|string} obj - The input to retrieve the element from.
   *                              This can be a jQuery object, a DOM element,
   *                              or a string representing a CSS selector.
   * @returns {Element|null} The corresponding DOM element if found, or null
   *                        if the input is invalid or no matching element exists.
   *
   * @example
   * // Using a jQuery object
   * const $element = $('#myElement');
   * const element = getElement($element); // returns the DOM element
   *
   * @example
   * // Using a CSS selector string
   * const element = getElement('.my-class'); // returns the first matching element
   *
   * @example
   * // Using a DOM element directly
   * const element = document.getElementById('myElement');
   * const result = getElement(element); // returns the same DOM element
   *
   * @example
   * // Invalid input
   * const result = getElement(null); // returns null
   */
  const getElement = obj => {
    if (isElement$1(obj)) {
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
   * This function checks each property in the provided configuration object against
   * the expected types defined in the configTypes object. If a property's type does not
   * match the expected type, a TypeError is thrown with a descriptive message.
   *
   * @param {string} componentName - The name of the component being validated.
   * @param {Object} config - The configuration object containing properties to validate.
   * @param {Object} configTypes - An object defining the expected types for each property in config.
   *
   * @throws {TypeError} Throws an error if a property's type does not match the expected type.
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
   * typeCheckConfig('MyComponent', config, configTypes);
   *
   * @example
   * // This will throw a TypeError
   * const invalidConfig = {
   *   title: 123, // Invalid type
   *   isVisible: true,
   * };
   * typeCheckConfig('MyComponent', invalidConfig, configTypes);
   */
  const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach(property => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement$1(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    });
  };

  /**
   * Checks if a given HTML element is visible in the viewport.
   *
   * An element is considered visible if it is a valid HTML element,
   * has a non-zero size (i.e., it has client rectangles), and its
   * computed style for the 'visibility' property is set to 'visible'.
   *
   * @param {HTMLElement} element - The HTML element to check for visibility.
   * @returns {boolean} Returns true if the element is visible, otherwise false.
   *
   * @throws {TypeError} Throws an error if the provided argument is not an HTMLElement.
   *
   * @example
   * const myElement = document.getElementById('myElement');
   * const visible = isVisible(myElement);
   * console.log(visible); // true or false based on the element's visibility
   */
  const isVisible = element => {
    if (!isElement$1(element) || element.getClientRects().length === 0) {
      return false;
    }

    return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
  };

  /**
   * Checks if a given HTML element is disabled.
   *
   * This function evaluates whether the provided element is either
   * not a valid HTML element, has a class of 'disabled', or has
   * the 'disabled' attribute set to true. It returns true if the
   * element is considered disabled, and false otherwise.
   *
   * @param {HTMLElement} element - The HTML element to check.
   * @returns {boolean} True if the element is disabled, false otherwise.
   *
   * @throws {TypeError} Throws an error if the provided argument is
   * not an instance of HTMLElement.
   *
   * @example
   * const button = document.querySelector('button');
   * const result = isDisabled(button);
   * console.log(result); // Outputs: true or false based on the button's state
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
   * Recursively searches for the Shadow DOM root of a given element.
   *
   * This function checks if the provided element or any of its ancestors
   * is a ShadowRoot. If the element is part of a Shadow DOM, the function
   * returns the corresponding ShadowRoot. If no ShadowRoot is found, it
   * returns null.
   *
   * @param {Element} element - The element from which to start the search.
   * @returns {ShadowRoot|null} The ShadowRoot associated with the element, or null if none is found.
   *
   * @example
   * const shadowRoot = findShadowRoot(someElement);
   * if (shadowRoot) {
   *   console.log('Shadow root found:', shadowRoot);
   * } else {
   *   console.log('No shadow root found.');
   * }
   *
   * @throws {TypeError} Throws a TypeError if the provided element is not a valid DOM element.
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
   * This function can be used as a placeholder in situations where a function is required,
   * but no operation needs to be performed.
   *
   * @function noop
   * @returns {void} This function does not return any value.
   *
   * @example
   * // Using noop as a default callback
   * const callback = noop;
   * callback(); // This will not perform any operation and will not throw an error.
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
   * Retrieves the jQuery object from the global window object if it exists
   * and the body does not have the 'data-bs-no-jquery' attribute.
   *
   * @returns {jQuery|null} The jQuery object if available, otherwise null.
   *
   * @example
   * const $ = getjQuery();
   * if ($) {
   *   // jQuery is available, proceed with jQuery operations
   * } else {
   *   // jQuery is not available
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
   * Executes a callback function once the DOM content has fully loaded.
   * If the DOM is already loaded, the callback is executed immediately.
   * If the DOM is still loading, the callback is registered to be executed
   * when the 'DOMContentLoaded' event fires.
   *
   * @param {Function} callback - The function to be executed once the DOM is ready.
   *
   * @throws {TypeError} Throws an error if the provided callback is not a function.
   *
   * @example
   * // Example usage:
   * onDOMContentLoaded(() => {
   *   console.log('DOM fully loaded and parsed');
   * });
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
   * This function initializes the plugin when the DOM content is fully loaded.
   *
   * @param {Object} plugin - The plugin object that contains the necessary properties and methods.
   * @param {string} plugin.NAME - The name of the plugin, which will be used as the jQuery function name.
   * @param {Function} plugin.jQueryInterface - The function that will be called when the plugin is invoked.
   *
   * @returns {void} This function does not return a value.
   *
   * @example
   * const myPlugin = {
   *   NAME: 'myPlugin',
   *   jQueryInterface: function() {
   *     // Plugin logic here
   *   }
   * };
   * defineJQueryPlugin(myPlugin);
   *
   * @throws {Error} Throws an error if jQuery is not available when the plugin is defined.
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
   * Executes a provided callback function if it is of type 'function'.
   *
   * @param {Function} callback - The callback function to be executed.
   * @throws {TypeError} Throws an error if the provided callback is not a function.
   *
   * @example
   * // Example of a valid callback
   * execute(() => {
   *   console.log('Callback executed!');
   * });
   *
   * @example
   * // Example of an invalid callback
   * execute('not a function'); // This will not execute and may throw an error.
   */
  const execute = callback => {
    if (typeof callback === 'function') {
      callback();
    }
  };

  /**
   * Executes a callback function after a CSS transition has completed on a specified element.
   * If the transition should not be waited for, the callback is executed immediately.
   *
   * @param {Function} callback - The function to execute after the transition.
   * @param {Element} transitionElement - The DOM element on which the transition occurs.
   * @param {boolean} [waitForTransition=true] - A flag indicating whether to wait for the transition to complete before executing the callback.
   *
   * @throws {TypeError} Throws an error if the transitionElement is not a valid DOM element.
   *
   * @example
   * // Example usage:
   * const element = document.querySelector('.my-element');
   * executeAfterTransition(() => {
   *   console.log('Transition completed!');
   * }, element);
   *
   * @example
   * // Example usage without waiting for the transition:
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
     * This function is invoked when a transition ends. It checks if the event's target
     * matches the designated transition element. If it does, it sets a flag indicating
     * that the handler has been called, removes itself as an event listener, and executes
     * the provided callback function.
     *
     * @param {Object} event - The event object associated with the transition end.
     * @param {HTMLElement} event.target - The element that triggered the transition end event.
     *
     * @returns {void}
     *
     * @example
     * // Usage example:
     * const transitionElement = document.querySelector('.my-element');
     * const callback = () => console.log('Transition ended!');
     * transitionElement.addEventListener('transitionend', handler);
     *
     * @throws {Error} Throws an error if the target element is not the expected transition element.
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
   * Retrieves the previous or next element from a given list based on the active element and specified direction.
   *
   * This function allows for cycling through the list of elements if the specified flag is set.
   * If the active element is not found in the list, it returns either the first or last element based on the direction and cycling option.
   *
   * @param {Array} list - The list of elements to traverse.
   * @param {Element} activeElement - The currently active element from which to determine the next or previous element.
   * @param {boolean} shouldGetNext - A flag indicating whether to retrieve the next (true) or previous (false) element.
   * @param {boolean} isCycleAllowed - A flag indicating whether cycling through the list is permitted.
   * @return {Element} The next or previous element in the list, or the first/last element if cycling is allowed and the active element is not found.
   *
   * @throws {Error} Throws an error if the list is empty.
   *
   * @example
   * const elements = ['a', 'b', 'c'];
   * const current = 'b';
   * const nextElement = getNextActiveElement(elements, current, true, true); // returns 'c'
   * const previousElement = getNextActiveElement(elements, current, false, true); // returns 'a'
   * const cycleElement = getNextActiveElement(elements, 'd', true, true); // returns 'a' (cycling)
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
   * Retrieves a unique identifier for an event associated with a given element.
   * If a unique identifier (uid) is provided, it combines it with an incrementing
   * counter to generate a new unique identifier. If no uid is provided, it checks
   * the element for an existing uidEvent or generates a new one.
   *
   * @param {HTMLElement} element - The DOM element for which the unique identifier is being retrieved.
   * @param {string} [uid] - An optional unique identifier to be used for generating the uidEvent.
   * @returns {string} The unique identifier for the event associated with the element.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const uniqueId = getUidEvent(element, 'customUid');
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
   */
  function getUidEvent(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }

  /**
   * Retrieves the event registry for a specified DOM element.
   *
   * This function generates a unique identifier for the given element and
   * associates it with an event registry. If the registry does not exist for
   * the generated UID, it initializes an empty object for that UID.
   *
   * @param {Element} element - The DOM element for which to retrieve the event registry.
   * @returns {Object} The event registry associated with the specified element.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
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
   * Creates a handler function that is bound to a specific element and executes a given function when an event occurs.
   *
   * @param {HTMLElement} element - The DOM element to which the event handler will be bound.
   * @param {Function} fn - The function to be executed when the event is triggered.
   * @returns {Function} A new handler function that can be used with event listeners.
   *
   * @example
   * const button = document.querySelector('button');
   * const handleClick = (event) => {
   *   console.log('Button clicked!', event);
   * };
   * const buttonHandler = bootstrapHandler(button, handleClick);
   * button.addEventListener('click', buttonHandler);
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
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
   * Creates a delegation handler for a specified event on a given element.
   * This function allows for event delegation, meaning that events can be
   * handled on child elements that match a specified selector.
   *
   * @param {Element} element - The parent element to which the event listener
   *                            will be attached.
   * @param {string} selector - A CSS selector string to match the target
   *                            elements for the event.
   * @param {Function} fn - The function to execute when the event is triggered
   *                        on a matching child element.
   * @returns {Function} A handler function that will be called when the event
   *                    occurs on a matching child element.
   *
   * @example
   * const handler = bootstrapDelegationHandler(parentElement, '.child', function(event) {
   *   console.log('Child element clicked:', event.delegateTarget);
   * });
   *
   * parentElement.addEventListener('click', handler);
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid
   *                     DOM element or if the selector is not a string.
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
   * based on the original handler and an optional delegation selector.
   *
   * @param {Object} events - An object containing event data, where each key is a unique identifier for an event.
   * @param {Function} handler - The event handler function to search for within the events.
   * @param {string|null} [delegationSelector=null] - An optional selector string for delegated events. If not provided, defaults to null.
   * @returns {Object|null} Returns the matching event object if found, otherwise returns null.
   *
   * @example
   * const events = {
   *   '1': { originalHandler: myHandler, delegationSelector: '.btn' },
   *   '2': { originalHandler: anotherHandler, delegationSelector: null }
   * };
   * const result = findHandler(events, myHandler, '.btn');
   * // result will be { originalHandler: myHandler, delegationSelector: '.btn' }
   *
   * @throws {TypeError} Throws an error if the events parameter is not an object or if the handler is not a function.
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
   * This function determines whether the provided handler is a delegation string
   * and retrieves the appropriate event type. It also checks if the event type is
   * a native event and adjusts accordingly.
   *
   * @param {string} originalTypeEvent - The original type of the event as a string.
   * @param {function|string} handler - The event handler function or a delegation string.
   * @param {function} delegationFn - The function to be used if the handler is a delegation string.
   *
   * @returns {[boolean, function, string]} An array containing:
   *   - A boolean indicating if the handler is a delegation.
   *   - The original handler function.
   *   - The normalized event type as a string.
   *
   * @throws {TypeError} Throws an error if the originalTypeEvent is not a string.
   *
   * @example
   * const [isDelegation, handlerFn, eventType] = normalizeParams('click', myHandler, myDelegationFn);
   * // isDelegation will be false, handlerFn will be myHandler, and eventType will be 'click'.
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
   * This function normalizes the parameters and handles custom events, ensuring that the event handler is
   * correctly wrapped for mouseenter and mouseleave events to prevent unintended behavior.
   *
   * @param {HTMLElement} element - The DOM element to which the event handler will be attached.
   * @param {string} originalTypeEvent - The type of the event (e.g., 'click', 'mouseenter').
   * @param {Function} [handler] - The function to execute when the event is triggered.
   * @param {Function} [delegationFn] - An optional delegation function for event delegation.
   * @param {boolean} [oneOff=false] - If true, the handler will be executed at most once after being added.
   *
   * @throws {TypeError} Throws an error if the originalTypeEvent is not a string or if the element is not provided.
   *
   * @example
   * // Example of attaching a click event handler
   * addHandler(document.getElementById('myButton'), 'click', function() {
   *   console.log('Button clicked!');
   * });
   *
   * @example
   * // Example of attaching a delegated event handler
   * addHandler(document.getElementById('parentDiv'), 'click', function() {
   *   console.log('Child element clicked!');
   * }, function(event) {
   *   return event.target.matches('.child');
   });
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
       * This is useful for event handling where you want to avoid executing the function
       * when the event originates from a related element that is part of the same
       * delegation context.
       *
       * @param {Function} fn - The function to be wrapped.
       * @returns {Function} A new function that wraps the original function `fn`.
       *
       * @example
       * const handleClick = wrapFn(function(event) {
       *   console.log('Element clicked:', this);
       * });
       *
       * element.addEventListener('click', handleClick);
       *
       * @throws {TypeError} Throws an error if `fn` is not a function.
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
   * This function searches for the specified event handler in the provided events object
   * and removes it from the element's event listeners. If the handler is not found,
   * the function does nothing.
   *
   * @param {Element} element - The DOM element from which the event handler will be removed.
   * @param {Object} events - An object containing event handlers indexed by event type.
   * @param {string} typeEvent - The type of event (e.g., 'click', 'mouseover') for which the handler is registered.
   * @param {Function} handler - The event handler function to be removed.
   * @param {string} [delegationSelector] - An optional selector string to specify a delegated event handler.
   *
   * @returns {void}
   *
   * @throws {Error} Throws an error if the events object is not properly structured or if the element is invalid.
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
   * Removes event handlers that are associated with a specific namespace from a given element.
   *
   * This function iterates through the stored event handlers for a specified event type
   * and removes those that match the provided namespace.
   *
   * @param {HTMLElement} element - The DOM element from which the event handlers will be removed.
   * @param {Object} events - An object containing all event handlers associated with the element.
   * @param {string} typeEvent - The type of event (e.g., 'click', 'keyup') for which handlers should be removed.
   * @param {string} namespace - The namespace to match against the handler keys for removal.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
   *
   * @example
   * // Assuming `button` is a reference to a button element and `eventStore` contains event handlers
   * removeNamespacedHandlers(button, eventStore, 'click', 'myNamespace');
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
   * This function processes an event string that may contain a namespace (e.g., 'click.bs.button')
   * and returns the corresponding native event type (e.g., 'click'). If the event type is not found
   * in the custom events mapping, it returns the original event type.
   *
   * @param {string} event - The namespaced event string to be processed.
   * @returns {string} The native event type corresponding to the provided namespaced event.
   *
   * @example
   * const nativeEvent = getTypeEvent('click.bs.button');
   * console.log(nativeEvent); // Output: 'click'
   *
   * @throws {TypeError} Throws an error if the provided event is not a string.
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
   * elements with a specific data attribute to dismiss the component. It prevents
   * the default action for anchor and area elements and checks if the element is
   * disabled before proceeding to hide the component.
   *
   * @param {Object} component - The component for which the dismiss trigger is being enabled.
   * @param {string} [method='hide'] - The method to call on the component instance when dismissing.
   *                                   Defaults to 'hide'.
   *
   * @throws {Error} Throws an error if the component does not have the specified method.
   *
   * @example
   * // Example usage:
   * enableDismissTrigger(AlertComponent);
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
   * to a boolean, number, null, or returns the original string based on
   * specific conditions.
   *
   * @param {string} val - The input value to normalize. It can be a string
   *                       representation of true, false, a number, an empty
   *                       string, or 'null'.
   * @returns {boolean|null|number|string} - Returns the normalized value:
   *                                          - `true` if the input is 'true'
   *                                          - `false` if the input is 'false'
   *                                          - A number if the input is a numeric string
   *                                          - `null` if the input is an empty string or 'null'
   *                                          - The original string for any other input
   *
   * @example
   * // returns true
   * normalizeData('true');
   *
   * @example
   * // returns false
   * normalizeData('false');
   *
   * @example
   * // returns 42
   * normalizeData('42');
   *
   * @example
   * // returns null
   * normalizeData('');
   *
   * @example
   * // returns 'hello'
   * normalizeData('hello');
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
   * Normalizes a data key by converting uppercase letters to lowercase
   * and prefixing them with a hyphen.
   *
   * This function is useful for transforming keys from camelCase or
   * PascalCase to a format suitable for use in CSS or HTML attributes
   * where kebab-case is preferred.
   *
   * @param {string} key - The data key to be normalized.
   * @returns {string} The normalized key in kebab-case format.
   *
   * @example
   * // returns 'data-key'
   * normalizeDataKey('dataKey');
   *
   * @example
   * // returns 'my-component'
   * normalizeDataKey('MyComponent');
   *
   * @throws {TypeError} Throws an error if the input is not a string.
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

    prev(element, selector) {
      let previous = element.previousElementSibling;

      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }

        previous = previous.previousElementSibling;
      }

      return [];
    },

    next(element, selector) {
      let next = element.nextElementSibling;

      while (next) {
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
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element);
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

      if (this._config && this._config.interval && !this._isPaused) {
        this._updateInterval();

        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    }

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
       *
       * This function captures the initial X coordinate of the touch or pointer event,
       * depending on the type of pointer (pen, touch, or mouse). It distinguishes between
       * pointer events and touch events to determine how to retrieve the X coordinate.
       *
       * @param {PointerEvent|TouchEvent} event - The event object representing the touch or pointer event.
       *
       * @returns {void} This function does not return a value.
       *
       * @throws {TypeError} Throws an error if the event is not of type PointerEvent or TouchEvent.
       *
       * @example
       * // Example usage in a touch event listener
       * element.addEventListener('touchstart', start);
       *
       * // Example usage in a pointer event listener
       * element.addEventListener('pointerdown', start);
       */
      const start = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchStartX = event.clientX;
        } else if (!this._pointerEvent) {
          this.touchStartX = event.touches[0].clientX;
        }
      };

      /**
       * Handles the movement event for touch interactions.
       * This function calculates the horizontal distance moved by a single touch,
       * ensuring that it only responds to swiping gestures and not pinching gestures.
       *
       * @param {TouchEvent} event - The touch event containing information about the touch points.
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
       * This function calculates the delta of the touch movement and triggers the swipe handling logic.
       * If the carousel is configured to pause on hover, it pauses the cycling of the carousel when a touch event ends,
       * and restarts it after a specified timeout.
       *
       * @param {PointerEvent} event - The pointer event that triggered this handler.
       *
       * @throws {Error} Throws an error if the event does not have a valid pointer type.
       *
       * @example
       * // Example usage in a touch-enabled environment
       * element.addEventListener('pointerup', end);
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
       * Triggers a 'slid' event on the associated element.
       *
       * This function is responsible for notifying listeners that a sliding transition has occurred.
       * It emits an event with details about the transition, including the related target element,
       * the direction of the slide, and the indices of the elements involved in the transition.
       *
       * @event slid
       * @type {CustomEvent}
       * @param {HTMLElement} relatedTarget - The element that is being transitioned to.
       * @param {string} direction - The direction of the slide (e.g., 'left', 'right').
       * @param {number} from - The index of the currently active element before the slide.
       * @param {number} to - The index of the element that is being transitioned to.
       *
       * @throws {Error} Throws an error if the event cannot be triggered due to an invalid state.
       *
       * @example
       * // Example usage of triggerSlidEvent
       * triggerSlidEvent();
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
        activeElement.classList.add(directionalClassName);
        nextElement.classList.add(directionalClassName);

        /**
         * A callback function that completes the sliding transition of an element.
         * This function is responsible for updating the class names of the active
         * and next elements to reflect the current state of the sliding animation.
         *
         * It removes directional and order class names from the next element,
         * adds an active class to it, and removes the active class from the
         * currently active element. It also sets a flag indicating that the
         * sliding transition is complete and triggers a sliding event after a
         * short delay.
         *
         * @throws {Error} Throws an error if the sliding transition fails.
         *
         * @example
         * // Example usage of completeCallBack in a sliding transition context
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
      }

      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }

      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }

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
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$a = 'collapse';
  const DATA_KEY$9 = 'bs.collapse';
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

      this._isTransitioning = true;

      /**
       * Completes the transition of an element by removing the collapsing class,
       * adding the collapse and show classes, and resetting the dimension style.
       * This method is typically called at the end of a collapsing transition to
       * finalize the element's state.
       *
       * @this {Object} The context in which the method is called, expected to have
       *                properties `_isTransitioning`, `_element`, and a method
       *                `EventHandler.trigger`.
       *
       * @throws {TypeError} Throws an error if `this._element` is not defined or
       *                     does not have the expected properties.
       *
       * @example
       * // Assuming `this` is correctly bound and `_element` is a valid DOM element
       * complete.call(this);
       */
      const complete = () => {
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

      const dimension = this._getDimension();

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);

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
       * Completes the transition of the element by removing the collapsing class
       * and adding the collapsed class. It also triggers the hidden event.
       *
       * This method is typically called at the end of a collapsing transition to
       * ensure that the element's state is updated correctly.
       *
       * @throws {Error} Throws an error if the element is not defined or if there
       *                 is an issue with triggering the event.
       *
       * @example
       * // Assuming 'element' is a valid DOM element and the transition is complete
       * complete.call({ _element: element });
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

    const selector = getSelectorFromElement(this);
    const selectorElements = SelectorEngine.find(selector);
    selectorElements.forEach(element => {
      Collapse.getOrCreateInstance(element, {
        toggle: false
      }).toggle();
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Collapse to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Collapse);

  var top = 'top';
  var bottom = 'bottom';
  var right = 'right';
  var left = 'left';
  var auto = 'auto';
  var basePlacements = [top, bottom, right, left];
  var start = 'start';
  var end = 'end';
  var clippingParents = 'clippingParents';
  var viewport = 'viewport';
  var popper = 'popper';
  var reference = 'reference';
  var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []); // modifiers that need to read the DOM

  var beforeRead = 'beforeRead';
  var read = 'read';
  var afterRead = 'afterRead'; // pure-logic modifiers

  var beforeMain = 'beforeMain';
  var main = 'main';
  var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

  var beforeWrite = 'beforeWrite';
  var write = 'write';
  var afterWrite = 'afterWrite';
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  /**
   * Retrieves the name of a given DOM element in lowercase.
   *
   * This function checks if the provided element is valid and returns its
   * node name in lowercase. If the element is null or undefined, the function
   * returns null.
   *
   * @param {Element} element - The DOM element whose node name is to be retrieved.
   * @returns {string|null} The lowercase node name of the element, or null if the element is invalid.
   *
   * @example
   * const div = document.createElement('DIV');
   * const nodeName = getNodeName(div); // Returns 'div'
   *
   * @example
   * const invalidNode = null;
   * const result = getNodeName(invalidNode); // Returns null
   */
  function getNodeName(element) {
    return element ? (element.nodeName || '').toLowerCase() : null;
  }

  /**
   * Retrieves the window object associated with a given node.
   *
   * This function checks if the provided node is null or if it is a
   * Window object. If the node is null, the global window object is returned.
   * If the node is not a Window object, it attempts to retrieve the
   * ownerDocument of the node and returns its defaultView. If no
   * ownerDocument is found, it defaults to returning the global window object.
   *
   * @param {Node} node - The DOM node for which to retrieve the associated window.
   * @returns {Window} The window object associated with the provided node,
   *                   or the global window object if the node is null or
   *                   does not have an associated window.
   *
   * @example
   * const myNode = document.getElementById('myElement');
   * const associatedWindow = getWindow(myNode);
   *
   * @throws {TypeError} Throws a TypeError if the provided node is not a valid Node.
   */
  function getWindow(node) {
    if (node == null) {
      return window;
    }

    if (node.toString() !== '[object Window]') {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }

    return node;
  }

  /**
   * Checks if the provided node is an instance of an Element.
   *
   * This function determines whether the given node is an instance of the
   * Element interface or a custom element defined in the context of the
   * provided node's window.
   *
   * @param {Node} node - The node to be checked.
   * @returns {boolean} Returns true if the node is an instance of Element,
   *                   otherwise false.
   *
   * @throws {TypeError} Throws a TypeError if the provided node is not a
   *                     valid Node.
   *
   * @example
   * const div = document.createElement('div');
   * console.log(isElement(div)); // true
   *
   * const textNode = document.createTextNode('Hello');
   * console.log(isElement(textNode)); // false
   */
  function isElement(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }

  /**
   * Determines whether the provided node is an instance of an HTML element.
   *
   * This function checks if the given node is an instance of the
   * HTMLElement class or a subclass of it. It accounts for different
   * window contexts by retrieving the appropriate HTMLElement from
   * the window associated with the node.
   *
   * @param {Node} node - The node to be checked.
   * @returns {boolean} True if the node is an instance of HTMLElement,
   *                   otherwise false.
   *
   * @example
   * const div = document.createElement('div');
   * console.log(isHTMLElement(div)); // true
   *
   * const textNode = document.createTextNode('Hello');
   * console.log(isHTMLElement(textNode)); // false
   *
   * @throws {TypeError} If the provided node is not a valid Node.
   */
  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }

  /**
   * Determines whether the given node is an instance of ShadowRoot.
   *
   * This function checks if the browser supports Shadow DOM and verifies if the
   * provided node is an instance of ShadowRoot or a compatible ShadowRoot implementation.
   * Note that Internet Explorer 11 does not support ShadowRoot, and this function will
   * return false in that case.
   *
   * @param {Node} node - The DOM node to be checked.
   * @returns {boolean} Returns true if the node is an instance of ShadowRoot, otherwise false.
   *
   * @example
   * const element = document.querySelector('#myElement');
   * const isShadow = isShadowRoot(element);
   * console.log(isShadow); // Outputs true or false based on the element's type.
   */
  function isShadowRoot(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }

    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }

  // and applies them to the HTMLElements such as popper and arrow

  /**
   * Applies styles and attributes to a set of HTML elements based on the provided state.
   *
   * This function iterates over the elements defined in the state and applies the corresponding
   * styles and attributes. If an element is not a valid HTML element, it will be skipped.
   *
   * @param {Object} _ref - The reference object containing the state.
   * @param {Object} _ref.state - The state object containing elements, styles, and attributes.
   * @param {Object} _ref.state.elements - An object mapping element names to their corresponding DOM elements.
   * @param {Object} _ref.state.styles - An object mapping element names to their corresponding style objects.
   * @param {Object} _ref.state.attributes - An object mapping element names to their corresponding attributes.
   *
   * @returns {void} This function does not return a value.
   *
   * @example
   * const state = {
   *   elements: {
   *     button: document.getElementById('myButton'),
   *   },
   *   styles: {
   *     button: { backgroundColor: 'blue', color: 'white' },
   *   },
   *   attributes: {
   *     button: { disabled: false },
   *   },
   * };
   * applyStyles({ state });
   *
   * @throws {TypeError} Throws an error if the provided state does not contain valid elements.
   */
  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function (name) {
      var style = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name]; // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe[cannot-write]


      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (name) {
        var value = attributes[name];

        if (value === false) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value === true ? '' : value);
        }
      });
    });
  }

  /**
   * Applies initial styles to the popper and arrow elements based on the provided state.
   * Returns a cleanup function that resets the styles and removes attributes from the elements.
   *
   * @param {Object} _ref2 - The configuration object.
   * @param {Object} _ref2.state - The state object containing options and elements.
   * @param {Object} _ref2.state.options - The options for positioning strategy.
   * @param {Object} _ref2.state.elements - The elements to which styles will be applied.
   * @param {HTMLElement} _ref2.state.elements.popper - The popper element.
   * @param {HTMLElement} [_ref2.state.elements.arrow] - The optional arrow element.
   * @param {Object} _ref2.state.attributes - The attributes to be removed from the elements.
   *
   * @returns {Function} A cleanup function that resets styles and removes attributes from elements.
   *
   * @throws {TypeError} Throws an error if the provided state or elements are not valid.
   *
   * @example
   * const cleanup = effect$2({ state: {
   *   options: { strategy: 'absolute' },
   *   elements: { popper: myPopperElement, arrow: myArrowElement },
   *   attributes: {}
   * }});
   * // Call cleanup when done to reset styles
   * cleanup();
   */
  function effect$2(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }

    return function () {
      Object.keys(state.elements).forEach(function (name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

        var style = styleProperties.reduce(function (style, property) {
          style[property] = '';
          return style;
        }, {}); // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }

        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  } // eslint-disable-next-line import/no-unused-modules


  var applyStyles$1 = {
    name: 'applyStyles',
    enabled: true,
    phase: 'write',
    fn: applyStyles,
    effect: effect$2,
    requires: ['computeStyles']
  };

  /**
   * Extracts the base placement from a given placement string.
   *
   * The base placement is defined as the part of the placement string that
   * appears before any hyphen ('-'). For example, if the input is
   * "top-start", the function will return "top".
   *
   * @param {string} placement - The placement string to extract the base from.
   * @returns {string} The base placement extracted from the input string.
   *
   * @example
   * // returns "top"
   * getBasePlacement("top-start");
   *
   * @example
   * // returns "bottom"
   * getBasePlacement("bottom-end");
   *
   * @throws {TypeError} Throws an error if the input is not a string.
   */
  function getBasePlacement(placement) {
    return placement.split('-')[0];
  }

  var round$1 = Math.round;
  /**
   * Retrieves the bounding client rectangle of a specified element, optionally including scale factors.
   *
   * The bounding rectangle is adjusted based on the element's scaling, if applicable.
   *
   * @param {HTMLElement} element - The HTML element for which to get the bounding rectangle.
   * @param {boolean} [includeScale=false] - A flag indicating whether to include scaling factors in the calculations.
   *
   * @returns {Object} An object containing the dimensions and position of the element's bounding rectangle:
   *   - {number} width - The width of the bounding rectangle.
   *   - {number} height - The height of the bounding rectangle.
   *   - {number} top - The distance from the top of the viewport to the top of the bounding rectangle.
   *   - {number} right - The distance from the left of the viewport to the right of the bounding rectangle.
   *   - {number} bottom - The distance from the top of the viewport to the bottom of the bounding rectangle.
   *   - {number} left - The distance from the left of the viewport to the left of the bounding rectangle.
   *   - {number} x - The x-coordinate of the bounding rectangle's left edge.
   *   - {number} y - The y-coordinate of the bounding rectangle's top edge.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
   *
   * @example
   * const rect = getBoundingClientRect(document.getElementById('myElement'), true);
   * console.log(rect.width, rect.height, rect.top, rect.left);
   */
  function getBoundingClientRect(element, includeScale) {
    if (includeScale === void 0) {
      includeScale = false;
    }

    var rect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;

    if (isHTMLElement(element) && includeScale) {
      // Fallback to 1 in case both values are `0`
      scaleX = rect.width / element.offsetWidth || 1;
      scaleY = rect.height / element.offsetHeight || 1;
    }

    return {
      width: round$1(rect.width / scaleX),
      height: round$1(rect.height / scaleY),
      top: round$1(rect.top / scaleY),
      right: round$1(rect.right / scaleX),
      bottom: round$1(rect.bottom / scaleY),
      left: round$1(rect.left / scaleX),
      x: round$1(rect.left / scaleX),
      y: round$1(rect.top / scaleY)
    };
  }

  // means it doesn't take into account transforms.

  /**
   * Retrieves the layout rectangle of a specified HTML element.
   * The layout rectangle includes the element's position and dimensions,
   * accounting for potential transformations.
   *
   * @param {HTMLElement} element - The HTML element for which to retrieve the layout rectangle.
   * @returns {{ x: number, y: number, width: number, height: number }}
   *          An object containing the x and y coordinates of the element's top-left corner,
   *          as well as its width and height.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
   *
   * @example
   * const rect = getLayoutRect(document.getElementById('myElement'));
   * console.log(rect); // { x: 100, y: 200, width: 300, height: 150 }
   */
  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }

    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }

    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width,
      height: height
    };
  }

  /**
   * Determines whether a parent node contains a child node.
   *
   * This function first checks if the parent contains the child using the native
   * `contains` method. If that check fails, it attempts to handle cases where the
   * child node is part of a Shadow DOM by traversing up the node tree.
   *
   * @param {Node} parent - The parent node to check against.
   * @param {Node} child - The child node to check for containment within the parent.
   * @returns {boolean} Returns true if the parent contains the child, otherwise false.
   *
   * @throws {TypeError} Throws an error if either `parent` or `child` is not a valid Node.
   *
   * @example
   * const parentElement = document.getElementById('parent');
   * const childElement = document.getElementById('child');
   * const result = contains(parentElement, childElement);
   * console.log(result); // true or false based on containment
   */
  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

    if (parent.contains(child)) {
      return true;
    } // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
        var next = child;

        do {
          if (next && parent.isSameNode(next)) {
            return true;
          } // $FlowFixMe[prop-missing]: need a better way to handle this...


          next = next.parentNode || next.host;
        } while (next);
      } // Give up, the result is false


    return false;
  }

  /**
   * Retrieves the computed style of a specified DOM element.
   *
   * This function utilizes the `getWindow` helper to obtain the window object
   * associated with the provided element and then calls the `getComputedStyle`
   * method on that window object to fetch the styles applied to the element.
   *
   * @param {Element} element - The DOM element for which to retrieve the computed style.
   * @returns {CSSStyleDeclaration} The computed style of the specified element.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const styles = getComputedStyle$1(element);
   * console.log(styles.color); // Outputs the computed color of the element.
   */
  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }

  /**
   * Determines whether the provided element is a table-related HTML element.
   *
   * This function checks if the given element's node name is one of the following:
   * - 'table'
   * - 'td'
   * - 'th'
   *
   * @param {Element} element - The DOM element to check.
   * @returns {boolean} Returns true if the element is a table, table cell, or table header; otherwise, false.
   *
   * @example
   * const element = document.createElement('td');
   * console.log(isTableElement(element)); // true
   *
   * @example
   * const element = document.createElement('div');
   * console.log(isTableElement(element)); // false
   */
  function isTableElement(element) {
    return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
  }

  /**
   * Retrieves the document element of a given element or its associated document.
   *
   * This function checks if the provided element is a valid DOM element. If it is,
   * it returns the document element of that element's owner document. If the provided
   * element is not a valid DOM element, it attempts to access the document property
   * directly. If neither is available, it defaults to returning the document element
   * of the global window object.
   *
   * @param {Element|Document} element - The DOM element or document from which to retrieve the document element.
   * @returns {Element} The document element associated with the provided element or document.
   *
   * @throws {TypeError} Throws an error if the provided argument is neither an Element nor a Document.
   /**
    * Cleans up and disposes of the instance by removing associated data and event handlers.
    * This method sets all properties of the instance to null, effectively releasing references
    * to any resources held by the instance.
    *
    * @returns {void} This method does not return a value.
    *
    * @throws {Error} Throws an error if the element is not properly initialized or if there is
    *                 an issue during the cleanup process.
    *
    * @example
    * const instance = new SomeClass();
    * // Perform operations with the instance
    * instance.dispose(); // Cleans up the instance
    */
   *
   * @example
   * const docElement = getDocumentElement(someElement);
   * console.log(docElement); // Logs the document element of the associated document.
   */
  function getDocumentElement(element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
    /**
     * Queues a callback to be executed after a transition has completed.
     *
     * This method ensures that the provided callback function is executed
     * after the specified element has finished its transition. It allows
     * for smooth animations and ensures that any subsequent actions are
     * performed only once the transition is complete.
     *
     * @param {Function} callback - The function to be executed after the transition.
     * @param {HTMLElement} element - The DOM element that is undergoing the transition.
     * @param {boolean} [isAnimated=true] - A flag indicating whether the transition is animated.
     *                                        Defaults to true.
     *
     * @throws {Error} Throws an error if the callback is not a function or if the element is not a valid DOM element.
     *
     * @example
     * // Example usage of _queueCallback
     * _queueCallback(() => {
     *   console.log('Transition completed!');
     * }, document.getElementById('myElement'));
     */
    element.document) || window.document).documentElement;
  }

   * Retrieves the parent node of a given DOM element. The function checks for various conditions
   * to determine the appropriate parent node, including handling shadow DOM and slotted nodes.
   /**
    * Retrieves an instance of the data associated with a specified element.
    *
    * This static method accesses the data stored in the element using a unique key.
    * It is useful for obtaining the instance of data that has been previously set
    * for the given element.
    *
    * @static
    * @param {HTMLElement} element - The DOM element from which to retrieve the data instance.
    * @returns {Object|null} The data instance associated with the element, or null if no data exists.
    *
    * @example
    * const myElement = document.getElementById('myElementId');
    * const instance = MyClass.getInstance(myElement);
    * console.log(instance); // Logs the associated data instance or null if not found.
    *
    * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
    */
   *
   * @param {Node} element - The DOM element for which to find the parent node.
   * @returns {Node|null} The parent node of the specified element, or null if no parent exists.
   *
   /**
    * Retrieves an existing instance of the class associated with the given element,
    * or creates a new instance if none exists.
    *
    * @static
    * @param {HTMLElement} element - The DOM element for which to get or create an instance.
    * @param {Object} [config={}] - Optional configuration object for the new instance.
    * @returns {Object} The existing instance if found, or a new instance of the class.
    *
    * @example
    * const instance = MyClass.getOrCreateInstance(document.getElementById('myElement'), { option: true });
    *
    * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
    */
   * @example
   * const parent = getParentNode(someElement);
   * console.log(parent); // Logs the parent node or null if it doesn't exist.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid Node.
   */
  function getParentNode(element) {
    if (getNodeName(element) === 'html') {
      return element;
    }

    return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || ( // DOM Element detected
      isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element) // fallback

    );
  }

  /**
   * Retrieves the closest offset parent of a given HTML element.
   *
   * This function checks if the provided element is a valid HTML element
   * and whether its computed style indicates that it is not positioned as 'fixed'.
   * If either condition is not met, the function returns null. Otherwise, it returns
   * the element's offset parent.
   *
   * @param {HTMLElement} element - The HTML element for which to find the offset parent.
   * @returns {HTMLElement|null} The closest offset parent of the element, or null if the element is invalid or fixed.
   *
   * @throws {TypeError} Throws a TypeError if the provided argument is not an HTMLElement.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const offsetParent = getTrueOffsetParent(element);
   * console.log(offsetParent); // Logs the offset parent or null
   */
  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle$1(element).position === 'fixed') {
      return null;
    }

    return element.offsetParent;
  } // `.offsetParent` reports `null` for fixed elements, while absolute elements
  // return the containing block


  /**
   * Retrieves the containing block of a specified HTML element.
   * The containing block is determined based on various CSS properties
   * that affect layout, such as `transform`, `perspective`, and others.
   *
   * This function accounts for specific behaviors in Internet Explorer
   * and Firefox to ensure accurate results.
   *
   * @param {HTMLElement} element - The HTML element for which to find the containing block.
   * @returns {HTMLElement|null} The containing block element, or null if none is found.
   *
   * @throws {TypeError} Throws an error if the provided element is not an instance of HTMLElement.
   *
   * @example
   * const block = getContainingBlock(document.getElementById('myElement'));
   * console.log(block); // Logs the containing block element or null.
   */
  function getContainingBlock(element) {
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
    var isIE = navigator.userAgent.indexOf('Trident') !== -1;

    if (isIE && isHTMLElement(element)) {
      // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
      var elementCss = getComputedStyle$1(element);

      if (elementCss.position === 'fixed') {
        return null;
      }
    /**
     * Closes the element by triggering a close event and removing the visible class.
     * If the close event is prevented, the function will exit early without making changes.
     * After removing the visible class, it checks if the element has a fade animation class
     * and queues a callback to destroy the element after the animation completes.
     *
     * @throws {Error} Throws an error if the element is not properly initialized.
     *
     * @example
     * const instance = new SomeClass();
     * instance.close();
     */
    }

    var currentNode = getParentNode(element);

    while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
      // create a containing block.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

      if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }
/**
 * Removes the associated element from the DOM and triggers the closed event.
 * This method is responsible for cleaning up the element and releasing any resources.
 *
 * @throws {Error} Throws an error if the element cannot be removed.
 *
 * @example
 * const instance = new SomeClass();
 * instance._destroyElement();
 * // The element is removed and the closed event is triggered.
 */

    return null;
  } // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.


  /**
   * Retrieves the closest offset parent of a given DOM element.
   /**
    * jQuery interface for the Alert component.
    * This method allows for the invocation of specific methods on the Alert instance
    * based on the provided configuration string.
    *
    * @static
    * @param {string} config - The name of the method to invoke on the Alert instance.
    *                          If the config is not a string, the method will return without action.
    * @returns {jQuery} The jQuery object for chaining.
    *
    * @throws {TypeError} Throws an error if the specified method does not exist,
    *                     starts with an underscore, or is the constructor.
    *
    * @example
    * // To invoke a method named 'show' on the Alert instance:
    * $(selector).Alert.jQueryInterface('show');
    *
    * // To handle an invalid method call:
    * try {
    *   $(selector).Alert.jQueryInterface('invalidMethod');
    * } catch (error) {
    *   console.error(error.message); // Output: No method named "invalidMethod"
    * }
    */
   *
   * The offset parent is the nearest ancestor element that is positioned (i.e., has a CSS position value other than 'static').
   * This function accounts for specific cases such as table elements and the HTML or body elements.
   *
   * @param {Element} element - The DOM element for which to find the offset parent.
   * @returns {Element|Window} The closest offset parent element, or the window object if no suitable parent is found.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
   *
   * @example
   * const offsetParent = getOffsetParent(document.getElementById('myElement'));
   * console.log(offsetParent); // Logs the closest offset parent or window.
   */
  function getOffsetParent(element) {
    var window = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);

    while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
      return window;
    }

    return offsetParent || getContainingBlock(element) || window;
  }

  /**
   * Determines the main axis ('x' or 'y') based on the provided placement.
   *
   * The function checks if the given placement is either 'top' or 'bottom'.
   * If it is, the function returns 'x', indicating the horizontal axis.
   * Otherwise, it returns 'y', indicating the vertical axis.
   *
   * @param {string} placement - The placement value to evaluate.
   *                             Expected values are 'top', 'bottom', or any other string.
   * @returns {string} Returns 'x' for horizontal placements ('top', 'bottom')
   *                  and 'y' for vertical placements (any other value).
   *
   * @example
   * // returns 'x'
   * getMainAxisFromPlacement('top');
   *
   * @example
   * // returns 'y'
   * getMainAxisFromPlacement('left');
   *
   * @throws {TypeError} Throws an error if the placement is not a string.
   */
  function getMainAxisFromPlacement(placement) {
    return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
  }

  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  /**
   * Clamps a given value between a specified minimum and maximum range.
   *
   * This function ensures that the returned value is not less than the minimum value
   * and not greater than the maximum value. If the value is less than the minimum,
   * the minimum is returned; if it is greater than the maximum, the maximum is returned.
   *
   * @param {number} min$1 - The minimum boundary value.
   /**
    * Toggles the active state of the associated element by adding or removing
    * a specific class. It also synchronizes the `aria-pressed` attribute
    * to reflect the current state of the element.
    *
    * This method updates the class list of the element to indicate whether
    * it is active or not, and sets the `aria-pressed` attribute accordingly.
    *
    * @throws {TypeError} Throws an error if the element is not defined or
    * if the class list cannot be modified.
    *
    * @example
    * // Assuming `myElement` is a reference to a DOM element
    * const myToggle = new MyToggleClass(myElement);
    * myToggle.toggle(); // Toggles the active state and updates aria-pressed
    */
   * @param {number} value - The value to be clamped.
   * @param {number} max$1 - The maximum boundary value.
   * @returns {number} The clamped value, which is guaranteed to be within the range [min$1, max$1].
   *
   * @example
   * // Returns 5
   /**
    * A static method that provides a jQuery interface for the Button component.
    * This method allows for the manipulation of Button instances using jQuery.
    *
    * @param {string|Object} config - The configuration option or command to execute.
    *                                  If 'toggle' is passed, it will toggle the button's state.
    *
    * @returns {jQuery} The jQuery object for chaining.
    *
    * @example
    * // To toggle the button state using jQuery
    * $('.btn').jQueryInterface('toggle');
    *
    * @throws {TypeError} Throws an error if the provided config is not a string or object.
    */
   * within(1, 5, 10);
   *
   * @example
   * // Returns 1
   * within(1, 0, 10);
   *
   * @example
   * // Returns 10
   * within(1, 15, 10);
   */
  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }

  /**
   * Creates and returns a fresh side object with default values.
   * The side object represents the dimensions of a rectangle with
   * properties for each side initialized to zero.
   *
   * @returns {Object} An object representing the sides of a rectangle.
   *                   The object contains the following properties:
   *                   - top {number}: The top side length (default is 0).
   *                   - right {number}: The right side length (default is 0).
   *                   - bottom {number}: The bottom side length (default is 0).
   *                   - left {number}: The left side length (default is 0).
   *
   * @example
   * const freshSide = getFreshSideObject();
   * console.log(freshSide); // { top: 0, right: 0, bottom: 0, left: 0 }
   */
  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  /**
   * Merges a padding object with a fresh side object.
   *
   * This function creates a new object that combines the properties of a fresh side object
   * with the properties of the provided padding object. The resulting object will contain
   * all properties from both objects, with properties from the padding object taking precedence
   * in case of conflicts.
   *
   * @param {Object} paddingObject - The padding object to merge with the fresh side object.
   * @returns {Object} A new object that contains the merged properties of the fresh side object
   * and the padding object.
   *
   * @example
   * const padding = { top: '10px', bottom: '20px' };
   * const mergedPadding = mergePaddingObject(padding);
   * // mergedPadding will be an object containing properties from the fresh side object and padding.
   */
  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }

  /**
   * Expands a given value into a hash map using the provided keys.
   *
   * This function takes a value and an array of keys, and creates an object
   * where each key from the array is assigned the specified value.
   *
   * @param {*} value - The value to be assigned to each key in the hash map.
   * @param {Array<string>} keys - An array of strings representing the keys
   *        for the hash map.
   * @returns {Object} An object (hash map) where each key corresponds to the
   *          provided keys, all assigned the same value.
   *
   * @example
   * const keys = ['a', 'b', 'c'];
   * const value = 42;
   * const result = expandToHashMap(value, keys);
   * // result will be: { a: 42, b: 42, c: 42 }
   */
  function expandToHashMap(value, keys) {
    return keys.reduce(function (hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }

  var toPaddingObject = function toPaddingObject(padding, state) {
    padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  };

  /**
   * Adjusts the position of an arrow element based on the popper's placement and offsets.
   *
   * This function calculates the necessary offsets to ensure that the arrow is correctly positioned
   * relative to the reference element and does not overflow the popper boundaries.
   *
   * @param {Object} _ref - The parameters for the arrow positioning.
   * @param {Object} _ref.state - The current state of the popper, including elements and offsets.
   * @param {string} _ref.name - The name of the modifier that is calling this function.
   * @param {Object} _ref.options - Options for padding and other configurations.
   *
   * @throws {Error} Throws an error if the arrow element or popper offsets are not available.
   *
   * @returns {void} This function does not return a value.
   *
   * @example
   * const state = {
   *   elements: {
   *     arrow: document.getElementById('arrow')
   *   },
   *   modifiersData: {
   *     popperOffsets: { top: 10, left: 20 }
   *   },
   *   placement: 'top',
   *   rects: {
   *     reference: { height: 100, width: 100 },
   *     popper: { height: 50, width: 50 }
   *   }
   * };
   * const options = { padding: 5 };
   * arrow({ state, name: 'arrow', options });
   */
  function arrow(_ref) {
    var _state$modifiersData$;

    var state = _ref.state,
        name = _ref.name,
        options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? 'height' : 'width';

    if (!arrowElement || !popperOffsets) {
      return;
    }

    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === 'y' ? top : left;
    var maxProp = axis === 'y' ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
    var startDiff = popperOffsets[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds

    var min = paddingObject[minProp];
    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset = within(min, center, max); // Prevents breaking syntax highlighting...

    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
  }

  /**
   * Configures the arrow element for a popper instance.
   *
   * This function takes an object containing the current state and options,
   * and sets the arrow element used for positioning the popper.
   * If the specified arrow element is not found or is not a child of the popper,
   * the function will exit without making any changes.
   *
   * @param {Object} _ref2 - The configuration object.
   * @param {Object} _ref2.state - The current state of the popper instance.
   * @param {Object} _ref2.options - Options for configuring the popper.
   * @param {string|Element} [_ref2.options.element='[data-popper-arrow]'] -
   *        A CSS selector or an HTML element that specifies the arrow element.
   *        Defaults to '[data-popper-arrow]' if not provided.
   *
   * @throws {TypeError} Throws an error if the provided arrow element is not valid.
   *
   * @returns {void} This function does not return a value.
   *
   * @example
   * // Example usage:
   * effect$1({
   *   state: {
   *     elements: {
   *       popper: document.querySelector('#my-popper')
   *     }
   *   },
   *   options: {
   *     element: '#my-arrow'
   *   }
   * });
   */
  function effect$1(_ref2) {
    var state = _ref2.state,
        options = _ref2.options;
    var _options$element = options.element,
        arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

    if (arrowElement == null) {
      return;
    } // CSS selector


    if (typeof arrowElement === 'string') {
      arrowElement = state.elements.popper.querySelector(arrowElement);

      if (!arrowElement) {
        return;
      }
    }

    if (!contains(state.elements.popper, arrowElement)) {

      return;
    }

    state.elements.arrow = arrowElement;
  } // eslint-disable-next-line import/no-unused-modules


  var arrow$1 = {
    name: 'arrow',
    enabled: true,
    phase: 'main',
    fn: arrow,
    effect: effect$1,
    requires: ['popperOffsets'],
    requiresIfExists: ['preventOverflow']
  };

  var unsetSides = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
  }; // Round the offsets to the nearest suitable subpixel based on the DPR.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.

  /**
   * Rounds the offsets of a given point based on the device pixel ratio (DPR).
   *
   * This function takes an object containing x and y coordinates, multiplies them by the
   * device pixel ratio, rounds the results, and then divides by the device pixel ratio again
   * to get the final rounded values. If the result is falsy, it defaults to 0.
   *
   * @param {Object} _ref - The object containing the coordinates.
   * @param {number} _ref.x - The x coordinate to be rounded.
   * @param {number} _ref.y - The y coordinate to be rounded.
   * @returns {Object} An object containing the rounded x and y coordinates.
   * @returns {number} return.x - The rounded x coordinate.
   * @returns {number} return.y - The rounded y coordinate.
   *
   * @example
   * const offsets = roundOffsetsByDPR({ x: 10.5, y: 20.3 });
   * console.log(offsets); // { x: 10, y: 20 }
   *
   * @throws {TypeError} Throws an error if the input is not an object with x and y properties.
   */
  function roundOffsetsByDPR(_ref) {
    var x = _ref.x,
        y = _ref.y;
    var win = window;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(round(x * dpr) / dpr) || 0,
      y: round(round(y * dpr) / dpr) || 0
    };
  }

  /**
   * Maps the provided offsets and styles to a set of CSS styles for positioning an element.
   *
   * @param {Object} _ref2 - The configuration object containing properties for styling.
   * @param {HTMLElement} _ref2.popper - The popper element to be styled.
   * @param {Object} _ref2.popperRect - The bounding rectangle of the popper element.
   * @param {string} _ref2.placement - The placement of the popper (e.g., 'top', 'bottom', 'left', 'right').
   * @param {Object} _ref2.offsets - The offsets for positioning the popper.
   * @param {string} _ref2.position - The CSS position property value (e.g., 'absolute', 'fixed').
   * @param {boolean} _ref2.gpuAcceleration - Flag indicating whether to use GPU acceleration for the transform.
   * @param {boolean} _ref2.adaptive - Flag indicating whether to adapt the position based on the offset parent.
   * @param {function|boolean} _ref2.roundOffsets - A function to round offsets or a boolean indicating whether to round them.
   *
   * @returns {Object} An object containing the computed CSS styles for the popper element.
   *
   * @throws {TypeError} Throws an error if any of the required parameters are missing or invalid.
   *
   * @example
   /**
    * Advances to the next slide in the presentation or carousel.
    *
    * This method triggers the internal slide transition mechanism to display
    * the subsequent slide. It is typically used in scenarios where a user
    * interacts with a navigation control to move forward in a sequence of slides.
    *
    * @throws {Error} Throws an error if the slide transition fails due to
    *                 an invalid state or if there are no more slides to show.
    *
    * @example
    * // Assuming 'slider' is an instance of a carousel or slideshow component
    * slider.next();
    */
   * const styles = mapToStyles({
   *   popper: document.getElementById('myPopper'),
   *   popperRect: { width: 100, height: 50 },
   *   placement: 'top',
   /**
    * Triggers the next action of a carousel when the page and the carousel element are visible.
    * This method checks if the document is not hidden and if the carousel element is visible
    * before proceeding to call the next method.
    *
    * @throws {Error} Throws an error if the carousel element is not defined or cannot be found.
    *
    * @example
    * // Assuming 'carousel' is an instance of a carousel class
    * carousel.nextWhenVisible();
    */
   *   offsets: { x: 10, y: 20 },
   *   position: 'absolute',
   *   gpuAcceleration: true,
   *   adaptive: true,
   *   roundOffsets: true
   * });
   */
  function mapToStyles(_ref2) {
    /**
     * Moves to the previous slide in the presentation or carousel.
     *
     * This method triggers the sliding animation to transition to the previous item.
     * It is typically used in conjunction with other navigation methods to allow users
     * to navigate through a series of slides or items.
     *
     * @throws {Error} Throws an error if the transition cannot be completed.
     *
     * @example
     * // Example usage of the prev method
     * presentation.prev();
     */
    var _Object$assign2;

    var popper = _ref2.popper,
        popperRect = _ref2.popperRect,
        /**
         * Pauses the current operation or animation associated with the element.
         * If an event is provided, it will determine whether to pause or not.
         *
         * @param {Event} [event] - The event that triggered the pause. If no event is provided, the operation will be paused.
         *
         * @throws {TypeError} Throws an error if the event is not of the expected type.
         *
         * @example
         * // To pause without an event
         * instance.pause();
         *
         * // To pause with an event
         * instance.pause(someEvent);
         */
        placement = _ref2.placement,
        offsets = _ref2.offsets,
        position = _ref2.position,
        gpuAcceleration = _ref2.gpuAcceleration,
        adaptive = _ref2.adaptive,
        roundOffsets = _ref2.roundOffsets;

    var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
        _ref3$x = _ref3.x,
        x = _ref3$x === void 0 ? 0 : _ref3$x,
        _ref3$y = _ref3.y,
        y = _ref3$y === void 0 ? 0 : _ref3$y;

    var hasX = offsets.hasOwnProperty('x');
    /**
     * Manages the execution cycle based on the provided event and configuration settings.
     * This function handles starting and stopping the interval for the cycle,
     * and updates the interval if necessary. It also checks the visibility state
     * of the document to determine which function to call next.
     *
     * @param {Event} [event] - An optional event that can be passed to control
     * the cycle behavior. If no event is provided, the cycle will resume.
     *
     * @throws {Error} Throws an error if the configuration is invalid or if
     * there is an issue with setting the interval.
     *
     * @example
     * // To start the cycle when an event occurs
     * cycle(event);
     *
     * // To resume the cycle without an event
     * cycle();
     */
    var hasY = offsets.hasOwnProperty('y');
    var sideX = left;
    var sideY = top;
    var win = window;

    if (adaptive) {
      var offsetParent = getOffsetParent(popper);
      var heightProp = 'clientHeight';
      var widthProp = 'clientWidth';

      if (offsetParent === getWindow(popper)) {
        offsetParent = getDocumentElement(popper);

        if (getComputedStyle$1(offsetParent).position !== 'static') {
          heightProp = 'scrollHeight';
          widthProp = 'scrollWidth';
        }
      /**
       * Moves to a specific item in a carousel or slider component.
       *
       * This method updates the active element to the specified index,
       * handling various states such as sliding and pausing. If the
       * specified index is out of bounds, the method will simply return
       * without making any changes. If the component is currently sliding,
       * it will wait for the current slide to finish before proceeding
       * to the new index.
       *
       * @param {number} index - The index of the item to move to.
       *                         Must be within the range of available items.
       *
       * @returns {void} - This method does not return a value.
       *
       * @example
       * // Move to the second item in the carousel
       * carousel.to(1);
       *
       * @throws {Error} - Throws an error if the index is invalid or if
       *                   there are issues with the sliding mechanism.
       */
      } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


      offsetParent = offsetParent;

      if (placement === top) {
        sideY = bottom; // $FlowFixMe[prop-missing]

        y -= offsetParent[heightProp] - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }

      if (placement === left) {
        sideX = right; // $FlowFixMe[prop-missing]

        x -= offsetParent[widthProp] - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }

    var commonStyles = Object.assign({
      position: position
    }, adaptive && unsetSides);

    if (gpuAcceleration) {
      var _Object$assign;
/**
 * Merges the default configuration with the provided configuration and
 * data attributes from the element.
 *
 * This method retrieves the configuration settings for a component,
 * ensuring that all necessary defaults are applied. It checks the type
 * of the provided configuration and merges it with the default settings
 * and any data attributes found on the associated element.
 *
 * @param {Object} config - The configuration object to be merged.
 * @returns {Object} The final configuration object after merging.
 *
 * @throws {TypeError} Throws an error if the provided config is not an
 * object when expected.
 *
 * @example
 * const finalConfig = this._getConfig({ customSetting: true });
 * // finalConfig will include default settings, data attributes,
 * // and customSetting set to true.
 */

      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }

    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
  }

  /**
   * Computes the styles and attributes for the popper element based on the current state and options.
   /**
    * Handles the swipe gesture by determining the direction of the swipe
    * based on the horizontal touch movement. If the swipe distance exceeds
    * a predefined threshold, it triggers a slide action in the appropriate
    * direction.
    *
    * This method calculates the absolute value of the horizontal touch delta
    * and compares it to a constant SWIPE_THRESHOLD. If the swipe distance is
    * less than or equal to this threshold, the method exits without performing
    * any action. If the swipe distance is significant, it determines the
    * direction of the swipe and calls the _slide method with the appropriate
    * direction constant (DIRECTION_RIGHT or DIRECTION_LEFT).
    *
    * @throws {Error} Throws an error if the direction cannot be determined.
    *
    * @returns {void} This method does not return a value.
    *
    * @example
    * // Assuming touchDeltaX is set to a value greater than SWIPE_THRESHOLD
    * this._handleSwipe(); // This will trigger a slide action based on the swipe direction.
    */
   * This function updates the styles for both the popper and arrow elements, applying necessary offsets
   * and handling GPU acceleration, adaptive positioning, and rounding of offsets.
   *
   * @param {Object} _ref4 - The configuration object containing state and options.
   * @param {Object} _ref4.state - The current state of the popper.
   * @param {Object} _ref4.state.elements - The elements involved in the popper positioning.
   * @param {HTMLElement} _ref4.state.elements.popper - The popper element.
   * @param {Object} _ref4.state.rects - The dimensions of the popper.
   * @param {Object} _ref4.state.modifiersData - Data from the applied modifiers.
   * @param {Object} _ref4.options - Options for computing styles.
   * @param {boolean} [_ref4.options.gpuAcceleration=true] - Whether to use GPU acceleration for positioning.
   * @param {boolean} [_ref4.options.adaptive=true] - Whether to enable adaptive positioning.
   * @param {boolean} [_ref4.options.roundOffsets=true] - Whether to round offsets to integer values.
   *
   * @throws {Error} Throws an error if the state or options are not provided correctly.
   *
   * @example
   /**
    * Initializes event listeners based on the configuration settings.
    * This method sets up keyboard event handling, hover pause functionality,
    * and touch event listeners if supported.
    *
    * @private
    * @returns {void} This method does not return a value.
    *
    * @throws {Error} Throws an error if the element is not defined or if
    *                 there is an issue with event listener registration.
    *
    * @example
    * // Assuming the instance is properly configured and initialized,
    * // calling this method will set up the necessary event listeners.
    * instance._addEventListeners();
    */
   * const state = {
   *   placement: 'bottom',
   *   elements: {
   *     popper: document.getElementById('popper')
   *   },
   *   rects: {
   *     popper: { width: 100, height: 50 }
   *   },
   *   modifiersData: {
   *     popperOffsets: { top: 10, left: 20 },
   *     arrow: { top: 5, left: 15 }
   *   }
   * };
   *
   * const options = {
   /**
    * Initializes touch event listeners for swipe functionality on the element.
    * This method sets up event handlers for touch and pointer events to detect
    * swipes and manage carousel behavior accordingly.
    *
    * It handles the following events:
    * - Touch Start: Records the initial touch position.
    * - Touch Move: Calculates the distance moved during the touch.
    * - Touch End: Determines the final swipe distance and manages carousel
    *   cycling and pausing behavior based on user interaction.
    *
    * @throws {Error} Throws an error if the element is not properly initialized
    *                 or if event listeners cannot be attached.
    *
    * @example
    * // To use this method, ensure that the element is initialized and
    * // call this method to set up touch event listeners.
    * carouselInstance._addTouchEventListeners();
    */
   *   gpuAcceleration: true,
   *   adaptive: false,
   *   roundOffsets: true
   * };
   *
   * computeStyles({ state, options });
   */
  function computeStyles(_ref4) {
    var state = _ref4.state,
        options = _ref4.options;
    var _options$gpuAccelerat = options.gpuAcceleration,
        gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
        _options$adaptive = options.adaptive,
        adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
        _options$roundOffsets = options.roundOffsets,
        roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

    var commonStyles = {
      placement: getBasePlacement(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration: gpuAcceleration
    };

    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive: adaptive,
        roundOffsets: roundOffsets
      })));
    }

    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
        roundOffsets: roundOffsets
      })));
    }

    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-placement': state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  var computeStyles$1 = {
    name: 'computeStyles',
    enabled: true,
    phase: 'beforeWrite',
    fn: computeStyles,
    data: {}
  };
/**
 * Handles the keydown event for keyboard navigation.
 * This method checks if the event target is an input or textarea element.
 * If it is, the method returns early, allowing the default behavior.
 * If the target is not an input or textarea, it checks if the pressed key corresponds
 * to a defined direction. If so, it prevents the default action and triggers a slide
 * in the specified direction.
 *
 * @param {KeyboardEvent} event - The keydown event object containing information about the key pressed.
 *
 * @returns {void} This method does not return a value.
 *
 * @throws {Error} Throws an error if the event object is not valid or does not contain a key property.
 *
 * @example
 * // Example usage:
 * document.addEventListener('keydown', this._keydown.bind(this));
 */

  var passive = {
    passive: true
  };

  /**
   * Sets up event listeners for scroll and resize events to update the instance.
   * The function returns a cleanup function that removes the event listeners.
   *
   * @param {Object} _ref - The configuration object.
   * @param {Object} _ref.state - The current state of the popper.
   * @param {Object} _ref.instance - The instance of the popper.
   * @param {Object} _ref.options - Options for configuring the effect.
   * @param {boolean} [_ref.options.scroll=true] - Whether to enable scroll event listeners.
   /**
    * Retrieves the index of a specified element within its parent node's item collection.
    *
    * This method searches for the element within the list of items found in the parent node.
    * If the element or its parent node is not provided, an empty array is used, resulting in an index of -1.
    *
    * @param {Element} element - The DOM element whose index is to be found.
    *                            It must be a child of the parent node from which items are selected.
    * @returns {number} The index of the specified element within the parent node's item collection,
    *                  or -1 if the element is not found.
    *
    * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
    *
    * @example
    * const index = instance._getItemIndex(someElement);
    * console.log(index); // Outputs the index of someElement in its parent's item collection.
    */
   * @param {boolean} [_ref.options.resize=true] - Whether to enable resize event listeners.
   *
   * @returns {Function} A cleanup function that removes the event listeners.
   *
   * @throws {Error} Throws an error if the state or instance is not provided.
   /**
    * Retrieves the next or previous active element based on the specified order.
    *
    * This method determines whether to fetch the next or previous item in a collection
    * based on the provided order parameter. It utilizes the `getNextActiveElement` function
    * to obtain the appropriate element from the internal items list.
    *
    * @param {string} order - The order in which to retrieve the item.
    *                         Use `ORDER_NEXT` to get the next item,
    *                         or another value to get the previous item.
    * @param {Object} activeElement - The currently active element from which to determine the next item.
    *
    * @returns {Object} The next or previous active element based on the specified order.
    *
    * @throws {Error} Throws an error if the order is invalid or if the activeElement is not found.
    *
    * @example
    * const nextElement = this._getItemByOrder(ORDER_NEXT, currentActiveElement);
    * const previousElement = this._getItemByOrder(ORDER_PREVIOUS, currentActiveElement);
    */
   *
   * @example
   * const cleanup = effect({
   *   state: popperState,
   *   instance: popperInstance,
   /**
    * Triggers a slide event on the specified element.
    *
    * This method calculates the index of the target item and the currently active item,
    * then triggers an event with details about the slide transition.
    *
    * @param {Element} relatedTarget - The element that is related to the slide event.
    * @param {string} eventDirectionName - The direction of the slide event (e.g., 'next' or 'prev').
    * @returns {boolean} Returns true if the event was successfully triggered, otherwise false.
    *
    * @throws {Error} Throws an error if the relatedTarget is not a valid element.
    *
    * @example
    * const result = instance._triggerSlideEvent(targetElement, 'next');
    * console.log(result); // Outputs true or false based on event triggering success.
    */
   *   options: {
   *     scroll: true,
   *     resize: false
   *   }
   * });
   *
   * // Later, when you want to clean up:
   * cleanup();
   */
  function effect(_ref) {
    var state = _ref.state,
        instance = _ref.instance,
        options = _ref.options;
    /**
     * Sets the active indicator element based on the provided element.
     * This method updates the class and aria attributes of the indicators
     * to reflect the currently active item.
     *
     * @param {Element} element - The element representing the current item
     *                            for which the indicator should be activated.
     * @throws {Error} Throws an error if the indicators element is not defined.
     *
     * @example
     * // Assuming 'itemElement' is a valid DOM element representing an item
     * this._setActiveIndicatorElement(itemElement);
     */
    var _options$scroll = options.scroll,
        scroll = _options$scroll === void 0 ? true : _options$scroll,
        _options$resize = options.resize,
        resize = _options$resize === void 0 ? true : _options$resize;
    var window = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.addEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.addEventListener('resize', instance.update, passive);
    }

    /**
     * Updates the interval configuration based on the active element's data attribute.
     * If the active element is not found, the method exits without making changes.
     * If the active element has a 'data-bs-interval' attribute, it updates the current interval
     * configuration to this value. If not, it resets the interval to the default value if available.
     *
     * @throws {Error} Throws an error if the element is not found and no default interval is set.
     *
     * @example
     * // Assuming this._element is defined and points to a valid DOM element
     * this._updateInterval();
     */
    return function () {
      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.removeEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.removeEventListener('resize', instance.update, passive);
      }
    };
  } // eslint-disable-next-line import/no-unused-modules


  var eventListeners = {
    name: 'eventListeners',
    enabled: true,
    /**
     * Slides to the next or previous element based on the specified direction or order.
     * This method handles the transition between elements, including triggering events
     * and updating the active element indicators.
     *
     * @param {string} directionOrOrder - The direction to slide ('next' or 'prev') or an order value.
     * @param {Element} [element] - The specific element to slide to. If not provided, the next element is determined by the order.
     * @throws {Error} Throws an error if the sliding action cannot be completed due to invalid elements.
     * @returns {void}
     *
     * @example
     * // Slide to the next element
     * instance._slide('next');
     *
     * @example
     * // Slide to a specific element
     * const specificElement = document.querySelector('.some-class');
     * instance._slide('next', specificElement);
     *
     * @event slid - Triggered after the slide transition is complete.
     * @param {Object} event - The event object.
     * @param {Element} event.relatedTarget - The element that is now active.
     * @param {string} event.direction - The direction of the slide ('left' or 'right').
     * @param {number} event.from - The index of the previous active element.
     * @param {number} event.to - The index of the new active element.
     */
    phase: 'write',
    fn: function fn() {},
    effect: effect,
    data: {}
  };

  var hash$1 = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  /**
   * Returns the opposite placement for a given placement string.
   *
   * This function takes a placement string (e.g., 'left', 'right', 'top', 'bottom')
   * and replaces it with its opposite counterpart based on a predefined mapping.
   *
   * @param {string} placement - The placement string to be converted.
   * @returns {string} The opposite placement string.
   *
   * @example
   * // returns 'right'
   * getOppositePlacement('left');
   *
   * @example
   * // returns 'top'
   * getOppositePlacement('bottom');
   *
   * @throws {TypeError} If the input is not a string.
   */
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash$1[matched];
    });
  }

  var hash = {
    start: 'end',
    end: 'start'
  };
  /**
   * Returns the opposite variation placement for a given placement string.
   *
   * This function takes a placement string that may contain the words "start" or "end"
   * and replaces them with their corresponding opposite values defined in the `hash` object.
   *
   * @param {string} placement - The placement string to be processed. It should contain
   *                             either "start" or "end" to be replaced.
   * @returns {string} The modified placement string with "start" replaced by its opposite
   *                  and "end" replaced by its opposite.
   *
   * @example
   * // Assuming hash = { start: 'end', end: 'start' }
   * const result = getOppositeVariationPlacement('start');
   * console.log(result); // Output: 'end'
   *
   * @throws {TypeError} Throws an error if the input is not a string.
   */
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function (matched) {
      return hash[matched];
    });
  }

  /**
   * Retrieves the current scroll position of the specified node's window.
   *
   * This function calculates the horizontal and vertical scroll offsets
   * of the window associated with the provided node. It returns an object
   * containing the scroll positions.
   *
   * @param {Node} node - The DOM node for which to get the window scroll position.
   * @returns {{scrollLeft: number, scrollTop: number}} An object containing
   *          the horizontal (scrollLeft) and vertical (scrollTop) scroll positions.
   *
   * @throws {TypeError} If the provided node is not a valid DOM node.
   *
   * @example
   * const scrollPosition = getWindowScroll(document.getElementById('myElement'));
   * console.log(scrollPosition.scrollLeft, scrollPosition.scrollTop);
   */
  function getWindowScroll(node) {
    var win = getWindow(node);
    /**
     * Converts a given direction to an order based on the current text directionality.
     *
     * This function checks if the provided direction is either `DIRECTION_RIGHT` or `DIRECTION_LEFT`.
     * If it is not, the function returns the original direction. If the text direction is right-to-left (RTL),
     * it returns `ORDER_PREV` for `DIRECTION_LEFT` and `ORDER_NEXT` for `DIRECTION_RIGHT`. Conversely,
     * if the text direction is left-to-right (LTR), it returns `ORDER_NEXT` for `DIRECTION_LEFT` and
     * `ORDER_PREV` for `DIRECTION_RIGHT`.
     *
     * @param {string} direction - The direction to be converted. Expected values are `DIRECTION_RIGHT` or `DIRECTION_LEFT`.
     * @returns {string} The corresponding order based on the text directionality.
     *
     * @throws {Error} Throws an error if the direction is not recognized.
     *
     * @example
     * const order = _directionToOrder(DIRECTION_LEFT);
     * // Returns ORDER_NEXT if the text direction is LTR, otherwise ORDER_PREV.
     */
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
  }

  /**
   * Calculates the horizontal position of the scrollbar for a given element.
   * This function takes into account the scroll position of the window and
   * the bounding client rectangle of the document element.
   /**
    * Converts an order value to a corresponding direction based on the current text directionality.
    *
    * This function checks if the provided order is either ORDER_NEXT or ORDER_PREV.
    * If it is not, the function returns the original order. If the text direction is
    * right-to-left (RTL), it maps ORDER_PREV to DIRECTION_LEFT and ORDER_NEXT to
    * DIRECTION_RIGHT. Conversely, if the text direction is left-to-right (LTR),
    * it maps ORDER_PREV to DIRECTION_RIGHT and ORDER_NEXT to DIRECTION_LEFT.
    *
    * @param {string} order - The order value to be converted. It should be one of
    *                         ORDER_NEXT or ORDER_PREV for proper conversion.
    * @returns {string} - The corresponding direction (DIRECTION_LEFT or DIRECTION_RIGHT)
    *                     based on the order and text direction.
    *
    * @throws {Error} - Throws an error if the order is not recognized as valid.
    *
    * @example
    * const direction = _orderToDirection(ORDER_NEXT);
    * // If in LTR, direction would be DIRECTION_LEFT; if in RTL, it would be DIRECTION_RIGHT.
    */
   *
   * Note: If the <html> element has a CSS width greater than the viewport,
   * the result may be inaccurate for right-to-left (RTL) layouts.
   * This is a known limitation in certain browsers and versions.
   *
   * @param {Element} element - The DOM element for which to calculate the scrollbar position.
   * @returns {number} The horizontal position of the scrollbar in pixels.
   *
   * @example
   * const scrollbarX = getWindowScrollBarX(document.body);
   * console.log(scrollbarX); // Outputs the scrollbar position
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
   /**
    * Initializes or retrieves a Carousel instance for a given element and applies the specified configuration.
    *
    * This method can handle various types of configurations including actions to perform on the carousel,
    * such as sliding to a specific index or starting/stopping the automatic cycling of items.
    *
    * @static
    * @param {HTMLElement} element - The DOM element that represents the carousel.
    * @param {Object|string|number} config - The configuration options for the carousel, which can be:
    *   - An object containing configuration settings.
    *   - A string representing an action to perform (e.g., 'next', 'prev').
    *   - A number indicating the index to slide to.
    *
    * @throws {TypeError} Throws an error if the specified action is not a valid method of the Carousel instance.
    *
    * @example
    * // Initialize a carousel with default settings
    * carouselInterface(document.querySelector('#myCarousel'));
    *
    * // Slide to the second item in the carousel
    * carouselInterface(document.querySelector('#myCarousel'), 1);
    *
    * // Perform a 'next' action on the carousel
    * carouselInterface(document.querySelector('#myCarousel'), 'next');
    *
    * // Start automatic cycling with custom settings
    * carouselInterface(document.querySelector('#myCarousel'), { interval: 2000, ride: true });
    */
   */
  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }

  /**
   * Retrieves the dimensions and position of the viewport for a given element.
   *
   * This function calculates the width, height, and coordinates (x, y) of the viewport,
   * taking into account various factors such as the visual viewport and potential browser
   * inconsistencies, especially on mobile devices.
   *
   * Note: The y-coordinate may not be accurate on iOS devices with the keyboard open,
   * and the height may include additional space in Safari iOS.
   *
   * @param {Element} element - The DOM element for which to calculate the viewport rectangle.
   * @returns {{ width: number, height: number, x: number, y: number }} An object containing
   *          the width, height, x-coordinate, and y-coordinate of the viewport.
   *
   * @example
   * const viewport = getViewportRect(document.body);
   /**
    * Initializes the carousel interface for each element in the jQuery collection.
    * This method applies the specified configuration to the carousel component.
    *
    * @static
    * @param {Object} config - The configuration options for the carousel.
    * @returns {jQuery} The jQuery collection for chaining.
    *
    * @example
    * // Initialize the carousel with custom options
    * $('.carousel').jQueryInterface({ interval: 5000 });
    *
    * @throws {TypeError} Throws an error if the config is not an object.
    */
   * console.log(viewport.width, viewport.height, viewport.x, viewport.y);
   *
   * @throws {Error} Throws an error if the element is not a valid DOM element.
   */
  function getViewportRect(element) {
    var win = getWindow(element);
    /**
     * Handles click events for data API interactions on carousel elements.
     * This method retrieves the target element based on the event, checks if it is a carousel,
     * and then configures and initializes the carousel instance accordingly.
     *
     * @static
     * @param {Event} event - The click event triggered by the user.
     * @returns {void}
     *
     * @example
     * // Example usage: Attach this handler to a button click event
     * buttonElement.addEventListener('click', dataApiClickHandler);
     *
     * @throws {Error} Throws an error if the target element is not found or is not a carousel.
     */
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
    // can be obscured underneath it.
    // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
    // if it isn't open, so if this isn't available, the popper will be detected
    // to overflow the bottom of the screen too early.

    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
      // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
      // errors due to floating point numbers, so we need to check precision.
      // Safari returns a number <= 0, usually < -1 when pinch-zoomed
      // Feature detection fails in mobile emulation mode in Chrome.
      // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
      // 0.001
      // Fallback here: "Not Safari" userAgent

      if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }

    return {
      width: width,
      height: height,
      x: x + getWindowScrollBarX(element),
      y: y
    };
  }

  // of the `<html>` and `<body>` rect bounds if horizontally scrollable

  /**
   * Calculates the dimensions and position of a given HTML element's document rectangle.
   *
   * This function retrieves the width, height, and coordinates (x, y) of the specified element's
   * document rectangle, taking into account the scrolling position of the window and the document's
   * body. It also adjusts for right-to-left (RTL) layouts if applicable.
   *
   * @param {HTMLElement} element - The HTML element for which to calculate the document rectangle.
   * @returns {{ width: number, height: number, x: number, y: number }} An object containing the
   *          width, height, and coordinates of the document rectangle.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
   *
   * @example
   * const rect = getDocumentRect(document.getElementById('myElement'));
   * console.log(rect.width, rect.height, rect.x, rect.y);
   */
  function getDocumentRect(element) {
    var _element$ownerDocumen;

    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;

    if (getComputedStyle$1(body || html).direction === 'rtl') {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }

    return {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }

  /**
   * Determines if the specified element is a scrollable parent.
   * This function checks the computed styles of the element to ascertain
   * whether it has overflow properties that indicate it can scroll.
   *
   * @param {Element} element - The DOM element to check for scrollability.
   * @returns {boolean} Returns true if the element is a scrollable parent,
   *                    otherwise returns false.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const result = isScrollParent(element);
   * console.log(result); // true if the element can scroll, false otherwise.
   */
  function isScrollParent(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = getComputedStyle$1(element),
        overflow = _getComputedStyle.overflow,
        overflowX = _getComputedStyle.overflowX,
        overflowY = _getComputedStyle.overflowY;

    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  /**
   * Retrieves the closest scrollable parent element of a given node.
   *
   * This function traverses up the DOM tree to find the nearest ancestor
   * that has scrolling capabilities. If the node is an HTML element and
   * is itself a scrollable parent, it will return that element. If the
   * node is part of the document structure (html, body, or #document),
   * it will return the body of the document.
   *
   * @param {Node} node - The DOM node for which to find the scroll parent.
   * @returns {HTMLElement} The closest scrollable parent element.
   *
   * @throws {TypeError} Throws an error if the provided node is not a valid DOM node.
   *
   * @example
   * const scrollParent = getScrollParent(someNode);
   * console.log(scrollParent); // Logs the closest scrollable parent element.
   */
  function getScrollParent(node) {
    if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return node.ownerDocument.body;
    }

    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }

    return getScrollParent(getParentNode(node));
  }

  /*
  given a DOM element, return the list of all scroll parents, up the list of ancesors
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
  until we get to the top window object. This list is what we attach scroll listeners
  to, because if any of these parent elements scroll, we'll need to re-calculate the
  reference element's position.
  */

  /**
   * Recursively retrieves all scrollable parent elements of a given DOM element.
   *
   /**
    * Displays the collapsible element, transitioning it from a hidden to a visible state.
    * This method handles the visibility of the element and manages any active collapsible elements
    * within the specified parent container.
    *
    * @throws {Error} Throws an error if the transition is already in progress or if the element is already shown.
    *
    * @fires EVENT_SHOW$5 - Triggered before the element is shown.
    * @fires EVENT_SHOWN$5 - Triggered after the element has been shown.
    *
    * @example
    * const collapsible = new Collapse(element);
    * collapsible.show();
    */
   * This function starts from the provided element and traverses up the DOM tree,
   * collecting all elements that can scroll. It includes the window and visual viewport
   * if the scrollable parent is the document body.
   *
   * @param {Element} element - The DOM element for which to find scrollable parents.
   * @param {Array<Element>} [list=[]] - An optional array to accumulate the found scrollable parents.
   * @returns {Array<Element>} An array of scrollable parent elements, including the window and visual viewport if applicable.
   *
   * @example
   * const element = document.querySelector('.my-element');
   * const scrollParents = listScrollParents(element);
   * console.log(scrollParents); // Logs an array of scrollable parent elements.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
   */
  function listScrollParents(element, list) {
    var _element$ownerDocumen;

    if (list === void 0) {
      list = [];
    }

    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)));
  }

  /**
   * Converts a rectangle object with x, y, width, and height properties
   * into a client rectangle object with left, top, right, and bottom properties.
   *
   * @param {Object} rect - The rectangle object to convert.
   * @param {number} rect.x - The x-coordinate of the rectangle's origin.
   * @param {number} rect.y - The y-coordinate of the rectangle's origin.
   * @param {number} rect.width - The width of the rectangle.
   * @param {number} rect.height - The height of the rectangle.
   *
   * @returns {Object} A new object representing the client rectangle with
   *                  left, top, right, and bottom properties.
   * @returns {number} return.left - The left coordinate of the rectangle.
   * @returns {number} return.top - The top coordinate of the rectangle.
   * @returns {number} return.right - The right coordinate of the rectangle.
   * @returns {number} return.bottom - The bottom coordinate of the rectangle.
   *
   * @example
   * const rect = { x: 10, y: 20, width: 100, height: 50 };
   * const clientRect = rectToClientRect(rect);
   * console.log(clientRect); // { left: 10, top: 20, right: 110, bottom: 70 }
   */
  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }

  /**
   * Calculates the inner bounding rectangle of a given HTML element.
   *
   * This function retrieves the bounding rectangle of the specified element
   * and adjusts its properties to account for the element's client top and
   * client left offsets. The resulting rectangle includes properties such as
   * width, height, and coordinates relative to the viewport.
   *
   * @param {HTMLElement} element - The HTML element for which to calculate the inner bounding rectangle.
   * @returns {DOMRect} A DOMRect object containing the properties of the inner bounding rectangle,
   *                    including top, left, bottom, right, width, height, x, and y.
   /**
    * Hides the element by collapsing it with a transition effect.
    *
    * This method checks if the element is currently transitioning or if it is already hidden.
    * If either condition is true, the method will return early. It triggers a hide event and
    * prevents the action if the event is canceled. The method calculates the dimension to
    * collapse and applies the necessary CSS classes to initiate the transition.
    *
    * It also updates any associated triggers to reflect the collapsed state of the element.
    *
    * @throws {Error} Throws an error if the element is not found or if there is an issue
    *                 during the transition.
    *
    * @example
    * const myElement = new MyElement();
    * myElement.hide(); // Collapses the element with a transition
    */
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const innerRect = getInnerBoundingClientRect(element);
   * console.log(innerRect);
   */
  function getInnerBoundingClientRect(element) {
    var rect = getBoundingClientRect(element);
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }

  /**
   * Retrieves the client rectangle of a specified element based on the type of clipping parent provided.
   *
   * This function determines how to calculate the client rectangle based on whether the clipping parent
   * is the viewport, an HTML element, or another type. It utilizes different methods to obtain the
   * appropriate rectangle based on the context.
   *
   * @param {Element} element - The target element for which the client rectangle is to be calculated.
   * @param {Element|string} clippingParent - The clipping parent which can be an HTML element or a string
   * indicating the viewport. If it is the string 'viewport', the viewport rectangle will be used.
   *
   * @returns {DOMRect} - The calculated client rectangle of the specified element.
   *
   * @throws {TypeError} - Throws an error if the provided element is not a valid DOM element.
   *
   * @example
   * const rect = getClientRectFromMixedType(myElement, 'viewport');
   * console.log(rect); // Logs the client rectangle of myElement relative to the viewport.
   */
  function getClientRectFromMixedType(element, clippingParent) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  } // A "clipping parent" is an overflowable container with the characteristic of
  // clipping (or hiding) overflowing elements with a position different from
  // `initial`


  /**
   /**
    * Checks if the specified element is currently shown.
    *
    * This method determines if the given element has the class
    * indicating that it is visible. If no element is provided,
    * it defaults to the instance's `_element`.
    *
    * @param {Element} [element=this._element] - The element to check.
    * If not provided, the method will check the instance's `_element`.
    * @returns {boolean} Returns `true` if the element is shown,
    * otherwise returns `false`.
    *
    * @example
    * const isVisible = instance._isShown();
    * console.log(isVisible); // true or false based on visibility
    */
   * Retrieves a list of clipping parents for a given element.
   *
   * Clipping parents are elements that can potentially clip the visibility of the target element.
   * This function checks the position of the element and determines if it can escape its clipping context.
   *
   /**
    * Retrieves and merges configuration options for a component.
    *
    * This method takes a configuration object, merges it with default settings,
    * and processes data attributes from the element. It also ensures that the
    * 'toggle' property is a boolean and resolves the 'parent' property to an
    * actual DOM element.
    *
    * @param {Object} config - The configuration object to be processed.
    * @param {boolean|string} [config.toggle] - A toggle option that can be a boolean or string.
    * @param {string|Element} [config.parent] - The parent element or selector for the component.
    *
    * @returns {Object} The merged configuration object with defaults applied.
    *
    * @throws {TypeError} Throws an error if the configuration does not match the expected types.
    *
    * @example
    * const config = _getConfig({ toggle: 'true', parent: '#myParent' });
    * console.log(config.toggle); // true
    * console.log(config.parent); // <Element> corresponding to '#myParent'
    */
   * @param {HTMLElement} element - The target element for which to find clipping parents.
   * @returns {HTMLElement[]} An array of clipping parent elements. If no clipping parents are found, an empty array is returned.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const clippingParents = getClippingParents(element);
   * console.log(clippingParents); // Logs the array of clipping parents for 'myElement'
   */
  function getClippingParents(element) {
    var clippingParents = listScrollParents(getParentNode(element));
    /**
     * Retrieves the dimension of the element based on its class.
     * The dimension is determined by checking if the element's class list
     * contains a specific class name that indicates a horizontal orientation.
     *
     * @returns {string} Returns 'WIDTH' if the element is horizontal,
     *                   otherwise returns 'HEIGHT'.
     *
     * @throws {Error} Throws an error if the element is not defined or
     *                 if the class list cannot be accessed.
     *
     * @example
     * const dimension = instance._getDimension();
     * console.log(dimension); // Outputs 'WIDTH' or 'HEIGHT' based on the class.
     */
    var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

    if (!isElement(clipperElement)) {
      /**
       * Initializes the child elements of the component based on the provided configuration.
       * This method checks if a parent element is defined in the configuration and, if so,
       * it finds all collapsible child elements within that parent. It also updates the ARIA
       * attributes and collapsed classes for elements that are not part of the found children.
       *
       * @private
       * @returns {void} This method does not return a value.
       *
       * @throws {Error} Throws an error if the parent configuration is invalid.
       *
       * @example
       * // Assuming this._config.parent is set to a valid DOM element,
       * // calling this method will initialize the children accordingly.
       * this._initializeChildren();
       */
      return [];
    } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


    return clippingParents.filter(function (clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
    });
  } // Gets the maximum area that the element is visible in due to any number of
  // clipping parents


  /**
   * Calculates the clipping rectangle of an element based on specified boundaries.
   *
   * This function determines the area within which an element is visible,
   /**
    * Updates the ARIA attributes and collapsed class for a given array of elements.
    *
    * This method modifies the class list of each element in the provided array
    * based on the `isOpen` state. If `isOpen` is true, it removes the collapsed
    * class; otherwise, it adds the collapsed class. Additionally, it sets the
    * 'aria-expanded' attribute to reflect the current state.
    *
    * @param {HTMLElement[]} triggerArray - An array of HTML elements to update.
    * @param {boolean} isOpen - A boolean indicating whether the elements are open or collapsed.
    *
    * @returns {void} This function does not return a value.
    *
    * @example
    * // Assuming `buttons` is an array of button elements
    * _addAriaAndCollapsedClass(buttons, true);
    * // This will remove the collapsed class from all buttons and set aria-expanded to true.
    *
    * @throws {TypeError} Throws an error if `triggerArray` is not an array of HTMLElements.
    */
   * considering its clipping parents and a root boundary. It computes the
   * intersection of the element's bounding rectangle with the bounding
   * rectangles of its clipping parents.
   *
   * @param {Element} element - The DOM element for which the clipping rectangle is to be calculated.
   * @param {string|Array<Element>} boundary - The boundary context for clipping. Can be 'clippingParents'
   *                                            or an array of elements.
   * @param {Element} rootBoundary - The root boundary element that serves as the outer limit for clipping.
   *
   * @returns {Object} An object representing the clipping rectangle with properties:
   *                   - top {number}: The top coordinate of the clipping rectangle.
   *                   - right {number}: The right coordinate of the clipping rectangle.
   *                   - bottom {number}: The bottom coordinate of the clipping rectangle.
   *                   - left {number}: The left coordinate of the clipping rectangle.
   *                   - width {number}: The width of the clipping rectangle.
   *                   - height {number}: The height of the clipping rectangle.
   *                   - x {number}: The x-coordinate (left) of the clipping rectangle.
   /**
    * jQuery interface for the Collapse component.
    * This method allows for the manipulation of the Collapse instance
    * using jQuery syntax. It can accept a configuration object or a
    * string representing a method name to invoke on the Collapse instance.
    *
    * @static
    * @param {string|Object} config - The configuration object or a method name.
    *                                  If a string is provided, it must be either
    *                                  "show" or "hide" to toggle the visibility
    *                                  of the Collapse instance.
    * @returns {jQuery} The jQuery object for chaining.
    * @throws {TypeError} Throws an error if the provided method name does not
    *                     correspond to a valid method on the Collapse instance.
    *
    * @example
    * // To show the Collapse instance
    * $(selector).Collapse('show');
    *
    * // To hide the Collapse instance
    * $(selector).Collapse('hide');
    *
    * // To initialize with custom configuration
    * $(selector).Collapse({ toggle: true });
    */
   *                   - y {number}: The y-coordinate (top) of the clipping rectangle.
   *
   * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const clippingRect = getClippingRect(element, 'clippingParents', document.body);
   * console.log(clippingRect);
   */
  function getClippingRect(element, boundary, rootBoundary) {
    var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
    var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents[0];
    var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  /**
   * Extracts the variation from a given placement string.
   *
   * The placement string is expected to be in the format of "base-variation".
   * This function splits the string by the hyphen and returns the second part,
   * which represents the variation.
   *
   * @param {string} placement - The placement string to extract the variation from.
   * @returns {string} The variation extracted from the placement string.
   *
   * @example
   * // returns 'variation'
   * getVariation('base-variation');
   *
   * @throws {TypeError} Throws an error if the input is not a string.
   */
  function getVariation(placement) {
    return placement.split('-')[1];
  }

  /**
   * Computes the offsets for positioning an element relative to a reference element based on the specified placement.
   *
   * @param {Object} _ref - The reference object containing properties for calculation.
   * @param {Object} _ref.reference - The reference element's dimensions and position.
   * @param {number} _ref.reference.x - The x-coordinate of the reference element.
   * @param {number} _ref.reference.y - The y-coordinate of the reference element.
   * @param {number} _ref.reference.width - The width of the reference element.
   * @param {number} _ref.reference.height - The height of the reference element.
   * @param {Object} _ref.element - The element to be positioned.
   * @param {number} _ref.element.width - The width of the element to be positioned.
   * @param {number} _ref.element.height - The height of the element to be positioned.
   * @param {string} [_ref.placement] - The desired placement of the element (e.g., 'top', 'bottom', 'left', 'right').
   *
   * @returns {Object} An object containing the computed offsets with properties `x` and `y`.
   * @returns {number} return.x - The computed x-offset for positioning the element.
   * @returns {number} return.y - The computed y-offset for positioning the element.
   *
   * @throws {Error} Throws an error if the placement is invalid or not recognized.
   *
   * @example
   * const offsets = computeOffsets({
   *   reference: { x: 100, y: 200, width: 50, height: 50 },
   *   element: { width: 30, height: 30 },
   *   placement: 'top'
   * });
   * console.log(offsets); // { x: 85, y: 170 }
   */
  function computeOffsets(_ref) {
    var reference = _ref.reference,
        element = _ref.element,
        placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;

    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height
        };
        break;

      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;

      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;

      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        };
        break;

      default:
        offsets = {
          x: reference.x,
          y: reference.y
        };
    }

    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

    if (mainAxis != null) {
      var len = mainAxis === 'y' ? 'height' : 'width';

      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
          break;

        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
          break;
      }
    }

    return offsets;
  }

  /**
   * Detects the overflow of a popper element relative to its boundary.
   *
   * This function calculates the offsets of the popper element in relation to the clipping boundaries,
   * and returns an object containing the overflow offsets for each side (top, bottom, left, right).
   *
   * @param {Object} state - The state object containing information about the popper and its elements.
   * @param {Object} [options={}] - Configuration options for detecting overflow.
   * @param {string} [options.placement] - The placement of the popper element (e.g., 'top', 'bottom', 'left', 'right').
   * @param {Element} [options.boundary] - The boundary element to which the popper should be confined.
   * @param {Element} [options.rootBoundary] - The root boundary for the overflow detection.
   * @param {string} [options.elementContext] - The context in which the element is being measured (e.g., 'popper' or 'reference').
   * @param {boolean} [options.altBoundary=false] - Whether to use the alternate boundary for overflow detection.
   * @param {number|Object} [options.padding=0] - Padding to be applied to the overflow calculations.
   *
   * @returns {Object} An object containing the overflow offsets for each side:
   *                   {
   *                     top: number,
   *                     bottom: number,
   *                     left: number,
   *                     right: number
   *                   }
   *
   * @throws {TypeError} Throws an error if the state or options parameters are invalid.
   *
   * @example
   * const overflow = detectOverflow(state, {
   *   placement: 'bottom',
   *   boundary: document.body,
   *   padding: 10
   * });
   *
   * console.log(overflow); // { top: 0, bottom: 20, left: 0, right: 0 }
   */
  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$placement = _options.placement,
        placement = _options$placement === void 0 ? state.placement : _options$placement,
        _options$boundary = _options.boundary,
        boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
        _options$rootBoundary = _options.rootBoundary,
        rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
        _options$elementConte = _options.elementContext,
        elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
        _options$altBoundary = _options.altBoundary,
        altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
        _options$padding = _options.padding,
        padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var referenceElement = state.elements.reference;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
    var referenceClientRect = getBoundingClientRect(referenceElement);
    var popperOffsets = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: 'absolute',
      placement: placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect

    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

    if (elementContext === popper && offsetData) {
      var offset = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function (key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
        overflowOffsets[key] += offset[axis] * multiply;
      });
    }

    return overflowOffsets;
  }

  /**
   * Computes the optimal placement of an element based on the provided state and options.
   *
   * This function evaluates various placements and determines which ones are allowed based on the
   * specified options. It also detects overflow conditions for each allowed placement and returns
   * a sorted list of placements based on their overflow values.
   *
   * @param {Object} state - The current state of the element positioning.
   * @param {Object} [options={}] - Configuration options for auto placement.
   * @param {string} [options.placement] - The preferred placement of the element.
   * @param {string} [options.boundary] - The boundary element to consider for overflow detection.
   * @param {string} [options.rootBoundary] - The root boundary element for overflow detection.
   * @param {number} [options.padding=0] - Padding to apply around the boundaries.
   * @param {boolean} [options.flipVariations=false] - Whether to flip variations when computing placements.
   * @param {Array<string>} [options.allowedAutoPlacements] - List of allowed placements. If not provided, defaults to all placements.
   *
   * @returns {Array<string>} - A sorted array of allowed placements based on overflow detection.
   *
   * @throws {Error} Will throw an error if the state is invalid or if no placements are allowed.
   *
   * @example
   * const placements = computeAutoPlacement(state, {
   *   placement: 'bottom',
   *   boundary: 'viewport',
   *   padding: 10,
   *   allowedAutoPlacements: ['top', 'bottom', 'left', 'right']
   * });
   */
  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        placement = _options.placement,
        boundary = _options.boundary,
        rootBoundary = _options.rootBoundary,
        padding = _options.padding,
        flipVariations = _options.flipVariations,
        _options$allowedAutoP = _options.allowedAutoPlacements,
        allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
      return getVariation(placement) === variation;
    }) : basePlacements;
    var allowedPlacements = placements$1.filter(function (placement) {
      return allowedAutoPlacements.indexOf(placement) >= 0;
    });

    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;
    } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


    var overflows = allowedPlacements.reduce(function (acc, placement) {
      acc[placement] = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding
      })[getBasePlacement(placement)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function (a, b) {
      return overflows[a] - overflows[b];
    });
  }

  /**
   * Computes an array of fallback placements for a given placement.
   * If the base placement is 'auto', an empty array is returned.
   *
   * @param {string} placement - The initial placement from which to derive fallback placements.
   * @returns {string[]} An array containing the opposite variation placement, the opposite placement,
   *                    and the opposite variation of the opposite placement.
   *
   * @throws {Error} Throws an error if the placement is invalid or cannot be processed.
   *
   * @example
   * // Example usage:
   * const fallbacks = getExpandedFallbackPlacements('top');
   * console.log(fallbacks); // Outputs an array of fallback placements based on 'top'.
   */
  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }

    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }

  /**
   * Determines the optimal placement for a popper element based on the current state and options.
   * This function evaluates the available placements and checks for potential overflow in both main and alternative axes.
   * If a suitable placement is found, it updates the state with the new placement.
   *
   * @param {Object} _ref - The reference object containing state and options.
   * @param {Object} _ref.state - The current state of the popper, including placement and rects.
   * @param {Object} _ref.options - Configuration options for the flip behavior.
   * @param {boolean} [_ref.options.mainAxis=true] - Whether to check for overflow on the main axis.
   * @param {boolean} [_ref.options.altAxis=true] - Whether to check for overflow on the alternative axis.
   * @param {Array<string>} [_ref.options.fallbackPlacements] - An array of fallback placements to consider.
   * @param {number} [_ref.options.padding] - Padding to apply around the popper.
   * @param {string} [_ref.options.boundary] - The boundary element for overflow detection.
   * @param {string} [_ref.options.rootBoundary] - The root boundary for overflow detection.
   * @param {string} [_ref.options.altBoundary] - The alternative boundary for overflow detection.
   * @param {boolean} [_ref.options.flipVariations=true] - Whether to consider variations of placements.
   * @param {Array<string>} [_ref.options.allowedAutoPlacements] - Allowed placements when using auto-placement.
   *
   * @throws {Error} Throws an error if the state or options are not provided or are invalid.
   *
   * @example
   * const state = {
   *   placement: 'top',
   *   rects: {
   *     reference: { width: 100, height: 200 },
   *     popper: { width: 50, height: 50 }
   *   },
   *   modifiersData: {}
   * };
   *
   * const options = {
   *   mainAxis: true,
   *   altAxis: true,
   *   fallbackPlacements: ['bottom', 'right'],
   *   padding: 10,
   *   boundary: 'viewport',
   *   rootBoundary: 'document',
   *   altBoundary: 'viewport',
   *   flipVariations: true,
   *   allowedAutoPlacements: ['top', 'bottom', 'left', 'right']
   * };
   *
   * flip({ state, options });
   */
  function flip(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;

    if (state.modifiersData[name]._skip) {
      return;
    }

    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
        specifiedFallbackPlacements = options.fallbackPlacements,
        padding = options.padding,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        _options$flipVariatio = options.flipVariations,
        flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
        allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
      return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        flipVariations: flipVariations,
        allowedAutoPlacements: allowedAutoPlacements
      }) : placement);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements[0];

    for (var i = 0; i < placements.length; i++) {
      var placement = placements[i];

      var _basePlacement = getBasePlacement(placement);

      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? 'width' : 'height';
      var overflow = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        altBoundary: altBoundary,
        padding: padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }

      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];

      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }

      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }

      if (checks.every(function (check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }

      checksMap.set(placement, checks);
    }

    if (makeFallbackChecks) {
      // `2` may be desired in some cases – research later
      var numberOfChecks = flipVariations ? 3 : 1;

      var _loop = function _loop(_i) {
        var fittingPlacement = placements.find(function (placement) {
          var checks = checksMap.get(placement);

          if (checks) {
            return checks.slice(0, _i).every(function (check) {
              return check;
            });
          }
        });

        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };

      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);

        if (_ret === "break") break;
      }
    }

    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  } // eslint-disable-next-line import/no-unused-modules


  var flip$1 = {
    name: 'flip',
    enabled: true,
    phase: 'main',
    fn: flip,
    requiresIfExists: ['offset'],
    data: {
      _skip: false
    }
  };

  /**
   * Calculates the side offsets based on the overflow and the dimensions of a rectangle.
   *
   * @param {Object} overflow - An object representing the overflow dimensions.
   * @param {number} overflow.top - The top overflow value.
   * @param {number} overflow.right - The right overflow value.
   * @param {number} overflow.bottom - The bottom overflow value.
   * @param {number} overflow.left - The left overflow value.
   * @param {Object} rect - An object representing the dimensions of a rectangle.
   * @param {number} rect.height - The height of the rectangle.
   * @param {number} rect.width - The width of the rectangle.
   * @param {Object} [preventedOffsets={x: 0, y: 0}] - An optional object specifying offsets to prevent.
   * @param {number} [preventedOffsets.x=0] - The horizontal offset to prevent.
   * @param {number} [preventedOffsets.y=0] - The vertical offset to prevent.
   *
   * @returns {Object} An object containing the calculated side offsets.
   * @returns {number} return.top - The calculated top offset.
   * @returns {number} return.right - The calculated right offset.
   * @returns {number} return.bottom - The calculated bottom offset.
   * @returns {number} return.left - The calculated left offset.
   *
   * @example
   * const overflow = { top: 100, right: 200, bottom: 300, left: 400 };
   * const rect = { height: 50, width: 100 };
   * const offsets = getSideOffsets(overflow, rect);
   * console.log(offsets); // { top: 50, right: 100, bottom: 250, left: 300 }
   */
  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }

    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }

  /**
   * Determines if any side of a given overflow object is fully clipped.
   *
   * This function checks the properties of the overflow object corresponding to
   * the sides (top, right, bottom, left) and returns true if any of these sides
   * have a value greater than or equal to zero, indicating that the side is fully
   * clipped.
   *
   * @param {Object} overflow - An object representing the overflow state of an element.
   * @param {number} overflow.top - The overflow value for the top side.
   * @param {number} overflow.right - The overflow value for the right side.
   * @param {number} overflow.bottom - The overflow value for the bottom side.
   * @param {number} overflow.left - The overflow value for the left side.
   *
   * @returns {boolean} Returns true if any side is fully clipped, otherwise false.
   *
   * @example
   * const overflow = { top: -1, right: 0, bottom: -2, left: -3 };
   * const result = isAnySideFullyClipped(overflow);
   * console.log(result); // Output: true
   *
   * @example
   * const overflow = { top: -1, right: -1, bottom: -1, left: -1 };
   * const result = isAnySideFullyClipped(overflow);
   * console.log(result); // Output: false
   */
  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function (side) {
      return overflow[side] >= 0;
    });
  }

  /**
   * Determines the visibility state of a popper element based on its reference element's position and overflow.
   *
   * This function analyzes the positions of the reference and popper elements, checks for any clipping or overflow,
   * and updates the state with information about whether the reference is hidden and if the popper has escaped its
   * intended boundaries.
   *
   * @param {Object} _ref - The reference object containing state and name.
   * @param {Object} _ref.state - The current state of the popper, including rectangles and modifiers data.
   * @param {string} _ref.name - The name of the modifier that is being processed.
   *
   * @throws {TypeError} If the state or name is not provided or is of an incorrect type.
   *
   * @returns {void} This function does not return a value but modifies the state object directly.
   *
   * @example
   * const state = {
   *   rects: {
   *     reference: { width: 100, height: 100 },
   *     popper: { width: 50, height: 50 }
   *   },
   *   modifiersData: {
   *     preventOverflow: {}
   *   },
   *   attributes: {
   *     popper: {}
   *   }
   * };
   * hide({ state, name: 'hideModifier' });
   */
  function hide(_ref) {
    var state = _ref.state,
        name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: 'reference'
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-reference-hidden': isReferenceHidden,
      'data-popper-escaped': hasPopperEscaped
    });
  } // eslint-disable-next-line import/no-unused-modules


  var hide$1 = {
    name: 'hide',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['preventOverflow'],
    fn: hide
  };

  /**
   * Calculates the distance and skidding values based on the given placement,
   * rectangles, and offset. The function determines the appropriate x and y
   * values depending on the base placement direction.
   *
   * @param {string} placement - The placement direction (e.g., 'top', 'bottom', 'left', 'right').
   * @param {Object} rects - An object containing rectangle dimensions and positions.
   * @param {number|function} offset - A numeric value or a function that returns an array
   *                                    containing skidding and distance values.
   *                                    If a function is provided, it will be called with
   *                                    the rects object and should return an array in the
   *                                    format [skidding, distance].
   * @returns {{x: number, y: number}} An object containing the calculated x and y values.
   * @throws {TypeError} Throws an error if the offset is not a number or a function.
   *
   * @example
   * // Using a numeric offset
   * const result = distanceAndSkiddingToXY('top', rects, [10, 20]);
   * console.log(result); // { x: 20, y: 10 }
   *
   * @example
   * // Using a function for offset
   * const result = distanceAndSkiddingToXY('bottom', rects, (rects) => [15, 25]);
   * console.log(result); // { x: 25, y: 15 }
   */
  function distanceAndSkiddingToXY(placement, rects, offset) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

    var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
      placement: placement
    })) : offset,
        skidding = _ref[0],
        distance = _ref[1];

    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }

  /**
   * Calculates the offset positions for a given placement based on the current state and options.
   *
   * This function updates the `modifiersData` of the provided state with the calculated offsets
   * for each placement. It uses the `distanceAndSkiddingToXY` utility to determine the x and y
   * offsets based on the provided options and the current rectangle dimensions.
   *
   * @param {Object} _ref2 - The input parameters containing state, options, and name.
   * @param {Object} _ref2.state - The current state object containing placement and rects.
   * @param {Object} _ref2.options - The options object which may include an offset array.
   * @param {string} _ref2.name - The name of the modifier that is being updated.
   * @throws {TypeError} Throws an error if state or options are not provided or are of incorrect type.
   *
   * @example
   * const state = {
   *   placement: 'top',
   *   rects: { /* rectangle dimensions */
  function offset(_ref2) {
    var state = _ref2.state,
        options = _ref2.options,
        name = _ref2.name;
    var _options$offset = options.offset,
        offset = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function (acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement],
        x = _data$state$placement.x,
        y = _data$state$placement.y;

    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  var offset$1 = {
    name: 'offset',
    enabled: true,
    phase: 'main',
    requires: ['popperOffsets'],
    fn: offset
  };

  /**
   * Calculates and sets the offsets for the popper element based on its reference element.
   * This function is responsible for determining the initial position of the popper,
   * which will be adjusted by other modifiers in subsequent steps.
   *
   * @param {Object} _ref - The parameters for calculating offsets.
   * @param {Object} _ref.state - The current state of the popper instance.
   * @param {string} _ref.name - The name of the modifier that is calling this function.
   *
   * @throws {Error} Throws an error if the state or name is not provided.
   *
   * @returns {void} This function does not return a value.
   *
   * @example
   * const state = {
   *   rects: {
   *     reference: { /* reference element dimensions */
  function popperOffsets(_ref) {
    var state = _ref.state,
        name = _ref.name;
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: 'absolute',
      placement: state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  var popperOffsets$1 = {
    name: 'popperOffsets',
    enabled: true,
    phase: 'read',
    fn: popperOffsets,
    data: {}
  };

  /**
   * Returns the alternate axis for a given axis input.
   *
   * This function takes an axis ('x' or 'y') and returns the corresponding alternate axis.
   * If the input is 'x', it returns 'y', and if the input is 'y', it returns 'x'.
   *
   * @param {string} axis - The axis to get the alternate for. Should be either 'x' or 'y'.
   * @returns {string} The alternate axis corresponding to the input.
   *
   * @throws {Error} Will throw an error if the input is not 'x' or 'y'.
   *
   * @example
   * // returns 'y'
   * getAltAxis('x');
   *
   * @example
   * // returns 'x'
   * getAltAxis('y');
   */
  function getAltAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  }

  /**
   * Prevents the popper element from overflowing its boundary by adjusting its position.
   *
   * This function calculates the necessary adjustments to the popper's offsets based on the
   * provided state and options. It checks both the main axis and alternate axis for potential
   * overflow and adjusts the popper's position accordingly.
   *
   * @param {Object} _ref - The reference object containing state and options.
   * @param {Object} _ref.state - The current state of the popper.
   * @param {Object} _ref.options - Configuration options for the overflow prevention.
   * @param {boolean} [_ref.options.mainAxis=true] - Whether to check for overflow on the main axis.
   * @param {boolean} [_ref.options.altAxis=false] - Whether to check for overflow on the alternate axis.
   * @param {Element} [_ref.options.boundary] - The boundary element for overflow detection.
   * @param {Element} [_ref.options.rootBoundary] - The root boundary for overflow detection.
   * @param {Element} [_ref.options.altBoundary] - The alternate boundary for overflow detection.
   * @param {number|function} [_ref.options.padding] - Padding to apply around the boundaries.
   * @param {boolean} [_ref.options.tether=true] - Whether to enable tethering of the popper.
   * @param {number|function} [_ref.options.tetherOffset=0] - Offset to apply when tethering.
   *
   * @returns {void} This function does not return a value. It modifies the popper offsets directly.
   *
   * @throws {Error} Throws an error if the state or options are not provided correctly.
   *
   * @example
   * preventOverflow({
   *   state: {
   *     placement: 'bottom',
   *     rects: {
   *       reference: { width: 100, height: 100 },
   *       popper: { width: 50, height: 50 },
   *       arrow: null
   *     },
   *     modifiersData: {
   *       popperOffsets: { top: 0, left: 0 }
   *     }
   *   },
   *   options: {
   *     mainAxis: true,
   *     altAxis: false,
   *     boundary: document.body,
   *     padding: 10
   *   },
   *   name: 'preventOverflow'
   * });
   */
  function preventOverflow(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;
    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        padding = options.padding,
        _options$tether = options.tether,
        tether = _options$tether === void 0 ? true : _options$tether,
        _options$tetherOffset = options.tetherOffset,
        tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      altBoundary: altBoundary
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var data = {
      x: 0,
      y: 0
    };

    if (!popperOffsets) {
      return;
    }

    if (checkMainAxis || checkAltAxis) {
      var mainSide = mainAxis === 'y' ? top : left;
      var altSide = mainAxis === 'y' ? bottom : right;
      var len = mainAxis === 'y' ? 'height' : 'width';
      var offset = popperOffsets[mainAxis];
      var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
      var max$1 = popperOffsets[mainAxis] - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
      // outside the reference bounds

      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
      // to include its full size in the calculation. If the reference is small
      // and near the edge of a boundary, the popper can overflow even if the
      // reference is not overflowing as well (e.g. virtual elements with no
      // width or height)

      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
      var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

      if (checkMainAxis) {
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  var preventOverflow$1 = {
    name: 'preventOverflow',
    enabled: true,
    phase: 'main',
    fn: preventOverflow,
    requiresIfExists: ['offset']
  };

  /**
   * Retrieves the current horizontal and vertical scroll positions of a given HTML element.
   *
   * @param {HTMLElement} element - The HTML element whose scroll positions are to be retrieved.
   * @returns {{ scrollLeft: number, scrollTop: number }} An object containing the scrollLeft and scrollTop properties,
   *          representing the horizontal and vertical scroll positions, respectively.
   *
   * @throws {TypeError} Throws an error if the provided element is not an instance of HTMLElement.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const scrollPositions = getHTMLElementScroll(element);
   * console.log(scrollPositions.scrollLeft, scrollPositions.scrollTop);
   */
  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  /**
   * Retrieves the current scroll position of a given node.
   *
   * This function checks if the provided node is a window or an HTML element.
   * If the node is a window, it calls a function to get the window's scroll position.
   * If the node is an HTML element, it retrieves the scroll position specific to that element.
   *
   * @param {Node} node - The node for which to get the scroll position. This can be either a window or an HTML element.
   * @returns {Object} An object containing the scroll position with `top` and `left` properties.
   *
   * @throws {TypeError} Throws an error if the provided node is not a valid Node.
   *
   * @example
   * const scrollPosition = getNodeScroll(document.getElementById('myElement'));
   * console.log(scrollPosition); // { top: 100, left: 50 }
   */
  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }

  /**
   * Determines whether a given HTML element is scaled in the browser.
   *
   * This function checks the scaling of an element by comparing its
   * bounding rectangle dimensions with its offset dimensions. If the
   * width or height of the bounding rectangle differs from the offset
   * width or height, the element is considered to be scaled.
   *
   * @param {HTMLElement} element - The HTML element to check for scaling.
   * @returns {boolean} Returns true if the element is scaled, false otherwise.
   *
   * @throws {TypeError} Throws an error if the provided parameter is not an
   *                     instance of HTMLElement.
   *
   * @example
   * const myElement = document.getElementById('myElement');
   * const isScaled = isElementScaled(myElement);
   * console.log(isScaled); // Outputs true or false based on the scaling state.
   */
  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = rect.width / element.offsetWidth || 1;
    var scaleY = rect.height / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  } // Returns the composite rect of an element relative to its offsetParent.
  // Composite means it takes into account transforms as well as layout.


  /**
   * Calculates the composite rectangle of a given element or virtual element
   * relative to a specified offset parent, taking into account any scrolling
   * and offsets.
   *
   * @param {HTMLElement|VirtualElement} elementOrVirtualElement - The element or virtual element
   *        for which the composite rectangle is to be calculated.
   * @param {HTMLElement|Window} offsetParent - The offset parent element relative to which the
   *        rectangle is calculated. This can be an HTML element or the window object.
   * @param {boolean} [isFixed=false] - A flag indicating whether the element is fixed positioned.
   *        Defaults to false.
   *
   * @returns {{x: number, y: number, width: number, height: number}} The composite rectangle
   *          containing the x and y coordinates, width, and height of the element.
   *
   * @throws {TypeError} Throws an error if the provided elementOrVirtualElement is not a valid
   *         HTMLElement or VirtualElement.
   *
   * @example
   * const rect = getCompositeRect(myElement, myOffsetParent);
   * console.log(rect); // { x: 100, y: 200, width: 50, height: 100 }
   */
  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }

    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };

    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  /**
   * Orders an array of modifiers based on their dependencies.
   * This function takes into account the dependencies specified in each modifier
   * and returns a sorted array where each modifier appears before its dependencies.
   *
   * @param {Array<Object>} modifiers - An array of modifier objects to be ordered.
   * Each modifier object should have the following properties:
   *   - {string} name - The name of the modifier.
   *   - {Array<string>} [requires] - An array of names of modifiers that this modifier requires.
   *   - {Array<string>} [requiresIfExists] - An array of names of modifiers that this modifier requires if they exist.
   *
   * @returns {Array<Object>} The ordered array of modifiers, with dependencies resolved.
   *
   * @throws {Error} Throws an error if a dependency is not found in the provided modifiers.
   *
   * @example
   * const modifiers = [
   *   { name: 'modifierA', requires: ['modifierB'] },
   *   { name: 'modifierB', requires: [] },
   *   { name: 'modifierC', requires: ['modifierA'] }
   * ];
   *
   * const orderedModifiers = order(modifiers);
   * // orderedModifiers will be in the order: [modifierB, modifierA, modifierC]
   */
  function order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function (modifier) {
      map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively

    /**
     * Recursively sorts modifiers based on their dependencies.
     *
     * This function takes a modifier object and processes its dependencies,
     * ensuring that each dependency is visited only once. The sorted
     * modifiers are accumulated in a result array.
     *
     * @param {Object} modifier - The modifier object to be sorted.
     * @param {string} modifier.name - The name of the modifier.
     * @param {Array<string>} [modifier.requires] - An array of required dependencies.
     * @param {Array<string>} [modifier.requiresIfExists] - An array of optional dependencies.
     *
     * @throws {Error} Throws an error if the modifier is not defined or if
     *                 there are circular dependencies detected.
     *
     * @example
     * const myModifier = {
     *   name: 'myModifier',
     *   requires: ['dependency1', 'dependency2'],
     *   requiresIfExists: ['optionalDependency']
     * };
     * sort(myModifier);
     */
    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function (dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);

          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }

    modifiers.forEach(function (modifier) {
      if (!visited.has(modifier.name)) {
        // check for visited object
        sort(modifier);
      }
    });
    return result;
  }

  /**
   * Orders the given array of modifiers based on their dependencies and phases.
   *
   * This function first orders the modifiers according to their dependencies using the
   * `order` function. It then organizes the ordered modifiers into an array that groups
   * them by their respective phases, as defined in the `modifierPhases` array.
   *
   * @param {Array} modifiers - An array of modifier objects to be ordered. Each modifier
   *                            should have a `phase` property indicating its phase.
   * @returns {Array} An array of modifiers ordered by their phases.
   *
   * @example
   * const modifiers = [
   *   { phase: 'start', ... },
   *   { phase: 'end', ... },
   *   { phase: 'start', ... }
   * ];
   * const ordered = orderModifiers(modifiers);
   * // ordered will contain modifiers grouped by their phases.
   *
   * @throws {TypeError} Throws an error if the input is not an array.
   */
  function orderModifiers(modifiers) {
    // order based on dependencies
    var orderedModifiers = order(modifiers); // order based on phase

    return modifierPhases.reduce(function (acc, phase) {
      return acc.concat(orderedModifiers.filter(function (modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }

  /**
   * Creates a debounced version of the provided function. The debounced function will delay
   * the execution of the original function until after a specified time has elapsed since
   * the last time it was invoked. This is useful for limiting the rate at which a function
   * can fire, such as in response to user input events.
   *
   * @param {Function} fn - The function to debounce.
   * @returns {Function} A new debounced function that, when invoked, will delay the execution
   * of the original function until after the specified wait time has passed.
   *
   * @example
   * const saveInput = debounce(() => {
   *   console.log('Input saved!');
   * });
   *
   * // Calling saveInput multiple times in quick succession will only log 'Input saved!' once,
   * // after the calls have stopped for a brief period.
   *
   * @throws {TypeError} Throws an error if the provided argument is not a function.
   */
  function debounce(fn) {
    var pending;
    return function () {
      if (!pending) {
        pending = new Promise(function (resolve) {
          Promise.resolve().then(function () {
            pending = undefined;
            resolve(fn());
          });
        });
      }

      return pending;
    };
  }

  /**
   * Merges an array of modifier objects by their name property.
   * If multiple modifiers have the same name, their properties are combined.
   * The options and data properties of the modifiers are merged as well.
   *
   * @param {Array<Object>} modifiers - An array of modifier objects to be merged.
   * Each object should have a 'name' property, along with 'options' and 'data' properties.
   *
   * @returns {Array<Object>} An array of merged modifier objects, with unique names.
   *
   * @example
   * const modifiers = [
   *   { name: 'modifier1', options: { a: 1 }, data: { b: 2 } },
   *   { name: 'modifier1', options: { c: 3 }, data: { d: 4 } },
   *   { name: 'modifier2', options: { e: 5 }, data: { f: 6 } }
   * ];
   * const result = mergeByName(modifiers);
   * // result will be:
   * // [
   * //   { name: 'modifier1', options: { a: 1, c: 3 }, data: { b: 2, d: 4 } },
   * //   { name: 'modifier2', options: { e: 5 }, data: { f: 6 } }
   * // ]
   *
   * @throws {TypeError} Throws an error if the input is not an array of objects.
   */
  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function (merged, current) {
      var existing = merged[current.name];
      merged[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged;
    }, {}); // IE11 does not support Object.values

    return Object.keys(merged).map(function (key) {
      return merged[key];
    });
  }

  var DEFAULT_OPTIONS = {
    placement: 'bottom',
    modifiers: [],
    strategy: 'absolute'
  };

  /**
   * Checks if all provided elements are valid DOM elements.
   *
   * A valid DOM element is defined as an object that is not null or undefined
   * and has a method `getBoundingClientRect`. This function takes a variable
   * number of arguments, which are expected to be DOM elements.
   *
   * @param {...*} args - The elements to be validated.
   * @returns {boolean} Returns true if all elements are valid, otherwise false.
   *
   * @example
   * const div = document.createElement('div');
   * const isValid = areValidElements(div, null, document.body); // returns false
   *
   * @throws {TypeError} Throws a TypeError if any argument is not an object.
   */
  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.some(function (element) {
      return !(element && typeof element.getBoundingClientRect === 'function');
    });
  }

  /**
   * Creates a popper instance that manages the positioning of a popper element
   * relative to a reference element.
   *
   * @param {Object} [generatorOptions={}] - Options for configuring the popper instance.
   * @param {Array} [generatorOptions.defaultModifiers=[]] - An array of default modifiers to apply.
   * @param {Object} [generatorOptions.defaultOptions=DEFAULT_OPTIONS] - Default options for the popper instance.
   *
   * @returns {function} A function that creates a popper instance.
   *
   * @example
   * const createPopper = popperGenerator({
   *   defaultModifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
   *   defaultOptions: { placement: 'top' }
   * });
   *
   * const popperInstance = createPopper(referenceElement, popperElement, {
   *   onFirstUpdate: (state) => {
   *     console.log('Popper updated:', state);
   *   }
   * });
   */
  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }

    var _generatorOptions = generatorOptions,
        _generatorOptions$def = _generatorOptions.defaultModifiers,
        defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
        _generatorOptions$def2 = _generatorOptions.defaultOptions,
        defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions;
      }

      var state = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference,
          popper: popper
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state: state,
        setOptions: function setOptions(options) {
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions, state.options, options);
          state.scrollParents = {
            reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
            popper: listScrollParents(popper)
          }; // Orders the modifiers based on their dependencies and `phase`
          // properties

          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

          state.orderedModifiers = orderedModifiers.filter(function (m) {
            return m.enabled;
          }); // Validate the provided modifiers so that the consumer will get warned

          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }

          var _state$elements = state.elements,
              reference = _state$elements.reference,
              popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
          // anymore

          if (!areValidElements(reference, popper)) {

            return;
          } // Store the reference and popper rects to be read by modifiers


          state.rects = {
            reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
            popper: getLayoutRect(popper)
          }; // Modifiers have the ability to reset the current update cycle. The
          // most common use case for this is the `flip` modifier changing the
          // placement, which then needs to re-run all the modifiers, because the
          // logic was previously ran for the previous placement and is therefore
          // stale/incorrect

          state.reset = false;
          state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
          // is filled with the initial data specified by the modifier. This means
          // it doesn't persist and is fresh on each update.
          // To ensure persistent data, use `${name}#persistent`

          state.orderedModifiers.forEach(function (modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });

          for (var index = 0; index < state.orderedModifiers.length; index++) {

            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }

            var _state$orderedModifie = state.orderedModifiers[index],
                fn = _state$orderedModifie.fn,
                _state$orderedModifie2 = _state$orderedModifie.options,
                _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                name = _state$orderedModifie.name;

            if (typeof fn === 'function') {
              state = fn({
                state: state,
                options: _options,
                name: name,
                instance: instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce(function () {
          return new Promise(function (resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };

      if (!areValidElements(reference, popper)) {

        return instance;
      }

      instance.setOptions(options).then(function (state) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state);
        }
      }); // Modifiers have the ability to execute arbitrary code before the first
      // update cycle runs. They will be executed in the same order as the update
      // cycle. This is useful when a modifier adds some persistent data that
      // other modifiers need to use, but the modifier is run after the dependent
      // one.

      /**
       * Executes the effects of all ordered modifiers in the current state.
       * For each modifier, if an effect function is defined, it is called with
       * the current state, modifier name, instance, and options. The cleanup
       * function returned by the effect is stored for later use.
       *
       * @function runModifierEffects
       * @returns {void} This function does not return a value.
       *
       * @throws {TypeError} Throws an error if the effect is not a function.
       *
       * @example
       * // Assuming state and instance are defined and populated
       * runModifierEffects();
       */
      function runModifierEffects() {
        state.orderedModifiers.forEach(function (_ref3) {
          var name = _ref3.name,
              _ref3$options = _ref3.options,
              options = _ref3$options === void 0 ? {} : _ref3$options,
              effect = _ref3.effect;

          if (typeof effect === 'function') {
            var cleanupFn = effect({
              state: state,
              name: name,
              instance: instance,
              options: options
            });

            var noopFn = function noopFn() {};

            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }

      /**
       * Cleans up all modifier effects by invoking their respective cleanup functions.
       * This function iterates over an array of cleanup functions and executes each one,
       * ensuring that any resources or effects created by modifiers are properly released.
       * After execution, the array of cleanup functions is reset to an empty array.
       *
       * @throws {Error} Throws an error if any cleanup function fails during execution.
       *
       * @example
       * // Assuming effectCleanupFns contains functions to clean up effects
       * cleanupModifierEffects();
       * // All effects will be cleaned up and effectCleanupFns will be empty.
       */
      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function (fn) {
          return fn();
        });
        effectCleanupFns = [];
      }

      return instance;
    };
  }
  var createPopper$2 = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules

  var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
  var createPopper$1 = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers$1
  }); // eslint-disable-next-line import/no-unused-modules

  var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
  var createPopper = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers
  }); // eslint-disable-next-line import/no-unused-modules

  var Popper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    popperGenerator: popperGenerator,
    detectOverflow: detectOverflow,
    createPopperBase: createPopper$2,
    createPopper: createPopper,
    createPopperLite: createPopper$1,
    top: top,
    bottom: bottom,
    right: right,
    left: left,
    auto: auto,
    basePlacements: basePlacements,
    start: start,
    end: end,
    clippingParents: clippingParents,
    viewport: viewport,
    popper: popper,
    reference: reference,
    variationPlacements: variationPlacements,
    placements: placements,
    beforeRead: beforeRead,
    read: read,
    afterRead: afterRead,
    beforeMain: beforeMain,
    main: main,
    afterMain: afterMain,
    beforeWrite: beforeWrite,
    write: write,
    afterWrite: afterWrite,
    modifierPhases: modifierPhases,
    applyStyles: applyStyles$1,
    arrow: arrow$1,
    computeStyles: computeStyles$1,
    eventListeners: eventListeners,
    flip: flip$1,
    hide: hide$1,
    offset: offset$1,
    popperOffsets: popperOffsets$1,
    preventOverflow: preventOverflow$1
  });

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
        Manipulator.setDataAttribute(this._menu, 'popper', 'none');
      } else {
        this._createPopper(parent);
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
        [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      this._menu.classList.add(CLASS_NAME_SHOW$6);

      this._element.classList.add(CLASS_NAME_SHOW$6);

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

      if (typeof config.reference === 'object' && !isElement$1(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
        // Popper virtual elements require a getBoundingClientRect method
        throw new TypeError(`${NAME$9.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
      }

      return config;
    }

    _createPopper(parent) {
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
      }

      let referenceElement = this._element;

      if (this._config.reference === 'parent') {
        referenceElement = parent;
      } else if (isElement$1(this._config.reference)) {
        referenceElement = getElement(this._config.reference);
      } else if (typeof this._config.reference === 'object') {
        referenceElement = this._config.reference;
      }

      const popperConfig = this._getPopperConfig();

      const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
      this._popper = createPopper(referenceElement, this._menu, popperConfig);

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
    }

    _selectMenuItem({
      key,
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

        /**
         * Toggles the visibility of an element.
         * If the element is currently shown, it will be hidden;
         * if it is hidden, it will be shown.
         *
         * @returns {boolean} Returns true if the element is now shown,
         *                    and false if it is now hidden.
         *
         * @throws {Error} Throws an error if the visibility state cannot be determined.
         *
         * @example
         * const visibilityState = toggle();
         * console.log(visibilityState); // Outputs: true or false based on the new state
         */
        if (typeof config !== 'string') {
          return;
        }

        /**
         * Displays the dropdown menu associated with the element.
         *
         * This method checks if the dropdown is disabled or already shown. If not, it triggers a show event,
         * sets the necessary attributes, and manages the visibility of the dropdown menu.
         *
         * @throws {Error} Throws an error if the element is not properly initialized.
         *
         * @example
         * const dropdown = new Dropdown(element);
         * dropdown.show();
         */
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
          continue;
        }

        if (!context._isShown()) {
          continue;
        }

        const relatedTarget = {
          relatedTarget: context._element
        };

        if (event) {
          const composedPath = event.composedPath();
          const isMenuTarget = composedPath.includes(context._menu);

          if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
            continue;
          } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


          if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
            continue;
          /**
           * Hides the associated menu element if it is currently shown and not disabled.
           *
           * This method checks if the element is disabled or if the menu is not shown.
           * If either condition is true, the method exits without performing any action.
           * If the menu is shown, it triggers the hiding process by calling the
           * `_completeHide` method with a related target object containing the
           * current element.
           *
           * @throws {Error} Throws an error if the hiding process fails.
           *
           * @example
           * const menu = new Menu();
           * menu.hide(); // Hides the menu if it is currently shown and enabled.
           */
          }

          if (event.type === 'click') {
            relatedTarget.clickEvent = event;
          }
        }

        context._completeHide(relatedTarget);
      }
    }

    static getParentFromElement(element) {
      /**
       * Cleans up and releases resources associated with the instance.
       * This method checks if a popper instance exists and destroys it if so.
       * It then calls the superclass's dispose method to ensure proper cleanup.
       *
       * @throws {Error} Throws an error if the popper instance cannot be destroyed.
       *
       * @example
       * const instance = new MyClass();
       * instance.dispose(); // Cleans up resources and destroys the popper if it exists.
       */
      return getElementFromSelector(element) || element.parentNode;
    }

    static dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      /**
       * Updates the state of the component, specifically checking for changes in the navigation bar
       * and refreshing the popper instance if it exists.
       *
       * This method performs the following actions:
       * - Detects if the component is currently in a navigation bar.
       * - If a popper instance is present, it calls the update method on that instance to refresh its position.
       *
       * @throws {Error} Throws an error if the popper instance is not properly initialized.
       *
       * @example
       * const component = new SomeComponent();
       * component.update(); // Updates the component state and popper position if applicable.
       */
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
        return;
      }

      const isActive = this.classList.contains(CLASS_NAME_SHOW$6);

      /**
       * Hides the associated menu and cleans up related event listeners.
       *
       * This method triggers a hide event, checks if the event is prevented,
       * and if not, it proceeds to remove any mouseover event listeners
       * added for touch-enabled devices. It also destroys the popper instance
       * if it exists, removes the show class from the menu and element,
       * updates the aria-expanded attribute, and triggers a hidden event.
       *
       * @param {Element} relatedTarget - The element that triggered the hide action.
       * @throws {Error} Throws an error if the element is not valid or if
       *                 there are issues during event handling.
       *
       * @example
       * // Example usage:
       * const menuElement = document.getElementById('myMenu');
       * const relatedElement = document.getElementById('relatedElement');
       * _completeHide.call(menuElement, relatedElement);
       */
      if (!isActive && event.key === ESCAPE_KEY$2) {
        return;
      }

      event.preventDefault();
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
        if (!isActive) {
          instance.show();
        }

        instance._selectMenuItem(event);

        return;
      /**
       * Merges the provided configuration object with default settings and data attributes.
       * Validates the configuration options, specifically checking the type of the reference option.
       *
       * @param {Object} config - The configuration object to be merged.
       * @param {Object} [config.reference] - An optional reference element or object.
       *
       * @throws {TypeError} Throws an error if the reference is an object that does not have a
       *                    `getBoundingClientRect` method, which is required for Popper virtual elements.
       *
       * @returns {Object} The merged configuration object.
       *
       * @example
       * const config = _getConfig({
       *   reference: document.querySelector('#myElement')
       * });
       */
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


  /**
   * Creates a Popper instance for the dropdown menu.
   * This method initializes the Popper.js library to manage the positioning of the dropdown menu
   * relative to a reference element. It also handles different types of reference elements based on
   * the configuration provided.
   *
   * @param {Element} parent - The parent element to which the dropdown is attached.
   * @throws {TypeError} Throws an error if Popper.js is not available, indicating that Bootstrap's dropdowns require Popper.
   *
   * @returns {void} This method does not return a value.
   *
   * @example
   * // Assuming 'dropdown' is an instance of a dropdown component
   * dropdown._createPopper(document.querySelector('.dropdown-parent'));
   *
   * @example
   * // If the reference is set to 'parent', it will use the parent element directly.
   * dropdown._config.reference = 'parent';
   * dropdown._createPopper(document.querySelector('.dropdown-parent'));
   *
   * @example
   * // If a specific element is provided as a reference.
   * dropdown._config.reference = '#specific-element';
   * dropdown._createPopper(document.querySelector('.dropdown-parent'));
   */
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    event.preventDefault();
    Dropdown.getOrCreateInstance(this).toggle();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
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
/**
 * Checks if the specified element is currently shown.
 *
 * This method determines whether the given element has the class
 * indicating that it is visible. If no element is provided, it defaults
 * to the instance's internal element.
 *
 * @param {Element} [element=this._element] - The DOM element to check.
 * If not provided, the method will check the instance's internal element.
 *
 * @returns {boolean} Returns true if the element is shown (i.e., has the
 * class indicating visibility), otherwise false.
 *
 * @throws {TypeError} Throws an error if the provided element is not a valid
 * DOM element.
 *
 * @example
 * const isVisible = instance._isShown();
 * console.log(isVisible); // true or false based on visibility
 */

  class ScrollBarHelper {
    constructor() {
      this._element = document.body;
    /**
     * Retrieves the next menu element in the DOM hierarchy relative to the current element.
     *
     * This method utilizes the SelectorEngine to find the next element that matches the
     * specified menu selector. It returns the first matching element found.
     *
     * @returns {Element|null} The next menu element if found; otherwise, null.
     *
     * @throws {Error} Throws an error if the selector is invalid or if there is an issue
     *                 accessing the DOM.
     *
     * @example
     * const menuElement = instance._getMenuElement();
     * if (menuElement) {
     *   console.log('Menu element found:', menuElement);
     * } else {
     *   console.log('No menu element found.');
     * }
     */
    }

    getWidth() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
      /**
       * Determines the placement of a dropdown menu based on its parent element's classes
       * and computed styles.
       *
       * This method checks the parent dropdown's class list to ascertain its position.
       * It evaluates specific classes to return the appropriate placement value for the menu.
       * The placement can be one of the following:
       * - PLACEMENT_RIGHT
       * - PLACEMENT_LEFT
       * - PLACEMENT_TOPEND
       * - PLACEMENT_TOP
       * - PLACEMENT_BOTTOMEND
       * - PLACEMENT_BOTTOM
       *
       * @returns {string} The placement value indicating where the dropdown menu should be positioned.
       *
       * @throws {Error} Throws an error if the parent element does not have a recognized class.
       *
       * @example
       * const placement = instance._getPlacement();
       * console.log(placement); // Outputs the determined placement value.
       */
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    }

    hide() {
      const width = this.getWidth();

      this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


      this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


      this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

      this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
    }

    _disableOverFlow() {
      this._saveInitialAttribute(this._element, 'overflow');

      /**
       * Determines whether the current element is within a navbar.
       *
       * This method checks if the closest ancestor element of the current instance's
       * element matches the specified navbar class. It returns a boolean value indicating
       * the presence of a navbar in the element's hierarchy.
       *
       * @returns {boolean} True if the element is within a navbar; otherwise, false.
       *
       * @example
       * const isInNavbar = instance._detectNavbar();
       * console.log(isInNavbar); // Outputs: true or false based on the element's position.
       */
      this._element.style.overflow = 'hidden';
    }

    _setElementAttributes(selector, styleProp, callback) {
      /**
       * Retrieves the offset configuration for the element.
       *
       * This method checks the type of the offset configuration defined in the
       * instance's configuration. It can return an array of numbers if the
       * offset is specified as a string, or a function that takes popper data
       * and returns an offset based on that data.
       *
       * @returns {number[]|Function}
       *   - If the offset is a string, returns an array of integers parsed from the string.
       *   - If the offset is a function, returns the function itself.
       *   - If the offset is neither, returns the offset directly.
       *
       * @throws {TypeError}
       *   Throws an error if the offset is of an unsupported type.
       *
       * @example
       * // Example of using _getOffset with a string offset
       * const offsetArray = instance._getOffset(); // returns [10, 20]
       *
       * @example
       * // Example of using _getOffset with a function offset
       * const offsetFunction = instance._getOffset(); // returns a function
       */
      const scrollbarWidth = this.getWidth();

      /**
       * A callback function that manipulates the style of a given DOM element based on certain conditions.
       *
       * This function checks if the provided element is not the same as the current element and whether the
       * window's inner width is greater than the element's client width plus the scrollbar width. If these
       * conditions are met, it saves the initial attribute of the element and updates its style property.
       *
       * @param {HTMLElement} element - The DOM element to be manipulated.
       * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
       * @returns {void} This function does not return a value.
       *
       * @example
       * // Example usage of manipulationCallBack
       * manipulationCallBack(document.getElementById('myElement'));
       /**
        * Generates the configuration object for Popper.js based on the current settings.
        * This method constructs a default configuration and modifies it according to the
        * instance's configuration properties.
        *
        * @returns {Object} The Popper configuration object, which includes placement,
        *                   modifiers, and any additional configurations provided by the user.
        *
        * @throws {TypeError} Throws an error if the popperConfig is not a function or an object.
        *
        * @example
        * const config = instance._getPopperConfig();
        * console.log(config);
        *
        * @example
        * // If a custom popperConfig function is provided
        * const customConfig = instance._getPopperConfig();
        * console.log(customConfig);
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
      this._resetElementAttributes(this._element, 'overflow');

      this._resetElementAttributes(this._element, 'paddingRight');

      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
    }

    _saveInitialAttribute(element, styleProp) {
      const actualValue = element.style[styleProp];

      /**
       * Selects the next menu item based on the provided key and target element.
       *
       * This method filters the visible items in the menu and determines the next active element
       * to focus on based on the key pressed (either ARROW_DOWN_KEY or ARROW_UP_KEY).
       * If there are no visible items, the method returns early without making any changes.
       *
       * @param {Object} options - The options for selecting the menu item.
       * @param {string} options.key - The key that was pressed (e.g., ARROW_DOWN_KEY or ARROW_UP_KEY).
       * @param {Element} options.target - The current target element that is focused.
       *
       * @returns {void} This method does not return a value.
       *
       * @throws {Error} Throws an error if the target is not a valid menu item.
       *
       * @example
       * // Example usage:
       * _selectMenuItem({ key: ARROW_DOWN_KEY, target: currentFocusedElement });
       */
      if (actualValue) {
        Manipulator.setDataAttribute(element, styleProp, actualValue);
      }
    }

    _resetElementAttributes(selector, styleProp) {
      /**
       * A callback function that manipulates the style of a given HTML element
       * based on its data attribute.
       *
       * This function retrieves the value of a specified data attribute from the
       * element. If the value is undefined, it removes the corresponding CSS
       * property from the element's style. Otherwise, it removes the data attribute
       * and sets the CSS property to the retrieved value.
       *
       * @param {HTMLElement} element - The HTML element to manipulate.
       /**
        * Initializes or invokes a method on the Dropdown instance for each element in the jQuery collection.
        *
        * This method acts as an interface to manage Dropdown instances. It can either create a new instance
        * with the provided configuration or call an existing method on the instance if a string is passed.
        *
        * @static
        * @param {Object|string} config - The configuration object for creating a new Dropdown instance,
        *                                  or a string representing the method name to invoke on the instance.
        * @returns {jQuery} The jQuery collection for chaining.
        * @throws {TypeError} Throws an error if the provided config is a string and does not correspond to
        *                     an existing method on the Dropdown instance.
        *
        * @example
        * // To create a new Dropdown instance with default settings
        * $('.dropdown').jQueryInterface({});
        *
        * // To invoke a specific method on the Dropdown instance
        * $('.dropdown').jQueryInterface('toggle');
        */
       * @throws {TypeError} Throws an error if the provided element is not an
       *                     instance of HTMLElement.
       *
       * @example
       * // Example usage:
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
        /**
         * Closes all open dropdown menus based on the provided event.
         * This method checks the event type and conditions to determine
         * whether to close the dropdown menus or not.
         *
         * @static
         * @param {Event} event - The event that triggered the menu closure.
         *                        It can be a mouse click or a keyboard event.
         *                        If the event is a right-click or a keyup event
         *                        with the TAB key, the menus will not be closed.
         * @returns {void}
         *
         * @throws {TypeError} Throws an error if the event is not of type Event.
         *
         * @example
         * // Example usage of clearMenus method
         * document.addEventListener('click', clearMenus);
         * document.addEventListener('keyup', clearMenus);
         */
        }
      };

      this._applyManipulationCallback(selector, manipulationCallBack);
    }

    _applyManipulationCallback(selector, callBack) {
      if (isElement$1(selector)) {
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
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
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
  /**
   * Retrieves the parent element of a given DOM element.
   * If the element has a selector associated with it, that element will be returned.
   * Otherwise, the immediate parent node of the element will be returned.
   *
   * @param {Element} element - The DOM element from which to retrieve the parent.
   * @returns {Element} The parent element or the element itself if no parent exists.
   *
   * @throws {TypeError} Throws an error if the provided argument is not a valid DOM element.
   *
   * @example
   * const parent = getParentFromElement(document.getElementById('child'));
   * console.log(parent); // Logs the parent element of the child or the child itself if no parent exists.
   */
  const CLASS_NAME_SHOW$5 = 'show';
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$8}`;

  class Backdrop {
    /**
     * Handles keydown events for dropdown menus. This method determines whether to show or hide the dropdown
     * based on the key pressed and the current state of the dropdown.
     *
     * @static
     * @param {KeyboardEvent} event - The keyboard event triggered by the user.
     *
     * @returns {void}
     *
     * @throws {Error} Throws an error if the event target is not a valid input or textarea and the key pressed
     *                 does not match the expected keys for dropdown commands.
     *
     * @example
     * // Example usage:
     * document.addEventListener('keydown', dataApiKeydownHandler);
     *
     * // The function will handle the keydown event and manage dropdown visibility
     * // based on the key pressed (e.g., ESC, ARROW_UP, ARROW_DOWN).
     *
     * @description
     * The function checks if the event target is an input or textarea. If it is, it handles specific keys:
     * - If the space key is pressed, it does not trigger a dropdown command.
     * - If the escape key is pressed, it hides the dropdown if it is active.
     * - If arrow keys are pressed, it selects a menu item or shows the dropdown if it is not active.
     *
     * If the target is not an input or textarea, it checks against a regular expression to determine if
     * the key pressed is a valid dropdown command. The function also prevents default actions and stops
     * propagation of the event when necessary.
     */
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
    }

    _append() {
      if (this._isAppended) {
        return;
      }

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

      EventHandler.off(this._element, EVENT_MOUSEDOWN);

      this._element.remove();

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
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes}
       */
      this._isAppended = false;
    }

    _emulateAnimation(callback) {
      executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
    }
/**
 * Hides the element by adjusting its overflow and padding/margin attributes.
 * This method calculates the width of the element and applies necessary
 * adjustments to ensure that the layout remains consistent when the
 * element is hidden.
 *
 * It performs the following operations:
 * - Disables overflow on the element to prevent scrollbar visibility.
 * - Adjusts the `paddingRight` of the main element and fixed content
 *   to account for the hidden scrollbar width.
 * - Modifies the `marginRight` of sticky content to maintain full width
 *   visibility.
 *
 * @throws {Error} Throws an error if the element's width cannot be
 *                 determined or if there are issues applying styles.
 *
 * @example
 * const myElement = new MyElement();
 * myElement.hide(); // Hides the element and adjusts layout accordingly.
 */

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
  };
  /**
   * Disables the overflow of the associated element by setting its
   * CSS overflow property to 'hidden'.
   *
   * This method first saves the initial overflow attribute of the
   * element, allowing for potential restoration later if needed.
   *
   * @method _disableOverFlow
   * @private
   * @returns {void}
   *
   * @throws {Error} Throws an error if the element is not defined or
   *                if the operation fails.
   *
   * @example
   * // Example usage:
   * instance._disableOverFlow();
   */
  const DefaultType$6 = {
    trapElement: 'element',
    autofocus: 'boolean'
  };
  const NAME$7 = 'focustrap';
  const DATA_KEY$7 = 'bs.focustrap';
  /**
   * Sets the specified style property for elements matching the given selector,
   * applying a transformation to the current computed value of the property.
   *
   * @param {string} selector - A CSS selector string to match elements.
   * @param {string} styleProp - The CSS style property to be modified.
   * @param {function} callback - A function that takes the current value of the style property
   *                              (as a number) and returns a new value.
   *
   * @throws {Error} Throws an error if the selector does not match any elements.
   *
   * @example
   * // Example usage to set the width of elements with class 'box' to double their current width
   * _setElementAttributes('.box', 'width', currentValue => currentValue * 2);
   */
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$7}`;
  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7}`;
  const TAB_KEY = 'Tab';
  const TAB_NAV_FORWARD = 'forward';
  const TAB_NAV_BACKWARD = 'backward';

  class FocusTrap {
    constructor(config) {
      this._config = this._getConfig(config);
      this._isActive = false;
      this._lastTabNavDirection = null;
    }

    activate() {
      const {
        trapElement,
        /**
         * Resets specific CSS properties of the element and its related content.
         *
         * This method is responsible for restoring the default values of certain
         * CSS attributes to ensure that the layout behaves as expected. It targets
         * the overflow and paddingRight properties of the main element, as well as
         * the marginRight property of sticky content.
         *
         * @throws {Error} Throws an error if the element or selectors are not defined.
         *
         * @example
         * const instance = new SomeClass();
         * instance.reset();
         * // This will reset the overflow and paddingRight of the main element,
         * // and marginRight of the sticky content.
         */
        autofocus
      } = this._config;

      if (this._isActive) {
        return;
      }

      if (autofocus) {
        trapElement.focus();
      }
/**
 * Saves the initial value of a specified CSS style property from a given element.
 *
 * This method retrieves the current value of the specified style property from the element's
 * inline styles and stores it in a data attribute using the Manipulator utility.
 *
 * @param {HTMLElement} element - The DOM element from which to retrieve the style property.
 * @param {string} styleProp - The name of the CSS style property to be saved.
 *
 * @returns {void} This method does not return a value.
 *
 * @example
 * const divElement = document.getElementById('myDiv');
 * _saveInitialAttribute(divElement, 'backgroundColor');
 *
 * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
 */

      EventHandler.off(document, EVENT_KEY$7); // guard against infinite focus loop

      EventHandler.on(document, EVENT_FOCUSIN$1, event => this._handleFocusin(event));
      EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
      this._isActive = true;
    }

    /**
     * Resets the specified CSS property of elements selected by the given selector.
     * If the property has a corresponding data attribute, it applies that value;
     * otherwise, it removes the property from the element's style.
     *
     * @param {string} selector - A string representing the selector for the elements to manipulate.
     * @param {string} styleProp - The CSS property to reset on the selected elements.
     *
     * @throws {Error} Throws an error if the selector is invalid or if manipulation fails.
     *
     * @example
     * // Reset the 'color' property for all elements with the class 'text'
     * _resetElementAttributes('.text', 'color');
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
        /**
         * Applies a manipulation callback to a specified selector.
         * If the selector is a valid DOM element, the callback is executed directly on it.
         * Otherwise, the selector is used to find elements within the context of the current element,
         * and the callback is executed on each found element.
         *
         * @param {string|Element} selector - The selector string or DOM element to which the callback will be applied.
         * @param {Function} callBack - The function to execute on the selected element(s).
         *
         * @throws {TypeError} Throws an error if the selector is not a string or an Element.
         *
         * @example
         * // Example usage with a valid DOM element
         * _applyManipulationCallback(document.getElementById('myElement'), (el) => {
         *   el.style.color = 'red';
         * });
         *
         * // Example usage with a selector string
         * _applyManipulationCallback('.myClass', (el) => {
         *   el.style.backgroundColor = 'blue';
         * });
         */
        trapElement
      } = this._config;

      if (target === document || target === trapElement || trapElement.contains(target)) {
        return;
      }

      const elements = SelectorEngine.focusableChildren(trapElement);
/**
 * Determines if the current width is greater than zero.
 *
 * This method checks if the width of the current instance is greater than zero,
 * indicating whether it is overflowing or not.
 *
 * @returns {boolean} Returns true if the width is greater than zero, otherwise false.
 *
 * @example
 * const instance = new SomeClass();
 * if (instance.isOverflowing()) {
 *   console.log('The instance is overflowing.');
 * } else {
 *   console.log('The instance is not overflowing.');
 * }
 */

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
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  /**
   * Displays the element by appending it to the DOM and applying the necessary animations.
   * If the element is already visible, the callback is executed immediately.
   *
   * @param {Function} callback - The function to be executed after the element is shown.
   * @throws {Error} Throws an error if the callback is not a function.
   *
   * @example
   * // Example usage of the show method
   * instance.show(() => {
   *   console.log('Element is now visible');
   * });
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
  const DefaultType$5 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean'
  };
  const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
  /**
   * Hides the element associated with the current instance.
   *
   * This method removes the visible class from the element and
   * triggers an animation to emulate the hiding effect. Once the
   * animation is complete, it disposes of the instance and executes
   * the provided callback function.
   *
   * @param {Function} callback - A function to be executed after the
   * element has been hidden and disposed of.
   *
   * @throws {Error} Throws an error if the element is not currently visible.
   *
   * @example
   * instance.hide(() => {
   *   console.log('Element has been hidden.');
   * });
   */
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$6}`;
  const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_SHOW$4 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  /**
   /**
    * Retrieves the backdrop element for the component. If the element does not
    * already exist, it creates a new one with the specified configuration.
    *
    * @returns {HTMLElement} The backdrop element associated with the component.
    *
    * @throws {Error} Throws an error if the element cannot be created due to
    *                 invalid configuration or other issues.
    *
    * @example
    * const element = instance._getElement();
    * console.log(element); // Logs the backdrop element to the console.
    */
   * ------------------------------------------------------------------------
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
      this._isTransitioning = false;
      /**
       * Retrieves and merges the configuration object with default settings.
       *
       * This function takes a configuration object as input and merges it with
       * the default configuration. If the provided configuration is not an object,
       * it defaults to an empty object. The root element is resolved using the
       * `getElement` function, ensuring that a fresh element is obtained for each
       * instantiation. The resulting configuration is then validated against
       * expected types.
       *
       * @param {Object} config - The configuration object to be merged with defaults.
       * @param {string} [config.rootElement] - The root element to be used in the configuration.
       *
       * @returns {Object} The merged configuration object.
       *
       * @throws {TypeError} Throws an error if the provided config does not match the expected types.
       *
       * @example
       * const userConfig = { rootElement: '#app' };
       * const finalConfig = _getConfig(userConfig);
       * // finalConfig will be an object containing properties from both userConfig and defaults.
       */
      this._scrollBar = new ScrollBarHelper();
    } // Getters


    static get Default() {
      return Default$5;
    }

    static get NAME() {
      return NAME$6;
    /**
     * Appends the element to the root element if it has not been appended yet.
     * This method also sets up an event listener for mouse down events on the
     * appended element, which triggers a specified callback function.
     *
     * @throws {Error} Throws an error if the root element is not defined in the configuration.
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * // Assuming `instance` is an instance of the class containing this method
     * instance._append();
     *
     * // This will append the element and set up the event listener.
     */
    } // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        /**
         * Cleans up and removes the element from the DOM.
         * This method should be called when the element is no longer needed.
         * It ensures that event listeners are properly removed and the element is detached.
         *
         * @throws {Error} Throws an error if the element is not appended to the DOM.
         *
         * @example
         * const instance = new MyClass();
         * instance.dispose();
         */
        relatedTarget
      });

      if (showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;

      if (this._isAnimated()) {
        this._isTransitioning = true;
      }
/**
 * Emulates an animation by executing a callback function after a transition.
 *
 * This method ensures that the provided callback is called only after the
 * transition has completed, allowing for smooth animations and interactions.
 *
 * @param {Function} callback - The function to be executed after the transition.
 *
 * @throws {Error} Throws an error if the callback is not a function.
 *
 * @returns {void}
 *
 * @example
 * // Example usage of _emulateAnimation
 * this._emulateAnimation(() => {
 *   console.log('Animation completed!');
 * });
 */

      this._scrollBar.hide();

      document.body.classList.add(CLASS_NAME_OPEN);

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
        EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
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

      const isAnimated = this._isAnimated();

      /**
       * Activates the focus trap functionality.
       *
       * This method sets up event listeners to manage focus within a specified
       * element, preventing focus from leaving that element while it is active.
       * It also handles autofocus if specified in the configuration.
       *
       * @throws {Error} Throws an error if the activation process fails.
       *
       * @example
       * const trap = new FocusTrap(config);
       * trap.activate();
       */
      if (isAnimated) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      this._focustrap.deactivate();

      this._element.classList.remove(CLASS_NAME_SHOW$4);

      EventHandler.off(this._element, EVENT_CLICK_DISMISS);
      EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

      this._queueCallback(() => this._hideModal(), this._element, isAnimated);
    }

    dispose() {
      [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));

      /**
       * Deactivates the current instance, setting its active state to false.
       * If the instance is already inactive, the method will return early without making any changes.
       *
       * @throws {Error} Throws an error if the deactivation process encounters an unexpected issue.
       *
       * @example
       * const instance = new MyClass();
       * instance.deactivate(); // Deactivates the instance if it is active.
       */
      this._backdrop.dispose();

      this._focustrap.deactivate();

      super.dispose();
    }

    handleUpdate() {
      this._adjustDialog();
    } // Private
/**
 * Handles the focus-in event for a specific element.
 * This method ensures that focus is managed correctly within a designated
 * focus trap element, allowing for keyboard navigation and accessibility.
 *
 * @param {Event} event - The focus-in event triggered by user interaction.
 * @param {HTMLElement} event.target - The element that triggered the event.
 *
 * @returns {void} This method does not return a value.
 *
 * @throws {TypeError} Throws an error if the event or target is invalid.
 *
 * @example
 * // Example usage of the _handleFocusin method
 * const focusTrap = new FocusTrap(config);
 * document.addEventListener('focusin', (event) => focusTrap._handleFocusin(event));
 */


    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        // 'static' option will be translated to true, and booleans will keep their value
        isAnimated: this._isAnimated()
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
    /**
     * Handles the keydown event for tab navigation.
     *
     * This method checks if the pressed key is the Tab key. If it is, it updates the
     * navigation direction based on whether the Shift key is also pressed.
     * The navigation direction can be either forward or backward.
     *
     * @param {KeyboardEvent} event - The keyboard event object containing information
     * about the key that was pressed.
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * // Example usage in an event listener
     * document.addEventListener('keydown', this._handleKeydown.bind(this));
     *
     * @throws {Error} Throws an error if the event is not a KeyboardEvent.
     */
    }

    _showElement(relatedTarget) {
      const isAnimated = this._isAnimated();

      const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        /**
         * Merges the provided configuration object with the default configuration.
         * This function ensures that the resulting configuration adheres to the expected types.
         *
         * @param {Object} config - The configuration object to merge with defaults.
         *                           If the provided value is not an object, it will be ignored.
         * @returns {Object} The merged configuration object containing default values
         *                  and any specified overrides from the input config.
         *
         * @throws {TypeError} Throws an error if the provided config does not match
         *                     the expected types defined in DefaultType$6.
         *
         * @example
         * const userConfig = { option1: true, option2: 'custom' };
         * const finalConfig = _getConfig(userConfig);
         * // finalConfig will contain default values for any missing options,
         * // merged with userConfig values.
         */
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
       * This function is responsible for activating focus trapping if the configuration allows it,
       * and it also triggers an event indicating that the transition has completed.
       *
       * @this {Object} The context in which the function is called, expected to have properties:
       *                - _config: An object containing configuration options.
       *                - _focustrap: An object responsible for managing focus.
       *                - _isTransitioning: A boolean indicating if a transition is currently occurring.
       *                - _element: The element associated with the transition.
       *
       * @throws {Error} Throws an error if the context does not have the required properties.
       *
       * @example
       * // Assuming the context is properly set up
       * transitionComplete.call(this);
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
            this._triggerBackdropTransition();
          }
        });
      } else {
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

      /**
       * Toggles the visibility of an element.
       *
       * This method checks the current visibility state of the element. If the element is shown,
       * it will be hidden; if it is hidden, it will be shown. The method can optionally accept a
       * related target to be used when showing the element.
       *
       * @param {Element} relatedTarget - The element that is related to the toggle action.
       *                                   This parameter is optional and can be used to provide
       *                                   context for the show action.
       * @returns {boolean} Returns true if the element is now shown, otherwise false.
       *
       * @throws {Error} Throws an error if the toggle action fails due to an invalid state.
       *
       * @example
       * const element = document.getElementById('myElement');
       * const isVisible = toggle(element);
       * console.log(isVisible); // true if shown, false if hidden
       */
      this._element.removeAttribute('aria-modal');

      this._element.removeAttribute('role');

      /**
       * Displays the dialog element, triggering the necessary events and animations.
       *
       * This method checks if the dialog is already shown or transitioning. If not, it triggers
       * a show event and proceeds to display the dialog if the event is not prevented.
       *
       * @param {Element} relatedTarget - The element that triggered the dialog to show.
       *
       * @returns {void}
       *
       * @throws {Error} Throws an error if there is an issue with displaying the dialog.
       *
       * @example
       * // Example usage:
       * const dialog = new Dialog();
       * dialog.show(document.getElementById('triggerElement'));
       */
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
/**
 * Hides the modal element if it is currently shown and not transitioning.
 * This method triggers a hide event and performs necessary clean-up actions.
 *
 * @throws {Error} Throws an error if the modal is not shown or is currently transitioning.
 *
 * @example
 * const modal = new Modal(element);
 * modal.hide(); // Hides the modal if it is currently shown.
 */

      if (hideEvent.defaultPrevented) {
        return;
      }

      const {
        classList,
        scrollHeight,
        style
      } = this._element;
      const isModalOverflowing = scrollHeight > document.documentElement.clientHeight; // return if the following background transition hasn't yet completed

      if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) {
        return;
      }

      if (!isModalOverflowing) {
        style.overflowY = 'hidden';
      }

      classList.add(CLASS_NAME_STATIC);

      this._queueCallback(() => {
        classList.remove(CLASS_NAME_STATIC);

        if (!isModalOverflowing) {
          this._queueCallback(() => {
            style.overflowY = '';
          }, this._dialog);
        }
      }, this._dialog);

      this._element.focus();
    /**
     * Cleans up and disposes of the resources used by the component.
     * This method removes event listeners, disposes of the backdrop,
     * deactivates the focus trap, and calls the superclass's dispose method.
     *
     * @throws {Error} Throws an error if the disposal process fails.
     *
     * @example
     * const component = new MyComponent();
     * component.dispose();
     */
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // ----------------------------------------------------------------------


    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      const scrollbarWidth = this._scrollBar.getWidth();

      /**
       * Handles the update process for the dialog.
       * This method is responsible for adjusting the dialog's properties
       * and ensuring that it reflects any changes that may have occurred.
       *
       * @method handleUpdate
       * @memberof <ClassName>
       * @throws {Error} Throws an error if the dialog cannot be adjusted.
       *
       * @example
       * // Example usage of handleUpdate method
       * const instance = new <ClassName>();
       * instance.handleUpdate();
       */
      const isBodyOverflowing = scrollbarWidth > 0;

      if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
        this._element.style.paddingLeft = `${scrollbarWidth}px`;
      }
/**
 * Initializes a new Backdrop instance with the specified configuration.
 *
 * This method creates a Backdrop object that controls the visibility and animation of the backdrop.
 * The visibility is determined by the presence of the backdrop configuration, while the animation
 * state is derived from the `_isAnimated` method.
 *
 * @returns {Backdrop} A new instance of the Backdrop class.
 *
 * @throws {Error} Throws an error if the Backdrop cannot be initialized due to invalid configuration.
 *
 * @example
 * const backdrop = this._initializeBackDrop();
 * console.log(backdrop.isVisible); // Outputs true or false based on the configuration
 */

      if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
        this._element.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      /**
       * Initializes a focus trap for the specified element.
       * A focus trap restricts the keyboard navigation to a specific element,
       * ensuring that users can only navigate within that element until it is closed.
       *
       * @returns {FocusTrap} An instance of the FocusTrap class that manages
       *                      the focus within the specified element.
       *
       * @throws {Error} Throws an error if the element is not defined or
       *                 if the FocusTrap cannot be initialized.
       *
       * @example
       * const focusTrap = this._initializeFocusTrap();
       * focusTrap.activate(); // Activates the focus trap
       */
      this._element.style.paddingRight = '';
    } // Static


    static jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        /**
         * Merges the default configuration with the provided configuration and
         * data attributes from the element.
         *
         * This method retrieves the default configuration and merges it with
         * any data attributes found on the element, as well as any additional
         * configuration provided by the user. It ensures that the final
         * configuration adheres to the expected types.
         *
         * @param {Object} config - The user-provided configuration object.
         *                          If not provided, defaults will be used.
         * @returns {Object} The final merged configuration object.
         *
         * @throws {TypeError} Throws an error if the provided configuration
         *                     does not match the expected types.
         *
         * @example
         * const finalConfig = this._getConfig({ customSetting: true });
         * // finalConfig will contain the merged settings including
         * // default values and custom settings.
         */
        const data = Modal.getOrCreateInstance(this, config);

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
/**
 * Displays the modal element and sets the necessary ARIA attributes.
 * This method handles the visibility of the modal, ensures it is properly
 * positioned in the DOM, and manages focus and transitions.
 *
 * @param {Element} relatedTarget - The element that triggered the modal display.
 * @throws {Error} Throws an error if the modal element is not properly initialized.
 *
 * @example
 * // Example usage of _showElement method
 * const modal = new Modal();
 * modal._showElement(document.getElementById('triggerButton'));
 */

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
   * jQuery
   * ------------------------------------------------------------------------
   * add .Modal to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Modal);
/**
 * Sets up the escape key event handler for dismissing the component.
 *
 * This method listens for the 'keydown' event on the element associated with the component.
 * If the component is currently shown and the keyboard configuration allows it, pressing the
 * Escape key will trigger the hide action. If the keyboard configuration does not allow
 * dismissal via keyboard, pressing the Escape key will initiate a backdrop transition.
 *
 * @throws {Error} Throws an error if the event handler cannot be set up properly.
 *
 * @example
 * // To set up the escape event when the component is shown
 * componentInstance._setEscapeEvent();
 *
 * @example
 * // To remove the escape event when the component is hidden
 * componentInstance._setEscapeEvent();
 */

  /**
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
  /**
   * Sets up or removes the resize event listener for the window.
   * When the dialog is shown, it listens for the window resize event
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
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const DATA_API_KEY$2 = '.data-api';
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const ESCAPE_KEY = 'Escape';
  const Default$4 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  /**
   * Hides the modal by setting its display style to 'none' and updating
   * accessibility attributes. It also manages the backdrop and resets
   * adjustments related to the modal's position and scrollbar.
   *
   * This method is typically called when the modal is being closed.
   *
   * @returns {void} This method does not return a value.
   *
   * @throws {Error} Throws an error if there is an issue with hiding the backdrop.
   *
   * @example
   * // Example usage of _hideModal method
   * const modalInstance = new Modal();
   * modalInstance._hideModal();
   */
  };
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
   * Displays the backdrop for the component and sets up an event listener
   * to handle click events on the backdrop.
   *
   * This method listens for click events on the backdrop element. If the
   * backdrop is clicked and the configuration allows it, the component will
   * either hide or trigger a transition based on the backdrop configuration.
   *
   * @param {Function} callback - A callback function that is executed after
   * the backdrop is shown. This can be used to perform additional actions
   * once the backdrop is visible.
   *
   * @throws {Error} Throws an error if the backdrop cannot be shown due to
   * configuration issues.
   *
   * @example
   * // Example usage of _showBackdrop
   * instance._showBackdrop(() => {
   *   console.log('Backdrop is now visible');
   * });
   */
  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
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


    /**
     * Checks if the associated element is currently animated.
     *
     * This method determines whether the element has the class
     * indicating a fade animation. It is typically used to
     * ascertain the animation state of the element before
     * performing further actions that depend on this state.
     *
     * @returns {boolean} True if the element is animated, false otherwise.
     *
     * @example
     * const isAnimating = instance._isAnimated();
     * if (isAnimating) {
     *   console.log('The element is currently animated.');
     * } else {
     *   console.log('The element is not animated.');
     * }
     */
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    /**
     * Triggers the backdrop transition for the modal element.
     * This method handles the visibility and overflow behavior of the modal backdrop.
     * It ensures that the modal's backdrop transition is completed before allowing
     * any further interactions.
     *
     * @throws {Error} Throws an error if the element is not properly initialized.
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * const modal = new Modal(element);
     * modal._triggerBackdropTransition();
     */
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
       * @function completeCallBack
       * @returns {void} This function does not return a value.
       *
       * @throws {Error} Throws an error if the configuration or focus trap is not properly initialized.
       *
       /**
        * Adjusts the dialog's padding based on the overflow state of the modal and the body.
        * This method ensures that the dialog is properly displayed without being cut off
        * when there is a scrollbar present or when the modal content exceeds the viewport height.
        *
        * It calculates whether the modal is overflowing and whether the body has a scrollbar,
        * then adjusts the left or right padding of the dialog element accordingly.
        *
        * @throws {Error} Throws an error if the element is not defined or if the scrollbar width cannot be determined.
        *
        * @example
        * const dialog = new Dialog();
        * dialog._adjustDialog();
        */
       * @example
       * // Example usage of completeCallBack
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
/**
 * Resets the padding adjustments of the associated element.
 *
 * This method clears the left and right padding styles of the element,
 * effectively reverting any custom padding adjustments that may have been applied.
 *
 * @throws {Error} Throws an error if the element is not defined or accessible.
 *
 * @example
 * const instance = new SomeClass();
 * instance._resetAdjustments();
 * // The element's paddingLeft and paddingRight will be reset to default.
 */

    hide() {
      if (!this._isShown) {
        return;
      }

      /**
       * jQuery interface for the Modal component.
       *
       * This method allows for the initialization of the Modal instance with a given configuration
       * and provides access to its methods via jQuery.
       *
       * @param {Object|string} config - The configuration object for the Modal or the name of the method to invoke.
       * @param {Element} [relatedTarget] - An optional parameter that can be passed to the method being called.
       *
       * @throws {TypeError} Throws an error if the specified method does not exist on the Modal instance.
       *
       * @returns {jQuery} Returns the jQuery object for chaining.
       *
       * @example
       * // Initialize a modal with default settings
       * $('#myModal').jQueryInterface({});
       *
       * @example
       * // Call a specific method on the modal instance
       * $('#myModal').jQueryInterface('show', someRelatedElement);
       */
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
       * Callback function that executes upon completion of a specific action.
       * This function is responsible for updating the accessibility attributes
       * of the associated element, hiding the element, and resetting the scrollbar
       * if scrolling is not enabled in the configuration.
       *
       * It performs the following actions:
       * - Sets the 'aria-hidden' attribute to true to indicate that the element is not visible.
       * - Removes 'aria-modal' and 'role' attributes to clean up accessibility properties.
       * - Changes the visibility style of the element to 'hidden'.
       * - Resets the scrollbar using the ScrollBarHelper if scrolling is disabled in the configuration.
       * - Triggers an event to notify that the element is now hidden.
       *
       * @throws {Error} Throws an error if there is an issue with resetting the scrollbar.
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


  /**
   * Toggles the visibility of an element based on its current state.
   * If the element is currently shown, it will be hidden; otherwise, it will be shown.
   *
   * @param {Element} relatedTarget - The element that is related to the toggle action.
   * This parameter can be used to determine the context of the toggle operation.
   *
   * @returns {boolean} Returns true if the element is now shown, false if it is hidden.
   *
   * @throws {Error} Throws an error if the toggle operation fails due to an invalid state.
   *
   * @example
   * const element = document.getElementById('myElement');
   * const isVisible = toggle(element);
   * console.log(isVisible); // Outputs true if shown, false if hidden.
   */
  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      /**
       * Displays the modal element, making it visible to the user.
       *
       * This method triggers a 'show' event and checks if the event is prevented.
       * If not prevented, it updates the visibility of the modal, manages backdrop display,
       * and handles focus trapping if necessary.
       *
       * @param {Element} relatedTarget - The element that triggered the modal to show.
       *
       * @throws {Error} Throws an error if the modal is already shown.
       *
       * @returns {void}
       *
       * @example
       * const modal = new Modal(element);
       * modal.show(triggeringElement);
       */
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
   /**
    * Hides the element and triggers the appropriate events.
    *
    * This method checks if the element is currently shown. If it is not shown,
    * the method returns early. If it is shown, it triggers a hide event and
    * checks if the event was prevented. If not, it proceeds to deactivate
    * focus trapping, remove the visible class from the element, and hide
    * the backdrop. After hiding, it updates the element's attributes and
    * visibility.
    *
    * @throws {Error} Throws an error if there is an issue with event handling.
    *
    * @example
    * // Example usage of the hide method
    * const instance = new YourClass();
    * instance.hide();
    */
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
   *
   * This function evaluates whether the attribute's name is included in the
   * provided list of allowed attributes. If the attribute is a URI attribute,
   * it further validates the attribute's value against predefined safe patterns.
   *
   * @param {Attr} attr - The attribute to be checked. It should be an instance
   *                      of the Attr interface, which represents an attribute
   *                      in the DOM.
   * @param {(string|string[]|RegExp|RegExp[])} allowedAttributeList - A list
   *                      of allowed attribute names, which can include strings
   *                      or regular expressions for pattern matching.
   *
   * @returns {boolean} Returns true if the attribute is allowed, false otherwise.
   *
   * @throws {TypeError} Throws an error if `attr` is not an instance of Attr
   *                     or if `allowedAttributeList` is not an array or string.
   *
   * @example
   * const attr = document.createAttribute('href');
   * attr.nodeValue = 'https://example.com';
   * const allowed = allowedAttribute(attr, ['href', 'src']);
   * console.log(allowed); // true
   */
  const allowedAttribute = (attr, allowedAttributeList) => {
    const attrName = attr.nodeName.toLowerCase();
/**
 * Cleans up and disposes of resources used by the current instance.
 * This method is responsible for deactivating the focus trap and disposing
 * of the backdrop, ensuring that no memory leaks occur and that all
 * resources are properly released.
 *
 * @throws {Error} Throws an error if the disposal process fails.
 *
 * @example
 * const instance = new SomeClass();
 * // Perform operations with the instance
 * instance.dispose(); // Clean up resources when done
 */

    if (allowedAttributeList.includes(attrName)) {
      if (uriAttrs.has(attrName)) {
        return Boolean(SAFE_URL_PATTERN.test(attr.nodeValue) || DATA_URL_PATTERN.test(attr.nodeValue));
      }

      return true;
    }

    /**
     * Merges the default configuration with the data attributes from the element and any user-provided configuration.
     *
     * This method retrieves the configuration settings for the component, ensuring that all necessary defaults are applied.
     * It performs a type check on the provided configuration to ensure it adheres to the expected structure.
     *
     * @param {Object} config - The user-provided configuration object. If not provided, defaults will be used.
     * @returns {Object} The merged configuration object containing default values and user overrides.
     *
     * @throws {TypeError} Throws an error if the provided config does not match the expected type.
     *
     * @example
     * const userConfig = { option1: true, option2: 'custom' };
     * const finalConfig = _getConfig(userConfig);
     * // finalConfig will contain merged values from Default$4, data attributes, and userConfig.
     */
    const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp); // Check if a regular expression validates the attribute.

    for (let i = 0, len = regExp.length; i < len; i++) {
      if (regExp[i].test(attrName)) {
        return true;
      }
    }

    return false;
  /**
   * Initializes a new Backdrop instance with specified configuration.
   *
   * This method creates a backdrop element that can be used to enhance the user experience
   * by providing a visual overlay. The backdrop can be configured to be visible or hidden,
   * animated, and can respond to click events to hide itself.
   *
   * @returns {Backdrop} A new instance of the Backdrop class.
   *
   * @throws {Error} Throws an error if the backdrop cannot be created due to invalid parameters.
   *
   * @example
   * const backdrop = this._initializeBackDrop();
   * backdrop.show(); // Displays the backdrop
   */
  };

  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    /**
     * Initializes a focus trap for the specified element.
     * A focus trap restricts the keyboard navigation to a specific element,
     * ensuring that users can only navigate within the defined area.
     *
     * @returns {FocusTrap} An instance of the FocusTrap class that manages
     *                      the focus within the specified element.
     *
     * @throws {Error} Throws an error if the focus trap cannot be initialized
     *                 due to an invalid element or other initialization issues.
     *
     * @example
     * const focusTrap = this._initializeFocusTrap();
     * focusTrap.activate(); // Activates the focus trap for the element.
     */
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    /**
     * Attaches event listeners to the element for handling specific events.
     *
     * This method listens for a keydown event and checks if the keyboard
     * dismissal is enabled in the configuration. If the ESC key is pressed,
     * it triggers the hide method to dismiss the element.
     *
     * @private
     * @returns {void} This method does not return a value.
     *
     * @throws {Error} Throws an error if the element is not defined or if
     * there is an issue with the event handling.
     *
     * @example
     * // Assuming `instance` is an instance of the class that contains this method
     * instance._addEventListeners();
     */
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    /**
     * Static method that provides an interface for jQuery to interact with the Offcanvas component.
     *
     * This method allows for the execution of specific methods on the Offcanvas instance based on the provided configuration.
     * If the configuration is not a string or if the method does not exist, an error will be thrown.
     *
     * @static
     * @param {string|Object} config - The configuration for the Offcanvas instance.
     *                                  If a string is provided, it should correspond to a method name on the instance.
     * @returns {jQuery} The jQuery object for chaining.
     * @throws {TypeError} Throws an error if the method specified by the config does not exist,
     *                     starts with an underscore, or is the constructor.
     *
     * @example
     * // Initialize Offcanvas and call a method
     * $(element).Offcanvas('show');
     *
     * @example
     * // Initialize Offcanvas with custom options
     * $(element).Offcanvas({ backdrop: 'static' });
     */
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
   * Sanitizes HTML by removing disallowed elements and attributes based on a provided allowlist.
   *
   * This function parses the input HTML string and removes any elements that are not included in the
   * allowlist. It also checks the attributes of allowed elements against the allowlist and removes
   * any disallowed attributes.
   *
   * @param {string} unsafeHtml - The HTML string to be sanitized.
   * @param {Object} allowList - An object defining allowed elements and attributes.
   *                             Keys are element names (in lowercase) and values are arrays of allowed attributes.
   *                             A key of '*' can be used to specify global allowed attributes for all elements.
   * @param {Function} [sanitizeFn] - An optional custom sanitization function that will be called with the
   *                                    unsafeHtml if provided. If this function is defined, it will be used
   *                                    instead of the default sanitization process.
   * @returns {string} The sanitized HTML string.
   *
   * @throws {Error} Throws an error if the input HTML is invalid or cannot be parsed.
   *
   * @example
   * const safeHtml = sanitizeHtml('<div><script>alert("xss")</script><p>Hello</p></div>',
   *                               { 'div': [], 'p': [] });
   * // Returns: '<div><p>Hello</p></div>'
   *
   * @example
   * const customSanitizeFn = (html) => html.replace(/<script.*?>.*?<\/script>/gi, '');
   * const safeHtmlWithCustomFn = sanitizeHtml('<div><script>alert("xss")</script><p>Hello</p></div>',
   *                                            { 'div': [], 'p': [] },
   *                                            customSanitizeFn);
   * // Returns: '<div><p>Hello</p></div>'
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
      if (typeof Popper === 'undefined') {
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
        EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
      }

      if (this._popper) {
        this._popper.update();
      } else {
        /**
         * Enables the current instance by setting the internal state to enabled.
         *
         * This method updates the `_isEnabled` property to `true`, indicating that
         * the instance is now in an enabled state. This can be useful for toggling
         * functionality or features that depend on the enabled status.
         *
         * @throws {Error} Throws an error if the instance is already enabled.
         *
         * @example
         * const instance = new MyClass();
         * instance.enable(); // Sets _isEnabled to true
         */
        this._popper = createPopper(this._element, tip, this._getPopperConfig(attachment));
      }

      tip.classList.add(CLASS_NAME_SHOW$2);
/**
 * Disables the current instance by setting the internal
 * enabled state to false. This method is typically used
 * to deactivate functionality or prevent further operations
 * until re-enabled.
 *
 * @throws {Error} Throws an error if the instance is already
 * disabled and cannot be disabled again.
 *
 * @example
 * const instance = new MyClass();
 * instance.disable();
 * console.log(instance.isEnabled); // false
 */

      const customClass = this._resolvePossibleFunction(this._config.customClass);

      if (customClass) {
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
        tip.classList.add(...customClass.split(' '));
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      /**
       * Toggles the visibility of a tooltip or popover based on the provided event.
       * This method checks if the component is enabled before proceeding with the toggle action.
       *
       * @param {Event} event - The event that triggered the toggle action.
       *                        If provided, it will determine the context for the toggle.
       *                        If not provided, the method will attempt to show the tooltip/popover.
       *
       * @returns {void} - This method does not return a value.
       *
       * @throws {Error} - Throws an error if the component is not initialized properly.
       *
       * @example
       * // Example usage of the toggle method
       * const tooltip = new Tooltip();
       * tooltip.toggle(event); // Toggles visibility based on the event
       * tooltip.toggle(); // Shows the tooltip if it is currently hidden
       */
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
       * it invokes the leave method to finalize the transition.
       *
       * @throws {Error} Throws an error if the event handler fails to trigger.
       *
       * @example
       * // Example usage of the complete method
       * const instance = new SomeClass();
       * instance.complete();
       */
      const complete = () => {
        const prevHoverState = this._hoverState;
        /**
         * Cleans up and releases resources used by the instance.
         * This method is responsible for removing event listeners,
         * destroying popper instances, and removing any associated tips.
         * It should be called when the instance is no longer needed
         * to prevent memory leaks.
         *
         * @throws {Error} Throws an error if the disposal process fails.
         *
         * @example
         * const instance = new SomeClass();
         * // ... use the instance ...
         * instance.dispose();
         */
        this._hoverState = null;
        EventHandler.trigger(this._element, this.constructor.Event.SHOWN);

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this);
        }
      };

      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

      this._queueCallback(complete, this.tip, isAnimated);
    }

    hide() {
      if (!this._popper) {
        /**
         * Displays the tooltip element associated with the current instance.
         *
         * This method checks if the element is visible and if it has content before proceeding to show the tooltip.
         * It triggers a 'SHOW' event and manages the tooltip's placement and visibility.
         *
         * @throws {Error} Throws an error if the method is called on an element that is not visible.
         *
         * @returns {void}
         *
         * @example
         * const tooltip = new Tooltip(element, config);
         * tooltip.show();
         *
         * @event Tooltip#show
         * @event Tooltip#shown
         * @event Tooltip#inserted
         */
        return;
      }

      const tip = this.getTipElement();

      /**
       * Completes the tooltip lifecycle by removing it from the DOM and cleaning up associated resources.
       *
       * This method checks if there is an active trigger for the tooltip. If there is, it exits early.
       * If the hover state is not set to show, it removes the tooltip element. It also cleans up any
       * associated classes and removes the ARIA attribute that describes the tooltip.
       *
       * After triggering the 'HIDDEN' event, it destroys the Popper instance if it exists and sets it to null.
       *
       * @throws {Error} Throws an error if the tooltip cannot be removed due to an unexpected state.
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

    getTipElement() {
      if (this.tip) {
        return this.tip;
      }

      /**
       * Hides the tooltip element associated with the current instance.
       * This method will remove the tooltip from the DOM and clean up any associated event listeners.
       *
       * @returns {void}
       *
       * @throws {Error} Throws an error if the tooltip element is not initialized.
       *
       * @example
       * const tooltip = new Tooltip(element);
       * tooltip.hide();
       *
       * @description
       * The method first checks if the tooltip (_popper) is initialized. If not, it exits early.
       * It triggers a HIDE event on the element, allowing for any custom behavior before hiding.
       * If the event is prevented, the method will not proceed with hiding the tooltip.
       * After hiding, it cleans up the tooltip's class and removes the aria-describedby attribute.
       * If the tooltip is animated, it queues a callback to complete the hiding process.
       */
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

      if (isElement$1(content)) {
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
          content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
        }

        element.innerHTML = content;
      } else {
        /**
         * Updates the popper instance if it exists.
         *
         * This method checks if the internal popper instance is not null,
         * and if so, it calls the update method on that instance to refresh
         * its position and dimensions.
         *
         * @throws {Error} Throws an error if the popper instance is invalid or cannot be updated.
         *
         * @example
         * const instance = new Popper();
         * instance.update();
         */
        element.textContent = content;
      }
    }

    getTitle() {
      const title = this._element.getAttribute('data-bs-original-title') || this._config.title;

      /**
       * Checks if the current instance has content based on the title.
       *
       * This method evaluates whether the title of the instance is defined and not empty.
       * It returns a boolean value indicating the presence of content.
       *
       * @returns {boolean} True if the title is defined and not empty; otherwise, false.
       *
       * @example
       * const instance = new MyClass();
       * instance.setTitle("My Title");
       * console.log(instance.isWithContent()); // Output: true
       *
       * @example
       * const instance = new MyClass();
       * instance.setTitle("");
       * console.log(instance.isWithContent()); // Output: false
       */
      return this._resolvePossibleFunction(title);
    }

    updateAttachment(attachment) {
      /**
       * Retrieves the tooltip element. If the tooltip element has already been created,
       * it returns the existing element. Otherwise, it creates a new tooltip element,
       * sets its content based on the provided template, and initializes it.
       *
       * @returns {HTMLElement} The tooltip element that is either newly created or previously existing.
       *
       * @throws {Error} Throws an error if the template configuration is invalid or if
       *                 there is an issue during the creation of the tooltip element.
       *
       * @example
       * const tooltip = instance.getTipElement();
       * console.log(tooltip); // Logs the tooltip element to the console.
       */
      if (attachment === 'right') {
        return 'end';
      }

      if (attachment === 'left') {
        return 'start';
      }

      return attachment;
    } // Private


    _initializeOnDelegatedTarget(event, context) {
      return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
    /**
     * Sets the content of the tooltip by sanitizing the provided tip.
     * This method utilizes the current title and a predefined selector
     * to ensure that the content is properly formatted and safe for display.
     *
     * @param {string} tip - The content to be set in the tooltip.
     *                       It should be a sanitized string to prevent
     *                       any potential security risks.
     *
     * @throws {Error} Throws an error if the tip is not a valid string
     *                 or if sanitization fails.
     *
     * @example
     * const tooltip = new Tooltip();
     * tooltip.setContent("This is a tooltip message.");
     */
    }

    _getOffset() {
      const {
        /**
         * Sanitizes the provided content and sets it to the specified template element.
         * If the content is empty and the template element exists, it removes the element from the DOM.
         * Otherwise, it updates the element's content with the provided content.
         *
         * @param {Element} template - The template element that contains the content to be set.
         * @param {string|null} content - The content to be set in the template element. If null or empty, the element will be removed.
         * @param {string} selector - A selector string used to find the specific element within the template.
         *
         * @returns {void} This function does not return a value.
         *
         * @throws {Error} Throws an error if the selector does not match any elements in the template.
         *
         * @example
         * // Example usage:
         * const template = document.getElementById('myTemplate');
         * const content = '<p>New Content</p>';
         * const selector = '.content-area';
         * _sanitizeAndSetContent(template, content, selector);
         *
         * // If content is null:
         * _sanitizeAndSetContent(template, null, selector); // This will remove the element if it exists.
         */
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    /**
     * Sets the content of a specified DOM element.
     *
     * This function updates the content of the provided element based on the type of content given.
     * If the content is a DOM node or jQuery object, it will be appended to the element. If the content
     * is a string, it will be set as either HTML or plain text depending on the configuration.
     *
     * @param {Element} element - The DOM element whose content is to be set. If null, the function does nothing.
     * @param {string|Element|jQuery} content - The content to be set. This can be a string, a DOM element, or a jQuery object.
     *
     * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
     *
     * @returns {void} This function does not return a value.
     *
     * @example
     * // Example usage:
     * const div = document.getElementById('myDiv');
     * setElementContent(div, '<p>Hello World!</p>'); // Sets HTML content
     * setElementContent(div, 'Hello World!'); // Sets plain text content
     */
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
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: 'onChange',
          /**
           * Retrieves the title from the element's data attribute or configuration.
           *
           * This method checks for the presence of a 'data-bs-original-title' attribute on the
           * associated element. If it exists, that value is used as the title. If not, it falls
           * back to the title specified in the configuration object.
           *
           * The title can also be a function, in which case this method resolves it to its
           * actual value before returning.
           *
           * @returns {string|function} The resolved title value, which can be either a string
           *                            or the result of a function call.
           *
           * @throws {TypeError} Throws an error if the title cannot be resolved to a valid
           *                     string or function.
           *
           * @example
           * const title = instance.getTitle();
           * console.log(title); // Outputs the resolved title value.
           */
          enabled: true,
          phase: 'afterWrite',
          fn: data => this._handlePopperPlacementChange(data)
        }],
        onFirstUpdate: data => {
          if (data.options.placement !== data.placement) {
            /**
             * Updates the attachment position based on the provided input.
             *
             * This function takes an attachment string and returns a corresponding
             * position string. If the input is 'right', it returns 'end'. If the input
             * is 'left', it returns 'start'. For any other input, it returns the input
             * itself unchanged.
             *
             * @param {string} attachment - The attachment position to be updated.
             * @returns {string} The updated attachment position.
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
             * // Returns 'center'
             * updateAttachment('center');
             */
            this._handlePopperPlacementChange(data);
          }
        }
      };
      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }

    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
    }

    /**
     * Initializes an instance on the delegated target.
     *
     * This method checks if a context is provided; if not, it attempts to
     * retrieve or create an instance using the delegate target from the event
     * and the delegate configuration.
     *
     * @param {Event} event - The event object that contains information about
     * the event that triggered this method.
     * @param {Object} context - An optional context object that may be used
     * for initialization. If not provided, a new instance will be created.
     *
     * @returns {Object} The initialized instance associated with the delegated
     * target.
     *
     * @throws {Error} Throws an error if the delegate target is invalid or
     * if instance creation fails.
     *
     * @example
     * const instance = this._initializeOnDelegatedTarget(event, context);
     */
    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    }

    /**
     * Retrieves the offset configuration for the element.
     *
     * This method checks the type of the offset configuration and returns it accordingly:
     * - If the offset is a string, it splits the string by commas and converts each value to an integer.
     * - If the offset is a function, it returns a new function that takes `popperData` as an argument and calls the original offset function with `popperData` and the current element.
     * - If the offset is neither a string nor a function, it returns the offset directly.
     *
     * @returns {number[]|function} The parsed offset as an array of numbers if it was a string,
     *                              a function if it was a function, or the original offset value.
     *
     * @throws {TypeError} Throws an error if the offset is of an unsupported type.
     *
     * @example
     * // Example of using _getOffset with a string
     * const offsetArray = instance._getOffset(); // returns [10, 20]
     *
     * // Example of using _getOffset with a function
     * const offsetFunction = instance._getOffset();
     * const result = offsetFunction(popperData); // calls the original function with popperData
     */
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
        }
      });

      this._hideModalHandler = () => {
        if (this._element) {
          /**
           * Resolves the provided content to a function result or returns the content itself.
           *
           * This method checks if the given content is a function. If it is, the function is called
           * with the current element as its context. If the content is not a function, it is returned
           * as-is.
           *
           * @param {any} content - The content to be resolved, which can be a function or any other type.
           * @returns {any} The result of the function call if content is a function, otherwise the original content.
           *
           * @example
           * const result = this._resolvePossibleFunction(() => 'Hello, World!');
           * console.log(result); // Outputs: 'Hello, World!'
           *
           * @example
           * const result = this._resolvePossibleFunction('Just a string');
           * console.log(result); // Outputs: 'Just a string'
           */
          this.hide();
        }
      };

      /**
       * Generates the configuration object for the Popper.js instance based on the provided attachment.
       *
       * This function creates a default configuration for Popper.js, including placement, modifiers for flipping,
       * offsetting, preventing overflow, and handling arrow elements. It also includes a callback for handling
       * changes in placement after the Popper has been updated.
       *
       * @param {string} attachment - The desired placement of the popper (e.g., 'top', 'bottom', 'left', 'right').
       * @returns {Object} The complete Popper configuration object, which may include user-defined modifications
       *                   if a popperConfig function is provided in the instance's configuration.
       *
       * @throws {TypeError} Throws an error if the provided attachment is not a valid string.
       *
       * @example
       * const config = this._getPopperConfig('top');
       * console.log(config); // Outputs the Popper configuration object for 'top' placement.
       */
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

      if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$2) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
      }

      /**
       * Adds a CSS class to the tooltip element based on the provided attachment.
       *
       * This method retrieves the tooltip element and adds a class that is a combination
       * of a basic class prefix and the updated attachment type. This is useful for
       * dynamically changing the appearance of the tooltip based on the current attachment.
       *
       * @param {Object} attachment - The attachment object that contains information
       * about the current attachment type.
       *
       * @throws {TypeError} Throws an error if the attachment is not an object or is null.
       *
       * @example
       * const attachment = { type: 'image' };
       * this._addAttachmentClass(attachment);
       * // The tooltip element will have a class like 'tooltip-image' added to it.
       */
      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;

      if (!context._config.delay || !context._config.delay.show) {
        /**
         * Retrieves an attachment based on the specified placement.
         *
         * This function looks up the attachment in the AttachmentMap using the provided
         * placement parameter, which is converted to uppercase to ensure consistency
         * in the lookup process.
         *
         * @param {string} placement - The placement identifier for the attachment.
         * @returns {Attachment|null} The attachment associated with the specified placement,
         *                            or null if no attachment is found.
         *
         * @throws {Error} Throws an error if the placement parameter is not a valid string.
         *
         * @example
         * const attachment = _getAttachment('header');
         * console.log(attachment); // Outputs the attachment for the 'header' placement.
         */
        context.show();
        return;
      }

      /**
       * Sets up event listeners based on the configuration triggers.
       * This method handles different types of events such as click, hover, and focus.
       * It also manages the visibility of modal elements by attaching appropriate event handlers.
       *
       * @throws {Error} Throws an error if the element is not defined.
       *
       * @example
       * const instance = new SomeClass();
       * instance._setListeners();
       *
       * @returns {void}
       */
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
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context._config.delay.hide);
    }
/**
 * Updates the title and aria-label attributes of the element.
 *
 * This method retrieves the current title attribute of the element and checks if it is defined.
 * If the title exists or the original title type is not a string, it sets the 'data-bs-original-title'
 * attribute to the title value. Additionally, if the title is present and both the 'aria-label'
 * and text content of the element are not set, it assigns the title to the 'aria-label' attribute.
 * Finally, it clears the title attribute of the element.
 *
 * @throws {TypeError} Throws an error if the element does not have a valid attribute structure.
 *
 * @example
 * // Assuming `element` is a valid DOM element with a title attribute
 * const instance = new SomeClass(element);
 * instance._fixTitle();
 */

    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    }

    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      Object.keys(dataAttributes).forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
          delete dataAttributes[dataAttr];
        /**
         * Handles the entry event for a tooltip or popover.
         * This method initializes the context based on the delegated target of the event,
         * updates the hover state, and manages the display timing of the tooltip or popover.
         *
         * @param {Event} event - The event that triggered the entry action.
         * @param {Object} context - The context object that contains configuration and state information.
         * @param {boolean} context._config.delay - Configuration for delay settings.
         * @param {number} context._config.delay.show - Delay time in milliseconds before showing the tooltip.
         * @param {Function} context.show - Function to display the tooltip or popover.
         * @param {Element} context.getTipElement - Function to retrieve the tooltip element.
         * @param {Object} context._activeTrigger - Object to track active triggers for the tooltip.
         * @param {string} context._hoverState - Current hover state of the tooltip.
         * @param {number} context._timeout - Timeout identifier for managing delays.
         *
         * @throws {Error} Throws an error if the context is not properly initialized.
         *
         * @example
         * // Example usage:
         * const event = new Event('mouseenter');
         * const context = {
         *   _config: { delay: { show: 300 } },
         *   show: () => console.log('Tooltip shown'),
         *   getTipElement: () => document.createElement('div'),
         *   _activeTrigger: {},
         *   _hoverState: '',
         *   _timeout: null
         * };
         * _enter(event, context);
         */
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

      typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
      /**
       * Handles the mouse leave event for a given context.
       * This method is responsible for managing the visibility of an element
       * based on the user's interaction, specifically when the mouse leaves
       * the element.
       *
       * @param {Event} event - The event object representing the mouse leave event.
       * @param {Object} context - The context object containing configuration
       * and state information related to the element.
       * @property {HTMLElement} context._element - The element that is being
       * monitored for mouse events.
       * @property {Object} context._config - Configuration options for the
       * element, including delay settings.
       * @property {number} context._timeout - Timeout identifier for managing
       * delayed actions.
       * @property {string} context._hoverState - The current hover state of
       * the element, which can be used to determine visibility.
       *
       * @throws {Error} Throws an error if the context is not properly initialized.
       *
       * @example
       * // Example usage of _leave method
       * element.addEventListener('mouseleave', (event) => {
       *   this._leave(event, context);
       * });
       *
       * @returns {void} This method does not return a value.
       */
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
      const tip = this.getTipElement();
      const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g');
      const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);

      if (tabClass !== null && tabClass.length > 0) {
        /**
         * Checks if there is any active trigger present.
         *
         * This method iterates through the `_activeTrigger` property and returns
         * `true` if at least one trigger is active. If no triggers are active,
         * it returns `false`.
         *
         * @returns {boolean} - Returns `true` if there is at least one active trigger,
         *                      otherwise returns `false`.
         *
         * @example
         * const hasActiveTrigger = instance._isWithActiveTrigger();
         * console.log(hasActiveTrigger); // true or false based on the state of _activeTrigger
         */
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
      }
    }

    _getBasicClassPrefix() {
      return CLASS_PREFIX$1;
    }

    _handlePopperPlacementChange(popperData) {
      const {
        /**
         * Retrieves and processes the configuration object for the component.
         * This method merges default settings with data attributes from the element,
         * and any additional configuration provided by the user.
         *
         * @param {Object} config - The user-defined configuration object.
         * @returns {Object} The processed configuration object, including defaults,
         *                  data attributes, and user-defined settings.
         *
         * @throws {TypeError} Throws an error if the provided config is not an object.
         *
         * @example
         * const config = _getConfig({ delay: 300 });
         * // config will be an object containing merged properties from defaults,
         * // data attributes, and the provided config.
         *
         * @example
         * const config = _getConfig(false);
         * // config.container will default to document.body.
         */
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
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tooltip to jQuery only if jQuery is present
   */

/**
 * Retrieves the configuration settings that differ from the default values.
 *
 * This method iterates through the instance's configuration properties and
 * compares them against the default values defined in the constructor. It
 * constructs and returns an object containing only those properties that
 * have values different from the defaults.
 *
 * @returns {Object} An object containing the configuration settings that
 *                  differ from the default values.
 *
 * @example
 * const config = instance._getDelegateConfig();
 * console.log(config); // Outputs an object with custom configurations.
 */

  defineJQueryPlugin(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.0): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  /**
   * Cleans up the CSS classes of the tooltip element by removing
   * any classes that match the basic class prefix.
   *
   * This method retrieves the tooltip element and identifies any
   * classes that start with the basic class prefix. If such classes
   * are found, they are removed from the tooltip's class list.
   *
   * @throws {Error} Throws an error if the tooltip element cannot be retrieved.
   *
   * @example
   * // Assuming 'tooltip' is an instance of a class that has _cleanTipClass method
   * tooltip._cleanTipClass();
   */
  const NAME$3 = 'popover';
  const DATA_KEY$3 = 'bs.popover';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const CLASS_PREFIX = 'bs-popover';
  const Default$2 = { ...Tooltip.Default,
    placement: 'right',
    offset: [0, 8],
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
  /**
   * Retrieves the basic class prefix used in the application.
   *
   * This method is typically used to obtain a standard prefix that is
   * applied to class names for consistency across the codebase.
   *
   * @returns {string} The basic class prefix.
   *
   * @example
   * const prefix = _getBasicClassPrefix();
   * console.log(prefix); // Outputs the class prefix
   */
  };
  const DefaultType$2 = { ...Tooltip.DefaultType,
    content: '(string|element|function)'
  };
  /**
   * Handles the change in placement of the popper element.
   * This method is triggered when the popper's position is updated.
   *
   * @param {Object} popperData - The data object containing information about the popper's state.
   * @param {Object} popperData.state - The current state of the popper.
   * @param {HTMLElement} popperData.state.elements.popper - The popper element itself.
   *
   * @returns {void} This method does not return a value.
   *
   * @throws {Error} Throws an error if the state is not defined or if the popper element is not found.
   *
   * @example
   * // Example usage:
   * const popperData = {
   *   state: {
   *     elements: {
   *       popper: document.getElementById('my-popper')
   *     },
   *     placement: 'top'
   *   }
   * };
   * this._handlePopperPlacementChange(popperData);
   */
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
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   /**
    * Initializes or invokes a method on the Tooltip instance for each element in the jQuery collection.
    *
    * This static method allows for both configuration of a new Tooltip instance and invocation of existing methods
    * on the Tooltip instance. If a string is passed as the config parameter, it is treated as a method name to be called.
    *
    * @static
    * @param {Object|string} config - Configuration options for the Tooltip instance or a method name to invoke.
    * @throws {TypeError} Throws an error if the provided method name does not exist on the Tooltip instance.
    *
    * @example
    * // Initialize Tooltip with configuration
    * $(selector).Tooltip({ option1: value1, option2: value2 });
    *
    * // Invoke a method on the Tooltip instance
    * $(selector).Tooltip('show');
    */
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
    method: 'auto',
    target: ''
  };
  const DefaultType$1 = {
    offset: 'number',
    /**
     * Checks if the current instance has content.
     *
     * This method determines whether the instance has a title or content available.
     * It returns true if either the title or content is present, otherwise false.
     *
     * @returns {boolean} True if there is a title or content; otherwise, false.
     *
     * @example
     * const instance = new MyClass();
     * if (instance.isWithContent()) {
     *   console.log('Content is available.');
     * } else {
     *   console.log('No content found.');
     * }
     */
    method: 'string',
    target: '(string|element)'
  };
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  /**
   * Sets the content for the current instance by sanitizing and updating
   * both the title and the main content.
   *
   * This method first sanitizes the provided tip and sets it as the title
   * using the predefined selector for titles. Then, it sanitizes the content
   * retrieved from the instance and updates it accordingly.
   *
   * @param {string} tip - The content to be sanitized and set. This should
   *                       be a string that represents the new content.
   *
   * @throws {Error} Throws an error if the provided tip is invalid or if
   *                 there is an issue during the sanitization process.
   *
   * @example
   * const instance = new SomeClass();
   * instance.setContent("New Title and Content");
   */
  const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  /**
   * Retrieves the content based on the current configuration.
   *
   * This method resolves the content by checking if it is a possible function
   * and executing it if necessary. It is intended to be used internally within
   * the class to access the configured content.
   *
   * @returns {any} The resolved content, which can be of any type depending on
   *                the configuration.
   *
   * @throws {Error} Throws an error if the content cannot be resolved or if
   *                 there is an issue with the configuration.
   *
   * @example
   * const content = instance._getContent();
   * console.log(content); // Outputs the resolved content based on configuration.
   */
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`;
  const SELECTOR_DROPDOWN$1 = '.dropdown';
  /**
   * Retrieves the basic class prefix used in the application.
   *
   * This method is typically used to obtain a standard prefix that can be
   * applied to various class names throughout the codebase, ensuring
   * consistency and avoiding naming conflicts.
   *
   * @returns {string} The basic class prefix.
   *
   * @example
   * const prefix = _getBasicClassPrefix();
   * console.log(prefix); // Outputs the class prefix
   */
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';
  /**
   * ------------------------------------------------------------------------
   /**
    * jQuery interface for the Popover component.
    * This method allows for the initialization and manipulation of Popover instances
    * using jQuery syntax.
    *
    * @param {Object|string} config - Configuration object for the Popover instance
    *                                  or a string representing a method name to invoke.
    *
    * @throws {TypeError} Throws an error if a string method name is provided that does not exist
    *                     on the Popover instance.
    *
    * @returns {jQuery} The jQuery object for chaining.
    *
    * @example
    * // Initialize a Popover with default settings
    * $('.popover-element').popover();
    *
    * // Call a specific method on the Popover instance
    * $('.popover-element').popover('show');
    */
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

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        /**
         * Refreshes the scroll offsets and targets based on the current configuration and scroll element.
         * This method recalculates the positions of the target elements and updates the internal offsets and targets arrays.
         *
         * It determines the method of calculating offsets based on the configuration and the type of scroll element.
         * The method can either be 'auto', which selects between offset methods, or a specific method defined in the configuration.
         *
         * The calculated offsets are based on the bounding client rectangle of each target element, and they are sorted
         * in ascending order before being stored in the internal state.
         *
         * @throws {Error} Throws an error if the configuration target is invalid or if there are issues retrieving
         *                 the bounding rectangle of the target elements.
         *
         * @example
         * const instance = new ScrollSpy(config);
         * instance.refresh();
         * // This will update the internal offsets and targets based on the current scroll position and configuration.
         */
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
      }
    }

    _activate(target) {
      this._activeTarget = target;
/**
 * Cleans up and releases resources used by the instance.
 * This method removes event listeners and performs any necessary
 * cleanup before the instance is destroyed.
 *
 * @throws {Error} Throws an error if the cleanup process fails.
 *
 * @example
 * const instance = new MyClass();
 * // Perform operations with the instance
 * instance.dispose(); // Clean up resources
 */

      this._clear();

      const queries = SELECTOR_LINK_ITEMS.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);
      const link = SelectorEngine.findOne(queries.join(','), this._config.target);
      link.classList.add(CLASS_NAME_ACTIVE$1);
/**
 * Merges the provided configuration object with default settings and data attributes.
 *
 * This method retrieves the configuration settings for a component, ensuring that all necessary
 * defaults are applied and that the target element is correctly identified. If the provided config
 * is not an object or is empty, it will default to the predefined settings.
 *
 * @param {Object} config - The configuration object to be merged with defaults.
 * @param {HTMLElement} [config.target] - The target element for the component. If not provided,
 *                                         defaults to the document's root element.
 * @returns {Object} The final configuration object after merging.
 *
 * @throws {TypeError} Throws an error if the provided config is not an object.
 *
 * @example
 * const config = _getConfig({ target: '#myElement' });
 * console.log(config.target); // Outputs the target element based on the provided selector.
 */

      if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
      } else {
        SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item

          SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
            /**
             * Retrieves the current vertical scroll position of the specified scroll element.
             *
             * This method checks if the scroll element is the window object. If it is,
             * it returns the vertical scroll position using `pageYOffset`. Otherwise,
             * it returns the `scrollTop` property of the scroll element.
             *
             * @returns {number} The current vertical scroll position in pixels.
             *
             * @throws {TypeError} Throws an error if the scroll element is not defined.
             *
             * @example
             * const scrollPosition = instance._getScrollTop();
             * console.log(scrollPosition); // Outputs the current scroll position
             */
            SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
          });
        });
      }
/**
 * Retrieves the total height of the scrollable content within the scroll element.
 * This method checks the scroll height of the specified scroll element and falls back
 * to the maximum scroll height of the document body or document element if necessary.
 *
 * @returns {number} The total scroll height of the scrollable content.
 *
 * @example
 * const height = instance._getScrollHeight();
 * console.log(height); // Outputs the scroll height of the content.
 */

      EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
        relatedTarget: target
      });
    /**
     * Calculates the height of the scrollable element or the window.
     *
     * This method checks if the scroll element is the window. If it is,
     * it returns the inner height of the window. Otherwise, it retrieves
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

    _clear() {
      SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
    /**
     * Handles the scrolling behavior and activates the appropriate target based on the current scroll position.
     *
     * This method calculates the current scroll position, the total scrollable height, and determines if the
     * active target needs to be updated based on the user's scroll actions. It refreshes the state if the
     * scroll height changes and activates targets as necessary.
     *
     * @throws {Error} Throws an error if the target activation fails.
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * // Assuming an instance of the class is created and scrolling occurs
     * instance._process();
     */
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
   * ------------------------------------------------------------------------
   * add .ScrollSpy to jQuery only if jQuery is present
   */

  defineJQueryPlugin(ScrollSpy);
/**
 * Activates a target element by updating the active state of related links and their parents.
 *
 * This method sets the specified target as active, clears previous active states, and updates the UI accordingly.
 * It handles both dropdown items and navigation lists, ensuring that all relevant parent elements are marked as active.
 *
 * @param {string} target - The target identifier (e.g., a selector or URL) to activate.
 * @throws {Error} Throws an error if the target cannot be found in the DOM.
 *
 * @example
 * // Activating a target with a specific identifier
 * instance._activate('#myTarget');
 *
 * @fires EVENT_ACTIVATE - Triggers an event indicating that a new target has been activated.
 */

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
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  /**
   * Removes the active class from all link items within the specified target.
   * This method searches for elements matching the defined selector and filters
   * those that currently have the active class applied. It then removes the active
   * class from each of these elements.
   *
   * @method _clear
   * @private
   * @throws {Error} Throws an error if the target is not found or if there is an issue
   *                 accessing the class list of the nodes.
   *
   * @example
   * // Assuming this._config.target is set to a valid selector
   * this._clear();
   */
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = ':scope > li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
  /**
   * A static method that serves as the jQuery interface for the ScrollSpy component.
   * This method allows for the initialization of the ScrollSpy instance and the invocation
   * of its methods based on the provided configuration.
   *
   * @static
   * @param {Object|string} config - The configuration object for initializing the ScrollSpy instance,
   *                                  or a string representing the method name to invoke on the instance.
   * @returns {jQuery} The jQuery object for chaining.
   * @throws {TypeError} Throws an error if the provided config is a string and does not correspond
   *                     to a valid method name on the ScrollSpy instance.
   *
   * @example
   * // Initialize ScrollSpy with configuration
   * $('.scrollspy').ScrollSpy({ target: '#navbar' });
   *
   * // Invoke a method on the ScrollSpy instance
   * $('.scrollspy').ScrollSpy('refresh');
   */
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
       * Triggers the completion of an event sequence by notifying related targets.
       * This function is typically used to signal that a particular event has been completed,
       * allowing other components or listeners to respond accordingly.
       *
       * It triggers two events:
       * - An event indicating that the previous element is now hidden.
       * - An event indicating that the current element is now shown.
       *
       * @throws {Error} Throws an error if the event triggering fails due to an invalid target.
       *
       * @example
       * // Example usage of the complete function
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
      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
      const active = activeElements[0];
      const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

      /**
       * Executes the transition completion process.
       /**
        * Displays the current element by activating it and deactivating any previously active elements.
        * This method checks if the element is already active and, if not, triggers the necessary events
        * to manage the visibility of the element and its related elements.
        *
        * @throws {Error} Throws an error if the element is not part of a valid navigation list group.
        *
        * @returns {void} This method does not return a value.
        *
        * @example
        * const myElement = document.querySelector('.my-element');
        * myElement.show(); // Activates the element and shows it in the UI.
        */
       *
       * This function is responsible for calling the transition complete method
       * with the specified parameters. It is typically used to finalize the
       * transition of an element, ensuring that any necessary callbacks are
       * executed once the transition is complete.
       *
       * @function
       * @param {HTMLElement} element - The DOM element that is undergoing the transition.
       * @param {boolean} active - A flag indicating whether the transition is currently active.
       * @param {Function} callback - A callback function to be executed after the transition completes.
       * @returns {void} This function does not return a value.
       *
       * @throws {Error} Throws an error if the transition fails or if invalid parameters are provided.
       *
       * @example
       * complete(myElement, true, () => {
       *   console.log('Transition completed successfully!');
       * });
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
       * Activates a specific element within a given container, handling any necessary transitions.
       *
       * This method checks if the container is a list (UL or OL) and finds active elements accordingly.
       * If an active element is found and is currently transitioning, it removes the show class and queues
       * a callback to complete the transition. If no active element is found or no transition is occurring,
       * it directly calls the completion function.
       *
       * @param {HTMLElement} element - The element to be activated.
       * @param {HTMLElement} container - The container within which to search for active elements.
       * @param {Function} [callback] - An optional callback function to be executed after the transition completes.
       *
       * @returns {void}
       *
       * @throws {TypeError} Throws an error if the provided element or container is not an HTMLElement.
       *
       * @example
       * // Example usage of _activate method
       * const myElement = document.getElementById('myElement');
       * const myContainer = document.getElementById('myContainer');
       * this._activate(myElement, myContainer, () => {
       *   console.log('Transition completed!');
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
       * Handles the completion of a transition for a given element, updating its state
       * and the state of related elements in the DOM.
       *
       * This method is typically used in UI components to manage the active state of
       * elements such as tabs or dropdowns.
       *
       * @param {HTMLElement} element - The element that has completed its transition.
       * @param {HTMLElement} active - The currently active element that is being transitioned from.
       * @param {Function} [callback] - An optional callback function to be executed after the transition is complete.
       *
       * @returns {void}
       *
       * @throws {TypeError} Throws an error if the provided element or active is not an HTMLElement.
       *
       * @example
       * // Example usage:
       * _transitionComplete(tabElement, activeTabElement, () => {
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
     * Static method that acts as an interface for jQuery to initialize or call methods on Tab instances.
     *
     * This method iterates over each element in the jQuery collection and retrieves or creates a Tab instance
     * associated with the element. If a string is passed as the config parameter, it attempts to call the method
     * of the Tab instance corresponding to that string.
     *
     * @static
     * @param {string|Object} config - The configuration or method name to be executed on the Tab instance.
     *                                  If a string is provided, it should match a method name of the Tab instance.
     *
     * @throws {TypeError} Throws an error if the provided config is a string and does not correspond to a valid method
     *                     of the Tab instance.
     *
     * @returns {jQuery} The jQuery collection for chaining.
     *
     * @example
     * // Initialize all tabs
     * $('.tab-selector').jQueryInterface();
     *
     * // Call a specific method on the tab instance
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
       * This function is typically used in scenarios where an element's visibility needs to be
       * managed, such as in modal dialogs or dropdowns.
       *
       * @throws {Error} Throws an error if the element is not defined or if there is an issue
       *                 with event handling.
       *
       * @example
       * // Assuming 'myElement' is a reference to a DOM element
       * const myOperation = complete.bind({ _element: myElement });
       * myOperation(); // This will remove the class and trigger the event.
       */
      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);

        EventHandler.trigger(this._element, EVENT_SHOWN);
/**
 * Displays the element by triggering the show event and applying the necessary classes.
 * If the show event is prevented, the function will exit early.
 * This method also handles animation and schedules a hide operation if necessary.
 *
 * @throws {Error} Throws an error if the element is not defined or if there is an issue with the animation.
 *
 * @example
 * const myElement = document.getElementById('myElement');
 * const myInstance = new MyClass(myElement);
 * myInstance.show();
 */

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
       * Completes the hiding process of the associated element.
       * This method removes specific CSS classes from the element to
       * ensure it is no longer visible and triggers an event indicating
       * that the element has been hidden.
       *
       /**
        * Hides the associated element by removing its visible classes and triggering the appropriate events.
        *
        * This method checks if the element is currently visible. If it is not, the method exits early.
        * It triggers a 'hide' event before proceeding to hide the element. If the event is prevented,
        * the method will also exit without making any changes.
        *
        * The method adds a 'showing' class to indicate that the hiding process is in progress. Once the
        * hiding animation is complete, it removes the 'showing' and 'show' classes and adds a 'hide' class
        * (note that adding the 'hide' class is deprecated).
        *
        * Finally, it triggers a 'hidden' event to notify that the element has been fully hidden.
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
       * @throws {Error} Throws an error if the element is not defined or
       * if there is an issue with triggering the event.
       *
       * @example
       * // Assuming `myElement` is a valid DOM element
       * const myComponent = new MyComponent(myElement);
       * myComponent.complete();
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
     * Cleans up and disposes of the current instance, removing any associated resources.
     * This method clears any active timeouts and removes the 'show' class from the element
     * if it is currently present, indicating that the element should no longer be visible.
     * It also calls the parent class's dispose method to ensure proper cleanup of inherited resources.
     *
     * @throws {Error} Throws an error if the element is not properly initialized or if
     *                 there are issues during the disposal process.
     *
     * @example
     * const instance = new MyClass();
     * instance.dispose(); // Cleans up the instance and removes visibility from the element.
     */
    dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }

      super.dispose();
    } // Private


    /**
     * Merges the default configuration with the provided configuration and
     * data attributes from the element.
     *
     * This method retrieves the configuration settings for the component,
     * ensuring that all necessary defaults are applied. It checks if the
     * provided configuration is an object and merges it with the default
     * settings and any data attributes found on the element.
     *
     * @param {Object} config - The configuration object to be merged with defaults.
     *                          If not provided or not an object, defaults will be used.
     * @returns {Object} The final configuration object after merging.
     *
     * @throws {TypeError} Throws an error if the provided configuration does not
     *                     match the expected type defined in DefaultType.
     *
     * @example
     * const finalConfig = this._getConfig({ customSetting: true });
     * // finalConfig will contain merged settings including customSetting and defaults.
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
     * Schedules the hiding of an element based on the current interaction state
     * and configuration settings.
     *
     * This method checks if the autohide feature is enabled and whether there
     * is any mouse or keyboard interaction. If autohide is enabled and there
     * is no interaction, it sets a timeout to hide the element after a specified
     * delay.
     *
     * @returns {void} This method does not return a value.
     *
     * @throws {Error} Throws an error if the configuration is invalid or if
     *                 there is an issue with setting the timeout.
     *
     * @example
     * // Assuming the instance has autohide enabled and no interaction
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
     * Updates internal state based on the type of interaction and whether the user is interacting.
     *
     * @param {Event} event - The event object representing the interaction.
     * @param {boolean} isInteracting - A flag indicating whether the interaction is ongoing.
     *
     * @returns {void}
     *
     * @throws {Error} Throws an error if the event type is not recognized.
     *
     * @example
     * // Example usage:
     * element.addEventListener('mouseover', (event) => this._onInteraction(event, true));
     * element.addEventListener('mouseout', (event) => this._onInteraction(event, false));
     *
     * @description
     * This method processes different types of interaction events:
     * - For mouse events ('mouseover', 'mouseout'), it updates the mouse interaction state.
     * - For keyboard focus events ('focusin', 'focusout'), it updates the keyboard interaction state.
     *
     * If the user is interacting, it clears any existing timeout. If not, it checks if the next element
     * related to the event is the same as the current element or a descendant. If not, it may schedule a hide action.
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
     * Sets up event listeners for mouse and focus interactions on the specified element.
     * This method binds the following events:
     * - Mouse over
     * - Mouse out
     * - Focus in
     * - Focus out
     *
     * Each event triggers the `_onInteraction` method with a boolean indicating whether
     * the interaction is starting (true) or ending (false).
     *
     * @throws {Error} Throws an error if the element is not defined or if event binding fails.
     *
     * @example
     * // Assuming 'element' is a valid DOM element
     * const instance = new SomeClass(element);
     * instance._setListeners();
     */
    _setListeners() {
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
    }

    /**
     * Clears the timeout that was previously set using `setTimeout`.
     * This method resets the internal timeout reference to null,
     * ensuring that no further actions are taken after the timeout
     * has been cleared.
     *
     * @throws {Error} Throws an error if the timeout is not set
     *                 or if there is an issue with clearing the timeout.
     *
     * @example
     * const instance = new SomeClass();
     * instance._timeout = setTimeout(() => {
     *   console.log('This will not run');
     * }, 1000);
     * instance._clearTimeout(); // Clears the timeout
     */
    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    } // Static


    /**
     * Initializes or retrieves an instance of the Toast component for each element in the jQuery collection.
     * This method can also invoke specific methods on the Toast instance if a string is provided as the config parameter.
     *
     * @static
     * @param {Object|string} config - Configuration options for the Toast instance or a method name to invoke.
     * @returns {jQuery} The jQuery collection for chaining.
     * @throws {TypeError} Throws an error if a method name is provided that does not exist on the Toast instance.
     *
     * @example
     * // Initialize a Toast instance with default options
     * $('.toast').jQueryInterface();
     *
     * @example
     * // Call a specific method on the Toast instance
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
//# sourceMappingURL=bootstrap.bundle.js.map
