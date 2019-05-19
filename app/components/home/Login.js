// @flow
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Form, Button, Input, Icon } from 'semantic-ui-react'
import routes from '../../constants/routes'
import { selectAccount } from '../../actions'
import * as tfchain from '../../tfchain/api'

const mapStateToProps = state => ({
  account: state.account
})

const mapDispatchToProps = (dispatch) => ({
  SelectAccount: (account) => {
    dispatch(selectAccount(account))
  }
})

class Login extends Component {
  constructor (props) {
      super(props)
      this.state = {
        name: this.props.account.account_name,
        password: '',
        passwordError: false
      }
  }

  handlePasswordChange = ({ target }) => {
    this.setState({ password: target.value })
  }

  login = () => {
    const { password } = this.state
    if (password == '') {
      return this.setState({ passwordError: true })
    } 
    try {
      const account = tfchain.Account.deserialize(this.props.account.account_name,  password, this.props.account)
      this.props.SelectAccount(account)
      return this.props.history.push("/account")
    } catch (error) {
      console.log(error)
      return this.setState({ passwordError: true })
    }
  }

  onKeyDown = (e) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      this.login()
    }
  }

  render() {
    const { password, passwordError } = this.state
    return (
      <div style={{ margin: 'auto' }}>
          <div style={{ marginTop: 200, textAlign: 'center' }} >
          <h2>Sign in to account: {this.props.account.account_name}</h2>
            <Form style={{ width: '50%', margin: 'auto', marginTop: 40 }} onSubmit={this.login}>
                <Form.Field error={passwordError}>
                  <Input onKeyDown={this.onKeyDown} type='password' style={{ width: '50%' }} icon={<Icon name='key' style={{ color: '#0e72f5' }}></Icon>} iconPosition='left' placeholder='password' value={password} onChange={this.handlePasswordChange}/>
                </Form.Field>
                <div style={{ marginTop: 50 }}>
                  <Button size='big' onClick={() => this.props.history.push(routes.HOME)} style={{ background: '#2B3D72', color: 'white', marginRight: 15 }}>Cancel</Button>
                  <Button size='big' type='submit' style={{ background: '#015DE1', color: 'white' }}>Login</Button>
                </div>
            </Form>
          </div>
        </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)