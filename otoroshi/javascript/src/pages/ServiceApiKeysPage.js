import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as BackOfficeServices from '../services/BackOfficeServices';
import { Table, SelectInput, SimpleBooleanInput } from '../components/inputs';
import { ServiceSidebar } from '../components/ServiceSidebar';
import { WithEnv } from '../components/WithEnv';
import faker from 'faker';

const Both = ({ label, rawValue }) => (
  <div className="form-group">
    <label className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      <input
        onChange={e => ''}
        type="text"
        className="form-control"
        value={`${rawValue.clientId}:${rawValue.clientSecret}`}
      />
    </div>
  </div>
);

const CurlCommand = ({ label, rawValue }) => (
  <div className="form-group">
    <label className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      <WithEnv>
        {env => (
          <input
            onChange={e => ''}
            type="text"
            className="form-control"
            value={`curl -X GET -H '${env.clientIdHeader || 'Opun-Client-Id'}: ${
              rawValue.clientId
            }' -H '${env.clientSecretHeader || 'Opun-Client-Secret'}: ${
              rawValue.clientSecret
            }' http://xxxxxx --include`}
          />
        )}
      </WithEnv>
    </div>
  </div>
);

const BasicAuthToken = ({ label, rawValue }) => (
  <div className="form-group">
    <label className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      <input
        onChange={e => ''}
        type="text"
        className="form-control"
        value={`Authorization: Basic ${window.btoa(
          rawValue.clientId + ':' + rawValue.clientSecret
        )}`}
      />
    </div>
  </div>
);

const ResetSecret = ({ changeValue }) => (
  <div className="form-group">
    <label className="col-sm-2 control-label" />
    <div className="col-sm-10">
      <button
        type="button"
        className="btn btn-danger btn-xs"
        onClick={e => changeValue('clientSecret', faker.random.alphaNumeric(64))}>
        <i className="glyphicon glyphicon-refresh" /> Reset secret
      </button>
    </div>
  </div>
);

class ResetQuotas extends Component {
  resetQuotas = e => {
    e.preventDefault();
    BackOfficeServices.resetRemainingQuotas(
      this.props.rawValue.authorizedGroup,
      this.props.rawValue.clientId
    ).then(() => {
      window.location.reload();
    });
  };

  render() {
    console.log(this.props);
    return (
      <div className="form-group">
        <label className="col-sm-2 control-label" />
        <div className="col-sm-10">
          <button type="button" className="btn btn-danger btn-xs" onClick={this.resetQuotas}>
            <i className="glyphicon glyphicon-refresh" /> Reset quotas consumption
          </button>
        </div>
      </div>
    );
  }
}

class CopyCredentials extends Component {
  render() {
    const props = this.props;
    return (
      <div className="form-group">
        <label className="col-sm-2 control-label" />
        <div className="col-sm-10">
          <input
            ref={r => (this.clipboard = r)}
            style={{ position: 'fixed', left: 0, top: -250 }}
            type="text"
            value={props.rawValue.clientId + ':' + props.rawValue.clientSecret}
          />
          <button
            type="button"
            className="btn btn-success btn-xs"
            onClick={e => {
              this.clipboard.select();
              document.execCommand('Copy');
            }}>
            <i className="glyphicon glyphicon-copy" /> Copy credentials to clipboard
          </button>
        </div>
      </div>
    );
  }
}

class CopyFromLineItem extends Component {
  render() {
    const item = this.props.item;
    return (
      <button
        type="button"
        className="btn btn-sm btn-info"
        onClick={e => {
          this.clipboard.select();
          document.execCommand('Copy');
        }}>
        <i className="glyphicon glyphicon-copy" />
        <input
          type="text"
          ref={r => (this.clipboard = r)}
          style={{ position: 'fixed', left: 0, top: -250 }}
          value={item.clientId + ':' + item.clientSecret}
        />
      </button>
    );
  }
}

class DailyRemainingQuotas extends Component {
  state = {
    quotas: null,
  };

  componentDidMount() {
    BackOfficeServices.fetchRemainingQuotas(
      this.props.rawValue.authorizedGroup,
      this.props.rawValue.clientId
    ).then(quotas => {
      console.log(quotas);
      this.setState({ quotas });
    });
  }

