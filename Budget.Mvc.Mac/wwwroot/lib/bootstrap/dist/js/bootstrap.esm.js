/*!
  * Bootstrap v5.1.0 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
import * as Popper from '@popperjs/core';

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
 * Determines the type of a given object.
 *
 * This function checks if the provided object is null or undefined,
 * returning a string representation of the object in those cases.
 * For all other objects, it utilizes the internal `toString` method
 * to identify and return the object's type in lowercase.
 *
 * @param {*} obj - The object whose type is to be determined.
 * @returns {string} A string representing the type of the object.
 *
 * @example
 * toType(null); // "null"
 * toType(undefined); // "undefined"
 * toType(123); // "number"
 * toType("Hello"); // "string"
 * toType([]); // "array"
 * toType({}); // "object"
 *
 * @throws {TypeError} Will throw an error if the input is not a valid object.
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
 * @param {string} prefix - The prefix to which a random number will be appended to create the UID.
 * @returns {string} A unique identifier that does not conflict with existing element IDs in the document.
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
 * The function first checks for a `data-bs-target` attribute. If it is not present or is set to '#',
 * it then checks the `href` attribute of the element. The function ensures that the selector is either
 * an ID (starting with '#') or a class (starting with '.'). If a full URL is provided, it extracts
 * the anchor part if it exists.
 *
 * @param {HTMLElement} element - The HTML element from which to retrieve the selector.
 * @returns {string|null} - Returns a valid selector string if found; otherwise, returns null.
 *
 * @example
 * const element = document.querySelector('a');
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
 * Retrieves a CSS selector for a given DOM element.
 *
 * This function attempts to generate a selector string from the provided element using the
 * `getSelector` function. If a valid selector is generated, it checks if an element matching
 * that selector exists in the document. If so, it returns the selector; otherwise, it returns null.
 *
 * @param {Element} element - The DOM element for which to retrieve the selector.
 * @returns {string|null} The CSS selector string if a matching element exists, otherwise null.
 *
 * @example
 * const element = document.getElementById('myElement');
 * const selector = getSelectorFromElement(element);
 * console.log(selector); // Outputs the selector or null if not found.
 *
 * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
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
 * @returns {Element|null} The first matching DOM element or null if no matching element is found.
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
 * This function retrieves the computed styles of the element to determine
 * the transition duration and delay. If the element is not provided or
 * if no transition duration or delay is found, it returns 0.
 *
 * @param {HTMLElement} element - The DOM element for which to calculate the transition duration.
 * @returns {number} The total transition duration in milliseconds. Returns 0 if the element is null or if no valid transition duration is found.
 *
 * @example
 * const duration = getTransitionDurationFromElement(document.querySelector('.my-element'));
 * console.log(duration); // Outputs the transition duration in milliseconds.
 *
 * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
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
 * allowing other event listeners to react accordingly.
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
 * This function checks if the input is an object and verifies if it has a
 * `nodeType` property, which is characteristic of DOM elements. If the
 * input is a jQuery object, it extracts the underlying DOM element.
 *
 * @param {Object} obj - The object to be checked.
 * @returns {boolean} Returns true if the object is a DOM element; otherwise, false.
 *
 * @example
 * const div = document.createElement('div');
 * console.log(isElement(div)); // true
 *
 * const $div = $(div);
 * console.log(isElement($div)); // true
 *
 * console.log(isElement(null)); // false
 * console.log(isElement({})); // false
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
 * If the input is a jQuery object, the first element of the jQuery collection is returned.
 * If the input is a string representing a CSS selector, the corresponding DOM element is returned.
 * If the input does not match either case, null is returned.
 *
 * @param {Object|string} obj - The input to retrieve the element from.
 *                              This can be a jQuery object, a DOM element, or a string selector.
 * @returns {Element|null} - The corresponding DOM element if found, otherwise null.
 *
 * @example
 * // Using a jQuery object
 * const element = getElement($('#myElement'));
 *
 * // Using a CSS selector
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
 * const config = { propA: 'string', propB: 123 };
 * const configTypes = { propA: 'string', propB: 'number' };
 *
 * typeCheckConfig('MyComponent', config, configTypes);
 *
 * // Throws TypeError: MYCOMPONENT: Option "propB" provided type "string" but expected type "number".
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
 * Checks if a given HTML element is visible in the viewport.
 *
 * An element is considered visible if it is a valid HTML element and has a
 * non-zero size (i.e., it has client rectangles). Additionally, the element's
 * computed style must indicate that its visibility property is set to 'visible'.
 *
 * @param {HTMLElement} element - The HTML element to check for visibility.
 * @returns {boolean} Returns true if the element is visible; otherwise, false.
 *
 * @throws {TypeError} Throws an error if the provided argument is not an
 *                     instance of HTMLElement.
 *
 * @example
 * const myElement = document.getElementById('myElement');
 * const isMyElementVisible = isVisible(myElement);
 * console.log(isMyElementVisible); // true or false based on visibility
 */
const isVisible = element => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false;
  }

  return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
};

/**
 * Checks if a given HTML element is disabled.
 *
 * This function evaluates the state of an element to determine if it is considered
 * disabled based on various criteria, including its class list, the `disabled` property,
 * and the presence of a `disabled` attribute.
 *
 * @param {HTMLElement} element - The HTML element to check. If the element is null or not an
 *                                 instance of an HTMLElement, the function will return true.
 * @returns {boolean} Returns true if the element is disabled; otherwise, returns false.
 *
 * @example
 * const button = document.querySelector('button');
 * const result = isDisabled(button);
 * console.log(result); // Outputs true or false based on the button's state.
 *
 * @throws {TypeError} Throws a TypeError if the provided argument is not an HTMLElement.
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
 * If the browser does not support Shadow DOM, it returns null.
 *
 * @param {Element} element - The element from which to start the search for the Shadow DOM root.
 * @returns {ShadowRoot|null} The ShadowRoot if found, otherwise null.
 *
 * @throws {TypeError} Throws a TypeError if the provided element is not a valid DOM element.
 *
 * @example
 * const shadowRoot = findShadowRoot(someElement);
 * if (shadowRoot) {
 *   console.log('Shadow root found:', shadowRoot);
 * } else {
 *   console.log('No shadow root found.');
 * }
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
 * This function can be used as a placeholder in situations where a function is required,
 * but no action is desired. It is commonly used in callbacks or as a default function
 * argument.
 *
 * @function noop
 * @returns {void} This function does not return any value.
 *
 * @example
 * // Using noop as a default callback
 * function executeCallback(callback = noop) {
 *   callback();
 * }
 *
 * executeCallback(); // No operation performed
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
 * Retrieves the jQuery object from the global window scope if it exists
 * and the body does not have the 'data-bs-no-jquery' attribute.
 *
 * @returns {jQuery|null} The jQuery object if available, otherwise null.
 *
 * @example
 * const $ = getjQuery();
 * if ($) {
 *   // jQuery is available, proceed with jQuery operations
 * } else {
 *   // jQuery is not available, handle accordingly
 * }
 *
 * @throws {Error} Throws an error if there is an issue accessing the window object.
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
 * Registers a callback function to be executed when the DOM content is fully loaded.
 * If the document is already in a loaded state, the callback is invoked immediately.
 *
 * @param {Function} callback - The function to be called once the DOM is ready.
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
 * @returns {boolean} Returns true if the document direction is RTL, otherwise false.
 *
 * @example
 * if (isRTL()) {
 *   console.log("The document is in right-to-left mode.");
 * } else {
 *   console.log("The document is in left-to-right mode.");
 * }
 */
const isRTL = () => document.documentElement.dir === 'rtl';

/**
 * Defines a jQuery plugin by attaching it to the jQuery prototype.
 * This function initializes the plugin when the DOM content is fully loaded.
 *
 * @param {Object} plugin - The plugin object that contains the plugin's properties and methods.
 * @param {string} plugin.NAME - The name of the plugin to be used as the jQuery method.
 * @param {Function} plugin.jQueryInterface - The function that serves as the jQuery interface for the plugin.
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
 * @throws {TypeError} Throws an error if the plugin object does not contain a valid NAME or jQueryInterface.
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
 * This function checks the type of the provided callback argument and
 * invokes it if it is a valid function. If the callback is not a function,
 * no action is taken.
 *
 * @param {Function} callback - The function to be executed.
 * @throws {TypeError} Throws an error if the callback is not a function.
 *
 * @example
 * // Example usage:
 * execute(() => {
 *   console.log('Callback executed!');
 * });
 *
 * // If a non-function is passed:
 * execute(123); // No action taken, no error thrown.
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
 * @param {Element} transitionElement - The DOM element that is undergoing the transition.
 * @param {boolean} [waitForTransition=true] - Indicates whether to wait for the transition to complete before executing the callback.
 *
 * @throws {Error} Throws an error if the transitionElement is not a valid DOM element.
 *
 * @example
 * // Example usage:
 * const element = document.querySelector('.my-element');
 * executeAfterTransition(() => {
 *   console.log('Transition completed!');
 * }, element);
 *
 * @example
 * // Example usage without waiting for transition:
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
   * Handles the transition end event for a specific element.
   *
   * This function is invoked when a transition ends on the specified target element.
   * If the target does not match the expected transition element, the function exits early.
   * Once the transition is confirmed, it removes the event listener and executes the provided callback function.
   *
   * @param {Object} event - The event object associated with the transition end event.
   * @param {HTMLElement} event.target - The element that triggered the transition end event.
   *
   * @throws {Error} Throws an error if the target element is not defined or does not match the expected element.
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
 * Returns the previous or next element from a list based on the provided parameters.
 *
 * This function allows for cycling through the elements of a list. If the active element is not found,
 * it will return either the first or last element depending on the direction specified and whether cycling is allowed.
 *
 * @param {Array} list - The list of elements to traverse.
 * @param {Element} activeElement - The currently active element from which to determine the next or previous element.
 * @param {boolean} shouldGetNext - A flag indicating whether to retrieve the next element (true) or the previous element (false).
 * @param {boolean} isCycleAllowed - A flag indicating whether cycling through the list is permitted.
 * @returns {Element|undefined} The next or previous element in the list, or undefined if no valid element is found.
 *
 * @example
 * const elements = ['a', 'b', 'c', 'd'];
 * const current = 'b';
 * const nextElement = getNextActiveElement(elements, current, true, true); // returns 'c'
 * const prevElement = getNextActiveElement(elements, current, false, true); // returns 'a'
 * const cycleElement = getNextActiveElement(elements, 'd', true, true); // returns 'a' if cycling is allowed
 *
 * @throws {TypeError} Throws an error if the list is not an array.
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
 * If so, it combines the uid with an incrementing counter to create a unique
 * event identifier. If no uid is provided, it falls back to the element's
 * existing uidEvent or generates a new one using an internal counter.
 *
 * @param {HTMLElement} element - The DOM element for which the unique event ID is being generated.
 * @param {string} [uid] - An optional user-defined unique identifier. If provided, it will be used to create the event ID.
 * @returns {string} A unique event identifier in the format 'uid::counter' or just the counter if no uid is provided.
 *
 * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
 *
 * @example
 * const button = document.querySelector('button');
 * const uniqueId = getUidEvent(button, 'clickEvent');
 * console.log(uniqueId); // Outputs: 'clickEvent::1' (or similar based on the counter)
 */
function getUidEvent(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}

