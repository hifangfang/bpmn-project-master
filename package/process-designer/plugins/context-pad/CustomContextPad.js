import {
  isArray,
  isFunction,
  forEach
} from 'min-dash'

import {
  domify,
  query as domQuery,
  attr as domAttr,
  clear as domClear,
  classes as domClasses,
  matches as domMatches,
  delegate as domDelegate,
  event as domEvent
} from 'min-dom'
import {isNumber} from "min-dash/dist/index";
import bus from "@/utils/bus";
import {Loading, Message,MessageBox} from 'element-ui'
var entrySelector = '.entry';
var delegate = {
  bind: bind$1$1,
  unbind: unbind$1
};
var forceCaptureEvents = ['focus', 'blur'];
var bind$1 = window.addEventListener ? 'addEventListener' : 'attachEvent',
  unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
  prefix = bind$1 !== 'addEventListener' ? 'on' : '';
var unbind_1 = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
var bind_1 = function(el, type, fn, capture){
  el[bind$1](prefix + type, fn, capture || false);
  return fn;
};
var componentEvent = {
  bind: bind_1,
  unbind: unbind_1
};
var proto = typeof Element !== 'undefined' ? Element.prototype : {};
var vendor = proto.matches
  || proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

var matchesSelector = match;
/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}
function isDefined(obj) {
  return obj !== undefined;
}
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
function assign(target) {
  for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    others[_key - 1] = arguments[_key];
  }

  return _extends.apply(void 0, [target].concat(others));
}
function bind$1$1(el, selector, type, fn, capture) {
  if (forceCaptureEvents.indexOf(type) !== -1) {
    capture = true;
  }

  return componentEvent.bind(el, type, function (e) {
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true);
    if (e.delegateTarget) {
      fn.call(el, e);
    }
  }, capture);
}
function unbind$1(el, type, fn, capture) {
  if (forceCaptureEvents.indexOf(type) !== -1) {
    capture = true;
  }

  return componentEvent.unbind(el, type, fn, capture);
}
/**
 * Set attribute `name` to `val`, or get attr `name`.
 *
 * @param {Element} el
 * @param {String} name
 * @param {String} [val]
 * @api public
 */
