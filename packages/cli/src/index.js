// @flow

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { render } from 'mustache';

class Template {
  constructor(name, data) {
    // name of template
    this.name = name;
    // data for the template to render
    this.data = data;
  }

  path() {
    // get path of the template, based on the name
    return path.join(
      __dirname,
      '..',
      'src/templates/',
      `${this.name}.mustache`,
    );
  }

  load() {
    // load the template as a string
    return fs.readFileSync(this.path(), 'utf-8');
  }

  render() {
    // render the template with the data
    return render(this.load(), this.data);
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
    // split props by empty space and put them in an array
    return this.props.split(' ');
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

    // format the template name to lower case
    template = template.toLowerCase();
    // format props into prop name and type objects in an array
    props = new Props(props).format();
    // log result for debugging
    new Template(template, { props, name }).log();
  });
