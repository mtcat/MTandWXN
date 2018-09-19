import React from 'react'
import { Tabs, WhiteSpace } from 'antd-mobile'

const tabs = [
  { title: 'First Tab' },
  { title: 'Second Tab' },
  { title: 'Third Tab' },
]
const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '150px',
  backgroundColor: '#fff',
}

class Home extends React.Component {
  state = {
    time: ''
  }

  componentDidMount() {
    this.cd()
  }

  cd() {
    let start = new Date(2018, 4, 27, 13, 0, 0).getTime()
    let now = Date.now()
    let interval = (now - start) / 1000
    let day = interval / (24 * 60 * 60)
    let hours = (interval % (24 * 60 * 60)) / (60 * 60)
    let minutes = ((interval % (24 * 60 * 60)) % (60 * 60)) / 60
    let seconds = ((interval % (24 * 60 * 60)) % (60 * 60)) % 60
    let time = `${Math.floor(day)}天${Math.floor(hours)}小时${Math.floor(
      minutes
    )}分钟${Math.floor(seconds)}秒`

    this.setState({ time }, () => {
      setTimeout(() => this.cd(), 1000)
    })
  }

  render() {
    return (
      <div>
        <Tabs
          tabs={tabs}
          initialPage={1}
          onChange={(tab, index) => {
            console.log('onChange', index, tab)
          }}
          onTabClick={(tab, index) => {
            console.log('onTabClick', index, tab)
          }}
        >
          <div style={style}>
            Content of first tab
          </div>
          <div style={style}>
            Content of second tab
          </div>
          <div style={style}>
            Content of third tab
          </div>
        </Tabs>
        <WhiteSpace />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '150px',
            backgroundColor: '#fff'
          }}
        >
          {this.state.time}
        </div>
      </div>
    )
  }
}

export default Home
