import React from 'react';

export default (props) => {
  const script = `<script>window.addEventListener && window.addEventListener("message", function(event){if (event.origin === "https://nyc-interviews.youcanbook.me"){document.getElementById("ycbmiframenyc-interviews").style.height = event.data + "px";}}, false);</script>`

  const iFrame = `<iframe src="https://nyc-interviews.youcanbook.me/?noframe=true&skipHeaderFooter=true" id="ycbmiframenyc-interviews" border:0px;background-color:transparent;" frameborder="0" allowtransparency="true"></iframe><script>window.addEventListener && window.addEventListener("message", function(event){if (event.origin === "https://nyc-interviews.youcanbook.me"){document.getElementById("ycbmiframenyc-interviews").style.height = event.data + "px";}}, false);</script>`
  return (
    <div>
      <iframe src="https://nyc-interviews.youcanbook.me/?noframe=true&skipHeaderFooter=true" onLoad={props.hideSpinner} id="ycbmiframenyc-interviews" frameBorder="0" allowtransparency="true"></iframe>
      <div dangerouslySetInnerHTML={{__html: script }} />
    </div>
    )
}