  render() {
    const quotas = this.state.quotas || {
      authorizedCallsPerSec: 0,
      currentCallsPerSec: 0,
      remainingCallsPerSec: 0,
      authorizedCallsPerDay: 0,
      currentCallsPerDay: 0,
      remainingCallsPerDay: 0,
      authorizedCallsPerMonth: 0,
      currentCallsPerMonth: 0,
      remainingCallsPerMonth: 0,
    };
    return [
      <div className="form-group">
        <label htmlFor="input-Throttling quota" className="col-xs-12 col-sm-2 control-label">
          Consumed daily calls
          <i
            className="fa fa-question-circle-o"
            data-toggle="tooltip"
            data-placement="top"
            title=""
            data-original-title="The number of calls consumed today"
          />
        </label>
        <div className="col-sm-10">
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              id="input-Throttling quota"
              value={quotas.currentCallsPerDay}
            />
            <div className="input-group-addon">calls consumed today</div>
          </div>
        </div>
      </div>,
      <div className="form-group">
        <label htmlFor="input-Throttling quota" className="col-xs-12 col-sm-2 control-label">
          Remaining daily calls
          <i
            className="fa fa-question-circle-o"
            data-toggle="tooltip"
            data-placement="top"
            title=""
            data-original-title="The remaining number of calls for today"
          />
        </label>
        <div className="col-sm-10">
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              id="input-Throttling quota"
              value={quotas.remainingCallsPerDay}
            />
            <div className="input-group-addon">calls remaining for today</div>
          </div>
        </div>
      </div>,
      <div className="form-group">
        <label htmlFor="input-Throttling quota" className="col-xs-12 col-sm-2 control-label">
          Consumed monthly calls
          <i
            className="fa fa-question-circle-o"
            data-toggle="tooltip"
            data-placement="top"
            title=""
            data-original-title="The number of calls consumed this month"
          />
        </label>
        <div className="col-sm-10">
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              id="input-Throttling quota"
              value={quotas.currentCallsPerMonth}
            />
            <div className="input-group-addon">calls consumed this month</div>
          </div>
        </div>
      </div>,
      <div className="form-group">
        <label htmlFor="input-Throttling quota" className="col-xs-12 col-sm-2 control-label">
          Remaining monthly calls
          <i
            className="fa fa-question-circle-o"
            data-toggle="tooltip"
            data-placement="top"
            title=""
            data-original-title="The remaining number of calls for this month"
          />
        </label>
        <div className="col-sm-10">
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              id="input-Throttling quota"
              value={quotas.remainingCallsPerMonth}
            />
            <div className="input-group-addon">calls remaining for this month</div>
          </div>
        </div>
      </div>,
    ];
  }
}

export class ServiceApiKeysPage extends Component {
  formSchema = {
    remainingQuotas: {
      type: DailyRemainingQuotas,
      props: {
        label: '',
      },
    },
    copyCredentials: {
      type: CopyCredentials,
      props: {
        label: '',
      },
    },
    resetSecret: {
      type: ResetSecret,
      props: {
        label: '',
      },
    },
    resetQuotas: {
      type: ResetQuotas,
      props: {
        label: '',
      },
    },
    clientId: {
      type: 'string',
      props: {
        label: 'ApiKey Id',
        placeholder: 'The ApiKey id',
        help: 'The id is a unique random key that will represent this API key',
      },
    },
    clientSecret: {
      type: 'string',
      props: {
        label: 'ApiKey Secret',
        placeholder: 'The ApiKey secret',
        help: 'The secret is a random key used to validate the API key',
      },
    },
    both: { type: Both, props: { label: 'Both' } },
    curlCommand: { type: CurlCommand, props: { label: 'Curl Command' } },
    basicAuth: { type: BasicAuthToken, props: { label: 'Basic Auth. Header' } },
    clientName: {
      type: 'string',
      props: {
        label: 'ApiKey Name',
        help: 'A name for the API key, used for debug purposes',
        placeholder: `The name of the client (ie. ${faker.name.firstName()} ${faker.name.lastName()}'s ApiKey)`,
      },
    },
    authorizedGroup: {
      type: 'string',
      disabled: true,
      props: {
        label: 'Authorized group',
        placeholder: 'The group of the ApiKey',
        help: 'The group linked to this API Key',
      },
    },
    enabled: {
      type: 'bool',
      props: {
        label: 'Enabled',
        placeholder: 'The ApiKey is enabled',
        help: 'If the API key is disabled, then any call using this API key will fail',
      },
    },
    readOnly: {
      type: 'bool',
      props: {
        label: 'Read only',
        placeholder: 'The ApiKey is read only',
        help:
          'If the API key is in read only mode, every request done with this api key will only work for GET, HEAD, OPTIONS verbs',
      },
    },
    allowClientIdOnly: {
      type: 'bool',
      props: {
        label: 'Allow pass by clientid only',
        placeholder: 'Allow pass by clientid only',
        help:
          'Here you allow client to only pass client id in a specific header in order to grant access to the underlying api',
      },
    },
    metadata: {
      type: 'object',
      props: {
        label: 'Metadata',
        placeholderKey: 'Metadata Name',
        placeholderValue: 'Metadata value',
        help: 'Some useful metadata for downstream services',
      },
    },
    throttlingQuota: {
      type: 'number',
      props: {
        label: 'Throttling quota',
        placeholder: 'Authorized calls per second',
        suffix: 'calls per sec.',
        help: 'The authorized number of calls per second',
      },
    },
    dailyQuota: {
      type: 'number',
      props: {
        label: 'Daily quota',
        placeholder: 'Authorized calls per day',
        suffix: 'calls per day',
        help: 'The authorized number of calls per day',
      },
    },
    remainingDailyQuota: { type: 'label', props: { label: 'Daily quota' } },
    monthlyQuota: {
      type: 'number',
      props: {
        label: 'Monthly quota',
        placeholder: 'Authorized calls per month',
        suffix: 'calls per month',
        help: 'The authorized number of calls per month',
      },
    },
    remainingMonthlyQuota: { type: 'label', props: { label: 'Monthly quota' } },
  };

