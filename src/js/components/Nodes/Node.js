import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {checkAuthentication} from '../../utils/'
import {fetchFasitData, rescueNode} from '../../actionCreators/node_fasit'
import classString from 'react-classset'
import NodeSeraView from './NodeSeraView'
import NodeEventsView from './NodeEventsView'
import NodeGraph from './NodeGraph'
import NodeLifecycle from './NodeLifecycle'
import NodeSecurityView from './NodeSecurityView'
import NodeRevisionsView from './NodeRevisionsView'
import NodeFasitViewPreviewMode from './NodeFasitViewPreviewMode'
import NodeFasitViewEditMode from './NodeFasitViewEditMode'
import NodeFasitViewNewNodeForm from './NodeFasitViewNewNodeForm'
import NodeFasitViewDeleteNodeForm from './NodeFasitViewDeleteNodeForm'
import NodeFasitViewSubmitDeleteStatus from './NodeFasitViewSubmitDeleteStatus'
import NodeFasitViewSubmitNewNodeStatus from './NodeFasitViewSubmitNewNodeStatus'

class Node extends Component {
    constructor(props) {
        super(props)

        this.state = {
            displayRevisions: false,
            displaySecurity: false,
            displayEvents: false,
            displayPhysical: false,
            displayGraphs: false
        }
    }

    componentDidMount() {
        const {dispatch, hostname} = this.props
        dispatch(fetchFasitData(hostname))
    }

    showFasitData(authenticated) {
        const {fasit, editMode}= this.props
        if (fasit.isFetching || !fasit.data)
            return <i className="fa fa-spinner fa-pulse fa-2x"></i>

        else if (fasit.requestFailed)
            return (
                <div>Retrieving Fasit-data failed:
                    <br />
                    <br />
                    <pre><i>{fasit.requestFailed}</i></pre>
                </div>
            )

        else if (editMode) {
            return <NodeFasitViewEditMode />
        } else {
            return <NodeFasitViewPreviewMode authenticated={authenticated}/>
        }
    }

    toggleComponentDisplay(component) {
        this.setState({[component]: !this.state[component]})
    }

    arrowDirection(component) {
        return classString({
            "fa": true,
            "fa-angle-right": !this.state[component],
            "fa-angle-down": this.state[component]
        })
    }

    render() {
        const {hostname, config, user, fasit, dispatch} = this.props
        let authenticated = false
        let lifecycle = {}
        if (Object.keys(fasit.data).length > 0) {
            authenticated = checkAuthentication(user, fasit.data.accesscontrol)
            lifecycle = fasit.data.lifecycle
        }
        return (
            <div>
                <div className="col-md-12 row">
                    {/*  <NodeSeraView hostname={hostname}/>*/}
                </div>
                <div>
                    <div className="col-md-6">
                        {this.showFasitData(authenticated)}
                        <br />
                        <br />
                        <br />
                        <div className="row">
                            <NodeLifecycle lifecycle={lifecycle}
                                           rescueAction={()=>dispatch(rescueNode(hostname))}/>
                        </div>
                    </div>
                    <div className="col-md-5 col-md-offset-1">
                        <div className="list-group node-list-group">
                            <a className="list-group-item node-list-item"
                               onClick={() => this.toggleComponentDisplay("displayRevisions")}>
                                <i className={this.arrowDirection("displayRevisions")}/>&nbsp;&nbsp;&nbsp;&nbsp;Revisions
                            </a>
                            {this.state.displayRevisions ? <NodeRevisionsView hostname={hostname}/> : <div />}
                            <a className="list-group-item node-list-item"
                               onClick={() => this.toggleComponentDisplay("displaySecurity")}><i
                                className={this.arrowDirection("displaySecurity")}/>&nbsp;&nbsp;&nbsp;&nbsp;Security</a>
                            {this.state.displaySecurity ? <NodeSecurityView authenticated={authenticated}/> : <div />}
                            <a className="list-group-item node-list-item"
                               onClick={() => this.toggleComponentDisplay("displayEvents")}><i
                                className={this.arrowDirection("displayEvents")}/>&nbsp;&nbsp;&nbsp;&nbsp;Events</a>
                            {this.state.displayEvents ? <NodeEventsView /> : <div />}
                            <a className="list-group-item node-list-item"
                               onClick={() => this.toggleComponentDisplay("displayPhysical")}><i
                                className={this.arrowDirection("displayPhysical")}/>&nbsp;&nbsp;&nbsp;&nbsp;Physical</a>
                            <a className="list-group-item node-list-item"
                               onClick={() => this.toggleComponentDisplay("displayGraphs")}><i
                                className={this.arrowDirection("displayGraphs")}/>&nbsp;&nbsp;&nbsp;&nbsp;Graphs</a>
                            {this.state.displayGraphs ? <NodeGraph url={config.grafana} hostname={hostname}/> : <div />}
                        </div>
                        {/*                        <div className="row">
                         <NodeRevisionsView hostname={hostname}/>
                         </div>
                         {(Object.keys(lifecycle).length > 0) ? <div className="row"><NodeLifecycle lifecycle={lifecycle}
                         rescueAction={()=>dispatch(rescueNode(hostname))}/>
                         </div> : <div></div> }
                         <div className="row">
                         </div>
                         <div className="row">
                         <iframe src={grafanaSrc}
                         width="100%"
                         height="200"
                         frameBorder="1">
                         </iframe>
                         </div>
                         <NodeFasitViewNewNodeForm />
                         <NodeFasitViewDeleteNodeForm hostname={hostname}/>
                         <NodeFasitViewSubmitNewNodeStatus />
                         <NodeFasitViewSubmitDeleteStatus />*/}
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        fasit: state.node_fasit,
        user: state.user,
        editMode: state.nodes.showEditNodeForm,
        hostname: ownProps.hostname,
        config: state.configuration
    }
}

export default connect(mapStateToProps)(Node)
