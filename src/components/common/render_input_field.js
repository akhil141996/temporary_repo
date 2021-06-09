import React from 'react';
import {FormGroup,Label,Input,FormText,FormFeedback,Row } from 'reactstrap';


const RenderInputField = ({ hint, input, label, type, meta: { touched, error }={}, ...inputProps }) => {
    inputProps = {...input, ...inputProps }
    let feedback = touched && error
    let status   = touched && error ? 'danger' :  ''
    let htmlId   = inputProps.id || inputProps.name

    return (
      <FormGroup color={status}><Row>

        {inputProps.required ? <div><span><small><font color="red">*</font></small></span>
                                    <Label className="col-sm-6" for={htmlId}>{label}</Label>
                              </div>
          : <Label className="col-sm-6" for={htmlId}>{label}</Label>}
        <Input className="col-sm-6" type={type || 'text'} id={htmlId} autoComplete="off" state={status} {...inputProps}/>
        {feedback ? <FormFeedback>{feedback}</FormFeedback> : ''}
        {hint ? <FormText color="muted">{hint}</FormText> : ''}
      </Row></FormGroup>
    )
  }

  export default RenderInputField;