  columns = [
    {
      title: 'Name',
      content: item => item.clientName,
    },
    {
      title: 'ApiKey Id',
      content: item => item.clientId,
    },
    {
      title: 'Credentials',
      style: { textAlign: 'center', width: 90 },
      notFilterable: true,
      content: item => item.clientName,
      cell: (v, item, table) => <CopyFromLineItem item={item} table={table} />,
    },
    {
      title: 'Active',
      style: { textAlign: 'center', width: 70 },
      notFilterable: true,
      content: item => item.enabled,
      cell: (v, item, table) => (
        <SimpleBooleanInput
          value={item.enabled}
          onChange={value => {
            BackOfficeServices.updateApiKey(this.props.params.serviceId, {
              ...item,
              enabled: value,
            }).then(() => table.update());
          }}
        />
      ),
    },
  ];

  formFlow = [
    'clientId',
    'clientSecret',
    'clientName',
    'copyCredentials',
    'resetSecret',
    '---',
    'enabled',
    'readOnly',
    'allowClientIdOnly',
    '---',
    'metadata',
    '>>>Service Group settings',
    'authorizedGroup',
    '>>>Call examples',
    'curlCommand',
    'basicAuth',
    '>>>Quotas',
    'throttlingQuota',
    'dailyQuota',
    'monthlyQuota',
    '>>>Quotas consumption',
    'remainingQuotas',
    'resetQuotas',
  ];

  sidebarContent(name) {
    return (
      <ServiceSidebar
        env={this.state.service.env}
        serviceId={this.props.params.serviceId}
        name={name}
      />
    );
  }

  componentDidMount() {
    BackOfficeServices.fetchService(this.props.params.lineId, this.props.params.serviceId).then(
      service => {
        this.props.setTitle(`Service Api Keys`);
        this.setState({ service }, () => {
          this.props.setSidebarContent(this.sidebarContent(service.name));
        });
      }
    );
  }

  fetchAllApiKeys = () => {
    return BackOfficeServices.fetchApiKeys(this.props.params.lineId, this.props.params.serviceId);
  };

  createItem = ak => {
    return BackOfficeServices.createApiKey(this.props.params.serviceId, ak);
  };

  updateItem = ak => {
    return BackOfficeServices.updateApiKey(this.props.params.serviceId, ak);
  };

  deleteItem = ak => {
    return BackOfficeServices.deleteApiKey(this.props.params.serviceId, ak);
  };

  render() {
    return (
      <Table
        parentProps={this.props}
        selfUrl={`lines/${this.props.params.lineId}/services/${
          this.props.params.serviceId
        }/apikeys`}
        defaultTitle="Service Api Keys"
        defaultValue={() => ({
          clientId: faker.random.alphaNumeric(16),
          clientSecret: faker.random.alphaNumeric(64),
          enabled: true,
          throttlingQuota: 100,
          dailyQuota: 1000000,
          monthlyQuota: 1000000000000000000,
          authorizedGroup: this.state.service.groupId,
        })}
        itemName="ApiKey"
        formSchema={this.formSchema}
        formFlow={this.formFlow}
        columns={this.columns}
        fetchItems={this.fetchAllApiKeys}
        updateItem={this.updateItem}
        deleteItem={this.deleteItem}
        createItem={this.createItem}
        stayAfterSave={true}
        showActions={true}
        showLink={false}
        rowNavigation={true}
        navigateTo={item =>
          this.props.history.push({
            pathname: `/lines/${this.props.params.lineId}/services/${
              this.props.params.serviceId
            }/apikeys/edit/${item.clientId}`,
            query: { group: item.id, groupName: item.name },
          })
        }
        itemUrl={i =>
          `/bo/dashboard/lines/${this.props.params.lineId}/services/${
            this.props.params.serviceId
          }/apikeys/edit/${i.clientId}`
        }
        extractKey={item => item.clientId}
      />
    );
  }
}
