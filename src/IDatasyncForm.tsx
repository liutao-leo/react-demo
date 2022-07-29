import React, { useState } from 'react'

import './form.css'
import {
  Form,
  DatePicker,
  Select,
  InputNumber,
  Button,
  Radio,
  RadioChangeEvent,
  Space,
} from 'antd'
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
  // 数据源
  const [sourceDatasource, setSourceDatasource] = useState<string>()
  const [sourceTableName, setSourceTableName] = useState<string>()
  const [sourceTableList, setSourceTableList] = useState([])

  // 同步对象
  const [destDatasource, setDestDatasource] = useState<string>()
  const [destTableName, setDestTableName] = useState<string>()
  const [destTableList, setDesstTableList] = useState([])

  /**
   * 初始化的映射列表
   */
  const mappings: any = props.initMappings || []

  //映射关系
  const [mappingList, setMappingList] = useState(mappings)

  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    let { startTime, frequency, freqUnit } = values
    startTime = moment(startTime).toDate()
    const results = mappingList.map((mapping: any) => {
      return {
        sourceDatasource: mapping.sourceDatasource,
        sourceTableName: mapping.sourceTableName,
        destDatasource: mapping.destDatasource,
        destTableName: mapping.destTableName,
        startTime,
        frequency,
        freqUnit,
      }
    })
    console.log(results)
    props.onConfirm(results)
  }

  const onReset = () => {
    form.resetFields()
    props.onCancel(mappings)
  }

  /**
   * 数据源切换事件
   */
  const sourceDatasourceChange = (value: string) => {
    setSourceDatasource(value)
    const ds: any = props.datasourceList.find(item => (item.sourcename = value))
    props.tableListFetcher(ds).then((res: any) => {
      setSourceTableList(res)
    })
  }

  /**
   * 同步目标切换事件
   */
  const destDatasourceChange = (value: string) => {
    setDestDatasource(value)
    const ds: any = props.datasourceList.find(item => (item.sourcename = value))
    props.tableListFetcher(ds).then((res: any) => {
      setDesstTableList(res)
    })
  }

  /**
   * 数据源表切换事件
   */
  const sourceTableChange = (e: RadioChangeEvent) => {
    setSourceTableName(e.target.value)
  }

  /**
   * 同步目标表切换事件
   */
  const destTableChange = (e: RadioChangeEvent) => {
    setDestTableName(e.target.value)
  }

  /**
   * 添加映射关系
   */
  const addMapping = () => {
    mappingList.push({
      sourceDatasource,
      sourceTableName,
      destDatasource,
      destTableName,
    })
    setMappingList([...mappingList])
  }

  /**
   * 删除映射关系
   */
  const deleteMapping = (val: number) => {
    const mpList = mappingList.filter(
      (item: any, index: number) => index !== val
    )
    setMappingList([...mpList])
  }

  /**
   * 同步频次单位选择框
   */
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
      <Form
        form={form}
        name="datasyncForm"
        onFinish={onFinish}
        initialValues={{
          startTime: mappings.length
            ? moment(mappings[0].startTime).format('YYYY-MM-DD')
            : undefined,
          frequency: mappings.length ? mappings[0].frequency : undefined,
          freqUnit: mappings.length ? mappings[0].freqUnit : undefined,
        }}
        style={{ width: '800px' }}>
        <div style={{ display: 'flex' }}>
          <Form.Item style={{ width: '20%' }}>
            <Form.Item
              name="sourceDatasource"
              noStyle
              //   rules={[{ required: true, message: '请选择数据源' }]}
            >
              <Select
                placeholder="选择数据源"
                onChange={sourceDatasourceChange}>
                {props.datasourceList.map(item => {
                  return (
                    <Select.Option
                      value={item.sourcename}
                      key={item.sourcename}>
                      {item.databasename}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name="sourceTableName"
              //   rules={[{ required: true, message: '请选择源数据表' }]}
              noStyle>
              <div className="plane">
                <Radio.Group
                  value={sourceTableName}
                  onChange={sourceTableChange}>
                  <Space direction="vertical">
                    {sourceTableList?.map((item: any) => {
                      return (
                        <Radio
                          value={item.sourceTableName}
                          key={item.sourceTableName}>
                          {item.sourceTableName}
                        </Radio>
                      )
                    })}
                  </Space>
                </Radio.Group>
              </div>
            </Form.Item>
          </Form.Item>
          <div className="arrow">
            <img
              src={require('./assets/img/arrow.png')}
              alt=""
              onClick={addMapping}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
          <Form.Item style={{ width: '20%' }}>
            <Form.Item
              name="destDatasource"
              //   rules={[{ required: true, message: '请选择同步目标' }]}
              noStyle>
              <Select
                placeholder="选择同步目标"
                onChange={destDatasourceChange}>
                {props.datasourceList.map(item => {
                  return (
                    <Select.Option
                      value={item.sourcename}
                      key={item.sourcename}>
                      {item.databasename}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="destTableName"
              //   rules={[{ required: true, message: '请选择目标数据表' }]}
              noStyle>
              <div className="plane">
                <Radio.Group value={destTableName} onChange={destTableChange}>
                  <Space direction="vertical">
                    {destTableList?.map((item: any) => {
                      return (
                        <Radio
                          value={item.destTableName}
                          key={item.destTableName}>
                          {item.destTableName}
                        </Radio>
                      )
                    })}
                  </Space>
                </Radio.Group>
              </div>
            </Form.Item>
          </Form.Item>
          <div className="line"></div>
          <div className="mappings">
            <p className="mappings__title">同步映射</p>
            <div className="mappings__content">
              {mappingList.map((item: any, index: number) => {
                return (
                  <p key={index + 1}>
                    <span>{item.sourceTableName}</span>
                    <img
                      src={require('./assets/img/arrow.png')}
                      alt=""
                      style={{
                        width: '10px',
                        height: '10px',
                        margin: '0 50px',
                      }}
                    />
                    <span>{item.destTableName}</span>
                    <img
                      src={require('./assets/img/delete.png')}
                      alt=""
                      onClick={() => {
                        deleteMapping(index)
                      }}
                      style={{
                        width: '10px',
                        height: '10px',
                        marginLeft: '30px',
                        cursor: 'pointer',
                      }}
                    />
                  </p>
                )
              })}
            </div>
          </div>
        </div>
        <Form.Item
          label="开始时间"
          name="startTime"
          rules={[{ required: true, message: '请选择开始时间' }]}>
          <DatePicker placeholder="请选择日期" style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item label="同步频次" required>
          <span style={{ lineHeight: '32px' }}>每</span>
          <Form.Item
            name="frequency"
            rules={[{ required: true, message: '请输入同步频次' }]}
            noStyle>
            <InputNumber
              addonAfter={freqUnitSelector}
              style={{ width: '47%', margin: '0 1%' }}
            />
          </Form.Item>
          <span style={{ lineHeight: '32px' }}>/次</span>
        </Form.Item>
        <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: '40px' }}>
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
