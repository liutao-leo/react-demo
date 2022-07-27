import React from 'react'
import './App.css'
import IDatasyncForm from './IDatasyncForm'

function App() {
  const datasourceList: any = [
    {
      host: '1',
      databasename: '1',
      sourcename: '1',
    },
    {
      host: '2',
      databasename: '2',
      sourcename: '2',
    },
    {
      host: '2',
      databasename: '3',
      sourcename: '3',
    },
  ]
  const tableListFetcher: any = {}
  const initMappings: any = []
  const onConfirm = () => {}
  const onCancel = () => {}
  return (
    <div className="App">
      <header className="App-header">
        <IDatasyncForm
          datasourceList={datasourceList}
          tableListFetcher={tableListFetcher}
          initMappings={initMappings}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </header>
    </div>
  )
}

export default App
