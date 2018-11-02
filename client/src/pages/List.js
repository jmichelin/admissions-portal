import React, { Component } from 'react';

class List extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    fetch('/auth')
    .then(response => response.json())
    .then(users => this.setState({users}))
  }

  render() {
    const { users } = this.state;

    return (
      <div className="App">
        <h1>List of Users</h1>
        {/* Check to see if any items are found*/}
        {users.length ? (
          <div>
            {/* Render the list of items */}
            {users.map((user) => {
              return(
                <div>
                  {user.first_name}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <h2>No Users Found</h2>
          </div>
        )
      }
      </div>
    );
  }
}

export default List;
