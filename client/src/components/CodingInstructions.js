import React from 'react';


export default (props) => {

  function testPass(tests, index) {
    if (tests && tests[index] && tests[index].type === 'test-pass') { return '-pass' }
    return '';
  }

  return (
    <div className="instructions col">
      <h4 className="column-header">Instructions</h4>
      <ol className="progress-bar">
        <li className={`${testPass(props.tests, 0)}`}>First, declare a variable named <code>myArray</code> and assign it to an empty array.</li>
      <li className={`${testPass(props.tests, 1)}`}>Now populate <code>myArray</code> with two strings:<br></br>Put your full name in the first string, and your favorite color in the second.</li>
    <li className={`${testPass(props.tests, 2)}`}>Next, declare a function named <code>cutName</code>. It should expect a parameter <code>name</code>.</li>
  <li className={`${testPass(props.tests, 3)}`}><code>cutName</code> should return an array by breaking up the input string into individual words.
          <ul>
            <li><b>Example:</b> cutName("Douglas Crockford") should return ["Douglas", "Crockford"]</li>
            <li><b>Example:</b> cutName("John B. Smith") should return ["John", "B.", "Smith"]</li>
          </ul>
        </li>

        <li className={`${testPass(props.tests, 4)}`}>Declare a new variable named <code>myInfo</code> and assign it to an empty object literal.</li>
      <li className={`${props.allPassed ? "-pass" : ""}`}>Add the following three key-value pairs to <code>myInfo</code>:
          <ul>
            <li className={`${testPass(props.tests, 5)}`}>
              <b>Key:</b> <code>fullName</code><br />
              <b>Value:</b> The result of calling <code>cutName</code> on the name string within <code>myArray</code>.
            </li>
            <li className={`${testPass(props.tests, 6)}`}>
              <b>Key:</b> <code>favoriteColor</code><br />
              <b>Value:</b> The color within <code>myArray</code>.
            </li>
            <li className={`${testPass(props.tests, 7)}`}>
              <b>Key:</b> <code>github</code><br />
              <b>Value:</b>
                If you have a github handle, enter it here as a string.
                If not, set this to <code>null</code> instead.
            </li>
          </ul>
          </li>
      </ol>
    </div>
  )
}
