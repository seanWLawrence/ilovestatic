"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _mustache = require("mustache");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Template =
/*#__PURE__*/
function () {
  function Template(name, data) {
    _classCallCheck(this, Template);

    // name of template
    this.name = name.toLowerCase(); // data for the template to render

    this.data = data;
  }

  _createClass(Template, [{
    key: "templatePath",
    value: function templatePath() {
      // get path of the template, based on the name
      return _path.default.join(__dirname, '..', 'src/templates/', "".concat(this.name, ".mustache"));
    }
  }, {
    key: "renderPath",
    value: function renderPath() {
      return _path.default.join(__dirname, "".concat(this.name, "s"), this.data.name);
    }
  }, {
    key: "load",
    value: function load() {
      // load the template as a string
      return _fs.default.readFileSync(this.templatePath(), 'utf-8');
    }
  }, {
    key: "render",
    value: function render() {
      // render the template with the data
      return (0, _mustache.render)(this.load(), this.data);
    }
  }, {
    key: "createFile",
    value: function createFile() {
      var extension = this.name === 'page' ? '.md' : '.js';

      _fs.default.writeFileSync("".concat(this.renderPath()).concat(extension), this.render());
    }
  }, {
    key: "log",
    value: function log() {
      // log the result, for debugging and development
      console.log(this.render());
    }
  }]);

  return Template;
}();

var Props =
/*#__PURE__*/
function () {
  function Props(props) {
    _classCallCheck(this, Props);

    this.props = props;
  }

  _createClass(Props, [{
    key: "split",
    value: function split() {
      if (this.props.indexOf(' ')) {
        // if multiple props, split them by empty space and put them in an array
        return this.props.split(' ');
      } // if not, simply return the single prop


      return this.props;
    }
  }, {
    key: "reduce",
    value: function reduce(acc, next) {
      // reduce array of strings into array of <prop-name>:<type> objects
      next = next.split(':');

      var _next = next,
          _next2 = _slicedToArray(_next, 2),
          name = _next2[0],
          type = _next2[1];

      return acc.concat({
        name: name,
        type: type
      });
    }
  }, {
    key: "format",
    value: function format() {
      // reduce the array of props into an array of prop objects with <prop-name>:<type> key values
      return this.split().reduce(this.reduce, []);
    }
  }]);

  return Props;
}(); // init command line prompt to gather data from user


_inquirer.default.prompt([{
  message: 'What would you like to create?',
  type: 'list',
  name: 'template',
  choices: ['Component', 'Template', 'Project', 'Page'],
  default: 'component',
  validate: function validate(answer) {
    return answer === 'Component' || 'Template' || 'Page' || 'Project';
  }
}, {
  message: 'What is it\'s name?',
  type: 'input',
  name: 'name',
  validate: function validate(answer) {
    return typeof answer === 'string';
  }
}, {
  message: 'List it\'s props and types, i.e. <prop-name>:<type> <another-prop-name>:<type>',
  type: 'input',
  name: 'props',
  validate: function validate(answer) {
    return typeof answer === 'string';
  }
}]).then(function (answers) {
  var name = answers.name,
      template = answers.template,
      props = answers.props; // format props into prop name and type objects in an array

  props = new Props(props).format(); // log result for debugging

  var result = new Template(template, {
    props: props,
    name: name
  });
  result.log();
  result.createFile();
});