/**
 * Retrieves the event registry for a specified DOM element.
 *
 * This function generates a unique identifier for the given element and
 * initializes an event registry entry if it does not already exist.
 * The registry is used to store event-related data associated with the element.
 *
 * @param {HTMLElement} element - The DOM element for which to retrieve the event registry.
 * @returns {Object} The event registry object associated with the specified element.
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
 * Creates a bootstrap handler function that delegates an event to a specified element.
 *
 * This function returns a new handler function that, when invoked, sets the `delegateTarget`
 * property of the event to the provided element. If the handler is marked as one-off, it will
 * automatically remove itself from the event listener after being called once.
 *
 * @param {HTMLElement} element - The element to which the event is delegated.
 * @param {Function} fn - The function to be executed when the event is triggered.
 * @returns {Function} A handler function that can be used as an event listener.
 *
 * @example
 * const button = document.querySelector('button');
 * const handleClick = bootstrapHandler(button, function(event) {
 *   console.log('Button clicked!', event);
 * });
 * button.addEventListener('click', handleClick);
 *
 * @throws {TypeError} Throws an error if the provided element is not an instance of HTMLElement.
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
 * This function returns a handler that can be used to manage events
 * for dynamically added elements that match the selector.
 *
 * @param {Element} element - The DOM element to which the event delegation
 *                            is applied.
 * @param {string} selector - A string representing a selector to match
 *                            against the descendants of the element.
 * @param {Function} fn - The function to execute when the event is triggered
 *                        on a matching element.
 * @returns {Function} A handler function that processes the event and
 *                    delegates it to the appropriate target.
 *
 * @example
 * const buttonHandler = bootstrapDelegationHandler(parentElement, '.btn', function(event) {
 *   console.log('Button clicked:', event.delegateTarget);
 * });
 *
 * // Attach the handler to an event
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
 * @param {Object} events - An object containing event data, where each key is a unique identifier for an event.
 * @param {Function} handler - The event handler function to search for within the events.
 * @param {string|null} [delegationSelector=null] - An optional selector string used for event delegation. If not provided, defaults to null.
 * @returns {Object|null} The event object if found, or null if no matching event is found.
 *
 * @example
 * const events = {
 *   '1': { originalHandler: myHandler, delegationSelector: '.my-selector' },
 *   '2': { originalHandler: anotherHandler, delegationSelector: null }
 * };
 * const result = findHandler(events, myHandler, '.my-selector');
 * // result will be { originalHandler: myHandler, delegationSelector: '.my-selector' }
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
 * This function processes the original event type, handler, and an optional delegation function,
 * returning a standardized set of parameters that can be used for event registration.
 *
 * @param {string} originalTypeEvent - The original type of the event (e.g., 'click', 'mouseover').
 * @param {Function|string} handler - The event handler function or a string representing a delegated selector.
 * @param {Function} [delegationFn] - An optional delegation function to be used if the handler is a string.
 *
 * @returns {[boolean, Function, string]} An array containing:
 *   - A boolean indicating if the handler is a delegation (true if it's a string).
 *   - The original handler function to be used.
 *   - The normalized event type as a string.
 *
 * @throws {TypeError} Throws an error if the originalTypeEvent is not a string.
 *
 * @example
 * const [isDelegation, handlerFn, eventType] = normalizeParams('click', '.btn', handleClick);
 * // isDelegation will be true, handlerFn will be the handleClick function, and eventType will be 'click'.
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
 * This function normalizes the parameters and handles custom events, ensuring that the event handler
 * is properly wrapped to prevent unintended behavior for mouseenter and mouseleave events.
 *
 * @param {HTMLElement} element - The DOM element to which the event handler will be attached.
 * @param {string} originalTypeEvent - The type of the event (e.g., 'click', 'mouseenter').
 * @param {Function} [handler] - The function to execute when the event is triggered.
 * @param {Function} [delegationFn] - An optional function for event delegation.
 * @param {boolean} [oneOff=false] - If true, the handler will be executed at most once after being added.
 *
 * @throws {TypeError} Throws an error if `originalTypeEvent` is not a string or if `element` is not provided.
 *
 * @example
 * // Adding a click handler to a button
 * addHandler(document.querySelector('button'), 'click', function() {
 *   console.log('Button clicked!');
 * });
 *
 * @example
 * // Adding a delegated click handler
 * addHandler(document.querySelector('.parent'), 'click', function() {
 *   console.log('Child clicked!');
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
     * is a descendant of the event's delegate target.
     *
     * This is useful for event delegation scenarios where you want to ignore events
     * that originate from child elements of a specific target.
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
     * @throws {TypeError} Throws an error if the provided `fn` is not a function.
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
 * will exit without making any changes.
 *
 * @param {HTMLElement} element - The DOM element from which the event handler should be removed.
 * @param {Object} events - An object containing event handlers associated with the element.
 * @param {string} typeEvent - The type of event (e.g., 'click', 'mouseover') for which the handler is registered.
 * @param {Function} handler - The specific event handler function to be removed.
 * @param {string} [delegationSelector] - An optional selector string for event delegation. If provided,
 *                                         the handler will only be removed if it matches this selector.
 *
 * @returns {void} This function does not return a value.
 *
 * @throws {Error} Throws an error if the element is not a valid DOM element or if events is not an object.
 *
 * @example
 * // Example usage:
 * const button = document.querySelector('button');
 * const handleClick = () => console.log('Button clicked!');
 * const events = {
 *   click: {}
 * };
 *
 * // Adding event listener (not shown in this documentation)
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
 * This function iterates through the stored event handlers for a specified event type
 * and removes those that match the provided namespace.
 *
 * @param {HTMLElement} element - The DOM element from which to remove the event handlers.
 * @param {Object} events - An object containing event handlers indexed by event type.
 * @param {string} typeEvent - The type of event (e.g., 'click', 'mouseover') for which handlers should be removed.
 * @param {string} namespace - The namespace to match against the handler keys for removal.
 *
 * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
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
 * This function allows for the extraction of the base event name from a namespaced event.
 * For example, it converts 'click.bs.button' to 'click'. If the event is not found in the
 * custom events registry, it returns the original event name.
 *
 * @param {string} event - The namespaced event string to be processed.
 * @returns {string} The base event type or the original event name if not found in custom events.
 *
 * @example
 * const eventType = getTypeEvent('click.bs.button');
 * console.log(eventType); // Outputs: 'click'
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
 * This function sets up an event listener on the document that listens for click events
 * on elements with a specific data attribute. When such an element is clicked, it will
 * invoke the specified method on the component instance.
 *
 * @param {Object} component - The component for which the dismiss trigger is being enabled.
 * @param {string} [method='hide'] - The method to be called on the component instance when the dismiss event occurs.
 *                                   Defaults to 'hide'.
 *
 * @throws {Error} Throws an error if the component does not have the specified method.
 *
 * @example
 * // Assuming `Alert` is a Bootstrap component with a dismissible feature
 * enableDismissTrigger(Alert, 'close');
 *
 * @example
 * // Enabling dismiss trigger with default method 'hide'
 * enableDismissTrigger(Modal);
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
 * Normalizes a given input value into a more usable format.
 *
 * This function takes a string representation of a value and converts it to its
 * corresponding JavaScript type. It handles the following conversions:
 * - The string 'true' is converted to the boolean true.
 * - The string 'false' is converted to the boolean false.
 * - Numeric strings are converted to their corresponding number type.
 * - The empty string or the string 'null' is converted to null.
 * - Any other string remains unchanged.
 *
 * @param {string} val - The input value as a string to be normalized.
 * @returns {boolean|null|number|string} The normalized value, which can be
 *          a boolean, null, number, or the original string.
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
 * into a format suitable for certain data conventions, such as CSS or
 * HTML attributes.
 *
 * @param {string} key - The data key to be normalized.
 * @returns {string} The normalized data key with hyphens before lowercase letters.
 *
 * @example
 * // returns 'data-key'
 * normalizeDataKey('dataKey');
 *
 * @example
 * // returns 'my-custom-key'
 * normalizeDataKey('myCustomKey');
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
    /**
     * Cleans up and disposes of the instance, removing event listeners and
     * associated data from the element.
     *
     * This method is typically called when the instance is no longer needed,
     * allowing for proper memory management by nullifying properties and
     * detaching event handlers.
     *
     * @throws {Error} Throws an error if the element is not properly initialized.
     *
     * @example
     * const instance = new MyClass(element);
     * // ... use the instance ...
     * instance.dispose(); // cleans up the instance
     */
    }

    return parents;
  },

  prev(element, selector) {
    let previous = element.previousElementSibling;

    /**
     * Queues a callback to be executed after a transition completes.
     *
     * This method allows for the execution of a specified callback function
     * once a transition on a given element has finished. It can be configured
     * to handle animated transitions.
     *
     * @param {Function} callback - The function to be executed after the transition.
     * @param {Element} element - The DOM element that is undergoing the transition.
     * @param {boolean} [isAnimated=true] - Indicates whether the transition is animated.
     * If true, the callback will be executed after the animated transition;
     * if false, it will execute immediately.
     *
     * @throws {Error} Throws an error if the callback is not a function or if the element is not valid.
     *
     * @example
     * _queueCallback(() => {
     *   console.log('Transition completed!');
     * }, document.getElementById('myElement'));
     */
    while (previous) {
      if (previous.matches(selector)) {
        return [previous];

      previous = previous.previousElementSibling;
    /**
     * Retrieves an instance of the data associated with a specified element.
     *
     * This static method accesses the underlying data storage to fetch the
     * instance linked to the provided element. It utilizes a unique data key
     * to ensure that the correct data is retrieved.
     *
     * @static
     * @param {HTMLElement} element - The DOM element for which the data instance is to be retrieved.
     * @returns {Object|null} The data instance associated with the element, or null if no instance exists.
     *
     * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
     *
     * @example
     * const myElement = document.getElementById('myElement');
     * const instance = MyClass.getInstance(myElement);
     * if (instance) {
     *   console.log('Data instance retrieved:', instance);
     * } else {
     *   console.log('No data instance found for the specified element.');
     * }
     */
    }

    return [];
  },
/**
 * Retrieves an existing instance of the class associated with the given element,
 * or creates a new instance if none exists.
 *
 * @static
 * @param {HTMLElement} element - The DOM element associated with the instance.
 * @param {Object} [config={}] - Optional configuration object for the new instance.
 * @returns {Object} The existing or newly created instance of the class.
 *
 * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
 *
 * @example
 * const instance = MyClass.getOrCreateInstance(document.getElementById('myElement'), { option: true });
 */

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
/**
 * Closes the element associated with the instance.
 *
 * This method triggers a close event and removes the show class from the element.
 * If the close event is prevented, the method will exit early without making any changes.
 * After removing the class, it checks if the element is animated and queues a callback
 * to destroy the element once the animation is complete.
 *
 * @throws {Error} Throws an error if the element is not properly initialized.
 *
 * @example
 * const instance = new SomeClass();
 * instance.close();
 */
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
/**
 * Removes the associated element from the DOM and triggers the closed event.
 * This method is responsible for cleaning up the element and disposing of any resources.
 *
 * @throws {Error} Throws an error if the element cannot be removed.
 *
 * @example
 * const instance = new SomeClass();
 * instance._destroyElement();
 * // The element is removed and the closed event is triggered.
 */
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
const POINTER_TYPE_TOUCH = 'touch';
const POINTER_TYPE_PEN = 'pen';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 /**
  * jQuery interface for the Alert component.
  * This method allows the invocation of Alert instance methods via jQuery.
  *
  * @static
  * @param {string|Object} config - The configuration option or method name to invoke on the Alert instance.
  * If an object is passed, it is treated as configuration options.
  *
  * @throws {TypeError} Throws an error if the specified method does not exist,
  * starts with an underscore, or is the constructor.
  *
  * @returns {jQuery} The jQuery object for chaining.
  *
  * @example
  * // To show an alert using jQuery
  * $('#myAlert').Alert('show');
  *
  * @example
  * // To configure the alert
  * $('#myAlert').Alert({ /* configuration options */
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

    /**
     * Toggles the active state of the associated element by adding or removing
     * a specific class. It also synchronizes the `aria-pressed` attribute to
     * reflect the current state of the toggle.
     *
     * This method modifies the class list of the element and updates the
     * accessibility attribute to ensure that assistive technologies can
     * accurately convey the current state of the toggle to users.
     *
     * @throws {Error} Throws an error if the element is not defined or does not
     *                 support classList manipulation.
     *
     * @example
     * const toggleButton = new ToggleButton(element);
     * toggleButton.toggle(); // Toggles the active state and updates aria-pressed
     */
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }

    if (this._config && this._config.interval && !this._isPaused) {
      /**
       * jQuery interface for the Button component.
       * This method allows for the manipulation of Button instances using jQuery.
       * It can handle various configurations passed as a parameter.
       *
       * @param {string} config - The configuration option to apply to the Button instance.
       *                          If 'toggle' is passed, it will toggle the Button's state.
       *
       * @returns {jQuery} The jQuery object for chaining.
       *
       * @example
       * // To toggle the button state
       * $('.btn').jQueryInterface('toggle');
       *
       * @throws {TypeError} Throws an error if the config is not a valid option.
       */
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
     * This function captures the initial X coordinate of a touch or pointer event
     * based on the type of event being processed. It differentiates between pointer
     * events (such as pen or touch) and traditional touch events.
     *
     * @param {PointerEvent|TouchEvent} event - The event object representing the
     *        pointer or touch event that has occurred.
     *
     * @returns {void} This function does not return a value.
     *
     * @throws {TypeError} Throws an error if the event parameter is not of type
     *         PointerEvent or TouchEvent.
     *
     * @example
     * // Example usage in a pointer event listener
     * element.addEventListener('pointerdown', start);
     *
     * // Example usage in a touch event listener
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
     * Handles the movement event for touch interactions.
     * This function calculates the horizontal distance moved by the touch event,
     * ensuring that it only responds to single touch gestures and ignores pinch gestures.
     *
     * @param {TouchEvent} event - The touch event object containing information about the touch.
     * @throws {Error} Throws an error if the event does not contain touch information.
     *
     * @example
     * // Example usage within a touch event listener
     * element.addEventListener('touchmove', move);
     */
    const move = event => {
      // ensure swiping with one touch and not pinching
      this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
    };

    /**
     * Handles the end of a pointer event, calculating the swipe distance and managing
     * the carousel's cycling behavior based on user interaction.
     *
     * This function is triggered when a pointer event ends, such as a touch or pen input.
     * It calculates the difference in X position from the start of the touch and
     * invokes the swipe handling logic. If the configuration is set to pause on hover,
     * it pauses the carousel and sets a timeout to resume cycling after a specified interval.
     *
     * @param {PointerEvent} event - The pointer event that triggered this handler.
     * @throws {Error} Throws an error if the event does not have a valid pointer type.
     *
     * @example
     * // Example usage:
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

    /**
     * Advances to the next slide in the presentation or carousel.
     *
     * This method triggers the transition to the next slide by invoking the
     * internal slide method with a predefined order constant. It is typically
     * used in scenarios where a user action (like a button click) is intended
     * to move forward in a sequence of slides.
     *
     * @throws {Error} Throws an error if the slide transition fails due to
     *                 an invalid state or configuration.
     *
     * @example
     * // Assuming 'slider' is an instance of a class that contains the next method
     * slider.next();
     */
    if (isCycling) {
      this.pause();
    }

    /**
     * Triggers the next action of a carousel when the page and the carousel element are visible.
     * This function checks if the document is not hidden and if the carousel element is visible
     * before proceeding to call the next method.
     *
     * @throws {Error} Throws an error if the carousel element is not defined or cannot be accessed.
     *
     * @example
     * // Assuming 'carousel' is an instance of a carousel class
     * carousel.nextWhenVisible();
     */
    this._setActiveIndicatorElement(nextElement);

    this._activeElement = nextElement;

    /**
     * Triggers a 'slid' event on the associated element.
     *
     * This function is responsible for notifying listeners that a sliding transition has occurred.
     /**
      * Moves to the previous slide in the presentation or carousel.
      *
      * This method triggers the transition to the slide that precedes the current one.
      * It is typically used in conjunction with navigation controls to allow users
      * to navigate backward through a series of slides.
      *
      * @throws {Error} Throws an error if there are no previous slides available.
      *
      * @example
      * // Assuming 'slider' is an instance of a carousel
      * slider.prev(); // Moves to the previous slide
      */
     * It emits an event with details about the transition, including the related target element,
     * the direction of the slide, and the indices of the elements involved in the transition.
     *
     * @event slid
     /**
      * Pauses the current operation or cycle of the component.
      * If an event is provided, it will determine whether to pause or not.
      * If the component is currently in a transition state, it will trigger the end of that transition.
      *
      * @param {Event} [event] - The event that triggered the pause action.
      * If no event is provided, the component will be paused immediately.
      *
      * @returns {void}
      *
      * @throws {Error} Throws an error if the component is in an invalid state to pause.
      *
      * @example
      * // To pause without an event
      * component.pause();
      *
      * // To pause with an event
      * component.pause(event);
      */
     * @type {CustomEvent}
     * @property {Element} relatedTarget - The element that is being transitioned to.
     * @property {string} direction - The direction of the slide (e.g., 'left', 'right').
     * @property {number} from - The index of the element that is currently active before the transition.
     * @property {number} to - The index of the element that is being transitioned to.
     *
     * @throws {Error} Throws an error if the event cannot be triggered due to an invalid element.
     *
     * @example
     * // Example usage:
     * const myElement = document.querySelector('.my-element');
     * triggerSlidEvent.call({ _element: myElement });
     */
    const triggerSlidEvent = () => {
      /**
       * Manages the execution cycle based on the provided event and configuration.
       * If an event is not provided, it resumes the cycle. If an interval is already set,
       * it clears the existing interval before setting a new one based on the configuration.
       *
       * @param {Event} [event] - The event that triggers the cycle. If not provided,
       *                          the cycle will resume from a paused state.
       *
       * @throws {Error} Throws an error if the configuration is invalid or if the interval
       *                 cannot be set.
       *
       * @returns {void} This function does not return a value.
       *
       * @example
       * // To resume the cycle without an event
       * cycle();
       *
       * // To trigger the cycle with an event
       * cycle(someEvent);
       */
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
       * Completes the sliding transition by updating the class names of the active and next elements.
       * This function is typically called at the end of a sliding animation to ensure that the
       /**
        * Navigate to a specific item in the carousel based on the provided index.
        * This method updates the active element and handles the sliding animation.
        *
        * @param {number} index - The index of the item to navigate to.
        *                         Must be within the bounds of the items array.
        *
        * @returns {void} - This method does not return a value.
        *
        * @throws {Error} - Throws an error if the index is out of bounds.
        *
        * @example
        * // Navigate to the first item in the carousel
        * carousel.to(0);
        *
        * @example
        * // Attempting to navigate to an invalid index (e.g., -1 or greater than the number of items)
        * carousel.to(-1); // No action taken
        * carousel.to(5);  // No action taken if there are less than 6 items
        */
       * correct classes are applied for visual feedback.
       *
       * It removes directional and order class names from the next element, adds an active class name,
       * and removes the active class from the currently active element. It also sets a flag to indicate
       * that sliding is no longer in progress and triggers a sliding event after a short delay.
       *
       * @throws {Error} Throws an error if the elements are not properly initialized or if the
       *                 sliding transition fails.
       *
       * @example
       * // Assuming nextElement and activeElement are defined and represent valid DOM elements
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
      /**
       * Merges the default configuration with the provided configuration and data attributes from the element.
       *
       * This method retrieves the configuration options for a component, ensuring that all necessary defaults are set.
       * It combines the default configuration with any data attributes found on the element and any additional options
       * provided by the user.
       *
       * @param {Object} config - The user-defined configuration object. If not provided, defaults will be used.
       * @returns {Object} The merged configuration object containing default values, data attributes, and user-defined options.
       *
       * @throws {TypeError} Throws an error if the provided config is not an object when expected.
       *
       * @example
       * const userConfig = { option1: true };
       * const finalConfig = _getConfig(userConfig);
       * // finalConfig will contain merged values from Default$a, data attributes, and userConfig
       */
      triggerSlidEvent();
    }

    if (isCycling) {
      this.cycle();
    }
  }

  _directionToOrder(direction) {
    /**
     * Handles the swipe gesture by determining the direction of the swipe
     * based on the horizontal touch movement. If the swipe distance exceeds
     * a predefined threshold, it triggers a slide action in the appropriate
     * direction.
     *
     * @method
     * @private
     * @returns {void} This method does not return a value.
     *
     * @throws {Error} Throws an error if the swipe direction cannot be determined.
     *
     * @example
     * // Example usage within a touch event handler
     * this._handleSwipe();
     */
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
      /**
       * Initializes event listeners based on the configuration settings.
       * This method sets up keyboard event handling, hover pause functionality,
       * and touch event listeners if supported.
       *
       * @private
       * @returns {void}
       *
       * @throws {Error} Throws an error if the event handler cannot be attached.
       *
       * @example
       * // Assuming this method is called within a class context
       * this._addEventListeners();
       *
       * @description
       * - If keyboard interaction is enabled in the configuration, it listens for
       *   keydown events and triggers the corresponding handler.
       * - If the pause configuration is set to 'hover', it adds mouseenter and
       *   mouseleave event listeners to pause and cycle the element respectively.
       * - If touch support is enabled, it calls another method to add touch event listeners.
       */
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
        /**
         * Initializes touch event listeners for swipe functionality on the element.
         * This method sets up event handlers for touch and pointer events to detect
         * swipe gestures and manage carousel cycling behavior.
         *
         * It handles the following events:
         * - TouchStart: Records the initial touch position.
         * - TouchMove: Calculates the distance moved during a touch.
         * - TouchEnd: Determines the final touch position and triggers swipe handling.
         *
         * If the configuration specifies to pause on hover, it will pause the carousel
         * on touch end and restart it after a timeout to allow for mouse compatibility events.
         *
         * @throws {Error} Throws an error if the element is not properly initialized.
         *
         * @example
         * const carousel = new Carousel(element);
         * carousel._addTouchEventListeners();
         */
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
 /**
  * Handles the keydown event for keyboard navigation.
  * This method checks if the event target is an input or textarea element.
  * If it is, the method returns early to avoid interfering with user input.
  * If the key pressed corresponds to a defined direction, the default action
  * is prevented and a slide action is triggered in the specified direction.
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
 /**
  * Retrieves the index of a specified element within its parent node's item list.
  *
  * This method checks if the provided element has a parent node. If it does,
  * it uses the SelectorEngine to find all items within the parent node
  * that match a specific selector. It then returns the index of the
  * specified element in the resulting list of items.
  *
  * @param {Element} element - The DOM element whose index is to be found.
  * @returns {number} The index of the element within its parent's item list,
  *                   or -1 if the element is not found.
  *
  * @example
  * const index = instance._getItemIndex(someElement);
  * console.log(index); // Outputs the index of someElement or -1 if not found.
  *
  * @throws {TypeError} Throws an error if the provided element is not a valid DOM element.
  */
 * jQuery
 * ------------------------------------------------------------------------
 * add .Carousel to jQuery only if jQuery is present
 */

/**
 * Retrieves the next or previous active element based on the specified order.
 *
 * This method determines whether to fetch the next or previous active element
 * from a list of items, depending on the provided order parameter. It utilizes
 * the `getNextActiveElement` function to perform the retrieval, considering
 * whether wrapping is enabled in the configuration.
 *
 * @param {string} order - The order in which to retrieve the item.
 *                         Should be either 'ORDER_NEXT' for the next item
 *                         or 'ORDER_PREVIOUS' for the previous item.
 * @param {HTMLElement} activeElement - The currently active element from which
 *                                      to determine the next or previous item.
 * @returns {HTMLElement|null} The next or previous active element, or null
 *                            if no such element exists.
 *
 * @throws {Error} Throws an error if the order parameter is invalid.
 *
 * @example
 * const nextElement = this._getItemByOrder(ORDER_NEXT, currentActiveElement);
 * const previousElement = this._getItemByOrder(ORDER_PREVIOUS, currentActiveElement);
 */
defineJQueryPlugin(Carousel);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): collapse.js
 /**
  * Triggers a slide event on the current element.
  *
  * This method calculates the index of the target item and the currently active item,
  * then triggers an event with the relevant details including the direction of the slide,
  * the related target, and the indices of the items involved in the slide.
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
/**
 * Sets the active indicator element based on the provided element.
 * This method updates the class and attributes of the indicators to reflect
 * the currently active item in a carousel or similar component.
 *
 * @param {Element} element - The element representing the current item to be set as active.
 * @throws {Error} Throws an error if the indicators element is not defined.
 *
 * @example
 * // Assuming 'carouselItem' is a valid DOM element representing a carousel item
 * this._setActiveIndicatorElement(carouselItem);
 */
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
/**
 * Updates the interval configuration based on the active element's data attribute.
 * If the active element is not found, the function exits without making changes.
 *
 * The function checks for a 'data-bs-interval' attribute on the active element and
 * updates the interval configuration accordingly. If the attribute is present and
 * contains a valid number, it sets the current interval to this value. If not, it
 * reverts to the default interval if available.
 *
 * @throws {Error} Throws an error if the element is found but the interval cannot be parsed.
 *
 * @returns {void} This function does not return a value.
 *
 * @example
 * // Assuming an active element with data attribute 'data-bs-interval' set to '5000'
 * instance._updateInterval(); // Updates the interval to 5000
 */
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
    /**
     * Slides to the next or previous item in a carousel based on the specified direction or order.
     *
     * This method handles the sliding animation and updates the active item indicator. It also triggers
     * events related to the sliding action and manages the cycling of items if enabled.
     *
     * @param {string|number} directionOrOrder - The direction to slide ('next', 'prev') or an order index.
     * @param {Element} [element] - The specific element to slide to. If not provided, the method determines the next element based on the direction.
     *
     * @throws {Error} Throws an error if the sliding action is already in progress.
     *
     * @returns {void}
     *
     * @example
     * // Slide to the next item
     * carouselInstance._slide('next');
     *
     * // Slide to a specific item
     * carouselInstance._slide(null, specificElement);
     */
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
/**
 * Converts a given direction to an order based on the current text directionality.
 *
 * This function checks if the provided direction is either `DIRECTION_RIGHT` or `DIRECTION_LEFT`.
 * If it is not, the function returns the original direction. If the text direction is right-to-left (RTL),
 * it returns `ORDER_PREV` for `DIRECTION_LEFT` and `ORDER_NEXT` for `DIRECTION_RIGHT`. Conversely,
 * if the text direction is left-to-right (LTR), it returns `ORDER_NEXT` for `DIRECTION_LEFT` and
 * `ORDER_PREV` for `DIRECTION_RIGHT`.
 *
 * @param {string} direction - The direction to be converted. It should be one of the following:
 *                             - `DIRECTION_LEFT`
 *                             - `DIRECTION_RIGHT`
 *
 * @returns {string} The corresponding order based on the text directionality.
 *
 * @throws {Error} Throws an error if the direction is not recognized.
 *
 * @example
 * // Assuming isRTL() returns false
 * const order = _directionToOrder(DIRECTION_LEFT); // Returns ORDER_NEXT
 *
 * // Assuming isRTL() returns true
 * const order = _directionToOrder(DIRECTION_RIGHT); // Returns ORDER_PREV
 */

    const dimension = this._getDimension();

    this._element.classList.remove(CLASS_NAME_COLLAPSE);

    this._element.classList.add(CLASS_NAME_COLLAPSING);

    this._element.style[dimension] = 0;

    this._addAriaAndCollapsedClass(this._triggerArray, true);

    this._isTransitioning = true;
