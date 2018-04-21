import React from 'react';

import createScene from '../scene.js';

class TwoJSScene extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // inject scene into contents
        this.world = createScene(this.target);
        this.world.text = this.props.text;
    }

    shouldComponentUpdate(nextProps, nextState) {
        // perhaps we should kick off callbacks into this.world for specific state chagnes
        if (nextProps.mode !== this.props.mode) {
            this.world.changeSelecMode(nextProps.mode);
        }

        return false;
    }

    render() {
        return (
            <div>
                <div className="canvas-holder">
                    <div ref={(me) => { this.target = me; }} id="draw-animation" className="dots-1" />
                </div>

                {/*<svg>*/}
                    {/*<defs>*/}
                        {/*<pattern id="dots">*/}

                        {/*</pattern>*/}
                    {/*</defs>*/}
                {/*</svg>*/}
            </div>
        );
    }
}

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'thrust'
        }
    }

    render() {
        return (
            <div>
                <h1>disassembly</h1>

                <TwoJSScene mode={this.state.mode} />

                <div>
                    <label>selection mode:</label>
                    <select value={this.state.mode} onChange={(e) => this.setState({ mode: e.target.value })}>
                        <option value="thrust">thrust</option>
                        <option value="edit">edit</option>
                    </select>
                </div>
            </div>
        );
    }
}