function attr(el, name, val) {
  // get
  if (arguments.length == 2) {
    return el.getAttribute(name);
  }

  // remove
  if (val === null) {
    return el.removeAttribute(name);
  }

  // set
  el.setAttribute(name, val);

  return el;
}
function query(selector, el) {
  el = el || document;

  return el.querySelector(selector);
}
/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */
function classes(el) {
  return new ClassList(el);
}
/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}
/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function (name) {
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = indexof(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};
/**
 * Adds an element to a collection and returns true if the
 * element was added.
 *
 * @param {Array<Object>} elements
 * @param {Object} e
 * @param {boolean} unique
 */
function add(elements, e, unique) {
  var canAdd = !unique || elements.indexOf(e) === -1;

  if (canAdd) {
    elements.push(e);
  }

  return canAdd;
}
/**
 * Closest
 *
 * @param {Element} el
 * @param {String} selector
 * @param {Boolean} checkYourSelf (optional)
 */
function closest (element, selector, checkYourSelf) {
  var currentElem = checkYourSelf ? element : element.parentNode;

  while (currentElem && currentElem.nodeType !== document.DOCUMENT_NODE && currentElem.nodeType !== document.DOCUMENT_FRAGMENT_NODE) {

    if (matchesSelector(currentElem, selector)) {
      return currentElem;
    }

    currentElem = currentElem.parentNode;
  }

  return matchesSelector(currentElem, selector) ? currentElem : null;
}
/**
 * Ensure the passed argument is a proper unit (defaulting to px)
 */
function ensureUnit(val) {
  return val + (isNumber(val) ? 'px' : '');
}
/**
 * A palette containing modeling elements.
 */
export default function ContextPad(config, eventBus, overlays,paletteEntries, modeling,) {

  this._eventBus = eventBus;
  this._overlays = overlays;
  this.modeling=modeling
  this._entries = paletteEntries
  var scale = isDefined(config && config.scale) ? config.scale : {
    min: 1,
    max: 1.5
  };

  this._overlaysConfig = {
    position: {
      right: -9,
      top: -6
    },
    scale: scale
  };

  this._current = null;

  this._init();
}

ContextPad.$inject = [
  'config.contextPad',
  'eventBus',
  'overlays',
  'config.paletteEntries',
  'modeling',
];

/**
 * Register a provider with the palette
 *
 * @param  {number} [priority=1000]
 * @param  {PaletteProvider} provider
 *
 * @example
 * const paletteProvider = {
 *   getPaletteEntries: function() {
 *     return function(entries) {
 *       return {
 *         ...entries,
 *         'entry-1': {
 *           label: 'My Entry',
 *           action: function() { alert("I have been clicked!"); }
 *         }
 *       };
 *     }
 *   }
 * };
 *
 * palette.registerProvider(800, paletteProvider);
 */
ContextPad.prototype.registerProvider = function(priority, provider) {
  if (!provider) {
    provider = priority;
    priority = DEFAULT_PRIORITY;
  }

  this._eventBus.on('contextPad.getProviders', priority, function(event) {
    event.providers.push(provider);
  });
};

/**
 * Returns the palette entries
 *
 * @return {Object<string, PaletteEntryDescriptor>} map of entries
 */
ContextPad.prototype.getEntries = function(element) {
  var providers = this._getProviders();

  var entries = {};

  // loop through all providers and their entries.
  // group entries by id so that overriding an entry is possible
  forEach(providers, function(provider) {
    var entriesOrUpdater = provider.getContextPadEntries(element);

    if (isFunction(entriesOrUpdater)) {
      entries = entriesOrUpdater(entries);
    } else {
      forEach(entriesOrUpdater, function(entry, id) {
        entries[id] = entry;
      });
    }
  });
  debugger

  return entries;
};
/**
 * Initialize
 */
ContextPad.prototype._init = function() {

  var eventBus = this._eventBus;

  var self = this;

  eventBus.on('selection.changed', function(e) {

    var selection = e.newSelection;

    if (selection.length === 1) {
      self.open(selection[0]);
    } else {
      self.close();
    }
  });

  eventBus.on('elements.delete', function(event) {
    var elements = event.elements;

    forEach(elements, function(e) {
      if (self.isOpen(e)) {
        self.close();
      }
    });
  });

  eventBus.on('element.changed', function(event) {
    var element = event.element,
      current = self._current;

    // force reopen if element for which we are currently opened changed
    if (current && current.element === element) {
      self.open(element, true);
    }
  });
};

ContextPad.prototype._getProviders = function(id) {
  var event = this._eventBus.createEvent({
    type: 'contextPad.getProviders',
    providers: []
  });

  this._eventBus.fire(event);

  return event.providers;
};

/**
 * Update palette state.
 *
 * @param  {Object} [state] { open, twoColumn }
 */
ContextPad.prototype._updateAndOpen = function(element) {
  const {
    modeling,    //modeling引进来, 因为要使用到它的removeElements方法;
  } = this;
  var entries = this.getEntries(element),
    pad = this.getPad(element),
    html = pad.html;
  // 删除和修改组件类型图标
  const actionWrap=domify('<div class="actionWrap"><i class="iconfont zwpt_del1 deleteIcon" title="删除" ></i><i class="iconfont zwpt_shezhi2 editIcon" title="修改组件类型"></i></div>');
  if(element.type=='bpmn:SequenceFlow'){
    assign(actionWrap.style, {
      position: "absolute",
      top:ensureUnit(20),
      left:'-'+ensureUnit(element.width*0.6)
    });
  }else {
    assign(actionWrap.style, {
      position: "absolute",
      top:ensureUnit(element.height+20),
      left:'-'+ensureUnit(element.width*0.5+30)
    });
  }
  forEach(entries, function(entry, id) {
    var grouping = entry.group || 'default',
      control = domify(entry.html || '<div class="entry" draggable="true"></div>'),
      container;
    attr(control, 'data-action', id);
    container = query('[data-group=' + grouping + ']', html);
    if (!container) {
      container = domify('<div class="group" data-group="' + grouping + '"></div>');
      //下拉箭头
      const arrowDown = 'el-icon-arrow-right'
      const groupLabel = domify(
        `<div class="groupLabel"></i></i><span title="${grouping}">${grouping}</span><i id="custom-palette-group-arrow" class="${arrowDown}"></i></div></div>`
      )
      //处理下拉 组件的显示隐藏
      groupLabel.addEventListener('click', function () {
        const iconArrowDown = this.querySelector('.el-icon-arrow-down')
        const iconArrowLeft = this.querySelector('.el-icon-arrow-right')
        if (iconArrowDown) {
          iconArrowDown.classList = ['el-icon-arrow-right']
          const entry = this.parentNode.querySelectorAll('.entry')
          forEach(entry, function (it) {
            it.style.display = 'none'
          })
        }
        if (iconArrowLeft) {
          iconArrowLeft.classList = ['el-icon-arrow-down']
          const entry = this.parentNode.querySelectorAll('.entry')
          debugger
          forEach(entry, function (it) {
            it.style.display = 'block'
          })
        }
      })
      container.appendChild(groupLabel)
      if(element.type!="bpmn:StartEvent"){
        html.appendChild(actionWrap)
      }
      html.appendChild(container);
    }
    container.appendChild(control);
    //添加class
    if (entry.className) {
      addClasses(control, entry.className);
    }
    if (entry.title) {
      attr(control, 'title', entry.title);
      control.appendChild(domify('<span title="' + entry.title +'">'+entry.title+'</span>'))
    }
    if (entry.imageUrl) {
      control.appendChild(domify('<img src="' + entry.imageUrl + '">'));
    }
  });
  if(element.type!="bpmn:StartEvent"){
    html.appendChild(actionWrap)
    //给删除和修改组件类型添加事件及方法
    const deleteIcon=document.getElementsByClassName("deleteIcon")[0]
    const editIcon=document.getElementsByClassName("editIcon")[0]
    //删除
    deleteIcon.addEventListener('click', function () {
      MessageBox.confirm(
        '确认删除该组件',
        '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        modeling.removeElements([element])
        Message({message: "删除成功!", type: "success"});
      }) .catch(() => {
        Message({message: "已取消删除!", type: "info"});
      });
    })
    //修改组件类型
    editIcon.addEventListener('click', function () {
      bus.$emit('showDialog', element)
      // modeling.replaceElement([element])
    })
  }
  //初始隐藏下拉
  const allEntry=document.querySelectorAll('.entry')
  console.log(allEntry)
  forEach(allEntry, function (it) {
    it.style.display = 'none'
  })
  classes(html).add('open');
  // 只显示删除和修改类型的组件 工具栏处理样式
  if(Object.keys(entries).length == 0){
    classes(html).add('empty-pad');
  }
  this._current = {
    element: element,
    pad: pad,
    entries: entries
  };

  this._eventBus.fire('contextPad.open', { current: this._current });
};
ContextPad.prototype.getPad = function(element) {
  if (this.isOpen()) {
    return this._current.pad;
  }

  var self = this;

  var overlays = this._overlays;

  var html = domify('<div class="djs-contextprovider-pad"></div>');

  var overlaysConfig = assign({
    html: html
  }, this._overlaysConfig);

  delegate.bind(html, entrySelector, 'click', function(event) {
    self.trigger('click', event);
  });

  delegate.bind(html, entrySelector, 'dragstart', function(event) {
    self.trigger('dragstart', event);
  });

  // stop propagation of mouse events
  componentEvent.bind(html, 'mousedown', function(event) {
    event.stopPropagation();
  });

  this._overlayId = overlays.add(element, 'context-pad', overlaysConfig);

  var pad = overlays.get(this._overlayId);

  this._eventBus.fire('contextPad.create', { element: element, pad: pad });

  return pad;
};
/**
 * Trigger an action available on the palette
 *
 * @param  {string} action
 * @param  {Event} event
 */