/**
 * Converts an order value to a corresponding direction based on the current text directionality.
 *
 * This function checks if the provided order is either ORDER_NEXT or ORDER_PREV.
 * If it is not, the function returns the original order. If the text direction is right-to-left (RTL),
 * it returns DIRECTION_LEFT for ORDER_PREV and DIRECTION_RIGHT for ORDER_NEXT. Conversely,
 * if the text direction is left-to-right (LTR), it returns DIRECTION_RIGHT for ORDER_PREV and
 * DIRECTION_LEFT for ORDER_NEXT.
 *
 * @param {string} order - The order value to convert, expected to be either ORDER_NEXT or ORDER_PREV.
 * @returns {string} The corresponding direction based on the order and text directionality.
 *
 * @throws {TypeError} Throws an error if the order is not a valid string.
 *
 * @example
 * // Assuming isRTL() returns false
 * const direction = _orderToDirection(ORDER_NEXT); // Returns DIRECTION_LEFT
 *
 * // Assuming isRTL() returns true
 * const direction = _orderToDirection(ORDER_PREV); // Returns DIRECTION_LEFT
 */

    /**
     * Completes the transition of the element by removing the collapsing class,
     * adding the collapse and show classes, and resetting the dimension style.
     *
     * This method is typically called at the end of a collapsing animation to
     * ensure that the element is fully visible and in its final state.
     *
     * @throws {Error} Throws an error if the element is not properly initialized
     *                 or if the transition is already in progress.
     *
     * @example
     * // Assuming `myElement` is an instance of a class that contains this method
     /**
      * Initializes or retrieves an instance of the Carousel component for the specified element.
      * This method can also perform actions on the carousel based on the provided configuration.
      *
      * @static
      * @param {HTMLElement} element - The DOM element that represents the carousel.
      * @param {Object|string|number} config - Configuration options for the carousel or an action to perform.
      *                                          If an object is provided, it will be merged with the existing configuration.
      *                                          If a string is provided, it should be the name of the action to perform.
      *                                          If a number is provided, it indicates the index to which the carousel should slide.
      * @throws {TypeError} Throws an error if an invalid action is specified or if the action method does not exist.
      *
      * @example
      * // Initialize carousel with default settings
      * carouselInterface(document.querySelector('#myCarousel'));
      *
      * // Initialize carousel with custom settings
      * carouselInterface(document.querySelector('#myCarousel'), { interval: 2000, ride: true });
      *
      * // Slide to a specific index
      * carouselInterface(document.querySelector('#myCarousel'), 2);
      *
      * // Perform a specific action on the carousel
      * carouselInterface(document.querySelector('#myCarousel'), 'next');
      */
     * myElement.complete();
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

    /**
     * Initializes the carousel interface for each element in the jQuery collection.
     * This method applies the carousel functionality to the selected elements based on the provided configuration.
     *
     * @static
     * @param {Object} config - The configuration options for the carousel.
     * @returns {jQuery} The jQuery collection for chaining.
     *
     * @example
     * // Initialize carousel with default settings
     * $('.carousel').jQueryInterface();
     *
     * @example
     * // Initialize carousel with custom configuration
     * $('.carousel').jQueryInterface({ interval: 5000, pause: 'hover' });
     *
     * @throws {TypeError} Throws an error if the configuration is not an object.
     */
    if (startEvent.defaultPrevented) {
      return;
    }

    const dimension = this._getDimension();

    /**
     * Handles click events for data API interactions on carousel elements.
     * This method retrieves the target element based on the event context,
     * checks if it is a carousel, and then configures and initializes the
     * carousel instance accordingly.
     *
     * @static
     * @param {Event} event - The click event triggered by the user.
     * @returns {void}
     *
     * @example
     * // Example usage: Attach the handler to a button click
     * buttonElement.addEventListener('click', dataApiClickHandler);
     *
     * @throws {Error} Throws an error if the target element is not found or
     *                 does not have the expected class.
     */
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
     * Completes the transition of an element by resetting its state and triggering the hidden event.
     *
     * This method is typically called at the end of a collapsing transition to ensure that the element
     * is properly marked as collapsed and that any associated events are triggered.
     *
     * @returns {void} This method does not return a value.
     *
     * @throws {Error} Throws an error if the transition is not properly initialized.
     *
     * @example
     * // Example usage of complete method
     * const myElement = new MyElement();
     * myElement.complete();
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
  /**
   * Toggles the visibility of an element.
   * If the element is currently shown, it will be hidden.
   * If the element is currently hidden, it will be shown.
   *
   * @throws {Error} Throws an error if the visibility state cannot be determined.
   *
   * @example
   * const element = new Element();
   * element.toggle(); // Toggles the visibility of the element
   */
  }

  const selector = getSelectorFromElement(this);
  const selectorElements = SelectorEngine.find(selector);
  selectorElements.forEach(element => {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  /**
   * Displays the collapsible element, transitioning it from a hidden to a visible state.
   * This method handles the visibility of the element and ensures that only one collapsible
   * element is shown at a time within the same parent container.
   *
   * @throws {Error} Throws an error if the element is currently transitioning or if it is already shown.
   *
   * @fires EVENT_SHOW$5 - Triggered before the show transition begins.
   * @fires EVENT_SHOWN$5 - Triggered after the show transition has completed.
   *
   * @example
   * const collapsible = new Collapse(element);
   * collapsible.show();
   */
  });
});
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
 * Hides the element by transitioning it out of view.
 *
 * This method checks if the element is currently transitioning or not shown.
 * If either condition is true, the method exits early. It triggers a hide event
 * and prevents the action if the event is canceled. The method then calculates
 * the dimension to be transitioned and applies the necessary styles and classes
 * to initiate the collapse animation.
 *
 * It also updates any associated trigger elements to reflect the collapsed state.
 * Once the transition is complete, it triggers a hidden event.
 *
 * @throws {Error} Throws an error if the element is not found or if there is an issue
 *                 during the transition process.
 *
 * @example
 * // Example usage of hide method
 * const myElement = new MyComponent();
 * myElement.hide();
 */
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
/**
 * Checks if the specified element is currently shown.
 *
 * This method determines if the provided element has the class
 * indicating that it is visible. If no element is provided, it defaults
 * to checking the instance's own element.
 *
 * @param {Element} [element=this._element] - The DOM element to check.
 * If not provided, the method will check the instance's own element.
 *
 * @returns {boolean} Returns true if the element is shown (has the show class),
 * otherwise returns false.
 *
 * @example
 * const isVisible = instance._isShown();
 * console.log(isVisible); // true or false based on the element's visibility
 */

    if (this._inNavbar) {
      Manipulator.setDataAttribute(this._menu, 'popper', 'none');
    } else {
      this._createPopper(parent);
    /**
     * Merges the provided configuration object with default settings and data attributes from the element.
     *
     * This method retrieves data attributes from the associated element, merges them with the default configuration,
     * and applies any additional configurations provided by the user. It also ensures that certain values are coerced
     * into the correct types, such as converting string values to booleans.
     *
     * @param {Object} config - The configuration object to be merged.
     * @param {boolean|string} [config.toggle] - A toggle option that can be a boolean or a string.
     * @param {Element|string} [config.parent] - The parent element or selector for the component.
     *
     * @returns {Object} The final configuration object after merging defaults and user-provided values.
     *
     * @throws {TypeError} Throws an error if the configuration does not match the expected types defined in DefaultType$9.
     *
     * @example
     * const config = _getConfig({ toggle: 'true', parent: '#parentElement' });
     * console.log(config); // Outputs the merged configuration object.
     */
    } // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


    if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
      [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
    }

    this._element.focus();

    /**
     * Retrieves the current dimension of the element based on its class.
     *
     * This method checks if the element has a specific class indicating
     * a horizontal orientation. If the class is present, it returns the
     * width; otherwise, it returns the height.
     *
     * @returns {string} The dimension type, either 'WIDTH' or 'HEIGHT'.
     *
     * @throws {Error} Throws an error if the element is not defined or does not have classList.
     *
     * @example
     * const dimension = instance._getDimension();
     * console.log(dimension); // Outputs 'WIDTH' or 'HEIGHT' based on the element's class.
     */
    this._element.setAttribute('aria-expanded', true);

    this._menu.classList.add(CLASS_NAME_SHOW$6);

    /**
     * Initializes the child elements based on the provided configuration.
     * This method checks if a parent configuration is set and then finds
     * all child elements that match the collapse class within the parent.
     * It also updates the ARIA attributes and collapsed classes for the
     * toggle elements that are not included in the found children.
     *
     * @private
     * @returns {void} This method does not return a value.
     *
     * @throws {Error} Throws an error if the parent configuration is invalid.
     *
     * @example
     * // Assuming this._config.parent is set to a valid DOM element,
     * // calling this method will initialize the child elements accordingly.
     * this._initializeChildren();
     */
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
  /**
   * Updates the ARIA attributes and collapsed class for a given array of elements.
   *
   * This method modifies the class list of each element in the provided array based on the
   * `isOpen` parameter. If `isOpen` is true, it removes the collapsed class; otherwise, it adds
   * the collapsed class. Additionally, it sets the `aria-expanded` attribute to reflect the
   * current state.
   *
   * @param {HTMLElement[]} triggerArray - An array of HTML elements to be updated.
   * @param {boolean} isOpen - A boolean indicating whether the elements should be considered open.
   * @returns {void} This function does not return a value.
   *
   * @example
   * const elements = document.querySelectorAll('.trigger');
   * _addAriaAndCollapsedClass(elements, true); // Removes collapsed class and sets aria-expanded to true
   *
   * @throws {TypeError} Throws an error if triggerArray is not an array of HTML elements.
   */
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
/**
 * jQuery interface for the Collapse component.
 * This method allows for the manipulation of the Collapse component
 * using jQuery syntax. It can handle both string commands to show or
 * hide the component, as well as configuration objects.
 *
 * @static
 * @param {string|Object} config - The configuration or command to execute.
 *                                  If a string, it should be either "show" or "hide".
 *                                  If an object, it should contain configuration options.
 * @returns {jQuery} The jQuery object for chaining.
 *
 * @throws {TypeError} Throws an error if a method specified in the config string
 *                     does not exist on the Collapse instance.
 *
 * @example
 * // To show the collapse element
 * $('.collapse').jQueryInterface('show');
 *
 * @example
 * // To hide the collapse element
 * $('.collapse').jQueryInterface('hide');
 *
 * @example
 * // To initialize with custom configuration
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
    if (typeof Popper === 'undefined') {
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
    this._popper = Popper.createPopper(referenceElement, this._menu, popperConfig);

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
      /**
       * Toggles the visibility of an element.
       * If the element is currently shown, it will be hidden;
       * if it is hidden, it will be shown.
       *
       * @returns {boolean} Returns true if the element is now shown,
       *                   false if it is now hidden.
       *
       * @throws {Error} Throws an error if the visibility state cannot be determined.
       *
       * @example
       * const isVisible = toggle();
       * console.log(isVisible); // Outputs true or false based on the new visibility state.
       */
      ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
    };
  }

  /**
   * Displays the dropdown menu associated with the element.
   *
   * This method checks if the dropdown is disabled or already shown. If not, it triggers a show event,
   * manages the popper instance for positioning, and handles touch-enabled devices by adding mouseover
   * listeners to prevent event delegation issues on iOS.
   *
   * @throws {Error} Throws an error if the element is not properly initialized.
   *
   * @returns {void} This method does not return a value.
   *
   * @example
   * const dropdown = new Dropdown(element);
   * dropdown.show();
   */
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
/**
 * Hides the associated menu element if it is currently shown and not disabled.
 *
 * This method checks if the element is disabled or if the menu is not shown.
 * If either condition is true, the method exits early without performing any action.
 * If the menu is shown and the element is not disabled, it proceeds to hide the menu.
 *
 * @throws {Error} Throws an error if there is an issue during the hide operation.
 *
 * @example
 * const menu = new Menu();
 * menu.hide(); // Hides the menu if it is currently shown and not disabled.
 */

      if (!context || context._config.autoClose === false) {
        continue;
      }

      if (!context._isShown()) {
        continue;
      }

      const relatedTarget = {
        relatedTarget: context._element
      };
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

      if (event) {
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
 * @throws {Error} Throws an error if the popper instance is not initialized properly.
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
      /**
       * Hides the associated menu and cleans up any related event listeners.
       *
       * This method triggers a hide event, and if the event is not prevented,
       * it proceeds to remove any mouseover listeners that may have been added
       * for touch-enabled devices. It also destroys the Popper instance if it exists,
       * removes the show class from the menu and element, updates the aria-expanded
       * attribute, and triggers a hidden event.
       *
       * @param {Element} relatedTarget - The element that triggered the hide action.
       * @throws {Error} Throws an error if the element is not properly initialized.
       *
       * @example
       * // Example usage of _completeHide method
       * const dropdown = new Dropdown(element);
       * dropdown._completeHide(relatedElement);
       */
      }

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
/**
 * Merges the provided configuration object with default settings and data attributes.
 *
 * This method ensures that the configuration is valid by checking the types of its properties.
 * It specifically checks if the 'reference' property is an object and whether it has the required
 * `getBoundingClientRect` method when it is not a DOM element.
 *
 * @param {Object} config - The configuration object to be merged.
 * @returns {Object} The merged configuration object.
 * @throws {TypeError} Throws an error if the 'reference' property is an object without a
 *                     `getBoundingClientRect` method.
 *
 * @example
 * const config = _getConfig({ option1: true });
 * // Returns a merged configuration object with default values and provided options.
 */

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
/**
 * Creates a Popper instance for the dropdown menu.
 *
 * This method initializes the Popper.js library to manage the positioning of the dropdown menu.
 * It determines the reference element based on the configuration and creates a Popper instance
 * with the appropriate settings.
 *
 * @param {Element} parent - The parent element to which the dropdown is attached.
 *
 * @throws {TypeError} Throws an error if Popper.js is not available, indicating that Bootstrap's dropdowns require Popper.
 *
 * @returns {void}
 *
 * @example
 * // Assuming `dropdown` is an instance of a dropdown component
 * dropdown._createPopper(document.querySelector('.dropdown-parent'));
 */

    if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
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
/**
 * Checks if the specified element is currently shown.
 *
 * This method determines if the given element has the class
 * indicating that it is visible. If no element is provided,
 * it defaults to the instance's `_element`.
 *
 * @param {Element} [element=this._element] - The DOM element to check.
 * If not provided, the method will check the instance's `_element`.
 * @returns {boolean} Returns `true` if the element is shown,
 * otherwise returns `false`.
 *
 * @example
 * const isVisible = instance._isShown();
 * console.log(isVisible); // true or false based on visibility
 */
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
  /**
   * Retrieves the next menu element associated with the current element.
   *
   * This method utilizes the SelectorEngine to find the next element that matches
   * the specified menu selector. It is primarily used to navigate through the DOM
   * elements in a structured manner.
   *
   * @returns {Element|null} The next menu element if found, otherwise null.
   *
   * @throws {Error} Throws an error if the selector engine fails to execute.
   *
   * @example
   * const menuElement = instance._getMenuElement();
   * if (menuElement) {
   *   console.log('Menu element found:', menuElement);
   * } else {
   *   console.log('No menu element found.');
   * }
   */
  event.preventDefault();
  Dropdown.getOrCreateInstance(this).toggle();
});
/**
 /**
  * Determines the placement of a dropdown menu based on its parent element's class and computed styles.
  *
  * This method checks the class list of the parent dropdown to ascertain its position.
  * It evaluates specific classes to decide whether the dropdown should be positioned to the right, left,
  * top, or bottom, and whether it should align to the end or start based on custom CSS properties.
  *
  * @returns {string} The placement of the dropdown, which can be one of the following:
  * - 'right' if the parent has the CLASS_NAME_DROPEND class.
  * - 'left' if the parent has the CLASS_NAME_DROPSTART class.
  * - 'topend' or 'top' if the parent has the CLASS_NAME_DROPUP class, depending on the computed style.
  * - 'bottomend' or 'bottom' otherwise, also depending on the computed style.
  *
  * @throws {Error} Throws an error if the parent dropdown is not found or if an unexpected class is encountered.
  *
  * @example
  * const placement = this._getPlacement();
  * console.log(placement); // Outputs the determined placement of the dropdown.
  */
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

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  }
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

  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    /**
     * Retrieves the offset value from the configuration.
     *
     * The method checks the type of the offset defined in the configuration and returns it accordingly:
     * - If the offset is a string, it splits the string by commas and converts each value to an integer.
     * - If the offset is a function, it returns a new function that takes `popperData` as an argument
     *   and calls the original offset function with `popperData` and the current element.
     * - If the offset is neither a string nor a function, it returns the offset directly.
     *
     * @returns {number[]|function} The parsed offset as an array of numbers,
     *                               a function that processes popper data, or the raw offset value.
     *
     * @throws {TypeError} Throws an error if the offset is of an unsupported type.
     *
     * @example
     * // Example usage when offset is a string
     * const offsetArray = instance._getOffset(); // returns [10, 20]
     *
     * // Example usage when offset is a function
     * const offsetFunction = instance._getOffset();
     * const result = offsetFunction(popperData); // returns processed popper data
     */
    return Math.abs(window.innerWidth - documentWidth);
  }

  hide() {
    const width = this.getWidth();

    this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


    this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


    this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

    this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
  }
