import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import styles from './FieldTask.module.scss';
import { PiFlowArrow } from "react-icons/pi";
import { SPFx, spfi } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { HoverCard, IPlainCardProps, IHoverCardProps, HoverCardType } from '@fluentui/react';

export interface IFieldTaskCustomizerProps {
  ApproverProp: any,
  ReviewerProp: any,
  AuthorProp: any,
  approver: any;
  reviewer: any;
  author: string;
  itemId: number;
  title: string;
  context: any,
}

export interface IFieldTaskCustomizerState {
  isHovered: boolean,
  approvalItems: any[],
}

const LOG_SOURCE: string = 'FieldTask';

export default class FieldTask extends React.Component<IFieldTaskCustomizerProps, IFieldTaskCustomizerState, {}> {
  constructor(props: IFieldTaskCustomizerProps) {
    super(props);
    this.state = {
      isHovered: false,
      approvalItems: [],
    };
  }

  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: FieldTask mounted');
    this.getApproval();
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: FieldTask unmounted');
  }

  getApproval = async () => {
    const sp: any = spfi().using(SPFx(this.props.context));
    const sp1 = sp.web.lists.getByTitle("FieldTask");
    const Approvalitems = await sp1.items.select("Approval")();

    const parsedApprovalItems = Approvalitems.map((item: any) => {
      try {
        return JSON.parse(item.Approval);
      } catch (error) {
        console.error("Error parsing approval item:", error);
        return [];
      }
    });

    this.setState({ approvalItems: parsedApprovalItems.flat() });
    console.log(parsedApprovalItems.flat());
  }

  handleAdd = async () => {
    try {
      const sp: any = spfi().using(SPFx(this.props.context));
      const Approveruser = this.props.ApproverProp;
      const Authoruser = this.props.AuthorProp;
      const Revieweruser = this.props.ReviewerProp;
      const list = await sp.web.lists.getByTitle("FieldTask").items.add({
        'Title': this.props.title,
        'ApproverId': Approveruser[0].id,
        'Author0Id': Authoruser[0].id,
        'ReceiverId': Revieweruser[0].id,
      });
      console.log(list)

      alert('Added Successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  }

  // approval log table
  public onRenderApprovalLog = (): JSX.Element => {
    const { approvalItems } = this.state;

    return (
      <div className={styles.hoverCardContent}>
        <table>
          <thead>
            <tr>
              <th>Approver</th>
              <th>Title</th>
              <th>Comments</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {approvalItems.map((approval, index) => (
              <tr key={index}>
                <td>{approval.Approver}</td>
                <td>{approval.Title}</td>
                <td>{approval.Comments}</td>
                <td>{new Date(approval.Date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  public onRenderBasicInfo = () => {
    const { approver, reviewer, author } = this.props;

    return (
      <div className={styles.hoverCardContent}>
        <table>
          <tbody>
            <tr>
              <th>Approver:</th>
              <td>{approver}</td>
            </tr>
            <tr>
              <th>Reviewer:</th>
              <td>{reviewer}</td>
            </tr>
            <tr>
              <th>Author:</th>
              <td>{author}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // props for the approval log card
  public approvalLogCardProps: IPlainCardProps = {
    onRenderPlainCard: this.onRenderApprovalLog,
  }

  // props for the basic info card
  public basicInfoCardProps: IPlainCardProps = {
    onRenderPlainCard: this.onRenderBasicInfo,
  }

  // props for the HoverCard
  public hoverCardProps: IHoverCardProps = {
    plainCardProps: this.basicInfoCardProps,
    instantOpenOnClick: true,
    type: HoverCardType.plain,
  };

  public approvalHoverCardProps: IHoverCardProps = {
    plainCardProps: this.approvalLogCardProps,
    instantOpenOnClick: true,
    type: HoverCardType.plain,
  };

  public render(): React.ReactElement<IFieldTaskCustomizerProps> {
    return (
      <div className={styles.fieldTask}>
        <span className={styles.icons} onClick={this.handleAdd}>
          <PiFlowArrow size={20} />
        </span>
        <span className={styles.icons}>
          <HoverCard {...this.hoverCardProps}>
            <BsFillPersonLinesFill size={20} style={{ marginLeft: '10px' }} />
          </HoverCard>
        </span>
        <span className={styles.icons}>
          {this.approvalHoverCardProps && Object.keys(this.approvalHoverCardProps).length > 0 ? (
            <HoverCard {...this.approvalHoverCardProps}>
              <BiSolidMessageAltEdit size={20} style={{ marginLeft: '20px' }} />
            </HoverCard>
          ) : ( 
            <span style={{ marginLeft: '20px' }}> </span> // Render blank space or placeholder
          )}

        </span>
      </div>
    );
  }
}
