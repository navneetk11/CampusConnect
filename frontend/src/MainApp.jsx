import { useState, useEffect } from "react";
import "./app.css";
import Login from "./Login";
import Dashboard from "./Dashboard";
import GroupDetail from "./GroupDetail";
import Profile from "./Profile";
import { useToast, ToastContainer } from "./Toast";

export default function MainApp() {

  const { toasts, addToast } = useToast();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("userId") || null);
  const [currentUsername, setCurrentUsername] = useState(() => localStorage.getItem("username") || "");
  const [myGroups, setMyGroups] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchCourseCode, setSearchCourseCode] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchMode, setSearchMode] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [department, setDepartment] = useState('');
  const [mode, setMode] = useState('');
  const [location, setLocation] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const createUser = async () => {
    try {
      const response = await fetch("https://campusconnect-8loz.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      setCurrentUser(data.user.id);
      setCurrentUsername(data.user.username);
      addToast("Account created! Welcome to CampusConnect 🎉", "success");
      setName("");
      setPassword("");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const loginUserFunc = async () => {
    try {
      const response = await fetch("https://campusconnect-8loz.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    if (token && userId) {
      setCurrentUser(userId);
      setCurrentUsername(username);
    }
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setToken("");
    setCurrentUser(null);
    setCurrentUsername("");
    setMyGroups([]);
  };

  const getUsers = async () => {
    try {
      const response = await fetch("https://campusconnect-8loz.onrender.com/api/users");
      const data = await response.json();
      setUsernames(data.data || []);
    } catch (error) {
      addToast("Error fetching users", "error");
    }
  };

  const getMyGroups = async () => {
    try {
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/users/${currentUser}`);
      const user = await res.json();
      let groups = user.data.groups;
      const groupData = await Promise.all(groups.map(c => getGroupInfo(c)));
      setMyGroups(groupData.filter(Boolean));
    } catch (error) {
      addToast("Error getting groups", "error");
    }
  };

  const getGroupInfo = async (groupId) => {
    try {
      const res = await fetch(`https://campusconnect-8loz.onrender.com/api/groups/getGroup/${groupId}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const searchGroups = async (params) => {
    const courseCode = params?.courseCode ?? searchCourseCode;
    const department = params?.department ?? searchDepartment;
    const mode = params?.mode ?? searchMode;
    try {
      const response = await fetch(
        `https://campusconnect-8loz.onrender.com/api/groups/search?courseCode=${courseCode}&department=${department}&mode=${mode}`
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

  const joinGroup = async (groupId) => {
    if (!currentUser) { addToast("Please log in first", "error"); return; }
    try {
      const response = await fetch(`https://campusconnect-8loz.onrender.com/api/groups/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ userId: currentUser })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to join");
      addToast(data.message || "Joined group successfully!", "success");
      getMyGroups();
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const createGroup = async (groupData) => {
    const payload = groupData || { title, courseCode, department, mode, location, members };
    try {
      const response = await fetch('https://campusconnect-8loz.onrender.com/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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