/**
 * Retrieves the configuration object for the Popper instance.
 * This method constructs a default configuration based on the current
 * instance's settings and modifies it if necessary based on the
 * display type and any custom configurations provided.
 *
 * @returns {Object} The Popper configuration object, which includes
 *                   placement, modifiers, and any additional options
 *                   specified in the instance's configuration.
 *
 * @throws {TypeError} Throws an error if the provided popperConfig
 *                     is not a function or an object.
 *
 * @example
 * const popperConfig = this._getPopperConfig();
 * console.log(popperConfig);
 */

  _disableOverFlow() {
    this._saveInitialAttribute(this._element, 'overflow');

    this._element.style.overflow = 'hidden';
  }

  _setElementAttributes(selector, styleProp, callback) {
    const scrollbarWidth = this.getWidth();

    /**
     * A callback function that manipulates the style of a given DOM element.
     *
     * This function checks if the provided element is different from the current
     * instance's element and whether the window's inner width is greater than
     * the element's client width plus the scrollbar width. If both conditions
     * are met, it proceeds to save the initial attribute of the element and
     * modifies its style property based on a provided callback function.
     *
     * @param {HTMLElement} element - The DOM element to manipulate.
     * @throws {TypeError} Throws an error if the provided element is not an instance of HTMLElement.
     * @returns {void} This function does not return a value.
     *
     * @example
     * // Example usage of manipulationCallBack
     * manipulationCallBack(document.getElementById('myElement'));
     */
    const manipulationCallBack = element => {
      /**
       * Selects a menu item based on the provided key and target element.
       *
       * This method filters the visible items in the menu and allows for cycling through them
       * using keyboard navigation. If the target element is not part of the visible items,
       * it will focus on the next active element based on the key pressed (either ARROW_DOWN_KEY
       * or ARROW_UP_KEY).
       *
       * @param {Object} options - The options for selecting the menu item.
       * @param {string} options.key - The key that was pressed (e.g., ARROW_UP_KEY or ARROW_DOWN_KEY).
       * @param {Element} options.target - The current target element that is focused.
       *
       * @returns {void} This method does not return a value.
       *
       * @throws {Error} Throws an error if the key is not recognized.
       *
       * @example
       * // Example usage of _selectMenuItem
       * _selectMenuItem({ key: ARROW_DOWN_KEY, target: currentFocusedElement });
       */
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

    /**
     * Static method that acts as an interface for the Dropdown component.
     * It allows for the invocation of methods on the Dropdown instance based on the provided configuration.
     *
     * @param {string|Object} config - The configuration for the Dropdown instance.
     *                                  If a string is provided, it should correspond to a method name
     *                                  that can be called on the Dropdown instance.
     * @returns {jQuery} Returns the jQuery object for chaining.
     *
     * @throws {TypeError} Throws an error if the provided config is a string and does not correspond
     *                     to a valid method of the Dropdown instance.
     *
     * @example
     * // Initialize a Dropdown instance with default settings
     * $('.dropdown').Dropdown('toggle');
     *
     * // Call a specific method on the Dropdown instance
     * $('.dropdown').Dropdown('show');
     *
     * // Throws TypeError if the method does not exist
     * $('.dropdown').Dropdown('nonExistentMethod'); // TypeError: No method named "nonExistentMethod"
     */
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

  _resetElementAttributes(selector, styleProp) {
    /**
     * Closes all open dropdown menus in response to a user event.
     *
     * This method checks the event type and conditions to determine whether
     * to close the dropdown menus. It handles both mouse and keyboard events,
     * ensuring that menus are only closed when appropriate based on the
     * configuration of each dropdown instance.
     *
     * @static
     * @param {Event} event - The event that triggered the menu closure.
     *                        This can be a mouse click or a keyboard event.
     *                        If not provided, all menus will be closed.
     * @returns {void}
     *
     * @throws {TypeError} Throws an error if the event is not of type Event.
     *
     * @example
     * // Close menus on a click event
     * document.addEventListener('click', clearMenus);
     *
     * // Close menus on a keyup event
     * document.addEventListener('keyup', clearMenus);
     */
    /**
     * A callback function that manipulates the style of a given HTML element based on its data attributes.
     *
     * This function retrieves the value of a specified data attribute from the element. If the value is undefined,
     * it removes the corresponding CSS property from the element's style. Otherwise, it removes the data attribute
     * and sets the CSS property to the retrieved value.
     *
     * @param {HTMLElement} element - The HTML element whose style is to be manipulated.
     * @throws {TypeError} Throws an error if the provided element is not an instance of HTMLElement.
     *
     * @example
     * // Assuming 'myElement' is a valid HTML element and 'color' is a valid data attribute.
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
 * --------------------------------------------------------------------------
 /**
  * Retrieves the parent element of a given DOM element.
  * If the specified element is not found, it attempts to get the parent node.
  *
  * @param {Element} element - The DOM element from which to retrieve the parent.
  * @returns {Element|null} The parent element of the specified element, or null if no parent exists.
  *
  * @throws {TypeError} Throws an error if the provided argument is not a valid DOM element.
  *
  * @example
  * const childElement = document.querySelector('.child');
  * const parentElement = getParentFromElement(childElement);
  * console.log(parentElement); // Logs the parent element of '.child' or null if it has no parent.
  */
 * Bootstrap (v5.1.0): util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Handles keydown events for dropdown menus.
 * This method determines the appropriate action based on the key pressed and the current state of the dropdown.
 *
 * @static
 * @param {KeyboardEvent} event - The keyboard event triggered by the user.
 *
 * @returns {void}
 *
 * @throws {TypeError} Throws an error if the event is not a valid KeyboardEvent.
 *
 * @example
 * // Example usage within a dropdown component
 * element.addEventListener('keydown', MyDropdown.dataApiKeydownHandler);
 *
 * @description
 * The method checks if the event target is an input or textarea. If so, it handles specific keys:
 * - If the space key is pressed, it does not trigger a dropdown command.
 * - If the escape key is pressed, it hides the dropdown if it is active.
 * - If the up or down arrow keys are pressed, it selects the corresponding menu item.
 * If the dropdown is not active and the space key is pressed, it clears the menus.
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
  }

  /**
   * Calculates the difference between the window's inner width and the document's client width.
   *
   * This function returns the absolute value of the difference, which can be useful for determining
   * how much wider the window is compared to the document content. This is particularly relevant
   * for responsive design and layout adjustments.
   *
   * @returns {number} The absolute difference in pixels between the window's inner width and the document's client width.
   *
   * @example
   * const widthDifference = getWidth();
   * console.log(`The width difference is ${widthDifference}px`);
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes} for more information on innerWidth.
   */
  _append() {
    if (this._isAppended) {
      return;
    }

    this._config.rootElement.append(this._getElement());
/**
 * Hides the element by adjusting its overflow and padding/margin properties.
 * This method calculates the width of the element and applies necessary
 * adjustments to ensure that the layout remains consistent when the element
 * is hidden.
 *
 * The method performs the following actions:
 * - Disables overflow on the element to prevent scrollbar visibility.
 * - Adjusts the `paddingRight` of the main element and fixed content to
 *   account for the hidden scrollbar width.
 * - Modifies the `marginRight` of sticky content to maintain full width
 *   visibility.
 *
 * @throws {Error} Throws an error if the element is not properly initialized
 *                 or if there are issues accessing its dimensions.
 *
 * @example
 * const myElement = new MyElement();
 * myElement.hide();
 */

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

    /**
     * Disables the overflow of the associated element by setting its
     * CSS overflow property to 'hidden'. This method also saves the
     * initial overflow attribute of the element for potential restoration
     * later.
     *
     * @private
     * @method _disableOverFlow
     * @returns {void} This method does not return a value.
     *
     * @throws {Error} Throws an error if the element is not defined or
     *                 if the initial attribute cannot be saved.
     *
     * @example
     * // Example usage:
     * instance._disableOverFlow();
     */
    this._element.remove();

    this._isAppended = false;
  }

  _emulateAnimation(callback) {
    /**
     * Sets the specified style property for elements matching the given selector,
     * applying a transformation to the current computed value of that property.
     *
     * @param {string} selector - A CSS selector string to match elements.
     * @param {string} styleProp - The CSS property to be modified (e.g., 'width', 'height').
     * @param {function} callback - A function that takes the current value of the style property
     *                              and returns a new value to be set.
     *                              The value is expected to be in pixels.
     *
     * @throws {Error} Throws an error if the selector does not match any elements.
     *
     * @example
     * // Example usage to set the width of elements with class 'box' to double their current width
     * _setElementAttributes('.box', 'width', currentValue => currentValue * 2);
     */
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
};
const DefaultType$6 = {
  /**
   * Resets specific CSS attributes of the element and its related fixed and sticky content.
   *
   * This method is responsible for restoring the default styles for overflow, padding, and margin
   * on the main element and its associated fixed and sticky content selectors. It ensures that any
   * previously applied styles are removed, allowing for a clean state.
   *
   * @throws {Error} Throws an error if the element or selectors are not defined.
   *
   * @example
   * const instance = new SomeClass();
   * instance.reset();
   * // This will reset the overflow, paddingRight, and marginRight attributes.
   */
  trapElement: 'element',
  autofocus: 'boolean'
};
const NAME$7 = 'focustrap';
const DATA_KEY$7 = 'bs.focustrap';
const EVENT_KEY$7 = `.${DATA_KEY$7}`;
const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$7}`;
const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7}`;
const TAB_KEY = 'Tab';
const TAB_NAV_FORWARD = 'forward';
/**
 * Saves the initial value of a specified style property from a given element.
 * If the style property has a value, it stores that value as a data attribute on the element.
 *
 * @param {HTMLElement} element - The DOM element from which to retrieve the style property.
 * @param {string} styleProp - The name of the style property to save (e.g., 'color', 'backgroundColor').
 *
 * @throws {TypeError} Throws an error if the provided element is not a valid HTMLElement.
 *
 * @example
 * const myElement = document.getElementById('myElement');
 * _saveInitialAttribute(myElement, 'color');
 */
const TAB_NAV_BACKWARD = 'backward';

class FocusTrap {
  constructor(config) {
    this._config = this._getConfig(config);
    this._isActive = false;
    this._lastTabNavDirection = null;
  }
/**
 * Resets the specified CSS property of elements matched by the given selector.
 * If the property has a corresponding data attribute, it applies that value;
 * otherwise, it removes the property from the element's style.
 *
 * @param {string} selector - A string representing the selector to match elements.
 * @param {string} styleProp - The CSS property to reset or apply.
 *
 * @throws {Error} Throws an error if the selector is invalid or if there are issues
 *                 accessing the elements.
 *
 * @example
 * // Reset the 'color' property for all elements with the class 'text'
 * _resetElementAttributes('.text', 'color');
 */

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
    }

    /**
     * Applies a manipulation callback to a specified element or elements
     * identified by the provided selector. If the selector is a single
     * element, the callback is executed directly on that element. If the
     * selector matches multiple elements, the callback is executed on each
     * of those elements.
     *
     * @param {string|Element} selector - The selector string or a single
     * element to which the callback will be applied.
     * @param {Function} callBack - The function to be executed on the
     * selected element(s). This function will receive the selected element
     * as its only argument.
     *
     * @throws {TypeError} Throws an error if the selector is not a valid
     * string or element.
     *
     * @example
     * // Example of using _applyManipulationCallback with a single element
     * _applyManipulationCallback(document.getElementById('myElement'), function(el) {
     *   el.style.color = 'red';
     * });
     *
     * @example
     * // Example of using _applyManipulationCallback with a selector string
     * _applyManipulationCallback('.myClass', function(el) {
     *   el.style.backgroundColor = 'blue';
     * });
     */
    EventHandler.off(document, EVENT_KEY$7); // guard against infinite focus loop

    EventHandler.on(document, EVENT_FOCUSIN$1, event => this._handleFocusin(event));
    EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
    this._isActive = true;
  }

  deactivate() {
    /**
     * Determines if the current width is overflowing.
     *
     * This method checks if the width of the current object is greater than zero.
     * It can be used to ascertain whether the object has any visible width,
     * which may indicate an overflow condition in certain contexts.
     *
     * @returns {boolean} Returns true if the width is greater than zero, otherwise false.
     *
     * @example
     * const element = new SomeElement();
     * if (element.isOverflowing()) {
     *   console.log('The element is overflowing.');
     * } else {
     *   console.log('The element is not overflowing.');
     * }
     */
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
  }

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
 /**
  * Hides the element by removing the visible class and executing a callback function.
  *
  * This method checks if the element is currently visible. If it is not, the provided callback
  * is executed immediately. If the element is visible, it removes the class that indicates visibility,
  * then emulates an animation before disposing of the element and executing the callback.
  *
  * @param {Function} callback - The function to be executed after the hide operation is complete.
  *
  * @returns {void}
  *
  * @example
  * // Example usage of the hide method
  * instance.hide(() => {
  *   console.log('Element has been hidden.');
  * });
  *
  * @throws {Error} Throws an error if the callback is not a function.
  */
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
const DefaultType$5 = {
  backdrop: '(boolean|string)',
  /**
   * Retrieves the backdrop element for the component. If the element does not exist,
   * it creates a new one with the specified configuration.
   *
   * @returns {HTMLElement} The backdrop element associated with the component.
   *
   * @throws {Error} Throws an error if the configuration is invalid or if the element
   *                 cannot be created.
   *
   * @example
   * const backdropElement = instance._getElement();
   * console.log(backdropElement); // Logs the created or existing backdrop element.
   */
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
const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
const CLASS_NAME_OPEN = 'modal-open';
/**
 * Retrieves and merges the configuration object with default settings.
 *
 * This function takes a configuration object as input, merges it with
 * default settings, and ensures that the root element is properly
 * initialized. If the provided configuration is not an object, it will
 * default to an empty object.
 *
 * @param {Object} config - The configuration object to be merged with defaults.
 * @param {HTMLElement} [config.rootElement] - The root element to be used.
 * If not provided, defaults to the body element.
 *
 * @returns {Object} The merged configuration object containing default and
 * user-defined properties.
 *
 * @throws {TypeError} Throws an error if the provided config is not an object
 * or if the rootElement cannot be resolved.
 *
 * @example
 * const userConfig = { rootElement: '#myElement' };
 * const finalConfig = _getConfig(userConfig);
 * // finalConfig will contain properties from Default$7 and userConfig
 */
const CLASS_NAME_FADE$3 = 'fade';
const CLASS_NAME_SHOW$4 = 'show';
const CLASS_NAME_STATIC = 'modal-static';
const SELECTOR_DIALOG = '.modal-dialog';
const SELECTOR_MODAL_BODY = '.modal-body';
const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 /**
  * Appends the element to the root element if it has not already been appended.
  * This method also sets up an event listener for mouse down events on the
  * appended element, triggering a specified callback function when the event occurs.
  *
  * @throws {Error} Throws an error if the root element is not defined in the configuration.
  *
  * @returns {void} This method does not return a value.
  *
  * @example
  * // Assuming `instance` is an instance of the class containing this method
  * instance._append();
  * // The element will be appended and the click callback will be executed on mouse down.
  */
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
    this._scrollBar = new ScrollBarHelper();
  /**
   * Disposes of the current instance by removing the associated element
   * from the DOM and cleaning up event listeners.
   *
   * This method checks if the instance has been appended to the DOM before
   * attempting to remove it. If it has not been appended, the method will
   * return early without performing any actions.
   *
   * @throws {Error} Throws an error if there is an issue during the removal
   *                 process (e.g., if the element does not exist).
   *
   * @example
   * const instance = new SomeClass();
   * instance.dispose();
   *
   * @returns {void}
   */
  } // Getters


  static get Default() {
    return Default$5;
  }

  static get NAME() {
    return NAME$6;
  } // Public


  /**
   * Executes a callback function after a CSS transition has completed.
   *
   * This method ensures that the provided callback is called only after the
   * animation associated with the element has finished, allowing for smooth
   * transitions and animations in the user interface.
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
        if (event.target === this._element) {
          this._ignoreBackdropClick = true;
        /**
         * Activates the focus trap functionality.
         *
         * This method sets up event listeners to manage focus within a specified
         * element, ensuring that focus does not escape from it. It also handles
         * autofocus behavior if configured.
         *
         * @throws {Error} Throws an error if the activation process fails.
         *
         * @example
         * const focusTrap = new FocusTrap(trapElement, { autofocus: true });
         * focusTrap.activate();
         */
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
 * Deactivates the current instance, setting its active state to false.
 * If the instance is already inactive, the method will return early without making any changes.
 *
 * @throws {Error} Throws an error if the deactivation process fails due to unexpected conditions.
 *
 * @example
 * const instance = new MyClass();
 * instance.deactivate(); // Deactivates the instance if it is active
 */

    if (isAnimated) {
      this._isTransitioning = true;
    }

    this._setEscapeEvent();

    this._setResizeEvent();

    this._focustrap.deactivate();
