import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  sex: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [editableUserId, setEditableUserId] = useState<number | null>(null);
  const [newUser, setNewUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5137/api/Employee/GetAllEmployees');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Error fetching users:' + error);
    }
  };

  const handleEdit = (userId: number) => {
    setEditableUserId(userId);
  };

  const handleSave = async (user: User) => {
    if(!validateUser(user))
      return;
  
    try {
      const response = await fetch(`http://localhost:5137/api/Employee/UpdateEmployee?id=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        setEditableUserId(null);
        fetchUsers(); // Refresh the user list after saving
      } else {
        toast.error('Error saving user:' + response.statusText);
      }
    } catch (error) {
      toast.error('Error saving user:' + error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete the selected users?');
    
    if (confirmDelete) {
      try {
        // Delete each selected user individually
        await Promise.all(selectedUsers.map(async (userId) => {
          const response = await fetch(`http://localhost:5137/api/Employee/RemoveEmployee?id=${userId}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            toast.error('Error deleting user:' + response.statusText);
          }
        }));
        
        // Refresh the list after deletion
        fetchUsers();
        // Clear the user selection
        setSelectedUsers([]);
      } catch (error) {
        toast.error('Error deleting users:' + error);
      }
    }
  };
  
  const handleInputChange = (userId: number, field: keyof User, value: string | number) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, [field]: value };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleAddUser = () => {
    setNewUser({
      id: 0,
      firstName: '',
      lastName: '',
      age: 0,
      sex: 'M'
    });
  };

  const handleCancelAddUser = () => {
    setNewUser(null);
  };

  const handleSaveNewUser = async () => {
    if (!newUser)
      return;
    if(!validateUser(newUser))
      return;
  
    try {
      const response = await fetch('http://localhost:5137/api/Employee/AddEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        setNewUser(null);
        fetchUsers();
      } else {
        toast.error('Error adding user:' + response.statusText);
      }
    } catch (error) {
      toast.error('Error adding user:' + error);
    }
  };

  const validateUser = (user : User) => {
    if (!user.firstName.trim() || !user.lastName.trim()) {
      toast.error('First name and last name are mandatory.');
      return false;
    }
    if (user.age < 18 || user.age > 100) {
      toast.error('Age must be between 18 and 100.');
      return false;
    }
    return true;
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prevSelectedUsers => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter(id => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  return (
    <div id="listContainer">
     <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      />
      <div className='fixedTableContainer'>
        {users.length === 0 && !newUser ? (
          <p>No items in the list. Add new items.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Full Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newUser && (
                <tr>
                  <td></td>
                  <td>
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control mr-2" 
                        placeholder="Name"
                        value={newUser.firstName} 
                        onChange={e => setNewUser(prev => ({ ...prev!, firstName: e.target.value }))} 
                      />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Last name"
                        value={newUser.lastName} 
                        onChange={e => setNewUser(prev => ({ ...prev!, lastName: e.target.value }))} 
                      />
                    </div>
                  </td>
                  <td>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={newUser.age} 
                      onChange={e => setNewUser(prev => ({ ...prev!, age: parseInt(e.target.value) }))} 
                    />
                  </td>
                  <td>
                    <select 
                      className="form-control" 
                      value={newUser.sex || 'M'} 
                      onChange={e => setNewUser(prev => ({ ...prev!, sex: e.target.value.charAt(0) }))} 
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <button 
                        type="button" 
                        className="btn btn-dark"
                        onClick={handleSaveNewUser}
                      >
                        Save
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-dark"
                        onClick={handleCancelAddUser}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {users.map((user, index) => {
                const isEditable = editableUserId === user.id && !newUser;
                return (
                  <tr key={user.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                    <td className="align-middle text-center">
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input my-0"
                          style={{ transform: 'scale(1.5)' }}
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                        />
                      </div>
                    </td>
                    <td>
                      {isEditable ? (
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control mr-2" 
                            placeholder="Name"
                            value={user.firstName}
                            onChange={e => handleInputChange(user.id, 'firstName', e.target.value)} 
                          />
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Last name"
                            value={user.lastName} 
                            onChange={e => handleInputChange(user.id, 'lastName', e.target.value)} 
                          />
                        </div>
                      ) : (
                        `${user.firstName} ${user.lastName}` 
                      )}
                    </td>
                    <td>
                      {isEditable ? (
                        <input 
                          type="number" 
                          className="form-control" 
                          value={user.age} 
                          onChange={e => handleInputChange(user.id, 'age', parseInt(e.target.value))} 
                        />
                      ) : (
                        `${user.age} years` 
                      )}
                    </td>
                    <td>
                      {isEditable ? (
                        <select 
                          className="form-control" 
                          value={user.sex} 
                          onChange={e => handleInputChange(user.id, 'sex', e.target.value)} 
                        >
                          <option value="M">M</option>
                          <option value="F">F</option>
                        </select>
                      ) : (
                        user.sex
                      )}
                    </td>
                    <td className='btn-group'>
                      {isEditable ? (
                        <button className="btn btn-dark" onClick={() => handleSave(user)}>Save</button>
                      ) : (
                        <button className="btn btn-dark" onClick={() => handleEdit(user.id)}>Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className="d-flex justify-content-center">
        <div className='btn-group'>
          <button className="btn btn-dark" onClick={handleAddUser}>Add new entry</button>
          {selectedUsers.length > 0 && (
            <button className="btn btn-danger" onClick={handleDelete}>Delete selected</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserList;
