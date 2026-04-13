import { useState, useEffect } from "react";
import "./app.css";
import Login from "./Login";
import Dashboard from "./Dashboard";
import GroupDetail from "./GroupDetail";
import Profile from "./Profile";
import { useToast, ToastContainer } from "./Toast";

function App() {

  const { toasts, addToast } = useToast();

  // SIGNUP STATES
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // TOKEN
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // LOGIN STATES
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // CURRENT USER
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("userId") || null); //On refresh, currentUser is immediately set from localStorage
  const [currentUsername, setCurrentUsername] = useState(() => localStorage.getItem("username") || "");
  const [myGroups, setMyGroups] = useState([]);

  // USERS LIST
  const [usernames, setUsernames] = useState([]);

  // SEARCH STATES
  const [searchResults, setSearchResults] = useState([]);
  const [searchCourseCode, setSearchCourseCode] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchMode, setSearchMode] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  // GROUP CREATION STATES
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [department, setDepartment] = useState('');
  const [mode, setMode] = useState('');
  const [location, setLocation] = useState('');
  const [members, setMembers] = useState([]);

  // NAVIGATION STATES
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // CREATE USER (SIGNUP)
  const createUser = async () => {
    try {
      const response = await fetch("http://localhost:2222/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id); //For persistent login - updated data --> user
      localStorage.setItem("username", data.user.username);
      setCurrentUser(data.user.id);
      setCurrentUsername(data.user.username);
      addToast("Account created! Welcome to StudySphere 🎉", "success");

      setName("");
      setPassword("");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  // LOGIN USER
  const loginUserFunc = async () => {
    try {
      const response = await fetch("http://localhost:2222/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id); //For persistent login - updated data --> user
      localStorage.setItem("username", data.user.username);
      setCurrentUser(data.user.id);
      setCurrentUsername(data.user.username);
      addToast(`Welcome back, ${data.user.username}! 👋`, "success");
      setLoginUsername("");
      setLoginPassword("");
    } catch (error) {
      addToast(error.message, "error");
    }
  };  

  //AUTO-LOGIN
   useEffect(() => {  
   const token = localStorage.getItem("token");
   const userId = localStorage.getItem("userId");
   const username = localStorage.getItem("username");

  if (token && userId) {
    setCurrentUser(userId);  //restores session when app loads
    setCurrentUsername(username);
  }
}, []);
  

  // LOGOUT
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setToken("");
    setCurrentUser(null);
    setCurrentUsername("");
    setMyGroups([]);
  };

  // GET USERS
  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:2222/api/users");
      const data = await response.json();
      setUsernames(data.data || []);
    } catch (error) {
      addToast("Error fetching users", "error");
    }
  };

  //GET current user's groups
  const getMyGroups = async () => {
    try {
      const res = await fetch(`http://localhost:2222/api/users/${currentUser}`);
      const user = await res.json();

      let groups = user.data.groups;
      const groupData = await Promise.all(groups.map(c => getGroupInfo(c)));
      // Filter out nulls — handles deleted groups that are still in user.groups
      setMyGroups(groupData.filter(Boolean));
    } catch (error) {
      console.error(error);
      addToast("Error getting groups", "error");
    }
  }

  //GET a given group's info
  const getGroupInfo = async (groupId) => {
    try {
      const res = await fetch(`http://localhost:2222/api/groups/getGroup/${groupId}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      return null; // group not found (deleted from DB) — return null so we can filter it out
    } catch (error) {
      console.error("Error Getting Group info", error);
      return null;
    }
  }

  // SEARCH GROUPS
  const searchGroups = async (params) => {
    const courseCode = params?.courseCode ?? searchCourseCode;
    const department = params?.department ?? searchDepartment;
    const mode = params?.mode ?? searchMode;
    try {
      const response = await fetch(
        `http://localhost:2222/api/groups/search?courseCode=${courseCode}&department=${department}&mode=${mode}`
      );
      const data = await response.json();
      setSearchMessage("");
      if (!response.ok) throw new Error(data.message || "Search failed");
      setSearchResults(data.data);
      if (data.data.length === 0) addToast("No groups found. Try different filters.", "info");
    } catch (error) {
      setSearchMessage("Please provide at least one search filter");
      addToast("Please provide at least one search filter", "error");
    }
  };

  // JOIN GROUP
  const joinGroup = async (groupId) => {
    if (!currentUser) {
      addToast("Please log in first", "error");
      return;
    }
    try {
      const response = await fetch(`http://localhost:2222/api/groups/${groupId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId: currentUser })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to join");
      addToast(data.message || "Joined group successfully!", "success");
      getMyGroups(); // auto-refresh My Groups list
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  // CREATE GROUP
  const createGroup = async (groupData) => {
    const payload = groupData || { title, courseCode, department, mode, location, members };
    try {
      const response = await fetch('http://localhost:2222/api/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...payload, leader: currentUsername })
      });
      if (!response.ok) throw new Error('Failed to create group');
      const data = await response.json();
      addToast(data.message || 'Group created successfully!', "success");
      return { success: true };
    } catch (error) {
      addToast(error.message, "error");
      return { success: false };
    }
  };

  return (
    <div>
      <ToastContainer toasts={toasts} removeToast={() => {}} />

      {!currentUser ? (
        <Login
          loginUsername={loginUsername}
          loginPassword={loginPassword}
          setLoginUsername={setLoginUsername}
          setLoginPassword={setLoginPassword}
          loginUserFunc={loginUserFunc}
          createUser={createUser}
          name={name}
          password={password}
          setName={setName}
          setPassword={setPassword}
        />
      ) : selectedGroup ? (
        <GroupDetail
          group={selectedGroup}
          currentUser={currentUser}
          currentUsername={currentUsername}
          token={token}
          onBack={() => setSelectedGroup(null)}
          onJoin={joinGroup}
          addToast={addToast}
        />
      ) : selectedProfile ? (
        <Profile
          currentUser={currentUser}
          onBack={() => setSelectedProfile(null)}
          addToast={addToast}
        />
      ) : (
        <Dashboard
          getUsers={getUsers}
          usernames={usernames}
          currentUsername={currentUsername} 
          myGroups={myGroups}
          getMyGroups={getMyGroups}
          searchGroups={searchGroups}
          searchResults={searchResults}
          setSearchCourseCode={setSearchCourseCode}
          setSearchDepartment={setSearchDepartment}
          setSearchMode={setSearchMode}
          joinGroup={joinGroup}
          setTitle={setTitle}
          setCourseCode={setCourseCode}
          setDepartment={setDepartment}
          setMode={setMode}
          setLocation={setLocation}
          createGroup={createGroup}
          onViewGroup={(group) => setSelectedGroup(group)}
          onViewProfile={() => setSelectedProfile(currentUser)}
          onLogout={logoutUser}
          currentUser={currentUser}
          searchMessage={searchMessage}
          addToast={addToast}
        />
      )}
    </div>
  );
}

export default App;