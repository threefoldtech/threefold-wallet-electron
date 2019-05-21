// @flow
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { List, Segment, Grid, GridColumn, Button, Icon, Divider } from 'semantic-ui-react'
import routes from '../../constants/routes'
import styles from '../home/Home.css'
import { GetWalletAddress } from '../../client/tfchain'
import Footer from '../footer'

const mapStateToProps = state => ({
  wallet: state.wallet
})

class Wallet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      coins_locked: 0,
      coins_unlocked: 0,
      coins_total: 0
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.getBalance(), 60000)
  }

  getBalance = () => {
    if (this.props.wallet != null) {
      this.setState({ 
        coins_locked: this.props.wallet.balance.coins_locked,
        coins_unlocked: this.props.wallet.balance.coins_unlocked,
        coins_total: this.props.wallet.balance.coins_total, 
      })
    }
  }

  handleWalletAddress = () => {
    const { wallet } = this.props
    // console.log(GetWalletAddress(wallet))
  }

  render () {
    const { wallet } = this.props
    console.log(this.props)
    const { coins_locked, coins_unlocked, coins_total } = this.state

    return (
      <div>
        <div className={styles.backButton} data-tid='backButton'>
          <Link to={routes.WALLET_SETTINGS}>
            <Icon style={{ fontSize: 35, position: 'absolute', right: 20, cursor: 'pointer' }} name='setting' />
          </Link>
          <Link to={routes.HOME}>
            <Icon style={{ fontSize: 35, position: 'absolute', right: 70, cursor: 'pointer' }} name='sign-out' />
          </Link>
        </div>
        <div className={styles.container} >
          <h2>{wallet.wallet_name}</h2>
        </div>
        <Divider style={{ background: '#1A253F' }}/>
        <div>
        <Link to={routes.ACCOUNT}>
        <Icon style={{ fontSize: 25, marginLeft: 15, marginTop: 15, cursor: 'pointer' }} name="chevron circle left"/>
        </Link>
          <Grid centered columns={2} style={{ marginBottom: 30 }}>
            <GridColumn>
              <Segment style={{ marginTop: 60, marginLeft: '10%' }}>
                <h3 style={{ color: 'black' }}>Total Balance: {coins_total} TFT</h3>
                <h4 style={{ color: 'black' }}><Icon name='lock'/>Locked Balance: {coins_locked} TFT</h4>
                <h4 style={{ color: 'black' }}><Icon name='unlock'/>Unlocked Balance: {coins_unlocked} TFT</h4>
              </Segment>
            </GridColumn>
            <GridColumn>
              <div style={{ marginTop: 60, position: 'absolute', right: 60 }}>
                <Button onClick={() => this.props.history.push(routes.WALLET_RECEIVE)} style={{ float: 'left', background: '#2B3C72', color: 'white', marginRight: 15  }} size='big'>Receive</Button>
                <Button onClick={() => this.props.history.push(routes.TRANSFER)} style={{  marginRight: 10, float: 'left', background: '#015DE1', color: 'white'  }} size='big'>Transfer</Button>
              </div>
            </GridColumn>
          </Grid>
          <Segment style={{ width: '90%', height: '300px', overflow: 'auto', overflowY: 'scroll', margin: 'auto'  }}>
            <h3 style={{ color: 'black' }}>Transactions</h3>
            <List style={{ marginLeft: 50, overflow: 'auto' }} divided relaxed>
                <List.Item>
                <List.Content>
                    <List.Header as='a'>TXID: 226a299113934c53048a4c5008016199b40e359b82c898c19e115188a45545ac</List.Header>
                    <List.Description as='a'>To: 0195de96da59de0bd59c416e96d17df1a5bbc80acb6b02a1db0cde0bcdffca55a4f7f369e955ef</List.Description>
                    <List.Description as='a'>Amount: 500 TFT</List.Description>
                </List.Content>
                </List.Item>
                <List.Item>
                <List.Content>
                    <List.Header as='a'>TXID: 226a299113934c53048a4c5008016199b40e359b82c898c19e115188a45545ac</List.Header>
                    <List.Description as='a'>To: 0195de96da59de0bd59c416e96d17df1a5bbc80acb6b02a1db0cde0bcdffca55a4f7f369e955ef</List.Description>
                    <List.Description as='a'>Amount: 500 TFT</List.Description>
                </List.Content>
                </List.Item>
                <List.Item>
                <List.Content>
                    <List.Header as='a'>TXID: 226a299113934c53048a4c5008016199b40e359b82c898c19e115188a45545ac</List.Header>
                    <List.Description as='a'>To: 0195de96da59de0bd59c416e96d17df1a5bbc80acb6b02a1db0cde0bcdffca55a4f7f369e955ef</List.Description>
                    <List.Description as='a'>Amount: 500 TFT</List.Description>
                </List.Content>
                </List.Item>
                <List.Item>
                <List.Content>
                    <List.Header as='a'>TXID: 226a299113934c53048a4c5008016199b40e359b82c898c19e115188a45545ac</List.Header>
                    <List.Description as='a'>To: 0195de96da59de0bd59c416e96d17df1a5bbc80acb6b02a1db0cde0bcdffca55a4f7f369e955ef</List.Description>
                    <List.Description as='a'>Amount: 500 TFT</List.Description>
                </List.Content>
                </List.Item>
            </List>
            </Segment>
        </div>
        <Footer />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  null
)(Wallet)
