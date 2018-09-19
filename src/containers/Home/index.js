import React from 'react'
import { Tabs, WhiteSpace, Progress, NoticeBar } from 'antd-mobile'

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
  fontSize: '24px',
}
const mt147 = { left: 'unset', top: '147px' }
const startTime = new Date(2018, 4, 27, 13, 0, 0).getTime()

class Home extends React.Component {
  state = {
    total: {
      days: '', 
      hours: '', 
      minutes: '', 
      seconds: '',
    },
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

  total = timestamp => {
    let interval = (timestamp - startTime) / 1000,
      days = interval / (24 * 60 * 60),
      hours = (interval % (24 * 60 * 60)) / (60 * 60),
      minutes = ((interval % (24 * 60 * 60)) % (60 * 60)) / 60,
      seconds = ((interval % (24 * 60 * 60)) % (60 * 60)) % 60
    return {
      days,
      hours,
      minutes,
      seconds,
    }
  }

  days = timestamp => {
    let hours = this.hours(timestamp)
    let days = hours / 24
    return days
  }

  hours = timestamp => {
    let minutes = this.minutes(timestamp)
    let hours = minutes / 60
    return hours
  }

  minutes = timestamp => {
    let seconds = this.seconds(timestamp)
    let minutes = seconds / 60
    return minutes
  }

  seconds = timestamp => {
    let seconds = (timestamp - startTime) / 1000
    return seconds
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

  render() {
    let { days, hours, minutes, seconds } = this.state.total

    return (
      <div>
        <NoticeBar mode="closable" icon={null}>Hello.</NoticeBar>
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
            {`${this.floor(this.state.days)}天`}
          </div>
          <div key="hours" style={style}>
            {`${this.floor(this.state.hours)}小时`}
            <Progress percent={hours / 24 * 100} position="fixed" unfilled={false} style={mt147} />
          </div>
          <div key="minutes" style={style}>
            {`${this.floor(this.state.minutes)}分钟`}
            <Progress percent={minutes / 60 * 100} position="fixed" unfilled={false} style={mt147} />
          </div>
          <div key="seconds" style={style}>
            {`${this.floor(this.state.seconds)}秒`}
            <Progress percent={seconds / 60 * 100} position="fixed" unfilled={false} style={mt147} />
          </div>
        </Tabs>
        <WhiteSpace />
        <div style={style}>
          {`${this.floor(days)}天${this.format(hours)}小时${this.format(minutes)}分钟${this.format(seconds)}秒`}
        </div>
      </div>
    )
  }
}

export default Home
