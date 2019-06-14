// @flow
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Form, Button, Icon, Header } from 'semantic-ui-react'
import styles from '../home/Home.css'
import { saveAccount, updateAccount } from '../../actions'
import DeleteModal from '../wallet/DeleteWalletModal'
import Footer from '../footer'
import { toast } from 'react-toastify'

const mapStateToProps = state => ({
  account: state.account.state
})

const mapDispatchToProps = (dispatch) => ({
  saveAccount: (account) => {
    dispatch(saveAccount(account))
  },
  updateAccount: (account) => {
    dispatch(updateAccount(account))
  }
})

class WalletSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: this.props.account.selected_wallet.wallet_name,
      openDeleteModal: false,
      deleteName: '',
      deleteNameError: false
    }
  }

  handleNameChange = ({ target }) => {
    this.setState({ name: target.value })
  }

  saveWallet = () => {
    const { name } = this.state
    const { account } = this.props
    const { selected_wallet: selectedWallet } = account

    try {
      this.props.account.multisig_wallet_update(name, selectedWallet.owners, selectedWallet.signatures_required)
    } catch (err) {
      if (err) {
        console.log(err)
        return toast.error('Updating wallet failed')
      }
    }

    this.props.saveAccount(this.props.account)
    this.props.updateAccount(this.props.account)
    toast('Multisig Wallet saved')
    return this.props.history.push('/walletmultisig')
  }

  openDeleteModal = () => {
    const open = !this.state.openDeleteModal
    this.setState({ openDeleteModal: open })
  }

  closeDeleteModal = () => {
    this.setState({ openDeleteModal: false })
  }

  handleDeleteWalletNameChange = ({ target }) => {
    this.setState({ deleteName: target.value })
  }

  deleteWallet = () => {
    const { deleteName, name } = this.state
    const { account } = this.props
    if (deleteName !== name) {
      return this.setState({ deleteNameError: true })
    }

    try {
      this.props.account.multisig_wallet_delete(account.selected_wallet.address, deleteName)
    } catch (err) {
      if (err) {
        toast.error('Deleting wallet failed')
      }
    }
    this.props.saveAccount(this.props.account)
    this.props.updateAccount(this.props.account)
    this.setState({ deleteNameError: false })
    toast('Multisig Wallet deleted')
    return this.props.history.push('/account')
  }

  render () {
    const { openDeleteModal, deleteName, deleteNameError, name } = this.state
    return (
      <div>
        <DeleteModal
          open={openDeleteModal}
          closeModal={this.closeDeleteModal}
          deleteName={deleteName}
          handleDeleteWalletNameChange={this.handleDeleteWalletNameChange}
          deleteNameError={deleteNameError}
          deleteWallet={this.deleteWallet}
        />
        <div style={{ position: 'absolute', top: 40, height: 50, width: '100%' }} data-tid='backButton'>
          <Icon onClick={() => this.props.history.goBack()} style={{ fontSize: 25, position: 'absolute', left: 15, top: 41, cursor: 'pointer' }} name='chevron circle left' />
          <span onClick={() => this.props.history.goBack()} style={{ width: 60, fontFamily: 'SF UI Text Light', fontSize: 12, cursor: 'pointer', position: 'absolute', top: 42, left: 48 }}>Go Back</span>
          <Icon onClick={this.openDeleteModal} style={{ fontSize: 25, position: 'absolute', right: 70, top: 41, cursor: 'pointer' }} name='trash' />
        </div>
        <div className={styles.container} >
          <Header as='h2' icon style={{ color: 'white', marginTop: 50 }}>
            <Icon name='settings' />
                  Wallet Settings
            <Header.Subheader style={{ color: 'white' }}>Manage your multisignature wallet settings</Header.Subheader>
          </Header>
          <Form error style={{ width: '50%', margin: 'auto', marginTop: 10 }}>
            <Form.Field>
              <label style={{ float: 'left', color: 'white' }}>Name</label>
              <input placeholder='wallet name' value={name} onChange={this.handleNameChange} />
            </Form.Field>
            <Button className={styles.cancelButton} size='big' style={{ marginTop: 10, marginRight: 10, background: 'none', color: 'white', width: 180 }} onClick={() => this.props.history.goBack()}>Cancel</Button>
            <Button className={styles.acceptButton} size='big' type='submit' onClick={this.saveWallet} style={{ marginTop: 10, margin: 'auto', color: 'white', width: 180 }}>Save</Button>
          </Form>
        </div>
        <Footer />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletSettings)
