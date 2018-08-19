// @flow

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { render } from 'mustache';

class Template {
  constructor(name, data) {
    // name of template
    this.name = name.toLowerCase();
    // data for the template to render
    this.data = data;
  }

  templatePath() {
    // get path of the template, based on the name
    return path.join(
      __dirname,
      '..',
      'src/templates/',
      `${this.name}.mustache`,
    );
  }

  renderPath() {
    return path.join(__dirname, `${this.name}s`, this.data.name);
  }

  load() {
    // load the template as a string
    return fs.readFileSync(this.templatePath(), 'utf-8');
  }

  render() {
    // render the template with the data
    return render(this.load(), this.data);
  }

  createFile() {
    let extension = this.name === 'page' ? '.md' : '.js';
    fs.writeFileSync(`${this.renderPath()}${extension}`, this.render());
  }

  log() {
    // log the result, for debugging and development
    console.log(this.render());
  }
}

class Props {
  constructor(props) {
    this.props = props;
  }

  split() {
    if (this.props.indexOf(' ')) {
      // if multiple props, split them by empty space and put them in an array
      return this.props.split(' ');
    }
    // if not, simply return the single prop
    return this.props;
  }

  reduce(acc, next) {
    // reduce array of strings into array of <prop-name>:<type> objects
    next = next.split(':');
    let [name, type] = next;
    return acc.concat({ name, type });
  }

  format() {
    // reduce the array of props into an array of prop objects with <prop-name>:<type> key values
    return this.split().reduce(this.reduce, []);
  }
}

// init command line prompt to gather data from user
inquirer
  .prompt([
    {
      message: 'What would you like to create?',
      type: 'list',
      name: 'template',
      choices: ['Component', 'Template', 'Project', 'Page'],
      default: 'component',
      validate: (answer) =>
        answer === 'Component' || 'Template' || 'Page' || 'Project',
    },
    {
      message: 'What is it\'s name?',
      type: 'input',
      name: 'name',
      validate: (answer) => typeof answer === 'string',
    },
    {
      message:
        'List it\'s props and types, i.e. <prop-name>:<type> <another-prop-name>:<type>',
      type: 'input',
      name: 'props',
      validate: (answer) => typeof answer === 'string',
    },
  ])
  .then((answers) => {
    let { name, template, props } = answers;
    // format props into prop name and type objects in an array
    props = new Props(props).format();
    // log result for debugging
    let result = new Template(template, { props, name });
    result.log();
    result.createFile();
  });
