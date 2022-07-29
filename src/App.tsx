import React from 'react'
import './App.css'
import IDatasyncForm from './IDatasyncForm'

function App() {
  const datasourceList: any = [
    {
      host: '1h',
      databasename: '1d',
      sourcename: '1s',
    },
    {
      host: '2h',
      databasename: '2d',
      sourcename: '2s',
    },
    {
      host: '3h',
      databasename: '3d',
      sourcename: '3s',
    },
  ]
  const tableListFetcher: any = {}
  // const initMappings: any = [
  //   { sourceTableName: 1, destTableName: 2, frequency: 1, freqUnit: 'day' },
  // ]
  const onConfirm = () => {}
  const onCancel = () => {}
  return (
    <div className="App">
      <header className="App-header">
        <IDatasyncForm
          datasourceList={datasourceList}
          tableListFetcher={tableListFetcher}
          // initMappings={initMappings}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </header>
    </div>
  )
}

export default App
