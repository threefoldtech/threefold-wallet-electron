// @flow
import { connect, Provider } from 'react-redux'
import React, { Component } from 'react'
import { ConnectedRouter } from 'connected-react-router'
import Routes from '../Routes'
import { Tfchainclient } from '../client/tfchainclient'
import { setClient, loadAccounts, setBalance } from '../actions'

const os = require('os')
const storage = require('electron-json-storage')
const path = require('path')

storage.setDataPath(os.tmpdir())

const mapStateToProps = state => ({
  account: state.account
})

const mapDispatchToProps = (dispatch) => ({
  setClient: (client) => {
    dispatch(setClient(client))
  },
  loadAccounts: (accounts) => {
    dispatch(loadAccounts(accounts))
  },
  setBalance: (account) => {
    dispatch(setBalance(account))
  }
})

class Root extends Component {
  componentWillMount () {
    // Configure storage
    const dataPath = storage.getDefaultDataPath()
    const newPath = path.join(dataPath, '/tfchain/accounts')
    storage.setDataPath(newPath)

    // Load in accounts and put them in store
    const loadAccountsFromStorage = this.props.loadAccounts
    storage.getAll(function (err, data) {
      if (err) throw err
      loadAccountsFromStorage(Object.values(data))
    })

    // Create tfchainclient and put in store for later usage
    const tfchainClient = new Tfchainclient()
    this.props.setClient(tfchainClient)

    // Refresh account balance every 1 minutes
    this.intervalID = setInterval(() => {
      this.props.setBalance(this.props.account)
    }, 60000)
  }

  componentWillUnmount () {
    clearInterval(this.intervalID)
  }

  render () {
    const { store, history } = this.props
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root)