/**
 * Handles the focusin event for the trap element.
 * This method ensures that focus is managed correctly within a specified
 * element, preventing focus from leaving the element unless certain
 * conditions are met.
 *
 * @param {FocusEvent} event - The focusin event triggered by the user.
 * @param {HTMLElement} event.target - The element that triggered the event.
 *
 * @throws {Error} Throws an error if the event target is not valid.
 *
 * @example
 * // Example usage:
 * const focusHandler = new FocusHandler(config);
 * document.addEventListener('focusin', (event) => focusHandler._handleFocusin(event));
 *
 * @returns {void}
 */

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
  } // Private

/**
 * Handles the keydown event for tab navigation.
 *
 * This method checks if the pressed key is the Tab key. If it is,
 * it determines the navigation direction based on whether the Shift
 * key is also pressed. The direction is stored in the
 * `_lastTabNavDirection` property.
 *
 * @param {KeyboardEvent} event - The keyboard event object that
 *        contains information about the key that was pressed.
 * @returns {void} This method does not return a value.
 *
 * @example
 * // Example usage:
 * document.addEventListener('keydown', this._handleKeydown.bind(this));
 *
 * @throws {TypeError} Throws an error if the event parameter is not
 *         a valid KeyboardEvent.
 */

  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      // 'static' option will be translated to true, and booleans will keep their value
      isAnimated: this._isAnimated()
    });
  }
/**
 * Merges the provided configuration object with default settings and performs type checking.
 *
 * This function takes a configuration object, merges it with default values,
 * and ensures that the resulting configuration adheres to the expected types.
 *
 * @param {Object} config - The configuration object to be merged with defaults.
 *                          If the provided value is not an object, it will be ignored.
 * @returns {Object} The final configuration object that includes default values
 *                  and the provided settings.
 *
 * @throws {TypeError} Throws an error if the configuration does not match the expected types.
 *
 * @example
 * const userConfig = { optionA: true, optionB: 'value' };
 * const finalConfig = _getConfig(userConfig);
 * // finalConfig will contain merged values from Default$6 and userConfig
 */

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
     * This function checks if the focus should be activated based on the configuration.
     * If focus is enabled, it activates the focus trap. It also updates the transition state
     * and triggers an event indicating that the transition has completed.
     *
     * @returns {void} This function does not return a value.
     *
     * @throws {Error} Throws an error if there is an issue with activating the focus trap.
     *
     * @example
     * // Example usage of transitionComplete
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
          this._triggerBackdropTransition();
        }
      /**
       * Toggles the visibility of an element.
       *
       * This method checks the current visibility state of the element.
       * If the element is currently shown, it will be hidden;
       * if it is hidden, it will be shown with the specified related target.
       *
       * @param {Element} relatedTarget - The element that is related to the toggle action.
       * This can be used to determine the context in which the toggle is being called.
       *
       * @returns {boolean} Returns true if the element is now shown, false otherwise.
       *
       * @throws {Error} Throws an error if there is an issue with showing or hiding the element.
       *
       * @example
       * const button = document.querySelector('#toggleButton');
       * button.addEventListener('click', function() {
       *   toggle(button);
       * });
       */
      });
    } else {
      EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
    }
  /**
   * Displays the dialog element, triggering the necessary events and managing the visibility state.
   *
   * This method checks if the dialog is already shown or transitioning. If not, it triggers a show event
   * and proceeds to display the dialog if the event is not prevented. It handles animations, scrollbar visibility,
   * and sets up escape and resize event listeners. Additionally, it manages backdrop interactions.
   *
   * @param {Element} relatedTarget - The element that triggered the dialog to be shown.
   * @throws {Error} Throws an error if there is an issue with showing the dialog.
   *
   * @example
   * const dialog = new Dialog();
   * dialog.show(document.getElementById('triggerElement'));
   */
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

      if (event.target !== event.currentTarget) {
        /**
         * Hides the modal element if it is currently shown and not transitioning.
         * This method triggers a hide event and handles the necessary cleanup
         * for the modal's visibility.
         *
         * @throws {Error} Throws an error if the modal is in an invalid state.
         *
         * @example
         * const modal = new Modal(element);
         * modal.hide();
         */
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

    if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) {
      return;
    /**
     * Cleans up and disposes of the resources used by the instance.
     * This method removes event listeners, disposes of the backdrop,
     * deactivates the focus trap, and calls the superclass's dispose method.
     *
     * @throws {Error} Throws an error if the disposal process fails.
     *
     * @example
     * const instance = new MyClass();
     * instance.dispose();
     * // After calling dispose, the instance should be cleaned up and no longer functional.
     */
    }

    if (!isModalOverflowing) {
      style.overflowY = 'hidden';
    }

    classList.add(CLASS_NAME_STATIC);

    this._queueCallback(() => {
      classList.remove(CLASS_NAME_STATIC);
/**
 * Handles the update process by adjusting the dialog.
 * This method is typically called when there is a need to refresh or
 * modify the dialog's state or appearance based on new data or user actions.
 *
 * @throws {Error} Throws an error if the dialog adjustment fails.
 *
 * @example
 * // Example usage of handleUpdate
 * const instance = new SomeClass();
 * instance.handleUpdate();
 */

      if (!isModalOverflowing) {
        this._queueCallback(() => {
          style.overflowY = '';
        }, this._dialog);
      /**
       * Initializes a new Backdrop instance with the specified configuration.
       *
       * This method creates a backdrop that can be used to enhance the user interface
       * by providing a visual overlay. The visibility and animation of the backdrop
       * are determined by the configuration settings.
       *
       * @returns {Backdrop} A new instance of the Backdrop class.
       *
       * @throws {Error} Throws an error if the backdrop cannot be initialized.
       *
       * @example
       * const backdrop = this._initializeBackDrop();
       * console.log(backdrop.isVisible); // true or false based on config
       */
      }
    }, this._dialog);

    this._element.focus();
  } // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // ----------------------------------------------------------------------

/**
 * Initializes a focus trap for the specified element.
 *
 * This method creates a new instance of `FocusTrap`, which restricts keyboard navigation to the specified element,
 * ensuring that focus does not leave the element until the trap is disabled.
 *
 * @returns {FocusTrap} An instance of the FocusTrap class configured for the element.
 *
 * @throws {Error} Throws an error if the focus trap cannot be initialized.
 *
 * @example
 * const focusTrap = this._initializeFocusTrap();
 * focusTrap.activate(); // Activates the focus trap
 */

  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

    const scrollbarWidth = this._scrollBar.getWidth();

    /**
     * Merges the default configuration with the provided configuration and data attributes from the element.
     *
     * This method takes a configuration object, merges it with default values and any data attributes
     * found on the associated element. It also performs type checking on the final configuration object.
     *
     * @param {Object} config - The configuration object to be merged. If not provided, defaults will be used.
     * @returns {Object} The final configuration object after merging.
     * @throws {TypeError} Throws an error if the provided configuration does not match the expected types.
     *
     * @example
     * const finalConfig = _getConfig({ customOption: true });
     * console.log(finalConfig);
     */
    const isBodyOverflowing = scrollbarWidth > 0;

    if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
      this._element.style.paddingLeft = `${scrollbarWidth}px`;
    }

    if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
      this._element.style.paddingRight = `${scrollbarWidth}px`;
    }
  /**
   * Displays the modal element and manages its visibility and accessibility attributes.
   *
   * This method ensures that the modal is properly shown, handles focus management,
   * and triggers the appropriate events upon completion of the display transition.
   *
   * @param {Element} relatedTarget - The element that triggered the modal display.
   *
   * @throws {Error} Throws an error if the modal element is not properly initialized.
   *
   * @returns {void}
   *
   * @example
   * // Assuming `modal` is an instance of a modal class
   * modal._showElement(document.querySelector('#triggerButton'));
   */
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
      return;
    }
/**
 * Sets up the event listener for handling the escape key press.
 * This method is responsible for determining the behavior when the escape key is pressed
 * based on the current configuration and visibility state of the component.
 *
 * If the component is shown and keyboard interaction is enabled, pressing the escape key
 * will trigger the `hide` method to close the component. If keyboard interaction is disabled,
 * pressing the escape key will initiate a backdrop transition.
 *
 * If the component is not shown, any existing event listeners for the escape key will be removed.
 *
 * @throws {Error} Throws an error if there is an issue with event handling.
 *
 * @example
 * const myComponent = new MyComponent();
 * myComponent._setEscapeEvent();
 */

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
 /**
  * Sets up or removes the resize event listener for the window.
  * When the dialog is shown, it listens for window resize events
  * and adjusts the dialog accordingly. If the dialog is not shown,
  * it removes the resize event listener.
  *
  * @private
  * @function _setResizeEvent
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
 * add .Modal to jQuery only if jQuery is present
 */

