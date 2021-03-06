import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import BreadCrumbs from './BreadCrumbs'


class ContexMenu extends Component {
    constructor(props) {
        super(props)
    }

    isActive(context) {
        const {location} = this.props
        const currentLocation = location.pathname.split('/')[1]
        if (currentLocation === context ) return "active"
            }

    render() {
        return (
            <div className="context-menu">
                <div className="col-lg-9 col-lg-offset-2 col-md-11 col-md-offset-1 col-sm-12">
                    <BreadCrumbs />
                    <ul className="nav nav-tabs nav-tab-positioning">
                        <li className={this.isActive("search")}>
                            <Link to="/search">
                                <i className="fa fa-search"/>&nbsp;&nbsp;Search</Link>
                        </li>
                        <li className={this.isActive("environments")}>
                            <Link to="/environments">
                                <i className="fa fa-sitemap"/>&nbsp;&nbsp;Environments</Link>
                        </li>
                        <li className={this.isActive("applications")}>
                            <Link to="/applications">
                                <i className="fa fa-home fa-cube"/>&nbsp;&nbsp;Applications</Link>
                        </li>
                        <li className={this.isActive("instances")}>
                            <Link to="/instances">
                                <i className="fa fa-home fa-cubes"/>&nbsp;&nbsp;Instances</Link>
                        </li>
                        <li className={this.isActive("nodes")}>
                            <Link to="/nodes">
                                <i className="fa fa-home fa-server"/>&nbsp;&nbsp;Nodes</Link>

                        </li>
                        <li className={this.isActive("resources")}>
                            <Link to="/resources">
                                <i className="fa fa-home fa-cogs"/>&nbsp;&nbsp;Resources</Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
ContexMenu.propTypes = {
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    location: state.routing.locationBeforeTransitions,
    nodes: state.nodes.headers,
    resources: state.resources.headers,
    nodes: state.nodes.headers,
    nodes: state.nodes.headers,
    nodes: state.nodes.headers,
})

export default connect(mapStateToProps)(ContexMenu)