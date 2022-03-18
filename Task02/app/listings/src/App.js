import './App.css';
import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      query: "",
      isEdit: false,
      editId: "",
      editName: "",
      editEmail: "",
      editBirthDate: ""
    };
    this.HandleTyping = this.HandleTyping.bind(this);
  }
  async HandleTyping(e){
    this.setState({
      query: e.target.value
    })
    const response = await axios.get(`http://localhost:5000/listings/search?q=` + e.target.value);
    const json = await response.data;
    this.setState({ users: json});
  }

  async HandleEditing(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async componentWillMount() {
    const response = await axios.get(`http://localhost:5000/listings`);
    const json = await response.data;
    this.setState({ users: json });
  }

  async btnEdit_OnClick(e,$id){
    this.setState({isEdit: true});

    const response = await axios.get(`http://localhost:5000/listings/getbyid?q=` + $id);
    const json = await response.data;

    this.setState({ editName: json[0].name });
    this.setState({ editEmail: json[0].email });
    this.setState({ editBirthDate: json[0].birthdate });
    this.setState({ editId: json[0]._id });
  }
  
  async btnSave_OnClick(e){
    const name = this.state.editName;
    const email = this.state.editEmail;
    const birthdate = this.state.editBirthDate;
    const id = this.state.editId;
    await axios.post('http://localhost:5000/listings/update', {
        id,
        name,
        email,
        birthdate
      }); 
  }

  render() {
    return (
      <div className="wrapper">
        <div>
          <h1>Search User</h1>
          <div>
              <input
                value={this.state.query} 
                onInput={e => this.HandleTyping(e)}
                type="text"
                id="header-search"
                placeholder="Search user"
                name="search-input" 
            />
          </div>
          <div className='result-wrap'>
            <table border>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>BirthDate</th>
                </tr>
              </thead>
              <tbody>
              {this.state.users.map((listing, index)=>
                <tr key={index}>
                  <td>
                    {listing.name}
                  </td>
                  <td>
                    {listing.email} 
                  </td>
                  <td>
                    {listing.birthdate} 
                  </td>
                  <td>
                    <button id="btnEdit"  onClick={e => this.btnEdit_OnClick(e,listing._id)} className="btn btn-edit">
                      Edit
                    </button>
                  </td>
                </tr>
                )}
              </tbody>
            </table>
            
          </div>
          {this.state.isEdit && (
            <div className='edit-wrap'>
              <h2>Edit user</h2>
              <div className='input-wrap'>
                <input 
                  value={this.state.editName} 
                  onInput={e => this.HandleEditing(e)}
                  type="text"
                  id="edit-name"
                  name="editName"
                />
                <input 
                  value={this.state.editEmail} 
                  onInput={e => this.HandleEditing(e)}
                  type="text"
                  id="edit-Email"
                  name="editEmail"
                />
                <input 
                  value={this.state.editBirthDate} 
                  onInput={e => this.HandleEditing(e)}
                  type="text"
                  id="edit-BirthDate"
                  name="editBirthDate"
                />
              </div>
              <div className='btn-wrap'>
                <button className='btn-save' onClick={e => this.btnSave_OnClick(e)} >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