defineJQueryPlugin(Modal);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): offcanvas.js
 /**
  * Hides the modal by setting its display style to 'none' and updating
  * accessibility attributes. It also manages the backdrop and resets
  * adjustments related to scrolling.
  *
  * This method is typically called when the modal is being closed.
  *
  * @throws {Error} Throws an error if the backdrop fails to hide.
  *
  * @example
  * // Example usage of _hideModal
  * modalInstance._hideModal();
  *
  * @private
  */
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
const DefaultType$4 = {
  backdrop: 'boolean',
  /**
   * Displays the backdrop for the component and sets up an event listener
   * to handle click events on the backdrop.
   *
   * This method listens for click events on the backdrop element. If the
   * backdrop is clicked and the configuration allows it, the component will
   * either hide or trigger a backdrop transition based on the configuration.
   *
   * @param {Function} callback - A callback function to be executed after
   *   the backdrop is shown. This can be used for additional setup or
   *   actions that need to occur after the backdrop is displayed.
   *
   * @returns {void}
   *
   * @throws {Error} Throws an error if the backdrop cannot be shown due to
   *   invalid configuration or state.
   *
   * @example
   * // Example usage of _showBackdrop method
   * instance._showBackdrop(() => {
   *   console.log('Backdrop is now visible');
   * });
   */
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

class Offcanvas extends BaseComponent {
  constructor(element, config) {
    /**
     * Checks if the associated element is currently animated.
     *
     * This method determines if the element has the 'fade' class applied,
     * which indicates that an animation is in progress.
     *
     * @returns {boolean} Returns true if the element is animated, false otherwise.
     *
     * @example
     * const isAnimating = instance._isAnimated();
     * console.log(isAnimating); // Outputs: true or false based on the element's state.
     */
    super(element);
    this._config = this._getConfig(config);
    this._isShown = false;
    this._backdrop = this._initializeBackDrop();
    /**
     * Triggers the backdrop transition for the modal element.
     * This method handles the visibility and overflow properties of the modal
     * based on its content and the current viewport size.
     *
     * It checks if the modal is overflowing and adjusts the overflow style
     * accordingly. If the modal is not overflowing, it temporarily sets the
     * overflow to 'hidden' to prevent scrolling during the transition.
     *
     * After the transition, it restores the overflow style and focuses on
     * the modal element.
     *
     * @throws {Event} Throws an event if the hide action is prevented.
     *
     * @returns {void}
     *
     * @example
     * const modal = new Modal(element);
     * modal._triggerBackdropTransition();
     */
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
      new ScrollBarHelper().hide();
    }
/**
 * Adjusts the dialog's padding based on the overflow status of the modal and the body.
 * This method ensures that the modal is displayed correctly without any visual overflow issues.
 *
 * It calculates whether the modal content overflows the viewport and adjusts the left or right padding
 * of the modal element accordingly to accommodate for the scrollbar width.
 *
 * @private
 * @returns {void}
 *
 * @throws {TypeError} Throws an error if the element or scrollbar width is not defined.
 *
 * @example
 * // Example usage within a modal component
 * this._adjustDialog();
 */

    this._element.removeAttribute('aria-hidden');

    this._element.setAttribute('aria-modal', true);

    this._element.setAttribute('role', 'dialog');

    this._element.classList.add(CLASS_NAME_SHOW$3);

    /**
     * Callback function that is executed upon completion of an event.
     * This function checks the configuration for scrolling and activates
     * the focus trap if scrolling is not enabled. It also triggers an
     * event indicating that the element has been shown.
     *
     * @function completeCallBack
     /**
      * Resets the padding adjustments of the associated element.
      * This method clears any left and right padding styles applied to the element.
      *
      * @method _resetAdjustments
      * @private
      * @throws {Error} Throws an error if the element is not defined.
      *
      * @example
      * // Assuming 'this' refers to an instance of a class with an '_element' property
      * this._resetAdjustments();
      */
     * @returns {void} This function does not return a value.
     *
     * @throws {Error} Throws an error if the configuration or element is not properly set.
     *
     * @example
     * // Example usage of completeCallBack
     /**
      * Static method that acts as an interface for the Modal component.
      * It allows the invocation of specific methods on the Modal instance
      * based on the provided configuration string.
      *
      * @param {Object|string} config - The configuration object or a string
      * representing the method name to be invoked on the Modal instance.
      * If an object is provided, it is used to create or retrieve the Modal instance.
      *
      * @param {Element} relatedTarget - An optional parameter that can be passed
      * to the method being invoked, typically representing an element related
      * to the action being performed (e.g., a button that triggered the modal).
      *
      * @returns {jQuery} The jQuery object for chaining.
      *
      * @throws {TypeError} Throws an error if the provided config is a string
      * and does not correspond to a valid method on the Modal instance.
      *
      * @example
      * // To open a modal with a specific configuration
      * $('#myModal').jQueryInterface({ backdrop: 'static' });
      *
      * // To invoke a specific method on the modal instance
      * $('#myModal').jQueryInterface('show', relatedElement);
      */
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
     * Callback function that is executed to complete the hiding of an element.
     * This function performs several actions to ensure the element is properly hidden
     * and its accessibility attributes are reset.
     *
     * It sets the `aria-hidden` attribute to true, removes the `aria-modal` and `role`
     * attributes, and changes the element's visibility style to 'hidden'.
     * If the configuration does not allow scrolling, it resets the scrollbar using
     * the ScrollBarHelper.
     *
     * Finally, it triggers an event indicating that the element has been hidden.
     *
     * @throws {Error} Throws an error if the element is not defined or if there is an issue
     *                 with resetting the scrollbar.
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

      /**
       * Toggles the visibility of an element.
       *
       * This method checks if the element is currently shown. If it is shown, it will hide the element;
       * otherwise, it will show the element, optionally using a related target.
       *
       * @param {Element} relatedTarget - The element that is related to the toggle action.
       *                                   This can be used to determine context for showing the element.
       * @returns {boolean} Returns true if the element is now shown, false if it is hidden.
       *
       * @throws {Error} Throws an error if the toggle action fails due to invalid state or parameters.
       *
       * @example
       * const toggleButton = document.getElementById('toggleButton');
       * toggleButton.addEventListener('click', function() {
       *   toggle(toggleButton);
       * });
       */
      if (typeof config !== 'string') {
        return;
      }

      /**
       * Displays the modal element, making it visible to the user.
       *
       * This method triggers a 'show' event before displaying the modal. If the event is prevented,
       * the modal will not be shown. It also manages the backdrop and accessibility attributes.
       *
       * @param {Element} relatedTarget - The element that triggered the modal to be shown.
       *
       * @throws {Error} Throws an error if the modal is already shown.
       *
       * @returns {void}
       *
       * @example
       * const modal = new Modal(element);
       * modal.show(triggerElement);
       */
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
/**
 * Hides the element if it is currently shown.
 *
 * This method triggers a hide event and performs necessary cleanup actions.
 * If the element is not shown, the method returns early without making any changes.
 *
 * It deactivates focus trapping, removes the visible class from the element,
 * and hides the backdrop. Once the hide operation is complete, it updates the
 * ARIA attributes and resets the scrollbar if configured to do so.
 *
 * @throws {Error} Throws an error if there is an issue during the hide operation.
 *
 * @example
 * const instance = new YourClass();
 * instance.hide();
 */
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
 * This function validates the attribute's name against a list of allowed attributes,
 * which can include both strings and regular expressions. If the attribute is found in
 * the allowed list, it further checks if it is a URI attribute and validates its value
 * against predefined safe patterns.
 /**
  * Cleans up and releases resources used by the instance.
  * This method is responsible for disposing of the backdrop and deactivating the focus trap.
  * It also calls the superclass's dispose method to ensure proper cleanup in the inheritance chain.
  *
  * @throws {Error} Throws an error if the disposal process fails.
  *
  * @example
  * const instance = new MyClass();
  * instance.dispose();
  * // After calling dispose, the instance should no longer be usable.
  */
 *
 * @param {Attr} attr - The attribute to be validated. It should be an instance of Attr.
 * @param {(string|RegExp)[]} allowedAttributeList - An array of allowed attribute names or regular expressions.
 *
 * @returns {boolean} Returns true if the attribute is allowed, false otherwise.
 *
 * @throws {TypeError} Throws an error if the provided `attr` is not an instance of Attr.
 *
 * @example
 /**
  * Merges the default configuration with the provided configuration and
  * data attributes from the element.
  *
  * This method retrieves the default configuration, merges it with any
  * data attributes found on the element, and then further merges it with
  * the user-provided configuration object if it is valid.
  *
  * @param {Object} config - The user-provided configuration object.
  *                          If not an object, it will be ignored.
  * @returns {Object} The final merged configuration object.
  *
  * @throws {TypeError} Throws an error if the provided configuration does
  *                     not match the expected types defined in DefaultType$4.
  *
  * @example
  * const finalConfig = this._getConfig({ customSetting: true });
  * // finalConfig will contain properties from Default$4, data attributes,
  * // and { customSetting: true } merged together.
  */
 * const attr = document.createAttribute('href');
 * attr.nodeValue = 'https://example.com';
 * const allowedList = ['href', 'src', /^data-/];
 * const isAllowed = allowedAttribute(attr, allowedList);
 * console.log(isAllowed); // true or false based on validation
 */
const allowedAttribute = (attr, allowedAttributeList) => {
  const attrName = attr.nodeName.toLowerCase();

  /**
   * Initializes a new Backdrop instance with the specified configuration.
   *
   * This method creates a backdrop element that can be used to enhance the user interface
   * by dimming the background when a modal or similar component is active. The backdrop
   * can be configured to be visible or hidden based on the current settings.
   *
   * @returns {Backdrop} A new instance of the Backdrop class.
   *
   * @throws {Error} Throws an error if the backdrop cannot be initialized due to
   *                 invalid configuration or missing parent element.
   *
   * @example
   * const backdrop = this._initializeBackDrop();
   * backdrop.show(); // Displays the backdrop
   */
  if (allowedAttributeList.includes(attrName)) {
    if (uriAttrs.has(attrName)) {
      return Boolean(SAFE_URL_PATTERN.test(attr.nodeValue) || DATA_URL_PATTERN.test(attr.nodeValue));
    }

    return true;
  }

  const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp); // Check if a regular expression validates the attribute.

  /**
   * Initializes a new instance of the FocusTrap class.
   *
   * This method creates a focus trap that confines keyboard navigation
   * within a specified element, ensuring that users can only interact
   * with the elements inside the trap until it is disabled.
   *
   * @returns {FocusTrap} An instance of the FocusTrap class configured
   * with the current element as the trap element.
   *
   * @throws {Error} Throws an error if the trap element is not defined
   * or if the FocusTrap initialization fails.
   *
   * @example
   * const focusTrap = this._initializeFocusTrap();
   * focusTrap.activate();
   */
  for (let i = 0, len = regExp.length; i < len; i++) {
    if (regExp[i].test(attrName)) {
      return true;
    }
  }

  /**
   * Attaches event listeners to the specified element for handling keyboard events.
   *
   * This method listens for a keydown event and checks if the keyboard dismissal
   * configuration is enabled. If the ESC key is pressed, it triggers the hide
   * functionality of the component.
   *
   * @private
   * @returns {void} This method does not return a value.
   *
   * @throws {Error} Throws an error if the element is not defined or if there is
   *                 an issue with event handling.
   *
   * @example
   * // Example usage within a class context
   * this._addEventListeners();
   */
  return false;
};

const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  /**
   * Static method that serves as the jQuery interface for the Offcanvas component.
   * This method allows for the initialization and invocation of methods on the Offcanvas instance.
   *
   * @param {Object|string} config - Configuration object or method name to invoke on the Offcanvas instance.
   *                                  If a string is provided, it should correspond to a method defined in the Offcanvas class.
   *
   * @throws {TypeError} Throws a TypeError if the provided method name is not defined, starts with an underscore,
   *                     or is the constructor.
   *
   * @returns {jQuery} Returns the jQuery object for chaining.
   *
   * @example
   * // Initialize Offcanvas with default configuration
   * $('.offcanvas').offcanvas();
   *
   * // Invoke a specific method on the Offcanvas instance
   * $('.offcanvas').offcanvas('show');
   */
  br: [],
  col: [],
  code: [],
  div: [],
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
 * If a custom sanitization function is provided, it will be used to sanitize the HTML.
 *
 * @param {string} unsafeHtml - The HTML string to be sanitized.
 * @param {Object} allowList - An object defining allowed elements and attributes.
 * @param {Function} [sanitizeFn] - An optional custom sanitization function.
 *
 * @returns {string} The sanitized HTML string.
 *
 * @throws {TypeError} Throws an error if `unsafeHtml` is not a string or if `allowList` is not an object.
 *
 * @example
 * const safeHtml = sanitizeHtml('<div><script>alert("XSS")</script></div>',
 *   { div: ['class'], '*': ['style'] });
 * console.log(safeHtml); // Outputs: <div></div>
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
      /**
       * Enables the feature or functionality associated with this instance.
       * This method sets the internal state to indicate that the feature is enabled.
       *
       * @throws {Error} Throws an error if the feature cannot be enabled due to internal constraints.
       *
       * @example
       * const instance = new MyClass();
       * instance.enable();
       * console.log(instance.isEnabled); // true
       */
      EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
    }

    if (this._popper) {
      /**
       * Disables the current instance by setting the internal state to disabled.
       * Once this method is called, the instance will no longer be enabled
       * for further operations until it is explicitly re-enabled.
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
      this._popper = Popper.createPopper(this._element, tip, this._getPopperConfig(attachment));
    }
/**
 * Toggles the enabled state of the instance.
 *
 * This method inverts the current value of the `_isEnabled` property,
 * effectively enabling the instance if it was previously disabled,
 * and disabling it if it was previously enabled.
 *
 * @throws {TypeError} Throws an error if `_isEnabled` is not a boolean.
 *
 * @example
 * const instance = new MyClass();
 * instance.toggleEnabled(); // If _isEnabled was false, it becomes true.
 * instance.toggleEnabled(); // If _isEnabled was true, it becomes false.
 */

    tip.classList.add(CLASS_NAME_SHOW$2);

    const customClass = this._resolvePossibleFunction(this._config.customClass);
/**
 * Toggles the visibility of a tooltip or popover based on the provided event.
 * If the component is not enabled, the function will return immediately without performing any action.
 *
 * @param {Event} event - The event object that triggered the toggle action.
 *                        This can be a mouse event or any other event that indicates user interaction.
 *                        If no event is provided, the function will toggle the visibility based on the current state.
 *
 * @returns {void} - This function does not return a value.
 *
 * @throws {Error} - Throws an error if the component is not properly initialized or if an unexpected state is encountered.
 *
 * @example
 * // Example usage with an event
 * element.addEventListener('click', (event) => {
 *   tooltip.toggle(event);
 * });
 *
 * // Example usage without an event
 * tooltip.toggle();
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
     * it calls the leave method to handle the transition appropriately.
     *
     * @throws {Error} Throws an error if the element is not defined or if
     *                 there is an issue with event handling.
     *
     /**
      * Cleans up and releases resources used by the instance.
      * This method is responsible for removing event listeners,
      * clearing timeouts, and destroying any associated popper instances.
      * It also ensures that any tooltips are removed from the DOM.
      *
      * @throws {Error} Throws an error if the disposal process fails.
      *
      * @example
      * const instance = new MyComponent();
      * instance.dispose();
      * // After calling dispose, the instance should no longer be functional
      * and all resources should be released.
      */
     * @example
     * // Example usage of complete method
     * const instance = new HoverInstance();
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
     * This method checks if the element is visible and if it has content before proceeding to show the tooltip.
     * It triggers a SHOW event and handles the positioning and display of the tooltip.
     *
     * @throws {Error} Throws an error if the method is called on an element that is not visible.
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * const tooltipInstance = new Tooltip(element, config);
     * tooltipInstance.show();
     *
     * @fires Tooltip#show
     * @fires Tooltip#shown
     * @fires Tooltip#inserted
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
     * Completes the tooltip lifecycle by removing the tooltip element and cleaning up associated states.
     *
     * This method checks if there is an active trigger for the tooltip. If there is, it exits early.
     * If the hover state is not set to show, it removes the tooltip element from the DOM.
     * It also cleans up any CSS classes associated with the tooltip and removes the aria-describedby attribute
     * from the element to improve accessibility.
     *
     * After triggering the HIDDEN event, it checks if a Popper instance exists and destroys it,
     * setting the reference to null.
     *
     * @throws {Error} Throws an error if there is an issue with event handling or element manipulation.
     *
     * @example
     * // Usage example:
     * const tooltip = new Tooltip(element);
     * tooltip.complete();
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


  /**
   * Hides the tooltip element associated with the current instance.
   * This method removes the tooltip from the DOM and cleans up any associated classes and attributes.
   *
   * @throws {Error} Throws an error if the tooltip element is not initialized.
   *
   * @example
   * const tooltip = new Tooltip(element);
   * tooltip.hide();
   */
  isWithContent() {
    return Boolean(this.getTitle());
  }

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
    /**
     * Updates the popper instance if it is not null.
     * This method checks if the internal popper reference is set,
     * and if so, it calls the update method on the popper instance.
     *
     * @throws {Error} Throws an error if the popper instance is not properly initialized.
     *
     * @example
     * const instance = new Popper();
     * instance.update(); // Updates the popper if it exists
     */
    }

    if (this._config.html) {
      if (this._config.sanitize) {
        content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
      }

      /**
       * Checks if the current instance has content based on its title.
       *
       * This method evaluates whether the title of the instance is defined and not empty.
       * It returns a boolean value indicating the presence of content.
       *
       * @returns {boolean} True if the title exists and is not empty; otherwise, false.
       *
       * @example
       * const instance = new MyClass();
       * instance.setTitle("Sample Title");
       * console.log(instance.isWithContent()); // Output: true
       *
       * @example
       * const instance = new MyClass();
       * instance.setTitle("");
       * console.log(instance.isWithContent()); // Output: false
       */
      element.innerHTML = content;
    } else {
      element.textContent = content;
    }
  /**
   * Retrieves the tooltip element. If the tooltip already exists, it returns the existing element.
   * Otherwise, it creates a new tooltip element based on the provided template configuration.
   *
   * @returns {HTMLElement} The tooltip element that has been created or retrieved.
   *
   * @throws {Error} Throws an error if the template configuration is invalid or if the tooltip cannot be created.
   *
   * @example
   * const tooltip = instance.getTipElement();
   * console.log(tooltip); // Logs the tooltip element to the console.
   */
  }

  getTitle() {
    const title = this._element.getAttribute('data-bs-original-title') || this._config.title;

    return this._resolvePossibleFunction(title);
  }

  updateAttachment(attachment) {
    if (attachment === 'right') {
      return 'end';
    }

    if (attachment === 'left') {
      /**
       * Sets the content of a tooltip by sanitizing the provided tip and
       * updating the tooltip's inner content.
       *
       * This method utilizes the `_sanitizeAndSetContent` function to ensure
       * that the content is safe and formatted correctly before being applied.
       *
       * @param {string} tip - The content to be set in the tooltip. This
       * should be a string that may contain user-generated content, which
       * needs to be sanitized to prevent XSS attacks.
       *
       * @throws {Error} Throws an error if the provided tip is not a string
       * or if sanitization fails.
       *
       * @example
       * const tooltip = new Tooltip();
       * tooltip.setContent("This is a safe tooltip content.");
       */
      return 'start';
    }

    return attachment;
  /**
   * Sanitizes and sets the content of a specified element within a template.
   * If the content is empty and the element exists, it removes the element from the DOM.
   * Otherwise, it sets the provided content to the element.
   *
   * @param {HTMLElement} template - The template element containing the target element.
   * @param {string|null} content - The content to be set. If null or empty, the element will be removed.
   * @param {string} selector - A CSS selector string used to find the target element within the template.
   *
   * @returns {void}
   *
   * @throws {Error} Throws an error if the selector does not match any element in the template.
   *
   * @example
   * // Example usage:
   * const myTemplate = document.getElementById('myTemplate');
   * const myContent = '<p>Hello World</p>';
   * const mySelector = '.content';
   * _sanitizeAndSetContent(myTemplate, myContent, mySelector);
   */
  } // Private


  _initializeOnDelegatedTarget(event, context) {
    return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
  }

  _getOffset() {
    const {
      offset
    } = this._config;

    /**
     * Sets the content of a specified DOM element.
     *
     * This function can handle both DOM nodes and string content. Depending on the configuration,
     * it can either set HTML content or plain text content. If HTML content is set, it can also
     * sanitize the input based on the provided configuration.
     *
     * @param {Element|null} element - The DOM element to set the content for. If null, the function will return immediately.
     * @param {string|Element} content - The content to set. This can be a string or a DOM element.
     *
     * @throws {Error} Throws an error if the content cannot be sanitized and sanitization is enabled.
     *
     * @returns {void} This function does not return a value.
     *
     * @example
     * // Example of setting HTML content
     * const myElement = document.getElementById('myElement');
     * setElementContent(myElement, '<strong>Hello World</strong>');
     *
     * @example
     * // Example of setting plain text content
     * setElementContent(myElement, 'Hello World');
     */
    if (typeof offset === 'string') {
      return offset.split(',').map(val => Number.parseInt(val, 10));
    }

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
          /**
           * Retrieves the title from the element's data attribute or configuration.
           *
           * This method checks for the 'data-bs-original-title' attribute on the
           * associated element. If it is not present, it falls back to the title
           * specified in the configuration. The title can also be a function,
           * in which case it will be resolved to its return value.
           *
           * @returns {string|Function} The resolved title, which can either be a
           * string or the result of a function call if the title is a function.
           *
           * @throws {Error} Throws an error if the title cannot be resolved
           * properly.
           *
           * @example
           * const title = instance.getTitle();
           * console.log(title); // Outputs the resolved title.
           */
          boundary: this._config.boundary
        }
      }, {
        name: 'arrow',
        options: {
          element: `.${this.constructor.NAME}-arrow`
        /**
         * Updates the attachment position based on the provided input.
         *
         * This function takes an attachment string and returns a corresponding position string.
         * If the input is 'right', it returns 'end'. If the input is 'left', it returns 'start'.
         * For any other input, it returns the input as is.
         *
         * @param {string} attachment - The attachment position to update.
         *                              Expected values are 'right' or 'left'.
         * @returns {string} The updated attachment position.
         *                   Returns 'end' for 'right', 'start' for 'left',
         *                   or the original input for any other value.
         *
         * @example
         * // returns 'end'
         * updateAttachment('right');
         *
         * @example
         * // returns 'start'
         * updateAttachment('left');
         *
         * @example
         * // returns 'center'
         * updateAttachment('center');
         */
        }
      }, {
        name: 'onChange',
        enabled: true,
        phase: 'afterWrite',
        fn: data => this._handlePopperPlacementChange(data)
      }],
      onFirstUpdate: data => {
        if (data.options.placement !== data.placement) {
          this._handlePopperPlacementChange(data);
        }
      }
    };
    /**
     * Initializes the instance on the delegated target.
     *
     * This method checks if a context is provided; if not, it attempts to
     * retrieve or create an instance associated with the given event's
     * delegate target using the delegate configuration.
     *
     * @param {Event} event - The event object that contains information about
     * the event that triggered this method.
     * @param {Object} [context] - An optional context object. If provided,
     * this context will be used; otherwise, a new instance will be created.
     *
     * @returns {Object} The context object that was used or created.
     *
     * @throws {Error} Throws an error if the event does not have a valid
     * delegate target or if instance creation fails.
     *
     * @example
     * const instance = this._initializeOnDelegatedTarget(event);
     * // If context is not provided, a new instance will be created.
     */
    return { ...defaultBsPopperConfig,
      ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
    };
  }
