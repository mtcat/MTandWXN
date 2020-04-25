import React from 'react';
import { Progress } from 'antd-mobile';

const style = {
  display: 'flex',
  width: '100%',
  height: '147px',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
};
const panelStyle = {
  width: '100%',
  height: '150px',
  backgroundColor: '#fff',
};

class ProgressPanel extends React.Component {
  render() {
    let { text = '', percent = false } = this.props;

    return (
      <div style={panelStyle}>
        <div style={style}>{text}</div>
        {percent === false ? null : (
          <Progress percent={percent} position="normal" unfilled={false} />
        )}
      </div>
    );
  }
}

export default ProgressPanel;
