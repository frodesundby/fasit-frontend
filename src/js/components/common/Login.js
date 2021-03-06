import React, {Component, PropTypes} from 'react'
import classString from 'react-classset'
import {Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import {displayLogin, logIn} from '../../actionCreators/authentication'


class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {username: "", password: ""}
    }

    handleChange(field, value) {
        this.setState({[field]: value})
    }

    signInButtonClasses() {
        const {user} = this.props
        return classString({
            'btn': true,
            'btn-info': true,
            'singInButton': user.failedLogin
        })
    }

    render() {
        const {user, dispatch} = this.props
        return (
            <Modal show={user.showLogin} onHide={() => dispatch(displayLogin(false))}>
                <Modal.Header>
                    <Modal.Title>Log in

                        <button
                            className="btn btn-xs btn-default pull-right"
                            onClick={() => dispatch(displayLogin(false))}
                        ><i className="fa fa-times"/>
                        </button>

                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className="login-form">
                        <form className="form-horizontal" id="loginForm"
                              onSubmit={(e) => {
                                  e.preventDefault()
                                  dispatch(logIn({
                                      password: this.state.password,
                                      username: this.state.username
                                  }))
                              }}>
                            <div className="form-group">
                                <label form="name" className="control-label">Adeo-ident</label>
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-user"></i></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="x123456"
                                        onChange={(e) => this.handleChange("username", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label form="password" className="control-label">Password</label>
                                <div className="input-group">
                                            <span className="input-group-addon"><i
                                                className="fa fa-lock fa-lg"></i></span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        onChange={(e) => this.handleChange("password", e.target.value)}
                                    />
                                </div>

                            </div>
                            <div className="form-group">
                                <br />
                                <button
                                    type="submit"
                                    className={this.signInButtonClasses()}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        dispatch(logIn({
                                            password: this.state.password,
                                            username: this.state.username
                                        }))
                                    }}
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                {user.failedLogin ?
                    <Modal.Footer>
                        <h5 className="text-danger text-center">Incorrect username or password</h5>
                    </Modal.Footer> :
                    <div />}
            </Modal>

        )
    }
}
Login.propTypes = {
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(Login)