/**
 * Retrieves the offset configuration for the element.
 * The offset can be defined as a string, a function, or a direct value.
 *
 * If the offset is a string, it is expected to be a comma-separated list of values,
 * which will be parsed into an array of integers.
 *
 * If the offset is a function, it will be invoked with the popper data and the element
 * as arguments, allowing for dynamic calculation of the offset.
 *
 * @returns {Array<number>|Function} The parsed offset as an array of numbers if it was a string,
 *                                     a function if it was defined as such, or the raw offset value.
 *
 * @throws {TypeError} Throws an error if the offset is of an unsupported type.
 *
 * @example
 * // Example of using a string offset
 * const offset = this._getOffset(); // returns [10, 20] if offset was '10,20'
 *
 * // Example of using a function as offset
 * const dynamicOffset = this._getOffset(); // returns a function that can be called with popperData
 */

  _addAttachmentClass(attachment) {
    this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
  }

  _getAttachment(placement) {
    return AttachmentMap[placement.toUpperCase()];
  }

  _setListeners() {
    const triggers = this._config.trigger.split(' ');

    triggers.forEach(trigger => {
      if (trigger === 'click') {
        EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
      } else if (trigger !== TRIGGER_MANUAL) {
        /**
         * Resolves the given content to a function result or returns the content itself.
         *
         * This method checks if the provided content is a function. If it is, the function is called
         * with the current element as its context. If the content is not a function, it is returned as-is.
         *
         * @param {function|*} content - The content to be resolved. It can be a function or any other type.
         * @returns {*} The result of the function call if content is a function, otherwise the original content.
         *
         * @example
         * const result = _resolvePossibleFunction(() => 'Hello, World!');
         * console.log(result); // Outputs: 'Hello, World!'
         *
         * @example
         * const result = _resolvePossibleFunction('Just a string');
         * console.log(result); // Outputs: 'Just a string'
         */
        const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
        const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
        EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
        EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
      /**
       * Generates the configuration object for the Popper.js instance.
       *
       * This method constructs a default configuration for Popper.js based on the provided attachment
       * and merges it with any custom configuration defined in the instance's `_config` property.
       *
       * @param {string} attachment - The placement of the popper, which determines where it will be positioned
       * relative to its reference element. Common values include 'top', 'bottom', 'left', and 'right'.
       *
       * @returns {Object} The complete Popper.js configuration object, including default settings and any
       * additional options specified by the user.
       *
       * @throws {TypeError} Throws an error if the `attachment` parameter is not a valid string.
       *
       * @example
       * const config = this._getPopperConfig('top');
       * console.log(config); // Logs the Popper configuration for placement at the top.
       */
      }
    });

    this._hideModalHandler = () => {
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

    /**
     * Adds a CSS class to the tip element based on the provided attachment.
     *
     * This method retrieves the tip element and adds a class that is
     * constructed using a basic class prefix and the result of updating
     * the attachment. The class is formatted as
     * `<basic-class-prefix>-<attachment-update>`.
     *
     * @param {Object} attachment - The attachment object that will be used
     * to determine the class to be added.
     * @throws {Error} Throws an error if the attachment is invalid or
     * cannot be processed.
     *
     * @example
     * // Assuming 'attachment' is a valid object
     * this._addAttachmentClass(attachment);
     */
    if (event) {
      context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
    }

    /**
     * Retrieves an attachment from the AttachmentMap based on the specified placement.
     *
     * This function takes a placement string, converts it to uppercase, and uses it to look up
     * the corresponding attachment in the AttachmentMap. If the placement does not exist in the
     * map, the function will return undefined.
     *
     * @param {string} placement - The placement identifier for which to retrieve the attachment.
     * @returns {AttachmentType|undefined} The attachment associated with the specified placement,
     * or undefined if no attachment is found.
     *
     * @example
     * const attachment = _getAttachment('header');
     * // If 'header' exists in AttachmentMap, attachment will hold its value.
     *
     * @throws {TypeError} Throws an error if the placement is not a string.
     */
    if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$2) || context._hoverState === HOVER_STATE_SHOW) {
      context._hoverState = HOVER_STATE_SHOW;
      return;
    }
/**
 * Sets up event listeners based on the configuration triggers.
 * This method initializes event handlers for various user interactions
 * such as clicks, mouse enter, mouse leave, focus in, and focus out.
 * It also handles the hiding of modal elements when necessary.
 *
 * @throws {TypeError} Throws an error if the element is not defined.
 *
 * @example
 * // Assuming `instance` is an instance of the class containing this method
 * instance._setListeners();
 */

    clearTimeout(context._timeout);
    context._hoverState = HOVER_STATE_SHOW;

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
      /**
       * Updates the title and aria-label attributes of the element.
       *
       * This method retrieves the current title attribute of the element and checks if it
       * exists or if the original title type is not a string. If either condition is met,
       * it sets the 'data-bs-original-title' attribute to the current title or an empty string
       * if no title exists. Additionally, if a title is present but both 'aria-label' and
       * text content are absent, it sets the 'aria-label' to the title value. Finally, it clears
       * the title attribute.
       *
       * @throws {TypeError} Throws an error if the element is not properly initialized or does not have
       *                     the expected attributes.
       *
       * @returns {void} This method does not return a value.
       *
       * @example
       * // Assuming 'element' is a valid DOM element with a title attribute
       * const instance = new SomeClass(element);
       * instance._fixTitle();
       */
      return;
    }

    context._timeout = setTimeout(() => {
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
/**
 * Handles the mouse enter event for a tooltip or popover element.
 * Initializes the context and manages the hover state and display timing.
 *
 * @param {Event} event - The event object representing the mouse enter event.
 * @param {Object} context - The context object containing configuration and state for the tooltip/popover.
 * @property {Function} context.show - Function to display the tooltip/popover.
 * @property {Object} context._config - Configuration options for the tooltip/popover.
 * @property {Object} context._hoverState - Current hover state of the tooltip/popover.
 * @property {number} context._timeout - Timeout ID for managing delayed display.
 * @property {Element} context.getTipElement - Function to get the tooltip/popover element.
 *
 * @throws {Error} Throws an error if the context is not properly initialized.
 *
 * @example
 * // Example usage within an event listener
 * element.addEventListener('mouseenter', (event) => {
 *   tooltipInstance._enter(event, tooltipContext);
 * });
 */

    return false;
  }

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
/**
 * Handles the mouse leave event for a given context, managing the visibility
 * of an element based on the event type and configuration settings.
 *
 * This method initializes the context based on the delegated target and
 * updates the active trigger state depending on whether the related target
 * is contained within the element. If there are active triggers, it exits
 * early. It also manages a timeout for hiding the element based on the
 * configured delay.
 *
 * @param {Event} event - The event object representing the mouse leave event.
 * @param {Object} context - The context object containing configuration and state.
 * @throws {Error} Throws an error if the context is invalid or not properly initialized.
 *
 * @example
 * // Example usage:
 * element.addEventListener('mouseleave', (event) => {
 *   instance._leave(event, context);
 * });
 */

    if (typeof config.content === 'number') {
      config.content = config.content.toString();
    }

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


    /**
     * Checks if there is any active trigger present.
     *
     * This method iterates through the `_activeTrigger` property and returns `true`
     * if at least one trigger is active. If no active triggers are found, it returns `false`.
     *
     * @returns {boolean} Returns `true` if at least one active trigger exists; otherwise, `false`.
     *
     * @example
     * const hasActiveTrigger = instance._isWithActiveTrigger();
     * console.log(hasActiveTrigger); // Outputs: true or false based on active triggers.
     */
    return config;
  }

  _cleanTipClass() {
    const tip = this.getTipElement();
    const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g');
    const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);

    if (tabClass !== null && tabClass.length > 0) {
      tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
    /**
     * Retrieves and processes the configuration object for the component.
     *
     * This method merges default configuration values with data attributes
     * from the element and any user-defined configuration. It also handles
     * specific data types for certain configuration properties and applies
     * sanitization if required.
     *
     * @param {Object} config - The user-defined configuration object.
     * @returns {Object} The processed configuration object, which includes
     *                  default values, data attributes, and user-defined
     *                  settings.
     *
     * @throws {TypeError} Throws an error if the provided config is not an
     *                     object when expected.
     *
     * @example
     * const config = _getConfig({ delay: 500, container: '#myContainer' });
     * console.log(config);
     */
    }
  }

  _getBasicClassPrefix() {
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
/**
 * Retrieves the configuration settings that differ from the default values.
 *
 * This method iterates through the instance's configuration properties and compares them
 * to the default values defined in the constructor. It constructs and returns an object
 * containing only the properties that have values different from the defaults.
 *
 * @returns {Object} An object containing the configuration settings that differ from the defaults.
 *
 * @example
 * const config = instance._getDelegateConfig();
 * console.log(config); // Outputs an object with custom configuration settings.
 *
 * @throws {TypeError} If the configuration is not an object or if the default values are not defined.
 */

}
/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Tooltip to jQuery only if jQuery is present
 */


defineJQueryPlugin(Tooltip);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.0): popover.js
 /**
  * Cleans up the class list of the tooltip element by removing any classes
  * that match the basic class prefix.
  *
  * This method retrieves the tooltip element and uses a regular expression
  * to identify classes that start with the basic class prefix. It then removes
  * these classes from the tooltip's class list.
  *
  * @throws {TypeError} Throws an error if the tooltip element cannot be retrieved.
  *
  * @example
  * // Assuming 'this' refers to an instance of a class that has a tooltip
  * this._cleanTipClass();
  */
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME$3 = 'popover';
/**
 * Retrieves the basic class prefix used in the application.
 *
 * This method is typically used to obtain a standardized prefix that can be
 * applied to class names throughout the codebase, ensuring consistency and
 * avoiding naming conflicts.
 *
 * @returns {string} The basic class prefix.
 *
 * @example
 * const prefix = _getBasicClassPrefix();
 * console.log(prefix); // Outputs the class prefix
 */
const DATA_KEY$3 = 'bs.popover';
const EVENT_KEY$3 = `.${DATA_KEY$3}`;
const CLASS_PREFIX = 'bs-popover';
const Default$2 = { ...Tooltip.Default,
  /**
   * Handles the change in placement of the popper element.
   * This method is responsible for updating the tip element's class
   * based on the new placement state provided by the popper data.
   *
   * @param {Object} popperData - The data object containing information
   * about the popper's current state.
   * @param {Object} popperData.state - The current state of the popper.
   * @param {HTMLElement} popperData.state.elements.popper - The popper
   * element that is being managed.
   *
   * @throws {Error} Throws an error if the state is not defined or
   * if the popper element cannot be found.
   *
   * @returns {void} This method does not return a value.
   *
   * @example
   * const data = {
   *   state: {
   *     elements: {
   *       popper: document.getElementById('my-popper')
   *     },
   *     placement: 'top'
   *   }
   * };
   * this._handlePopperPlacementChange(data);
   */
  placement: 'right',
  offset: [0, 8],
  trigger: 'click',
  content: '',
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
  /**
   * Initializes or invokes methods on the Tooltip instance for each element in the jQuery collection.
   *
   * This static method allows for configuration of Tooltip instances or calling specific methods
   * on them based on the provided configuration parameter. If a string is passed as the configuration,
   * it is treated as a method name to be invoked on the Tooltip instance.
   *
   * @static
   * @param {Object|string} config - The configuration object for initializing the Tooltip instance,
   *                                  or a string representing the method name to invoke.
   * @returns {jQuery} The jQuery collection for chaining.
   *
   * @throws {TypeError} Throws an error if a string is provided as config and the corresponding method
   *                     does not exist on the Tooltip instance.
   *
   * @example
   * // Initialize Tooltip with default settings
   * $('.tooltip-element').jQueryInterface({});
   *
   * // Call a specific method on the Tooltip instance
   * $('.tooltip-element').jQueryInterface('show');
   */
  FOCUSOUT: `focusout${EVENT_KEY$3}`,
  MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
};
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
/**
 * Checks if the current instance has content.
 *
 * This method determines if the instance has a title or any content available.
 * It returns true if either the title or the content is present, otherwise false.
 *
 * @returns {boolean} True if there is content or a title, false otherwise.
 *
 * @example
 * const instance = new MyClass();
 * if (instance.isWithContent()) {
 *   console.log("Content is available.");
 * } else {
 *   console.log("No content found.");
 * }
 */
const EVENT_KEY$2 = `.${DATA_KEY$2}`;
const DATA_API_KEY$1 = '.data-api';
const Default$1 = {
  offset: 10,
  /**
   * Sets the content of the current instance by sanitizing and updating both the title and the main content.
   *
   * This method first sanitizes the provided tip and sets it as the title content,
   * then it sanitizes and sets the main content using the existing content of the instance.
   *
   * @param {string} tip - The content to be sanitized and set. This should be a string
   *                       that represents the new content for both title and main body.
   *
   * @throws {Error} Throws an error if the provided tip is not a valid string or if
   *                 sanitization fails.
   *
   * @example
   * const instance = new MyClass();
   * instance.setContent("This is a new title and content.");
   */
  method: 'auto',
  target: ''
};
const DefaultType$1 = {
  offset: 'number',
  method: 'string',
  target: '(string|element)'
/**
 * Retrieves the content based on the current configuration.
 *
 * This method resolves the content by invoking a possible function
 * defined in the configuration object. It is intended to provide
 * a dynamic way to access content that may be generated or modified
 * at runtime.
 *
 * @returns {any} The resolved content, which can be of any type
 *                depending on the configuration.
 *
 * @throws {Error} Throws an error if the content cannot be resolved
 *                 due to an invalid configuration or if the function
 *                 does not exist.
 *
 * @example
 * const content = instance._getContent();
 * console.log(content); // Outputs the resolved content based on configuration
 */
};
const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
/**
 * Retrieves the prefix used for basic class names.
 *
 * This method is typically used to ensure that class names follow a
 * consistent naming convention throughout the application. The prefix
 * is defined as a constant and is returned as a string.
 *
 * @returns {string} The prefix for basic class names.
 *
 * @example
 * const prefix = _getBasicClassPrefix();
 * console.log(prefix); // Outputs the class prefix
 */
