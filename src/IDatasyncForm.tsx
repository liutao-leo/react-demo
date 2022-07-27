import React, { useState } from 'react'

import './form.css'
import { Form, DatePicker, Select, InputNumber, Transfer, Button } from 'antd'
import moment from 'moment'

type DbEnc = 'utf8'
type DbType = 'mysql' | 'hive'
type FreqUnit = 'day' | 'week' | 'month'

export interface IDatasource {
  /**
   * 数据库 IP 或 域名
   */
  host: string

  /**
   * 数据库用户名
   */
  user: string

  /**
   * 数据库端口号
   */
  port: number

  /**
   * 数据库密码 (空)
   */
  password: string

  /**
   * 编码
   */
  charset: DbEnc

  /**
   * 当前登录用户
   */
  manager: string

  /**
   * 数据库类型
   */
  source: DbType

  /**
   * 数据库显示名称
   */
  databasename: string

  /**
   * ID
   */
  sourcename: string
}

interface ISyncMapping {
  /**
   * 源数据源
   */
  sourceDatasource: IDatasource

  /**
   * 源数据表
   */
  sourceTableName: string

  /**
   * 目标数据源
   */
  destDatasource: IDatasource

  /**
   * 目标数据表
   */
  destTableName: string

  /**
   * 同步开始时间
   */
  startTime: Date

  /**
   * 同步频次
   */
  frequency: number

  /**
   * 同步频次单位
   */
  freqUnit: FreqUnit
}

interface IProps {
  /**
   * 数据源列表
   */
  datasourceList: IDatasource[]

  /**
   * 获取表的函数, 返回数据库里表的数组
   */
  tableListFetcher: (ds: IDatasource) => Promise<string[]>

  /**
   * 初始映射数据
   */
  initMappings?: ISyncMapping[]

  /**
   * 确认提交事件
   */
  onConfirm: (data: ISyncMapping[]) => void

  /**
   * 取消提交事件
   */
  onCancel: (data: ISyncMapping[]) => void
}

const DatasyncForm: React.FunctionComponent<IProps> = props => {
  const [form] = Form.useForm()
  const targetKeys = props.datasourceList.map(item => item.sourcename)
  const selectedKeys = targetKeys
  const onFinish = (values: any) => {
    let { creatTime } = values
    creatTime = moment(creatTime).unix()
    console.log('Success:', values, creatTime)
  }

  const onReset = () => {
    form.resetFields()
  }

  const freqUnitSelector = (
    <Form.Item
      name="freqUnit"
      rules={[{ required: true, message: '请输入同步频次单位' }]}
      noStyle>
      <Select style={{ width: 100 }}>
        <Select.Option value="day">天</Select.Option>
        <Select.Option value="week">周</Select.Option>
        <Select.Option value="month">月</Select.Option>
      </Select>
    </Form.Item>
  )
  return (
    <div>
      <Form form={form} name="datasyncForm" onFinish={onFinish}>
        <Form.Item>
          <Transfer
            dataSource={props.datasourceList}
            titles={['数据源', '同步目标']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            showSelectAll={false}
            operationStyle={{ pointerEvents: 'none' }}
            render={item => item.databasename}
          />
        </Form.Item>
        <Form.Item
          //   label="开始时间："
          name="startTime"
          rules={[{ required: true, message: '请选择开始时间' }]}>
          <DatePicker placeholder="请选择日期" style={{ width: '85%' }} />
        </Form.Item>
        <Form.Item>
          <span style={{ lineHeight: '32px' }}>每</span>
          <Form.Item
            name="frequency"
            rules={[{ required: true, message: '请输入同步频次' }]}
            noStyle>
            <InputNumber
              addonAfter={freqUnitSelector}
              style={{ width: '85%' }}
            />
          </Form.Item>
          <span style={{ lineHeight: '32px' }}>/次</span>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Button htmlType="button" onClick={onReset}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default DatasyncForm
