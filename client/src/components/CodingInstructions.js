import React from 'react';


export default (props) => {

  return (
    <div className="instructions col">
      <h4 className="column-header">Instructions</h4>
      <ol className="progress-bar">
        <li>First, declare a variable named <code>myArray</code> and assign it to an empty array.</li>
        <li>Now populate <code>myArray</code> with two strings:<br></br>Put your full name in the first string, and your Skype handle in the second.</li>
        <li>Next, declare a function named <code>cutName</code>. It should expect a parameter <code>name</code>.</li>
        <li><code>cutName</code> should return an array by breaking up the input string into individual words.
          <ul>
            <li><b>Example:</b> cutName("Douglas Crockford") should return ["Douglas", "Crockford"]</li>
            <li><b>Example:</b> cutName("John B. Smith") should return ["John", "B.", "Smith"]</li>
          </ul>
        </li>

        <li>Declare a new variable named <code>myInfo</code> and assign it to an empty object literal.</li>
        <li>Add the following three key-value pairs to <code>myInfo</code>:
          <ul>
            <li>
              <b>Key:</b> <code>fullName</code><br />
              <b>Value:</b> The result of calling <code>cutName</code> on the name string within <code>myArray</code>.
            </li>
            <li>
              <b>Key:</b> <code>skype</code><br />
              <b>Value:</b> The Skype handle within <code>myArray</code>.
            </li>
            <li>
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
