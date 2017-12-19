import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as BackOfficeServices from '../services/BackOfficeServices';
import { Table } from '../components/inputs';
import faker from 'faker';

export class GroupsPage extends Component {
  formSchema = {
    id: { type: 'string', disabled: true, props: { label: 'Id', placeholder: '---' } },
    name: {
      type: 'string',
      props: { label: 'Group name', placeholder: 'My Awesome service group' },
    },
    description: {
      type: 'string',
      props: { label: 'Group description', placeholder: 'Description of the group' },
    },
  };

  columns = [
    { title: 'Name', content: item => item.name },
    { title: 'Description', content: item => item.description },
  ];

  formFlow = ['id', 'name', 'description'];

  componentDidMount() {
    this.props.setTitle(`All service groups`);
  }

  render() {
    return (
      <Table
        parentProps={this.props}
        selfUrl="groups"
        defaultTitle="All service groups"
        defaultValue={() => ({ id: faker.random.alphaNumeric(64) })}
        itemName="group"
        formSchema={this.formSchema}
        formFlow={this.formFlow}
        columns={this.columns}
        fetchItems={BackOfficeServices.findAllGroups}
        updateItem={BackOfficeServices.updateGroup}
        deleteItem={BackOfficeServices.deleteGroup}
        createItem={BackOfficeServices.createGroup}
        navigateTo={item =>
          this.props.history.push({
            pathname: `/services`,
            query: { group: item.id, groupName: item.name },
          })
        }
        itemUrl={i => `/bo/dashboard/services?group=${i.id}&groupName=${i.name}`}
        showActions={true}
        showLink={true}
        rowNavigation={true}
        extractKey={item => item.id}
      />
    );
  }
}
