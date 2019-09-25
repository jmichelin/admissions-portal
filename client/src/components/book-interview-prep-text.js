import React from 'react';

export default () => {
  return (
    <div className="pre-question">
    <p>If you do not feel comfortable completing the following example prompt, you are probably not ready to attempt the Technical Interview:</p>
      <div>

        <span>Write the function detectNetwork:</span><br></br>
        <span>(1) detectNetwork should accept a string or a number for its cardNumber argument</span><br></br>
        <span>(2) detectNetwork should return the appropriate network string (or undefined if there's no match)</span><br></br>
        <span>Example: calling detectNetwork with a cardNumber value of "343456789012345" should return "American Express"</span><br></br>

          <pre>{`var cardData = [{
          network: 'Visa',       // card issuer (network)
          prefixes: ['4'],	 // beginning digits
          lengths: [13, 16, 19]  // lengths of card numbers
        },{
          network: 'Mastercard',
          prefixes: ['51', '52', '53', '54', '55'],
          lengths: [16]
        },{
          network: 'American Express',
          prefixes: ['34', '37'],
          lengths: [15]
        },{
          network: 'Diner\'s Club',
          prefixes: ['38', '39'],
          lengths: [14]
        }];

      function detectNetwork(cardNumber, cardData) {
        // your code here
      }`}</pre>
      </div>
    </div>
  )
}