ContextPad.prototype.trigger = function(action, event, autoActivate) {

  var element = this._current.element,
    entries = this._current.entries,
    entry,
    handler,
    originalEvent,
    button = event.delegateTarget || event.target;

  if (!button) {
    return event.preventDefault();
  }

  entry = entries[attr(button, 'data-action')];
  handler = entry.action;

  originalEvent = event.originalEvent || event;

  // simple action (via callback function)
  if (isFunction(handler)) {
    if (action === 'click') {
      return handler(originalEvent, element, autoActivate);
    }
  } else {
    if (handler[action]) {
      return handler[action](originalEvent, element, autoActivate);
    }
  }

  // silence other actions
  event.preventDefault();
};


/**
 * Close the context pad
 */
ContextPad.prototype.close = function() {
  if (!this.isOpen()) {
    return;
  }

  this._overlays.remove(this._overlayId);

  this._overlayId = null;

  this._eventBus.fire('contextPad.close', { current: this._current });

  this._current = null;
};

/**
 * Open the context pad for the given element
 *
 * @param {djs.model.Base} element
 * @param {boolean} force if true, force reopening the context pad
 */
ContextPad.prototype.open = function(element, force) {
  if (!force && this.isOpen(element)) {
    return;
  }

  this.close();
  this._updateAndOpen(element);
};


/**
 * Check if pad is open. If element is given, will check
 * if pad is opened with given element.
 *
 * @param {Element} element
 * @return {boolean}
 */
ContextPad.prototype.isOpen = function(element) {
  return !!this._current && (!element ? true : this._current.element === element);
};
function addClasses (element, classNames) {
  var classes = domClasses(element)

  var actualClassNames = isArray(classNames) ? classNames : classNames.split(/\s+/g)
  actualClassNames.forEach(function (cls) {
    classes.add(cls)
  })
}

function addPaletteEntries (entries, provider) {
  var entriesOrUpdater = provider.getPaletteEntries()

  if (isFunction(entriesOrUpdater)) {
    return entriesOrUpdater(entries)
  }
  debugger
  forEach(entriesOrUpdater, function (entry, id) {
    entries[id] = entry
  })
  console.log(entries)
  return entries
}
