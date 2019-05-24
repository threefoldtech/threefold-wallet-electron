// @flow
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Form, Button, Icon, Header, List, Segment, Divider } from 'semantic-ui-react'
import routes from '../../constants/routes'
import styles from '../home/Home.css'
import { saveAccount, deleteAccount, deleteWallet, selectWallet } from '../../actions'
import DeleteModal from './DeleteAccountModal'
import DeleteWalletModal from '../wallet/DeleteWalletModal'
import Footer from '../footer'
import { toast } from 'react-toastify'

const mapStateToProps = state => ({
  account: state.account
})

const mapDispatchToProps = (dispatch) => ({
  saveAccount: (account) => {
    dispatch(saveAccount(account))
  },
  deleteAccount: (account) => {
    dispatch(deleteAccount(account))
  },
  deleteWallet: (wallet) => {
    dispatch(deleteWallet(wallet))
  },
  selectWallet: (wallet) => {
    dispatch(selectWallet(wallet))
  }
})

class AccountSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: this.props.account.account_name,
      walletName: '',
      openDeleteModal: false,
      openDeleteWalletModal: false,
      deleteName: '',
      deleteNameError: false,
      deleteWalletName: '',
      deleteWalletNameError: false,
      walletToDelete: undefined
    }
  }

  handleNameChange = ({ target }) => {
    this.setState({ name: target.value })
  }

  saveAccount = () => {
    const { name } = this.state

    const previousName = this.props.account.account_name
    let newAccount = this.props.account

    newAccount._account_name = name
    newAccount._previous_name = previousName

    this.props.saveAccount(newAccount, previousName)
    toast('Account saved')
    return this.props.history.push('/account')
  }

  openDeleteModal = () => {
    const open = !this.state.openDeleteModal
    this.setState({ openDeleteModal: open })
  }

  closeDeleteModal = () => {
    this.setState({ openDeleteModal: false })
  }

  handleDeleteAccountNameChange = ({ target }) => {
    this.setState({ deleteName: target.value })
  }

  deleteAccount = () => {
    const { deleteName, name } = this.state
    if (deleteName !== name) {
      return this.setState({ deleteNameError: true })
    }
    this.props.deleteAccount(this.props.account)
    this.setState({ deleteNameError: false })
    toast('Account deleted')
    return this.props.history.push('/home')
  }

  renderWallets = () => {
    if (this.props.account.wallets.length > 0) {
      return (
        <Segment style={{ width: 630, overflowY: 'scroll', margin: 'auto', background: '#29272E' }}>
          <h3 style={{ float: 'left' }}>Wallets</h3>
          <List divided verticalAlign='middle' style={{ marginTop: 40 }}>
            {this.props.account.wallets.map(w => {
              return (
                <List.Item>
                  <Divider />
                  <List.Content floated='right'>
                    <Icon name='settings'style={{ color: 'white', marginRight: 30, cursor: 'pointer' }} onClick={() => this.goToWalletSettings(w)} />
                    <Icon name='trash' style={{ color: 'white', marginRight: 30, cursor: 'pointer' }} onClick={() => this.openDeleteWalletModal(w)} />
                  </List.Content>
                  <List.Content style={{ float: 'left' }}>{w._wallet_name}</List.Content>
                </List.Item>
              )
            })}
          </List>
        </Segment>
      )
    }
  }

  deleteWallet = () => {
    const { deleteWalletName, walletName, walletToDelete } = this.state
    if (deleteWalletName !== walletName) {
      return this.setState({ deleteWalletNameError: true })
    }
    this.props.deleteWallet(walletToDelete)
    this.props.saveAccount(this.props.account)
    this.setState({ deleteWalletNameError: false })
    toast('Wallet deleted')
    this.closeDeleteWalletModal()
  }

  openDeleteWalletModal = (w) => {
    const open = !this.state.openDeleteWalletModal
    this.setState({ openDeleteWalletModal: open, walletName: w._wallet_name, walletToDelete: w })
  }

  closeDeleteWalletModal = () => {
    this.setState({ openDeleteWalletModal: false })
  }

  handleDeleteWalletNameChange = ({ target }) => {
    this.setState({ deleteWalletName: target.value })
  }

  goToWalletSettings = (w) => {
    this.props.selectWallet(w)
    return this.props.history.push(routes.WALLET_SETTINGS)
  }

  render () {
    const { name, openDeleteModal, deleteName, deleteNameError, openDeleteWalletModal, deleteWalletName, deleteWalletNameError } = this.state
    return (
      <div>
        <DeleteModal
          open={openDeleteModal}
          closeModal={this.closeDeleteModal}
          deleteName={deleteName}
          handleDeleteAccountNameChange={this.handleDeleteAccountNameChange}
          deleteNameError={deleteNameError}
          deleteAccount={this.deleteAccount}
        />
        <DeleteWalletModal
          open={openDeleteWalletModal}
          closeModal={this.closeDeleteWalletModal}
          deleteName={deleteWalletName}
          handleDeleteWalletNameChange={this.handleDeleteWalletNameChange}
          deleteNameError={deleteWalletNameError}
          deleteWallet={this.deleteWallet}
        />
        <div style={{ position: 'absolute', top: 40, height: 50, width: '100%' }} data-tid='backButton'>
          <Icon onClick={() => this.props.history.goBack()} style={{ fontSize: 25, position: 'absolute', left: 15, top: 41, cursor: 'pointer' }} name='chevron circle left' />
          <span onClick={() => this.props.history.goBack()} style={{ width: 60, fontFamily: 'SF UI Text Light', fontSize: 12, cursor: 'pointer', position: 'absolute', top: 42, left: 48 }}>Go Back</span>
          <Icon onClick={this.openDeleteModal} style={{ fontSize: 25, position: 'absolute', right: 70, top: 41, cursor: 'pointer' }} name='trash' />
        </div>
        {/* <Breadcrumb style={{ position: 'absolute', top: 100, left: 50, color: 'white' }}>
          <Breadcrumb.Section link style={{ color: 'white'}}>Account</Breadcrumb.Section>
          <Breadcrumb.Divider style={{ color: 'white'}}/>
          <Breadcrumb.Section link style={{ color: 'white'}}>Settings</Breadcrumb.Section>
        </Breadcrumb> */}
        <div className={styles.container} >
          <Header as='h2' icon style={{ color: 'white', marginTop: 50 }}>
            <Icon name='settings' />
              Account Settings
            <Header.Subheader style={{ color: 'white' }}>Manage your account settings</Header.Subheader>
          </Header>
          <Form error style={{ width: '50%', margin: 'auto', marginTop: 10, marginBottom: 50 }}>
            <Form.Field>
              <label style={{ float: 'left', color: 'white' }}>Name</label>
              <input placeholder='01X.....' value={name} onChange={this.handleNameChange} />
            </Form.Field>
            <Button className={styles.cancelButton} size='big' style={{ marginTop: 10, marginRight: 10, background: 'none', color: 'white', width: 180 }} onClick={() => this.props.history.push(routes.ACCOUNT)}>Cancel</Button>
            <Button className={styles.acceptButton} size='big' type='submit' onClick={this.saveAccount} style={{ marginTop: 10, margin: 'auto', background: '#015DE1', color: 'white', width: 180 }}>Save</Button>
          </Form>
          {this.renderWallets()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountSettings)
