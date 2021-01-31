import React from 'react';
import {
       Page,
       Block,
       Button,
       Row,
       Col
        } from 'framework7-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBackspace} from '@fortawesome/free-solid-svg-icons';
import "./Verification/style.css";
//* TODO
// page-content block p

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first:"",
            second:"",
            third:"",
            fourth:"",
            i: 0
        }
        this.changeCurrentDigit = this.changeCurrentDigit.bind(this);
        this.delCurrentDigit = this.delCurrentDigit.bind(this);
    }
    changeCurrentDigit(val) {
        let i = this.state.i;
        
        if(i == 4) {
           return;
        }
        i++;
        let {first,second,third,fourth} = this.state;
        switch(i){
            case 1:
              first = val;
              break;
            case 2:
              second = val;
              break;
            case 3:
               third = val;
               break;
            case 4:
                fourth = val;
                break;
            
        }
        this.setState({
            i, first,second,third,fourth
        })
    }
    delCurrentDigit() {
        let i = this.state.i;
        if( i == 0) return;
        
        let {first,second,third,fourth} = this.state;
        switch(i){
            case 1:
              first = "";
              break;
            case 2:
              second = "";
              break;
            case 3:
               third = "";
               break;
            case 4:
                fourth = "";
                break;
            
        }
        i--;
        this.setState({
            i, first,second,third,fourth
        })
    }
    render() {
        return (
            <Page themeDark>
            
                <Block>
                <Row className="justify-content-center">  
                    <p>Please enter the OTP we have sent on your mobile number</p>
                </Row>
                </Block>
                <Block>
                
                   <Row  className="justify-content-center">
        <div className="otp-digit display-flex align-items-center justify-content-center">
           
           <div className="otp-digit-inner">
           {this.state.first}
               </div> 
               
            </div>
        <div className="otp-digit display-flex align-items-center justify-content-center">
        <div className="otp-digit-inner">
            {this.state.second}
            </div>
            </div>
                      <div className="otp-digit display-flex align-items-center justify-content-center">
                      <div className="otp-digit-inner">
                          {this.state.third}
                          </div>
                          </div>
                      <div className="otp-digit display-flex align-items-center justify-content-center">
                      <div className="otp-digit-inner">
                          {this.state.fourth}
                          </div>
                          </div>
                   </Row>
                    </Block>
                    
               <form name="otp-verification" action="#" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="otp" readonly/>
                </form>
                <Block >
                  <Row className="justify-content-center">
                  <p>Didn`t receive the OTP</p>
                  </Row>
                    <Row className="justify-content-center">
                        <Col width="50" medium="15">
                    <Button round fill color="blue">Resend</Button>
                    </Col>
                    </Row>
                    </Block>
                <div class="keypad">
                    
                    <Row className="justify-content-center">
                        <Col width="20">
                           <Button color="white" onClick={()=>this.changeCurrentDigit(1)}>1</Button>
                        </Col>
                        <Col width="20">
                           <Button color="white" onClick={()=>this.changeCurrentDigit(2)}>2</Button>
                        </Col>
                        <Col width="20">
                           <Button color="white" onClick={()=>this.changeCurrentDigit(3)}>3</Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                       <Col width="20">
                           <Button color="white" onClick={()=>this.changeCurrentDigit(4)}>4</Button>
                        </Col>
                        <Col width="20">
                           <Button color="white" onClick={()=>this.changeCurrentDigit(5)}>5</Button>
                        </Col>
                        <Col width="20">
                           <Button color="white" onClick={()=>this.changeCurrentDigit(6)}>6</Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                       <Col width="20">
                           <Button color="white" onClick={()=>this.changeCurrentDigit(7)}>7</Button>
                        </Col>
                        <Col width="20">
                           <Button color="white" onClick={()=>this.changeCurrentDigit(8)}>8</Button>
                        </Col>
                        <Col width="20">
                           <Button color="white" onClick={()=>this.changeCurrentDigit(9)}>9</Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                       <Col width="20">
                           <Button color="white"></Button>
                        </Col>
                        <Col width="20">
                           <Button color="white" onClick={()=>this.changeCurrentDigit(0)}>0</Button>
                        </Col>
                        <Col width="20">
                           <Button color="white" onClick={this.delCurrentDigit}><FontAwesomeIcon icon={faBackspace} /></Button>
                        </Col>
                    </Row>
                </div>
               
            </Page>
            
        )
    }
}