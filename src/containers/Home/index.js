import React from 'react'
import { Tabs, WhiteSpace } from 'antd-mobile'

const tabs = [
  { title: '天' },
  { title: '小时' },
  { title: '分' },
  { title: '秒' },
]
const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '150px',
  backgroundColor: '#fff',
}
const startTime = new Date(2018, 4, 27, 13, 0, 0).getTime()

class Home extends React.Component {
  state = {
    total: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
  }

  componentDidMount() {
    this.cd()
  }

  cd() {
    let timestamp = Date.now()
  
    this.setState({ 
      total: this.total(timestamp),
      days: this.days(timestamp),
      hours: this.hours(timestamp),
      minutes: this.minutes(timestamp),
      seconds: this.seconds(timestamp),
    }, () => {
      setTimeout(() => this.cd(), 1000)
    })
  }

  floor = num => {
    return Math.floor(num) + ''
  }

  format = num => {
    let str = this.floor(num)
    if (str.length == 1) {
      str = '0' + str
    }
    return str
  }

  total = timestamp => {
    let interval = (timestamp - startTime) / 1000,
      days = interval / (24 * 60 * 60),
      hours = (interval % (24 * 60 * 60)) / (60 * 60),
      minutes = ((interval % (24 * 60 * 60)) % (60 * 60)) / 60,
      seconds = ((interval % (24 * 60 * 60)) % (60 * 60)) % 60
    return `${this.floor(days)}天${this.format(hours)}小时${this.format(minutes)}分钟${this.format(seconds)}秒`
  }

  days = timestamp => {
    let hours = this.hours(timestamp)
    let days = this.floor(hours / 24)
    return days
  }

  hours = timestamp => {
    let minutes = this.minutes(timestamp)
    let hours = this.floor(minutes / 60)
    return hours
  }

  minutes = timestamp => {
    let seconds = this.seconds(timestamp)
    let minutes = this.floor(seconds / 60)
    return minutes
  }

  seconds = timestamp => {
    let seconds = this.floor((timestamp - startTime) / 1000)
    return seconds
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
          <div key="days" style={style}>
            {`${this.state.days}天`}
          </div>
          <div key="hours" style={style}>
            {`${this.state.hours}小时`}
          </div>
          <div key="minutes" style={style}>
            {`${this.state.minutes}分钟`}
          </div>
          <div key="seconds" style={style}>
            {`${this.state.seconds}秒`}
          </div>
        </Tabs>
        <WhiteSpace />
        <div style={style}>
          {this.state.total}
        </div>
      </div>
    )
  }
}

export default Home
