import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ArrayInput,
  ObjectInput,
  BooleanInput,
  CodeInput,
  SelectInput,
  TextInput,
  NumberInput,
  LabelInput,
} from '.';

import _ from 'lodash';
import { Collapse } from './Collapse';
import { TextareaInput } from './TextInput';

export class Form extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    schema: PropTypes.object,
    flow: PropTypes.array,
  };

  changeValue = (name, value) => {
    if (name.indexOf('.') > -1) {
      const [key1, key2] = name.split('.');
      const newValue = {
        ...this.props.value,
        [key1]: { ...this.props.value[key1], [key2]: value },
      };
      this.props.onChange(newValue);
    } else {
      const newValue = { ...this.props.value, [name]: value };
      this.props.onChange(newValue);
    }
  };

  getValue = (name, defaultValue) => {
    if (name.indexOf('.') > -1) {
      const [key1, key2] = name.split('.');
      if (this.props.value[key1]) {
        return this.props.value[key1][key2] || defaultValue;
      } else {
        return defaultValue;
      }
    } else {
      return this.props.value[name] || defaultValue;
    }
  };

  generateStep(name, idx) {
    if (_.isFunction(name)) {
      return React.createElement(name, {});
    } else if (React.isValidElement(name)) {
      return name;
    } else if (name.indexOf('>>>') === 0) {
      if (this.collapsed) {
        const collapsed = this.collapsed;
        const collapsedState = this.collapsedState;
        const collapsedLabel = this.collapsedLabel;
        this.collapsed = [];
        this.collapsedState = true;
        this.collapsedLabel = name.replace('>>>', '');
        return (
          <Collapse key={collapsedLabel} label={collapsedLabel} collapsed={collapsedState}>
            {collapsed}
          </Collapse>
        );
      } else {
        this.collapsed = [];
        this.collapsedState = true;
        this.collapsedLabel = name.replace('>>>', '');
        return null;
      }
    } else if (name.indexOf('<<<') === 0) {
      if (this.collapsed) {
        const collapsed = this.collapsed;
        const collapsedState = this.collapsedState;
        const collapsedLabel = this.collapsedLabel;
        this.collapsed = [];
        this.collapsedState = false;
        this.collapsedLabel = name.replace('<<<', '');
        return (
          <Collapse key={collapsedLabel} label={collapsedLabel} collapsed={collapsedState}>
            {collapsed}
          </Collapse>
        );
      } else {
        this.collapsed = [];
        this.collapsedState = false;
        this.collapsedLabel = name.replace('<<<', '');
        return null;
      }
    } else if (name === '---') {
      if (this.collapsed) {
        const collapsed = this.collapsed;
        const collapsedState = this.collapsedState;
        const collapsedLabel = this.collapsedLabel;
        delete this.collapsed;
        delete this.collapsedState;
        delete this.collapsedLabel;
        return (
          <Collapse
            key={collapsedLabel}
            label={collapsedLabel}
            collapsed={collapsedState}
            lineEnd={true}>
            {collapsed}
          </Collapse>
        );
      } else {
        return <hr key={idx} />;
      }
    } else {
      const { type, disabled, props = {} } = this.props.schema[name];
      // console.log('generate', name, 'of type', type, 'from', this.props.schema);
      let component = null;
      if (type) {
        if (type === 'array') {
          component = (
            <ArrayInput
              disabled={disabled}
              key={name}
              value={this.getValue(name, [])}
              {...props}
              onChange={v => this.changeValue(name, v)}
            />
          );
        } else if (type === 'object') {
          component = (
            <ObjectInput
              disabled={disabled}
              key={name}
              value={this.getValue(name, {})}
              {...props}
              onChange={v => this.changeValue(name, v)}
            />
          );
        } else if (type === 'bool') {
          component = (
            <BooleanInput
              disabled={disabled}
              key={name}
              value={this.getValue(name, false)}
              {...props}
              onChange={v => this.changeValue(name, v)}
            />
          );
        } else if (type === 'select') {
          component = (
            <SelectInput
              disabled={disabled}
              key={name}
              value={this.getValue(name, '')}
              {...props}
              onChange={v => this.changeValue(name, v)}
            />
          );
        } else if (type === 'string') {
          component = (
            <TextInput
              disabled={disabled}
              key={name}
              value={this.getValue(name, '')}
              {...props}
              onChange={v => this.changeValue(name, v)}
            />
          );
        } else if (type === 'code') {
          return (
            <CodeInput
              disabled={disabled}
              key={name}
              value={this.getValue(name, '')}
              {...props}
              onChange={v => this.changeValue(name, v)}
            />
          );
        } else if (type === 'text') {
          return (
            <TextareaInput
              disabled={disabled}
              key={name}
              value={this.getValue(name, '')}
              {...props}
              onChange={v => this.changeValue(name, v)}
            />
          );
        } else if (type === 'label') {
          component = <LabelInput key={name} value={this.getValue(name, '')} {...props} />;
        } else if (type === 'number') {
          component = (
            <NumberInput
              disabled={disabled}
              key={name}
              value={this.getValue(name, 0)}
              {...props}
              onChange={v => this.changeValue(name, v)}
            />
          );
        } else if (_.isFunction(type)) {
          component = React.createElement(type, {
            ...props,
            disabled,
            rawValue: this.props.value,
            rawOnChange: this.props.onChange,
            key: name,
            value: this.getValue(name, {}),
            changeValue: this.changeValue,
            onChange: v => this.changeValue(name, v),
          });
        } else if (React.isValidElement(type)) {
          component = type;
        } else {
          console.error(`No field named '${name}' of type ${type}`);
        }
      }
      if (this.collapsed) {
        this.collapsed.push(component);
        return null;
      } else {
        return component;
      }
    }
  }

  generateLastStep() {
    if (this.collapsed) {
      const collapsed = this.collapsed;
      const collapsedState = this.collapsedState;
      const collapsedLabel = this.collapsedLabel;
      delete this.collapsed;
      delete this.collapsedState;
      delete this.collapsedLabel;
      return (
        <Collapse key="last" label={collapsedLabel} collapsed={collapsedState}>
          {collapsed}
        </Collapse>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <form className="form-horizontal" style={this.props.style}>
        {this.props.flow.map((step, idx) => this.generateStep(step, idx))}
        {this.generateLastStep()}
      </form>
    );
  }
}
