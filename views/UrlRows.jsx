import React from 'react';
 
class UrlRows extends React.Component {
  render() {
    return (
      <tr className="shortened-url">
        <td className="clicks">
          {this.props.clicks}
        </td>
        <td className="created-at">
          {this.props.createdAt}
        </td>
        <td className="expires-at">
          {this.props.expires_at}
        </td>
        <td className="guid">
          {this.props.guid}
        </td>
        <td className="id">
          {this.props.id}
        </td>
        <td className="url">
          {this.props.url}
        </td>
      </tr>
    );
  }
};
 
export default UrlRows;
