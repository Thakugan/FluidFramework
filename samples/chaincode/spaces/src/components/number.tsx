/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    PrimedComponent,
    PrimedComponentFactory,
} from "@microsoft/fluid-aqueduct";
import {
    IComponentHTMLVisual,
} from "@microsoft/fluid-component-core-interfaces";
import { CounterValueType, Counter } from "@microsoft/fluid-map";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Manager } from "../container-services";

/**
 * Clicker example using view interfaces and stock component classes.
 */
export class Number extends PrimedComponent implements IComponentHTMLVisual {

    public get IComponentHTMLVisual() { return this; }

    protected async componentInitializingFirstTime(){
        this.root.createValueType("clicker-count", CounterValueType.Name, 0);
    }

    protected async componentHasInitialized() {
        // Register with our manager to say that we support clicks
        const manager = await this.getService<Manager>("manager");
        manager.registerListener("click", () => {
            const counter = this.root.get<Counter>("clicker-count");
            counter.increment(1);
        });
    }

    /**
     * Will return a new Clicker view
     */
    public render(div: HTMLElement) {
        ReactDOM.render(
            <NumberView counter= {this.root.get<Counter>("clicker-count")}/>,
            div,
        );
    }
}

/**
 * This is where you define all your Distributed Data Structures and Value Types
 */
export const NumberInstantiationFactory = new PrimedComponentFactory(
    Number,
    [],
);

interface INumberViewProps {
    counter: Counter;
}

interface INumberViewState {
    value: number;
}

class NumberView extends React.Component<INumberViewProps, INumberViewState>{
    constructor(props: INumberViewProps){
        super(props);

        this.state = {
            value: this.props.counter.value,
        };
    }

    componentDidMount() {
        this.props.counter.on("incremented", (_, currentValue: number) =>{
            this.setState({value:currentValue});
        });
    }

    render(){
        return (
            <div style={{textAlign:"center", width: "100%", height:"100%", border:"1px solid black"}}>
                <h1 style={{display:"inline-block"}}>{this.state.value}</h1>
            </div>
        );
    }
}