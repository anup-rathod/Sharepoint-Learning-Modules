import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';
import {
  BaseFieldCustomizer,
  type IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'FieldTaskFieldCustomizerStrings';
import FieldTask, { IFieldTaskCustomizerProps } from './components/FieldTask';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
// export interface IFieldTaskFieldCustomizerProperties {
//   // This is an example; replace with your own property
//   sampleText?: string;
// }

export interface IFieldTaskFieldCustomizerParameters {
  Approver: string;
  Reviewer: string;
  Author: string;
}

const LOG_SOURCE: string = 'FieldTaskFieldCustomizer';

export default class FieldTaskFieldCustomizer
  extends BaseFieldCustomizer<IFieldTaskFieldCustomizerParameters> {

  public onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, 'Activated FieldTaskFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "FieldTaskFieldCustomizer" and "${strings.Title}"`);
    return Promise.resolve();
  }

  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    // Use this method to perform your custom cell rendering.
    // const text: string = `${this.properties.sampleText}: ${event.fieldValue}`;
    const itemId = event.listItem.getValueByName('ID');
    const title = event.listItem.getValueByName('Title');
    const approver1 = event.listItem.getValueByName('Approver');
    const reviewer1 = event.listItem.getValueByName('Receiver');
    const author1 = event.listItem.getValueByName('Author0');

    const ApproverProp = approver1;
    const ReviewerProp = reviewer1;
    const AuthorProp = author1; 
    const approver = approver1[0].title;
    const reviewer = reviewer1[0].email;
    const author = author1[0].title;
    
    const fieldTaskProps: IFieldTaskCustomizerProps = {
      ApproverProp,
      ReviewerProp,
      AuthorProp,
      approver,
      reviewer,
      author,
      itemId,
      title,
      context: this.context,
    };

    const fieldTask: React.ReactElement<{}> =
      React.createElement(FieldTask, fieldTaskProps);
      

    ReactDOM.render(fieldTask, event.domElement);
  }

  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.domElement);
    super.onDisposeCell(event);
  }
}
