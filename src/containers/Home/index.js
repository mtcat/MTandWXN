import React from 'react'
import { Tabs, WhiteSpace } from 'antd-mobile'
import ProgressPanel from './ProgressPanel'

const tabs = [
  { title: '天' },
  { title: '小时' },
  { title: '分' },
  { title: '秒' },
]
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
          <ProgressPanel key="days" text={`${this.floor(this.state.days)}天`} />
          <ProgressPanel key="hours" text={`${this.floor(this.state.hours)}小时`} percent={hours / 24 * 100} />
          <ProgressPanel key="minutes" text={`${this.floor(this.state.minutes)}分钟`} percent={minutes / 60 * 100} />
          <ProgressPanel key="seconds" text={`${this.floor(this.state.seconds)}秒`} percent={seconds / 60 * 100} />
        </Tabs>
        <WhiteSpace />
        <ProgressPanel text={`${this.floor(days)}天${this.format(hours)}小时${this.format(minutes)}分钟${this.format(seconds)}秒`} />
      </div>
    )
  }
}

export default Home