const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
const CLASS_NAME_ACTIVE$1 = 'active';
const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
/**
 * Initializes or invokes methods on the Popover instance for each element in the jQuery collection.
 *
 * This method acts as a jQuery interface for the Popover component, allowing for configuration
 * and method invocation through a string identifier.
 *
 * @param {Object|string} config - The configuration object for the Popover instance or a string
 *                                 representing the name of a method to invoke on the instance.
 *
 * @throws {TypeError} Throws an error if a string method name is provided that does not exist
 *                    on the Popover instance.
 *
 * @returns {jQuery} The jQuery collection for chaining.
 *
 * @example
 * // Initialize a Popover with default settings
 * $('.popover-element').jQueryInterface({});
 *
 * // Invoke a specific method on the Popover instance
 * $('.popover-element').jQueryInterface('show');
 */
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`;
const SELECTOR_DROPDOWN$1 = '.dropdown';
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

    /**
     * Refreshes the offsets and targets for the scrollable element based on the current configuration.
     * This method calculates the positions of target elements relative to the scrollable area and updates
     * internal arrays to reflect these values.
     *
     * The method determines the offset calculation method based on the configuration and the type of scrollable
     * element. It supports two methods: 'auto' (which chooses between offset position or offset from the top)
     * and a specified method from the configuration.
     *
     * It retrieves all target elements specified in the configuration, calculates their positions, and stores
     * them in internal arrays for later use.
     *
     * @throws {Error} Throws an error if the target elements cannot be found or if there is an issue with
     *                 calculating their positions.
     *
     * @example
     * // Example usage:
     * const instance = new ScrollSpy();
     * instance.refresh();
     */
    const scrollHeight = this._getScrollHeight();

    const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

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
/**
 * Cleans up and releases resources used by the instance.
 * This method removes event listeners and performs any necessary
 * cleanup before the object is destroyed.
 *
 * @throws {Error} Throws an error if the cleanup process fails.
 *
 * @example
 * const instance = new MyClass();
 * // ... use the instance ...
 * instance.dispose(); // cleans up resources
 */

      if (isActiveTarget) {
        this._activate(this._targets[i]);
      }
    }
  }
/**
 * Merges the default configuration with user-defined settings and data attributes
 * from the element. This function ensures that the configuration is complete and
 * valid before being returned.
 *
 * @param {Object} config - The user-defined configuration object.
 * @param {Element} config.target - The target element for the configuration.
 *                                   If not provided, defaults to the document's root element.
 * @returns {Object} - The final configuration object that includes default values
 *                     and any user-defined settings.
 *
 * @throws {TypeError} - Throws an error if the provided config is not an object
 *                       or if required properties are missing.
 *
 * @example
 * const userConfig = { target: '#myElement' };
 * const finalConfig = _getConfig(userConfig);
 * // finalConfig will now contain merged values from Default$1,
 * // data attributes of the element, and userConfig.
 */

  _activate(target) {
    this._activeTarget = target;

    this._clear();

    const queries = SELECTOR_LINK_ITEMS.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);
    const link = SelectorEngine.findOne(queries.join(','), this._config.target);
    link.classList.add(CLASS_NAME_ACTIVE$1);

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
    if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
    } else {
      SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
        /**
         * Retrieves the total height of the scrollable content within the scroll element.
         * This method checks the scroll height of the specified scroll element and falls back
         * to the maximum scroll height of the document body and document element if necessary.
         *
         * @returns {number} The total scroll height of the scrollable content.
         *
         * @example
         * const height = instance._getScrollHeight();
         * console.log(height); // Outputs the scroll height in pixels.
         */
        // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
        SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item

        /**
         * Calculates the height of the scrollable element or the window.
         *
         * This method checks if the scroll element is the window. If it is, it returns
         * the inner height of the window. Otherwise, it retrieves the height of the
         * scroll element using its bounding rectangle.
         *
         * @returns {number} The height of the scrollable element or window in pixels.
         *
         * @throws {TypeError} Throws an error if the scroll element is not defined.
         *
         * @example
         * const height = instance._getOffsetHeight();
         * console.log(height); // Outputs the height in pixels.
         */
        SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
          SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
        });
      });
    /**
     * Handles the scrolling behavior and activates the appropriate target based on the current scroll position.
     * This method calculates the current scroll position, compares it with the maximum scrollable height,
     * and determines which target should be activated based on the defined offsets.
     *
     * @throws {Error} Throws an error if the target activation fails.
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * // Assuming this method is called during a scroll event
     * instance._process();
     *
     * @description
     * The method performs the following steps:
     * 1. Calculates the current scroll position adjusted by a configured offset.
     * 2. Checks if the scroll height has changed and refreshes if necessary.
     * 3. Determines if the scroll position has reached the maximum scroll limit to activate the last target.
     * 4. Resets the active target if the scroll position is above the first offset.
     * 5. Iterates through offsets to activate the appropriate target based on the current scroll position.
     */
    }

    EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
      relatedTarget: target
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
/**
 * Activates a target element by updating the active state of associated links and their parents.
 * This method clears any previous active states and sets the specified target as active.
 *
 * @param {string} target - The target identifier (e.g., an ID or href) to activate.
 * @throws {Error} Throws an error if the target is not found within the configured context.
 *
 * @example
 * // Activating a target with a specific ID
 * instance._activate('#myTarget');
 *
 * @example
 * // Activating a link with a specific href
 * instance._activate('http://example.com');
 *
 * @fires EVENT_ACTIVATE - Triggers an event indicating that a new target has been activated.
 */
});
/**
 * ------------------------------------------------------------------------
 * jQuery
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
/**
 * Removes the active class from all link items within the specified target.
 * This method searches for elements matching the defined selector and filters
 * those that currently have the active class applied. It then removes the
 * active class from each of these elements.
 *
 * @method _clear
 * @private
 * @throws {Error} Throws an error if the target is not defined or if no elements
 *                 are found matching the selector.
 *
 * @example
 * // Assuming this._config.target is set to a valid DOM element
 * instance._clear();
 */
const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
const CLASS_NAME_ACTIVE = 'active';
/**
 * A static method that acts as an interface for the ScrollSpy component.
 * It allows the execution of specific methods on the ScrollSpy instance based on the provided configuration.
 *
 * @param {Object|string} config - The configuration object or the name of the method to invoke on the ScrollSpy instance.
 * If a string is provided, it should correspond to a method name defined in the ScrollSpy class.
 *
 * @throws {TypeError} Throws an error if the provided config is a string and does not match any method name in the ScrollSpy instance.
 *
 * @returns {jQuery} Returns the jQuery object for chaining.
 *
 * @example
 * // Initialize ScrollSpy with default configuration
 * $('.selector').ScrollSpy();
 *
 * // Call a specific method on the ScrollSpy instance
 * $('.selector').ScrollSpy('refresh');
 *
 * // Throws TypeError if the method does not exist
 * $('.selector').ScrollSpy('nonExistentMethod'); // TypeError: No method named "nonExistentMethod"
 */
const CLASS_NAME_FADE$1 = 'fade';
const CLASS_NAME_SHOW$1 = 'show';
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
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
     * Triggers the completion of an event sequence by notifying related targets.
     *
     * This function is responsible for triggering two events:
     * one for the previous element being hidden and another for the current
     * element being shown. It utilizes the EventHandler to dispatch these events
     * with the appropriate related targets.
     *
     * @throws {Error} Throws an error if the event triggering fails due to
     *                 an invalid target or event handler.
     *
     * @example
     * // Assuming `previous` is a valid element and `this._element` is the current element
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
/**
 * Displays the current element by activating it and deactivating any previously active elements.
 *
 * This method checks if the current element is already active. If it is, the method returns early.
 * If not, it finds the closest navigation list group and determines the previously active item.
 * It triggers hide and show events for the previous and current elements, respectively.
 * If either event is prevented, the method exits without making any changes.
 * Finally, it activates the current element and triggers completion events once the activation is done.
 *
 * @throws {Error} Throws an error if the element is not found or if there is an issue with event handling.
 *
 * @example
 * const myElement = document.querySelector('.my-element');
 * myElement.show();
 */


  _activate(element, container, callback) {
    const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
    const active = activeElements[0];
    const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

    /**
     * Executes the transition completion process.
     *
     * This function is responsible for handling the completion of a transition,
     * invoking the necessary callback once the transition is confirmed to be complete.
     *
     * @function complete
     * @returns {void}
     *
     * @example
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

    /**
     * Activates a specified element within a given container, handling transitions if necessary.
     *
     * This method checks if the container is a list (UL or OL) and finds active elements within it.
     * If an active element is found and is currently transitioning, it will remove the show class
     * and queue the transition callback. Otherwise, it will call the transition complete function directly.
     *
     * @param {Element} element - The element to be activated.
     * @param {Element} container - The container within which to search for active elements.
     * @param {Function} [callback] - An optional callback function to be executed upon completion of the transition.
     *
     * @returns {void}
     *
     * @throws {TypeError} Throws an error if the provided element or container is not a valid DOM element.
     *
     * @example
     * // Example usage of _activate method
     * const myElement = document.getElementById('myElement');
     * const myContainer = document.getElementById('myContainer');
     * const myCallback = () => console.log('Transition complete!');
     *
     * this._activate(myElement, myContainer, myCallback);
     */
    element.classList.add(CLASS_NAME_ACTIVE);

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
    /**
     * Handles the completion of a transition for a given element.
     * This function updates the class names and ARIA attributes
     * of the element and its related elements based on the active state.
     *
     * @param {HTMLElement} element - The element that is transitioning.
     * @param {HTMLElement} active - The currently active element, if any.
     * @param {Function} [callback] - An optional callback function to be executed after the transition is complete.
     *
     * @throws {TypeError} If the provided element or active is not an HTMLElement.
     *
     * @example
     * // Example usage of _transitionComplete
     * const tabElement = document.querySelector('.tab');
     * const activeTab = document.querySelector('.tab.active');
     * _transitionComplete(tabElement, activeTab, () => {
     *   console.log('Transition complete!');
     * });
     */
    }

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
/**
 * Initializes or invokes methods on the Tab component for each element in the jQuery collection.
 *
 * This method can be called with a configuration object or a method name as a string.
 * If a string is provided, it attempts to call the corresponding method on the Tab instance.
 *
 * @static
 * @param {string|Object} config - The configuration object or the name of the method to invoke.
 * @throws {TypeError} Throws an error if the specified method does not exist on the Tab instance.
 * @returns {jQuery} The jQuery collection for chaining.
 *
 * @example
 * // Initialize all tabs
 * $('.tab').jQueryInterface();
 *
 * // Invoke a specific method on the Tab instance
 * $('.tab').jQueryInterface('show');
 */

  const data = Tab.getOrCreateInstance(this);
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
     * Completes the showing process of an element by removing the showing class,
     * triggering the shown event, and potentially scheduling a hide operation.
     *
     * This function is typically called after an element has been shown to finalize
     * the display process and clean up any necessary state.
     *
     * @throws {Error} Throws an error if the element is not properly initialized.
     *
     * @example
     * // Assuming `element` is a valid DOM element and has been shown
     * complete();
     */
    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING);

      EventHandler.trigger(this._element, EVENT_SHOWN);
/**
 * Displays the element by triggering the show event and applying the necessary CSS classes.
 * If the show event is prevented, the method will exit early.
 * This method also handles animation and scheduling for hiding the element.
 *
 * @throws {Error} Throws an error if the element is not defined or if an unexpected condition occurs during execution.
 *
 * @example
 * const myElement = document.getElementById('myElement');
 * const instance = new MyClass(myElement);
 * instance.show();
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
     * Completes the hiding of an element by updating its class list and triggering an event.
     *
     * This method performs the following actions:
     * - Adds a class to hide the element (deprecated).
     * - Removes classes that indicate the element is showing or in the process of showing.
     /**
      * Hides the associated element by removing the visible class and adding a hidden class.
      * This method triggers a hide event before proceeding with the hiding operation.
      * If the hide event is prevented, the method will exit early without making any changes.
      *
      * @throws {Error} Throws an error if the element is not defined or if there is an issue with the event handling.
      *
      * @example
      * const instance = new SomeClass();
      * instance.hide();
      */
     * - Triggers an event to notify that the element has been hidden.
     *
     * @deprecated This method uses a deprecated class addition for hiding elements.
     *
     * @throws {Error} Throws an error if the element is not defined or if there is an issue with event triggering.
     *
     * @example
     * // Assuming `element` is a valid DOM element
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
   * if it is currently present, ensuring that the element is hidden.
   *
   * @throws {Error} Throws an error if the disposal process fails.
   *
   * @example
   * const instance = new MyClass();
   * instance.dispose();
   * // The instance is now disposed and should not be used further.
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
   * This method takes a configuration object, merges it with default values,
   * and applies any data attributes found on the associated element. It also
   * validates the configuration against the expected types.
   *
   * @param {Object} config - The configuration object to be merged.
   * @returns {Object} The final merged configuration object.
   *
   * @throws {TypeError} Throws an error if the provided configuration does not
   *                     match the expected types defined in DefaultType.
   *
   * @example
   * const finalConfig = this._getConfig({ customSetting: true });
   * // finalConfig will contain the merged settings including defaults and
   * // any data attributes from the element.
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
   * Schedules the hiding of an element based on user interaction and configuration settings.
   *
   * This method checks if the autohide feature is enabled in the configuration. If autohide is disabled,
   * or if there is any mouse or keyboard interaction detected, the method will exit early without scheduling
   * a hide operation. If no interaction is detected, it sets a timeout to call the `hide` method after a
   * specified delay.
   *
   * @throws {Error} Throws an error if the hide method is not defined or if there are issues with the timeout.
   *
   * @returns {void} This method does not return a value.
   *
   * @example
   * // Assuming autohide is enabled and there is no user interaction
   * _maybeScheduleHide(); // This will schedule the hide operation.
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
   * Handles interaction events such as mouse and keyboard focus events.
   * Updates the interaction state based on the event type and whether the user is interacting.
   *
   * @param {Event} event - The event object representing the interaction event.
   * @param {boolean} isInteracting - A flag indicating whether the user is currently interacting.
   *
   * @returns {void} This function does not return a value.
   *
   * @throws {TypeError} Throws an error if the event parameter is not of type Event.
   *
   * @example
   * // Example usage:
   * element.addEventListener('mouseover', (event) => {
   *   this._onInteraction(event, true);
   * });
   *
   * element.addEventListener('mouseout', (event) => {
   *   this._onInteraction(event, false);
   * });
   *
   * element.addEventListener('focusin', (event) => {
   *   this._onInteraction(event, true);
   * });
   *
   * element.addEventListener('focusout', (event) => {
   *   this._onInteraction(event, false);
   * });
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
   * This method binds mouse and focus events to the element, triggering the
   * appropriate interaction handling method based on the event type.
   *
   * The following events are listened for:
   * - Mouse over
   * - Mouse out
   * - Focus in
   * - Focus out
   *
   * @throws {Error} Throws an error if the element is not defined or if event binding fails.
   *
   * @example
   * // Assuming `myElement` is a valid DOM element
   * const myInstance = new MyClass(myElement);
   * myInstance._setListeners();
   */
  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
    EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
  }

  /**
   * Clears the timeout that was previously set using `setTimeout`.
   * This method ensures that the timeout is properly cleared and
   * prevents any further execution of the associated callback.
   *
   * After clearing the timeout, the internal reference to the timeout
   * is set to null, indicating that there is no active timeout.
   *
   * @throws {Error} Throws an error if the timeout reference is invalid.
   *
   * @example
   * const instance = new MyClass();
   * instance._clearTimeout(); // Clears the existing timeout
   */
  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  } // Static


  /**
   * A static method that serves as the jQuery interface for the Toast component.
   * This method allows for the initialization of the Toast instance and the invocation
   * of specific methods on the instance based on the provided configuration.
   *
   * @param {Object|string} config - The configuration object for initializing the Toast instance,
   *                                 or a string representing the method name to invoke on the instance.
   * @returns {jQuery} The jQuery object for chaining.
   *
   * @throws {TypeError} Throws an error if a method specified by the string `config` does not exist
   *                     on the Toast instance.
   *
   * @example
   * // Initialize a Toast instance with default settings
   * $('.toast').jQueryInterface();
   *
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

export { Alert, Button, Carousel, Collapse, Dropdown, Modal, Offcanvas, Popover, ScrollSpy, Tab, Toast, Tooltip };
//# sourceMappingURL=bootstrap.esm.js.map
