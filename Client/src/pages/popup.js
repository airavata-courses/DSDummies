import React from "react";
 
const Popup = props => {
  return (
    <div style = {{position: "fixed", background: "#00000050", width: "100%", height: "100vh" ,top: 0,left: 0}}>
      <div style = {{position: "relative", width: "70%" ,margin: "0 auto",  height: "auto",  maxHeight: "70vh", background: "#fff",borderRadius: "4px", padding: "20px", border: "1px solid #999", overflow: "auto"}}>
        <span style = {{content: 'x',cursor: "pointer", position: "fixed", background: "#ededed", width: "25px", height: "25px" ,borderRadius: "50%", lineHeight: "20px" ,textAlign: "center" , border: "1px solid #999" ,fontSize: "20px"}}
         onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  );
};
 
export default Popup;