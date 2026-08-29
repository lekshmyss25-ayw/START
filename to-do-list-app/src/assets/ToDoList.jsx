import React, { useState } from 'react';
//import opt2 from '/schedule-1.jpg';

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    
    
    const [editingIndex, setEditingIndex] = useState(-1);
    const [editingText, setEditingText] = useState("");

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== "") {
            setTasks(t => [...t, { text: newTask, completed: false }]);
            setNewTask("");
        }
    }

    function deleteTask(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = 
            [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = 
            [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function handleCheckboxChange(index) {
        const updatedTasks = [...tasks];
        updatedTasks[index] = { 
            ...updatedTasks[index], 
            completed: !updatedTasks[index].completed 
        };
        setTasks(updatedTasks);
    }  

    function startEdit(index) {
        setEditingIndex(index);
        setEditingText(tasks[index].text);
    }
    
    function saveEdit(index) {
        if (editingText.trim() !== "") {
            const updatedTasks = [...tasks];
            updatedTasks[index] = { ...updatedTasks[index], text: editingText };
            setTasks(updatedTasks);
            setEditingIndex(-1); 
        }
    }
   
    function cancelEdit() {
        setEditingIndex(-1);
    }

   
    return (
    
        <div className="to-do-list">
            
            <div className="input-container" >
                <div>
                <br></br>
                <h1>Get Started with Your New List.</h1>
                <h1>it's time !!</h1></div>
                <input
                    type="text"
                    placeholder="Enter a task"
                    value={newTask}
                    onChange={handleInputChange}
                  
                />
                <button className="add-button" onClick={addTask}> + </button>
            </div>

            <ol>
                {tasks.map((task, index) => (
                    <li key={index} style={{ opacity: task.completed ? 0.75 : 1, borderBottom: task.completed ? "5px solid #28a745" : "5px solid #fd7e14" }}>
                        <div><span 
                            className="status-badge"
                            style={{
                                marginLeft: "10px",
                                marginRight: "10px",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                color: "#fff",
                                backgroundColor: task.completed ? "#28a745" : "#fd7e14"
                            }}
                        >
                            {task.completed ? "COMPLETED" : "PENDING"}
                        </span>
                        </div>
                    
                        <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => handleCheckboxChange(index)} 
                        />
                        
                        {editingIndex === index ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editingText} 
                                    onChange={(e) => setEditingText(e.target.value)} 
                                />
                                <button className="save-button" onClick={() => saveEdit(index)}>Save</button>
                                <button className="cancel-button" onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className="text">{task.text}</span>
                                <button className="edit-button" onClick={() => startEdit(index)}>Edit</button>
                                <button className="delete-button" onClick={() => deleteTask(index)}>Delete</button>
                                <button className="move-button" onClick={() => moveTaskUp(index)}>⬆️</button>
                                <button className="move-button" onClick={() => moveTaskDown(index)}>⬇️</button>
                            </>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    
    );
}

export default ToDoList;

