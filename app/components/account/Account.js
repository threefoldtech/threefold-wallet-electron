// @flow
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Segment, Button, Icon, Divider, Card } from 'semantic-ui-react'
import routes from '../../constants/routes'
import { selectWallet, setChainConstants } from '../../actions'
import styles from '../home/Home.css'
import Footer from '../footer'

const mapStateToProps = state => ({
  account: state.account
})

const mapDispatchToProps = (dispatch) => ({
  selectWallet: (wallet) => {
    dispatch(selectWallet(wallet))
  },
  setChainConstants: (constants) => {
    dispatch(setChainConstants(constants))
  }
})

class Account extends Component {
  constructor (props) {
    super(props)
    this.state = {
      totalCoins: 0,
      totalCoinLocked: 0,
      totalCoinUnlocked: 0
    }
  }

  componentDidMount () {
    this.getAccountBalance()
    this.interval = setInterval(() => { this.getAccountBalance() }, 60000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  getAccountBalance = () => {
    this.props.account.balance.then(info => {
      const totalSum = info.coins_total.str()
      const totalUnlockedSum = info.coins_unlocked.str()
      const totalLockedSum = info.coins_locked.str()
      this.setState({ totalCoins: totalSum, totalCoinLocked: totalLockedSum, totalCoinUnlocked: totalUnlockedSum })
    })
  }

  handleWalletClick = (wallet) => {
    this.props.selectWallet(wallet)
    this.props.history.push(routes.WALLET)
  }

  renderWallets = () => {
    const { wallets } = this.props.account
    if (!wallets) {
      return
    }

    if (wallets.length < 1) {
      return (
        <p>no wallets</p>
      )
    }

    return (
      <Card.Group style={{ marginTop: 20, marginLeft: 20 }}>
        {wallets.map(w => {
          const balance = w._get_balance_sync()
          return (
            <Card key={w._wallet_name} style={{ boxShadow: 'none', height: 180, width: 350, marginTop: 0, marginRight: 20, marginBottom: 30, background: 'linear-gradient(90deg, rgba(56,51,186,1) 0%, rgba(102,71,254,1) 100%)' }} onClick={() => this.handleWalletClick(w)}>
              <Card.Content>
                <Icon name='chevron right' style={{ position: 'absolute', right: 20, top: 130, fontSize: 25, opacity: '0.3', color: 'white' }} />
                {/* <Divider /> */}
                <Card.Description style={{ color: 'white', marginTop: 10, marginBottom: 10, fontFamily: 'SF UI Text Light', display: 'flex' }}>
                  <Icon name='unlock' style={{ fontSize: 16, marginLeft: 20 }} /> <p style={{ marginLeft: 30, marginTop: -8 }}>{balance.coins_unlocked.str()} TFT</p>
                </Card.Description>
                <Card.Description style={{ textAlign: 'left', color: 'white', marginTop: 20, marginBottom: 10, fontFamily: 'SF UI Text Light', display: 'flex' }}>
                  <Icon name='lock' style={{ fontSize: 16, marginLeft: 20 }} /> <p style={{ marginLeft: 33, marginTop: -3, fontFamily: 'SF UI Text Light', fontSize: 18 }}>{balance.coins_locked.str()} TFT</p>
                </Card.Description>
                <Divider />
                <Card.Header style={{ textAlign: 'center', color: 'white', fontSize: 18, textTransform: 'uppercase', marginTop: 20, fontFamily: 'SF UI Text Light' }}>
                  wallet {w._wallet_name}
                </Card.Header>
              </Card.Content>
            </Card>
          )
        })}
        <Card style={{ boxShadow: 'none', height: 180, width: 350, marginBottom: 60, marginTop: 0, background: '#29272E' }} onClick={() => this.props.history.push(routes.WALLET_NEW)}>
          <Card.Content style={{ textAlign: 'center' }}>
            <Card.Header style={{ color: 'white', fontSize: 20, textTransform: 'uppercase', position: 'absolute', top: 50, left: 90 }}>
              Create wallet
            </Card.Header>
            <Icon name='plus circle' style={{ position: 'absolute', left: 145, top: 100, fontSize: 40, opacity: '0.3' }} />
          </Card.Content>
        </Card>
      </Card.Group>
    )
  }

  render () {
    return (
      <div>
        <div data-tid='backButton'>
          <Link to={routes.ACCOUNT_SETTINGS}>
            <Icon style={{ fontSize: 25, position: 'absolute', right: 20, cursor: 'pointer' }} name='setting' />
          </Link>
          <Link to={routes.HOME}>
            <Icon style={{ fontSize: 25, position: 'absolute', right: 70, cursor: 'pointer' }} name='sign-out' />
          </Link>
        </div>
        <div className={styles.container} >
          {/* <h2 >{this.props.account.account_name}</h2> */}
          <h2>Account</h2>
        </div>
        <Divider style={{ background: '#1A253F' }} />
        <div style={{ display: 'flex' }}>
          <div style={{ width: '65%', overflowY: 'auto', height: '80vh', paddingBottom: 100 }}>
            {this.renderWallets()}
          </div>
          <div style={{ width: '35%', height: '100vh', marginTop: 20 }}>
            <Segment style={{ background: '#29272E', width: '90%', margin: 'auto' }}>
              <h3 style={{ color: 'white' }}>Total Balance</h3>
              <h4 style={{ color: 'white', marginTop: 0 }}>{this.state.totalCoins} TFT</h4>
              <h4 style={{ color: 'white' }}><Icon name='lock' />Locked Balance</h4>
              <h4 style={{ color: 'white', marginTop: 0 }}>{this.state.totalCoinLocked}  TFT</h4>
              <h4 style={{ color: 'white' }}><Icon name='unlock' />Unlocked Balance</h4>
              <h4 style={{ color: 'white', marginTop: 0 }}>{this.state.totalCoinUnlocked}  TFT</h4>
            </Segment>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 150, right: 50 }}>
          <Button className={styles.acceptButton} onClick={() => this.props.history.push(routes.WALLET_RECEIVE)} style={{ marginTop: 20, float: 'left', marginRight: 15, color: 'white' }} size='big'>Receive</Button>
          <Button className={styles.cancelButton} onClick={() => this.props.history.push(routes.TRANSFER)} style={{ marginTop: 20, marginRight: 10, float: 'left', background: 'none', color: 'white' }} size='big'>Transfer</Button>
        </div>
        <Footer />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account)
