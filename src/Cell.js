import React, { Component } from 'react'
import "./Cell.css"

export default class Cell extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

handleClick(evt){
    if(this.props.player===0)
    this.props.dropPiece();
}

    render() {

       let classes = "Table-cell"; 
       if(this.props.player === 0 ){
           classes += " White"; 
        } else if (this.props.player === 1){
            classes += " Red Disabled";
 
        }
         else if (this.props.player === 2){
            classes += " Yellow Disabled";
 
        }
        if(this.props.disabled) {
           classes += " Disabled";
        }
        if(this.props.isWinner){
            classes +=' isWinner';
        }
        return (
            <td className={classes} onClick={this.handleClick}  >
              
            </td>
        )
    }
}
