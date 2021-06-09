import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { capitalize } from '../common/innovel_util';

class InfoIncorrectModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let setMessage = this.errorMessage(nextProps.clientName,nextProps.phoneNumber,nextProps.addressType);
        
          this.setState( { displayMsg: setMessage});
       
    }

    errorMessage(clientName,phoneNumber,addressType){
        let strWrongMsgPartA ="If the address on your order is not correct, please contact ";
        let strWrongMsgPartB = " . We are unable to schedule delivery until the address is corrected.";   
        let strWrongMsg='';
        let strWrongMsgPartC=' your store of purchase.';
        let addrType = addressType;
         if(!clientName||!phoneNumber){
             // If phone number and client name are null or undefined then assigning value 1 to addrType so that it can print default message.
            addrType=1;
        }
        
        switch(addrType){
            case 2:
                let clientNameCap=capitalize(clientName);
                strWrongMsg = strWrongMsgPartA + clientNameCap + ' at '+phoneNumber+strWrongMsgPartB;
                break;
            default:
                strWrongMsg=strWrongMsgPartA+strWrongMsgPartC;
        }
        return strWrongMsg;
    } 

    InfoIncorrectCancel = () => {
        this.props.InfoIncorrectCancel();
    }

    InfoIncorrectOk = () => {
        this.props.InfoIncorrectOk();
    }

    render() {
        return (
            <Modal size="lg" isOpen={this.props.open}>
                <ModalHeader>Incorrect Delivery Information</ModalHeader>
                <ModalBody>
                    {this.state.displayMsg}
                    <br /><br />
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" size="lg" active onClick={this.InfoIncorrectCancel}>Cancel</Button>
                  <Button color="primary" size="lg" active onClick={this.InfoIncorrectOk}>OK</Button>
                  <br />
                </ModalFooter>
            </Modal>
        )
    }
}
export default InfoIncorrectModal;
