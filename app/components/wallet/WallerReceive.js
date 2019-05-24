// @flow
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Icon, Input, Divider, Dropdown, Segment, Label } from 'semantic-ui-react'
import styles from '../home/Home.css'
import Footer from '../footer'
import QRCode from 'qrcode.react'
import { flatten, find } from 'lodash'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const mapStateToProps = state => ({
  wallet: state.wallet,
  account: state.account
})

class WalletSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: this.props.wallet._wallet_name,
      selectedWallet: this.props.account.wallets[0],
      selectedAddress: this.props.account.wallets[0].addresses[0],
      amount: 0,
      isOpen: false
    }
  }

  mapWalletsToDropdownOption = () => {
    const { wallets } = this.props.account
    const options = wallets.map(w => {
      return {
        key: w._wallet_name,
        text: w._wallet_name,
        value: w
      }
    })
    return flatten(options)
  }

  mapAddressesToDropdownOption = () => {
    const { selectedWallet } = this.state
    if (selectedWallet) {
      const wallet = find(this.props.account.wallets, w => w._wallet_name === selectedWallet._wallet_name)
      return flatten(wallet.addresses.map(w => {
        return {
          key: w,
          text: w,
          value: w
        }
      }))
    }
  }

  selectWallet = (event, data) => {
    this.setState({ selectedWallet: data.value, selectedAddress: data.value.addresses[0] })
  }

  selectAddress = (event, data) => {
    this.setState({ selectedAddress: data.value })
  }

  handleAmountChange = ({ target }) => {
    this.setState({ amount: target.value })
  }

  renderQRCode = () => {
    const { selectedAddress, amount } = this.state
    const qrCodeString = `tft:${selectedAddress}?amount=${amount}`
    return (
      <Segment style={{ width: 280, marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>
        <QRCode style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: 250, height: 250 }} level='Q' renderAs='svg' value={qrCodeString} />
      </Segment>
    )
  }

  render () {
    const walletsOptions = this.mapWalletsToDropdownOption()
    const addressOption = this.mapAddressesToDropdownOption()
    const { amount, selectedAddress } = this.state
    return (
      <div>
        <div className={styles.container} >
          <h2>Receive</h2>
        </div>
        <Divider style={{ background: '#1A253F' }} />
        {/* <Link to={routes.ACCOUNT}> */}
        <Icon onClick={() => this.props.history.goBack()} style={{ fontSize: 25, marginLeft: 15, marginTop: 15, cursor: 'pointer' }} name='chevron circle left' />
        <span onClick={() => this.props.history.goBack()} style={{ width: 60, fontFamily: 'SF UI Text Light', fontSize: 12, cursor: 'pointer', position: 'relative', top: -5 }}>Go Back</span>
        {/* </Link> */}
        <div style={{ width: '50%', margin: 'auto' }}>
          <label style={{ color: 'white' }}>Wallet</label>
          <Dropdown
            style={{ width: 690, marginRight: 'auto', marginBottom: 20, marginTop: 10 }}
            placeholder='Select Wallet'
            fluid
            selection
            options={walletsOptions}
            onChange={this.selectWallet}
            value={walletsOptions[0].value}
          />
          <label style={{ color: 'white' }}>Address</label>
          <Dropdown
            style={{ width: 690, marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, marginTop: 10 }}
            placeholder='Select Address'
            fluid
            selection
            options={addressOption}
            onChange={this.selectAddress}
            value={addressOption[0].value}
          />
          {this.renderQRCode()}
          <CopyToClipboard text={selectedAddress}
            onCopy={() => this.setState({ copied: true })}>
            <Label onClick={() => toast('Copied to clipboard')} style={{ display: 'block', margin: 'auto', width: 200, cursor: 'pointer' }}><Icon name='clipboard' /> copy address to clipboard</Label>
          </CopyToClipboard>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Input style={{ width: 300, marginLeft: 'auto', marginRight: 'auto' }} type='number' label='amount' onChange={this.handleAmountChange} value={amount} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  null
)(WalletSettings)
